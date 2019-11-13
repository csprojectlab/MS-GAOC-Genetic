/**
 * Network running variables.
 */
var population, network;

/**
 * Display Variables.
 */
var displayClusters = false,
  displayClusterLinks = true,
  displaySinkLinks = false,
  pause = false;

/**
 * Debugging variables.
 */
var farthestSinkIndex = -1,
  nodeIndex = -1,
  generationCount = 0;
//chromosomeDisplayIndex = 0;

function setup() {
  createCanvas(OWIDTH, OHEIGHT);
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
    .generateChromosomePopulation(); //.fittest()//.evolve();
}

/**
 * Draw loop running atleast 60 frames or times per second.
 */
function draw() {
  background(255);
  stroke(0);
  strokeWeight(7);
  noFill();
  rect (0, 0, OWIDTH, OHEIGHT);
  generationCount++;
  if (generationCount == 300) {
    alert("Network stable");
    // noLoop();
  }
  // console.log(generationCount)
  /**
   * Display the network border in rectangular form.
   * Required for MS-GAOC.
   */
  displayNetworkBorder();
  population.fittest().display();
  push();
  translate(CWIDTH, 0);
  stroke(0);
  strokeWeight(4);
  line(0, 0, 0, OHEIGHT);
  displayNetworkBorder();
  population.displayAll();
  pop();
  population.evolve();
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
  else if (key == "p" || key == "P") {
    pause = !pause;
    if (pause) noLoop();
    else loop();
  } 
}

// TODO(Aridaman): Start working on clusters and energy dissipation in respective branch
// TODO(Aridaman): Create a cluster class 
// TODO(Aridaman): Display the best network as cluster class

