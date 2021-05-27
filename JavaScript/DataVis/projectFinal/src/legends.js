import {
    classColorScale,
    raceColorScale
} from './scales.js'
import {
    nodes,
    classGroups,
    raceGroups,
    focused,
    background, 
    zoom, 
    dataset, 
    disableHover,
    enableHover
} from './main.js'
import {
    classInfo,
} from './infoArrays.js'
import {
    force
} from './forces.js'
export {
    initLegends,
    classLegend,
    classLegendGroup,
    raceLegend,
    raceLegendGroup
}

//declaring variables to be used later
let classLegend, classLegendGroup, raceLegendGroup, raceLegend;

//creating legends and appending on the page
function initLegends(svg) {
    classLegendGroup = svg.append('g')
        .attr('id', 'class-legend')
        .attr('transform', 'translate(40,40)')
        .style('font-size', '40px');

    raceLegendGroup = svg.append('g')
        .attr('id', 'race-legend')
        .attr('transform', 'translate(350, 30)')
        .style('font-size', '20px')
        .style('opacity', 0);

    //creating backing rects for the legends so they show better against the nodes
    appendBackingRect(classLegendGroup, 300, 900, -40, -40);

    appendBackingRect(raceLegendGroup, 300, 1175, -40, -30);

    //creating the actual legends
    classLegend = initColorLegend(classColorScale, classClickEvent, 2000);
    raceLegend = initColorLegend(raceColorScale, raceClickEvent, 1000);

    //creating the legends on the page
    svg.select('#class-legend')
        .call(classLegend);

    svg.select('#race-legend')
        .call(raceLegend);

    //moving the text so so that it is centered
    classLegendGroup.selectAll('text')
        .attr('transform', 'translate(50, 15)')
        .style('cursor', 'pointer');

    raceLegendGroup.selectAll('text')
        .attr('transform', 'translate(50, 7)')
        .style('cursor', 'pointer');

    //adding black outline to squares so they pop more
    d3.selectAll('.legendCells')
        .selectAll('path')
        .style('stroke', 'black');
}

//function to create a color legend
function initColorLegend(colorScale, clickEvent = null, squareSize) {
    return d3.legendColor()
        .shape('path', d3.symbol().type(d3.symbolSquare).size(squareSize)())
        .shapePadding(13)
        .orient('vertical')
        .labels(colorScale.domain())
        .scale(colorScale)
        .on('cellclick', clickEvent);
}

//function to append a backing rect to the legend group which is already appended to the svg
function appendBackingRect(legendGroup, width, height, x, y) {
    let transform = legendGroup.style('transform').replace(')', '').split(', ');

    legendGroup.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', `translate(${parseInt(x) + 1}, ${parseInt(y) + 1})`)
        .style('rx', 15)
        .style('fill', 'white')
        .style('stroke', 'black')
        .style('opacity', 0.8)
        .attr('class', 'legend-back');
}

//function to pass in as click behavior on the class legend
function classClickEvent(d) {
    nodes
        .classed('not-in-focus', true)
        .classed('in-focus', false);

    classGroups[d]
        .classed('not-in-focus', false)
        .classed('in-focus', true);

    disableHover(); 
    enableHover(); 
    
    let transform = classInfo.filter(x => x.class === d)[0].transform;

    background
        .transition()
        .duration(1000)
        .call(zoom.transform, d3.zoomIdentity.translate(transform.x, transform.y).scale(transform.k));

    focused.class = d;

    force.nodes(dataset.nodes);
    force.alpha(0.2).restart();
};

//function to pass in as click behavior for the race legend
function raceClickEvent(d) {
    nodes
        .classed('not-in-focus', true)
        .classed('in-focus', false);

    //debugger;
    raceGroups[d]
        .classed('not-in-focus', false)
        .classed('in-focus', true);

    disableHover(); 
    enableHover(); 
    
    background
        .transition()
        .duration(1000)
        .call(zoom.transform, d3.zoomIdentity.translate(-731.2017998908004, -276.9754901250857).scale(1.7));

    focused.race = d;

    force.nodes(dataset.nodes);
    force.alpha(0.2).restart();
}