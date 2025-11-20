
const {mysql} = require("mysql2/promise");
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
        const trueDocs = await db.collection("trueregister").find({}).toArray();
        const disiDocs = await db.collection("disisfine").find({}).toArray();

        for (const doc of liveDocs) {
            await migrateDoc(mysqlConn, doc, "LIVETICKET");
        }

        for (const doc of trueDocs) {
            await migrateDoc(mysqlConn, doc, "TRUEREGISTER");
        }

        for (const doc of disiDocs) {
            await migrateDoc(mysqlConn, doc, "DISISFINE");
        }

        console.log("Migration terminée");
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

    const [[lastId]] = await mysqlConn.execute(
        `SELECT LAST_INSERT_ID() AS id;`
    );

    const eventId = lastId.id;

    for (const a of normalized.attendees) {
        await mysqlConn.execute(
            `CALL add_attendee(?, ?, ?);`,
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
                when: a.when
            }))
        };
    }

    if (format === "TRUEREGISTER") {
        const e = doc.results[0].event;
        return {
            name: e.event_name,
            start: e.event_begin,
            end: e.event_finish,
            location: e.event_where,
            max: null,
            attendees: (doc.results[0].attendees || []).map(a => ({
                fn: a.attendee_1,
                ln: a.attendee_2
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
                ln: a[1],
                when: a[2]
            }))
        };
    }

    throw new Error("Format inconnu");
}

main();
