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
    display () {
        fill(255, 0, 0);
        stroke(255, 0, 0);
        strokeWeight(2)
        ellipse (this.position.x, this.position.y, 8, 8);
    }
}