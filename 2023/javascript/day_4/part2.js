
function importCards(filePath) {
    try {
        const fs = require("fs")
        const rows = fs.readFileSync(filePath).toString().split("\n")

        return rows.map((row) => {
            const [name, numbers] = row.trim().split(":")
            const [winningNumbers, playerNumbers] = numbers.split("|").map(set => {
                return set.split(" ").map(number => parseInt(number)).filter(Boolean)
            })
            const matchingNumbers = playerNumbers.filter(number => winningNumbers.indexOf(number) >= 0)

            return {
                name,
                winningNumbers,
                playerNumbers,
                matchingNumbers
            }
        })
    } catch (error) {
        console.error("File reading error", error)
        return []
    }
}

function getCardCountAfterPlayingAll(cards) {
    const winningMultipliers = new Array(cards.length).fill(1)

    cards.forEach((card, cardIndex) => {
        for (let winIndex = 1; winIndex <= card.matchingNumbers.length; winIndex++) {
            winningMultipliers[cardIndex + winIndex] += winningMultipliers[cardIndex]
        }
    })
    
    return winningMultipliers.reduce((sum, x) => sum + x, 0)
}

const filePath = "input.txt"
const cards = importCards(filePath)
const totalCards = getCardCountAfterPlayingAll(cards)

console.log("Answer:", totalCards)