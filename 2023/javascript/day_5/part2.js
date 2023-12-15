
function importData(filePath) {
    try {
        const fs = require("fs")
        const rows = fs.readFileSync(filePath).toString().split("\n")
        
        const seedsData = rows[0].split(":")[1].split(" ").filter(Boolean)

        const seeds = seedsData.reduce((seeds, info, index) => {
            if (index % 2 === 0) {
                seeds.push({start: parseInt(info)})
            }
            else {
                seeds[seeds.length - 1]["length"] = parseInt(info)
            }
            return seeds
        }, [])

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
        maps.forEach(map => {
            map.mappings.sort((a, b) => a.source - b.source)
        })

        return [seeds, maps]
    } catch (error) {
        console.error("File reading error", error)
        return []
    }
}

function applyMappings(sourceRange, mappings) {
    const unmappedRange = {
        start: sourceRange.start,
        length: sourceRange.length
    }
    const mappedRanges = []

    mappings.every(mapping => {        
        // Unmapped range is not in range for further mappings
        if (unmappedRange.start + unmappedRange.length < mapping.source) {
            return false
        }

        // Mapping is not in range for unmapped range
        if (mapping.source + mapping.length < unmappedRange.start) {
            return true
        }
        
        const delta = unmappedRange.start - mapping.source
        var mappedRange
        
        // Unconfigured range maps 1:1
        if (unmappedRange.start < mapping.source) {
            mappedRange = {
                start: unmappedRange.start,
                length: Math.min(unmappedRange.length, Math.abs(delta))
            }
            
            mappedRanges.push(mappedRange)
            
            unmappedRange.start += mappedRange.length
            unmappedRange.length -= mappedRange.length
        }
        
        if (unmappedRange.length === 0) return false
        
        // Configured mapping
        mappedRange = {
            start: mapping.destination + delta,
            length: Math.min(mapping.length - delta, unmappedRange.length)
        }
        
        mappedRanges.push(mappedRange)
        
        unmappedRange.start += mappedRange.length
        unmappedRange.length -= mappedRange.length
        
        return unmappedRange.length > 0
    })

    if (unmappedRange.length > 0) mappedRanges.push(unmappedRange)
    
    return mappedRanges
}

function getLocationRanges(seedRange, maps) {    
    return maps.reduce((sourceRanges, map) => {

        return sourceRanges.reduce((newRanges, range) => {
            const mappedRanges = applyMappings(range, map.mappings)
            mappedRanges.forEach(x => newRanges.push(x))
            return newRanges
        }, [])
        
    }, [seedRange])
}

function mapToLocations(seedRanges, maps) {
    const locationRanges = []

    seedRanges.forEach(seedRange => {
        getLocationRanges(seedRange, maps).forEach(locationRange => {
            locationRanges.push(locationRange)
        })
    })

    return locationRanges
}

const filePath = "input.txt"
const [seedRanges, maps] = importData(filePath)
const locations = mapToLocations(seedRanges, maps)
const minLocation = locations.reduce((min, location) => Math.min(min, location.start), locations[0].start)

console.log("Answer:", minLocation)