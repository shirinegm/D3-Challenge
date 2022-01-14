// Start with a log
console.log("app.js loaded")

// Set up the svg area size
let svgWidth = 720;
let svgHeight = 500;

let margin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 20
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Add SVG wrapper and append a group
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read the data
d3.csv("./assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

    console.log(data);

    // parse into numbers because we are reading from a csv
    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

});