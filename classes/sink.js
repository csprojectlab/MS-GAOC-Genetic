/**
 * Sink class. 
 */
class Sink {
    constructor (x, y) {
        this.position = createVector (x, y);
    }

    /**
     * Display function.. 
     */
    display (p) {
        p.push()
        p.fill(255, 0, 0);
        p.stroke(255, 0, 0);
        p.strokeWeight(2)
        p.ellipse (this.position.x, this.position.y, 8, 8);
        p.pop();
    }
}