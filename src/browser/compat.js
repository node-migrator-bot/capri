/**
 * Fallback functionality that is missing from some web browsers
 *
 * ```warning
 * Fallback functionality aims to fill a gap but may not be consistent with native
 * implementations. Feel free to report any such inconsistencies.
 * ```
 *
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

// ref: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf)
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this === void 0 || this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0)
            return -1;

        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n) // shortcut for verifying if it's NaN
                n = 0;
            else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
        if (n >= len)
            return -1;

        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++)
            if (k in t && t[k] === searchElement)
                return k;
        return -1;
    };

if (!String.prototype.trim)
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};

if (!Object.keys)
	Object.keys = function(obj) {
		var keys = [];
		for (var key in obj)
			keys.push(key);
		return keys;
	};

if (!Object.defineProperty)
	Object.defineProperty = function(obj, name, descriptor) {
		if (descriptor.get && obj.__defineGetter__)
			obj.__defineGetter__(name, descriptor.get)
		if (descriptor.set && obj.__defineSetter__)
			obj.__defineSetter__(name, descriptor.set)
		throw new capri.Error('Browser does not support getters or setters')
	}

if (!Object.getOwnPropertyDescriptor || ( navigator && navigator.userAgent.indexOf('MSIE 8.') !== -1 ))
	Object.getOwnPropertyDescriptor = function(obj, name) {
		if (obj.__lookupGetter__) {
			var g = obj.__lookupGetter__(name)
			  , s = obj.__lookupSetter__(name)
			  ;
			return !g && !s
				? undefined
				: { get: g, set: s }
				;
		}

		// Browser does not support getters or setters
		// Let's hope that they are not needed!
		return undefined;
	}

/**
 * Global namespace
 */
if (window && !window.global)
	window.global = window;

if (!global.console)
	global.console = {
		log		: function() {},
		error	: function() {},
		warn	: function() {}
	}