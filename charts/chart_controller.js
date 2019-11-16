/**
 * We are creating canvas inside p5 component because we have to get the 2d context
 */
function setupCharts() {
  /**
   * Alive nodes chart
   */
  new p5(p => {
    p.setup = function() {
      let c = document.getElementById("alive-nodes-chart").getContext("2d");
      aliveNodesChart = createChart(
        c,
        "line",
        "# of alive nodes",
        [],
        aliveNodesDataset
      );
    };
  }, "alive-nodes-div");
  /**
   * Number of CH chart
   */
  new p5(p => {
    p.setup = function() {
      let c = document.getElementById("ch-count-chart").getContext("2d");
      chCountChart = createChart(c, "bar", "# of CH", [], chCountDataset);
    };
  }, "ch-count-div");
  /**
   * Packets to sink chart. Total number of packets in one round.
   */
  new p5(p => {
    p.setup = function() {
      let c = document.getElementById("packets-to-sink-chart").getContext("2d");
      packetsToSinkChart = createChart(
        c,
        "horizontalBar",
        "# of packets to sink",
        [],
        packetsToSinkDataset
      );
    };
  }, "packets-to-sink-div");
}

function createChart(canvas, t, l, labels_array, data_array) {
  var myChart = new Chart(canvas, {
    type: t,
    data: {
      labels: labels_array,
      datasets: [
        {
          label: l,
          data: data_array,
          backgroundColor: [
            // "rgba(255, 99, 132, 0.2)",
            // "rgba(54, 162, 235, 0.2)",
            // "rgba(255, 206, 86, 0.2)",
            // "rgba(75, 192, 192, 0.2)",
            // "rgba(153, 102, 255, 0.2)",
            // "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            // "rgba(255, 99, 132, 1)",
            // "rgba(54, 162, 235, 1)",
            // "rgba(255, 206, 86, 1)",
            // "rgba(75, 192, 192, 1)",
            // "rgba(153, 102, 255, 1)",
            // "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
  return myChart;
}

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach(dataset => {
    dataset.data.push(data);
    let r = random(255),
      g = random(255),
      b = random(255),
      bg = `rgba(${r}, ${g}, ${b}, 0.2)`,
      borderC = `rgba(${r}, ${g}, ${b}, 1)`;
    dataset.backgroundColor.push(bg);
    dataset.borderColor.push(borderC);
  });
  chart.update();
}

function createChart1(canvas, t) {
  var myChart = new Chart(canvas, {
    type: t,
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
  return myChart;
}
