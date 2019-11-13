/**
 * Network running variables.
 */
var population,
  network,
  dissipationModel = undefined,
  evolving = true;

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

/**
 * Best cluster color encoding scheme
 */
var colors = [],
  colorCount = 15;

function setup() {
  createCanvas(OWIDTH, OHEIGHT);
  // frameRate(10);
  /**
   * Randomly setting the color scheme.
   */
  for (let i = 0; i < colorCount; i++)
    colors.push(
      color(floor(random(100)), floor(random(255)), floor(random(200)))
    );
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
}

/**
 * Draw loop running atleast 60 frames or times per second.
 */
function draw() {
  background(255);
  stroke(0);
  strokeWeight(7);
  noFill();
  rect(0, 0, OWIDTH, OHEIGHT);

  if (generationCount == GENERATIONS) {
    alert("Network stable");
    evolving = false;
    generationCount = 0;
  }
  /**
   * Display the network border in rectangular form.
   * Required for MS-GAOC.
   */
  displayNetworkBorder();
  if (evolving) {
    generationCount++;
    population.fittest().generateClusters();
  }
  /**
   * Display the best network structure.
   */
  push();
  translate(CWIDTH, 0);
  stroke(0);
  strokeWeight(4);
  line(0, 0, 0, OHEIGHT);
  displayNetworkBorder();
  population.display();
  pop();

  /**
   * Display all network structures being evaluated and evole the network.
   */
  push();
  translate(0, 0);
  if (evolving) {
    population.displayAll();
    population.evolve();
  } else {
    /**
     * Not evolving then dissipate energy.
     */
    if (dissipationModel == undefined) {
      dissipationModel = new EnergyDissipation()
        .addClusters(population.bestNetworkClusters)
        .setThreshold(1);
    }
    dissipationModel.dissipateData().displayEnergyDissipation();
    // console.log(dissipationModel)
    // noLoop();
  }
  pop();
}

/**
 * Draw Network Area.
 * Its a rectangle based on the spawn border.
 */
function displayNetworkBorder() {
  stroke(0, 255, 0);
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
// TODO(Aridaman): Change the selection method to rank selection
