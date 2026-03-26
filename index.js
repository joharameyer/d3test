// For bundlers such as Vite and Webpack omit https://esm.sh/
import { select } from 'https://esm.sh/d3-selection';
import { geoPath, geoMercator } from 'https://esm.sh/d3-geo';
import { json } from 'https://esm.sh/d3-fetch';

let projection = geoMercator()

let geoGenerator = geoPath()
	.projection(projection);

function handleMouseover(e, d) {
    let pixelArea = geoGenerator.area(d);
    let bounds = geoGenerator.bounds(d);
    let centroid = geoGenerator.centroid(d);
    let measure = geoGenerator.measure(d);

    select('#content .info')
        .text(d.properties["Constituency Name"] + 
              ' (area = ' + pixelArea.toFixed(1) + 
              ', measure = ' + measure.toFixed(1) + ')');

    select('#content .bounding-box rect')
        .attr('x', bounds[0][0])
        .attr('y', bounds[0][1])
        .attr('width', bounds[1][0] - bounds[0][0])
        .attr('height', bounds[1][1] - bounds[0][1]);

    select('#content .centroid')
        .style('display', 'inline')
        .attr('transform', 'translate(' + centroid + ')');
}

function update(geojson) {
	let u = select('#content g.map')
		.selectAll('path')
		.data(geojson.features);

u.enter()
  .append('path')
  .attr('d', geoGenerator)       // only once!
  .attr('fill', 'red')           // make it visible
  .attr('stroke', 'black')
  .attr('stroke-width', 0.5)
  .on('mouseover', handleMouseover);
	
}



// REQUEST DATA
json('https://github.com/joharameyer/d3test/blob/487580a752f694b987040b539955d5959e01ed9f/ward.geojson')
  .then(function(data) {
    projection.fitSize([400, 600], data);
    update(data);
  });

