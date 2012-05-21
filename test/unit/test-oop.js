/**
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

// @todo test mixinDefaultOptions with hierarchical defaults

QUnit.module("capri/src/oop");

test('fundamental requirements', function() {
	expect(16);

	strictEqual( typeof capri.is, 'function', 'capri.is is defined' );

	strictEqual( typeof capri.Object, 'function', 'capri.Object is defined' );
	strictEqual( typeof capri.Object.add, 'function', 'capri.Object.add is defined' );
	strictEqual( typeof capri.Object.getFullName, 'function', 'capri.Object.getFullName is defined' );
	strictEqual( typeof capri.Object.getName, 'function', 'capri.Object.getName is defined' );
	strictEqual( typeof capri.Object.getNamespace, 'function', 'capri.Object.getNamespace is defined' );
	strictEqual( typeof capri.Object.getModuleName, 'function', 'capri.Object.getModuleName is defined' );
	strictEqual( typeof capri.Object.getSuper, 'function', 'capri.Object.getSuper is defined' );
	strictEqual( typeof capri.Object.getSubClasses, 'function', 'capri.Object.getSubClasses is defined' );
	strictEqual( typeof capri.Object.is, 'function', 'capri.Object.is is defined' );
	strictEqual( typeof capri.Object.isAbstract, 'function', 'capri.Object.isAbstract is defined' );
	strictEqual( typeof capri.Object.getInterfaces, 'function', 'capri.Object.getInterfaces is defined' );
	strictEqual( typeof capri.Object.prototype.getClass, 'function', 'capri.Object#getClass is defined' );
	strictEqual( typeof capri.Object.prototype.getClassName, 'function', 'capri.Object#getClassName is defined' );
	strictEqual( typeof capri.Object.prototype.getFullClassName, 'function', 'capri.Object#getFullClassName is defined' );
	strictEqual( typeof capri.Object.prototype.toString, 'function', 'capri.Object#toString is defined' );
})
