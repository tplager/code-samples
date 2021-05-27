import {tooltip} from "./main.js"
import {allStates} from "./data.js"
import {capitalizeFirstLetterInString} from "./util.js"

const w = 600;
const h = 450;

export {updateHorizontalBarChart, updateHorizontalStackedChart}

let stack, layers, layer, stackedBars; 

function updateHorizontalBarChart(data, chart, xScale, yScale, cScale, xValue, yValue, xTooltipFunction) {
    const bars = chart.selectAll('rect')
        .data(data)
        .join(
            enter => enter.append('rect')
                .attr('x', d => 105)
                .attr('y', d =>  yScale(d[yValue]))
                .attr('width', 0)
                .attr('height', d => yScale.bandwidth())
                .attr('fill', d => cScale(0)), 
            update => update
                .call(update => update.transition()
                    .attr('x', d => 105)
                    .attr('y', d =>  yScale(d[yValue]))
                    .attr('width', d => xScale(d[xValue]))
                    .attr('height', d => yScale.bandwidth())
                    .attr('fill', d => cScale(d[xValue]))), 
            exit => exit
                .call(exit => exit.transition()
                    .style('opacity', 0)
                    .remove())
        )
        .transition()
        .duration(1000)
        .attr('x', d => 105)
        .attr('y', d =>  yScale(d[yValue]))
        .attr('width', d => xScale(d[xValue]))
        .attr('height', yScale.bandwidth())
        .attr('fill', d => cScale(d[xValue]))
    
    chart.selectAll('rect')
        .on('mouseover', function (d) {
            return tooltip.style('display', 'block');
        })
        .on('mousemove', (d) => {
            const [x, y] = [d3.event.pageX, d3.event.pageY];

            tooltip.text(`${capitalizeFirstLetterInString(yValue)}: ${d[yValue]}
${capitalizeFirstLetterInString(xValue)}: ${xTooltipFunction(d[xValue])}`); 

            return tooltip
                .transition()
                .duration(30)
                .style('top', (y - 90) + 'px')
                .style('left', (x) + 'px');
        })
        .on('mouseout', function (d) {        
            return tooltip.style('display', 'none');
        })
        .on('click', function(d) {
            d3.select(this)
                .classed('clicked', !d3.select(this).classed('clicked'));

            if (d3.select(this).classed('clicked')) {
                chart.selectAll('rect')
                    .transition()
                    .duration(500)
                    .style('opacity', '0')
                    .attr('width', 0); 

                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('height', h - 60)
                    .attr('y', 30)
                    .style('opacity', '1');
            }
            else {            
                chart.selectAll('rect')
                    .transition()
                    .duration(500)
                    .style('opacity', '1')
                    .attr('width', d => xScale(d[xValue])); 

                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('height', yScale.bandwidth())
                    .attr('y', d =>  yScale(d[yValue]));
            }
        });
}

function updateHorizontalStackedChart(data, chart, xScale, yScale, cScale) {
    stack = d3.stack()
        .keys(allStates)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone); 
            
    let delegateData = data.map(d => { 
        d.name = d.name; 
        
        for (let i of allStates){
            let stateString = i.replace(' ', '_');

            if (d[stateString])
                d[stateString] = d[stateString].delegates; 
            else 
                d[stateString] = 0; 
        }
        
        return d;
    });
    
    console.log(delegateData); 
    
    layers = stack(delegateData);
        
    layer = chart.selectAll(".layer")
        .data(layers)
        .enter()
        .append('g')
        .attr('class', 'layer')
        .style('fill', (d, i) => cScale(i)); 


    stackedBars = layer.selectAll('rect')
        .data(d => d)
        .join(
            enter => enter.append('rect')
                .attr('y', d => yScale(d.data.name))
                .attr('x', d => 105)
                .attr('height', yScale.bandwidth())
                .attr('width', 0)
                .attr('class', d => d.data.name.replace(' ', '_')), 
            update => update
                .call(update => update.transition()
                    .attr('y', d => yScale(d.data.name))
                    .attr('x', d => 105 + xScale(d[0]))
                    .attr('height', yScale.bandwidth())
                    .attr('width', d => {return xScale(d[1]) - xScale(d[0])})),
            exit => exit
                .call(exit => exit.transition()
                    .style('opacity', 0)
                    .remove())
        )
        .transition()
        .duration(1000)
        .attr('y', d => yScale(d.data.name))
        .attr('x', d => 105 + xScale(d[0]))
        .attr('height', yScale.bandwidth())
        .attr('width', d => {return xScale(d[1]) - xScale(d[0])});
    
    layer.selectAll('rect')
        .on('mouseover', function (d) {
            return tooltip.style('display', 'block');
        })
        .on('mousemove', function (d){
            const [x, y] = [d3.event.pageX, d3.event.pageY];

            let stateString = d3.select(this.parentNode).datum().key.replace('_', ' '); 
        
            tooltip.text(`State: ${stateString}
Delegates: ${d[1] - d[0]}`); 

            return tooltip
                .transition()
                .duration(30)
                .style('top', (y - 70) + 'px')
                .style('left', (x) + 'px');
        })
        .on('mouseout', function (d) {        
            return tooltip.style('display', 'none');
        })
        .on('click', function(d) {
            let nameString = d3.select(this).attr('class').replace(' clicked', ''); 
                        
            console.log(nameString);
        
            chart.selectAll('.' + nameString)
                .classed('clicked', !chart.select('.' + nameString).classed('clicked'));
        
            if (d3.select(this).classed('clicked')) {
                chart.selectAll('rect')
                    .transition()
                    .duration(500)
                    .style('opacity', '0')
                    .attr('width', 0); 

                chart.selectAll('.' + nameString)
                    .transition()
                    .duration(500)
                    .attr('height', h - 60)
                    .attr('y', 30)
                    .style('opacity', '1');
            }
            else {            
                chart.selectAll('rect')
                    .transition()
                    .duration(500)
                    .style('opacity', '1')
                    .attr('width', d => {return xScale(d[1]) - xScale(d[0])})

                chart.selectAll('.' + nameString)
                    .transition()
                    .duration(500)
                    .attr('height', yScale.bandwidth())
                    .attr('y', d =>  yScale(d.data.name));
            }
        });
}