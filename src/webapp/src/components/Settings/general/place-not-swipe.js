import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Grid,
  Switch,
  Typography,
} from '@mui/material';

import AppSettingsContext from '../../../context/appsettings/context';
import request from '../../../utils/request';

const PlaceNotSwipe = () => {
  const { t } = useTranslation();

  const [placeNotSwipe, setPlaceNotSwipe] = useState(false);

  useEffect(() => {
    const loadPlaceNotSwipe = async () => {
      const { result } = await request('getRfidPlaceNotSwipe');
      if (result !== undefined) {
        setPlaceNotSwipe(result);
      }
    };

    loadPlaceNotSwipe();
  }, []);

  const updatePlaceNotSwipeSetting = async (enabled) => {
    await request('setRfidPlaceNotSwipe', { enabled });
  };

  const handleSwitch = (event) => {
    const enabled = event.target.checked;
    setPlaceNotSwipe(enabled);
    updatePlaceNotSwipeSetting(enabled);
  };

  return (
    <Grid container direction="column">
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Typography>
          {t('settings.general.place_not_swipe.title')}
        </Typography>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: '0',
        }}>
          <Switch
            checked={placeNotSwipe}
            onChange={handleSwitch}
          />
        </Box>
      </Grid>
      <Typography variant="body2" color="textSecondary">
        {t('settings.general.place_not_swipe.description')}
      </Typography>
    </Grid>
  );
};

export default PlaceNotSwipe;