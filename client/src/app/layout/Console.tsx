import { Box, FormControl, Grid, Input, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { useEffect } from "react";
import agent from "../../lib/api/agent";
import { statData } from "../../lib/types";
import { setSelectStat, setSelectYear, setStat } from "../../lib/store/statistics";
import { setNum } from "../../lib/store/notes";
import Search from "../features/Search/Search";

export default function Console() {
  const stat = useAppSelector(state => state.stat);
  const notes = useAppSelector(state => state.notes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (stat.selectStat.length === 0)
      dispatch(setSelectStat("GDP_statistics.json"))
    agent.get<statData>(`/data/${stat.selectStat.length === 0 ? "GDP_statistics.json" : stat.selectStat}`)
      .then(res => {
        dispatch(setStat(res.data));
        dispatch(setSelectYear(res.data.years[0]));
        dispatch(setNum({
          ...notes,
          measure: stat.selectStat.startsWith('GDP') ? '亿元' : '万人'
        }))
      })
      .catch(err => console.log(err))
  }, [stat.selectStat])

  return (
    <Paper
      sx={{
        width: 'fit-content',
        padding: '1rem',
        margin: '1rem',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#232D3F',
        color: 'white'
      }}
    >
      <Typography variant="h4" sx={{ width: 'fit-content' }}>
        中国各省份数据分级设色图
      </Typography>
      <Typography variant="subtitle1" sx={{ width: 'fit-content' }}>
        注：港澳台数据暂缺</Typography>

      <Grid
        sx={{ mt: '1rem' }}
        container
        direction='row'
        spacing='2rem'
      >
        <Grid size={6}>
          <FormControl fullWidth>
            <InputLabel key='selectYear' sx={{ color: 'white' }}>年份</InputLabel>
            <Select
              labelId='selectYear'
              label='年份'
              name='selectYear'
              value={stat.selectYear}
              onChange={(e) => dispatch(setSelectYear(e.target.value))}
              sx={{ color: 'white' }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#232D3F',
                    color: 'white'
                  }
                }
              }}
            >
              {stat.years.map((year, index) => (
                <MenuItem key={'year ' + index} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl fullWidth>
            <InputLabel key='selectStat' sx={{ color: 'white' }}>数据类型</InputLabel>
            <Select
              labelId='selectStat'
              label='数据类型'
              name='selectStat'
              value={stat.selectStat}
              onChange={(e) => dispatch(setSelectStat(e.target.value))}
              sx={{ color: 'white' }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#232D3F',
                    color: 'white'
                  }
                }
              }}
            >
              <MenuItem key='GDP' value='GDP_statistics.json'>生产总值</MenuItem>
              <MenuItem key='POP' value='population_statistics.json'>人口数量</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Search />
    </Paper>
  )
}