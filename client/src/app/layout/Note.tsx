import { Box, Stack, Typography } from "@mui/material"
import { useAppSelector } from "../../lib/store/hooks"

export default function Note() {
  const notes = useAppSelector(state => state.notes);
  const max = Math.round(notes.maxNum);
  const min = Math.round(notes.minNum);
  const interval = Math.floor((max - min) / notes.colors.length)
  return (
    <Stack sx={{ width: 'fit-content' }}>
      <Typography color="white" sx={{mb: '1rem'}}>单位：{`${notes.measure}`}</Typography>
      {notes.colors.map((color, index) => (
        <Stack key={index} direction='row'>
          <Box height='3rem' sx={{ bgcolor: color, width: '10px' }}></Box>
          <Typography 
            color="white" 
            variant="body1" 
            ml='1rem'
          >
            {index === 0
              ? `${min + interval}以下`
              : index === notes.colors.length - 1 
                ? `${max - interval}以上`
                : `${min + index * interval} ~ ${min + (index + 1) * interval}`}
          </Typography>
        </Stack>
      )).reverse()}
    </Stack>
  )
}