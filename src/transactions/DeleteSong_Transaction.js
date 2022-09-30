import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * DeleteSong_Transaction
 * 
 * This class represents a transaction that works.
 *  It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, index, element) {
        super();
        this.app = initApp;
        this.delindex = index;
        this.element = element; //gets this object
    }

    doTransaction() {
        this.app.deleteMarkedSong(this.delindex); //still passing the delete index
    }
    
    undoTransaction() {
        this.app.insertElementIn(this.delindex, this.element);        
    }

}