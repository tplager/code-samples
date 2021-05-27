import {updateHorizontalBarChart, updateHorizontalStackedChart} from "./charts.js"
import {dataLoaded, updateCloud} from "./textManip.js"
import {formatData, timeSpoken, totalStatements, candidateStatements, initTimeSpoken, primaryResultsByCandidate, allStates, candidateTotals, initPrimaryResults, initPrimaryStateData, primaryStateData} from "./data.js"

export {tooltip, totalStatements, candidateStatements, parseDateChooser, chart1StartDate, chart1EndDate}

"use strict"

let primaryData;
let chart1, chart2;

const w = 600;
const h = 450;

let cloudSelect, chart1Start, chart1End, chart3Select; //will also need some kind of select for date for time spoken

let timeSpokenAxes = {
    xAxis: 0, 
    yAxis: 0, 
    xAxisGroup: 0, 
    yAxisGroup: 0
};

let primaryAxes = {
    xAxis: 0, 
    yAxis: 0, 
    xAxisGroup: 0, 
    yAxisGroup: 0
};

let stateAxes = {
    xAxis: 0, 
    yAxis: 0, 
    xAxisGroup: 0, 
    yAxisGroup: 0
};

let chart1StartDate, chart1EndDate;

let tooltip; 

//starts when page loads
window.addEventListener('load', (e) => {
    initData();
});

const parseDatePrimary = d3.timeParse("%m-%d-%Y");
const parseDateChooser = d3.timeParse("%Y-%m-%d");

//function to initialize data
function initData() {

    //loading primary data
    d3.json("data/primary_results.json").then(function (data) {
        data.forEach((data) => {
            data.date = parseDatePrimary(data.date);
            
            //redefining results into numbers
            for (let key in data.results) {
                data.results[key].delegates = parseInt(data.results[key].delegates);
                data.results[key].percentage = parseFloat(data.results[key].percentage);
            }
        });
        primaryData = data;
    });

    //loading debate transcript data
    d3.csv("./data/project_1_dataset_remove_blanks.csv", (data) => ({
        ...data,
        date: new Date(data.date),
        speaker: data.speaker.split(', ').reverse().join('_').replace(/[\u2018\u2019]/g, "'"),
        speaking_time_seconds: parseFloat(data.speaking_time_seconds),
    })).then((dataset) => {
        
        console.log(primaryData);
        console.log(dataset);

        chart1StartDate = d3.timeFormat("%Y-%m-%d")(new Date('06-25-2019'));
        chart1EndDate = d3.timeFormat("%Y-%m-%d")(new Date()); 
        
        //formatting data into other arrays and objects
        formatData(dataset, primaryData);
        
        //initializing dom elements like selects
        initDomElements(dataset);
        
        //initializing visualizations in a good starting state
        initVisualizations(dataset);
    });
}

