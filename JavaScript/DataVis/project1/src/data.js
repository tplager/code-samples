import {parseDateChooser, chart1StartDate, chart1EndDate} from "./main.js";

export {formatData, initTimeSpoken, timeSpoken, totalStatements, candidateStatements, primaryResultsByCandidate, allStates, candidateTotals, initPrimaryResults, primaryStateData, initPrimaryStateData}

let timeSpoken = [];

let candidateStatements = {};

let totalStatements = "";

let primaryResultsByCandidate = []; 

let allStates = []; 

let candidateTotals = [];

let primaryStateData = [];

function formatData(dataset, primaryData) {
    initTimeSpoken(dataset)
    
    for (let i of dataset) {        
        totalStatements = totalStatements + " " + i.speech;
    }

    //sorting by last name
    timeSpoken.sort((a, b) => {
        return a.speaker.split(' ')[1] < b.speaker.split(' ')[1] ? -1 : 1;
    });
            
    //need to get this filter working
    for (let i of timeSpoken) {
        candidateStatements[i.speaker] = dataset.filter((d) => d.speaker === i.speaker.replace(' ', '_'));
    }
        
    primaryData.forEach((d) => allStates.push(d.state.replace(' ', '_'))); 
    
    console.log(allStates); 
    
    initTimeSpoken(dataset); 
    
    initPrimaryResults(primaryData); 
    
    initPrimaryStateData(primaryData); 
}

function initTimeSpoken(dataset) {
    let dateFilteredDataset = dataset.filter((d) => {
        return parseDateChooser(chart1StartDate) < d.date && d.date < parseDateChooser(chart1EndDate);    
    });
        
    timeSpoken = [];
    for (let i of dateFilteredDataset) {
        let found = false;

        for (let j of timeSpoken) {
            if (j.speaker.replace(' ', '_') == i.speaker) {
                j.speaking_time_seconds += i.speaking_time_seconds;
                found = true;
            }
        }

        if (!found) {
            timeSpoken.push({
                speaker: i.speaker.replace('_', ' '),
                speaking_time_seconds: i.speaking_time_seconds
            })
        }
    }
    
    //sorting by last name
    timeSpoken.sort((a, b) => {
        return a.speaker.split(' ')[1] < b.speaker.split(' ')[1] ? 1 : -1;
    });
    
    console.log(timeSpoken); 
}

function initPrimaryResults(primaryData) {        
    primaryResultsByCandidate = [];
    for (let i of primaryData) {
        for (let key in i.results){
            let found = false; 
            
            for (let j of primaryResultsByCandidate) {
                if (j.name.replace(' ', '_') === key){
                    //let tempResult = i.results[key].delegates;
                    let tempResult = {
                        delegates: i.results[key].delegates, 
                        percentage: i.results[key].percentage
                    };
                    
                    j[i.state.replace(' ', '_')] = tempResult;
                    
                    found = true;
                }
            }
                        
            if (!found){
                let tempResult = {
                    name: key.replace('_', ' ')
                }
                tempResult[i.state.replace(' ', '_')] = {
                    delegates: i.results[key].delegates, 
                    percentage: i.results[key].percentage
                } 
                //i.results[key].delegates;
                
                primaryResultsByCandidate.push(tempResult);
            }
        }
    }
        
    //sorting by last name
    primaryResultsByCandidate.sort((a, b) => {
        return a.name.split(' ')[1] < b.name.split(' ')[1] ? 1 : -1;
    });
    
    
    candidateTotals = primaryResultsByCandidate.reduce((acc, cv) => {
        let totalDels = 0; 
        
        for (let i in cv) {
            if (i != "name")
                totalDels += cv[i].delegates; 
        }
        
        acc.push(totalDels);
                
        return acc; 
    }, []);
    
    //console.log(candidateTotals); 
    console.log(primaryResultsByCandidate); 
}

function initPrimaryStateData(primaryData) {
    let tempData = primaryData.filter((d) => {
        return d.state === chart3Select.value; 
    })[0].results;
            
    primaryStateData = [];
    
    for (let i in tempData){
        let tempObj = {
            name: i,
            percentage: tempData[i].percentage/100
        };
        
        primaryStateData.push(tempObj); 
    }
    
    //sorting by last name
    primaryStateData.sort((a, b) => {
        return a.name.split('_')[1] < b.name.split('_')[1] ? 1 : -1;
    }).map((d) => {
        d.name = d.name.replace('_', ' ')
    });
    
    console.log(primaryStateData);
}