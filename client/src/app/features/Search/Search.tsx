import { FormControl, IconButton, InputAdornment, Paper, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { FormEvent, useState } from "react";

export default function Search() {
  const [name, setName] = useState<string>();
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setName('')
  }
  return (
    <Paper 
      component='form' 
      onSubmit={handleSearch} 
      sx={{bgcolor: '#232D3F'}}
      elevation={0}
    >
      <TextField
        fullWidth
        placeholder="省份名称"
        variant="outlined"
        autoComplete="off"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
    </Paper>
  )
}