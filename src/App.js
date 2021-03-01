import { useState } from 'react';
import { LinearProgress, TextField, FormControl, Button, Input } from '@material-ui/core';
import fetch from 'node-fetch';

import './App.css';
import Search from './Search.js';
import TimeSeries from './TimeSeries.js';
import Map from './Map.js';

const App = () => {
  const [yearRange, setYearRange] = useState([0, 3000]);
  const [annualData, setAnnualData] = useState({});
  const [mapData, setMapData] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapProgress, setMapProgress] = useState(0);
  const [isError, setIsError] = useState(false);

  const handleData = data => {
    setAnnualData(data);
  }

  const fetchLocations = async (searchTerm) => {
    setMapLoading(true)
    let morePages = true
    const sanityCheck = 32

    for (let p=0; morePages; p++) {
      if (p > sanityCheck) {
        throw Error('Tried to fetch too many pages')
      }

      setMapProgress((p / sanityCheck) * 100)
      const response = await fetch(`/search-countries?term=${searchTerm}&page=${p}`)
      if (!response.ok) {
        // NOT res.status >= 200 && res.status < 300
        throw new Error('Error when trying to fetch location info. Bad response code.')
      }

      const data = await response.json();
      setMapData(md => md.concat(data.results))
      await new Promise((res) => setTimeout(() => res(), 1000))
      morePages = data.morePages
    }
    setMapProgress(100)
    setMapLoading(false)
  }

  const handleSearch = ({ term, minYear, maxYear }) => {
    if (!term) {
      return;
    }
    setIsError(false)
    setYearRange([minYear, maxYear])

    fetch(`/search?term=${term}`)
    .then(res => res.json())
    .then(res => handleData(res))
    .then(() => fetchLocations(term))
    .catch(err => {
      console.error(err)
      setIsError(true)
    });
  };

  return (
    <div className="App" style={{ alignContent: 'center' }}>
      <h1>PubMed Disease Publication Trends</h1>
      <Search
        onSearch={handleSearch}
        disabled={mapLoading}
      />
      <hr />
      {mapLoading && <LinearProgress variant="determinate" value={mapProgress} />}
      {isError ? <h2>Error when trying to fetch data</h2> :
        mapLoading ? <h2>Fetching map data...</h2> :
        null
      }
      <br />
      <TimeSeries data={annualData || []} minYear={yearRange[0]} maxYear={yearRange[1]} />
      <br />
      <Map data={mapLoading ? [] : mapData.filter(val => +val.count > 0) }/>
    </div>
  );
};

export default App;
