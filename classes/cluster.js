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
    this.network.nodes[this.chIndex].display(1, col);
    /**
     * Display the nodes and CH links with specified color.
     */
    this.nodes.forEach(node_index => {
      this.network.nodes[node_index].display(0, col);
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
}
