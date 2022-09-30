import React from "react";

export default class SidebarHeading extends React.Component {
    handleClick = (event) => {
        const {createNewListCallback } = this.props;
        createNewListCallback();
    };
    render() {
        const {canAddThisSong} = this.props;
        let addTheSongClass = "toolbar-button";
        if (!canAddThisSong) addTheSongClass += "-disabled";
        return (
            <div id="sidebar-heading">
                <input 
                    type="button" 
                    id="add-list-button" 
                    className={addTheSongClass} 
                    onClick={this.handleClick}
                    value="+"
                    disabled = {!canAddThisSong}
                    />
                Your Playlists
            </div>
        );
    }
}
