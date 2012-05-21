/**
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

QUnit.module("capri/src/namespace");

test('fundamental requirements', function() {
	expect(6);

	equal( capri.global, typeof window !== 'undefined' ? window : global, 'capri.global is defined' );

	strictEqual( typeof capri.ns, 'function', 'capri.ns is defined' );
	strictEqual( typeof capri.ns.id, 'function', 'capri.ns.id is defined' );
	strictEqual( typeof capri.ns.baseName, 'function', 'capri.ns.baseName is defined' );
	strictEqual( typeof capri.ns.moduleName, 'function', 'capri.ns.moduleName is defined' );

	strictEqual( typeof capri.use, 'function', 'capri.use is defined' );
})


test('capri.ns', function() {
	expect(13);

	capri.ns('a.b' );
	equal( typeof a.b, 'object', 'a.b was defined' );

	capri.ns('a.b.c' );
	equal( typeof a.b.c, 'object', 'added c to a.b' );
	strictEqual( capri.ns('a.b.c', false), a.b.c, 'Namespace a.b.c is defined' );
	strictEqual( capri.ns('a.b.c.d.e', false), undefined, 'Namespace a.b.c.d.e is not defined' );
	strictEqual( a.b.c.d, undefined, 'Namespace a.b.c.d was not defined' );

	capri.ns('a.d', {test: 42});
	equal( typeof a.d, 'object', 'added d to a' );
	strictEqual( a.d.test, 42, 'namespace field valid' );

	capri.ns('a.d', {test2: 'test'});
	strictEqual( a.d.test, 42);
	strictEqual( a.d.test2, 'test', 'namespace field valid' );

	equal( capri.ns.id('a.b.c'), 'c', 'capri.ns.id("a.b.c")' );
	equal( capri.ns.baseName('a.b.c'), 'a.b', 'capri.ns.baseName("a.b.c")' );

	strictEqual( capri.ns(), capri.global, 'capri.ns() === capri.global' );
	strictEqual( capri.ns(''), capri.global, 'capri.ns(\'\') === capri.global' );
})


test('capri.ns.id', function() {
	expect(7);

	strictEqual( capri.ns.id('my.special.namespace'), 'namespace', 'capri.ns.id("my.special.namespace") === "namespace"' );
	strictEqual( capri.ns.id('my.special'), 'special', 'capri.ns.id("my.special") === "special"' );
	strictEqual( capri.ns.id('my'), 'my', 'capri.ns.id("my") === "my"' );

	strictEqual( capri.ns.id('module:my/module#special.namespace'), 'namespace', 'capri.ns.id("module:my/module#special.namespace") === "namespace"' );
	strictEqual( capri.ns.id('module:my/module#special'), 'special', 'capri.ns.id("module:my/module#special") === "special"' );
	strictEqual( capri.ns.id('module:my/module#'), null, 'capri.ns.id("module:my/module#") === null' );
	strictEqual( capri.ns.id('module:my/module'), null, 'capri.ns.id("module:my/module") === null' );
})


test('capri.ns.baseName', function() {
	expect(8);

	strictEqual( capri.ns.baseName('my.special.namespace'), 'my.special', 'capri.ns.baseName("my.special.namespace") === "my.special"');
	strictEqual( capri.ns.baseName('my.special'), 'my', 'capri.ns.baseName("my.special") === "my"');
	strictEqual( capri.ns.baseName('my'), '', 'capri.ns.baseName("my") === ""');
	strictEqual( capri.ns.baseName(''), '', 'capri.ns.baseName("") === ""');

	strictEqual( capri.ns.baseName('module:my/module#special.namespace'), 'special', 'capri.ns.baseName("module:my/module#special.namespace") === "special"');
	strictEqual( capri.ns.baseName('module:my/module#special'), '', 'capri.ns.baseName("module:my/module#special") === ""');
	strictEqual( capri.ns.baseName('module:my/module#'), '', 'capri.ns.baseName("module:my/module#") === ""');
	strictEqual( capri.ns.baseName('module:my/module'), '', 'capri.ns.baseName("module:my/module") === ""');
})


test('capri.ns.moduleName', function() {
	expect(6);

	strictEqual( capri.ns.moduleName('my.special.namespace'), null, 'capri.ns.moduleName("my.special.namespace") === null' );
	strictEqual( capri.ns.moduleName('my.special'), null, 'capri.ns.moduleName("my.special") === null' );
	strictEqual( capri.ns.moduleName('my'), null, 'capri.ns.moduleName("my") === null' );
	strictEqual( capri.ns.moduleName(''), null, 'capri.ns.moduleName("") === null' );

	strictEqual( capri.ns.moduleName('module:my/module#special.namespace'), 'my/module', 'capri.ns.moduleName("module:my/module#special.namespace") === "my/module"' );
	strictEqual( capri.ns.moduleName('module:my#special.namespace'), 'my', 'capri.ns.moduleName("module:my#special.namespace") === "my"' );
})


test('capri.use', function() {
	expect(2);

	capri.use('capri', function(c) {
		strictEqual( c, capri, '`capri.use` with single namespace' );
	})
	capri.use([ 'capri', global ], function(c, g) {
		strictEqual( c.global, global, '`capri.use` with multiple namespaces' );
	})
})