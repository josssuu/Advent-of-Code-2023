
function importRaces(filePath) {
    try {
        const fs = require("fs")
        const rows = fs.readFileSync(filePath).toString().split("\n")

        const times = rows[0].split(" ").map(x => parseInt(x)).filter(Boolean)
        const distances = rows[1].split(" ").map(x => parseInt(x)).filter(Boolean)

        return distances.map((distance, idx) => {
            return {
                time: times[idx],
                distance: distance
            }
        })
        
    } catch (error) {
        console.error("File reading error", error)
        return []
    }
}

function simulateRace(race) {
    const simulations = []
    const totalTime = race.time

    for (let chargingTime = 1; chargingTime <= race.time; chargingTime++) {
        simulations.push({
            time: chargingTime,
            distance: chargingTime * (totalTime - chargingTime)
        })
    }

    return simulations
}

function getRaceErrorMargin(race) {
    return simulateRace(race).filter(simulation => simulation.distance > race.distance).length
}

const filePath = "input.txt"
const races = importRaces(filePath)
const errorMarginProduct = races.reduce((margin, race) => margin * getRaceErrorMargin(race), 1) 

console.log("Result:", errorMarginProduct)