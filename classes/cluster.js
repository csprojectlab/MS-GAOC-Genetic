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
    let d = this.network.distanceMatrix[node_index][this.chIndex]; // Distance between node and CH
    this.network.nodes[node_index].transmitPacket(bits, d);
    return this;
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
     * Display cluster nodes and transmission links.
     */
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
    return this;
  }
}
