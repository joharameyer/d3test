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
		.text(d.properties.name + ' (path.area = ' + pixelArea.toFixed(1) + ' path.measure = ' + measure.toFixed(1) + ')');

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
		.attr('d', geoGenerator)
		.on('mouseover', handleMouseover);
}



// REQUEST DATA
json('https://raw.githubusercontent.com/joharameyer/d3test/main/wards.geojson')
  .then(function(data) {
    projection.fitSize([400, 600], data);
    update(data);
  });

