const { World, Engine, Runner, Render, Bodies } = Matter;

//********* MAZE DIMENSIONS *********
const width = 600;
const height = 600;
const border = 20;

const rows = 3;
const columns = 3;

//********* MATTER.JS CONFIGURATIONS *********

//create an engine
const engine = Engine.create();
const { world } = engine; //a World object is created when an engine is created

//create a renderer
const render = Render.create({
	element: document.body, //where to display inside of HTML document
	engine: engine, //specify engine to use
	options: {
		width,
		height
	}
});

//run render and runner
Render.run(render);
Runner.run(Runner.create(), engine);

//********* CANVAS BORDERS *********
const borders = [
	Bodies.rectangle(width / 2, 0, width, border, { isStatic: true }), //top
	Bodies.rectangle(width / 2, height, width, border, { isStatic: true }), //bottom
	Bodies.rectangle(0, height / 2, border, height, { isStatic: true }), //left
	Bodies.rectangle(width, height / 2, border, height, { isStatic: true }) //right
];

World.add(world, borders);

//********* MAZE CONFIGURATION *********
//Grid: 2D array representing the cells on the map
const grid = Array(rows)
	.fill(null) //create an array of size (rows), filled with null elements
	.map(() => {
		return Array(columns).fill(false); //.map iterates through each null element, replace with an array of size (columns) filled with 'false'
	});

//Verticals: 2D array representing vertical walls on the map
const verticals = Array(rows)
	.fill(null) //
	.map(() => {
		return Array(columns - 1).fill(false);
	});

//Horizontals: 2D array representing horizontal walls on the map
const horizontals = Array(rows - 1)
	.fill(null) //
	.map(() => {
		return Array(columns).fill(false);
	});
