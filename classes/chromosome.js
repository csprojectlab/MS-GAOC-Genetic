/**
 * Chromosome class.
 * Population is made up of objects of this class.
 */
class Chromosome {
  constructor(network) {
    this.network = network;
    this.size = network.nodes.length;
    this.genes = new Array(this.size)
    this.clusterHeadCount = 0;
    return this;
  }

  /**
   * Validate the current length of the genes array.
   * No two CH's should lie in each others vicinity.
   */
  validGene(index) {
    let d;
    /**
     * Pick the last gene and validate it with previuos genes.
     * This will automatically build valid gene till end.
     */
    // this cluster head should not lie in the vicinity of previously chosed CHs by the gene.
    for (let i = 0; i < this.genes.length; i++) {
      if (i != index && this.genes[i] == 1) {
        // If gene selects node as cluster head.
        d = this.network.distanceMatrix[i][index];
        if (d < VICINITY) return false;
      }
    }
    return true;
  }
  /**
   * generate chromosome.
   * - Some validations need to be done.
   */
  generateChromosome() {
    this.genes.fill(0);
    let selectionGene = this.genes.map((_, index) => index),
        i = 1,
        index,
        limit = floor(random(NUMBER_OF_CH - 3, NUMBER_OF_CH + 1));
    while (i <= limit) {
      index = floor(random(selectionGene.length));
      if (this.validGene(selectionGene[index])) {
        this.genes[selectionGene[index]] = 1;
        i++;
        this.clusterHeadCount++;
      }
      selectionGene.splice(index, 1);
    }
    return this;
  }

  /**
   * FP1
   * Residual energy of a node become an important factor.
   */
  calculateFP1() {
    let fp1 = 0;
    this.network.nodes.forEach(node => {
      fp1 += node.energyFactor();
    });
    fp1 +=
      this.network.nodes.length *
      (this.network.eth / this.network.networkEnergy);
    return fp1;
  }

  /**
   * FP2
   * Distance between node and sink.
   */
  calculateFP2() {
    let fp2 = 0,
      farthestSinkDistance = -100,
      d,
      sum = 0,
      average = 0;
    /**
     * Find the node distance which is farthest from the sink.
     * - Find the farthest sink from each node and update the variable.
     * - Sum the closest distance and find the average distance as well.
     */
    this.network.nodes.forEach((_, node_index) => {
      let i = this.network.farthestSinkIndex(node_index);
      d = this.network.sinkDistanceMatrix[node_index][i];
      if (d > farthestSinkDistance) {
        farthestSinkDistance = d;
        farthestSinkIndex = i;
        nodeIndex = node_index;
      }
    });

    this.network.nodes.forEach((_, node_index) => {
      d = this.network.sinkDistanceMatrix[node_index][
        this.network.closestSinkIndex(node_index)
      ];
      sum += d;
      fp2 += d / farthestSinkDistance;
    });
    average = sum / this.network.nodes.length;
    fp2 += this.network.nodes.length * (1 / average);
    return fp2;
  }

  /**
   * Function to calculate the fitness of network based on this chromosome.
   */
  calculateFitness() {
    let fp1 = this.calculateFP1(),
      fp2 = this.calculateFP2();

    return this;
  }
}
