/**
 * Modules
 *
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

// Monkey-hack to detect current module
// BEGIN
var Module = require('module')
  ;

var origLoad			= Module.prototype.load
  , currentModule		= require.main
  ;

Module.prototype.load = function() {
	var prev = currentModule;
	currentModule = this;

    origLoad.apply(this, arguments);

	currentModule = prev;
}
// END

var topRequire;

function extractModuleName(path) {
	var moduleName;
	if (module) {
		moduleName = path;

		// Remove ".js" extension?
		if (/\.js$/.test(moduleName))
			moduleName = moduleName.substr(0, moduleName.length - 3);

		// Is node module?
		var i = moduleName.lastIndexOf('node_modules/');
		if (i !== -1) {
			moduleName = moduleName.substr(i + 13);
			var m = moduleName.match(/^([^\\\/]+)[\\\/]index$/);
			if (m !== null)
				moduleName = m[1];
		}
		else {
			// Is application module?
			var basePath = require.main.filename.replace(/[^\\\/]+$/, '');
			i = moduleName.indexOf(basePath);
			if (i !== -1)
				moduleName = '~/' + moduleName.substr(basePath.length);
		}
	}

	return moduleName;
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
 */
capri.module = function(load) {
	var module		= currentModule
	  , prior		= capri.module.current
	  , priorName	= capri.module.currentName
	  ;

	capri.module.current = module;
	capri.module.currentName = extractModuleName(module.filename);

	var exports = load.call(module, module.require, capri.define, module.exports);
	if (exports !== undefined)
		module.exports = exports;

	capri.module.current = prior;
	capri.module.currentName = priorName;
}

/**
 * Invokes function that requires one or more modules
 *
 * @param {function} delegate Callback
 */
capri.run = function(delegate) {
	delegate(topRequire);
}

/**
 * Set top-level require function
 *
 * Allows scripts to be required relative to application.
 *
 * @param {function} require Top-level require
 *
 ****
 * Get top-level require function
 *
 * @returns {function}
 */
capri.module.topRequire = function(require) {
	if (require === undefined)
		return topRequire;
	else
		topRequire = require;
}