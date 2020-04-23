import React from "react";
import Globe from "react-globe.gl";
import * as d3 from "d3";

export default class WorldGlobe extends React.Component {
  constructor(props) {
    super(props);
    this.globeEf = React.createRef();
    this.colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);
    this.state = {
      isLoading: true,
      transitionDuration: 1000,
      isHovered: "",
    };
  }
  componentDidMount() {
    const maxConfirmed = this.props.data.reduce(
      (max, item) => Math.max(max, item.confirmed),
      0
    );
    this.colorScale.domain([0, maxConfirmed]);
    this.setState({ isLoading: false });
    this.globeEf.current.pointOfView({altitude: 1.6});
  }
  render() {
    const { data, width, height } = this.props;
    const { isLoading, transitionDuration, isHovered } = this.state;
    return (
      <Globe
      ref={this.globeEf}
        globeImageUrl='//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
        bumpImageUrl='//unpkg.com/three-globe/example/img/earth-topology.png'
        showGraticules
        polygonsData={data}
        polygonAltitude={i => i === isHovered ? 0.12 : 0.06}
        polygonCapColor={
          isLoading
            ? "#ffffaa"
            : i => (i === isHovered ? "lightgreen" : this.colorScale(i.confirmed))
        }
        polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
        polygonStrokeColor={() => "#111"}
        polygonLabel={({ name, code, confirmed, deaths, recovered }) => `
          <b>${name} (${code})</b>
          ${`
              <br />
              Confirmed: <i>${confirmed}</i><br />
              ${recovered ? `Recovered: <i>${recovered}</i><br />` : ""}
              Deaths: <i>${deaths}</i>
            `}
        `}
        onPolygonHover={i => this.setState({ isHovered: i })}
        polygonsTransitionDuration={transitionDuration}
        height= {height/2}
        width={width - 30 + 2.2}
      />
    );
  }
}