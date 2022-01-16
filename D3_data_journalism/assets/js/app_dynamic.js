// Start with a log
console.log("app_dynamic.js loaded")

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

// Define default x and y axis loaded
let clickedXAxis = "poverty";
let clickedYAxis = "healthcare";

// Create functions to be called on click event
// Function to update x-axis
function xScale(data, clickedXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[clickedXAxis]) * 0.8,
      d3.max(data, d => d[clickedXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// Function to update y-axis
function yScale(data, clickedYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[clickedYAxis]) * 0.8,
      d3.max(data, d => d[clickedYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// Function to render X axis
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
//Function to render Y axis
function renderXAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// Function to update data nodes (circles plus state label)
function renderNodes(node, newXScale, clickedXAxis, newYaxis, clickedYaxis) {

  node.transition()
    .duration(1000)
    .attr("transform", d => `translate(${newXScale(d[clickedXAxis])}, ${newYaxis(d[clickedYAxis])})`);

  return node;
} 




// Read the data and initialize default axes
d3.csv("./assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

    console.log(data);

    // parse into numbers because we are reading from a csv
    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = parseFloat(data.age);
        data.income = parseFloat(data.income);
        data.smokes = parseFloat(data.smokes);
        data.obesity = parseFloat(data.obesity);
    });

    // Create Scale Functions
    let xLinearScale = xScale(data, clickedXAxis);

    let yLinearScale = yScale(data, clickedYAxis);

    // Create axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    //Append axis to chart and slide it down
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis)
    


    // Add node corresponding to the data points so that we can add circles and text to them since appending text to circles doesn work
    let node = chartGroup.selectAll("node")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${xLinearScale(d[clickedXAxis])}, ${yLinearScale(d[clickedYAxis])})`);
    
    node.append("circle")
        .attr("r", "15")
        .attr("fill", "black")
        .attr("opacity", ".4");
    
    node.append("text")
        .text(d => d.abbr)
        .attr("text-anchor", "middle") //center the text horizontally
        .attr("dy", ".35em") //offset the text on the y axis 
        .style("fill", "white"); // change color

    // Create axes labels group now that we have more than one label
    // Labels for X axis

    let xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    let povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

    let ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age in Years");

    let incomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (%)");
    
    // Labels for y axis
    let ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate( ${40 - (height / 2)}, ${0 - margin.left + 30})`);

    let healthcareLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("value", "healthcare")
      .attr("dy", "1em")
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    let smokesLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 10 - (height / 2))
      .attr("value", "smokes")
      .attr("dy", "1em")
      .classed("inactive", true)
      .text("Smokers (%)");

    let obesityLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 20 - (height / 2))
      .attr("value", "obesity")
      .attr("dy", "1em")
      .classed("inactive", true)
      .text("Obesity (%)");


    // Event Listener for the X axis label group
    xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      let xvalue = d3.select(this).attr("value");
      if (xvalue !== clickedXAxis) {

        // replaces chosenXAxis with value
        clickedXAxis = xvalue;

        console.log(clickedXAxis);

        // updates x scale for new data
        xLinearScale = xScale(data, clickedXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        node = renderNodes(node, xLinearScale, clickedXAxis, yLinearScale, clickedYAxis);


        // changes classes to change bold text
        if (clickedXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (clickedXAxis === "income") {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
          .classed("active", true)
          .classed("inactive", false);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        }
      }
    });
    
    // Event Listener for the Y axis label group
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      let yvalue = d3.select(this).attr("value");
      if (yvalue !== clickedYAxis) {

        // replaces chosenXAxis with value
        clickedYAxis = yvalue;

        console.log(clickedyAxis);

        // updates x scale for new data
        yLinearScale = yScale(data, clickedYAxis);

        // updates x axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);

        // updates circles with new y values
        node = renderNodes(node, xLinearScale, clickedXAxis, yLinearScale, clickedYAxis);


        // changes classes to change bold text
        if (clickedYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (clickedXAxis === "smokes") {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
          .classed("active", false)
          .classed("inactive", true);
        }
      }
    });
    
    
      // // Because I am not native to the US, I don't know the abbreviations of each state
    // // So I need a tooltip (it also helps with overlapping circles)
    // let toolTip = d3.tip()
    //   .attr("class", "tooltip")
    //   .offset([-5, 10])
    //   .html(d => d.state);

    // chartGroup.call(toolTip);

    // // Make the tooltip appear on hover then disappear on mouseout
    // node.on("mouseover", function(data) {
    //     toolTip.show(data, this);
    //   })
    //     .on("mouseout", function(data, index) {
    //       toolTip.hide(data);
    //     });

  }).catch(function(error) {
    console.log(error);
});