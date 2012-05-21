/**
 * Core library functionality
 *
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

/**
 * Capri project namespace
 * @namespace capri
 */
if (!global.capri)
	global.capri = {};

/**
 * Circular reference to global namespace
 */
capri.global = global;

/**
 * Determine type of object
 *
 * Behaves like the `typeof` operator except returns true value for array, regex, string
 * and date objects.
 *
 * @example "Example with array"
 *
 * ```source
 * var a = [];
 *
 * // Determine whether 'a' is an array
 * capri.typeOf(a) === 'array'; // true
 *
 * // Standard keyword indicates that 'a' is an object!
 * typeof a === 'object'; // true
 * ```
 *
 * @example "Example with Capri style class"
 *
 * ```source
 * capri.define('class my.Test', {});
 * var a = new my.Test();
 *
 * // Determine whether 'a' is an instance of 'my.Test'
 * capri.typeOf(a) === 'my.Test'; // true
 * ```
 *
 * @param {mixed} obj Object to determine type of
 *
 * @returns {string} Type of object
 */
capri.typeOf = function(obj) {
	if (obj === null)
		return 'null';

	var ty = typeof obj;
	if (ty === 'object' || ty === 'function') {
		if (obj.constructor === Array.prototype.constructor)
			return 'array';
		if (obj.constructor === RegExp.prototype.constructor)
			return 'regex';
		if (obj.constructor === String.prototype.constructor)
			return 'string';
		if (obj.constructor === Date.prototype.constructor)
			return 'date';
		if (obj.getClassName === capri.Object.prototype.getClassName)
			return obj.getFullClassName();
	}

	return ty;
}

/**
 * Add members to target object
 *
 * @example "Extend target with new members"
 *
 * ```source
 * target = { "name": "bob" };
 * capri.extend(target, { "age": 24 });
 * target.age === 24; // true
 * ```
 *
 * @example "Extend target but don't overwrite!"
 *
 * ```source
 * target = { "name": "bob" };
 * capri.extend(target, { "age": 24, "name": "george" }, false);
 * target.name === "bob"; // true
 * target.age === 24; // true
 * ```
 *
 * @example "Extend target with multiple member sets"
 *
 * ```source
 * target = { "name": "bob" };
 * sets   = [
 *    { "age": 24 },
 *    { "hair": "brown", "eyes": "blue" }
 * ];
 * capri.extend(target, sets);
 * target.hair === "brown"; //true
 * ```
 *
 * @param {object|null} target Target object
 * @param {object} members Members object(s)
 * @param {boolean} [overwrite] Defaults to `true`.
 *
 *  - `true` - overwrite existing keys
 *  - `false` - preserve existing keys
 *
 * @param {function} [filter] Extend target with members that match filter
 *
 * @returns {object} Target object
 */
capri.extend = function(target, members, overwrite, filter) {
	target = target || {};
	if (!members || members === target)
		return target;

	if (overwrite === undefined)
		overwrite = true;

	if (capri.typeOf(members) !== 'array')
		members = [ members ];

	for (var i = 0; i < members.length; ++i) {
		var o = members[i];

		// Note: Could be `null` if no extension was specified
		if (!o)
			continue;

		for (var key in o) {
			// Meta data should not be copied!
			if (key === '__cp_meta')
				continue;

			// Apply filtering to member
			if (filter && !filter(o[ key ]))
				continue;

			// Do not:
			//  - add undefined options
			//  - overwrite when denied
			if (o[ key ] !== undefined && (overwrite || target[ key ] === undefined))
				target[ key ] = o[ key ];
		}
	}

	// Return the modified object
	return target;
}

capri._lastUID = 0;

/**
 * Retrieve next unique ID
 *
 * Provides a unique identifier that can be used to associate dynamically generated
 * content with one another.
 *
 * @example "Bind dynamic label to input"
 *
 * ```source
 * $('<input type="text"></input>')
 *    .attr('id', 'dynfield' + capri.nextUID())
 *    .appendTo(container);
 * $('<label>Name:</label>')
 *    .attr('for', 'dynfield' + capri.lastUID())
 *    .appendTo(container);
 * ```
 *
 * @returns {number}
 */
capri.nextUID = function() {
	return ++this._lastUID;
}

/**
 * Retrieve previous unique ID
 * @returns {number}
 *
 * @see {@link capri.nextUID}
 */
