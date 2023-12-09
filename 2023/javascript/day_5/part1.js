
function importData(filePath) {
    try {
        const fs = require("fs")
        const rows = fs.readFileSync(filePath).toString().split("\n")

        const seeds = rows[0].split(" ").map(row => parseInt(row)).filter(Boolean)

        const maps = []
        let map = {}        

        rows.slice(2).forEach(row => {
            if (row.trim().length === 0) {
                maps.push(map)
                map = {}
                return
            }
            
            if (Object.keys(map).length === 0) {
                const [source_name, target_name] = row.split(" ")[0].split("-to-")
                map = {
                    source_name,
                    target_name
                }
            }
            else {
                const mappings = map.mappings || []
                const [destination, source, length] = row.split(" ").map(x => parseInt(x))
                
                mappings.push({
                    source,
                    destination,
                    length
                })

                map.mappings = mappings
            }
        })

        maps.push(map)

        return [seeds, maps]
    } catch (error) {
        console.error("File reading error", error)
        return []
    }
}

function applyMapping(initialValue, mappings) {
    for (let x = 0; x < mappings.length; x++) {
        const mapping = mappings[x]
        const delta = initialValue - mapping.source
        
        // Is in range of special mapping
        if (delta >= 0 && delta < mapping.length) 
            return mapping.destination + delta
    }

    return initialValue
}

function getLocation(seed, maps) {
    return maps.reduce((location, map) => applyMapping(location, map.mappings), seed)
}

const filePath = "input.txt"
const [seeds, maps] = importData(filePath)
const locations = seeds.map(seed => getLocation(seed, maps))
const minLocation = locations.reduce((min, location) => Math.min(min, location), locations[0])

console.log("Answer:", minLocation)