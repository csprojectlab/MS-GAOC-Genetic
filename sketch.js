/**
 * Network running variables.
 */
var population, network;

/**
 * Debugging variables.
 */
var farthestSinkIndex = -1,
  nodeIndex = -1;
  //chromosomeDisplayIndex = 0;

function setup() {
  createCanvas(CWIDTH, CHEIGHT);
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

  population = new Population(network, POPULATION_SIZE)
    .boot()
    .generateChromosomePopulation().fittest();
}

/**
 * Draw loop running atleast 60 frames or times per second.
 */
function draw() {
  background(0);
  /**
   * Display the network border in rectangular form.
   * Required for MS-GAOC.
   */
  displayNetworkBorder();
  // population.fittest().display();
  population.display();
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
 * For debugging purpose.
 */
function keyPressed() {
  // // console.log("Key pressed. ")
  // if (key == "n" || key == "N") {
  //   chromosomeDisplayIndex = (chromosomeDisplayIndex + 1) % POPULATION_SIZE;
  //   console.log(
  //     population.chromosomes[chromosomeDisplayIndex].clusterHeadCount
  //   );
  // }
}
