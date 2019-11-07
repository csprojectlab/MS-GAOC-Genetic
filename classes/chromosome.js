/**
 * Chromosome class.
 * Population is made up of objects of this class.
 */
class Chromosome {
  constructor(network) {
    this.network = network;
    this.genes = new Array(network.nodes.length);
    return this;
  }

  /**
   * generate chromosome.
   * - Some validations need to be done.
   */
  generateChromosome() {
    for (let i = 0; i < this.genes.length; i++) {
      if (random(1) < 0.7) this.genes[i] = 0;
      else this.genes[i] = 1;
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
      d = this.network.sinkDistanceMatrix[node_index][
        this.network.farthestSinkIndex(node_index)
      ];
      if (d > farthestSinkDistance) farthestSinkDistance = d;
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
