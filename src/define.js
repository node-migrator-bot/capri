/**
 * Definitions
 *
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

/**
 * Define class or interface
 *
 * @example "Define global class"
 *
 * ```source
 * capri.define('class Pair', {
 *    __construct: function(x, y) {
 *       this.x = x;
 *       this.y = y;
 *    }
 * })
 * ```
 *
 * @example "Extend a global class"
 *
 * ```note
 * The key `extends` has been enclosed within quotes for compatibility with older web
 * browsers. This is not necessary when developing for modern JavaScript environments that
 * support use of reserved keywords as keys in object literals.
 * ```
 *
 * ```source
 * capri.define('class Vector', {
 *    "extends": Pair,
 *
 *    distanceTo: function(other) {
 *       return Math.sqrt(
 *          Math.pow(other.x - this.x, 2) +
 *          Math.pow(other.y - this.y, 2)
 *       )
 *    }
 * })
 * ```
 *
 * @example "Use of interface"
 *
 * ```source
 * capri.define('interface IWatchable', {
 *    watch: 'function'
 * })
 *
 * capri.define('class Television', {
 *    "implements": IWatchable,
 *
 *    watch: function() {
 *       // do something neat
 *    }
 * })
 * ```
 *
 * An object can be tested for the `IWatchable` interface:
 *
 * ```source
 * if (capri.is(obj, IWatchable)) {
 *    obj.watch();
 * }
 * ```
 *
 * @param {string|object} [ns] Namespace of which to place definition
 * @param {string} define Definition kind and name
 * @param {object} body Body of definition
 *
 * @returns {mixed} Definition
 *
 * @throws {capri.Error} Expected definition string or missing body (invalid_arg)
 */
capri.define = function() {
	var ns, def, body, module = capri.module.current;

	// [ns], def, body
	if (typeof arguments[1] === 'string' && typeof arguments[2] === 'object') {
		ns		= arguments[0]
			? capri.ns( arguments[0] )
			: ( module ? module.exports : capri.ns('') )
			;
		def		= arguments[1];
		body	= arguments[2];
	}
	// def, body
	else if (typeof arguments[0] === 'string' && typeof arguments[1] === 'object') {
		ns		= module ? module.exports : capri.ns('');
		def		= arguments[0];
		body	= arguments[1];
	}
	// error
	else {
		throw new capri.Error(
			typeof arguments[0] !== 'string'
				? 'Expected definition string'
				: 'Missing body of definition'
			,
			'invalid_arg'
		)
	}

	// Parse definition string
	def = def.split(/\s+/);

	if (capri.define._handler[ def[0] ] === undefined)
		throw new capri.Error('Unknown definition type "' + def[0] + '"', 'invalid_def');

	return capri.define._handler[ def[0] ](ns, def[1], body);
}

/**
 * Register custom define handler
 *
 * @param {string} kind Kind of definition
 * @param {function} handler Handler of definition kind
 */
capri.define.register = function(kind, handler) {
	if (!capri.define._handler)
		capri.define._handler = {};

	capri.define._handler[ kind ] = handler;
}