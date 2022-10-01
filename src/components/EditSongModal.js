import React, { Component } from 'react';

export default class EditSongModal extends Component {
    render() {
        const { index, editListCallback, hideditModalCallback} = this.props;

        let name = "";
        // if (listKeyPair) {
        //     name = listKeyPair.name;
        // }
        return (
            <div 
            className="modal" 
                id="edit-song-modal" 
                data-animation="slideInOutLeft">
                    <div className="modal-root" id='verify-edit-song-root'>
                        <div className="modal-north">
                            Edit Song
                        </div>

                        <div className="modal-center">
                                Title: <input id="titleText" placeholder="Enter Title"/>
                                Artist: <input id="artistText" placeholder="Enter Artist"/>
                                YouTube Id: <input id="youtubeId" placeholder="Enter Youtube Id"/>
                        </div>

                        <div className="modal-south">
                            <input type="button" 
                                id="edit-song-confirm-button" 
                                className="modal-button" 
                                onClick={editListCallback}
                                value='Confirm' />
                            <input type="button" 
                                id="edit-song-cancel-button" 
                                className="modal-button" 
                                onClick={hideditModalCallback}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }
}