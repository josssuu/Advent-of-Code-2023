
function importGames(filePath) {
    const fs = require("fs");
    const fileRows = fs.readFileSync(filePath).toString().split("\n");

    return fileRows.reduce((games, game) => {
        let id = parseInt(game.split(":")[0].split(" ")[1]);
        let rounds = [];

        let actions = game.split(":")[1].split(";");

        actions.forEach((actionsString) => {
            let round = {
                "actions": actionsString.split(",").reduce((actionsArray, action) => {
                    action = action.trim();
                    
                    actionsArray.push(
                        {
                            "count": parseInt(action.split(" ")[0]),
                            "color": action.split(" ")[1]
                        }
                    );
            
                    return actionsArray;
                }, [])
            };

            rounds.push(round);
        });

        games.push(
            {
                "id": id,
                "rounds": rounds
            }
        );
        return games
    }, []);
}

function isValidGame(cubes, game) {
    function isValidRound(cubes, round) {
        usedCubes = {}

        return round.actions.every((action) => {          
            let color = action.color

            usedCubes[color] = (usedCubes[color] || 0) + action.count

            return (usedCubes[color] || 0) <= (cubes[color] || 0) 
        })
    }

    return game.rounds.every((round) => {
        return isValidRound(cubes, round);
    })
}

const initialCubes = {
    "red": 12,
    "green": 13,
    "blue": 14
}

const games = importGames("../input.txt")

const validGames = games.reduce((validGames, game) => {
    if (isValidGame(initialCubes, game))
        validGames.push(game);

    return validGames;
}, []);

let idSum = validGames.reduce((sum, game) => {return sum + (game.id || 0)}, 0)

console.log("Part 1:", idSum)

function getSmallestCubeCount(game) {
    return game.rounds.reduce((cubes, round) => {
        round.actions.forEach((action) => {
            let color = action.color
            cubes[color] = Math.max((cubes[color] || 0), action.count)
        })
        return cubes
    }, {})
}

function powerOfCubes(cubes) {
    let power = 1;

    for (const [color, count] of Object.entries(cubes)) {
        power *= count
    }
    
    return power
}

function powerOfGames(games) {
    return games.reduce((power, game) => {
        return power + powerOfCubes(getSmallestCubeCount(game))
    }, 0)
}

console.log("Part 2:", powerOfGames(games))