//initializes dom elements like selects
function initDomElements(dataset) {
    tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('display', 'none')
        .style('background', '#fff')
        .style('border', '3px solid black')
        .style('border-radius', '5px')
        .style('padding', '0.25em')
        .style('width', '200px')
        .text('A simple tooltip'); 
    
    //defines event for cloud select
    cloudSelect = d3.select('#cloudSelect'); 
    cloudSelect
        .on('change', function() {
                let name = this.value;    

                //if all is selected, create a new cloud from all objects
                if (name === "All")
                    updateCloud(totalStatements); 
                else {        
                    let totalCandidateStatement = ""; 

                    for (let i of candidateStatements[name]) {
                        totalCandidateStatement += i.speech;
                    }

                    updateCloud(totalCandidateStatement);
                }
            });
    
    chart1Start = d3.select('#chart1DateStart');
    chart1Start
        .attr('value', () => d3.timeFormat("%Y-%m-%d")(new Date('June 25, 2019')))
        .on('change', function() {
            chart1StartDate = this.value;
        
            //update chart 1 by filtering dataset
            initTimeSpoken(dataset); 
        
            let xScale = d3.scaleLinear()
                .domain([0, d3.max(timeSpoken, (d) => d.speaking_time_seconds)])
                .range([0, w-120])
                .nice();

            let yScale = d3.scaleBand()
                .domain(timeSpoken.map((d) => d.speaker))
                .range([h - 30, 30])
                .paddingInner(0.1);

            let cScale = d3.scaleLinear()
                .domain([d3.min(timeSpoken, (d) => d.speaking_time_seconds), d3.max(timeSpoken, (d) => d.speaking_time_seconds)])
                .range(['#f00', '#ffa500']);
        
            updateHorizontalBarChart(timeSpoken, chart1, xScale, yScale, cScale, 'speaking_time_seconds', 'speaker', (d) => Math.floor(d));
            
            //setting up axes
            timeSpokenAxes.xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('~s'));
            timeSpokenAxes.yAxis = d3.axisLeft(yScale);


            // AXES
            timeSpokenAxes.xAxisGroup
                .transition()
                .duration(500)
                .attr('transform', `translate(105, ${h - 30 + 2})`)
                .call(timeSpokenAxes.xAxis);

            timeSpokenAxes.yAxisGroup
                .transition()
                .duration(500)
                .attr('transform', `translate(105, 0)`)
                .call(timeSpokenAxes.yAxis);  
        });
    
    chart1End = d3.select('#chart1DateEnd');
    chart1End
        .attr('value', () => d3.timeFormat("%Y-%m-%d")(new Date()))
        .on('change', function() {
            chart1EndDate = this.value;
        
            //update chart 1 by filtering dataset
            initTimeSpoken(dataset); 
        
            let xScale = d3.scaleLinear()
                .domain([0, d3.max(timeSpoken, (d) => d.speaking_time_seconds)])
                .range([0, w-120])
                .nice();

            let yScale = d3.scaleBand()
                .domain(timeSpoken.map((d) => d.speaker))
                .range([h - 30, 30])
                .paddingInner(0.1);

            let cScale = d3.scaleLinear()
                .domain([d3.min(timeSpoken, (d) => d.speaking_time_seconds), d3.max(timeSpoken, (d) => d.speaking_time_seconds)])
                .range(['#f00', '#ffa500']);
        
            updateHorizontalBarChart(timeSpoken, chart1, xScale, yScale, cScale, 'speaking_time_seconds', 'speaker', (d) => Math.floor(d));  
        
            //setting up axes
            timeSpokenAxes.xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('~s'));
            timeSpokenAxes.yAxis = d3.axisLeft(yScale);


            // AXES
            timeSpokenAxes.xAxisGroup
                .transition()
                .duration(500)
                .attr('transform', `translate(105, ${h - 30 + 2})`)
                .call(timeSpokenAxes.xAxis);

            timeSpokenAxes.yAxisGroup
                .transition()
                .duration(500)
                .attr('transform', `translate(105, 0)`)
                .call(timeSpokenAxes.yAxis);
        });
    
    chart3Select = d3.select('#chart3Select'); 
    chart3Select
    .on('change', function() {
        initPrimaryStateData(primaryData); 
        
        //starting chart 3
        let xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, w-120])
            .nice();

        let yScale = d3.scaleBand()
            .domain(primaryStateData.map((d) => d.name.replace('_', ' ')))
            .range([h - 30, 30])
            .paddingInner(0.1);

        let cScale = d3.scaleLinear()
            .domain([0, 1])
            .range(['#f00', '#ffa500']);

        chart3 = d3.select('#chart3')
            .attr("viewBox", `0 0 600 450`)
            .attr("preserveAspectRatio", "xMidYMin meet");

        updateHorizontalBarChart(primaryStateData, chart3, xScale, yScale, cScale, 'percentage', 'name', (d) => (d * 100).toString() + '%');

        //setting up axes
        stateAxes.xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format('.0%'));
        stateAxes.yAxis = d3.axisLeft(yScale);


        // AXES
        stateAxes.xAxisGroup
            .attr('transform', `translate(105, ${h - 30 + 2})`)
            .call(stateAxes.xAxis);

        stateAxes.yAxisGroup
            .attr('transform', `translate(105, 0)`)
            .call(stateAxes.yAxis);
    });
}

