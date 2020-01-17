module.exports = function parseStingAsArray (StringAsArray){
    return StringAsArray.split(',').map(tech => tech.trim())
}