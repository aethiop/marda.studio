var utils = {
	norm: function (value, min, max) {
		return (value - min) / (max - min);
	},

	lerp: function (norm, min, max) {
		return (max - min) * norm + min;
	},

	map: function (value, sourceMin, sourceMax, destMin, destMax) {
		return utils.lerp(
			utils.norm(value, sourceMin, sourceMax),
			destMin,
			destMax
		);
	},

	clamp: function (value, min, max) {
		return Math.min(
			Math.max(value, Math.min(min, max)),
			Math.max(min, max)
		);
	},

	distance: function (p0, p1) {
		var dx = p1.x - p0.x,
			dy = p1.y - p0.y;
		return Math.sqrt(dx * dx + dy * dy);
	},

	distanceXY: function (x0, y0, x1, y1) {
		var dx = x1 - x0,
			dy = y1 - y0;
		return Math.sqrt(dx * dx + dy * dy);
	},

	circleCollision: function (c0, c1) {
		return utils.distance(c0, c1) <= c0.radius + c1.radius;
	},

	circlePointCollision: function (x, y, circle) {
		return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
	},

	pointInRect: function (x, y, rect) {
		return (
			utils.inRange(x, rect.x, rect.x + rect.width) &&
			utils.inRange(y, rect.y, rect.y + rect.height)
		);
	},

	inRange: function (value, min, max) {
		return value >= Math.min(min, max) && value <= Math.max(min, max);
	},
	rectVsRect: function (r0, r1) {
		// console.log(r0, r1);
		return (
			r0.x < r1.x + r1.w &&
			r0.x + r0.w > r1.x &&
			r0.y < r1.y + r1.h &&
			r0.y + r0.h > r1.y
		);
	},
	rayVsRect: function (origin, direction, target) {
		let t_near = {
			x: (target.x - origin.x) / direction.x,
			y: (target.y - origin.y) / direction.y,
		};
		let t_far = {
			x: (target.x + target.w - origin.x) / direction.x,
			y: (target.y + target.h - origin.y) / direction.y,
		};

		if (isNaN(t_far.y) || isNaN(t_far.x)) return;
		if (isNaN(t_near.y) || isNaN(t_near.x)) return;

		if (t_near.x > t_far.x) {
			let temp = t_near;
			t_near.x = t_far.x;
			t_far.x = temp.x;
		}
		if (t_near.y > t_far.y) {
			let temp = t_near;
			t_near.y = t_far.y;
			t_far.y = temp.y;
		}
		if (t_near.x > t_far.y || t_near.y > t_far.x) {
			return false;
		}

		let hit_far = Math.min(t_far.x, t_far.y);
		let hit_near = Math.max(t_near.x, t_near.y);

		if (hit_far < 0) {
			return false;
		}
		let contact = {};
		contact.x = origin.x + hit_near * direction.x;
		contact.y = origin.y + hit_near * direction.y;
		if (t_near.x > t_near.y) {
			if (direction.x < 0) contact.normal = { x: 1, y: 0 };
			else contact.normal = { x: -1, y: 0 };
		} else if (t_near.x < t_near.y) {
			if (direction.y < 0) contact.normal = { x: 0, y: 1 };
			else contact.normal = { x: 0, y: -1 };
		}

		return { contact, hit: hit_near };
	},
	dynamicRectVsStaticRect: function (dynamic, static, diff) {
		if (dynamic.vx == 0 && dynamic.vy == 0) {
			return false;
		}
		let expanded_target = {
			x: static.x - dynamic.w / 2,
			y: static.y - dynamic.h / 2,
			w: static.w + dynamic.w,
			h: static.h + dynamic.h,
		};

		var ray = this.rayVsRect(
			{ x: dynamic.x + dynamic.w / 2, y: dynamic.y + dynamic.h / 2 },
			{ x: dynamic.vx * diff, y: dynamic.vy * diff },
			expanded_target
		);
		if (!!ray && ray.hit) {
			if (ray.hit <= 1) {
				return {
					expanded: expanded_target,
					contact: ray.contact,
					time: ray.hit,
				};
			}
		}
		return false;
	},
	rangeIntersect: function (min0, max0, min1, max1) {
		return (
			Math.max(min0, max0) >= Math.min(min1, max1) &&
			Math.min(min0, max0) <= Math.max(min1, max1)
		);
	},

	rectIntersect: function (r0, r1) {
		return (
			utils.rangeIntersect(
				r0.x,
				r0.x + r0.w / 2,
				r1.x,
				r1.x + r1.w / 2
			) && utils.rangeIntersect(r0.y, r0.y + r0.h, r1.y, r1.y + r1.h)
		);
	},

	degreesToRads: function (degrees) {
		return (degrees / 180) * Math.PI;
	},

	radsToDegrees: function (radians) {
		return (radians * 180) / Math.PI;
	},

	randomRange: function (min, max) {
		return min + Math.random() * (max - min);
	},

	randomInt: function (min, max) {
		return Math.floor(min + Math.random() * (max - min + 1));
	},
};
var vector = {
	_x: 1,
	_y: 0,

	create: function (x, y) {
		var obj = Object.create(this);
		obj.setX(x);
		obj.setY(y);
		return obj;
	},

	setX: function (value) {
		this._x = value;
	},

	getX: function () {
		return this._x;
	},

	setY: function (value) {
		this._y = value;
	},

	getY: function () {
		return this._y;
	},

	setAngle: function (angle) {
		var length = this.getLength();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},

	getAngle: function () {
		return Math.atan2(this._y, this._x);
	},

	setLength: function (length) {
		var angle = this.getAngle();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},

	getLength: function () {
		return Math.sqrt(this._x * this._x + this._y * this._y);
	},

	add: function (v2) {
		return vector.create(this._x + v2.getX(), this._y + v2.getY());
	},

	subtract: function (v2) {
		return vector.create(this._x - v2.getX(), this._y - v2.getY());
	},

	multiply: function (val) {
		return vector.create(this._x * val, this._y * val);
	},

	divide: function (val) {
		return vector.create(this._x / val, this._y / val);
	},

	addTo: function (v2) {
		this._x += v2.getX();
		this._y += v2.getY();
	},

	subtractFrom: function (v2) {
		this._x -= v2.getX();
		this._y -= v2.getY();
	},

	multiplyBy: function (val) {
		this._x *= val;
		this._y *= val;
	},

	divideBy: function (val) {
		this._x /= val;
		this._y /= val;
	},
};

