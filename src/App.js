import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';
import jsTPS from './common/jsTPS.js';

// OUR TRANSACTIONS
import MoveSong_Transaction from './transactions/MoveSong_Transaction.js';

// THESE REACT COMPONENTS ARE MODALS
import DeleteListModal from './components/DeleteListModal.js';

// THESE REACT COMPONENTS ARE IN OUR UI
import Banner from './components/Banner.js';
import EditToolbar from './components/EditToolbar.js';
import PlaylistCards from './components/PlaylistCards.js';
import SidebarHeading from './components/SidebarHeading.js';
import SidebarList from './components/SidebarList.js';
import Statusbar from './components/Statusbar.js';
import SongCard from './components/SongCard';
import DeleteSongModal from './components/DeleteSongModal'
import EditSongModal from './components/EditSongModal'
import AddSong_Transaction from './transactions/AddSong_Transaction';
import DeleteSong_Transaction from './transactions/DeleteSong_Transaction';
import EditSong_Transaction from './transactions/EditSong_Transaction';

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS IS OUR TRANSACTION PROCESSING SYSTEM
        this.tps = new jsTPS();

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            listKeyPairMarkedForDeletion : null,
            currentList : null,
            sessionData : loadedSessionData,
            modalopen : false
        }
    }

    componentDidMount(){
        document.addEventListener("keydown", (keyDownFunc) => {

            if(this.state.modalopen == false && this.state.currentList !== null){
                if (keyDownFunc.ctrlKey && (keyDownFunc.key === 'z'  || keyDownFunc.key == 'Z')){
                    this.undo();
                    this.setStateWithUpdatedList(this.state.currentList);                
                }

                if (keyDownFunc.ctrlKey && (keyDownFunc.key === 'y' || keyDownFunc.key == 'Y')){
                    this.redo();
                    this.setStateWithUpdatedList(this.state.currentList);
                }
            } 
        })
    }

        // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.tps.clearAllTransactions();

        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: null,
            sessionData: this.state.sessionData
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
        });
    }

    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        this.tps.clearAllTransactions();
        let newCurrentList = this.db.queryGetList(key);
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: newCurrentList,
            sessionData: this.state.sessionData
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
        });
    }

            // THIS FUNCTION SPECIFICALLY DELETES THE CURRENT LIST
    deleteCurrentList = () => {
        this.tps.clearAllTransactions();

        if (this.state.currentList) {
            this.deleteList(this.state.currentList.key);
        }
        //added
    }

        // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
        createNewList = () => {
            // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
            this.tps.clearAllTransactions();
            let newKey = this.state.sessionData.nextKey;
            let newName = "Untitled" + newKey;
    
            // MAKE THE NEW LIST
            let newList = {
                key: newKey,
                name: newName,
                songs: []
            };
    
            // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
            // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
            let newKeyNamePair = { "key": newKey, "name": newName };
            let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
            this.sortKeyNamePairsByName(updatedPairs);
    
            // CHANGE THE APP STATE SO THAT THE CURRENT LIST IS
            // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
            // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
            // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
            // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
            // SHOULD BE DONE VIA ITS CALLBACK
            this.setState(prevState => ({
                listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
                currentList: newList,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey + 1,
                    counter: prevState.sessionData.counter + 1,
                    keyNamePairs: updatedPairs
                }
            }), () => {
                // PUTTING THIS NEW LIST IN PERMANENT STORAGE
                // IS AN AFTER EFFECT
                this.db.mutationCreateList(newList);
                // SO IS STORING OUR SESSION DATA
                this.db.mutationUpdateSessionData(this.state.sessionData);

            });
        }

    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }

        // THESE ARE THE FUNCTIONS FOR ADDING THE SONGS IN THE CURRENT LIST (Rish)
    addNewSong = () => {
        if (this.state.currentList == null){
            return this.state.currentList !== null; //returns nothing
        }

        let newElement = {
            artist: "Unknown",
            title: "Untitled",
            youTubeId: "dQw4w9WgXcQ",
        }

        this.state.currentList.songs.push(newElement)
        this.setStateWithUpdatedList(this.state.currentList);
     //   this.setState(this.state.currentList)
    }

    markSongForEdit = (num) => {

        this.setState(prevState => ({
            currentList: prevState.currentList, //gets previous playlist
            indexForDelete : num, //sets the number here
            sessionData: prevState.sessionData //gets previous sessionData
        }))
        document.getElementById("titleText").value = this.state.currentList.songs[num].title;
        document.getElementById("artistText").value = this.state.currentList.songs[num].artist
        document.getElementById("youtubeId").value = this.state.currentList.songs[num].youTubeId

        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
        this.setState({
            modalopen : true
        })
    }

    hideEditSongModalCallback = () => {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
        this.setState({
            modalopen : false
        })
    }

    // editSongCallback = (index) => {
 
    //     //this.setState(this.state.currentList)
    //     this.setStateWithUpdatedList(this.state.currentList);
    //     //this.setStateWithUpdatedList()
    //     let modal = document.getElementById("edit-song-modal");
    //     modal.classList.remove("is-visible");
    //     return oldElement
    // }

    deleteLastElement = (songToDelete) => {
        this.state.currentList.songs.splice(songToDelete,1);
        this.setStateWithUpdatedList(this.state.currentList);
    }


    replaceBack = (index, oldElement) => {

        this.hideEditSongModalCallback()
        this.state.currentList.songs[index] = oldElement; //replaces the element there
        this.setStateWithUpdatedList(this.state.currentList);
        
    }

    markSongForDelete = (num) => {

        this.setState(prevState => ({
            currentList: prevState.currentList, //gets previous playlist
            indexForDelete : num, //sets the number here
            sessionData: prevState.sessionData, //gets previous sessionData
        }))
        document.getElementById("songName").innerHTML = this.state.currentList.songs[num].title
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");    
        this.setState({
            modalopen : true
        })
    }

    hideDeleteSongModal = () => {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
        this.setState({
            modalopen : false
        })
    }

    deleteMarkedSong = (index) => {

        (this.state.currentList.songs).splice(this.state.indexForDelete,1)
        //this.setState(this.state.currentList)
        this.setStateWithUpdatedList(this.state.currentList);
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
        this.setState({
            modalopen : false
        })
    }

    insertElementIn = (index, element) => {
        this.state.currentList.songs.splice(index,0,element);
        this.setStateWithUpdatedList(this.state.currentList);
    }

    // THIS FUNCTION BEGINS THE PROCESS OF DELETING A LIST.
    deleteList = (key) => {
        // IF IT IS THE CURRENT LIST, CHANGE THAT
        let newCurrentList = null;
        if (this.state.currentList) {
            if (this.state.currentList.key !== key) {
                // THIS JUST MEANS IT'S NOT THE CURRENT LIST BEING
                // DELETED SO WE'LL KEEP THE CURRENT LIST AS IT IS
                newCurrentList = this.state.currentList;
            }else{
                this.tps.clearAllTransactions();
            }
        }

        let keyIndex = this.state.sessionData.keyNamePairs.findIndex((keyNamePair) => {
            return (keyNamePair.key === key);
        });
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        if (keyIndex >= 0)
            newKeyNamePairs.splice(keyIndex, 1);

        // AND FROM OUR APP STATE
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : null,
            currentList: newCurrentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter - 1,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // DELETING THE LIST FROM PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationDeleteList(key);
            
            // SO IS STORING OUR SESSION DATA
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    deleteMarkedList = () => {
        this.deleteList(this.state.listKeyPairMarkedForDeletion.key);
        this.hideDeleteListModal();
    }

    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : null,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }

    setStateWithUpdatedList(list) {
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList : list,
            sessionData : this.state.sessionData
        }), () => {
            // UPDATING THE LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationUpdateList(this.state.currentList);
        });
    }
    getPlaylistSize = () => {
        return this.state.currentList.songs.length;
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    moveSong(start, end) {
        let list = this.state.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }
        this.setStateWithUpdatedList(list);
    }
    // THIS FUNCTION ADDS A MoveSong_Transaction TO THE TRANSACTION STACK
    addMoveSongTransaction = (start, end) => {
        let transaction = new MoveSong_Transaction(this, start, end);
        this.tps.addTransaction(transaction);
    }
    //Done my me Below
    addSongTransaction = () => {
        let newaddtransaction = new AddSong_Transaction(this);
        this.tps.addTransaction(newaddtransaction);
    }

    deleteSongTransaction = () => {
        let index = this.state.indexForDelete;
        let newElement = this.state.currentList.songs[index]; //replaces the element there
        let newDeltransaction = new DeleteSong_Transaction(this, index, newElement);
        this.tps.addTransaction(newDeltransaction);
    }

     editSongTransaction = () => {
        var theTitle = document.getElementById("titleText").value;
        var theArtist = document.getElementById("artistText").value;
        var theYoutubeID = document.getElementById("youtubeId").value;

        let newElement = {
            artist: theArtist,
            title: theTitle,
            youTubeId: theYoutubeID,
        }
         let index = this.state.indexForDelete;
         let oldElement = this.state.currentList.songs[index]
         let newEdittransaction = new EditSong_Transaction(this, index, newElement, oldElement)
         this.tps.addTransaction(newEdittransaction);
    }

    // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING AN UNDO
    undo = () => {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();

            // MAKE SURE THE LIST GETS PERMANENTLY UPDATED
            this.db.mutationUpdateList(this.state.currentList);
        }
    }
    // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING A REDO
    redo = () => {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();

            // MAKE SURE THE LIST GETS PERMANENTLY UPDATED
            this.db.mutationUpdateList(this.state.currentList);
        }
    }
    markListForDeletion = (keyPair) => {
        this.setState(prevState => ({
            currentList: prevState.currentList,
            listKeyPairMarkedForDeletion : keyPair,
            sessionData: prevState.sessionData
        }), () => {
            // PROMPT THE USER
            this.showDeleteListModal();
        });
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
        this.setState({
            modalopen : true
        })
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
        this.setState({
            modalopen : false
        })
    }
    render() {
        let canAddSong = (this.state.currentList !== null && this.state.modalopen == false);
        let canUndo = this.tps.hasTransactionToUndo() && this.state.modalopen == false;
        let canRedo = this.tps.hasTransactionToRedo() && this.state.modalopen == false;
        let canClose = this.state.currentList !== null && this.state.modalopen == false;

        let canDoThis = this.state.currentList == null && this.state.modalopen == false;
        return (
                <>
                <Banner />
                <SidebarHeading
                    createNewListCallback={this.createNewList}
                    canAddThisSong = {canDoThis}
                />
                <SidebarList
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    deleteListCallback={this.markListForDeletion}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <EditToolbar
                    canAddSong={canAddSong}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    canClose={canClose} 
                    undoCallback={this.undo}
                    redoCallback={this.redo}
                    closeCallback={this.closeCurrentList}
                    createNewSongCallback={this.addSongTransaction}

                />
                <PlaylistCards
                    currentList={this.state.currentList}
                    moveSongCallback={this.addMoveSongTransaction} 
                    markSongCallback = {this.markSongForDelete}
                    markSongForEdits = {this.markSongForEdit}
                />

                <Statusbar 
                    currentList={this.state.currentList} />

                <DeleteListModal
                    listKeyPair={this.state.listKeyPairMarkedForDeletion}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    deleteListCallback={this.deleteMarkedList}
                />

                <DeleteSongModal
                    listKeyPair={this.state.index} //sends index
                    hideDeleteSongModalCallback={this.hideDeleteSongModal}
                    deleteSongCallback={this.deleteSongTransaction}
                />

                <EditSongModal
                    hideditModalCallback = {this.hideEditSongModalCallback}
                    editListCallback = {this.editSongTransaction}
                />

            </>
        );
    }
}

export default App;
