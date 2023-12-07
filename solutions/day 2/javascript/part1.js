
function parseAction(actionString) {
    const [count, color] = actionString.trim().split(" ")
    return {count: parseInt(count), color}
}

function parseRound(roundString) {
    const actions = roundString.split(",").map(parseAction)
    return {actions}
}

function importGames(filePath) {
    try {
        const fs = require("fs");
        const fileRows = fs.readFileSync(filePath).toString().split("\n");
    
        return fileRows.map((row) => {
            const [idString, roundString] = row.split(":")
            const id = parseInt(idString.split(" ")[1])
            const rounds = roundString.split(";").map(parseRound)
            return {id, rounds}
        })
    } catch (error) {
        console.error("Error reading file:", error)
        return [];
    }
}

function isValidGame(cubes, game) {
    function isValidRound(round) {
        const usedCubes = {}

        return round.actions.every((action) => {          
            const {color, count} = action
            usedCubes[color] = (usedCubes[color] || 0) + count
            return (usedCubes[color] || 0) <= (cubes[color] || 0) 
        })
    }

    return game.rounds.every(isValidRound)
}

const initialCubes = {
    "red": 12,
    "green": 13,
    "blue": 14
}

const games = importGames("../input.txt")
const validGames = games.filter((game) => isValidGame(initialCubes, game));
const idSum = validGames.reduce((sum, game) => sum + (game.id || 0), 0)

console.log("Answer:", idSum)