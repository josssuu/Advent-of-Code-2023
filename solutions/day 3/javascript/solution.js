
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

function isSymbol(char) {
    return !/^\d|\.$/.test(char)
}

function getPartNumbers(engineSchematic) {
    const result = []

    engineSchematic.forEach((engineRow, y) => {
        const regex = /\d+/g
        let match
        
        // Looping through numbers from row
        while ((match = regex.exec(engineRow)) != null) {
            const numberString = match[0]
            const index = match.index
            
            // Checking previous/current/next row
            for (let i = -1; i <= 1; i++) {
                const tempX = index - 1
                const tempY = index + numberString.length + 1
                
                const adjacentRow = engineSchematic[y + i]?.substring(tempX, tempY)
                const isSymbolAdjacent = adjacentRow?.split("").some(isSymbol)

                if (isSymbolAdjacent) {
                    result.push(parseInt(numberString))
                    break
                }
            }
        }
    })

    return result
}

const filePath = "../input.txt"
const engineSchematic = importEngineSchematic(filePath)
const partNumbers = getPartNumbers(engineSchematic)

console.log("Part 1:", partNumbers.reduce((sum, partNumber) => sum + partNumber))