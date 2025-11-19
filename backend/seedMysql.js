import mysql from "mysql2/promise";

const mysqlConfig = {
    host: "",
    user: "",
    password: "",
    database: ""
};

const mysqlConn = await mysql.createConnection(mysqlConfig);

try {

    const docs = [];

    for (const doc of docs) {

        const normalized = formatDocument(doc, format);

        await mysqlConn.query(
            `CALL create_events(?, ?, ?, ?, ?);`,
            [
                normalized.name,
                normalized.start,
                normalized.end,
                normalized.location,
                normalized.max
            ]
        );


        const [[lastId]] = await mysqlConn.query(
            `SELECT LAST_INSERT_ID() AS id;`
        );

        const eventId = lastId.id;
        for (const a of normalized.attendees) {

            await mysqlConn.query(
                `CALL add_attendee(?, ?, ?);`,
                [eventId, a.fn, a.ln]
            );

        }

        console.log("✔ Importé :", normalized.name);
    }

} catch (err) {
    console.error("Erreur :", err);
} finally {
    await mysqlConn.end();
}


function formatDocument(doc, format) {

    if (format == "LIVETICKET") {
        return {
            name: doc.event,
            start: doc.start,
            end: doc.end,
            max: doc.max,
            location: doc.where,
            attendees: doc.attendees.map(a => ({
                fn: a.fn,
                ln: a.ln,
                when: a.when
            }))
        };
    }

    if (format == "TRUEREGISTER") {
        const e = doc.results[0].event;
        return {
            name: e.event_name,
            start: e.event_begin,
            end: e.event_finish,
            location: e.event_where,
            max: null,
            attendees: doc.results[0].attendees.map(a => ({
                fn: a.attendee_1,
                ln: a.attendee_2,
            }))
        };
    }

    if (format == "DISIFINE") {
        const rawAttendees = JSON.parse(doc.attendees);

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

    throw new Error("Format Mongo inconnu : " + JSON.stringify(doc));
}
