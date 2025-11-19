
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

console.log(readJsonFile());

