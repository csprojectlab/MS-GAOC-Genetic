/**
 * Chromosome class.
 * Population is made up of objects of this class.
 */
class Chromosome {
  constructor(network) {
    this.network = network;
    this.size = network.nodes.length;
    this.genes = new Array(this.size).fill(0);
    this.clusterHeadCount = 0;
    this.fitness = 0;
    return this;
  }

  /**
   * Copy function.
   */
  copy() {
    let chromeCopy = new Chromosome(this.network);
    chromeCopy.genes = this.genes;
    chromeCopy.clusterHeadCount = this.clusterHeadCount;
    chromeCopy.fitness = this.fitness;
    return chromeCopy;
  }

  /**
   * Validate the current length of the genes array.
   * No two CH's should lie in each others vicinity.
   */
  validGene(genes, index) {
    let d;
    /**
     * Pick the last gene and validate it with previuos genes.
     * This will automatically build valid gene till end.
     */
    // this cluster head should not lie in the vicinity of previously chosed CHs by the gene.
    for (let i = 0; i < genes.length; i++) {
      // Don't check the node with itself.
      if (i != index) {
        // If corresponding node is selected as cluster head.
        if (genes[i] == 1) {
          // Selected cluster head is already dead.
          if (this.network.nodes[i].dead) return false;
          else {
            d = this.network.distanceMatrix[i][index];
            if (d < VICINITY) return false;
          }
        }
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
    let selectionGene = [],//this.genes.filter((gene, index) => index),
      i = 1,
      index,
      limit = floor(random(NUMBER_OF_CH - 3, NUMBER_OF_CH + 1));
    this.genes.forEach((gene, index) => {
      if (!this.network.nodes[index].dead)
        selectionGene.push(index);
    })
    while (i <= limit) {
      // console.log("Finding")
      index = floor(random(selectionGene.length));
      if (this.validGene(this.genes, selectionGene[index])) {
        this.genes[selectionGene[index]] = 1;
        i++;
      }
      selectionGene.splice(index, 1);
    }
    this.clusterHeadCount = this.genes.filter(value => value == 1).length;
    return this;
  }

  /**
   * FP1
   * Residual energy of a node become an important factor.
   */
  calculateFP1() {
    let fp1 = 0;
    this.network.nodes.forEach(node => {
      if (!node.dead) fp1 += node.energyFactor();
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
    this.network.nodes.forEach((node, node_index) => {
      if (node.dead) return;
      let i = this.network.farthestSinkIndex(node_index);
      d = this.network.sinkDistanceMatrix[node_index][i];
      if (d > farthestSinkDistance) {
        farthestSinkDistance = d;
        farthestSinkIndex = i;
        nodeIndex = node_index;
      }
    });

    this.network.nodes.forEach((node, node_index) => {
      if (node.dead) return;
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
   * FP3
   * Node density around the cluster head.
   */
  calculateFP3() {
    let nodeCount = 0,
      countedNodes = [];
    /**
     * Process only cluster heads
     */
    this.genes.forEach((geneValue, index) => {
      if (geneValue) {
        // Find number of nodes in the vicinity of corresponding node to this gene value.
        this.network.distanceMatrix[index].forEach((d, other_node_index) => {
          if (
            !this.network.nodes[other_node_index].dead &&
            d < VICINITY &&
            !countedNodes.includes(other_node_index)
          ) {
            nodeCount++;
            countedNodes.push(other_node_index);
          }
        });
      }
    });
    return nodeCount;
  }

  /**
   * Function to calculate the fitness of network based on this chromosome.
   */
  calculateFitness() {
    let fp1 = this.calculateFP1(),
      fp2 = this.calculateFP2(),
      fp3 = this.calculateFP3(),
      f = VARPHI * fp1 + DELTA * fp2 + GAMMA * fp3;
    this.fitness = f;
    this.fitness = pow(this.fitness, 2); // Increasing fitness amplitude.
    return this.fitness;
  }

  /**
   * Crossover function.
   * Returns null is crossover is not succcessful or valid.
   * Performs one point crossover.
   */
  crossover(partner) {
    let child = null,
      cutPoint = floor(random(this.genes.length)),
      childGenes = [],
      valid = true;
    for (let i = 0; i < this.genes.length; i++) {
      if (i < cutPoint) {
        childGenes.push(this.genes[i]);
      } else {
        childGenes.push(partner.genes[i]);
      }
    }
    for (let i = 0; i < childGenes.length; i++) {
      if (childGenes[i] == 1) {
        if (!this.validGene(childGenes, i)) {
          valid = false;
          break;
        }
      }
    }
    if (valid) {
      child = new Chromosome(this.network);
      child.genes = childGenes;
      child.clusterHeadCount = child.genes.filter(x => x == 1).length;
    }
    return child;
  }

  /**
   * Mutate function
   */
  mutate(mutation_rate) {
    for (let i = 0; i < this.genes.length; i++) {
      if (random(1) < mutation_rate) {
        if (this.genes[i] == 0) {
          // Means we have to make this 1.
          if (this.validGene(this.genes, i)) this.genes[i] = 1;
        } else {
          this.genes[i] = 0;
        }
      }
    }
  }
}
