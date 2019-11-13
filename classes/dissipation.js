/**
 * This class describes the energy dissipation model for the sensor network.
 * If node's energy is finished this model marks the node as dead node. 
 */
class EnergyDissipation {
  constructor(network, network_threshold_energy) {
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
    this.threshold = network_threshold_energy;
    return this;
  }

  /**
   * Function to add the clusters. 
   */
  addClusters (clusters) {
    this.clusters = clusters;
    return this;
  }

  /**
   * Simulation function for Dissipating data
   */
  dissipateData() {}

  /**
   * Function to mark node as dead node. 
   */
  setDead (node_index) {
      this.network.nodes[node_index].dead = true;
  }
}
