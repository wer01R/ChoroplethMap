import { Paper, Typography } from "@mui/material"
import { GeoJSONFeature } from "mapbox-gl"

type Props = {
  name: string,
  data?: number,
  measure: string
}
export default function StatToolkits({name, data, measure} : Props) {
  return (
    <Paper elevation={0} sx={{pointerEvents: 'none', bgcolor: '#232D3F', color: 'white'}}>
      <Typography variant="h6" sx={{pointerEvents: 'none'}}>{name}</Typography>
      <Typography variant="body1" sx={{pointerEvents: 'none'}}>{data ? data + " " + measure : '数据暂无'}</Typography>
    </Paper>
  )
}