/**
 * This class describes the energy dissipation model for the sensor network.
 * If node's energy is finished this model marks the node as dead node.
 */
class EnergyDissipation {
  constructor(network) {
    this.network = network;
    this.thresholdToStop = 0;
    /**
     * Clusters of the network.
     * All the nodes in this cluster will be alive.
     */
    this.clusters = null;
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
    /**
     * Counting packets sent to base station.
     */
    this.packetsSent = 0;
    /**
     * Cluster head dead notification.
     */
    this.clusterHeadDead = false;
    return this;
  }

  /**
   * Function to set the threshold value
   */
  setThreshold(network_threshold_energy) {
    this.thresholdToStop =
      this.network.networkEnergy - network_threshold_energy;
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
    while (!this.stopDissipation) {
      this.dissipate();
    }
    return this;
  }

  dissipateForVisualization() {
    return this.dissipate();
  }

  dissipate() {
    this.round++;
    this.transmittingNodes = [];
    let temp;
    for (let i = 0; i < this.clusters.length; i++) {
      let cluster = this.clusters[i];
      if (random(1) < 0.7) {
        temp = [];
        for (let j = 0; j < cluster.nodes.length; j++) {
          let node_index = cluster.nodes[j];
          if (random(1) < 0.4 && !cluster.isDead(node_index)) {
            temp.push(node_index);
            this.packetsSent++;
            cluster
              .transmitPacketFrom(node_index, PACKET_SIZE)
              .updateClusterStatus(node_index);
            this.network.calculateEnergy();
            if (this.network.networkEnergy <= this.thresholdToStop) {
              this.stopDissipation = true;
              console.log("Energy deficient");
              break;
            }
            if (cluster.clusterDead) {
              this.stopDissipation = true;
              this.clusterHeadDead = true;
              console.log("Dead")
              break;
            }
          }
        }
        if (this.stopDissipation)
          break;
      } else {
        this.transmittingNodes.push([]);
      }
    }
  }

  dissipate1() {
    this.round++;
    this.transmittingNodes = [];
    let temp;
    // Select clusters for dissipation
    this.clusters.forEach(cluster => {
      if (random(1) < 0.7) {
        // Cluster selected for dissipation.
        temp = [];
        cluster.nodes.forEach(node_index => {
          if (random(1) < 0.5 && !cluster.isDead(node_index)) {
            // Alive node selected for transmission.
            temp.push(node_index);
            this.packetsSent++;
            cluster
              .transmitPacketFrom(node_index, PACKET_SIZE)
              .updateClusterStatus(node_index);
          }
        });
        this.transmittingNodes.push(temp);
      } else {
        this.transmittingNodes.push([]); // Cluster not selected.
      }
      // this.packetsSent += this.transmittingNodes.length;
    });
    // Check if any cluster is dead => means CH of a cluster is dead.
    // TODO(Aridaman): Add another stopping criteria
    this.network.calculateEnergy();
    // console.log(this.network.networkEnergy)
    if (this.network.networkEnergy <= this.thresholdToStop) {
      this.stopDissipation = true;
      console.log("Energy deficient");
    }
    this.clusters.forEach(cluster => {
      if (cluster.clusterDead) {
        this.stopDissipation = true;
        this.clusterHeadDead = true;
        // console.log("Cluster head dead")
        // selectionProb += 0.1;
        // if (selectionProb >= 0.95)
        //   selectionProb = 0.95;
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
