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
    /**
     * Holds the clusters of the best network selected by GA.
     */
    this.bestNetworkClusters = [];
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
   * Generate clusters of the best network structure.
   * This function should be called after the fittest function is called.
   */
  generateClusters() {
    let bestChromosome = this.chromosomes[this.bestChromosomeIndex],
      clusterHeadIndices = [],
      i = -1;
    this.bestNetworkClusters = [];
    /**
     * Create clusters based on the genes of the best cluster.
     * Pushing the index of the cluster head.
     */
    bestChromosome.genes.forEach((gene, index) => {
      if (gene) {
        // If gene is 1 => chosen as cluster head.
        this.bestNetworkClusters.push(new Cluster(this.network, index));
        clusterHeadIndices.push(index); // Saving the cluster head index.
      }
    });
    /**
     * Add respective sinks to the clusters.
     **/
    this.bestNetworkClusters.forEach(cluster => {
      i = this.network.closestSinkIndex(cluster.chIndex);
      cluster.setSink(i);
    });
    /**
     * Adding nodes to their respective clusters.
     */
    this.network.nodes.forEach((node, index) => {
      // if (node.dead) return;
      // Find the cluster head of this node.
      i = this.network.closestClusterHead(index, clusterHeadIndices);
      if (i == -1) {
        // FIXME(Aridaman): Don't know what to do here
      } else {
        // Filter the cluster head with this index i.
        let clusterHead = this.bestNetworkClusters.filter(
          cluster => cluster.chIndex == i
        )[0];
        /**
         * Add this node to the cluster.
         */
        clusterHead.addNode(index);
      }
    });
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
        childChromosome = parentA.crossover(parentB); // returns a valid chromosome network
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
   * - The display doesnot need genes because cluster already has the required information
   */
  display(p) {
    let colorIndex = 0;
    this.bestNetworkClusters.forEach(cluster => {
      cluster.display(colors[colorIndex], p);
      colorIndex = (colorIndex + 1) % colorCount;
    });
    // this.network.display(this.chromosomes[this.bestChromosomeIndex].genes);
    return this;
  }

  /**
   * Display all
   * p is the canvas on which to draw. 
   */
  displayAll(p) {
    this.chromosomes.forEach(chromosome => {
      this.network.display(chromosome.genes, p);
    });
    return this;
  }
}
