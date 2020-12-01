import React from "react";

const LibrarySong = ({ song, songs, setCurrentSong, setSongs }) => {
  const songSelectHandler = async () => {
    await setCurrentSong(song);

    //Add active state
    const newSongs = songs.map((targetSong) => {
      return {
        ...targetSong,
        active: targetSong.id === song.id,
      };
    });
    setSongs(newSongs);
  };

  return (
    <div
      className={`library-song ${song.active && "selected"}`}
      onClick={songSelectHandler}
    >
      <img src={song.cover} alt={song.name}></img>
      <div className="song-description">
        <h3>{song.name}</h3>
        <h4>{song.artist}</h4>
      </div>
    </div>
  );
};

export default LibrarySong;
