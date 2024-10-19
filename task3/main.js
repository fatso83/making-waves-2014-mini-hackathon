var velocityXLookup = [],
	velocityYLookup = [];

for (var i = 0; i <= 360; i++) {
	velocityXLookup[i] = Math.sin(i * Math.PI / 180);
	velocityYLookup[i] = Math.cos(i * Math.PI / 180);
}

var CrazySpaceship = function (offsetX, offsetY) {
	this.radius = 250;
	this.angle = 0;
	this.x = 0;
	this.y = 0;
	this.flameX = 0;
	this.flameY = 0;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.image = undefined;
};

/**
 * Update spaceship position
 */
CrazySpaceship.prototype.update = function () {
	this.angle += 0.03;
	this.x = (this.radius * Math.cos(this.angle)) + this.offsetX;
	this.y = (this.radius * Math.sin(this.angle)) + this.offsetY;

	this.flameX = (this.radius * Math.cos(this.angle - 0.2)) + this.offsetX;
	this.flameY = (this.radius * Math.sin(this.angle - 0.2)) + this.offsetY;
};

/**
 * Render spaceship on canvas
 */
spaceShip = document.createElement('img');
spaceShip.src = 'img/spaceship.png';
CrazySpaceship.prototype.render = function (ctx) {

	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);
	ctx.drawImage(spaceShip, -spaceShip.height / 2, -spaceShip.width / 2, spaceShip.width, spaceShip.height);
	ctx.stroke();
	ctx.restore();
};

var Field = function (x, y, mass) {
	this.x = x;
	this.y = y;
	this.mass = mass;
};

var Particle = function (settings) {
	this.position = { x : settings.x, y : settings.y};
	this.velocity = { x : settings.velocityX, y : settings.velocityY};
	this.acceleration = { x : settings.accelerationX, y : settings.accelerationY };
	this.size = settings.size;
	this.sizeStep = settings.sizeStep;
	this.fadeStep = settings.fadeStep;
	this.alpha = 1;
	this.alive = true;
};

Particle.pool = [];

/**
 * Update particle position
 */
Particle.prototype.move = function (fields) {

	var field, force, distanceVectorX, distanceVectorY;

	// for each passed field
	for (var i = 0; i < fields.length; i++) {
		field = fields[i];

		// find the distance between the particle and the field
		distanceVectorX = this.position.x - field.x;
		distanceVectorY = this.position.y - field.y;

		// calculate the force via MAGIC and HIGH SCHOOL SCIENCE!
		force = field.mass / Math.pow(distanceVectorX * distanceVectorX + distanceVectorY * distanceVectorY, 1.5);

		// add to the total acceleration the force adjusted by distance
		this.acceleration.x += distanceVectorX * force;
		this.acceleration.y += distanceVectorY * force;
	}

	//add vector acceleration
	this.velocity.x += this.acceleration.x;
	this.velocity.y += this.acceleration.y;

	//update position
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;

	//change alpha level and size
	this.alpha -= this.fadeStep;
	this.size += this.sizeStep;

	//check if still alive
	if (this.size < 1 || this.alpha < 0.1) {
		this.alive = false;
		Particle.addToPool(this);
	}
};

Particle.addToPool = function(p) {
	Particle.pool.push(p);
};

Particle.create = function (settings) {
	if (Particle.pool.length === 0) {
		return new Particle(settings);
	} else {
		var p = Particle.pool.pop();

		p.position = { x : settings.x, y : settings.y};
		p.velocity = { x : settings.velocityX, y : settings.velocityY};
		p.acceleration = { x : settings.accelerationX, y : settings.accelerationY };
		p.size = settings.size;
		p.sizeStep = settings.sizeStep;
		p.fadeStep = settings.fadeStep;
		p.alpha = 1;
		p.alive = true;
		return p;
	}
};


var ParticleEmitter = function () {
	this.particles = [];
	this.fields = [];
	this.pool = [];
};

particleImage = document.createElement('img');
particleImage.src = 'img/particleImage.png';

/**
 * Add force filed to emitter
 */
ParticleEmitter.prototype.addField = function (field) {
	this.fields.push(field);
};

/**
 * emit new set of particles
 */
var emitCalls = 0;
ParticleEmitter.prototype.emit = function (x, y) {
	emitCalls++;

	var max = Math.floor(Math.random() * (41)) + 20, // get random amount of particles to emit (20 - 60)
		velocity,
		velocityAngle,
		velocityX,
		velocityY;

	for (var i = 0; i <= max; i++) {
		velocity = Math.floor(Math.random() * 3) + 3; 		// random velocity
		velocityAngle = Math.floor(Math.random() * 361);		// random velocity angle

		velocityX = velocityXLookup[velocityAngle] * velocity;
		velocityY = velocityYLookup[velocityAngle] * velocity;

		this.particles.push(
			Particle.create({
				x             : x,
				y             : y,
				velocityX     : velocityX,
				velocityY     : velocityY,
				accelerationX : 0,
				accelerationY : 0,
				size          : Math.floor(Math.random() * (51)) + 5,
				sizeStep      : (Math.floor(Math.random() * (51)) - 80) / 100,
				fadeStep      : 0.005
			}));
	}

};

/**
 * Update particles position
 */
var updateCalls = 0;
ParticleEmitter.prototype.update = function () {
	updateCalls++;
	var particles = this.particles;
	for (var i = 0 ; i < particles.length - 1; i++) {
		if (particles[i].alive) {
			particles[i].move(this.fields);
		} else {
			particles.splice(i, 1);
		}
	}
};

/**
 * Render particles on canvas
 */
var buffer_canvas = document.createElement('canvas'),
	buffer_context = buffer_canvas.getContext('2d'),
	height = window.innerHeight;
width = window.innerWidth;


buffer_canvas.width = width;
buffer_canvas.height = height;
var renderCalls = 0;
ParticleEmitter.prototype.render = function (ctx) {
	renderCalls++;

	var particles = this.particles;
	ctx.save();

//	buffer_context.clearRect(0, 0, width, height);

	ctx.globalCompositeOperation = 'lighter';
	for (var i = 0; i <= particles.length - 1; i++) {
		var particle = particles[i];
		ctx.globalAlpha = particle.alpha;

		ctx.drawImage(particleImage,
			particle.position.x - particle.size / 2,
			particle.position.y - particle.size / 2,
			particle.size,
			particle.size);
	}
//	ctx.drawImage(buffer_canvas, 0, 0);
	ctx.restore();
};
