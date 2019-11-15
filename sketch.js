/**
 * Network running variables.
 */
var population,
  network,
  dissipationModel = undefined,
  evolving = true,
  rounds = 0;

/**
 * Display Variables.
 */
var displayClusters = false,
  displayClusterLinks = true,
  displaySinkLinks = false,
  visualizeDissipation = true,
  pause = false;

/**
 * Debugging variables.
 */
var farthestSinkIndex = -1,
  nodeIndex = -1,
  generationCount = 0,
  clusters = null;
//chromosomeDisplayIndex = 0;

/**
 * Best cluster color encoding scheme
 */
var colors = [],
  colorCount = 12;

/**
 * Different canvas
 */
let evolvingCanvas = null,
  bestNetworkCanvas = null,
  dissipationCanvas = null,
  evolvingP5Canvas = null,
  bestNetworkP5Canvas = null,
  dissipationP5Canvas = null;

/**
 * Charts
 */
let aliveNodesChart = null,
  chCountChart = null;

evolvingCanvas = function(p) {
  p.setup = function() {
    p.createCanvas(CWIDTH, CHEIGHT);
  };

  p.draw = function() {
    if (evolving) {
      generationCount++;
      if (generationCount == GENERATIONS) {
        evolving = false;
        generationCount = 0;
        dissipationP5Canvas.loop();
      }
      p.background(255);
      p.strokeWeight(2);
      p.stroke(0);
      p.rect(0, 0, CWIDTH, CHEIGHT);
      displayNetworkBorder(p);
      population
        .fittest()
        .generateClusters()
        .displayAll(p)
        .evolve();
    }
  };
};

bestNetworkCanvas = function(p) {
  p.setup = function() {
    p.createCanvas(CWIDTH, CHEIGHT);
    p.background(0);
  };

  p.draw = function() {
    p.background(255);
    p.strokeWeight(2);
    p.stroke(0);
    p.rect(0, 0, CWIDTH, CHEIGHT);
    displayNetworkBorder(p);
    if (population.bestNetworkClusters.length > 0) {
      population.display(p);
    }
  };
};

dissipationCanvas = function(p) {
  p.setup = function() {
    p.createCanvas(CWIDTH, CHEIGHT);
    p.background(255);
  };

  p.draw = function() {
    p.strokeWeight(2);
    p.stroke(0);
    p.rect(0, 0, CWIDTH, CHEIGHT);
    displayNetworkBorder(p);
    if (!evolving) {
      evolvingP5Canvas.noLoop();
      p.frameRate(100);
      p.background(255);
      p.strokeWeight(2);
      p.stroke(0);
      p.rect(0, 0, CWIDTH, CHEIGHT);
      displayNetworkBorder(p);
      if (dissipationModel == undefined) {
        dissipationModel = new EnergyDissipation()
          .addClusters(population.bestNetworkClusters)
          .setThreshold(1);
      }
      if (visualizeDissipation) {
        dissipationModel
          .dissipateForVisualization()
          .displayEnergyDissipation(p);
      } else {
        dissipationModel.dissipateData(); // Without Visualization.
      }
      //dissipationModel.dissipateData(p); //.displayEnergyDissipation(p);
      if (dissipationModel.stopDissipation) {
        console.log("Cluster head dead");
        rounds += dissipationModel.round;
        dissipationModel = undefined; // Will be initialized with new clusters next time.
        population = new Population(network, POPULATION_SIZE, true)
          .boot()
          .generateChromosomePopulation();
        evolving = true; // Start evolving the structure again.
        dissipationP5Canvas.noLoop();
        evolvingP5Canvas.loop();
      }
    }
  };
};

function setup() {
  /**
   * Randomly setting the color scheme.
   */
  for (let i = 0; i < colorCount; i++)
    colors.push(color(COLOR_CODES[i][0], COLOR_CODES[i][1], COLOR_CODES[i][2]));
  /**
   * Network setup:
   * - Initialize parameters
   * - generate nodes based on parameters
   * - generate sinks
   * - calculate distances
   */
  network = new Network()
    .initializeNetworkParameters()
    .generateHeterogenousNodes()
    .calculateEnergy()
    .generateSinks()
    .calculateDistanceBetweenNodes()
    .calculateDistanceBetweenNodeAndSink();
  population = new Population(network, POPULATION_SIZE, true)
    .boot()
    .generateChromosomePopulation();

  evolvingP5Canvas = new p5(evolvingCanvas, "evolution-canvas");
  bestNetworkP5Canvas = new p5(bestNetworkCanvas, "best-network-canvas");
  dissipationP5Canvas = new p5(dissipationCanvas, "dissipation-canvas");
  dissipationP5Canvas.noLoop();
  setupCharts();
}

/**
 * Draw Network Area.
 * Its a rectangle based on the spawn border.
 */
function displayNetworkBorder(p) {
  p.stroke(0, 255, 0);
  p.strokeWeight(2);
  p.noFill();
  p.rect(
    SPAWN_BORDER,
    SPAWN_BORDER,
    CWIDTH - 2 * SPAWN_BORDER,
    CHEIGHT - 2 * SPAWN_BORDER
  );
}

/**
 * For debugging and interation purpose.
 */
function keyPressed() {
  if (key == "c" || key == "C") displayClusters = !displayClusters;
  else if (key == "l" || key == "L") displayClusterLinks = !displayClusterLinks;
  else if (key == "s" || key == "S") displaySinkLinks = !displaySinkLinks;
  else if (key == "p" || key == "P") {
    pause = !pause;
    if (pause) {
      noLoop();
      evolvingP5Canvas.noLoop();
      bestNetworkP5Canvas.noLoop();
      dissipationP5Canvas.noLoop();
    } else {
      loop();
      evolvingP5Canvas.loop();
      bestNetworkP5Canvas.loop();
      dissipationP5Canvas.loop();
    }
  } else if (key == "f" || key == "F")
    visualizeDissipation = !visualizeDissipation;
}

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
      aliveNodesChart = createChart1(c, "line");
    };
  }, "alive-nodes-div");
  /**
   * Number of CH chart
   */
  new p5(p => {
    p.setup = function () {
      let c = document.getElementById("ch-count-chart").getContext("2d");
      chCountChart = createChart1(c, "horizontalBar");
    }
  }, "ch-count-div");
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

setInterval(() => {
  addData(aliveNodesChart, "Magenta", Math.random()*20)
  addData(chCountChart, "magenta", Math.random()*20)
}, 3000)

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
  });
  chart.update();
}
