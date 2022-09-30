import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * MoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, index, newElement, oldElement) {
        super();
        this.app = initApp;
        this.Index = index;
        this.newElement = newElement;
        this.oldElement = oldElement;
    }
    
    doTransaction() {
        this.app.replaceBack(this.Index, this.newElement); //replacing with new element
    }
        
    undoTransaction() {
        this.app.replaceBack(this.Index, this.oldElement);  //replacing with old element back
    }
    
}