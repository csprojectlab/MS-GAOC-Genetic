/**
 * Population class.
 * The network provided should be already initialized.
 */
class Population {
  constructor(network, population_size = 10, elitism) {
    this.network = network;
    this.size = population_size;
    this.elitism = elitism;
    /**
     * 2-D array holding the population used for selection of CH.
     */
    this.chromosomes = null;
    this.bestChromosomeIndex = -1;
    return this;
  }

  /**
   * Boot function for population.
   */
  boot() {
    /**
     * Initialize chromosomes array.
     * - Number of chromosomes are equal to the size of the population.
     * - Each chromosome has genes equal to the number of nodes in the network.
     */
    this.chromosomes = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
      this.chromosomes[i] = new Chromosome(this.network);
      //this.chromosomes[i].calculateFitness();
    }
    return this;
  }

  /**
   * Generate chromosomes.
   */
  generateChromosomePopulation() {
    this.chromosomes.forEach(chromosome => chromosome.generateChromosome());
    return this;
  }

  /**
   * Find the fittest network structure.
   */
  fittest() {
    let currentFitness = this.chromosomes[0].calculateFitness(),
      f = 0,
      currentBestIndex = 0;
    this.chromosomes.forEach((chromosome, index) => {
      if (index == 0) return;
      f = chromosome.calculateFitness();
      if (f > currentFitness) {
        currentFitness = f;
        currentBestIndex = index;
      }
    });
    this.bestChromosomeIndex = currentBestIndex;
    return this;
  }

  /**
   * Normalize the fitness value.
   * Save the normalized fitness value in the chromosome itself.
   */
  normalizeFitness() {
    let sum = 0;
    this.chromosomes.forEach(chromosome => (sum += chromosome.fitness));
    this.chromosomes.forEach(chromosome => (chromosome.fitness /= sum));
  }

  /**
   * Create mating pool for cross over.
   * This should be called after normalizing the fitness of network.
   */
  createMatingPool() {
    let matingPool = [],
      limit;
    this.chromosomes.forEach((chromosome, index) => {
      limit = chromosome.fitness * 1000;
      for (let i = 0; i < limit; i++) matingPool.push(index);
    });
    return matingPool;
  }

  /**
   * evolution of network population.
   */
  evolve() {
    this.normalizeFitness();
    let matingPool = this.createMatingPool(),
      newChromosomes = [],
      offset = 0,
      parentA,
      parentB,
      childChromosome;
    if (this.elitism) {
      newChromosomes.push(this.chromosomes[this.bestChromosomeIndex].copy());
      offset = 1;
    }
    while (newChromosomes.length < this.size) {
      if (random(1) < CROSSOVER_RATE) {
        // Select two parents.
        parentA = this.chromosomes[
          matingPool[floor(random(matingPool.length))]
        ];
        parentB = this.chromosomes[
          matingPool[floor(random(matingPool.length))]
        ];
        childChromosome = parentA.crossover(parentB);   // returns a valid chromosome network
        if (childChromosome) {
          childChromosome.mutate(MUTATION_RATE);
          newChromosomes.push(childChromosome);
        } else {
          console.log("null child");
        }
      } else {
        newChromosomes.push(this.chromosomes[offset].copy());
        offset++;
      }
    }

    this.chromosomes = newChromosomes;
    return this;
  }

  /**
   * Display function. 
   * - Display the best network structure. 
   */
  display() {
    this.network.display(this.chromosomes[this.bestChromosomeIndex].genes);
    return this;
  }

  /**
   * Display all 
   */
  displayAll() {
    this.chromosomes.forEach (chromosome => {
      this.network.display(chromosome.genes);
    })
  }
}
