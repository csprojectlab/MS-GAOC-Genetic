/**
 * Node class.
 */
class Node {
  constructor(x, y, type) {
    this.position = createVector(x, y);
    this.type = type;
  }

  /**
   * Display function based on type of node.
   */
  display() {
    noFill();
    stroke(255);
    strokeWeight(1);
    switch (this.type) {
      case NODE_TYPE.ADV:
        fill(255)
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
        rect(this.position.x, this.position.y, 10, 10)
        break;
    }
  }
}
