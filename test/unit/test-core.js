/**
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

QUnit.module("capri/src/core");

test('fundamental requirements', function() {
	expect(17);
	
	strictEqual( typeof capri, 'object', 'capri is defined' );

	strictEqual( typeof capri.typeOf, 'function', 'capri.typeOf is defined' );
	strictEqual( typeof capri.extend, 'function', 'capri.extend is defined' );

	strictEqual( typeof capri._lastUID, 'number', 'capri._lastUID is defined' );
	strictEqual( typeof capri.nextUID, 'function', 'capri.nextUID is defined' );
	strictEqual( typeof capri.lastUID, 'function', 'capri.lastUID is defined' );

	strictEqual( typeof capri.arguments, 'function', 'capri.arguments is defined' );
	strictEqual( typeof capri.parseArgs, 'function', 'capri.parseArgs is defined' );
	strictEqual( typeof capri.parseString, 'function', 'capri.parseString is defined' );

	strictEqual( typeof capri.fillArray, 'function', 'capri.fillArray is defined' );
	strictEqual( typeof capri.arrayTrimAndFilter, 'function', 'capri.arrayTrimAndFitler is defined' );

	strictEqual( typeof capri.buildParamString, 'function', 'capri.buildParamString is defined' );
	strictEqual( typeof capri.appendQueryString, 'function', 'capri.appendQueryString is defined' );
	strictEqual( typeof capri.removeQueryString, 'function', 'capri.removeQueryString is defined' );
	strictEqual( typeof capri.extensionFromUri, 'function', 'capri.extensionFromUri is defined' );

	strictEqual( typeof capri.camelCase, 'function', 'capri.camelCase is defined' );
	strictEqual( typeof capri.hyphenCase, 'function', 'capri.hyphenCase is defined' );
})


test('capri.typeOf', function() {
	expect(13);

	capri.define('class testns.T', {});

	strictEqual( capri.typeOf(test), 'function', 'capri.typeOf -> function' );
	strictEqual( capri.typeOf('test'), 'string', 'capri.typeOf -> string' );
	strictEqual( capri.typeOf([ 1, 2, 3 ]), 'array', 'capri.typeOf -> array #1' );
	strictEqual( capri.typeOf(new Array()), 'array', 'capri.typeOf -> array #2' );
	strictEqual( capri.typeOf({ a:1 }), 'object', 'capri.typeOf -> object #1' );
	strictEqual( capri.typeOf(new Object()), 'object', 'capri.typeOf -> object #2' );
	strictEqual( capri.typeOf(/abc/), 'regex', 'capri.typeOf -> regex #1' );
	strictEqual( capri.typeOf(new RegExp()), 'regex', 'capri.typeOf -> regex #2' );
	strictEqual( capri.typeOf(new Date()), 'date', 'capri.typeOf -> date' );
	strictEqual( capri.typeOf({ a:1 }), 'object', 'capri.typeOf -> object #1' );
	strictEqual( capri.typeOf(null), 'null', 'capri.typeOf -> null' );
	strictEqual( capri.typeOf(undefined), 'undefined', 'capri.typeOf -> undefined' );
	strictEqual( capri.typeOf(new testns.T()), 'testns.T', 'capri.typeOf -> testns.T' );
})


test('capri.extend', function() {
	expect(2);

	var a, b;

	a = {
		"a": "hello world",
		"c": 123
	};
	b = {
		"a": "hello world",
		"b": "added",
		"c": 123
	};
	capri.extend(a, { "b": "added", "c": 456 }, false);
	deepEqual( a, b, 'add missing fields to object a' );

	a = {
		"a": "hello world",
		"c": 123
	};
	b = {
		"a": "hello world",
		"b": "added",
		"c": 456
	};
	capri.extend(a, { "b": "added", "c": 456 }, true);
	deepEqual( a, b, 'add new and overwrite existing fields in object a' );
})


test('UIDs', function() {
	expect(7);

	strictEqual( capri.lastUID(), 0, 'initial state of UID' );
	strictEqual( capri.nextUID(), 1, 'get next UID' );
	strictEqual( capri.lastUID(), 1, 'current state of UID' );
	strictEqual( capri.nextUID(), 2, 'get next UID' );
	strictEqual( capri.lastUID(), 2, 'current state of UID' );
	strictEqual( capri.nextUID(), 3, 'get next UID' );
	strictEqual( capri.lastUID(), 3, 'current state of UID' );
})


test('capri.arguments', function() {
	expect(26);

	(function() {
		equal( arguments.length, 0, 'no arguments specified' );
		deepEqual( capri.arguments(arguments), [], 'no arguments to retrieve' );
		deepEqual( capri.arguments(arguments, 1), [], 'valid arguments retrieved' );
	})();

	(function() {
		equal( arguments.length, 1, 'single argument specified' );
		deepEqual( capri.arguments(arguments), [ 'test' ], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 1), [], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 2), [], 'valid arguments retrieved' );
	})('test');

	(function() {
		equal( arguments.length, 2, 'two arguments specified' );
		deepEqual( capri.arguments(arguments), [ 'hello', 'world' ], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 1), [ 'world' ], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 2), [], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 3), [], 'valid arguments retrieved' );
	})('hello', 'world');

	(function() {
		equal( arguments.length, 3, 'three arguments specified' );
		deepEqual( capri.arguments(arguments, 0, 1), [ 'hello' ], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 0, 2), [ 'hello', 'world' ], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 0, 3), [ 'hello', 'world', 'test' ], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 0, 4), [ 'hello', 'world', 'test' ], 'valid arguments retrieved' );

		deepEqual( capri.arguments(arguments, 1, 1), [ 'world' ], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 1, 2), [ 'world', 'test' ], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 1, 3), [ 'world', 'test' ], 'valid arguments retrieved' );

		deepEqual( capri.arguments(arguments, 2, 1), [ 'test' ], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 2, 2), [ 'test' ], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 2, 3), [ 'test' ], 'valid arguments retrieved' );

		deepEqual( capri.arguments(arguments, 3, 1), [], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 3, 2), [], 'valid arguments retrieved' );
		deepEqual( capri.arguments(arguments, 3, 3), [], 'valid arguments retrieved' );
	})('hello', 'world', 'test');
})


test('capri.parseArgs', function() {
	expect(54);

	var aObj = { "a":"b" };
	var aObj2 = { "a":"b", "x":"y" };
	var aArr = []; aArr["a"] = "b";
	var bObj = { "c":"d" };
	var bArr = []; bArr["c"] = "d";

	var cObj = { "a":"b", "c":"d" };
	var cObj2 = { "a":"b", "c":"d", "x":"y" };
	var cArr = []; cArr["a"] = "b"; cArr["c"] = "d";

	deepEqual( capri.parseArgs([]), [], 'parse empty array with no defaults' );

	deepEqual( capri.parseArgs(''), {}, 'parse empty string with single argument and no defaults' );
	deepEqual( capri.parseArgs('', ''), {}, 'parse empty string with single argument and empty defaults (string)' );
	deepEqual( capri.parseArgs('', {}), {}, 'parse empty string with single argument and empty defaults (object)' );
	deepEqual( capri.parseArgs('', []), {}, 'parse empty string with single argument and empty defaults (array)' );
	deepEqual( capri.parseArgs('', 'c=d'), bObj, 'parse empty string with defaults (string)' );
	deepEqual( capri.parseArgs('', bObj), bObj, 'parse empty string with defaults (object)' );
	deepEqual( capri.parseArgs('', bArr), bObj, 'parse empty string with defaults (array)' );

	deepEqual( capri.parseArgs({}), {}, 'parse empty object with single argument and no defaults' );
	deepEqual( capri.parseArgs({}, ''), {}, 'parse empty object with single argument and empty defaults (string)' );
	deepEqual( capri.parseArgs({}, {}), {}, 'parse empty object with single argument and empty defaults (object)' );
	deepEqual( capri.parseArgs({}, []), {}, 'parse empty object with single argument and empty defaults (array)' );
	deepEqual( capri.parseArgs({}, 'c=d'), bObj, 'parse empty object with defaults (string)' );
	deepEqual( capri.parseArgs({}, bObj), bObj, 'parse empty object with defaults (object)' );
	deepEqual( capri.parseArgs({}, bArr), bObj, 'parse empty object with defaults (array)' );

	deepEqual( capri.parseArgs([]), [], 'parse empty array with single argument and no defaults' );
	deepEqual( capri.parseArgs([], ''), [], 'parse empty array with single argument and empty defaults (string)' );
	deepEqual( capri.parseArgs([], {}), [], 'parse empty array with single argument and empty defaults (object)' );
	deepEqual( capri.parseArgs([], []), [], 'parse empty array with single argument and empty defaults (array)' );
	deepEqual( capri.parseArgs([], 'c=d'), bArr, 'parse empty array with defaults (string)' );
	deepEqual( capri.parseArgs([], bObj), bArr, 'parse empty array with defaults (object)' );
	deepEqual( capri.parseArgs([], bArr), bArr, 'parse empty array with defaults (array)' );

	deepEqual( capri.parseArgs('a=b'), aObj, 'parse string with single argument and no defaults' );
	deepEqual( capri.parseArgs('a=b', ''), aObj, 'parse string with single argument and empty defaults (string)' );
	deepEqual( capri.parseArgs('a=b', {}), aObj, 'parse string with single argument and empty defaults (object)' );
	deepEqual( capri.parseArgs('a=b', []), aObj, 'parse string with single argument and empty defaults (array)' );
	deepEqual( capri.parseArgs('a=b', 'c=d'), cObj, 'parse string with defaults (string)' );
	deepEqual( capri.parseArgs('a=b', bObj), cObj, 'parse string with defaults (object)' );
	deepEqual( capri.parseArgs('a=b', bArr), cObj, 'parse string with defaults (array)' );

	deepEqual( capri.parseArgs('a=b;x=y'), aObj2, 'parse string with multiple arguments and no defaults' );
	deepEqual( capri.parseArgs('a=b;x=y', ''), aObj2, 'parse string with multiple arguments and empty defaults (string)' );
	deepEqual( capri.parseArgs('a=b;x=y', {}), aObj2, 'parse string with multiple arguments and empty defaults (object)' );
	deepEqual( capri.parseArgs('a=b;x=y', []), aObj2, 'parse string with multiple arguments and empty defaults (array)' );
	deepEqual( capri.parseArgs('a=b;x=y', 'c=d'), cObj2, 'parse string with defaults (string)' );
	deepEqual( capri.parseArgs('a=b;x=y', bObj), cObj2, 'parse string with defaults (object)' );
	deepEqual( capri.parseArgs('a=b;x=y', bArr), cObj2, 'parse string with defaults (array)' );

	deepEqual( capri.parseArgs('a=b|x=y', 'c=d|s=d', '|'), { "a":"b", "x":"y", "c":"d", "s":"d" }, 'parse string with defaults (string) - alternative delimiter' );
	deepEqual( capri.parseArgs('a=b|x=y', bObj, '|'), cObj2, 'parse string with defaults (object) - alternative delimiter' );
	deepEqual( capri.parseArgs('a=b|x=y', bArr, '|'), cObj2, 'parse string with defaults (array) - alternative delimiter' );

	deepEqual( capri.parseArgs(aObj), aObj, 'parse object with no defaults' );
	deepEqual( capri.parseArgs(aObj, ''), aObj, 'parse object with empty defaults (string)' );
	deepEqual( capri.parseArgs(aObj, {}), aObj, 'parse object with empty defaults (object)' );
	deepEqual( capri.parseArgs(aObj, []), aObj, 'parse object with empty defaults (array)' );
	deepEqual( capri.parseArgs(aObj, 'c=d'), cObj, 'parse object with defaults (string)' );
	deepEqual( capri.parseArgs(aObj, bObj), cObj, 'parse object with defaults (object)' );
	deepEqual( capri.parseArgs(aObj, bArr), cObj, 'parse object with defaults (array)' );

	deepEqual( capri.parseArgs(aArr), aArr, 'parse object with no defaults' );
	deepEqual( capri.parseArgs(aArr, ''), aArr, 'parse object with empty defaults (string)' );
	deepEqual( capri.parseArgs(aArr, {}), aArr, 'parse object with empty defaults (object)' );
	deepEqual( capri.parseArgs(aArr, []), aArr, 'parse object with empty defaults (array)' );
	deepEqual( capri.parseArgs(aArr, 'c=d'), cArr, 'parse object with defaults (string)' );
	deepEqual( capri.parseArgs(aArr, bObj), cArr, 'parse object with defaults (object)' );
	deepEqual( capri.parseArgs(aArr, bArr), cArr, 'parse object with defaults (array)' );

	aObj = { "a": "b", "c": "d", "e": null };
	bObj = { "a": "b", "c": "d", "e": "f" };
	deepEqual( capri.parseArgs(aObj, 'e=f'), bObj, 'parse object with null value' );
})


test('capri.parseString', function() {
	expect(11);

	deepEqual( capri.parseString(), {}, 'no inputs specified' );
	deepEqual( capri.parseString(''), {}, 'empty string specified' );
	raises(function() {
		capri.parseString({});
	}, capri.Error, 'empty object specified');
	raises(function() {
		capri.parseString([]);
	}, capri.Error, 'empty array specified');

	deepEqual( capri.parseString('a=1'), { "a":"1" }, 'single parameter specified' );
	deepEqual( capri.parseString('a=1&b=2'), { "a":"1", "b":"2" }, 'two parameters specified' );
	deepEqual( capri.parseString('a=1&b=2&c=3'), { "a":"1", "b":"2", "c":"3" }, 'three parameters specified' );

	deepEqual( capri.parseString('a=1', '|'), { "a":"1" }, 'single parameter specified - alternative delimiter' );
	deepEqual( capri.parseString('a=1|b=2', '|'), { "a":"1", "b":"2" }, 'two parameters specified - alternative delimiter' );
	deepEqual( capri.parseString('a=1|b=2|c=3', '|'), { "a":"1", "b":"2", "c":"3" }, 'three parameters specified - alternative delimiter' );

	raises(function() {
		capri.parseString('a=1|b=2', { "a":"1" });
	}, capri.Error, 'expected string for delimiter');
})


test('capri.buildParamString', function() {
	expect(19);

	strictEqual( capri.buildParamString({}), '', 'empty object' );
	// The following case is necessary because the following is valid:
	//   capri.buildParamString([], 'http://example.com') -> http://example.com
	strictEqual( capri.buildParamString({}, '?'), '?', 'empty object with prefix' );
	strictEqual( capri.buildParamString({}, '?', null, true), '?', 'empty object with prefix and encoding' );

	strictEqual( capri.buildParamString([]), '', 'empty array' );
	strictEqual( capri.buildParamString([], '?'), '?', 'empty array with prefix' );
	strictEqual( capri.buildParamString([], '?', null, true), '?', 'empty array with prefix and encoding' );

	var objSingle = { "account": 12345 };
	var objDouble = { "account": 12345, "product name": 24 };
	var objTriple = { "account": 12345, "product name": 24, "part": 578 };

	strictEqual( capri.buildParamString(objSingle), 'account=12345', 'object with single parameter' );
	strictEqual( capri.buildParamString(objSingle, '?'), '?account=12345', 'object with single parameter and prefix' );

	strictEqual( capri.buildParamString(objDouble), 'account=12345&product name=24', 'object with two parameters' );
	strictEqual( capri.buildParamString(objDouble, '?'), '?account=12345&product name=24', 'object with two parameters and prefix' );
	strictEqual( capri.buildParamString(objDouble, null, ';'), 'account=12345;product name=24', 'object with two parameters, and custom delimiter' );
	strictEqual( capri.buildParamString(objDouble, null, ';', true), 'account=12345;product%20name=24', 'object with two parameters, and custom delimiter (escaped)' );

	strictEqual( capri.buildParamString(objTriple), 'account=12345&product name=24&part=578', 'object with three parameters' );
	strictEqual( capri.buildParamString(objTriple, '?'), '?account=12345&product name=24&part=578', 'object with three parameters and prefix' );
	strictEqual( capri.buildParamString(objTriple, null, ';'), 'account=12345;product name=24;part=578', 'object with three parameters, and custom delimiter' );
	strictEqual( capri.buildParamString(objTriple, null, ';', true), 'account=12345;product%20name=24;part=578', 'object with three parameters, and custom delimiter (escaped)' );

	var book = {
		"title" : "War%20of%20the%20Worlds",
		"author": "H.G. Wells and Brian Aldiss",
		"isbn"  : "0141441038"
	};

	strictEqual( capri.buildParamString(book), 'title=War%20of%20the%20Worlds&author=H.G. Wells and Brian Aldiss&isbn=0141441038', 'object with escape characters' );
	strictEqual( capri.buildParamString(book, null, ';', true), 'title=War%2520of%2520the%2520Worlds;author=H.G.%20Wells%20and%20Brian%20Aldiss;isbn=0141441038', 'object with escape characters and custom delimiter (escaped)' );
	strictEqual( capri.buildParamString(book, null, ';', [ 'title' ]), 'title=War%20of%20the%20Worlds;author=H.G.%20Wells%20and%20Brian%20Aldiss;isbn=0141441038', 'object with escape characters (partially escaped)' );
})


test('capri.fillArray', function() {
	expect(8);

	var input, expected;

	// Assertion #1
	input		= [];
	expected	= [ 1, 1, 1, 1, 1 ];
	deepEqual( capri.fillArray(input, 5, 1), expected, 'Fill blank array with five 1s' );

	// Assertion #2
	input		= [ 2, 2 ];
	expected	= [ 1, 1, 1, 1, 1 ];
	deepEqual( capri.fillArray(input, 5, 1), expected, 'Fill non-blank array with five 1s' );

	// Assertion #3
	input		= [];
	expected	= [];
	deepEqual( capri.fillArray(input, 0, 1), expected, 'Fill blank array with zero 1s' );

	// Assertion #4
	input		= [];
	expected	= [ 1 ];
	deepEqual( capri.fillArray(input, 1, 1), expected, 'Fill blank array with one 1' );

	// Assertion #5
	input		= [];
	expected	= [ 'hello', 'hello', 'hello' ];
	deepEqual( capri.fillArray(input, 3, 'hello'), expected, 'Fill blank array with three strings' );

	// Assertion #6
	var POINT = function() { this.x = 0; this.y = 1; };
	input		= [];
	expected	= [ new POINT(), new POINT() ];
	deepEqual( capri.fillArray(input, 2, POINT, true), expected, 'Fill blank array with 2 class instances' );

	// Assertion #7
	raises(function() {
		capri.fillArray();
	}, capri.Error, 'missing required parameter');

	// Assertion #8
	raises(function() {
		capri.fillArray([]);
	}, capri.Error, 'missing required parameter');
})


test('capri.arrayTrimAndFilter', function() {
	expect(1);

	var input, expected;

	input		= [ '   &nbsp;test   ', 'test   ', '', '    ', 'one-two-three', ' hello', 'world ' ];
	expected	= [ '&nbsp;test', 'test', 'one-two-three', 'hello', 'world' ];
	deepEqual( capri.arrayTrimAndFilter(input), expected, 'leading and trailing spaces should be removed from items. empty items should not be returned' );
})


test('capri.appendQueryString', function() {
	expect(22);

	var objSingle = { "m": 12345 };
	var arrSingle = []; arrSingle['m'] = 12345;
	var strSingle = 'm=12345';

	var objDouble = { "m": 12345, "n": "hello" };
	var arrDouble = []; arrDouble['m'] = 12345; arrDouble['n'] = "hello";
	var strDouble = 'm=12345&n=hello';

	strictEqual( capri.appendQueryString('http://example.com'), 'http://example.com', 'no query string specified' );
	strictEqual( capri.appendQueryString('http://example.com', {}), 'http://example.com', 'empty query string specified (object)' );
	strictEqual( capri.appendQueryString('http://example.com', []), 'http://example.com', 'empty query string specified (array)' );
	strictEqual( capri.appendQueryString('http://example.com', ''), 'http://example.com', 'empty query string specified (string)' );

	strictEqual( capri.appendQueryString('http://example.com', objSingle), 'http://example.com?m=12345', 'add query param to uri that doesn\'t already have one (object)' );
	strictEqual( capri.appendQueryString('http://example.com', arrSingle), 'http://example.com?m=12345', 'add query param to uri that doesn\'t already have one (array)' );
	strictEqual( capri.appendQueryString('http://example.com', strSingle), 'http://example.com?m=12345', 'add query param to uri that doesn\'t already have one (string)' );
	strictEqual( capri.appendQueryString('http://example.com', objDouble), 'http://example.com?m=12345&n=hello', 'add multiple query params to uri that doesn\'t already have one (object)' );
	strictEqual( capri.appendQueryString('http://example.com', arrDouble), 'http://example.com?m=12345&n=hello', 'add multiple query params to uri that doesn\'t already have one (array)' );
	strictEqual( capri.appendQueryString('http://example.com', strDouble), 'http://example.com?m=12345&n=hello', 'add multiple query params to uri that doesn\'t already have one (string)' );

	strictEqual( capri.appendQueryString('http://example.com?a=b'), 'http://example.com?a=b', 'no query string specified' );
	strictEqual( capri.appendQueryString('http://example.com?a=b', {}), 'http://example.com?a=b', 'empty query string specified (object)' );
	strictEqual( capri.appendQueryString('http://example.com?a=b', []), 'http://example.com?a=b', 'empty query string specified (array)' );
	strictEqual( capri.appendQueryString('http://example.com?a=b', ''), 'http://example.com?a=b', 'empty query string specified (string)' );

	strictEqual( capri.appendQueryString('http://example.com?a=b', objSingle), 'http://example.com?a=b&m=12345', 'add query param to uri that already has one (object)' );
	strictEqual( capri.appendQueryString('http://example.com?a=b', arrSingle), 'http://example.com?a=b&m=12345', 'add query param to uri that already has one (array)' );
	strictEqual( capri.appendQueryString('http://example.com?a=b', strSingle), 'http://example.com?a=b&m=12345', 'add query param to uri that already has one (string)' );
	strictEqual( capri.appendQueryString('http://example.com?a=b', objDouble), 'http://example.com?a=b&m=12345&n=hello', 'add multiple query params to uri that already has one (object)' );
	strictEqual( capri.appendQueryString('http://example.com?a=b', arrDouble), 'http://example.com?a=b&m=12345&n=hello', 'add multiple query params to uri that already has one (array)' );
	strictEqual( capri.appendQueryString('http://example.com?a=b', strDouble), 'http://example.com?a=b&m=12345&n=hello', 'add multiple query params to uri that already has one (string)' );

	strictEqual( capri.appendQueryString(''), '', 'empty string specified' );

	raises(function() {
		capri.appendQueryString();
	}, capri.Error, 'missing required parameter');
})


test('capri.removeQueryString', function() {
	expect(7);

	strictEqual( capri.removeQueryString(''), '', 'empty uri' );
	strictEqual( capri.removeQueryString('http://example.com'), 'http://example.com', 'uri with no query string' );
	strictEqual( capri.removeQueryString('http://example.com?a=b'), 'http://example.com', 'uri with single query parameter' );
	strictEqual( capri.removeQueryString('http://example.com?a=b&c=d'), 'http://example.com', 'uri with multiple query parameters' );
	strictEqual( capri.removeQueryString('http://example.com?a=b#intro'), 'http://example.com', 'uri with query string and fragment' );
	strictEqual( capri.removeQueryString('http://example.com#intro'), 'http://example.com', 'uri with fragment' );

	raises(function() {
		capri.removeQueryString();
	}, capri.Error, 'missing required parameter');
})


test('capri.extensionFromUri', function() {
	expect(16);

	strictEqual( capri.extensionFromUri(''), null, 'empty uri' );
	strictEqual( capri.extensionFromUri('http://example.com'), null, 'no extension in uri' );
	strictEqual( capri.extensionFromUri('http://example.com/'), null, 'no extension in uri' );
	strictEqual( capri.extensionFromUri('http://example.com/test'), null, 'no extension in uri' );
	strictEqual( capri.extensionFromUri('http://example.com/test.html'), '.html', 'extension is .html' );
	strictEqual( capri.extensionFromUri('http://example.com/test.html/'), null, 'no extension in uri' );
	strictEqual( capri.extensionFromUri('http://example.com/test.html/test.png'), '.png', 'extension is .png' );

	strictEqual( capri.extensionFromUri('http://example.com/test.html?a=b'), '.html', 'extension is .html - ignore query string' );
	strictEqual( capri.extensionFromUri('http://example.com/test.html#intro'), '.html', 'extension is .html - ignore fragment' );

	strictEqual( capri.extensionFromUri('test'), null, 'no extension in uri' );
	strictEqual( capri.extensionFromUri('test.html'), '.html', 'extension is .html' );
	strictEqual( capri.extensionFromUri('test.html/'), null, 'no extension in uri' );
	strictEqual( capri.extensionFromUri('test.html/test.png'), '.png', 'extension is .png' );

	strictEqual( capri.extensionFromUri('test.html?a=b'), '.html', 'extension is .html - ignore query string' );
	strictEqual( capri.extensionFromUri('test.html#intro'), '.html', 'extension is .html - ignore fragment' );

	raises(function() {
		capri.extensionFromUri();
	}, capri.Error, 'missing required parameter');
})


test('capri.camelCase', function() {
	expect(10);

	strictEqual( capri.camelCase(), null, 'nothing specified' );
	strictEqual( capri.camelCase(''), null, 'empty string' );
	strictEqual( capri.camelCase('hello'), 'hello', 'single word' );
	strictEqual( capri.camelCase('hello-world'), 'helloWorld', 'two words delimited by hyphen' );
	strictEqual( capri.camelCase('hello world'), 'helloWorld', 'two words delimited by space' );
	strictEqual( capri.camelCase('   hello   world  '), 'helloWorld', 'two words with excessive spacing' );
	strictEqual( capri.camelCase('hello-world-24'), 'helloWorld24', 'two words delimited by hyphen with number' );
	strictEqual( capri.camelCase('hello_world-24'), 'hello_world24', 'two words delimited by hyphen with underscore' );
	strictEqual( capri.camelCase('  24  hello  24'), 'hello24', 'single word with number and illegal prefix' );
	strictEqual( capri.camelCase(' !!  another£ brick $in the #wall  '), 'anotherBrickInTheWall', 'numerous words delimited by various symbols' );
})


test('capri.hyphenCase', function() {
	expect(11);

	strictEqual( capri.hyphenCase(), null, 'nothing specified' );
	strictEqual( capri.hyphenCase(''), null, 'empty string' );
	strictEqual( capri.hyphenCase('hello'), 'hello', 'single word' );
	strictEqual( capri.hyphenCase('hello-world'), 'hello-world', 'two words delimited by hyphen' );
	strictEqual( capri.hyphenCase('hello World'), 'hello-world', 'two words delimited by space' );
	strictEqual( capri.hyphenCase('   hello   World  '), 'hello-world', 'two words with excessive spacing' );
	strictEqual( capri.hyphenCase('hello-world-24'), 'hello-world-24', 'two words delimited by hyphen with number' );
	strictEqual( capri.hyphenCase('hello_world-24'), 'hello-world-24', 'two words delimited by hyphen with underscore' );
	strictEqual( capri.hyphenCase('  24  hello  24'), '24-hello-24', 'single word with number and illegal prefix' );
	strictEqual( capri.hyphenCase('  24 test / hello / 24'), '24-test-hello-24', 'single word with number and illegal prefix with slashes' );
	strictEqual( capri.hyphenCase(' !!  another£ brick $in the #wall  '), 'another-brick-in-the-wall', 'numerous words delimited by various symbols' );
})