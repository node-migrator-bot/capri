/**
 * Modules
 *
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */
(function() {

/**
 * Current module source
 * @local {function}
 */
var currentSource = [];
/**
 * Main module
 * @local {local:Module}
 */
var main;

/**
 * Extract list of required modules from source
 *
 * @local
 *
 * @param {string|function} source Module source
 *
 * @returns {string[]}
 */
function extractRequires(source) {
	source = source.toString();

	var requireAlias = source.match(/function\s*\(\s*([^),]+)/)[1];
	var requireRegex = (requireAlias === 'require')
		? /\brequire\b\s*\(\s*("([^"]|\\.)*"|'([^']|\\.)*')\s*\)/g
		: new RegExp("\b" + requireAlias + "\b\s*\(\s*(\"([^\"]|\\.)*\"|'([^']|\\.)*')\s*\)", 'g')
		;

	// Encode require statements
	source = source.replace(requireRegex, function() {
		var name = arguments[1].substr(1, arguments[1].length - 2);
		return 'REQ#' + name.replace(/\//g, '\\') + '#';
	});

	// Remove all string literals and comments from source
	source = source.replace(/"([^"]|\\.)*"|'([^']|\\.)*'|\/\*(.|\s)*?\*\/|\/\/[^\n\r]+/g, '');

	var requires	= [];
	var pattern		= /REQ#([^#]*)#/g;
	var match;

	while (true) {
		match = pattern.exec(source);
		if (match === null)
			break;

		requires.push(match[1].replace(/\\/g, '/'));
	}

	return requires;
}

/**
 * Generalised require function (Asynchronous)
 *
 * Provides require functionality on per module basis. Functionality is
 * encapsulated within closure that binds module to function.
 *
 * @local
 *
 * @param {Module} module Base module
 * @param {string} name Name of required module
 * @param {function} callback Invoked when required module has loaded
 *
 ****
 * Generalised require function (Synchronous)
 *
 * Provides require functionality on per module basis. Functionality is
 * encapsulated within closure that binds module to function.
 *
 * @local
 *
 * @param {Module} module Base module
 * @param {string} name Name of required module
 * @param {function} [callback] Invoked when required module has loaded
 *
 * @returns {Module} Module that was required
 */
function genericRequire(module, name, callback) {
	name = module.resolve(name);

	var requiredModule = capri.module.cache[ name ];
	if (requiredModule) {
		if (requiredModule.loaded) {
			// Module has already been loaded, fire callback immediately!
			if (typeof callback === 'function')
				callback(requiredModule.exports)

			return requiredModule.exports;
		}
		else {
			// Module has not loaded, append callback to queue
			if (typeof callback === 'function')
				requiredModule.callbacks.push(callback);
		}
	}
	else {
		// Module not requested before
		requiredModule = new Module(name);
		capri.module.cache[ name ] = requiredModule;

		// Include script
		var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;

		var script = document.createElement('script');
		script.async = 'async';
		script.src	 = name;

		script.onload = script.onreadystatechange = function(event) {
			if (!script.readyState || /loaded|complete/.test( script.readyState )) {
				// Avoid memory leak in IE
				script.onload = script.onreadystatechange = null;

				// Remove script now that it has executed
				if (head && script.parentNode)
					head.removeChild(script);

				script = undefined;

				// Append callback to queue
				if (typeof callback === 'function')
					requiredModule.callbacks.push(callback);

				requiredModule.load(currentSource.shift());
			}
		}

		// Insert before to avoid IE6 bug
		head.insertBefore(script, head.firstChild);
	}
}

/**
 * Internal representation of a module
 *
 * @class
 *
 * @local
 */
function Module(name) {
	/**
	 * Name of module
	 * @field {string}
	 */
	this.name		= name;
	/**
	 * Exports
	 * @field {mixed}
	 */
	this.exports	= {};
	/**
	 * List of callbacks that will be invoked before module is loaded
	 *
	 * New callbacks should be pushed on to end of list.
	 *
	 * ```note
	 * Callbacks are only invoked when module states changes to loaded. Always
	 * check {@link Module#loaded} before adding callbacks.
	 * ```
	 *
	 * @field {function[]}
	 */
	this.callbacks	= [];
	/**
	 * Indicates if module has loaded
	 * @field {boolean}
	 */
	this.loaded		= false;

	// Create require function with closure to associate with module
	var self = this;
	/**
	 * Ensure required module is loaded and invoke callback
	 *
	 * @param {string} name Name or URI of module
	 * @param {function} callback Invoked when required module is loaded
	 *
	 ****
	 * Load and retrieve module
	 *
	 * @param {string} name Name or URI of module
	 * @param {function} [callback] Invoked when required module is loaded
	 *
	 * @returns {mixed} Module exports
	 */
	this.require = function(name, callback) {
		return genericRequire(self, name, callback);
	}
}

/**
 * Resolve module name
 *
 * @param {string} name Module name
 *
 * @returns {string} Resolved module name
 */
Module.prototype.resolve = function(name) {
	name = name.replace(/\\/g, '/');

	// ./Cool
	if (/^\.[\/]/.test(name)) {
		var baseName = this.name.replace(/[^\/]+$/, '');
		name = baseName + name.substr(2);
	}
	// ../../Cool
	else if (/^\.\.[\/]/.test(name)){
		var baseName = this.name.replace(/[^\/]+$/, '');

		var up = name.match(/(\.\.\/)+/)[0].length / 3;
		for (var i = 0; i < up; ++i)
			baseName = baseName.replace(/[^\/]+\/$/, '');

		name = baseName + name.substr(up * 3);
	}

	// Add extension if there isn't already one
	// Note: Do not add extension if dynamic URI is used!
	if (!(/\.[A-Za-z0-9\-_]+$/.test(name)) && !(/[#?&]/.test(name)))
		name += '.js';

	return name;
}

/**
 * Finish loading module
 */
Module.prototype._finishLoading = function() {
	var priorModule = capri.module.current;
	capri.module.current = this;

	// Execute module source
	var exports = this._source.call(this, this.require, capri.define, this.exports);
	this.exports = ( exports || this.exports );

	this.loaded = true;

	// Invoke any associated callbacks
	while (this.callbacks.length) {
		var callback = this.callbacks.shift();
		callback(this.exports);
	}
	// Callback references are no longer needed
	delete this.callbacks;

	// Cleanup
	delete this._source;

	capri.module.current = priorModule;
}

/**
 * Load module and required dependencies
 *
 * @param {function} source Module source
 *
 * @throws {capri.Error} Thrown when module has already loaded.
 */
Module.prototype.load = function(source) {
	if (this.loaded === true)
		throw new capri.Error('Module "' + this.name + '" already loaded', 'module_already_loaded');

	var self		= this;
	var requires	= extractRequires(this._source = source);

	if (requires.length > 0) {
		var requireIndex = 0;

		for (var i = 0; i < requires.length; ++i)
			this.require(requires[ i ], function() {
				// Have all required modules been loaded?
				if (++requireIndex >= requires.length)
					self._finishLoading();
			})
	}
	else {
		self._finishLoading();
	}
}

/**
 * Define module
 *
 * ```note
 * Only one module can be defined per script file.
 * ```
 *
 * @example "Define module"
 *
 * ```source
 * capri.module(function(require, define, exports) {
 *
 * exports.foo = function() {
 *    return 'bar';
 * }
 *
 * })
 * ```
 *
 * @example "Define class module"
 *
 * ```note
 * Replaces module `exports` with class definition.
 * ```
 *
 * ```source
 * capri.module(function(require, define, exports) {
 *
 * var Vehicle = require('./Vehicle')
 *   ;
 *
 * return define('class Car', {
 *    "extends": Vehicle,
 *
 *    drive: function() {
 *       this.state = 'driving'
 *    }
 * })
 *
 * })
 * ```
 *
 * @param {function} load Module loader callback
 *
 ****
 * Explicitly define module
 *
 * ```note
 * Multiple explicitly named modules can be placed within the same script file.
 * ```
 *
 * @example "Multiple module definitions"
 *
 * ```source
 * capri.module('my/math/Vector', function(require, define, exports) {
 *    // ...
 * })
 *
 * capri.module('my/math/Matrix', function(require, define, exports) {
 *    // ...
 * })
 * ```
 *
 * @param {string} name Name of module
 * @param {function} load Module loader callback
 */
capri.module = function() {
	if (typeof arguments[0] === 'string') {
		// Explicitly defined module
		var name = main.resolve(arguments[0]);

		// Create module if it has not yet been created
		var module = capri.module.cache[ name ];
		if (!module) {
			module = new Module(name);
			capri.module.cache[ name ] = module;
		}

		module.load(arguments[1]);
	}
	else {
		// Implicitly defined module
		currentSource.push(arguments[0]);
	}
}

/**
 * Reference to main module
 *
 * @field {local:Module}
 */
capri.module.main = ( main = new Module('') );

/**
 * Cache of loaded modules
 *
 * Module will be reloaded if cache is deleted.
 *
 * @field {object}
 */
capri.module.cache = {};


/**
 * Invokes function that requires one or more modules
 *
 * @param {function} delegate Callback
 */
capri.run = function(delegate) {
	var requires = extractRequires(delegate);

	if (requires.length > 0) {
		var requireIndex = 0;

		for (var i = 0; i < requires.length; ++i)
			main.require(requires[ i ], function() {
				// Have all required modules been loaded?
				if (++requireIndex >= requires.length)
					delegate(main.require);
			})
	}
	else {
		delegate(main.require);
	}
}


})()