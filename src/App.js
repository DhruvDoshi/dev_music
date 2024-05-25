import React, { useState, useEffect } from 'react';
import { CssBaseline, Container, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import AudioPlayer from 'react-h5-audio-player';
import axios from 'axios';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';

const App = () => {
  const [playlists, setPlaylists] = useState({});
  const [currentPlaylist, setCurrentPlaylist] = useState('playlist1');
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const result = await axios.get('/songs.json');
        setPlaylists(result.data);
      } catch (error) {
        console.error('Error fetching songs data', error);
      }
    };
    fetchPlaylists();
  }, []);

  const handleClick = (index, playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentSongIndex(index);
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlists[currentPlaylist].length);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + playlists[currentPlaylist].length) % playlists[currentPlaylist].length);
  };

  if (Object.keys(playlists).length === 0) {
    return <Typography variant="h5" align="center">Loading...</Typography>;
  }

  return (
    <Container>
      <CssBaseline />
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h4">Music Player</Typography>
        <Typography variant="h6">
          Now Playing: {playlists[currentPlaylist][currentSongIndex].title}
        </Typography>
        <AudioPlayer
          src={playlists[currentPlaylist][currentSongIndex].src}
          onPlay={() => console.log('Playing')}
          onEnded={handleNext}
          showSkipControls={true}
          showJumpControls={false}
          onClickPrevious={handlePrev}
          onClickNext={handleNext}
        />
        <Box sx={{ marginTop: 4 }}>
          {Object.keys(playlists).map((playlist, i) => (
            <div key={i}>
              <Typography variant="h6">{playlist}</Typography>
              <List>
                {playlists[playlist].map((song, index) => (
                  <ListItem button key={index} onClick={() => handleClick(index, playlist)}>
                    <ListItemText primary={song.title} />
                  </ListItem>
                ))}
              </List>
            </div>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default App;
