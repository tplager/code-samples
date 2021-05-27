import {
    nodes,
    w,
    h,
    focused
} from './main.js'
import {
    classes
} from './infoArrays.js'
import {
    classAngleScale
} from './scales.js'

export {
    initForces,
    force, 
    drag
}

//declaring force
let force;

//defining drag behavior
const drag = (simulation) => {
    const onDragStart = d => {
        if (!d3.event.active) {
            simulation.alphaTarget(0.02).restart();
        }

        // use fx and fy as fixed x and y values; when set, overrides computed x/y
        d.fx = d.x;
        d.fy = d.y;
    };

    const onDrag = d => {
        //console.log(simulation.alpha());
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };

    const onDragEnd = d => {
        if (!d3.event.active) {
            simulation.alphaTarget(0).restart();
        }

        // clear fx and fy so that computed x/y is used once again
        d.fx = null;
        d.fy = null;
    };

    return d3.drag()
        .on('start', onDragStart)
        .on('drag', onDrag)
        .on('end', onDragEnd);
};

//initializing forces based on the dataset
function initForces(dataset) {
    force = d3.forceSimulation(dataset.nodes)
        .force('charge', d3.forceManyBody()
            .strength(-30)
        )
        .force('collide', d3.forceCollide()
            .strength(0.8)
            .radius(d => 25)
        )
        .force('center', d3.forceCenter()
            .x(w / 2)
            .y(h / 2)
        )
//        .force('link', d3.forceLink(dataset.edges)
//            .id(d => d.name)
//            .distance(120)
//            .strength(2)
//        )
        .force('positionX', d3.forceX() //positioning forces when a certain class is selected
            .x(d => {
                if (focused.class != "" && d.justClass.split('|').includes(focused.class)) {
                    let angle = classAngleScale(focused.class);
                    //debugger;
                    return ((w / 2) + (500 * Math.cos(angle * Math.PI / 180)));
                } else if (focused.class === "Other") {
                    for (let charClass of d.class) {
                        if (!classes.includes(charClass.className)) {
                            let angle = classAngleScale("Other");

                            return ((w / 2) + (500 * Math.cos(angle * Math.PI / 180)));
                        }
                    }
                }

                let angle = 0;
                for (let charClass of d.class) {
                    if (classes.includes(charClass.className)) {
                        angle += classAngleScale(charClass.className);
                    } else {
                        angle += classAngleScale('Other');
                    }
                }

                angle / d.class.length;

                return ((w / 2) + (500 / d.class.length * Math.cos(angle * Math.PI / 180)));
            })
            .strength(0.2))
        .force('positionY', d3.forceY()
            .y(d => {
                if (focused.class != "" && d.justClass.split('|').includes(focused.class)) {
                    let angle = classAngleScale(focused.class);

                    return ((h / 2) + (500 * Math.sin(angle * Math.PI / 180)));
                } else if (focused.class === "Other") {
                    for (let charClass of d.class) {
                        if (!classes.includes(charClass.className)) {
                            let angle = classAngleScale("Other");

                            return ((h / 2) + (500 * Math.sin(angle * Math.PI / 180)));
                        }
                    }
                }

                let angle = 0;
                for (let charClass of d.class) {
                    if (classes.includes(charClass.className)) {
                        angle += classAngleScale(charClass.className);
                    } else {
                        angle += classAngleScale('Other');
                    }
                }

                angle / d.class.length;

                return ((h / 2) + (500 / d.class.length * Math.sin(angle * Math.PI / 180)));
            })
            .strength(0.2))
        .force('positionXRace', d3.forceX() //force to use when a certain race is selected
            .x(w/2)
            .strength(d => {
                if (d.race === focused.race && focused.race != "") {
                    return 0.5; 
                }
                return 0; 
            }))
        .force('positionYRace', d3.forceY()
            .y(h/2)
            .strength(d => {
                if (d.race === focused.race && focused.race != "") {
                    return 0.5; 
                }
                return 0; 
            }));


    force.on('tick', () => {
        //console.log(force.alpha());
        nodes
            .attr('transform', d => {
                return `translate(${d.x}, ${d.y})`;
            })
    });
}
