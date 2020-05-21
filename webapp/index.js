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

//add test shape
const shape = Bodies.rectangle(100, 100, 50, 50);
World.add(world, shape);

//********* CANVAS BORDERS *********
const borders = [
	Bodies.rectangle(300, 0, 600, 20, { isStatic: true }), //top
	Bodies.rectangle(300, 600, 600, 20, { isStatic: true }), //bottom
	Bodies.rectangle(0, 300, 20, 600, { isStatic: true }), //left
	Bodies.rectangle(600, 300, 20, 600, { isStatic: true }) //right
];

World.add(world, borders);
