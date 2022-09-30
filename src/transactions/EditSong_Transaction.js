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
    constructor(initApp, index, oldelement) {
        super();
        this.app = initApp;
        this.delindex = index;
        this.oldelement = oldelement;
    }
    
    doTransaction() {
        this.app.editSongCallback(this.delindex); //replacing with new element
    }
        
    undoTransaction() {
        this.app.replaceBack(this.delindex, this.oldelement);  //replacing with old element back
    }
    
}