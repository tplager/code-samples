export {getRandomColor, getRandomInt, capitalizeFirstLetterInString}; 

function getRandomColor(){
    function getByte(){
        return 25 + Math.round(Math.random() * 220);
    }
    return "rgba(" + getByte() + "," + getByte() + "," + getByte() + ",.8)";
}
    
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalizeFirstLetterInString(string) {
    string = string.split('_'); 
        
    string = string.map((d) => {
        d = d[0].toUpperCase() + d.slice(1);
        return d; 
    });
    
    return string.join(' '); 
}