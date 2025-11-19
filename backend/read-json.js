const readJsonFile = () => {

    const filePath = process.argv[2];
    if (!filePath) {
        console.error("Veuillez ajouter un fichier JSON en paramètre. Exemple: .node read-json.js data.json");
        process.exit(1);
    }

    try {
        const raw = require("fs").readFileSync(filePath, "utf-8");
        return JSON.parse(raw);
    } catch (error) {
        console.error(error.message);
    }
}

const insertInMongoDB = (json_data) => {
    let Mongodb = require('mongodb').MongoClient;

    Mongodb.connect("mongodb://localhost:27017/", function (err, db) {
        if (err) throw err;
        let dbo = db.db("mydb");

        json_data.forEach(item => {
            dbo.collection("events").insertOne(item, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
            });
        });

        db.close();
    });
}


insertInMongoDB(readJsonFile())
