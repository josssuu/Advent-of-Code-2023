
function getPoints(winningNumbers, playerNumbers) {
    const matches = playerNumbers.filter(number => winningNumbers.indexOf(number) >= 0).length || 0
    return matches <= 1 ? matches : 2 ** (matches - 1);
}

function importCards(filePath) {
    try {
        const fs = require("fs")
        const rows = fs.readFileSync(filePath).toString().split("\n")

        return rows.map((row) => {
            const [name, numbers] = row.trim().split(":")
            const [winningNumbers, playerNumbers] = numbers.split("|").map(set => set.split(" ").filter(Boolean))

            return {
                name,
                winningNumbers,
                playerNumbers,
                points: getPoints(winningNumbers, playerNumbers)
            }
        })
    } catch (error) {
        console.error("Fle reading error", error)
        return []
    }
}

const filePath = "input.txt"
const cards = importCards(filePath)
const totalPoints = cards.reduce((totalPoints, card) => totalPoints + (card.points || 0), 0)

console.log("Answer:", totalPoints)