var physics = {
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	w: 0,
	h: 0,
	mass: 1,
	radius: 0,
	bounce: -1,
	friction: 1,
	gravity: 0,
	springs: null,
	gravitations: null,

	create: function (x, y, speed, direction, grav) {
		var obj = Object.create(this);
		obj.x = x;
		obj.y = y;
		obj.vx = Math.cos(direction) * speed;
		obj.vy = Math.sin(direction) * speed;
		obj.gravity = grav || 0;
		obj.springs = [];
		obj.gravitations = [];
		return obj;
	},

	addGravitation: function (p) {
		this.removeGravitation(p);
		this.gravitations.push(p);
	},

	removeGravitation: function (p) {
		for (var i = 0; i < this.gravitations.length; i += 1) {
			if (p === this.gravitations[i]) {
				this.gravitations.splice(i, 1);
				return;
			}
		}
	},

	addSpring: function (point, k, length) {
		this.removeSpring(point);
		this.springs.push({
			point: point,
			k: k,
			length: length || 0,
		});
	},

	removeSpring: function (point) {
		for (var i = 0; i < this.springs.length; i += 1) {
			if (point === this.springs[i].point) {
				this.springs.splice(i, 1);
				return;
			}
		}
	},

	getSpeed: function () {
		return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
	},

	setSpeed: function (speed) {
		var heading = this.getHeading();
		this.vx = Math.cos(heading) * speed;
		this.vy = Math.sin(heading) * speed;
	},

	getHeading: function () {
		return Math.atan2(this.vy, this.vx);
	},

	setHeading: function (heading) {
		var speed = this.getSpeed();
		this.vx = Math.cos(heading) * speed;
		this.vy = Math.sin(heading) * speed;
	},

	accelerate: function (ax, ay) {
		this.vx += ax;
		this.vy += ay;
	},

	update: function () {
		this.handleSprings();
		this.handleGravitations();
		this.vx *= this.friction;
		// this.vy *= this.friction;
		this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;
	},

	handleGravitations: function () {
		for (var i = 0; i < this.gravitations.length; i += 1) {
			this.gravitateTo(this.gravitations[i]);
		}
	},

	handleSprings: function () {
		for (var i = 0; i < this.springs.length; i += 1) {
			var spring = this.springs[i];
			this.springTo(spring.point, spring.k, spring.length);
		}
	},

	angleTo: function (p2) {
		return Math.atan2(p2.y - this.y, p2.x - this.x);
	},

	distanceTo: function (p2) {
		var dx = p2.x - this.x,
			dy = p2.y - this.y;

		return Math.sqrt(dx * dx + dy * dy);
	},

	gravitateTo: function (p2) {
		var dx = p2.x - this.x,
			dy = p2.y - this.y,
			distSQ = dx * dx + dy * dy,
			dist = Math.sqrt(distSQ),
			force = p2.mass / distSQ,
			ax = (dx / dist) * force,
			ay = (dy / dist) * force;

		this.vx += ax;
		this.vy += ay;
	},

	springTo: function (point, k, length) {
		var dx = point.x - this.x,
			dy = point.y - this.y,
			distance = Math.sqrt(dx * dx + dy * dy),
			springForce = (distance - length || 0) * k;
		(this.vx += (dx / distance) * springForce),
			(this.vy += (dy / distance) * springForce);
	},
};
