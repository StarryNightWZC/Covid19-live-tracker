import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import { sortData, prettyPrintStat } from "./util";
import "leaflet/dist/leaflet.css";

function App() {
  const [summary, setSummary] = useState({});
  const [countries, setCountries] = useState([]);
  const [sortedCountries, setSortedCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countriesDetail, setCountriesDetail] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setSummary(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          const sortedCountries = sortedData.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setSortedCountries(sortedCountries);
          console.log("sorted data", sortedData);
          setTableData(sortedData);
          setCountriesDetail(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    if (countryCode === "worldwide") {
      setMapZoom(3);
      setMapCenter({
        lat: 34.80746,
        lng: -40.4796,
      });
    } else {
      setMapZoom(4);
      const countryDetail = countriesDetail.filter((country) => {
        return country.countryInfo.iso2 === countryCode;
      })[0];
      setSummary(countryDetail);
      setMapCenter({
        lat: countryDetail.countryInfo.lat,
        lng: countryDetail.countryInfo.long,
      });
      setMapZoom(4);
    }
  };
  return (
    <div className="app">
      <Card className="app__right">
        {/* {table} */}
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
        </CardContent>

        {/* {graph} */}
        <CardContent>
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Live Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {sortedCountries.map((country, index) => (
                <MenuItem value={country.value} key={index}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            casesType="cases"
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(summary.todayCases)}
            total={prettyPrintStat(summary.cases)}
          />

          <InfoBox
            casesType="recovered"
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(summary.todayRecovered)}
            total={prettyPrintStat(summary.recovered)}
          />

          <InfoBox
            casesType="deaths"
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Death"
            cases={prettyPrintStat(summary.todayDeaths)}
            total={prettyPrintStat(summary.deaths)}
          />
        </div>
        {/* {map} */}
        <Map
          countries={countriesDetail}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
    </div>
  );
}

export default App;
