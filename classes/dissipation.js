/**
 * This class describes the energy dissipation model for the sensor network.
 * If node's energy is finished this model marks the node as dead node.
 */
class EnergyDissipation {
  constructor() {
    /**
     * Clusters of the network.
     * All the nodes in this cluster will be alive.
     */
    this.clusters = null;
    /**
     * If this threshold is reached then stop dissipating energy.
     */
    this.threshold = null;
    /**
     * Selected nodes for transmission per round.
     */
    this.transmittingNodes = [];
    /**
     * Counting the rounds.
     */
    this.round = 0;
    /**
     * variable to stop dissipation.
     */
    this.stopDissipation = false;
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
    this.round++;
    this.transmittingNodes = [];
    let temp;
    // Select clusters for dissipation
    this.clusters.forEach(cluster => {
      if (random(1) < 0.7) {
        // Cluster selected for dissipation.
        temp = [];
        cluster.nodes.forEach(node_index => {
          if (random(1) < 0.3 && !cluster.isDead(node_index)) {
            // Alive node selected for transmission.
            temp.push(node_index);
            cluster
              .transmitPacketFrom(node_index, PACKET_SIZE)
              .updateClusterStatus(node_index);
          }
        });
        this.transmittingNodes.push(temp);
      } else {
        this.transmittingNodes.push([]); // Cluster not selected.
      }
    });
    // Check if any cluster is dead => means CH of a cluster is dead.
    // TODO(Aridaman): Add another stopping criteria
    this.clusters.forEach(cluster => {
      if (cluster.clusterDead) {
        this.stopDissipation = true;
      }
    });
    return this;
  }

  /**
   * Display transmitting nodes.
   */
  displayEnergyDissipation(p) {
    let colorIndex = 0;
    this.clusters.forEach((cluster, index) => {
      cluster.displayEnergyDissipation(
        this.transmittingNodes[index],
        colors[colorIndex],
        p
      );
      colorIndex = (colorIndex + 1) % colorCount;
    });
  }
}
