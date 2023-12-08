
function importEngineSchematic(filePath) {
    try {
        const fs = require("fs")
        const rows = fs.readFileSync(filePath).toString().split("\n")

        return rows.map((row) => row.trim())
    } catch (error) {
        console.error("Fle reading error", error)
        return []
    }
}

function isRangeOverlapping([startA, endA], [startB, endB]) {
    if (startA < startB) 
        return endA >= startB
    else    
        return endB >= startA
}

function getGearAdjacentParts(engineSchematic, x, y) {
    const result = []
    const adjacencyRange = [x - 1, x + 1]
    const regex = /\d+/g
    let match

    // Checking previous/current/next row
    for (const yOffset of [-1, 0, 1]) {
        const tempY = y + yOffset

        if (tempY < 0 || tempY >= engineSchematic.length) continue;

        // Looping through part numbers from row
        while ((match = regex.exec(engineSchematic[tempY])) != null) {
            const numberString = match[0]
            const index = match.index        
            const partNumberRange = [index, index + numberString.length - 1]

            if (isRangeOverlapping(adjacencyRange, partNumberRange)) {
                result.push({
                    "x": index,
                    "y": tempY,
                    "partNumber": parseInt(numberString)
                })
            }
        }

    }
    return result
}

function getGears(engineSchematic) {
    const result = []
    const GEAR = '*'

    engineSchematic.forEach((engineRow, y) => {      
        for (let x = 0; x < engineRow.length; x++) {
            if (engineRow[x] !== GEAR) continue;

            const adjacentParts = getGearAdjacentParts(engineSchematic, x, y)

            if (adjacentParts.length >= 2) {
                result.push({
                    "x": x,
                    "y": y,
                    "ratio": adjacentParts.reduce((ratio, part) => ratio * part.partNumber, 1)
                })
            }
        }
    })
    return result
}

const engineSchematic = importEngineSchematic("input.txt")
const gears = getGears(engineSchematic)

console.log("Answer:", gears.reduce((sum, gear) => sum + gear.ratio, 0))