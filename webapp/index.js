const { World, Engine, Runner, Render, Bodies } = Matter;

//********* MAZE DIMENSIONS *********
const width = 600;
const height = 600;

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
	Bodies.rectangle(300, 0, 600, 20, { isStatic: true }), //top
	Bodies.rectangle(300, 600, 600, 20, { isStatic: true }), //bottom
	Bodies.rectangle(0, 300, 20, 600, { isStatic: true }), //left
	Bodies.rectangle(600, 300, 20, 600, { isStatic: true }) //right
];

World.add(world, borders);

//********* MAZE CONFIGURATION *********
//Grid: 2D array representing the cells on the map
const grid = Array(3)
	.fill(null) //create an array of size 3, filled with null elements
	.map(() => {
		return Array(3).fill(false); //.map iterates through each null element, replace with an array of size 3 filled with 'false'
	});

//Verticals: 2D array representing vertical walls on the map
const verticals = Array(3)
	.fill(null) //
	.map(() => {
		return Array(2).fill(false);
	});

//Horizontals: 2D array representing horizontal walls on the map
const horizontals = Array(2)
	.fill(null) //
	.map(() => {
		return Array(3).fill(false);
	});
