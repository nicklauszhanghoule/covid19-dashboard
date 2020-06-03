import React from 'react';
import "./DataTable.css";
import { Input, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, Grid } from "@material-ui/core";
import { data } from "../../data/data.json";
let labelId;
let count = 0;

function createData(country, confirmed, confirmedY, deaths, deathsY, recovered, recoveredY) {
    return { country, confirmed, confirmedY, deaths, deathsY, recovered, recoveredY };
}
const rows = [];
function EnhancedTableHead(props) {
    const headCells = [
        { id: 'country', label: 'Country', minWidth: 100, format: (value) => value.toLocaleString(), },
        { id: 'confirmed', label: 'Confirmed', minWidth: 100, format: (value) => value.toLocaleString(), },
        { id: 'deaths', label: 'Deaths', minWidth: 100, format: (value) => value.toLocaleString(), },
        { id: 'recovered', label: 'Recoveries', minWidth: 100, format: (value) => value.toLocaleString(), },
    ];

    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>

                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'desc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className="visuallyHidden">
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );

}
export default class DataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: "desc",
            search: "",
            orderBy: "confirmed",
        };
    }

    componentDidMount() {
        fetch("https://pomber.github.io/covid19/timeseries.json")
            .then(res => res.json())
            .then(
                result => {
                    data.map(country => {
                        const { name } = country;
                        const found = result[name] && result[name].slice(-1)[0];
                        const foundY = result[name] && result[name].slice(-2)[0];
                        const changeC = (found ? found.confirmed : 0) - (foundY ? foundY.confirmed : 0);
                        const changeD = (found ? found.deaths : 0) - (foundY ? foundY.deaths : 0);
                        const changeR = (found ? found.recovered : 0) - (foundY ? foundY.recovered : 0);
                        rows[count] = createData(name, found ? found.confirmed : 0, " (+" + changeC + ")", found ? found.deaths : 0, " (+" + changeD + ")", found ? found.recovered : 0, " (+" + changeR + ")");
                        count++;
                    });
                },
            );
    }

    handleChange = (event, country) => {
        this.setState({ search: event.target.value });
        if (rows.filter(this.searchingFor(event.target.value)) == "") {
            rows[180] = createData("No Nations Found");
        }
        else if (rows.filter(this.searchingFor(event.target.value)).length !== 1) {
            delete rows[180];
        }
    };

    handleRequestSort = (event, property) => {
        const isAsc = this.state.orderBy === property && this.state.order === 'desc';
        if (property === "country" && (!(this.state.orderBy === "country"))) {
            this.setState({ order: "asc" });
        }
        else {
            this.setState({ order: isAsc ? "asc" : "desc" });
        }
        this.setState({ orderBy: property });
    };

    searchingFor(search) {
        return function (x) {
            if (x.country !== "No Nations Found") {
                return x.country.toLowerCase().includes(search.toLowerCase() || search);
            }
            else {
                return x.country;
            }
        }
    }

    descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        else if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => this.descendingComparator(a, b, orderBy)
            : (a, b) => -this.descendingComparator(a, b, orderBy);
    }

    stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    render() {
        return (
            <div className="root">
                <Grid container >
                    <Grid item sm={6}>
                        <Paper elevation={3} className="paper">
                            <TableContainer className="container">
                                <Input
                                    type="text"
                                    className="input"
                                    onChange={this.handleChange}
                                    placeholder="Search..."
                                />
                                <Table
                                    id="myTable"
                                    className="table"
                                    aria-labelledby="tableTitle"
                                    size={"small"}
                                    aria-label="enhanced table"
                                >
                                    <EnhancedTableHead
                                        className="classes"
                                        order={this.state.order}
                                        orderBy={this.state.orderBy}
                                        onRequestSort={this.handleRequestSort}
                                        rowCount={rows.length}
                                    />
                                    <TableBody>
                                        {this.stableSort(rows, this.getComparator(this.state.order, this.state.orderBy))
                                            .filter(this.searchingFor(this.state.search))
                                            .map((row, index) => {
                                                labelId = `enhanced-table-checkbox-${index}`;

                                                return (
                                                    <TableRow>
                                                        <TableCell className="country" component="th" id={labelId} scope="row" >{row.country}</TableCell>
                                                        <TableCell style={{ color: "#b197fc" }} align="left">{row.confirmed}{row.confirmedY}</TableCell>
                                                        <TableCell style={{ color: "#ff6b6b" }} className="deaths" align="left">{row.deaths}{row.deathsY}</TableCell>
                                                        <TableCell style={{ color: "lightgreen" }} className="recoveries" align="left">{row.recovered}{row.recoveredY}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
