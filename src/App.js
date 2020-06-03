import React from 'react';
import './App.css';
import WorldGlobe from "./components/WorldGlobe/WorldGlobe";

import WorldMap from "./components/WorldMap/WorldMap";

import WorldTotals from "./components/WorldTotals/WorldTotals";

import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, AppBar, Toolbar, Typography, Paper, Grid, MuiThemeProvider, createMuiTheme, CssBaseline } from "@material-ui/core";

import Graphs from "./components/Graphs/Graphs"

import { data } from "./data/data";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      loaded: true,
      rawData: [],
      data: [],
      name: "",
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight
    };
  }

  handleClose = () => {
    this.setState({ open: false });
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
    const { open } = this.state;
    return (
      <div>
        <MuiThemeProvider theme={darkTheme}>
          <Dialog
            open={open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Covid-19 Dashboard"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Website features a 3d globe detailing broad country specific statistics, graphical timeline of the corona virus outbreak, 2d map detailing local data(where possible), and a raw data table.
                <br></br>
                <br></br>
                When using the 3d globe, hover over a country to view statistics for that respective country. To generate a graph double click on the respective country, futhermore, if data for that country is insufficient no graph will be generated. Note that the data shown may differ from other sources, as data are extracted at different times, futhermore, data is subject to change as the public health investigation into reported cases is currently ongoing.
                <br></br>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Close
          </Button>
            </DialogActions>
          </Dialog>
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
          <div className="graph-div">
            <Paper elevation={3} className="worldGlobe-container">
              {loaded ? null : (
                <WorldGlobe
                  width={canvasWidth}
                  height={canvasHeight}
                  data={data}
                  renderGraph={name => this.setState({ name })}
                />
              )}
            </Paper>
            <div className="graph-container">
              {loaded ? null : (
                <Paper elevation={3} className="Paper">
                  <Typography>TABLE</Typography>
                </Paper>
              )}
            </div>
          </div>
          <Grid container>
            <Grid item sm={4}>
              <Paper elevation={3} className="Paper">
                {loaded ? null : (
                  <Graphs
                    rawData={rawData}
                    name={name}
                  />
                )}
              </Paper>
            </Grid>
            <Grid item sm={8}>
              <Paper elevation={3} className="Paper">
                {loaded ? null : (
                  <WorldMap></WorldMap>
                )}
              </Paper>
            </Grid>
          </Grid>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
