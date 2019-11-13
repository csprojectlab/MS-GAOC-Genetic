/**
 * Cluster class. 
 * Combines together cluster head and its corresponding nodes. 
 */
class Cluster {
    constructor (network, ch_index, nodes = []) {
        this.network = network;
        this.chIndex = ch_index;
        this.nodes = nodes;
    }

    /**
     * Function to add new node in the cluster. 
     * Index of the node is sent as parameter. 
     */
    addNode (node_index) {
        this.nodes.push(node_index);
    }

    /**
     * Display the cluster. 
     */
    display () {
        
    }
}