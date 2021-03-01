import { VegaLite } from 'react-vega';

const Map = ({ data }) => {
  const spec = {
    title: 'Publication Count by Country (All Years)',
    width: 1000,
    height: 500,
    layer: [
      {
        data: {
            url: "data/world-110m.json",
            format: {
            type: "topojson",
            feature: "countries"
            }
        },
        projection: {
            type: "equalEarth"
        },
        mark: {
          type: "geoshape",
          fill: "lightgray",
          stroke: "white"
        }
      },
      {
        data: { values: data },
        projection: {
            type: "equalEarth"
        },
        mark: {type: "circle"},
        encoding: {
          tooltip: [
            {field: "country"},
            {field: "count"},
          ],
          longitude: {
              field: "latlng[1]",
              type: "quantitative"
          },
          latitude: {
              field: "latlng[0]",
              type: "quantitative"
          },
          color: {value: "steelblue"},
          size: {
            field: "count",
            type: "quantitative",
            scale: {rangeMax: 2000, rangeMin:20},
            legend: null
          },
        }
      }
    ]
  };

  return (
    <VegaLite spec={spec} actions={false} />
  )
}

export default Map;