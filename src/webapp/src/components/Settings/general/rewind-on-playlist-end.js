import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Grid,
  Switch,
  Typography,
} from '@mui/material';

import request from '../../../utils/request';

const RewindOnPlaylistEnd = () => {
  const { t } = useTranslation();

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { result } = await request('getEndOfPlaylistRewind');
      if (result !== undefined) {
        setEnabled(result);
      }
    };
    load();
  }, []);

  const update = async (val) => {
    await request('setEndOfPlaylistRewind', { enabled: val });
  };

  const handleSwitch = (event) => {
    const val = event.target.checked;
    setEnabled(val);
    update(val);
  };

  return (
    <Grid container direction="column">
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Typography>
          {t('settings.general.rewind_on_playlist_end.title')}
        </Typography>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: '0',
        }}>
          <Switch
            checked={enabled}
            onChange={handleSwitch}
          />
        </Box>
      </Grid>
      <Typography variant="body2" color="textSecondary">
        {t('settings.general.rewind_on_playlist_end.description')}
      </Typography>
    </Grid>
  );
};

export default RewindOnPlaylistEnd;
