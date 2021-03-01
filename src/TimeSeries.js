import { VegaLite } from 'react-vega';

const TimeSeries = ({ data, minYear, maxYear }) => {
  let dataTable =  data.counts && data.counts.map(countPair => ({ ...countPair, disease: data.disease }))
  dataTable = dataTable && dataTable.filter(
    row => (minYear ? +row.year >= minYear : true) && (maxYear ? +row.year <= maxYear : true)
  );

  const spec = {
    title: 'Disease Publication Trends',
    width: 400,
    height: 200,
    layer: [
      {
        encoding: {
          x: { field: 'year', type: 'temporal', title: 'Year' },
          y: { field: 'count', type: 'quantitative', title: 'Number of Publications' },
          color: {field: 'disease', type: "nominal"}
        },
        layer:[
          { mark: { type: 'line', clip: true }},
          {
            params: [{
              name: 'label',
              select: {
                type: 'point',
                encodings: ['x'],
                nearest: true,
                on: 'mouseover'
              }
            }],
            mark: 'point',
            encoding: {
              opacity: {
                condition: {
                  param: 'label',
                  empty: false,
                  value: 1,
                },
                value: 0
              }
            }
          },
        ]
      },
      {
        transform: [{filter: {param: "label", empty: false}}],
        layer: [
          {
            mark: {type: "rule", color: "gray"},
            encoding: {
              x: {type: "temporal", field: "year", aggregate: "min"}
            }
          },
          {
            encoding: {
              text: {type: "quantitative", field: "count"},
              x: {type: "temporal", field: "year"},
              y: {type: "quantitative", field: "count"}
            },
            layer: [
              {
                mark: {
                  type: "text",
                  stroke: "white",
                  strokeWidth: 2,
                  align: "left",
                  dx: 5,
                  dy: -5
                }
              },
              {
                mark: {type: "text", align: "left", dx: 5, dy: -5},
                encoding: {
                  color: {type: "nominal", field: "disease"}
                }
              }
            ]
          }
        ]
      }
    ],
    data: { values: dataTable },
  };

  return (
    <VegaLite spec={spec} actions={false} />
  )
}

export default TimeSeries;