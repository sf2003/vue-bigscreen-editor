export default {
  defaultOption: {
    PaintStyle: {stroke: '#606266', strokeWidth: 2, cursor: 'pointer'},
    Connector : "Bezier",
    HoverPaintStyle: {stroke: '#4a90e2'},
    Overlays: [['Arrow', {width: 8, length: 8, location: 0.5}]],
  },

  connectOption: {
    anchor: 'Continuous',
    endpoints: ['Dot', 'Rectangle'],
    endpointStyles: [{fill: '#606266', radius: 6}, {fill: '#606266', width: 12, height: 12}],
    endpointHoverStyles: [{fill: '#4a90e2', radius: 8}, {fill: '#4a90e2', width: 16, height: 16}]
  },

  targetOption: {
    anchor: 'Continuous',
    endpoint: 'Rectangle',
    endpointStyle: {fill: '#606266', width: 12, height: 12},
    endpointHoverStyle: {fill: '#4a90e2', width: 16, height: 16}
  },

  sourceOption: {
    anchor: 'Continuous',
    endpoint: 'Dot',
    endpointStyle: {fill: '#606266', radius: 6},
    endpointHoverStyle: {fill: '#4a90e2', radius: 8}
  }
}
