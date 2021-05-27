import {
    classInfo,
    raceInfo,
    classes,
    races
} from './infoArrays.js';
import {
    classColorScale,
    classAngleScale,
    raceColorScale
} from './scales.js';
import {
    initLegends,
    raceLegendGroup
} from './legends.js';
import {
    tooltip,
    updateTooltip,
    tooltipMouseover,
    tooltipMouseout,
    tooltipMousemove
} from './tooltip.js';
import {
    initForces,
    force, 
    drag
} from './forces.js'

export {
    nodes,
    dataset, 
    classGroups,
    raceGroups, 
    focused,
    zoom,
    zoomLevel,
    w,
    h, 
    background, 
    disableHover, 
    enableHover
}

//Declaring window size
const w = window.innerWidth;
const h = 1220;

//Declaring SVG
const svg = d3
    .select('#chart1')
    .attr('width', w)
    .attr('height', h);

//Declaring other important variables
let nodes, paths, raceCircles, zoomG, zoom, background, zoomLevel, prevZoomLevel, dataset;

//Declaring empty objects to be used later
let focused = {
    class: "", 
    race: ""
}

let classGroups = {};
let raceGroups = {};

//Creating graph
function initGraph() {
    //loads the dataset using d3.csv
    //and parses it into usable values
    d3.csv("./data/characterTable.csv", (d) => ({
        ...d,
        date: new Date(d.date),
        level: d.level,
        HP: parseInt(d.HP),
        AC: parseInt(d.AC),
        Str: parseInt(d.Str),
        Dex: parseInt(d.Dex),
        Con: parseInt(d.Con),
        Int: parseInt(d.Int),
        Wis: parseInt(d.Wis),
        Cha: parseInt(d.Cha),
        level: parseInt(d.level),
        spells: d.spells.split('|').map(d => {
            d = d.split('*');
            return {
                name: d[0].split(' ').map(d => d.charAt(0).toUpperCase() + d.substring(1)).join(' '),
                level: parseInt(d[1])
            }
        }),
        weapons: d.weapons.split('|'),
        skills: d.skills.split('|'),
        class: d.class.split('|').map(x => {
            x = x.split(' ');
            return {
                className: x[0],
                level: parseInt(x[1]),
                length: d.class.split('|').length
            }
        })
    })).then(function (d) {
        //redefining dataset in the form needed by a node graph in d3
        dataset = d;

        let datasetNodes = dataset;
        dataset = {};

        dataset.nodes = datasetNodes;
        dataset.edges = [];
        
        for (let i = 0; i < datasetNodes.length - 1; i++) {
            for (let j = i + 1; j < datasetNodes.length; j++) {
                if (datasetNodes[i].race === datasetNodes[j].race)
                    dataset.edges.push({
                        source: datasetNodes[i].name, 
                        target: datasetNodes[j].name
                    })
            }
        }
        
        //defining force in forces.js
        initForces(dataset);

        //creating a background to use for click events outside the boundary
        background = svg.append('rect')
            .classed('background', true)
            .attr('width', w)
            .attr('height', h)
            .on('dblclick', function () {
                d3.event.stopPropagation();

                nodes
                    .classed('not-in-focus', false)
                    .classed('in-focus', true);

                enableHover(); 
            
                background
                    .transition()
                    .duration(1000)
                    .call(zoom.transform, d3.zoomIdentity.translate(504.7982001091998, 254.02450987491432).scale(0.5547847360339225));

                focused.class = "";
                focused.race = "";

                force.nodes(dataset.nodes);
                force.alphaTarget(0.1).restart();
            });

        //creating a group to use with zooming and panning
        zoomG = svg.append('g')
            .attr('class', 'nodes');
        
        //defining the nodes and binding data and events to them
        nodes = zoomG.selectAll('g')
            .data(dataset.nodes)
            .enter()
            .append('g')
            .on('mouseover.tooltip', tooltipMouseover)
            .on("mouseout.tooltip", tooltipMouseout)
            .on("mousemove", tooltipMousemove)
            .call(drag(force));

        //defining paths and creating paths for each different class
        //of a node
        //also binding the class data to the group of a path
        paths = nodes
            .selectAll('g')
            .data(d => {
                return d.class
            })
            .enter()
            .append('path')
            .attr('d', (d, i) => {
                let xStart, xEnd, yStart, yEnd;
                switch (d.length) {
                    //if there is only 1 class
                    case 1:
                        return `M 0 0 A 20 20, 0, 0, 0, 0 40 A 20 20, 0, 0, 0, 0 0`;
                        break;
                    //if there are 2 classes
                    case 2:
                        return `M 0 ${40 * i} A 20 20, 0, 0, 0, 0 ${40 * (((-1) * i) + 1)} Z`;
                        break;
                    //if there are 3 classes
                    case 3:
                        xStart = 10.00016;
                        xEnd = 10.00016;

                        if (i === 0) {
                            xStart = -20;
                            yStart = 20;
                            yEnd = 37.32060;
                        } else if (i === 1) {
                            yStart = 37.32060;
                            yEnd = 3.32060;
                        } else if (i === 2) {
                            yStart = 3.32060;
                            xEnd = -20;
                            yEnd = 20;
                        }
                        break;
                    //if there are 4 classes
                    case 4:
                        if (i === 0) {
                            xStart = -20;
                            yStart = 20;
                            xEnd = 0
                            yEnd = 40;
                        } else if (i === 1) {
                            xStart = 0;
                            yStart = 40;
                            xEnd = 20
                            yEnd = 20;
                        } else if (i === 2) {
                            xStart = 20;
                            yStart = 20;
                            xEnd = 0
                            yEnd = 0;
                        } else if (i === 3) {
                            xStart = 0;
                            yStart = 0;
                            xEnd = -20
                            yEnd = 20;
                        }
                        break;
                    default:
                        break;
                }
                return `M ${xStart} ${yStart} A 20 20, 0, 0, 0, ${xEnd} ${yEnd} L 0 20 Z`
            })
            .style('fill', d => {
                if (classes.includes(d.className))
                    return classColorScale(d.className);

                return classColorScale('Other');
            })
            .style('stroke', 'lightgray')
            .style('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('click', function (d) {
                d3.event.stopPropagation();

                nodes
                    .classed('not-in-focus', true)
                    .classed('in-focus', false);

                let className = "Other";

                if (classes.includes(d.className))
                    className = d.className;

                classGroups[className]
                    .classed('not-in-focus', false)
                    .classed('in-focus', true);

                disableHover(); 
                enableHover(); 
            
                focused.class = className;

                force.nodes(dataset.nodes);
                force.alpha(0.2).restart();

                let transform = classInfo.filter(x => x.class === className)[0].transform;

                background
                    .transition()
                    .duration(1000)
                    .call(zoom.transform, d3.zoomIdentity.translate(transform.x, transform.y).scale(transform.k));
            });

        //appending race circles
        //even though they don't appear until zoom level is higher
        raceCircles = nodes
            .append('circle')
            .attr('r', 10)
            .attr('cy', 20)
            .style('fill', d => {
                if (races.includes(d.race))
                    return raceColorScale(d.race);

                return raceColorScale('Other');
            })
            .style('stroke', 'lightgray')
            .attr('class', 'race-circle')
            .style('opacity', 0);

        //adding classes to each node for its classes and race so they can be selected
        nodes
            .attr('class', d => {
                let className = "";

                for (let charClass of d.class) {
                    if (classes.includes(charClass.className))
                        className += charClass.className + ' ';
                    else {
                        className += "Other ";
                    }
                }

                return className + d.race;
            });

        //selecting and saving in an object based on class
        for (let charClass of classes) {
            classGroups[charClass] = d3.selectAll(`.${charClass}`);
        }
        
        //selecting and saving in an object based on race
        for (let charRace of races) {
            raceGroups[charRace] = d3.selectAll(`.${charRace}`);
        }

        //creating legends in legends.js
        initLegends(svg);

        //adding zoom and pan behavior
        background
            .call(zoom)
            .on('dblclick.zoom', null);

        //dispatching an event to get the graph in the position it should be in
        background.dispatch('dblclick');

//        console.log(dataset.nodes);
//        console.log(nodes);
    });
}

