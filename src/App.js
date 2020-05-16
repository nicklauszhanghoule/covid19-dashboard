import React from 'react';
import './App.css';
import WorldGlobe from "./components/WorldGlobe/WorldGlobe";

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
                <br></br>
                Data Sources: <br></br>
                World Health Organization (WHO): https://www.who.int/ <br></br>
                DXY.cn. Pneumonia. 2020. http://3g.dxy.cn/newh5/view/pneumonia. <br></br>
                BNO News: https://bnonews.com/index.php/2020/02/the-latest-coronavirus-cases/ <br></br>
                National Health Commission of the People’s Republic of China (NHC):
                http://www.nhc.gov.cn/xcs/yqtb/list_gzbd.shtml <br></br>
                China CDC (CCDC): http://weekly.chinacdc.cn/news/TrackingtheEpidemic.htm <br></br>
                Hong Kong Department of Health: https://www.chp.gov.hk/en/features/102465. <br></br>
                Macau Government: https://www.ssm.gov.mo/portal/ <br></br>
                Taiwan CDC: https://sites.google.com/cdc.gov.tw/2019ncov/taiwan?authuser=0 <br></br>
                US CDC: https://www.cdc.gov/coronavirus/2019-ncov/index. <br></br>
                Government of Canada: https://www.canada.ca/en/public-health/services/diseases/coronavirus.html <br></br>
                Australia Government Department of Health: https://www.health.gov.au/news/coronavirus-update-at-a-glance <br></br>
                European Centre for Disease Prevention and Control (ECDC): https://www.ecdc.europa.eu/en/geographical-distribution-2019-ncov-cases <br></br>
                Ministry of Health Singapore (MOH): https://www.moh.gov.sg/covid-19 <br></br>
                Italy Ministry of Health: http://www.salute.gov.it/nuovocoronavirus <br></br>
                1Point3Arces: https://coronavirus.1point3acres.com/en <br></br>
                WorldoMeters: https://www.worldometers.info/coronavirus/ <br></br>
                COVID Tracking Project: https://covidtracking.com/data. (US Testing and Hospitalization Data. We use the maximum reported value from "Currently" and "Cumulative" Hospitalized for our hospitalization number reported for each state.) <br></br>
                French Government: https://dashboard.covid19.data.gouv.fr/ <br></br>
                COVID Live (Australia): https://www.covidlive.com.au/ <br></br>
                Washington State Department of Health: https://www.doh.wa.gov/emergencies/coronavirus <br></br>
                Maryland Department of Health: https://coronavirus.maryland.gov/ <br></br>
                New York State Department of Health: https://health.data.ny.gov/Health/New-York-State-Statewide-COVID-19-Testing/xdss-u53e/data <br></br>
                NYC Department of Health and Mental Hygiene: https://www1.nyc.gov/site/doh/covid/covid-19-data.page and https://github.com/nychealth/coronavirus-data <br></br>
                Florida Department of Health Dashboard: https://services1.arcgis.com/CY1LXxl9zlJeBuRZ/arcgis/rest/services/Florida_COVID19_Cases/FeatureServer/0 and https://fdoh.maps.arcgis.com/apps/opsdashboard/index.html#/8d0de33f260d444c852a615dc7837c86 <br></br>
                Palestine (West Bank and Gaza): https://corona.ps/details <br></br>
                Israel: https://govextra.gov.il/ministry-of-health/corona/corona-virus/ <br></br>
                Ministry of Health, Republic of Kosovo: https://kosova.health/ and https://covidks.s3.amazonaws.com/data.json <br></br>
                Colorado: https://covid19.colorado.gov/covid-19- <br></br>
                Dati COVID-19 Italia: https://github.com/pcm-dpc/COVID-19 <br></br>
                Berliner Morgenpost (Germany): https://interaktiv.morgenpost.de/corona-virus-karte-infektionen-deutschland-weltweit/ <br></br>
                rtve (Spain): https://www.rtve.es/noticias/20200514/mapa-del-coronavirus-espana/2004681.shtml <br></br>
                Ministry of Health, Republic of Serbia: https://covid19.rs/homepage-english/ <br></br>
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
          <Grid container>
            <Grid item sm={6}>
              <Paper elevation={3} className="Paper">
                <Typography>Covid Info</Typography>
              </Paper>
            </Grid>
            <Grid item sm={6}>
              <Paper elevation={3} className="Paper">
                <Typography>Covid Tips</Typography>
              </Paper>
            </Grid>
          </Grid>
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
          <Grid container>
            <Grid item sm={6}>
              <Paper elevation={3} className="Paper">
                {loaded ? null : (
                  <Typography>TABLE</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item sm={6}>
              <Paper elevation={3} className="Paper">
                {loaded ? null : (
                  <Graphs
                    rawData={rawData}
                    name={name}
                  />
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
