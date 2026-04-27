import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  FormControl,
  Select,
  MenuItem,
  Box,
} from '@mui/material';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import request from '../../../../utils/request';
import FolderLink from './folder-link';
import FolderTypeAvatar from './folder-type-avatar';

const FolderListItem = ({
  folder,
  isSelecting,
  registerMusicToCard,
}) => {
  const { t } = useTranslation();
  const { type, name, relpath } = folder;
  const [playbackMode, setPlaybackMode] = useState('none');

  useEffect(() => {
    if (type === 'directory') {
      // Load current playback mode for this folder
      const loadConfig = async () => {
        try {
          const { result, error } = await request('get_folder_config', { folder: relpath });
          if (error) {
            console.error('get_folder_config failed:', error);
            return;
          }
          if (result && result.playback_mode) {
            setPlaybackMode(result.playback_mode);
          }
        }
        catch (err) {
          console.error('get_folder_config error:', err);
        }
      };
      loadConfig();
    }
  }, [type, relpath]);

  const playItem = () => {
    switch(type) {
      case 'directory': return request('play_folder', { folder: relpath, recursive: true });
      case 'file': return request('play_single', { song_url: relpath });
      // TODO: Add missing Podcast
      // TODO: Add missing Stream
      default: return;
    }
  }

  const registerItemToCard = () => {
    switch(type) {
      case 'directory': return registerMusicToCard('play_folder', { folder: relpath, recursive: true });
      case 'file': return registerMusicToCard('play_single', { song_url: relpath });
      // TODO: Add missing Podcast
      // TODO: Add missing Stream
      default: return;
    }
  }

  const handlePlaybackModeChange = async (event) => {
    const newMode = event.target.value;
    setPlaybackMode(newMode);
    try {
      const { error } = await request('set_folder_playback_mode', { folder: relpath, mode: newMode });
      if (error) {
        console.error('set_folder_playback_mode failed:', error);
      }
    }
    catch (err) {
      console.error('set_folder_playback_mode error:', err);
    }
  }

  return (
    <ListItem
      disablePadding
      secondaryAction={
        type === 'directory' ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 100, mr: 1 }}>
              <Select
                value={playbackMode}
                onChange={handlePlaybackModeChange}
                displayEmpty
              >
                <MenuItem value="none">{t('library.folders.playback-mode.none', 'None')}</MenuItem>
                <MenuItem value="shuffle">{t('library.folders.playback-mode.shuffle', 'Shuffle')}</MenuItem>
                <MenuItem value="resume">{t('library.folders.playback-mode.resume', 'Resume')}</MenuItem>
                <MenuItem value="resume_song">{t('library.folders.playback-mode.resume_song', 'Resume Song')}</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              component={FolderLink}
              data={{ dir: relpath }}
              edge="end"
              aria-label={t('library.folders.show-folder-content')}
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
        ) : undefined
      }
    >
      <ListItemButton onClick={() => (isSelecting ? registerItemToCard() : playItem())}>
        <FolderTypeAvatar type={type} />
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  );
}

export default FolderListItem;
