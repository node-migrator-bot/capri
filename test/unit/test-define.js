/**
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

QUnit.module("capri/src/define");

test('fundamental requirements', function() {
	expect(2);

	strictEqual( typeof capri.define, 'function', 'capri.define is defined' );
	strictEqual( typeof capri.define.register, 'function', 'capri.define.register is defined' );
})
