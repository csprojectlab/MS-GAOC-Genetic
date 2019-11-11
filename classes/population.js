/**
 * Population class.
 * The network provided should be already initialized.
 */
class Population {
  constructor(network, population_size = 10) {
    this.network = network;
    this.size = population_size;
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
      if (f < currentFitness) {
        currentFitness = f;
        currentBestIndex = index;
      }
    });
    this.bestChromosomeIndex = currentBestIndex;
    console.log(this.chromosomes[this.bestChromosomeIndex])
    return this;
  }

  /**
   * Crossover function.
   */
  crossover() {}

  /**
   * Mutate function
   */
  mutate() {}

  /**
   * evolution of network population.
   */
  evolve() {}

  /**
   * Display function.
   */
  display() {
    this.network.display(this.chromosomes[chromosomeDisplayIndex].genes);
  }
}
