// For bundlers like Vite/Webpack, remove esm.sh URLs if installed via npm
import { select } from 'https://esm.sh/d3-selection';
import { geoPath, geoMercator } from 'https://esm.sh/d3-geo';
import { json } from 'https://esm.sh/d3-fetch';

const svg = select('#content-svg');
let projection = geoMercator();
let geoGenerator = geoPath().projection(projection);

// Mouseover handler
function handleMouseover(e, d) {
  const pixelArea = geoGenerator.area(d);
  const bounds = geoGenerator.bounds(d);
  const centroid = geoGenerator.centroid(d);
  const measure = geoGenerator.measure(d);

  // Update info
  select('#content .info')
    .text(d.properties["Constituency Name"] +
          ' (area = ' + pixelArea.toFixed(1) +
          ', measure = ' + measure.toFixed(1) + ')');

  // Update bounding box
  select('#content .bounding-box rect')
    .attr('x', bounds[0][0])
    .attr('y', bounds[0][1])
    .attr('width', bounds[1][0] - bounds[0][0])
    .attr('height', bounds[1][1] - bounds[0][1]);

  // Update centroid
  select('#content .centroid')
    .style('display', 'inline')
    .attr('transform', 'translate(' + centroid + ')');
}

// Update map
function update(geojson) {
  // Fit projection to SVG size
  projection.fitSize([parseInt(svg.attr('width')), parseInt(svg.attr('height'))], geojson);
  geoGenerator = geoPath().projection(projection);

  const u = svg.select('g.map')
    .selectAll('path')
    .data(geojson.features);

  u.enter()
    .append('path')
    .attr('d', geoGenerator)
    .attr('fill', 'steelblue') // visible fill
    .attr('stroke', '#fff')
    .attr('stroke-width', 0.5)
    .on('mouseover', handleMouseover);
}

// Load GeoJSON
json('https://raw.githubusercontent.com/joharameyer/d3test/f8e76eb884f7dc677ccccaa6f3b9419cfacadea6/ward.geojson')
  .then(data => {
    console.log('Loaded features:', data.features.length);
    update(data);
  })
  .catch(err => console.error(err));