//time spoken graph needs axes switched
function initVisualizations(dataset) {
    dataLoaded(totalStatements);
    
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(timeSpoken, (d) => d.speaking_time_seconds)])
        .range([0, w-120])
        .nice();

    let yScale = d3.scaleBand()
        .domain(timeSpoken.map((d) => d.speaker))
        .range([h - 30, 30])
        .paddingInner(0.1);

    let cScale = d3.scaleLinear()
        .domain([d3.min(timeSpoken, (d) => d.speaking_time_seconds), d3.max(timeSpoken, (d) => d.speaking_time_seconds)])
        .range(['#f00', '#ffa500']);

    chart1 = d3.select('#chart1')
//        .attr('width', w)
//        .attr('height', h);
        .attr("viewBox", `0 0 600 450`)
        .attr("preserveAspectRatio", "xMidYMin meet")
    
    updateHorizontalBarChart(timeSpoken, chart1, xScale, yScale, cScale, 'speaking_time_seconds', 'speaker', (d) => Math.floor(d));
    
    //setting up axes
    timeSpokenAxes.xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('~s'));
    timeSpokenAxes.yAxis = d3.axisLeft(yScale);


    // AXES
    timeSpokenAxes.xAxisGroup = chart1.append('g')
        .attr('transform', `translate(105, ${h - 30 + 2})`)
        .call(timeSpokenAxes.xAxis);

    timeSpokenAxes.yAxisGroup = chart1.append('g')
        .attr('transform', `translate(105, 0)`)
        .call(timeSpokenAxes.yAxis);
    
    //starting chart2
    xScale = d3.scaleLinear()
        .domain([0, d3.max(candidateTotals)])
        .range([0, w - 120])
        .nice();

    yScale = d3.scaleBand()
        .domain(primaryResultsByCandidate.map((d) => d.name))
        .range([h - 30, 30])
        .paddingInner(0.1);
    
    //cScale = (c) => d3.interpolateRainbow(c); 
    cScale = d3.scaleOrdinal(d3.schemePaired); 
    
    chart2 = d3.select('#chart2')
        .attr("viewBox", `0 0 600 450`)
        .attr("preserveAspectRatio", "xMidYMin meet");
    
    updateHorizontalStackedChart(primaryResultsByCandidate, chart2, xScale, yScale, cScale);
    
    //setting up axes
    primaryAxes.xAxis = d3.axisBottom(xScale)
    primaryAxes.yAxis = d3.axisLeft(yScale);


    // AXES
    primaryAxes.xAxisGroup = chart2.append('g')
        .attr('transform', `translate(105, ${h - 30 + 2})`)
        .call(primaryAxes.xAxis);

    primaryAxes.yAxisGroup = chart2.append('g')
        .attr('transform', `translate(105, 0)`)
        .call(primaryAxes.yAxis);
    
    //starting chart 3
    xScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, w-120])
        .nice();

    yScale = d3.scaleBand()
        .domain(primaryStateData.map((d) => d.name.replace('_', ' ')))
        .range([h - 30, 30])
        .paddingInner(0.1);

    cScale = d3.scaleLinear()
        .domain([0, 1])
        .range(['#f00', '#ffa500']);
    
    chart3 = d3.select('#chart3')
        .attr("viewBox", `0 0 600 450`)
        .attr("preserveAspectRatio", "xMidYMin meet");
    
    updateHorizontalBarChart(primaryStateData, chart3, xScale, yScale, cScale, 'percentage', 'name', (d) => (d * 100).toString() + '%');
    
    //setting up axes
    stateAxes.xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('.0%'));
    stateAxes.yAxis = d3.axisLeft(yScale);


    // AXES
    stateAxes.xAxisGroup = chart3.append('g')
        .attr('transform', `translate(105, ${h - 30 + 2})`)
        .call(stateAxes.xAxis);

    stateAxes.yAxisGroup = chart3.append('g')
        .attr('transform', `translate(105, 0)`)
        .call(stateAxes.yAxis);
}

//look at most used words in general and by each candidate
//look at primary results against date against time spoken by candidates
//make sure to mention candidates dropping out of the race