import { Box, Typography } from '@mui/material';

interface IStatistics {
  lotArea: number;
  floorHeight: number;
  floorNumber: number;
  baseFloorHeight: number;
  buildingArea: number;
}

const Statistics = ({
  lotArea,
  floorHeight,
  floorNumber,
  baseFloorHeight,
  buildingArea,
}: IStatistics) => {
  const buildingHeight = floorHeight * floorNumber + baseFloorHeight;
  const buildingFloorArea = buildingArea * floorNumber;
  const totalVolume = buildingHeight * buildingFloorArea;
  return (
    <Box
      sx={{
        backgroundColor: '#fffb',
        width: '200px',
        borderRadius: '5px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <Typography
        variant='subtitle1'
        style={{ fontWeight: 'bold', marginBottom: '5px' }}
      >
        Statistiques
      </Typography>
      <Typography variant='body2'>
        Land Area (m2): {lotArea.toFixed(2)}
      </Typography>
      <Typography variant='body2'>
        Building Area (m2): {buildingArea.toFixed(2)}
      </Typography>
      <Typography variant='body2'>
        Building Floor Area (m2): {buildingFloorArea.toFixed(2)}
      </Typography>
      <Typography variant='body2'>
        Volume (m3): {totalVolume.toFixed(2)}
      </Typography>
      <Typography variant='body2'>
        Building Height (m): {buildingHeight}
      </Typography>
    </Box>
  );
};

export default Statistics;