capri.lastUID = function() {
	return this._lastUID;
}

/**
 * Convert function arguments into array
 *
 * @example
 *
 * ```source
 * function addToList(name) {
 *    var productIds = capri.arguments(arguments, 1);
 *    for (var i = 0; i &lt; productIds.length; ++i)
 *       lists[name].add(productIds[i]);
 * }
 *
 * // Add products 24, 25 and 26 to wish list
 * addToList('wish', 24, 25, 26);
 * ```
 *
 * @param {object} args Function arguments
 * @param {number} [start] Retrieve arguments from offset
 * @param {number} [count] Number of arguments to retrieve
 *
 * @returns {array}
 */
capri.arguments = function(args, start, count) {
	return count !== undefined
		? Array.prototype.slice.call(args, start || 0, start + count)
		: Array.prototype.slice.call(args, start || 0)
		;
}

/**
 * Parse arguments
 *
 * Arguments can be specified in a variety of different forms that are then normalised
 * into an object or associative array. Missing values can be replaced with defaults when
 * necessary.
 *
 * @example "Parse arguments with defaults"
 *
 * ```source
 * args = capri.parseArgs(args, {
 *    "visible" : "yes",
 *    "color"  : "red"
 * });
 * ```
 *
 * @example "Parse arguments with defaults string"
 *
 * ```source
 * args = capri.parseArgs(args, 'visible=yes; color=red');
 * ```
 *
 * @example "Parse arguments with no defaults"
 *
 * ```source
 * args = capri.parseArgs(args);
 * ```
 *
 * @param {string|object} args Arguments that are to be parsed
 * @param {string|object} [defaults] Defaults to assume when arguments not present
 * @param {string|regex} [delimiter] Delimiter used when parsing arguments from string
 *
 * @returns *object* when `arr` is specified as object or string, *array* when `arr` is
 * specified as array.
 */
capri.parseArgs = function(args, defaults, delimiter) {
	if (!delimiter)
		delimiter = /\s*;\s*/;

	if (!args)
		args = {};
	else if (typeof args === 'string')
		args = capri.parseString(args, delimiter);

	if (typeof defaults === 'string')
		defaults = capri.parseString(defaults, delimiter);
	else if (!defaults)
		defaults = {};

	for (var key in defaults)
		if (args[ key ] === undefined || args[ key ] === null)
			args[ key ] = defaults[ key ];

	return args;
}

/**
 * Parse string of parameters into object
 *
 * Can be used to parse query string arguments or custom delimited parameters.
 *
 * @example "Parse string with default delimiter"
 *
 * ```source
 * obj = capri.parseString('account=12345&product=24');
 * console.log(obj.account); // 12345
 * console.log(obj.product); // 24
 * ```
 *
 * @example "Parse string with custom delimiter"
 *
 * ```source
 * obj = capri.parseString('account=12345;product=24', ';');
 * console.log(obj.account); // 12345
 * console.log(obj.product); // 24
 * ```
 *
 * @param {string} params Delimited string of parameters
 * @param {string|regex} [delimiter] Specify custom delimiter. Uses '&' by default.
 *
 * @returns {object}
 *
 * @throws {capri.Error} Thrown when parameter is invalid
 */
capri.parseString = function(params, delimiter) {
	if (!params)
		return {};

	if (typeof params !== 'string')
		throw new capri.Error('Expected string for params', 'invalid_param');

	if (!delimiter)
		delimiter = '&';
	else if (!/^(string|regex)$/.test(capri.typeOf(delimiter)))
		throw new capri.Error('Expected string or regex for delimiter', 'invalid_param');
	var pairs = params.split(delimiter);

	params = {};
	for (var i = 0; i < pairs.length; ++i) {
		var arg = pairs[i].split('=');
		params[arg[0]] = ( arg[1] !== undefined ? arg[1] : null );
	}

	return params;
}

