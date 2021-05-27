import {
    zoomLevel, 
    nodes,     
    disableHover,
    enableHover
} from './main.js'
export {
    tooltip,
    updateTooltip,
    tooltipMouseover,
    tooltipMouseout,
    tooltipMousemove
}

//defining tooltip as a d3 selection
const tooltip = d3.select(".tooltip");

//function to update the tooltip based on where it is
function updateTooltip(abilityScores, d) {
    //defines positions for ability scores
    let positions = {
        Str: [176, 483, 428],
        Dex: [376, 483, 428],
        Con: [573, 483, 428],
        Int: [176, 654, 599],
        Wis: [376, 652, 599],
        Cha: [573, 652, 599]
    }

    //copying ability scores to ability modifiers object
    let abilityModifiers = {
        ...abilityScores
    };

    //redefining ability modifiers based on the values of ability scores and the modifier equation
    for (let ability in abilityModifiers) {
        abilityModifiers[ability] = Math.floor((abilityScores[ability] / 2) - 5).toString();

        if (abilityModifiers[ability] >= 0) {
            abilityModifiers[ability] = '+' + abilityModifiers[ability];
        }
    }

    //changing position if there's only 1 digit so it's still centered
    for (let ability in abilityScores) {
        if (abilityScores[ability] < 10)
            positions[ability][0] += 6;
    }

    //adding the info images to the tooltip's svg
    let tooltipSvg = tooltip.select('svg');
    tooltipSvg
        .append('image')
        .attr('href', 'media/D&DStatsDisplay.png')
        .attr('height', 1000)
        .attr('width', 760);
    tooltipSvg
        .append('image')
        .attr('href', 'media/D&DDisplay.png')
        .attr('height', 1000)
        .attr('width', 760)
        .attr('y', 450);
    
    //creating backing rects for the class info
    appendInfoBackingRect(tooltipSvg, 120, 40, 130, 783); 
    appendInfoBackingRect(tooltipSvg, 240, 40, 290, 783); 
    appendInfoBackingRect(tooltipSvg, 160 + d.background.length * 14.5, 40, 130, 833); 
    appendInfoBackingRect(tooltipSvg, 
        () => {
            if (d.weapons.length < 6)
                return 230;
            else 
                return 490;
        }, 
        () => {
            if (d.weapons.length < 6)
                return 40 + d.weapons.length * 26;
            else
                return 170
        }, 130, 933); 
    
    //adding ability scores and modifiers to the tooltip
    for (let ability in abilityScores) {
        appendInfoText(tooltipSvg, positions[ability][0], positions[ability][1], 'ability-score', abilityScores[ability])

        appendInfoText(tooltipSvg, positions[ability][0] - 27, positions[ability][2], 'ability-modifier', abilityModifiers[ability])
    }
    
    //adding other info to the tooltip
    appendInfoText(tooltipSvg, 140, 810, 'char-info', `Level: ${d.level}`)
    appendInfoText(tooltipSvg, 300, 810, 'char-info', `Race: ${d.race}`)
    appendInfoText(tooltipSvg, 140, 860, 'char-info', `Background: ${d.background}`)

    //only adding alignment if it isn't blank
    if (d.alignment != "") {        
        appendInfoBackingRect(tooltipSvg, 145 + d.alignment.length * 13.5, 40, 130, 883); 

        appendInfoText(tooltipSvg, 140, 910, 'char-info', `Alignment: ${d.alignment}`)
    }
    
    //only adding weapons if there are some
    if (d.weapons.length != 0) {
        appendInfoText(tooltipSvg, 140, 960, 'char-info', "Weapons: ")

        tooltipSvg
            .append('g')
            .selectAll('text')
            .data(d.weapons)
            .enter()
            .append('text')
            .attr('x', (x, i) => {
                if (i < 5)
                    return 160;
                else
                    return 400;
            })
            .attr('y', (x, i) => {
                if (i < 5)
                    return 990 + 25 * i
                else
                    return 990 + 25 * (i - 5)
            })
            .attr('class', 'char-info')
            .text(x => x); 
    }
    
    //would add spells here but there's just too many for most characters and not enough space
}

//function to pass in for mouseover behavior for the tooltip
function tooltipMouseover(d) {
    tooltip.transition()
        .duration(300)
        .style("opacity", () => {
            if (zoomLevel < 1.6)
                return 0.8;
            else
                return 1.0;
        });

    if (zoomLevel < 1.6) {
        tooltip
            .html(`<p/>Class(es): ${d.class.map(c => c.className).join(", ")}`)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 30) + "px");
    } else if (zoomLevel >= 1.6) {
        let abilityScores = {
            Str: d.Str,
            Dex: d.Dex,
            Con: d.Con,
            Int: d.Int,
            Wis: d.Wis,
            Cha: d.Cha
        }

        tooltip
            .style("left", (d3.event.pageX + 40) + "px")
            .style("top", (d3.event.pageY - 700) + "px")
            .html(`<svg width='1000px' height='1600px'></svg>`);

        updateTooltip(abilityScores, d);
    }
}

//function to pass in for mouseout behavior with the tooltip
function tooltipMouseout() {
    tooltip.transition()
        .duration(100)
        .style("opacity", 0);
}

//function to pass in for mousemove behavior with the tooltip
function tooltipMousemove() {
    if (zoomLevel < 1.6) {
        tooltip.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 30) + "px");
    } else if (zoomLevel >= 1.6) {
        tooltip.style("left", (d3.event.pageX + 40) + "px")
            .style("top", (d3.event.pageY - 700) + "px");
    }
}

//appends backing rect to the tooltip
function appendInfoBackingRect(svg, width, height, x, y) {
    svg
        .append('rect')
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('width', width)
        .attr('height', height)
        .attr('x', x)
        .attr('y', y)
        .attr('rx', 8);
}

//appends info to the tooltip
function appendInfoText(svg, x, y, textClass, text) {
    svg
        .append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('class', textClass)
        .text(text);
}