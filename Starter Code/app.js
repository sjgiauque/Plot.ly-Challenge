// Create function for Data plotting (Bar, Gauge, Bubble)
function getPlot(id) {

  // Fetch/Read-in data from json file
  d3.json("samples.json").then((data)=> {
      //console.log(data)

      var wfreq = data.metadata.map(d => d.wfreq)
      console.log(`Washing Freq: ${wfreq}`)
      
      // Filter sample values by id 
      var samples = data.samples.filter(s => s.id.toString() === id)[0];
      //console.log(samples);

      // Slice to get top 10  
      var samplevalues = samples.sample_values.slice(0, 10).reverse();

      // Get only top 10 otu ids for the plot OTU and reverse array
      var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
      
      // Map otu id's to the desired form for the plot
      var OTU_id = OTU_top.map(d => "OTU " + d)
      //console.log(`OTU IDS: ${OTU_id}`)

      // Assign top 10 labels for the plot
      var labels = samples.otu_labels.slice(0, 10);
      // console.log(`Sample Values: ${samplevalues}`)
      // console.log(`Id Values: ${OTU_top}`)
      
      // Create trace variable for the plot
      var trace = {
          x: samplevalues,
          y: OTU_id,
          text: labels,
          marker: {
            color: 'rgb(47,149,199)'},
          type:"bar",
          orientation: "h",
      };

      // Create data variable
      var data = [trace];

      // Create layout variable to set plot layout
      var layout = {
          title: "Top 10 OTU",
          yaxis:{
              tickmode:"linear",
          },
          margin: {
              l: 100,
              r: 100,
              t: 100,
              b: 30
          }
      };

      // Create Bar plot
      Plotly.newPlot("bar", data, layout);
      //console.log(`ID: ${samples.otu_ids}`)
    
      // Create Bubble Chart
      var trace1 = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          marker: {
              size: samples.sample_values,
              color: samples.otu_ids,
              colorscale: "Blues" 
          },
          text: samples.otu_labels
      };

      // Set layout for Bubble plot
      var layout_b = {
          xaxis:{title: "OTU ID"},
          height: 600,
          width: 1000
      };

      // Create data variable 
      var data1 = [trace1];

      // Create Bubble plot
      Plotly.newPlot("bubble", data1, layout_b); 

      // Create Guage chart
      var data_g = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(wfreq),
        title: { text: `Weekly Washing Frequency ` },
        type: "indicator",
        
        mode: "gauge+number",
        gauge: { axis: { range: [null, 9] },
                 steps: [
                  { range: [0, 1], color: "rgb(255, 255, 255)" },
                  { range: [1, 2], color: "rgb(235, 235, 224)" },
                  { range: [2, 3], color: "rgb(214, 214, 194)" },
                  { range: [3, 4], color: "rgb(194, 194, 163)" },
                  { range: [4, 5], color: "rgb(173, 173, 133)" },
                  { range: [5, 6], color: "rgb(153, 153, 102)" },  
                  { range: [6, 7], color: "rgb(122, 122, 82)" },
                  { range: [7, 8], color: "rgb(92, 92, 61)" },
                  { range: [8, 9], color: "rgb(61, 61, 41)" },
                  
                ]}
            
        }
      ];
      var layout_g = { 
          width: 700, 
          height: 600, 
          margin: { t: 20, b: 40, l:100, r:100 } 
        };
      Plotly.newPlot("gauge", data_g, layout_g);
    });
}  
// Create a function to get necessary data
function getInfo(id) {

  // Fetch/Read-in data from json file
  d3.json("samples.json").then((data)=> {
      
      // Get metadata info for the demographic panel
      var metadata = data.metadata;
      //console.log(metadata)

      // Filter metadata info by id
      var result = metadata.filter(meta => meta.id.toString() === id)[0];

      // Select demographic panel to assign data to
      var demographicInfo = d3.select("#sample-metadata");
      
      // Empty demographic data panel each time before getting new id info
      demographicInfo.html("");

      // Grab the necessary demographic data for the id and append info to the panel
      Object.entries(result).forEach((key) => {   
              demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
  });
}


// Create a function for the change event
function optionChanged(id) {
  getPlot(id);
  getInfo(id);
}

// Create a function for the initial data rendering
function init() {
  // Select dropdown menu 
  var dropdown = d3.select("#selDataset");


  // Fetch/Read-in data from json file
  d3.json("samples.json").then((data)=> {
      //console.log(data)

      // Assign id data to the dropdwown menu
      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      // Call functions to display data and plots to the page
      getPlot(data.names[0]);
      getInfo(data.names[0]);
  });
}

init();
