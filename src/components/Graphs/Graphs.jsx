import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import "./Graphs.css";

import { Typography } from "@material-ui/core";

export default class Graphs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const { rawData, name } = this.props;
        return (
            <div className="graph-container">
                <Typography className="graph-title">{name}</Typography>
                <ResponsiveContainer>
                    <LineChart
                        data={rawData[name]}
                        margin={{ top: 20, right: 65, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid vertical={false} horizontal={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                        />
                        <YAxis
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ background: "transparent" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="confirmed"
                            name="Confirmed"
                            stroke="#b197fc"
                            dot={false}
                            strokeWidth={3}
                        />
                        <Line
                            type="monotone"
                            dataKey="recovered"
                            name="Recovered"
                            stroke="lightgreen"
                            dot={false}
                            strokeWidth={3}
                        />
                        <Line
                            type="monotone"
                            dataKey="deaths"
                            name="Deaths"
                            stroke="#ff6b6b"
                            dot={false}
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}