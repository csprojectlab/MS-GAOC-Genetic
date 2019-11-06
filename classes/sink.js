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
        noStroke();
        rect (this.position.x, this.position.y, 20, 20);
    }
}