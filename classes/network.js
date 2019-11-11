/**
 * Network class.
 */
class Network {
  constructor() {
    this.nodes = [];
    this.sinks = [];
    this.distanceMatrix = new Array(NUMBER_OF_NODES);
    for (let i = 0; i < this.distanceMatrix.length; i++) {
      this.distanceMatrix[i] = [];
    }
    this.sinkDistanceMatrix = new Array(NUMBER_OF_NODES);
    for (let i = 0; i < this.sinkDistanceMatrix.length; i++) {
      this.sinkDistanceMatrix[i] = [];
    }

    this.advancedNodes = 0;
    this.intermediateNodes = 0;
    this.normalNodes = 0;

    this.eAdvanced = 0;
    this.eIntermediate = 0;
    this.eNormal = 0;

    /**
     * E_t field
     */
    this.networkEnergy = 0;
    this.eth = 0.3;

    return this;
  }

  /**
   * Network parameters responsible for network performance are initialized.
   */
  initializeNetworkParameters() {
    /**
     * Count of each type of node.
     */
    this.advancedNodes = NUMBER_OF_NODES * ADVANCED_NODE_FRACTION;
    this.intermediateNodes = NUMBER_OF_NODES * INTERMEDIATE_NODE_FRACTION;
    this.normalNodes =
      NUMBER_OF_NODES *
      (1 - ADVANCED_NODE_FRACTION - INTERMEDIATE_NODE_FRACTION);

    /**
     * Energy of each type of node.
     */
    this.eAdvanced =
      E_INITIAL_ENERGY *
      (1 + ENERGY_FRACTION_ADVANCED_ALPHA) *
      NUMBER_OF_NODES *
      ADVANCED_NODE_FRACTION;
    this.eIntermediate =
      E_INITIAL_ENERGY *
      (1 + ENERGY_FRACTION_INTERMEDIATE_BETA) *
      NUMBER_OF_NODES *
      INTERMEDIATE_NODE_FRACTION;
    this.eNormal =
      E_INITIAL_ENERGY *
      (1 - ADVANCED_NODE_FRACTION - INTERMEDIATE_NODE_FRACTION) *
      NUMBER_OF_NODES;

    this.networkEnergy =
      NUMBER_OF_NODES *
      E_INITIAL_ENERGY *
      (1 +
        ENERGY_FRACTION_INTERMEDIATE_BETA * INTERMEDIATE_NODE_FRACTION +
        ADVANCED_NODE_FRACTION * ENERGY_FRACTION_ADVANCED_ALPHA);
    console.log("Network Energy ET: ", this.networkEnergy);
    return this;
  }

  /**
   * Generating the number of nodes.
   * Nodes are generated within the network area based on spawn border.
   */
  generateHeterogenousNodes() {
    let x,
      y,
      xLimit = SPAWN_BORDER + (CWIDTH - 2 * SPAWN_BORDER),
      yLimit = SPAWN_BORDER + (CHEIGHT - 2 * SPAWN_BORDER);
    /**
     * Advanced nodes.
     */
    for (let i = 0; i < this.advancedNodes; i++) {
      this.nodes.push(
        new Node(
          random(SPAWN_BORDER, xLimit),
          random(SPAWN_BORDER, yLimit),
          NODE_TYPE.ADV
        )
      );
    }
    /**
     * Intermediate nodes.
     */
    for (let i = 0; i < this.intermediateNodes; i++) {
      this.nodes.push(
        new Node(
          random(SPAWN_BORDER, xLimit),
          random(SPAWN_BORDER, yLimit),
          NODE_TYPE.INT
        )
      );
    }
    /**
     * Normal nodes.
     */
    for (let i = 0; i < this.normalNodes; i++) {
      this.nodes.push(
        new Node(
          random(SPAWN_BORDER, xLimit),
          random(SPAWN_BORDER, yLimit),
          NODE_TYPE.NRM
        )
      );
    }
    return this;
  }

  /**
   * Function to generate sinks.
   */
  generateSinks() {
    let s = new Sink(CWIDTH / 2, CHEIGHT / 2);
    this.sinks.push(s);
    return this;
  }

  /**
   * Function to calculate the distance between the nodes.
   */
  calculateDistanceBetweenNodes() {
    let d;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.nodes.length; j++) {
        d = dist(
          this.nodes[i].position.x,
          this.nodes[i].position.y,
          this.nodes[j].position.x,
          this.nodes[j].position.y
        );
        this.distanceMatrix[i].push(d);
      }
    }
    return this;
  }

  /**
   * Function to calculate distance between node and sinks.
   */
  calculateDistanceBetweenNodeAndSink() {
    let d;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < this.sinks.length; j++) {
        d = dist(
          this.nodes[i].position.x,
          this.nodes[i].position.y,
          this.sinks[j].position.x,
          this.sinks[j].position.y
        );
        this.sinkDistanceMatrix[i].push(d);
      }
    }
    return this;
  }

  /**
   * Returns closest sink's index corresponding to this node index.
   */
  closestSinkIndex(node_index) {
    let closest = Infinity,
      i = -1;
    this.sinkDistanceMatrix[node_index].forEach((sink_distance, index) => {
      if (sink_distance < closest) {
        closest = sink_distance;
        i = index;
      }
    });
    return i;
  }

  /**
   * Returns farthest sink's index corresponding to this node index.
   */
  farthestSinkIndex(node_index) {
    let farthest = -100,
      i = -1;
    this.sinkDistanceMatrix[node_index].forEach((sink_distance, index) => {
      if (sink_distance > farthest) {
        farthest = sink_distance;
        i = index;
      }
    });
    return i;
  }

  /**
   * Finds the closest cluster head of the parameter node.
   * Returns index of closest cluster head.
   * Returns -1 if no cluster head lie in the vicinity.
   */
  closestClusterHead(node_index, clusterHeadIndices) {
    let closestCHIndex = -1,
      currentDistance = Infinity,
      closestDistance = Infinity;
    clusterHeadIndices.forEach(ch_index => {
      currentDistance = this.distanceMatrix[node_index][ch_index];
      if (currentDistance <= VICINITY && currentDistance < closestDistance) {
        closestDistance = currentDistance;
        closestCHIndex = ch_index;
      }
    });
    return closestCHIndex;
  }

  /**
   * Display function.
   * The length of genes and nodes array is same.
   */
  display(genes) {
    let i;
    // Display the nodes and sinks.
    this.nodes.forEach((node, index) => node.display(genes[index]));
    this.sinks.forEach(sink => sink.display());

    // Display the links between nodes and CH.
    // Find cluster head indices.
    let clusterHeadIndices = [];
    genes.forEach((g, index) => {
      if (g) clusterHeadIndices.push(index);
    });
    this.nodes.forEach((node, index) => {
      // Find cluster head of current node.
      i = this.closestClusterHead(index, clusterHeadIndices);
      if (i == -1) {
        // Link to closest sink.
      } else {
        // Link to the closest cluster head.
        node.displayLink(this.nodes[i], LINK.CH_LINK, color(255, 255, 0));
      }
    });

    // Display link between CH and sink
    clusterHeadIndices.forEach (ch_index => {
      i = this.closestSinkIndex(ch_index);
      this.nodes[ch_index].displayLink(this.sinks[i], LINK.SINK_LINK, color(0, 255, 255));
    });
  }
}
