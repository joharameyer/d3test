// For bundlers such as Vite and Webpack omit https://esm.sh/
import { select, selectAll } from 'https://esm.sh/d3-selection';

// Change colour of first circle
select('circle')
	.style('fill', 'orange')

// Change radius of all circles
selectAll('circle')
	.attr('r', 20);

// Add .selected class to 3rd circle
select('circle:nth-child(3)')
	.classed('selected', true);

// Set checked property of checkbox
select('input.robot-checkbox')
	.property('checked', true);

// Set text on .title element
select('.title')
	.text('D3 in Depth selection example')
	
