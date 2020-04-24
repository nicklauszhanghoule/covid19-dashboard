import React from "react";
import "./WorldTotals.css";

import { Typography } from "@material-ui/core";


export default class WorldTotals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const totalConfirmed = this.props.data.reduce(
            (a, b) => a + b.confirmed,
            0
        );
        const totalRecovered = this.props.data.reduce(
            (a, b) => a + b.recovered,
            0
        );
        const totalDeaths = this.props.data.reduce(
            (a, b) => a + b.deaths,
            0
        );
        document.getElementById("totalConfirmed").innerHTML = `${totalConfirmed}`;
        document.getElementById("totalRecovered").innerHTML = `${totalRecovered}`;
        document.getElementById("totalDeaths").innerHTML = `${totalDeaths}`;
    }
    render() {
        return (
            <div className="global-info-container">
                <Typography className="total-text"><span className="confirmed">Confirmed: </span><span id="totalConfirmed"></span></Typography>
                <Typography className="total-text"><span className="recovered">Recovered: </span><span id="totalRecovered"></span></Typography>
                <Typography className="total-text"><span className="deaths">Deaths: </span><span id="totalDeaths"></span></Typography>
            </div>
        );
    }
}