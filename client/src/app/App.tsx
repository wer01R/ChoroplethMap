import { Box, Container, CssBaseline, Typography } from '@mui/material'
import MainMap from './features/Map/MainMap'
import Console from './layout/Console'
import Note from './layout/Note'
export default function App() {
  return (
    <>
      <CssBaseline />
      <Box sx={{position: 'absolute', left: '0', top: '0'}} zIndex={1}>
        <Console />
      </Box>

      <Box zIndex={-1}>
        <MainMap />
        <Box sx={{ position: 'absolute', left: '80vw', bottom: '3rem' }}>
          <Note />
        </Box>
      </Box>
    </>
  )
}