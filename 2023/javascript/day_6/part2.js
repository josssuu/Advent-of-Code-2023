
function importRaces(filePath) {
    try {
        const fs = require("fs")
        const rows = fs.readFileSync(filePath).toString().split("\n")

        return [{
            time: parseInt(rows[0].split(":")[1].split(" ").join("")),
            distance: parseInt(rows[1].split(":")[1].split(" ").join(""))
        }]
    } catch (error) {
        console.error("File reading error", error)
        return []
    }
}

function getRaceErrorMargin(race) {
    const getDistance = (chargingTime) => chargingTime * (race.time - chargingTime)
    const isWin = (chargingTime) => getDistance(chargingTime) > race.distance

    let shortestChargingTime = -1
    for (let chargingTime = 1; chargingTime <= race.time; chargingTime++) {
        if (isWin(chargingTime)) {
            shortestChargingTime = chargingTime
            break
        }
    }

    let longestChargingTime = -1
    for (let chargingTime = race.time; chargingTime >= 1; chargingTime--) {
        if (isWin(chargingTime)) {
            longestChargingTime = chargingTime
            break
        }
    }

    return longestChargingTime - shortestChargingTime + 1
}

const filePath = "input.txt"
const races = importRaces(filePath)

console.log("Result:", getRaceErrorMargin(races[0]))