//handles how the zoom function behaves
//and does stuff based on zoom level
const handleZoomTransform = (d) => {
    //d3.event.stopPropagation;    
    let transform = d3.event.transform;

    //console.log(d3.event.transform);

    prevZoomLevel = zoomLevel;
    zoomLevel = d3.event.transform.k;

    if (zoomLevel >= 1.6 && prevZoomLevel < 1.6) {
        raceCircles
            .transition()
            .duration(1000)
            .style('opacity', 1);

        raceLegendGroup
            .transition()
            .duration(1000)
            .style('opacity', 1);

    } else if (zoomLevel < 1.6 && prevZoomLevel >= 1.6) {
        raceCircles
            .transition()
            .duration(1000)
            .style('opacity', 0);

        raceLegendGroup
            .transition()
            .duration(1000)
            .style('opacity', 0);
    }

    zoomG.attr("transform", d3.event.transform);
}

// define the D3 zoom
zoom = d3.zoom()
    .interpolate(d3.interpolateZoom)
    .clickDistance(10)
    .scaleExtent([0.5, 8])
    //.translateExtent([[-w / 2, -h / 2], [w / 2, h / 2]])
    .on('zoom', handleZoomTransform);

//calls init grpah when the window loads
window.onload = function () {
    initGraph();
}

//Disables hover functionality for nodes not in focus
function disableHover() {
    svg.selectAll('.not-in-focus')
        .on('mouseover.tooltip', null)
        .on('mousemove', null);
}

//Enables hover functionality for nodes in focus
function enableHover() {
    svg.selectAll('.in-focus')
        .on('mouseover.tooltip', tooltipMouseover)
        .on("mouseout.tooltip", tooltipMouseout)
        .on("mousemove", tooltipMousemove)
}