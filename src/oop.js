/**
 * Objects, Classes and Interfaces
 *
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */
(function() {


/* Functionality:
----------------------------------------------------------------------------------------*/

/**
 * Indicates if object is of a specified kind
 *
 * @example
 *
 * ```source
 * if (capri.is(obj, IWatchable)) {
 *    obj.watch();
 * }
 * ```
 *
 * @param {object} obj Input object
 * @param {mixed} kind Class or interface
 *
 * @returns {boolean} `true` when object is of specified kind, otherwise `false`.
 */
capri.is = function(obj, kind) {
	return obj.getClass && obj.getClass().is(kind);
}


/* Objects:
----------------------------------------------------------------------------------------*/

/**
 * Inherited by all Capri classes
 *
 * @class
 * @abstract
 */
capri.Object = function() {}

capri.Object.__name = 'Object';
capri.Object.__qid = 'capri.Object';
capri.Object.__abstract = true;

/**
 * Get reference to class of object
 * @returns {class} Class reference
 */
capri.Object.prototype.getClass = function() {
	return this.constructor;
}

/**
 * Get class name of object
 *
 * @example
 *
 * ```source
 * vector = new mygame.Vector2d();
 * vector.getClassName();
 * // "Vector2d"
 * ```
 *
 * @returns {string} Name of class
 */
capri.Object.prototype.getClassName = function() {
	return this.constructor.__name;
}

/**
 * Get full class name of object (includes namespace)
 *
 * @example
 *
 * ```source
 * vector = new mygame.Vector2d();
 * vector.getFullClassName();
 * // "mygame.Vector2d"
 * ```
 *
 * @returns {string} Full name of class
 */
capri.Object.prototype.getFullClassName = function() {
	return this.constructor.__qid;
}

/**
 * Output name of class and immediate super class of object by default
 *
 * @example
 *
 * ```source
 * vector = new mygame.Vector2d();
 * vector.toString(); // "[mygame.Vector2d : capri.Object]"
 *
 * key = new mygame.Key(0, 0, 'yellow');
 * key.toString(); // "[mygame.Key : mygame.Entity]"
 * ```
 *
 * @returns {string}
 */
capri.Object.prototype.toString = function() {
	return this.__super
		? '[' + this.constructor.__qid + ' : ' + this.__super.__qid + ']'
		: '[' + this.constructor.__qid + ']';
}

/**
 * Get full name of class (includes namespace)
 *
 * @example
 *
 * ```source
 * mygame.Key.getFullName(); // "mygame.Key"
 * ```
 *
 * @returns {string} Full name of class
 */
capri.Object.getFullName = function() {
	return this.__qid;
}

/**
 * Get name of class
 *
 * @example
 *
 * ```source
 * mygame.Key.getName(); // "Key"
 * ```
 *
 * @returns {string} Name of class
 */
capri.Object.getName = function() {
	return this.__name;
}

/**
 * Get namespace of class
 *
 * @example
 *
 * ```source
 * mygame.Key.getNamespace(); // "mygame"
 * ```
 *
 * @returns {string} Namespace of class
 */
capri.Object.getNamespace = function() {
	return capri.ns.baseName(this.__qid);
}

/**
 * Get name of associated module
 *
 * @example
 *
 * ```source
 * capri.run(function(require) {
 *    var mymath = require('my/math')
 *       ;
 *    mymath.Vector.getModule(); // "my/math"
 * })
 * ```
 *
 * @returns {string} Name of associated module
 */
capri.Object.getModuleName = function() {
	return capri.ns.moduleName(this.__qid);
}

/**
 * Get reference of super class
 *
 * @example
 *
 * ```source
 * mygame.Key.getSuper();    // mygame.Entity
 * mygame.Entity.getSuper(); // capri.Object
 * capri.Object.getSuper();  // null
 * ```
 *
 * @returns {object|null} Class reference or `null`
 */
capri.Object.getSuper = function() {
	return this.prototype.__super;
}

/**
 * Get collection of subclasses
 *
 * @returns {object} Collection of subclasses indexed by class name
 */
capri.Object.getSubClasses = function() {
	return this.__sub !== undefined
		? this.__sub
		: []
}

/**
 * Determines if "is-a" relationship exists between classes and/or interfaces
 *
 * @example
 *
 * ```source
 * mygame.Key.is(mygame.Key);      // true
 * mygame.Key.is(mygame.Entity);   // true
 * mygame.Entity.is(capri.Object); // true
 * mygame.Entity.is(mygame.Key);   // false
 * ```
 *
 * @param {string|object} Name of class or class reference
 *
 * @returns {boolean} `true` when relationship exists between classes
 */
capri.Object.is = function(klass) {
	klass = capri.ns(klass, false);

	if (this.__implements && this.__implements.indexOf(klass) !== -1)
		return true;

	var t = this;
	while (t) {
		if (t === klass)
			return true;
		t = t.prototype.__super;
	}
	return false;
}

/**
 * Indicates if class is abstract
 *
 * An abstract class can not be instantiated.
 *
 * @returns {boolean} `true` when abstract, otherwise `false`
 */
capri.Object.isAbstract = function() {
	return this.__abstract === true;
}

/**
 * Get list of interfaces
 *
 * @returns {capri.Interface[]}
 */
capri.Object.getInterfaces = function() {
	var r = [], impl = this.__implements || [];

	// Exclude abstract interfaces from results
	for (var i = 0; i < impl.length; ++i)
		if (!/\$abstract\$$/.test( impl[ i ].__name ))
			r.push(impl[ i ]);

	return r;
}

/**
 * Add instance and/or static members to class
 *
 * Members will become available to subclasses (unless overridden).
 *
 * @example "Add new functions to existing class"
 *
 * ```source
 * capri.define('class Test', {
 *    foo: function() {
 *       return 'hey';
 *    }
 * })
 *
 * var obj = new Test();
 * obj.baz; // undefined
 *
 * Test.add({
 *    bar: function() {
 *       return this.baz;
 *    },
 *
 *    baz: 42,
 *
 * "static": {
 *    magic: function() {
 *       return 'Hello World!';
 *    }
 * }
 *
 * });
 *
 * obj.baz; // 42
 *
 * Test.magic(); // Hello World!
 * ```
 *
 * @param {object} body Instance and/or static members
 */
capri.Object.add = function(body) {
	var klass = this, subclasses = this.__sub || {};

	// Copy static members from class body?
	if (typeof body['static'] === 'object')
		for (var key in body['static']) {
			// Wrap static method to ensure that `this` keyword is bound to correct class
			this[ key ] = body['static'][ key ];

			// Copy static members to all subclasses
			for (var subclassName in subclasses)
				for (var i = 0; i < statik.length; ++i)
					if (subclasses[ subclassName ][ skey ] === undefined)
						subclasses[ subclassName ][ skey ] = this[ skey ];
		}

	// Copy members from class body
	for (var key in body)
		if (!/^(__|(abstract|extends|implements)$)/.test(key)) {
			// Define property with getter / setter?
			var desc = Object.getOwnPropertyDescriptor(body, key);
			if (desc !== undefined)
				Object.defineProperty(this.prototype, key, desc);
			else // Straightforward field or method
				this.prototype[ key ] = body[ key ];
		}
}



/* Classes:
----------------------------------------------------------------------------------------*/

function surrogate() {}

function gatherImplements(klass, body) {
	var impl = klass.prototype.__super.__implements;

	if (body['implements']) {
		var defined;

		// Add `implements` definitions to class type
		switch (capri.typeOf(body['implements'])) {
			case 'object':
				defined = [ body['implements'] ];
				break;
			case 'array':
				defined = body['implements'];
				break;
		}

		if (defined) {
			if (!impl)
				impl = [];

			for (var i = 0; i < defined.length; ++i) {
				var ii = defined[ i ];
				if (!ii)
					throw new capri.Error('Interface "' + defined[ i ] + '" was not defined', 'missing_interface');

				if (impl.indexOf(ii) === -1)
					impl.push(ii);

				// Inherit interfaces from extends of interface
				if (ii.__extends)
					for (var j = 0; j < ii.__extends.length; ++j) {
						var jj = ii.__extends[ j ];
						if (impl.indexOf(jj) === -1)
							impl.push(jj);
					}
			}
		}
	}

	if (impl && impl.length > 0)
		klass.__implements = impl;
}

function validateClass(klass) {
	// Validate interface definitions
	// Note: Abstract classes do not have to be complete!
	if (!klass.__abstract && klass.__implements) {
		var impl = klass.__implements;
		for (var i = 0; i < impl.length; ++i)
			impl[ i ].validate(klass);
	}
}

capri.getPropertyDescriptor = function(obj, name) {
	while (true) {
		var desc = Object.getOwnPropertyDescriptor(obj, name);
		if (desc !== undefined)
			return desc;

		if (!obj.__super)
			break;
		obj = obj.__super.prototype;
	}
}

capri.define.register('class', function(ns, name, body) {
	var className	= capri.ns.id(name)
	  , isAbstract	= typeof body['abstract'] === 'object' || body['abstract'] === true
	  ;

	ns = capri.ns(ns, capri.ns.baseName(name));

	// Extend an existing class?
	var base = body['extends'];
	if (typeof base === 'string')
		base = capri.ns( base );

	// Always begin class heirarchy with a `capri.Object`
	base = base || capri.Object;
	if (typeof base !== 'function')
		throw new capri.Error('Cannot extend class from non-class "' + typeof base + '"', 'invalid_base_class');

	if (base.__sub === undefined)
		base.__sub = {};
	base.__sub[ name ] = klass;

	// Inherit constructor of super class?
	var klass = isAbstract
		? function() {
			throw new capri.Error('Cannot instantiate abstract class "' + this.constructor.__qid + '"', 'instantiate_abstract')
		}
		: (
			body.__construct
				? body.__construct
				: function() {
					if (this.__construct)
						this.__construct.apply(this, arguments);
				}
		)
		;

	ns[ className ] = klass;

	// Use prototype inheritance
	surrogate.prototype = base.prototype;
	klass.prototype = new surrogate;
	klass.prototype.constructor = klass;

	// Initialise class fields
	klass.__name		= className;
	klass.__qid			= capri.module.currentName
		? 'module:' + capri.module.currentName + '#' + name
		: name
		;
	klass.__abstract	= isAbstract;

	// Automatically generate abstract interface
	if (typeof body['abstract'] === 'object') {
		if (!body['implements'])
			body['implements'] = [];
		else if (!capri.typeOf(body['implements']) !== 'array')
			body['implements'] = [ body['implements'] ];

		body['implements'].push(
			new capri.Interface(name + '$abstract$', body['abstract'])
		);
	}

	// Constructor should be available via `__construct` so that subclasses can use it
	if (typeof body.__construct === 'function')
		klass.prototype.__construct = body.__construct;
	// Add reference to base class
	klass.prototype.__super = base;

	// Add implements definitions to class type
	gatherImplements(klass, body);

	// Copy static members from super class
	for (var key in base)
		if (typeof base[ key ] === 'function')
			klass[ key ] = base[ key ];

	// Copy members from class body
	klass.add(body);

	// Execute static constructor?
	if (body['static'] && typeof body['static'].__init === 'function')
		body['static'].__init.call(klass);

	validateClass(klass);

	return klass;
})



/* Interfaces:
----------------------------------------------------------------------------------------*/

/**
 * Class that represents an interface
 *
 * @param {string} name Name of interface optionally including a namespace
 * @param {object} body Body of interface
 */
function Interface(moduleName, name, body) {
	this.__qid	= moduleName
		? 'module:' + moduleName + '#' + name
		: name
		;
	this.__name	= capri.ns.id(name);
	this.__body	= body;

	if (body['extends']) {
		this.__extends = typeof body['extends'] === 'object'
			? [ body['extends'] ]
			: body['extends']
			;
		delete body['extends']
	}
}

/**
 * Get name of interface
 *
 * @returns {string}
 */
Interface.prototype.getName = function() {
	return this.__name;
}
/**
 * Get full name of interface
 *
 * @returns {string}
 */
Interface.prototype.getFullName = function() {
	return this.__qid;
}

/**
 * Get namespace of interface
 *
 * @returns {string} Namespace of interface
 */
Interface.prototype.getNamespace = function() {
	return capri.ns.baseName(this.__qid);
}

/**
 * Get name of associated module
 *
 * @returns {string} Name of associated module
 */
Interface.prototype.getModuleName = function() {
	return capri.ns.moduleName(this.__qid);
}

/**
 * Get list of interfaces
 *
 * @returns {capri.Interface[]}
 */
Interface.prototype.getInterfaces = function() {
	return this.__extends || [];
}

/**
 * Validate class against interface
 *
 * @param {class} class
 *
 * @throws {capri.Error} Thrown when class does not match interface.
 */
Interface.prototype.validate = function(klass) {
	// Abstract classes do not need to have complete interface
	if (klass.isAbstract())
		return;

	var scope, scopeLabel, of, inter = this;

	function error(found, key, expected) {
		var iname = inter.__qid;
		var from = (/\$abstract\$$/.test(iname))
			? ' in class "' + klass.__qid + '" from abstract class "' + iname.substr(0, iname.length - 10) + '"'
			: ' in class "' + klass.__qid + '" from interface "' + iname + '"'
			;
		if (found === 'undefined')
			throw new capri.Error('Missing required ' + scopeLabel + expected + ' "' + key + '"' + from, 'missing_interface');
		else
			throw new capri.Error('Found ' + scopeLabel + ' ' + found + ' "' + key + '" but expected ' + expected + from, 'invalid_interface');
	}

	// Process instance and static members
	for (var i = 0; i < 2; ++i) {
		if (i === 0) {
			scope = this.__body;
			scopeLabel = '';
			of = klass.prototype;
		}
		else {
			scope = this.__body['static'];
			if (!scope)
				continue;
			scopeLabel = 'static ';
			of = klass;
		}

		for (var key in scope) {
			// Skip special key!
			if (key === 'static')
				continue;

			var expects = scope[ key ];
			if (expects === 'function') {
				if (typeof of[ key ] !== 'function')
					error(typeof of[ key ], key, 'function');
			}
			else if (/(^|\s)(get|set)(\s|$)/.test(expects)) {
				var desc = capri.getPropertyDescriptor(of, key);
				if (desc === undefined)
					error('undefined', key, 'property (' + expects + ')');

				if (!desc.get && /(^|\s)(get)(\s|$)/.test(expects))
					error('undefined', key, 'property getter');
				if (!desc.set && /(^|\s)(set)(\s|$)/.test(expects))
					error('undefined', key, 'property setter');
			}
			else if (typeof of[ key ] === 'undefined') {
				error(type, key, expects);
			}
		}
	}
}

capri.define.register('interface', function(ns, name, body) {
	ns = capri.ns(ns, capri.ns.baseName(name));

	var inter = new Interface(capri.module.currentName, name, body);
	ns[ inter.__name ] = inter;

	return inter;
})

})()