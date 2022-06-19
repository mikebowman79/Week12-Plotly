//1. Create a function to build the charts required
function buildChart(patientID) {

    // Get the samples.json end point
    const sample = `https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json`;

    // Fetch the JSON data
    d3.json(sample).then(data => {
    
    // Create variables
    var samples = data.samples
    var metadata = data.metadata
    var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

    // Create variables to filter by patient ID
    var filteredSample = samples.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

    // Create sample_values variable for charts
    var sample_values = filteredSample.sample_values

    // Create otu_ids variable for charts
    var otu_ids = filteredSample.otu_ids

    //Create otu_labels variable for hovertext for the chart
    var otu_labels = filteredSample.otu_labels

    // Create Bar Chart
    // Define trace1 for Bar Chart
    var trace1 = [{
        //Put values into "x" axis and lables in "y" axis for horizontal bar chart
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otu_id => `OTU ${otu_id}`).reverse(),
        
        // Set hovertext values
        text: otu_labels.slice(0,10).reverse(),
        
        // Set chart type as Bar
        type: 'bar',

        // Set orientation as horizontal
        orientation: 'h'
    }];

    // Create chart title and labels
    var barLayout = {
        title: "Top 10 Microbial Species Found In Test Subject",
        xaxis: {title: "Sample Values"},
        yaxis: {title: "OTU IDs"}
    };

    // Display bar chart
    Plotly.newPlot('bar', trace1, barLayout)

    //Create Bubble Chart
    // Define trace2 for Bubble Chart
    var trace2 = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            color: otu_ids,
            size: sample_values,
            colorscale: 'BlGrBr'
        }
    }];

    // Create chart title and lables
    var bubbleLayout = {
        title: "Belly Button Samples",
        xaxis: {title:"OTU IDs"},
        yaxis: {title: "Sample Values"}
    };

    // Display bubble chart
    Plotly.newPlot ('bubble', trace2, bubbleLayout)

    // Create Gauge Chart
    // Create variable for washing frequency
    var washingFreq = filteredMetadata.wfreq

    // Create trace3 for Gauge Chart
    var trace3 = [{
        domain: {x: [0,1], y: [0,1]},
        value: washingFreq,
        title: {test: "Washing Frequency per Week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            bar: {color: 'white'},
            axis: {range: [null,9]},
            steps: [
                {range: [0,3], color: 'rgb(105, 70, 27)'},
                {range: [3,6], color: 'rgb(185, 245, 140)'},
                {range: [6,9], color: 'rgb(140, 245, 242)'},
            ],
        }
    }]

    // Define Gauge Chart layout
    var gaugeLayout = {width: 500, height: 400, margin: {t:0, b:0}};

    // Display Gauge Chart
    Plotly.newPlot('gauge', trace3, gaugeLayout)
})
};


// 2. Create function to populate the sample-data
function populateDemoInfo(patientID) {
    const sample = `https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json`;
    var demographicInfoBox = d3.select("#sample-metadata");

    d3.json(sample).then(data => {
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        console.log(filteredMetadata)
        Object.entries(filteredMetadata).forEach(([key,value]) => {
            demographicInfoBox.append("p").text(`${key}: ${value}`)
        })
    })
}

// 3. Create function to govern for changing of patientID
function optionChanged(patientID) {
    console.log(patientID);
    buildChart(patientID);
    populateDemoInfo(patientID);
}

// 4. Create function to populate the dropdown list
function initDashboard() {
    // Create variable to select the dropdown select element
    var dropdown = d3.select("#selDataset")
    
    const sample = `https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json`;
    
    // Populate the dropdown data with patientID within the data set
    d3.json(sample).then(data => {
        var patientIDs = data.names;
        patientIDs.forEach(patientID => {
            dropdown.append("option").text(patientID).property("value",patientID)
        })

        // Build charts
        buildChart(patientIDs[0]);
        populateDemoInfo(patientIDs[0]);

    });
};

initDashboard();