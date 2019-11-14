/**
 * Node class.
 */
class Node {
  constructor(x, y, type) {
    this.position = createVector(x, y);
    this.type = type;
    switch (type) {
      case NODE_TYPE.ADV:
        this.eMax = 10;
        break;
      case NODE_TYPE.INT:
        this.eMax = 5;
        break;
      case NODE_TYPE.NRM:
        this.eMax = 3;
        break;
    }
    this.residualEnergy = this.eMax;
    this.dead = false;
  }

  /**
   * Calculate the energy factor.
   */
  energyFactor() {
    let eFactor = this.residualEnergy / this.eMax;
    return eFactor;
  }  

  /**
   * Function to transmit packet. 
   */
  transmitPacket(bits, d) {
    let energyConsumed = 0;
    if (d < D_O) {
      energyConsumed = bits * E_ELC + bits * E_EFS * Math.pow(d, 2);
    } else {
      energyConsumed = bits * E_ELC + bits * E_AMP * Math.pow(d, 4);
    }
    this.residualEnergy -= energyConsumed;
  }

  /**
   * Function receiving packets. 
   */
  receivePacket (bits) {
    let energyConsumed = bits * E_ELC;
    this.residualEnergy -= energyConsumed;
  }

  /**
   * Function to check if node is dead or not. 
   */
  energyFinished () {
    return this.residualEnergy <= 0;
  }

  /**
   * Function to set node as dead. 
   */
  setDead () {
    this.residualEnergy = 0;
    this.dead = true;
  }

  /**
   * Display the link with another node.
   */
  displayLink(otherNode, link_type, col) {
    if (this.dead)
      return;
    stroke(col);
    strokeWeight(1);
    switch (link_type) {
      case LINK.CH_LINK:
        if (!displayClusterLinks) return;
        line(
          this.position.x,
          this.position.y,
          otherNode.position.x,
          otherNode.position.y
        );
        break;
      case LINK.SINK_LINK:
        if (!displaySinkLinks) return;
        line(
          this.position.x,
          this.position.y,
          otherNode.position.x,
          otherNode.position.y
        );
        break;
    }
  }

  /**
   * Display function based on type of node.
   */
  display(isCH, col = color(0, 255, 0), stroke_weight = 0.3) {
    noFill();
    if (isCH) fill(col);
    if (this.dead)  {
      fill(0);
      ellipse(this.position.x, this.position.y, 3, 3)
      return;
    }
    stroke(0);
    strokeWeight(stroke_weight);

    switch (this.type) {
      case NODE_TYPE.ADV:
        triangle(
          this.position.x,
          this.position.y,
          this.position.x - 8,
          this.position.y + 8,
          this.position.x + 8,
          this.position.y + 8
        );
        break;
      case NODE_TYPE.NRM:
        ellipse(this.position.x, this.position.y, 8, 8);
        break;
      case NODE_TYPE.INT:
        rect(this.position.x, this.position.y, 10, 10);
        break;
    }
    if (isCH && displayClusters) {
      noFill();
      stroke(col);
      strokeWeight(stroke_weight);
      ellipse(this.position.x, this.position.y, 2 * VICINITY);
    }
  }
}
