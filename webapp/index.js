const { World, Engine, Runner, Render, Bodies } = Matter;

//MATTER.JS CONFIGURATIONS

//create an engine
const engine = Engine.create();
const { world } = engine; //a World object is created when an engine is created

//create a renderer
const render = Render.create({
	element: document.body, //where to display inside of HTML document
	engine: engine //specify engine to use
});

//run render and runner
Render.run(render);
Runner.run(Runner.create(), engine);

//add test shape
const shape = Bodies.rectangle(100, 100, 50, 50);
World.add(world, shape);
