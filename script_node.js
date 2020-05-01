require('dotenv').config()
const {GoogleSpreadsheet} = require('google-spreadsheet');
// const creds = require('./papillotebot-199023-83905358f43d.json'); // the file saved above
const doc = new GoogleSpreadsheet('1HSpvx8jLMY76B0qX-IX6slmhbQn-5RPScapDPMWqHS0');
document.getElementById("search").onclick = async function searchWord() {
    // await doc.useServiceAccountAuth(creds);
    console.log("GOOGLE_PRIVATE_KEY")
    await doc.useServiceAccountAuth({
        client_email: "GOOGLE_SERVICE_ACCOUNT_EMAIL",
        private_key: "GOOGLE_PRIVATE_KEY",
    });
    await doc.loadInfo();
    const dictionnarySheet = doc.sheetsByIndex[0];
    const rows = await dictionnarySheet.getRows();
    await dictionnarySheet.loadCells();
    let matchWord = null
    let startingWords = []
    let endingWords = []
    let containingWords = []
    let searchValue = document.getElementById("mot").value
    let test = searchValue
    let resultText = ""
    if (test.replace(" ","") === "") {
        searchValue = ""
    }
    searchValue.trim()
    for (let index = 2; index < rows.length; index++) {
        const row = rows[index];
        let rowInfo = {
            row: row.rowNumber - 1,
            atäpa: dictionnarySheet.getCell(row.rowNumber - 1, 0).value,
            noun: dictionnarySheet.getCell(row.rowNumber - 1, 1).value,
            verb: dictionnarySheet.getCell(row.rowNumber - 1, 2).value,
            modifier: dictionnarySheet.getCell(row.rowNumber - 1, 3).value,
            time: dictionnarySheet.getCell(row.rowNumber - 1, 4).value
        }
        if (searchValue === rowInfo.atäpa
            || (searchValue === "a" + rowInfo.atäpa && rowInfo.verb !== null) || (searchValue === "i" + rowInfo.atäpa && rowInfo.modifier !== null)) {
            matchWord = rowInfo;
            continue;
        } else if (rowInfo.atäpa.startsWith(searchValue)
        || (("a" + rowInfo.atäpa).startsWith(searchValue) && rowInfo.verb !== null) || (("i" + rowInfo.atäpa).startsWith(searchValue) && rowInfo.modifier !== null)) {
            startingWords.push(rowInfo)
            continue;
        } else if (rowInfo.atäpa.endsWith(searchValue) 
        || (("a" + rowInfo.atäpa).endsWith(searchValue) && rowInfo.verb !== null) || (("i" + rowInfo.atäpa).endsWith(searchValue) && rowInfo.modifier !== null)) {
            endingWords.push(rowInfo)
            continue;
        } else if (rowInfo.atäpa.includes(searchValue)
        || (("a" + rowInfo.atäpa).includes(searchValue) && rowInfo.verb !== null) || (("i" + rowInfo.atäpa).includes(searchValue) && rowInfo.modifier !== null)) {
            containingWords.push(rowInfo)
            continue;
        } else {
        }
    }

    
    if (matchWord !== null) {
        resultText = resultText + "Mots correspondants à la recherche :\n\n"
        if (matchWord.noun !== null) {
            resultText = resultText + matchWord.atäpa + " (n.) = " + matchWord.noun + "\n"
        }
        if (matchWord.verb !== null) {
            resultText = resultText + "a" + matchWord.atäpa + " (v.) = " + matchWord.verb + "\n"
        }
        if (matchWord.modifier !== null) {
            resultText = resultText + "i" + matchWord.atäpa + " (m.) = " + matchWord.modifier + "\n"
        }
        if (matchWord.time !== null) {
            resultText = resultText + matchWord.atäpa + " (t.) = " + matchWord.time + "\n"
        }
        resultText = resultText + "\n\n\n"
    }
    resultText = resultText + "Mots commençant par la recherche : \n"
    for (let index = 0; index < startingWords.length; index++) {
        const word = startingWords[index];
        if (word.noun === null && word.verb === null && word.modifier === null && word.time === null) {continue;}
        resultText = resultText + "\n"
        if (word.noun !== null) {
            resultText = resultText + word.atäpa + " (n.) = " + word.noun + "\n"
        }
        if (word.verb !== null) {
            resultText = resultText + "a" + word.atäpa + " (v.) = " + word.verb + "\n"
        }
        if (word.modifier !== null) {
            resultText = resultText + "i" + word.atäpa + " (m.) = " + word.modifier + "\n"
        }
        if (word.time !== null) {
            resultText = resultText + word.atäpa + " (t.) = " + word.time + "\n"
        }
    }
    resultText = resultText + "\n\n\n"
    resultText = resultText + "Mots se finissant par la recherche : \n"
    for (let index = 0; index < endingWords.length; index++) {
        const word = endingWords[index];
        if (word.noun === null && word.verb === null && word.modifier === null && word.time === null) {continue;}
        resultText = resultText + "\n"
        if (word.noun !== null) {
            resultText = resultText + word.atäpa + " (n.) = " + word.noun + "\n"
        }
        if (word.verb !== null) {
            resultText = resultText + "a" + word.atäpa + " (v.) = " + word.verb + "\n"
        }
        if (word.modifier !== null) {
            resultText = resultText + "i" + word.atäpa + " (m.) = " + word.modifier + "\n"
        }
        if (word.time !== null) {
            resultText = resultText + word.atäpa + " (t.) = " + word.time + "\n"
        }
    }
    resultText = resultText + "\n\n\n"
    resultText = resultText + "Mots contenant la recherche :"
    for (let index = 0; index < containingWords.length; index++) {
        const word = containingWords[index];
        if (word.noun === null && word.verb === null && word.modifier === null && word.time === null) {continue;}
        resultText = resultText + "\n"
        if (word.noun !== null) {
            resultText = resultText + word.atäpa + " (n.) = " + word.noun + "\n"
        }
        if (word.verb !== null) {
            resultText = resultText + "a" + word.atäpa + " (v.) = " + word.verb + "\n"
        }
        if (word.modifier !== null) {
            resultText = resultText + "i" + word.atäpa + " (m.) = " + word.modifier + "\n"
        }
        if (word.time !== null) {
            resultText = resultText + word.atäpa + " (t.) = " + word.time + "\n"
        }
    }
    document.getElementById("result").innerText = resultText
}