/**
 * Cluster class.
 * Combines together cluster head and its corresponding nodes.
 */
class Cluster {
  constructor(network, ch_index, nodes = []) {
    this.network = network;
    this.chIndex = ch_index;
    this.sinkIndex = null;
    this.nodes = nodes;
    return this;
  }

  /**
   * Function to add new node in the cluster.
   * Index of the node is sent as parameter.
   */
  addNode(node_index) {
    this.nodes.push(node_index);
    return this;
  }

  /**
   * Function to set the sink of the cluster.
   */
  setSink(sink_index) {
    this.sinkIndex = sink_index;
    return this;
  }

  /**
   * Transmission and receving energy dissipation
   */
  transmitPacketFrom(node_index, bits) {
    let dToCH = this.network.distanceMatrix[node_index][this.chIndex], // Distance between node and CH
      dToSink = this.network.sinkDistanceMatrix[this.chIndex][this.sinkIndex];
    this.network.nodes[node_index].transmitPacket(bits, dToCH); // Transmitting packet to CH.
    this.network.nodes[this.chIndex].receivePacket(bits); // Cluster head receiving packets.
    this.network.nodes[this.chIndex].transmitPacket(bits, dToSink); // Cluster head sending packet to sink.
    return this;
  }

  /**
   * Update the status of CH and network with respect to the parameter node. 
   */
  updateClusterStatus(node_index) {
    if (this.energyFinished(this.chIndex)) {
      this.setDead(this.chIndex);
    }
    if (this.energyFinished(node_index)) {
      this.setDead(node_index)
    }
    return this;
  }

  /**
   * Checking for dead node.
   */
  energyFinished(node_index) {
    return this.network.nodes[node_index].energyFinished();
  }

  /**
   * Function to set node as dead.
   */
  setDead(node_index) {
    this.network.nodes[node_index].setDead();
  }

  /**
   * Function returning whether node is dead or not.
   */
  isDead(node_index) {
    return this.network.nodes[node_index].dead;
  }

  /**
   * Display the cluster.
   */
  display(col) {
    /**
     * Display the sinks.
     */
    this.network.sinks.forEach(sink => sink.display());
    /**
     * Display the cluster head.
     */
    this.network.nodes[this.chIndex].display(1, col, 1);
    /**
     * Display the nodes and CH links with specified color.
     */
    this.nodes.forEach(node_index => {
      this.network.nodes[node_index].display(0, col, 1);
      this.network.nodes[node_index].displayLink(
        this.network.nodes[this.chIndex],
        LINK.CH_LINK,
        col
      );
    });
    /**
     * Display CH and sink link
     */
    this.network.nodes[this.chIndex].displayLink(
      this.network.sinks[this.sinkIndex],
      LINK.SINK_LINK,
      col
    );
  }

  /**
   * Function to display energy dissipation.
   * Display the links of transmitting nodes with CH and CH with the sink.
   */
  displayEnergyDissipation(transmitting_nodes, col = color(255, 255, 0)) {
    /**
     * Display the sinks.
     */
    this.network.sinks.forEach(sink => sink.display());
    /**
     * Display the cluster head.
     */
    this.network.nodes[this.chIndex].display(1, col, 1);
    /**
     * Display cluster nodes
     */
    this.nodes.forEach(node_index =>
      this.network.nodes[node_index].display(0, col, 1)
    );
    // Display links.
    if (transmitting_nodes.length > 0) {
      this.nodes.forEach(node_index => {
        this.network.nodes[node_index].display(0, col, 1);
        if (transmitting_nodes.includes(node_index))
          this.network.nodes[node_index].displayLink(
            this.network.nodes[this.chIndex],
            LINK.CH_LINK,
            col
          );
      });
      /**
       * Display link between CH and sink.
       */
      this.network.nodes[this.chIndex].displayLink(
        this.network.sinks[this.sinkIndex],
        LINK.SINK_LINK,
        col
      );
    }

    return this;
  }
}
