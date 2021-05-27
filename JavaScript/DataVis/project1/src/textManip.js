import {
    getRandomColor,
    getRandomInt
} from './util.js';

export {
    dataLoaded,
    updateCloud, 
    cloudOfWords
};

"use strict"

let ctx;
let cloudOfWords;
let cloud; 
let svg; 

const stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "thats", "im"];

function dataLoaded(s) {
    let topWords = formatWords(s);

    cloudOfWords = wordCloud();
    
    cloudOfWords.update(topWords); 
}

// Encapsulate the word cloud functionality
function wordCloud() {
    let fill = d3.scaleOrdinal(d3.schemePaired);

    //Construct the word cloud's SVG element
    svg = d3.select('#wordCloud')
//        .attr("width", 500)
//        .attr("height", 500)
        .attr("preserveAspectRatio", "xMidYMin meet")
        .attr("viewBox", `0 0 800 500`)
        .append("g")
        .attr("transform", `translate(400,250)`)


    //Draw the word cloud
    function draw(words) {
        cloud = svg.selectAll("g text")
            .data(words, (d) => {
                return d.text;
            })
            .join(
                enter => enter.append('text')
                    .style("font-family", "Impact")
                    .style("fill", (d, i) => {
                        return fill(i);
                    })
                    .attr("text-anchor", "middle")
                    .attr('font-size', 1)
                    .text((d) => {
                        return d.text;
                    }), 
//                update => update.call(update => update.transition()
//                    .duration(600)
//                    .style("font-size", (d) => {
//                        return d.size + "px";
//                    })
//                    .attr("transform", (d) => {
//                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
//                    })
//                    .style("fill-opacity", 1)), 
                exit => exit
                    .call(exit => exit.transition()
                        .duration(200)
                        .style('fill-opacity', 1e-6)
                        .attr('font-size', 1)
                        .remove())
            )
            .transition()
                .duration(1000)
                .style("font-size", (d) => {
                    return d.size + "px";
                })
                .attr("transform", (d) => {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1); 

        
//            .join(
//        enter => enter.append('rect')
//          .classed('bar', true)
//          .attr('x', w)                       // Start at the far right
//          .attr('y', d => yScale(d.value))
//          .attr('height', d => (h - 20) - yScale(d.value))
//          .attr('width', xScale.bandwidth()), 
//        update => update
//          .call(update => update.transition(trans)
//            .attr('x', (d, i) => xScale(i))
//            .attr('y', d => yScale(d.value))
//            .attr('height', d => (h - 20) - yScale(d.value))
//            .attr('width', xScale.bandwidth())), 
//        exit => exit
//          .call(exit => exit.transition(trans)
//            .style('opacity', 0)
//            .remove())
//    )
    }


    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {

        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: function (words) {            
            d3.layout.cloud().size([800, 500])
                .words(words)
                .padding(5)
                .rotate(() => {
                    return ~~(Math.random() * 2) * 90;
                })
                .font("Impact")
                .fontSize((d) => {
                    return d.size;
                })
                .on("end", draw)
                .start();
        }
    }

}

function formatWords(s) {
    //changing to lower case
    s = s.toLowerCase();

    //changing long dashes to regular dashes
    s = s.replace(/\u2013|\u2014/g, "-");

    //replacing curly apostrophes
    s = s.replace(/[\u2018\u2019]/g, "'");

    //changing dashes to spaces
    //because otherwise we'll get compound words
    s = s.replace(/\-+/g, ' ');

    //removing other special characters
    s = s.replace(/[.,\/#!$%\^&\*;:{}=_`~()?'"@]+/g, '');
    
    //removing all stopwords
    for (let stopWord of stopwords) {
        let regexReplace = new RegExp(" " + stopWord + " ", "g");
        s = s.replace(regexReplace, ' ');
    }

    s = s.replace(/ +/g, ' ');

    let words = s.split(' ');
    words = words.sort();

    let wordCollection = {};
    wordCollection[words[0]] = 1;
    for (let i = 1; i < words.length; i++) {
        if (words[i] != words[i - 1]) {
            wordCollection[words[i]] = 1;
        } else {
            wordCollection[words[i]]++;
        }
    }

    let totalWords = words.length;
    let wordWeights = [];
    let index = 0;

    for (let key of Object.keys(wordCollection)) {
        wordWeights[index] = wordCollection[key] / totalWords;
        index++;
    }

    let numWordsDisplayed = 15;

    if (Object.keys(wordCollection).length < numWordsDisplayed) {
        numWordsDisplayed = Object.keys(wordCollection).length;
    }
    numWordsDisplayed++;

    wordWeights = wordWeights.sort();
    let topWordWeights = {};

    let topWords = [];

    let testKey = "";
    for (let i = 1; i < numWordsDisplayed; i++) {
        for (let key of Object.keys(wordCollection)) {
            if (wordCollection[key] / totalWords == wordWeights[wordWeights.length - i]) {
                topWordWeights[key] = wordWeights[wordWeights.length - i];
                topWords.push({
                    text: key,
                    occurences: wordCollection[key],
                    size: (10 + (topWordWeights[key] * 100) * 80)
                })
                delete wordCollection[key];
                break;
            }
        }
    }
    
    for (let i of topWords) {
        i.text = i.text.replace("cant", "can't");
        i.text = i.text.replace("new", "New"); 
        i.text = i.text.replace("york", "York"); 
        i.text = i.text.replace("weve", "we've");
        i.text = i.text.replace("donald", "Donald");
        i.text = i.text.replace("trump", "Trump");
        i.text = i.text.replace("ive", "I've");
        i.text = i.text.replace("dont", "don't");
        i.text = i.text.replace("texas", "Texas");
        i.text = i.text.replace("america", "America");

    }
    
    return topWords;
}

function updateCloud(s) {
    s = formatWords(s);
    cloudOfWords.update(s);
}