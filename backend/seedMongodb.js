const {MongoClient} = require('mongodb');

const config = {
    username: process.env.MONGO_USERNAME || 'admin',
    password: process.env.MONGO_PASSWORD || 'adminpassword',
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || '27017',
    database: process.env.MONGO_DATABASE || 'events_db'
};

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

const insertInMongoDB = async (json_data) => {
    const uri = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/?authSource=admin`;

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log(`Connecté à MongoDB sur ${config.host}:${config.port}`);

        const db = client.db(config.database);
        const collection = db.collection("events");

        let dataToInsert;
        if (Array.isArray(json_data)) {
            dataToInsert = json_data;
        } else if (json_data.results && Array.isArray(json_data.results)) {
            dataToInsert = json_data.results;
        } else {
            dataToInsert = [json_data];
        }

        const result = await collection.insertMany(dataToInsert);
        console.log(`${result.insertedCount} document(s) inséré(s) dans la base '${config.database}', collection 'events'`);

    } catch (err) {
        console.error("Erreur lors de l'insertion:", err.message);
        process.exit(1);
    } finally {
        await client.close();
        console.log("Connexion fermée");
    }
}

(async () => {
    const jsonData = readJsonFile();
    if (jsonData) {
        await insertInMongoDB(jsonData);
    }
})()
