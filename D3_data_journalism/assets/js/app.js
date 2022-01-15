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

    // Create Scale Functions
    let xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.poverty)])
        .range([0, width]);

    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    // Create axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    //Append axis to chart and slide it down
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis)
    


    // Add node corresponding to the data points so that we can add circles and text to them
    let node = chartGroup.selectAll("node")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${xLinearScale(d.poverty)}, ${yLinearScale(d.healthcare)})`);
    
    node.append("circle")
        .attr("r", "10")
        .attr("fill", "black")
        .attr("opacity", ".4");

    // Create circles for each data point
    // let circlesGroup = chartGroup.selectAll("circle")
    // .data(data)
    // .enter()
    // .append("circle")
    // .attr("cx", d => xLinearScale(d.poverty))
    // .attr("cy", d => yLinearScale(d.healthcare))
    // .attr("r", "10")
    // .attr("fill", "black")
    // .attr("opacity", ".4");


    // Add text to the circles 
    //let elemEnter = elem.enter()
    // circlesGroup.append("text")
    //     .style("fill", "red")   // fill the text with the colour black
    //     .attr("x", 200)           // set x position of left side of text
    //     .attr("y", 100)           // set y position of bottom of text
    //     .attr("dy", ".35em")           // set offset y position
    //     .attr("text-anchor", "middle")
    //     .text(function(data){return data.state})
    //     .style("fill", "black")

    //


});