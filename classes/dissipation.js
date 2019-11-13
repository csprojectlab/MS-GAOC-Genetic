/**
 * This class describes the energy dissipation model for the sensor network.
 * If node's energy is finished this model marks the node as dead node.
 */
class EnergyDissipation {
  constructor(network) {
    /**
     * Network to operate on.
     */
    this.network = network;
    /**
     * Clusters of the network.
     */
    this.clusters = null;
    /**
     * If this threshold is reached then stop dissipating energy.
     */
    this.threshold = null;
    return this;
  }

  /**
   * Function to set the threshold value
   */
  setThreshold(network_threshold_energy) {
    this.threshold = network_threshold_energy;
    return this;
  }

  /**
   * Function to add the clusters.
   */
  addClusters(clusters) {
    this.clusters = clusters;
    return this;
  }

  /**
   * Simulation function for Dissipating data
   * - Clusters should be added before dissipating energy
   */
  dissipateData() {
    // Select clusters for dissipation
    // Choose the nodes within cluster for sending data
    this.network.nodes.forEach(node => {
      node.transmitPacket(PACKET_SIZE, 80);
    })
  }

  /**
   * Function to mark node as dead node.
   */
  setDead(node_index) {
    this.network.nodes[node_index].dead = true;
  }
}