/**
 * Build parameter string from object members
 *
 * Provides opposite functionality of {@link capri.parseString}.
 *
 * @example "Build parameter string with prefix"
 *
 * ```source
 * obj = {
 *    "account": 12345,
 *    "product": 24
 * };
 * qs = capri.buildParamString(obj, '?'); // ?account=12345&product=24
 * ```
 *
 * @example "Do not encode "title" - it is already encoded!"
 *
 * ```source
 * book = {
 *    "title" : "War%20of%20the%20Worlds",
 *    "author": "H.G. Wells and Brian Aldiss",
 *    "isbn"  : "0141441038"
 * };
 * qs = capri.buildParamString(book, '?', [ 'title' ]);
 * // ?title=War%20of%20the%20Worlds&author=H.G.%20Wells%20and%20Brian%20Aldiss&isbn=0141441038
 * ```
 *
 * @param {object} obj Input object
 * @param {string} [prefix] Added to start of query string
 * @param {string} [delimiter] Delimiter used to separate parameters. Defaults to '&'.
 * @param {boolean|string[]} [encode] Defaults to `false`.
 *
 *  - When boolean, `true` indicates that key/value pairs should be encoded for use in URI.
 *  - When array, specified keys are *not* encoded.
 *
 * @returns {string}
 */
capri.buildParamString = function(obj, prefix, delimiter, encode) {
	if (!delimiter)
		delimiter = '&';
	if (encode === undefined || encode === null)
		encode = false;

	var q = '';
	for (var key in obj)
		if (typeof obj[key] !== 'function') {
			if (q !== '')
				q += delimiter;
			if (encode === true || (capri.typeOf(encode) === 'array' && encode.indexOf(key) === -1))
				q += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
			else
				q += key + '=' + obj[key];
		}
	return !!prefix
		? prefix + q
		: q;
}

/**
 * Fill array with value
 *
 * ```note
 * Input array is erased and then populated.
 * ```
 *
 * @example "Fill existing array with 1's"
 *
 * ```source
 * var arr = [ 1, 2, 3 ];
 * capri.fillArray(arr, 20, 1);
 * // arr === [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ]
 * ```
 *
 * @example "Fill new array with 5 class instances"
 *
 * ```source
 * capri.define('class MyClass', {
 *    x: 0,
 *    y: 0
 * });
 *
 * var arr = capri.fillArray([], 5, 'Point', true);
 * // arr === [ { x:0,y:0 },{ x:0,y:0 },{ x:0,y:0 },{ x:0,y:0 },{ x:0,y:0 } ]
 * ```
 *
 * @param {array} arr Array that is to be filled
 * @param {number} length Length of array to fill
 * @param {mixed} [item] Item that is to be repeated (defaults to 0 when not specified)
 * @param {boolean} [instantiate] Item parameter *must* represent a class (by name or
 *    reference). Class is instantiated for each position within array.
 *
 * @returns {array} Same array that was specified
 *
 * @throws {capri.Error} Thrown when invalid parameter is specified.
 */
capri.fillArray = function(arr, length, item, instantiate) {
	if (capri.typeOf(arr) !== 'array')
		throw new capri.Error('Expected array for first parameter.', 'invalid_param');
	if (length === undefined)
		throw new capri.Error('Length is a required parameter', 'invalid_param');

	if (item === undefined)
		item = 0;

	if (instantiate)
		item = capri.typeOf(item) === 'string' ? capri.ns(item) : item;

	arr.splice(0, arr.length);
	while (length-- > 0)
		arr.push(instantiate ? new item() : item);
	return arr;
}

/**
 * Trim and filter array of strings
 *
 * Leading and trailing space is removed from each string in array. Empty strings are not
 * included in returned array.
 *
 * ```note
 * Input array is not modified.
 * ```
 *
 * @param {string[]} arr Array of strings
 *
 * @returns {string[]} Trimmed array of strings
 *
 * @throws {capri.Error} Thrown when parameter is invalid
 */
capri.arrayTrimAndFilter = function(arr) {
	if (capri.typeOf(arr) !== 'array')
		throw new capri.Error('Expected array', 'invalid_param');

	var result = [];
	for (var i = 0; i < arr.length; ++i) {
		var item = new String(arr[i]).trim();
		if (item !== '')
			result.push(item);
	}
	return result;
}

/**
 * Append query string to URI
 *
 * @example
 *
 * ```source
 * uri = capri.appendQueryString('http://example.com', 'a=b');
 * // http://example.com?a=b
 * uri = capri.appendQueryString('http://example.com?a=b', { "c": "d" });
 * // http://example.com?a=b&c=d
 * ```
 *
 * @param {string} uri URI
 * @param {string|object} query Query arguments
 *
 * @returns {string} URI with additional query string
 *
 * @throws {capri.Error} Thrown when parameter is invalid
 */
