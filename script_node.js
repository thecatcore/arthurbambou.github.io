require('dotenv').config()
const {GoogleSpreadsheet} = require('google-spreadsheet');
// const creds = require('./papillotebot-199023-83905358f43d.json'); // the file saved above
const doc = new GoogleSpreadsheet('1HSpvx8jLMY76B0qX-IX6slmhbQn-5RPScapDPMWqHS0');
document.getElementById("search").onclick = async function searchWord() {
    // await doc.useServiceAccountAuth(creds);
    await doc.useServiceAccountAuth({
        client_email: "GOOGLE_SERVICE_ACCOUNT_EMAIL",
        private_key: "GOOGLE_PRIVATE_KEY",
    });
    await doc.loadInfo();
    const dictionnarySheet = doc.sheetsByIndex[0];
    const rows = await dictionnarySheet.getRows();
    await dictionnarySheet.loadCells();
    
    let atäpaDictionnary = {
        matchWord: null,
        startingWords: [],
        endingWords: [],
        containingWords: [],
        resultText: ""
    }

    let frenchDictionnary = {
        matchWord: null,
        startingWords: [],
        endingWords: [],
        containingWords: [],
        resultText: ""
    }

    let searchValue = document.getElementById("mot").value
    let test = searchValue
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
            atäpaDictionnary.matchWord = rowInfo;
            continue;
        } else if (rowInfo.atäpa.startsWith(searchValue)
        || (("a" + rowInfo.atäpa).startsWith(searchValue) && rowInfo.verb !== null) || (("i" + rowInfo.atäpa).startsWith(searchValue) && rowInfo.modifier !== null)) {
            atäpaDictionnary.startingWords.push(rowInfo)
            continue;
        } else if (rowInfo.atäpa.endsWith(searchValue) 
        || (("a" + rowInfo.atäpa).endsWith(searchValue) && rowInfo.verb !== null) || (("i" + rowInfo.atäpa).endsWith(searchValue) && rowInfo.modifier !== null)) {
            atäpaDictionnary.endingWords.push(rowInfo)
            continue;
        } else if (rowInfo.atäpa.includes(searchValue)
        || (("a" + rowInfo.atäpa).includes(searchValue) && rowInfo.verb !== null) || (("i" + rowInfo.atäpa).includes(searchValue) && rowInfo.modifier !== null)) {
            atäpaDictionnary.containingWords.push(rowInfo)
            continue;
        } else {
        }
    }

    
    if (atäpaDictionnary.matchWord !== null) {
        atäpaDictionnary.resultText = atäpaDictionnary.resultText + "Mots correspondants à la recherche :\n\n"
        if (atäpaDictionnary.matchWord.noun !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + atäpaDictionnary.matchWord.atäpa + " (n.) = " + atäpaDictionnary.matchWord.noun + "\n"
        }
        if (atäpaDictionnary.matchWord.verb !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + "a" + atäpaDictionnary.matchWord.atäpa + " (v.) = " + atäpaDictionnary.matchWord.verb + "\n"
        }
        if (atäpaDictionnary.matchWord.modifier !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + "i" + atäpaDictionnary.matchWord.atäpa + " (m.) = " + atäpaDictionnary.matchWord.modifier + "\n"
        }
        if (atäpaDictionnary.matchWord.time !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + atäpaDictionnary.matchWord.atäpa + " (t.) = " + atäpaDictionnary.matchWord.time + "\n"
        }
        atäpaDictionnary.resultText = atäpaDictionnary.resultText + "\n\n\n"
    }
    atäpaDictionnary.resultText = atäpaDictionnary.resultText + "Mots commençant par la recherche : \n"
    for (let index = 0; index < atäpaDictionnary.startingWords.length; index++) {
        const word = atäpaDictionnary.startingWords[index];
        if (word.noun === null && word.verb === null && word.modifier === null && word.time === null) {continue;}
        atäpaDictionnary.resultText = atäpaDictionnary.resultText + "\n"
        if (word.noun !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + word.atäpa + " (n.) = " + word.noun + "\n"
        }
        if (word.verb !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + "a" + word.atäpa + " (v.) = " + word.verb + "\n"
        }
        if (word.modifier !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + "i" + word.atäpa + " (m.) = " + word.modifier + "\n"
        }
        if (word.time !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + word.atäpa + " (t.) = " + word.time + "\n"
        }
    }
    atäpaDictionnary.resultText = atäpaDictionnary.resultText + "\n\n\n"
    atäpaDictionnary.resultText = atäpaDictionnary.resultText + "Mots se finissant par la recherche : \n"
    for (let index = 0; index < atäpaDictionnary.endingWords.length; index++) {
        const word = atäpaDictionnary.endingWords[index];
        if (word.noun === null && word.verb === null && word.modifier === null && word.time === null) {continue;}
        atäpaDictionnary.resultText = atäpaDictionnary.resultText + "\n"
        if (word.noun !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + word.atäpa + " (n.) = " + word.noun + "\n"
        }
        if (word.verb !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + "a" + word.atäpa + " (v.) = " + word.verb + "\n"
        }
        if (word.modifier !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + "i" + word.atäpa + " (m.) = " + word.modifier + "\n"
        }
        if (word.time !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + word.atäpa + " (t.) = " + word.time + "\n"
        }
    }
    atäpaDictionnary.resultText = atäpaDictionnary.resultText + "\n\n\n"
    atäpaDictionnary.resultText = atäpaDictionnary.resultText + "Mots contenant la recherche :"
    for (let index = 0; index < atäpaDictionnary.containingWords.length; index++) {
        const word = atäpaDictionnary.containingWords[index];
        if (word.noun === null && word.verb === null && word.modifier === null && word.time === null) {continue;}
        atäpaDictionnary.resultText = atäpaDictionnary.resultText + "\n"
        if (word.noun !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + word.atäpa + " (n.) = " + word.noun + "\n"
        }
        if (word.verb !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + "a" + word.atäpa + " (v.) = " + word.verb + "\n"
        }
        if (word.modifier !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + "i" + word.atäpa + " (m.) = " + word.modifier + "\n"
        }
        if (word.time !== null) {
            atäpaDictionnary.resultText = atäpaDictionnary.resultText + word.atäpa + " (t.) = " + word.time + "\n"
        }
    }





    document.getElementById("result-atapa").innerText = atäpaDictionnary.resultText
}