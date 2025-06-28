import { Container, IconButton, InputAdornment, List, MenuItem, Paper, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { ChangeEvent, FormEvent, useState } from "react";
import bbox from '@turf/bbox'
import { nameToGeo, provinceNames } from "../../../lib/util/util";
import { useAppDispatch, useAppSelector } from "../../../lib/store/hooks";
import { Feature } from "geojson";
import { setMapFlyto } from "../../../lib/store/setMap";
import { toast } from "react-toastify";

export default function Search() {
  const [name, setName] = useState<string>('');
  const [advice, setAdvice] = useState<string[]>([]);
  const geoJson = useAppSelector(state => state.setMap.geoJson);
  const dispatch = useAppDispatch();

  const handleMapFly = (nameVal: string) => {
    const n = nameToGeo.get(nameVal);
    if (n !== undefined && geoJson?.features[n]) {
      const bound = bbox(geoJson?.features[n] as Feature);
      console.log(bound);
      dispatch(setMapFlyto([...bound]))
    }
    setAdvice([]);
  }
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let nameVal: string | undefined = undefined;
    provinceNames.forEach(n => {
      if (name.includes(n)) {
        nameVal = n;
      }
    })
    if (!nameVal)
      toast(<Typography>未找到</Typography>, {
        progressClassName: 'toast-progress',
      });
    else {
      handleMapFly(nameVal)
    }
  }
  const handleUserInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const n = e.target.value;
    setName(n);

    const adv: string[] = [];
    if (n)
      provinceNames.forEach(name => {
        if (name.includes(n) || n.includes(name))
          adv.push(name);
      })
    setAdvice(adv);
  }
  const handleReceiveAdv = (adv: string) => {
    setName(adv);
    handleMapFly(adv)
  }
  return (
    <Paper
      component='form'
      onSubmit={handleSearch}
      sx={{ bgcolor: '#232D3F' }}
      elevation={0}
    >
      <TextField
        fullWidth
        placeholder="省份名称"
        variant="outlined"
        autoComplete="off"
        value={name}
        onChange={handleUserInput}
        sx={{
          mt: '1rem',
          borderRadius: '10px',
          input: {
            color: 'white',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit">
                  <SearchIcon sx={{ color: 'white' }} />
                </IconButton>
              </InputAdornment>
            )
          }
        }}
      />
      {advice.length > 0 ? (
        <Container sx={{ position: 'relative' }}>
          <List
            sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              borderRadius: '10px',
              bgcolor: '#292929',
              p: '1rem'
            }}>
            {advice.map((adv, index) => (
              <>
                <MenuItem
                  key={index}
                  onClick={() => handleReceiveAdv(adv)}
                  sx={{
                    color: 'white'
                  }}
                >
                  {adv}
                </MenuItem>
                {index === advice.length - 1 ? (
                  <></>
                ) : (<></>)}
              </>
            ))}
          </List>
        </Container>
      ) : (<></>)}
    </Paper>
  )
}