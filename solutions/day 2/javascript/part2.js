
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

function getSmallestCubeCount(game) {
    return game.rounds.reduce((cubes, round) => {
        round.actions.forEach((action) => {
            const {color, count} = action
            cubes[color] = Math.max((cubes[color] || 0), count)
        })
        return cubes
    }, {})
}

function powerOfCubes(cubes) {
    return Object.values(cubes).reduce((result, count) => result * count, 1);
}

function powerOfGames(games) {
    return games.reduce((result, game) => result + powerOfCubes(getSmallestCubeCount(game)), 0)
}

const games = importGames("../input.txt")

console.log("Answer:", powerOfGames(games))