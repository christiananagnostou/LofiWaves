import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const Player = ({ currentSong, setCurrentSong, isPlaying, setIsPlaying, songs, setSongs }) => {
  //State
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
  });

  //Ref
  const audioRef = useRef(null);

  //Event Handlers
  const playSongHandler = () => {
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration: duration,
    });
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const secondsWithZero = String(seconds).padStart(2, "0");
    return `${minutes}:${secondsWithZero}`;
  };

  const dragHandler = (e) => {
    const currentDraggedTime = e.target.value;
    audioRef.current.currentTime = currentDraggedTime;
    setSongInfo({ ...songInfo, currentTime: currentDraggedTime });
  };

  const autoPlayHandler = () => {
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  // 0 or 1 ('back' or 'forward')
  const changeTrackHandler = (direction) => {
    let currentSongIndex = songs.findIndex((song) => song.id === currentSong.id);
    let nextSongIndex = (currentSongIndex + 1) % songs.length;
    let previousSongIndex = (currentSongIndex + songs.length - 1) % songs.length;

    if (direction) {
      setCurrentSong(songs[nextSongIndex]);
    } else {
      setCurrentSong(songs[previousSongIndex]);
    }

    const newSongs = songs.map((song) => {
      return {
        ...song,
        active: song.id === songs[direction ? nextSongIndex : previousSongIndex].id,
      };
    });
    setSongs(newSongs);
  };

  return (
    <div className="player">
      <div className="time-control">
        <p>{formatTime(songInfo.currentTime)}</p>
        <div className="track">
          <input
            type="range"
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={dragHandler}
            style={{
              background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`,
            }}
          />
          <div
            className="animate-track"
            style={{
              transform: `translateX(${(songInfo.currentTime / songInfo.duration) * 100}%)`,
            }}
          ></div>
        </div>

        <p>{songInfo.duration ? formatTime(songInfo.duration) : "0:00"}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          onClick={() => changeTrackHandler(0)}
          icon={faAngleLeft}
          size="2x"
          className="skip-back"
        />
        <FontAwesomeIcon
          onClick={playSongHandler}
          icon={isPlaying ? faPause : faPlay}
          size="2x"
          className="play"
        />
        <FontAwesomeIcon
          onClick={() => changeTrackHandler(1)}
          icon={faAngleRight}
          size="2x"
          className="skip-forward"
        />
        <audio
          ref={audioRef}
          onLoadedData={autoPlayHandler}
          onLoadedMetadata={timeUpdateHandler}
          onTimeUpdate={timeUpdateHandler}
          onEnded={() => changeTrackHandler(1)}
          src={currentSong.audio}
        ></audio>
      </div>
    </div>
  );
};

export default Player;
