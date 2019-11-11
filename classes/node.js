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
  }

  /**
   * Calculate the energy factor.
   */
  energyFactor() {
    let eFactor = this.residualEnergy / this.eMax;
    return eFactor;
  }

  /**
   * Display the link with another node which is CH
   */
  displayLink(ch) {
    if (!displayLinks) return;
    stroke(255, 255, 0);
    strokeWeight(0.3);
    line(this.position.x, this.position.y, ch.position.x, ch.position.y);
  }

  /**
   * Display function based on type of node.
   */
  display(isCH) {
    noFill();
    if (isCH) fill(0, 255, 0);
    stroke(255);
    strokeWeight(0.4);
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
      stroke(0, 255, 0);
      ellipse(this.position.x, this.position.y, 2 * VICINITY);
    }
  }
}
