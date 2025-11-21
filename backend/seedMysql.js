
const mysql = require("mysql2/promise");
const {MongoClient} = require("mongodb");
const dotenv = require("dotenv");


dotenv.config();

const mysqlConfig = {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

const config = {
    username: process.env.MONGO_USERNAME || 'admin',
    password: process.env.MONGO_PASSWORD || 'adminpassword',
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || '27017',
    database: process.env.MONGO_DATABASE || 'events_db'
};


const uri = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/?authSource=admin`;
const mongoClient = new MongoClient(uri);
const mongoDbName = process.env.MONGO_DATABASE;

async function main() {
    
    const mysqlConn = await mysql.createConnection(mysqlConfig);
    try {
        await mongoClient.connect();
        const db = mongoClient.db(mongoDbName);

        const liveDocs = await db.collection("liveticket").find({}).toArray();
        const trueDocs = await db.collection("truegister").find({}).toArray();
        const disiDocs = await db.collection("disisfine").find({}).toArray();

        for (const doc of liveDocs) {
            await migrateDoc(mysqlConn, doc, "LIVETICKET");
        }

        for (const doc of trueDocs) {
            await migrateDoc(mysqlConn, doc, "TRUEGISTER");
        }

        for (const doc of disiDocs) {
            await migrateDoc(mysqlConn, doc, "DISISFINE");
        }

    } catch (err) {
        console.error("Erreur :", err);
    } finally {
        await mongoClient.close();
        await mysqlConn.end();
    }
}

async function migrateDoc(mysqlConn, doc, format) {
    const normalized = formatDocument(doc, format);
        await mysqlConn.execute(
        `CALL create_events(?, ?, ?, ?, ?);`,
        [
            normalized.name,
            normalized.start,
            normalized.end,
            normalized.location,
            normalized.max
        ]
    );
   

    const [rows] = await mysqlConn.execute(
        `SELECT id FROM event WHERE name = ? ORDER BY id DESC LIMIT 1;`,
        [normalized.name]
    );

    if (rows.length === 0) {
        console.error("Aucun event trouvé pour", normalized.name);
        return;
    }

    const eventId = rows[0].id;

    for (const a of normalized.attendees) {
        await mysqlConn.execute(
            `CALL create_attendee(?, ?, ?);`,
            [eventId, a.fn, a.ln]
        );
    }
}

function formatDocument(doc, format) {
    if (format === "LIVETICKET") {
        return {
            name: doc.event,
            start: doc.start,
            end: doc.end,
            max: doc.max,
            location: doc.where,
            attendees: (doc.attendees || []).map(a => ({
                fn: a.fn,
                ln: a.ln,
            }))
        };
    }

    if (format === "TRUEGISTER") {
        const e = doc
        return {
            name: e.event.event_name,
            start: e.event.event_begin,
            end: e.event.event_finish,
            location: e.event.event_where,
            max: e.event.max ? e.event.max: 0,
            attendees: (e.attendees || []).map(a => ({
                fn: a.attendee_1,
                ln: a.attendee_2,
            }))
        };
    }

    if (format === "DISISFINE") {
        const rawAttendees = JSON.parse(doc.attendees || "[]");

        return {
            name: doc.e_name,
            start: doc.e_start,
            end: doc.e_finish,
            location: doc.e_location,
            max: doc.e_attendees_max,
            attendees: rawAttendees.map(a => ({
                fn: a[0],
                ln: a[1]
            }))
        };
    }

    throw new Error("Format inconnu");
}

main();
