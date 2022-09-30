import React, { Component } from 'react';

export default class EditSongModal extends Component {
    render() {
        const { index, editListCallback, hideditModalCallback } = this.props;
        let name = "";
        // if (listKeyPair) {
        //     name = listKeyPair.name;
        // }
        return (
            <div 
                class="modal" 
                id="edit-song-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-root" id='verify-edit-song-root'>
                        <div class="modal-north">
                            Edit Song
                        </div>

                        <div class="modal-center">
                            <div class="modal-center-content">
                                Title: <input id="titleText" placeholder="Enter Title"/>
                                <br/>
                                Artist: <input id="artistText" placeholder="Enter Artist"/>
                                <br/>
                                YouTube Id: <input id="youtubeId" placeholder="Enter Youtube Id"/>
                                <br/>
                            </div>
                        </div>

                        <div class="modal-south">
                            <input type="button" 
                                id="edit-song-confirm-button" 
                                class="modal-button" 
                                onClick={editListCallback}
                                value='Confirm' />
                            <input type="button" 
                                id="edit-song-cancel-button" 
                                class="modal-button" 
                                onClick={hideditModalCallback}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }
}