capri.appendQueryString = function(uri, query) {
	if (typeof uri !== 'string')
		throw new capri.Error("Expected string for 'uri'", 'invalid_param');

	if (!!query) {
		if (typeof query !== 'string')
			query = capri.buildParamString(query);
		if (query)
			uri += (uri.indexOf('?') === -1 ? '?' : '&') + query;
	}
	return uri;
}

/**
 * Remove query string and fragment from URI
 *
 * @example "Remove query string"
 *
 * ```source
 * uri = capri.removeQueryString('http://example.com?a=b');
 * // http://example.com
 * ```
 *
 * @example "Remove fragment"
 *
 * ```source
 * uri = capri.removeQueryString('http://example.com#intro');
 * // http://example.com
 * ```
 *
 * @param {string} uri URI
 *
 * @returns {string} URI without query string
 *
 * @throws {capri.Error} Thrown when parameter is invalid
 */
capri.removeQueryString = function(uri) {
	if (typeof uri !== 'string')
		throw new capri.Error("Expected string for 'uri'", 'invalid_param');
	var m = uri.match(/^[^?#]+/);
	return !!m && m.length > 0 ? m[0].toString() : '';
}

/**
 * Get trailing extension from URI
 *
 * ```note
 * Period (full stop) character is part of returned extension.
 * ```
 *
 * @example
 *
 * ```source
 * ext = capri.extensionFromUri('http://example.com/something.html#abc');
 * // .html
 * ```
 *
 * @param {string} uri URI
 *
 * @returns {string|null} Trailing extension or `null` for none
 *
 * @throws {capri.Error} Thrown when parameter is invalid
 */
capri.extensionFromUri = function(uri) {
	if (typeof uri !== 'string')
		throw new capri.Error("Expected string for 'uri'", 'invalid_param');

	var m = /^(http|ftp)s?/.test(uri)
		? uri.match(/\/\/[^\/]*[^\/]\/.*(\.[^.?#\/]+)(\?|#|$)/)
		: uri.match(/.*(\.[^.?#\/]+)(\?|#|$)/)
		;

	return !!m && m.length > 1 ? m[1].toString() : null;
}

/**
 * Transform name into camel case varient
 *
 * Camel case is a naming convention where each word begins with an upper case character
 * so that they are easily recognised. The first word begins with a lower case character.
 * For example, `createNewOrder`.
 *
 * All illegal characters are removed (unlike jQuery implementation)
 *
 * @example
 *
 * ```source
 * member = capri.camelCase('do something'); // doSomething
 * member = capri.camelCase('special-data'); // specialData
 * member = capri.camelCase('  the_question of 42  '); // the_questionOf42
 * ```
 *
 * @param {string} name
 *
 * @returns {string|null} Camel case variant of name. Returns `null` when name could not
 *    be transformed into camel case varient.
 */
capri.camelCase = function(name) {
	if (!name)
		return null;

	// Remove illegal characters from name
	name = new String(name)
		.toLowerCase()
		.replace(/[^a-z0-9_]+/g, '-')
		.replace(/^[\d\s\-]+|[\s\-]+$/g, '');

	// Split name into parts and recompose
	var parts = name.split('-');
	name = parts[0];
	for (var i = 1; i < parts.length; ++i)
		name += parts[i][0].toUpperCase() + parts[i].substr(1);

	return !!name ? name : null;
}

/**
 * Transform name into hyphen case varient
 *
 * Hyphen case names are designed to be URI safe and human readable. Only lower case
 * characters are used and each word is separated with a hyphen. For example, `create-new-order`.
 *
 * @example
 *
 * ```source
 * slug = capri.hyphenCase('do something'); // do-something
 * slug = capri.hyphenCase('special-data'); // special-data
 * slug = capri.hyphenCase('  the_question of 42  '); // the-question-of-42
 * ```
 *
 * @param {string} name
 *
 * @returns {string|null} Hyphen case varient of name. Return `null` when name could not
 *    be transformed into slug varient.
 */
capri.hyphenCase = function(name) {
	if (!name)
		return null;

	name = name.toLowerCase()
		.replace(/^[\s\-]+|[\s\-]+$/g, '')
		.replace(/[-| |_|\/]+/g, '"-"')
		.replace(/(^[\-]+)|([^a-z0-9\-]+)/g, '')
		.replace(/(^[\-]+)|([^a-z0-9\-]+)/g, '');

	return !!name ? name : null;
}