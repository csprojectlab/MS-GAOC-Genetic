/**
 * Network running variables.
 */
var population, network;

/**
 * Display Variables.
 */
var displayClusters = false,
  displayClusterLinks = true,
  displaySinkLinks = true;

/**
 * Debugging variables.
 */
var farthestSinkIndex = -1,
  nodeIndex = -1,
  generationCount = 0;
//chromosomeDisplayIndex = 0;

function setup() {
  createCanvas(CWIDTH, CHEIGHT);
  frameRate(10);
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
    .generateSinks()
    .calculateDistanceBetweenNodes()
    .calculateDistanceBetweenNodeAndSink();

  population = new Population(network, POPULATION_SIZE, true)
    .boot()
    .generateChromosomePopulation()//.fittest()//.evolve();
}

/**
 * Draw loop running atleast 60 frames or times per second.
 */
function draw() {
  background(0);
  generationCount++;
  if (generationCount == 300) {
    alert("Network stable");
    noLoop();
  }
  // console.log(generationCount)
  /**
   * Display the network border in rectangular form.
   * Required for MS-GAOC.
   */
  displayNetworkBorder();
  population
    .fittest()
    .display()
    .evolve();
}

/**
 * Draw Network Area.
 * Its a rectangle based on the spawn border.
 */
function displayNetworkBorder() {
  stroke(0, 0, 255);
  strokeWeight(2);
  noFill();
  rect(
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
  else if (key == 'p' || key == 'P') noLoop();
}
