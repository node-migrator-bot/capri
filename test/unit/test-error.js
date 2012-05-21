/**
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

QUnit.module("capri/src/error");

test('fundamental requirements', function() {
	expect(1);

	strictEqual( typeof capri.Error, 'function', 'capri.Error is defined' );
})

test('exception throwing', function() {
	expect(1);

	try {
		throw new capri.Error('Something went bang!', 'invalid_param');
	}
	catch (ex) {
		strictEqual( ex.toString(), 'capri.Error: Something went bang! (invalid_param)', 'Correct message returned' );
	}
})