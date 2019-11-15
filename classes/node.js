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
  receivePacket(bits) {
    let energyConsumed = bits * E_ELC;
    this.residualEnergy -= energyConsumed;
  }

  /**
   * Function to check if node is dead or not.
   */
  energyFinished() {
    return this.residualEnergy <= 0;
  }

  /**
   * Function to set node as dead.
   */
  setDead() {
    this.residualEnergy = 0;
    this.dead = true;
  }

  /**
   * Display the link with another node.
   */
  displayLink(otherNode, link_type, col, p) {
    p.push();
    if (this.dead) return;
    p.stroke(col);
    p.strokeWeight(1);
    switch (link_type) {
      case LINK.CH_LINK:
        if (!displayClusterLinks) return;
        p.line(
          this.position.x,
          this.position.y,
          otherNode.position.x,
          otherNode.position.y
        );
        break;
      case LINK.SINK_LINK:
        if (!displaySinkLinks) return;
        p.line(
          this.position.x,
          this.position.y,
          otherNode.position.x,
          otherNode.position.y
        );
        break;
    }
    p.pop();
  }

  /**
   * Display function based on type of node.
   */
  display(isCH, p, col = color(0, 255, 0), stroke_weight = 0.3) {
    p.push();
    p.noFill();
    if (isCH) p.fill(col);
    if (this.dead) {
      p.fill(0);
      // ellipse(this.position.x, this.position.y, 3, 3)
      // return;
    }
    p.stroke(0);
    p.strokeWeight(stroke_weight);

    switch (this.type) {
      case NODE_TYPE.ADV:
        p.triangle(
          this.position.x,
          this.position.y,
          this.position.x - 8,
          this.position.y + 8,
          this.position.x + 8,
          this.position.y + 8
        );
        break;
      case NODE_TYPE.NRM:
        p.ellipse(this.position.x, this.position.y, 8, 8);
        break;
      case NODE_TYPE.INT:
        p.rect(this.position.x, this.position.y, 10, 10);
        break;
    }
    if (isCH && displayClusters) {
      p.noFill();
      p.stroke(col);
      p.strokeWeight(stroke_weight);
      p.ellipse(this.position.x, this.position.y, 2 * VICINITY);
    }
    p.pop();
  }
}
