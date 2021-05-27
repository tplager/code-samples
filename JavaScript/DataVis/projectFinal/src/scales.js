import {
    classInfo,
    raceInfo
} from './infoArrays.js'
export {
    classColorScale,
    classAngleScale,
    raceColorScale
}

//defining color scale for class
const classColorScale = d3.scaleOrdinal()
    .domain(classInfo.map(d => d.class))
    .range(classInfo.map(d => d.color));

//defining ordinal id scale for angle
const classAngleScale = d3.scaleOrdinal()
    .domain(classInfo.map(d => d.class))
    .range(classInfo.map(d => d.angle));

//defining color scale for race
const raceColorScale = d3.scaleOrdinal()
    .domain(raceInfo.map(d => d.name))
    .range(raceInfo.map(d => d.color));
