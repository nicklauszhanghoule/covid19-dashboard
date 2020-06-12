import React from 'react';
import './App.css';
import WorldGlobe from "./components/WorldGlobe/WorldGlobe";

import WorldMap from "./components/WorldMap/WorldMap";

import WorldTotals from "./components/WorldTotals/WorldTotals";

import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, AppBar, Toolbar, Typography, Paper, Grid, MuiThemeProvider, createMuiTheme, CssBaseline } from "@material-ui/core";

import Graphs from "./components/Graphs/Graphs"

import { data } from "./data/data";

import DataTable from "./components/DataTable/DataTable";

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
              Our website features a 3d globe detailing broad country specific statistics, a graphical timeline of the coronavirus outbreak, a 2d map detailing local data (where possible), and a raw data table.
              <br></br>
              <br></br>
              When using the 3d globe, hover over a country to view statistics for that respective country. To generate a graphical timeline of the coronavirus outbreak in a country, double click on that respective country.
              <br></br>
              <br></br>
              When using the 2d map, hover over a datapoint to view statistics for its respective location.
              <br></br>
              <br></br>
              The raw data table provides coronavirus statistics along with daily updates. It includes a search bar, where you can search for a specific country, however if it is not found, it will display “No Nations Found.” In addition, you may sort the data in various ways, for example, in increasing or decreasing order by nation, confirmed cases, confirmed deaths, or confirmed recoveries.
              <br></br>
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
              <Paper elevation={3} className="Paper">
                {loaded ? null : (
                  <Graphs
                    rawData={rawData}
                    name={name}
                  />
                )}
              </Paper>
            </div>
          </div>
          <Grid container>
            <Grid item sm={12}>
              <Paper elevation={3} className="Paper">
                {loaded ? null : (
                  <WorldMap></WorldMap>
                )}
              </Paper>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={12}>
              <Paper elevation={3} className="table-container">
                {loaded ? null : (
                  <DataTable></DataTable>
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
