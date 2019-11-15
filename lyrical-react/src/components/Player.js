import React from "react";

document.addEventListener(
  "play",
  function(e) {
    // get all <audio> tag elements in the page.
    var allAudios = document.getElementsByTagName("audio");
    // Iterate through all players and pause them, except for
    // the one who fired the "play" event ("target")
    for (var i = 0; i < allAudios.length; i++) {
      if (allAudios[i] != e.target) {
        allAudios[i].pause();
      }
    }
  },
  true
);

const Player = props => (
  <audio ref={a => (this._audio = a)} controls name="media">
    <source type="audio/mpeg" src={props.url} />
  </audio>
);

export default Player;
