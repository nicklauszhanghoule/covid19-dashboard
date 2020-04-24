import React from 'react';
import './App.css';
import WorldGlobe from "./components/WorldGlobe/WorldGlobe";

import WorldTotals from "./components/WorldTotals/WorldTotals";

import { AppBar, Toolbar, Typography, Paper, Grid, MuiThemeProvider, createMuiTheme, CssBaseline } from "@material-ui/core";


import { data } from "./data/data";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      rawData: [],
      data: [],
      name: "",
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight
    };
  }

  componentDidMount() {
    fetch("https://pomber.github.io/covid19/timeseries.json")
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            loaded: false,
            rawData: result,
            data: data.map(country => {
              const { name } = country;
              const found = result[name] && result[name].slice(-1)[0];
              return {
                ...country,
                confirmed: found ? found.confirmed : 0,
                deaths: found ? found.deaths : 0,
                recovered: found ? found.recovered : 0
              };
            })
          });
        },
        error => {
          this.setState({ loaded: true }, console.log);
        }
      );

    window.addEventListener("resize", ({ target }) =>
      this.setState({
        canvasWidth: target.innerWidth,
        windowHeight: target.innerHeight
      })
    );
  }

  render() {
    const { loaded, data, rawData, name, canvasHeight, canvasWidth } = this.state;
    const darkTheme = createMuiTheme({
      palette: {
        type: "dark"
      }
    });
    return (
      <div>
        <MuiThemeProvider theme={darkTheme}>
          <AppBar color={"transparent"} position="static" className="AppBar">
            <Toolbar>
              <Typography variant="h6">Covid-19 Dashboard</Typography>
              {loaded ? null : (
                <WorldTotals
                  data={data}
                />
              )}
            </Toolbar>
          </AppBar>
          <CssBaseline></CssBaseline>
          <Paper elevation={3} className="worldGlobe-container">
            {loaded ? null : (
              <WorldGlobe
                width={canvasWidth}
                height={canvasHeight}
                data={data}
              />
            )}
          </Paper>
          <Grid container>
            <Grid item sm={6}>
              <Paper elevation={3} className="Paper">
                <Typography>Table</Typography>
              </Paper>
            </Grid>
            <Grid item sm={6}>
              <Paper elevation={3} className="Paper">
                <Typography>Graph</Typography>
              </Paper>
            </Grid>
          </Grid>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
