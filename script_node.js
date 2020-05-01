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
    }
    if (atäpaDictionnary.startingWords.length > 0) {
        atäpaDictionnary.resultText = atäpaDictionnary.resultText + "\n\n\n"
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
    }
    if (atäpaDictionnary.endingWords.length > 0) {
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
    }
    if (atäpaDictionnary.containingWords.length > 0) {
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
    }



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
        if (searchValue === rowInfo.noun || searchValue === rowInfo.verb || searchValue === rowInfo.modifier || searchValue === rowInfo.time) {
            frenchDictionnary.matchWord = rowInfo;
            continue;
        } else if (startWith(searchValue, rowInfo.noun) || startWith(searchValue, rowInfo.verb) || startWith(searchValue, rowInfo.modifier) || startWith(searchValue, rowInfo.time)) {
            frenchDictionnary.startingWords.push(rowInfo);
            continue;
        } else if (endWith(searchValue, rowInfo.noun) || endWith(searchValue, rowInfo.verb) || endWith(searchValue, rowInfo.modifier) || endWith(searchValue, rowInfo.time)) {
            frenchDictionnary.endingWords.push(rowInfo);
            continue;
        } else if (include(searchValue, rowInfo.noun) || include(searchValue, rowInfo.verb) || include(searchValue, rowInfo.modifier) || include(searchValue, rowInfo.time)) {
            frenchDictionnary.containingWords.push(rowInfo);
            continue;
        }
    }
    if (frenchDictionnary.matchWord !== null) {
        frenchDictionnary.resultText = frenchDictionnary.resultText + "Mots correspondants à la recherche :\n\n"
        // if (frenchDictionnary.matchWord.noun !== null) {
        //     frenchDictionnary.resultText = frenchDictionnary.resultText + frenchDictionnary.matchWord.atäpa + " (n.) = " + frenchDictionnary.matchWord.noun + "\n"
        // }
        // if (frenchDictionnary.matchWord.verb !== null) {
        //     frenchDictionnary.resultText = frenchDictionnary.resultText + "a" + frenchDictionnary.matchWord.atäpa + " (v.) = " + frenchDictionnary.matchWord.verb + "\n"
        // }
        // if (frenchDictionnary.matchWord.modifier !== null) {
        //     frenchDictionnary.resultText = frenchDictionnary.resultText + "i" + frenchDictionnary.matchWord.atäpa + " (m.) = " + frenchDictionnary.matchWord.modifier + "\n"
        // }
        // if (frenchDictionnary.matchWord.time !== null) {
        //     frenchDictionnary.resultText = frenchDictionnary.resultText + frenchDictionnary.matchWord.atäpa + " (t.) = " + frenchDictionnary.matchWord.time + "\n"
        // }
        var bol = false;
        for (let index = 0; index < 2; index++) {
            if ((frenchDictionnary.matchWord.noun === searchValue || (index > 0 && frenchDictionnary.matchWord.noun !== searchValue)) && frenchDictionnary.matchWord.noun !== null) {
                frenchDictionnary.resultText = frenchDictionnary.resultText + frenchDictionnary.matchWord.noun + " (n.) = " + frenchDictionnary.matchWord.atäpa + "\n"
            }
            if ((frenchDictionnary.matchWord.verb === searchValue || (index > 0 && frenchDictionnary.matchWord.verb !== searchValue)) && frenchDictionnary.matchWord.verb !== null) {
                frenchDictionnary.resultText = frenchDictionnary.resultText + frenchDictionnary.matchWord.verb + " (n.) = a" + frenchDictionnary.matchWord.atäpa + "\n"
            }
            if ((frenchDictionnary.matchWord.modifier === searchValue || (index > 0 && frenchDictionnary.matchWord.modifier !== searchValue)) && frenchDictionnary.matchWord.modifier !== null) {
                frenchDictionnary.resultText = frenchDictionnary.resultText + frenchDictionnary.matchWord.modifier + " (n.) = i" + frenchDictionnary.matchWord.atäpa + "\n"
            }
            if ((frenchDictionnary.matchWord.time === searchValue || (index > 0 && frenchDictionnary.matchWord.time !== searchValue)) && frenchDictionnary.matchWord.time !== null) {
                frenchDictionnary.resultText = frenchDictionnary.resultText + frenchDictionnary.matchWord.time + " (n.) = " + frenchDictionnary.matchWord.atäpa + "\n"
            }
        }
        frenchDictionnary.resultText = frenchDictionnary.resultText + "\n\n\n"
    }




    document.getElementById("result-atapa").innerText = atäpaDictionnary.resultText
    document.getElementById("result-french").innerText = frenchDictionnary.resultText
}

function startWith(search, word) {
    if (search !== null) {
        return word.startsWith(search)
    }
    return false;
}

function endWith(search, word) {
    if (search !== null) {
        return word.endsWith(search)
    }
    return false;
}

function include(search, word) {
    if (search !== null) {
        return word.includes(search)
    }
    return false;
}