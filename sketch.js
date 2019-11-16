/**
 * Network running variables.
 */
var population,
  network,
  dissipationModel = undefined,
  evolving = true,
  rounds = [];

/**
 * Display Variables.
 */
var displayClusters = false,
  displayClusterLinks = true,
  displaySinkLinks = false,
  visualizeDissipation = false,
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
  chCountChart = null,
  packetsToSinkChart = null,
  totalEnergyChart = null,
  stabilityPeriodChart = null;

/**
 *Charts dataset
 */
let aliveNodesDataset = [],
  chCountDataset = [],
  packetsToSinkDataset = [],
  totalEnergyDataset = [],
  stabilityPeriodDataset = [];

var selectionProb = 0.05,
  thresholding = 0.015;

/**
 * Screen displaying
 */
let evolvingScreen = false,
  bestNetworkScreen = true,
  dissipationScreen = false;

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
      population.fittest().generateClusters();
      if (evolvingScreen) population.displayAll(p);
      population.evolve();
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
      if (bestNetworkScreen)
        population.display(p)
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
      //evolvingP5Canvas.noLoop();
      p.frameRate(100);
      p.background(255);
      p.strokeWeight(2);
      p.stroke(0);
      p.rect(0, 0, CWIDTH, CHEIGHT);
      displayNetworkBorder(p);
      if (dissipationModel == undefined) {
        network.calculateEnergy();
        dissipationModel = new EnergyDissipation(network)
          .addClusters(population.bestNetworkClusters)
          .setThreshold(thresholding * network.networkEnergy);
      }
      if (dissipationScreen) {
        dissipationModel
          .dissipateForVisualization()
          .displayEnergyDissipation(p);
      } else {
        dissipationModel.dissipateData(); // Without Visualization.
      }
      //dissipationModel.dissipateData(p); //.displayEnergyDissipation(p);
      if (dissipationModel.stopDissipation) {
        thresholding += 0.05;
        if (thresholding >= 0.9) thresholding = 0.8;
        rounds.push(
          rounds.length == 0
            ? dissipationModel.round
            : rounds[rounds.length - 1] + dissipationModel.round
        );
        /**
         * Update charts.
         */
        addData(
          chCountChart,
          rounds[rounds.length - 1],
          population.bestNetworkClusters.length
        );
        if (dissipationModel.clusterHeadDead) {
          addData(
            stabilityPeriodChart,
            rounds[rounds.length - 1],
            network.nodes.filter(n => n.dead == true).length
          );
        }
        addData(
          aliveNodesChart,
          rounds[rounds.length - 1],
          network.nodes.filter(n => n.dead == false).length
        );
        addData(
          packetsToSinkChart,
          rounds[rounds.length - 1],
          dissipationModel.packetsSent
        );
        addData(
          totalEnergyChart,
          rounds[rounds.length - 1],
          network.networkEnergy
        );
        // addData(
        //   totalEnergyChart,
        //   rounds[rounds.length - 1],
        //   network.totalRemainingEnergy()
        // );
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

$(document).ready(function() {
  $("#evolvingScreen").click(function() {
    $(this).text(function(i, v) {
      evolvingScreen = !evolvingScreen;
      return v == "Turn On Display" ? "Turn Off Display" : "Turn On Display";
    });
  });

  $("#bestNetworkScreen").click(function() {
    $(this).text(function(i, v) {
      bestNetworkScreen = !bestNetworkScreen;
      return v == "Turn On Display" ? "Turn Off Display" : "Turn On Display";
    });
  });

  $("#dissipationScreen").click(function() {
    $(this).text(function(i, v) {
      dissipationScreen = !dissipationScreen;
      return v == "Turn On Display" ? "Turn Off Display" : "Turn On Display";
    });
  });
});
