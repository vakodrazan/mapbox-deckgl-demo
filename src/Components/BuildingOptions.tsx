import { Box, Button, Slider, Typography } from '@mui/material';
import { useRef } from 'react';

interface IBuildingOptions {
  lotCoverage: number;
  floorNumber: number;
  floorHeight: number;
  baseFloorHeight: number;
  setGeoJsonFile: React.Dispatch<React.SetStateAction<string>>;
  setLotCoverage: React.Dispatch<React.SetStateAction<number>>;
  setFloorNumber: React.Dispatch<React.SetStateAction<number>>;
  setFloorHeight: React.Dispatch<React.SetStateAction<number>>;
  setBaseFloorHeight: React.Dispatch<React.SetStateAction<number>>;
}

const flexBox = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const BuildingOptions = ({
  lotCoverage,
  floorNumber,
  floorHeight,
  baseFloorHeight,
  setGeoJsonFile,
  setLotCoverage,
  setFloorNumber,
  setFloorHeight,
  setBaseFloorHeight,
}: IBuildingOptions) => {
  const inputFile = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (!e?.target?.files) return;
    fileReader.readAsText(e?.target?.files[0], 'UTF-8');
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      setGeoJsonFile(e?.target?.result as string);
    };
  };

  const onFileBrowse = () => {
    if (inputFile?.current) {
      inputFile.current.click();
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#fffb',
        width: '200px',
        borderRadius: '5px',
        padding: '10px',
      }}
    >
      <Box>
        <Button onClick={onFileBrowse}>Load GeoJson</Button>
        <input
          type='file'
          id='geojson'
          name='geojson'
          accept='.geojson'
          onChange={handleChange}
          multiple={false}
          ref={inputFile}
          style={{ display: 'none' }}
        />
      </Box>
      <Box>
        <Typography variant='body1'>lot coverage %</Typography>
        <Box width='100%' sx={flexBox}>
          <Slider
            size='small'
            value={lotCoverage}
            aria-label='Small'
            valueLabelDisplay='auto'
            onChange={(_, value) => setLotCoverage(value as number)}
            step={0.1}
            min={0.1}
            max={1}
          />
          <Typography variant='body1'>{lotCoverage * 100}</Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant='body1'>floor number</Typography>
        <Box width='100%' sx={flexBox}>
          <Slider
            size='small'
            value={floorNumber}
            aria-label='Small'
            valueLabelDisplay='auto'
            onChange={(_, value) => setFloorNumber(value as number)}
            step={1}
            min={1}
            max={100}
          />
          <Typography variant='body1'>{floorNumber}</Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant='body1'>floor height</Typography>
        <Box width='100%' sx={flexBox}>
          <Slider
            size='small'
            value={floorHeight}
            aria-label='Small'
            valueLabelDisplay='auto'
            onChange={(_, value) => setFloorHeight(value as number)}
            step={1}
            min={1}
            max={100}
          />
          <Typography variant='body1'>{floorHeight}</Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant='body1'>base floor height</Typography>
        <Box width='100%' sx={flexBox}>
          <Slider
            size='small'
            value={baseFloorHeight}
            aria-label='Small'
            valueLabelDisplay='auto'
            onChange={(_, value) => setBaseFloorHeight(value as number)}
            step={1}
            min={1}
            max={100}
          />
          <Typography variant='body1'>{baseFloorHeight}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BuildingOptions;
