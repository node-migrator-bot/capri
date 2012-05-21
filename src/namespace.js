/**
 * Namespaces
 *
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

/**
 * Define or access namespace 
 *
 * Namespace will be defined if it doesn't already exist. Members can be added to a
 * namespace by specifying an extension object (see Ex#3).
 *
 * ```warning
 * Cannot lookup module namespace by name. Please specify `exports` object as first
 * parameter to access module scope.
 * ```
 *
 * Applications will often make use of multiple scripts (possibly from multiple vendors).
 * This can introduce naming conflicts which can lead to many undesirable outcomes. This
 * problem can be overcome by placing functions, variables, etc into vendor-specific
 * namespaces and/or modules.
 *
 * This function aims to make the process of working with namespaces easier. The global
 * namespace acts as the root for all namespaces. This means that a namespace called
 * `my.special.namespace` can be accessed via `global.my.special.namespace` (in node).
 *
 * ```note
 * Do not clutter the global namespace because this will often lead to trouble! Instead
 * define things within a vendor specific namespace.
 *
 * For example, `mycompany.math.Vector3`.
 * ```
 *
 * @example "Access namespace"
 *
 * ```source
 * capri.ns('my.special').foo();
 * ```
 *
 * @example "Ensure that namespace is defined"
 *
 * ```source
 * capri.ns('my.special');
 *
 * // The following would fail if "my" namespace had not been defined. The `capri.ns`
 * function conveniently avoids the `ReferenceError` exception.
 * if (my.special.foo)
 *    my.special.foo();
 * ```
 *
 * @example "Add members to namespace"
 *
 * ```source
 * capri.ns('my.special', {
 *    foo: function() {
 *    }
 * })
 * ```
 *
 * @example "Access global namespace"
 *
 * ```source
 * // Easy way to access global namespace:
 * capri.global.globalVar = 42;
 *
 * // Add definitions to global namespace with object notation:
 * capri.ns(capri.global, {
 *    globalFunction: function() {
 *       console.log('Global function!');
 *    }
 * })
 *
 * // Equivalents:
 * capri.ns('').globalVar = 42;
 * capri.ns('', {
 *    globalFunction: function() {
 *       console.log('Global function!');
 *    }
 * })
 * ```
 *
 * @param {string|object} ns Namespace to lookup
 * @param {string} [subns] Sub namespace to lookup
 * @param {object} [extension] Extension members to add
 *
 * @returns {object} Namespace object
 *
 ****
 * Acquire access to an existing namespace
 *
 * ```warning
 * Cannot lookup module namespace by name. Please specify `exports` object as first
 * parameter to access module scope.
 * ```
 *
 * @example "Find out if namespace is defined"
 *
 * ```source
 * var ns = capri.ns('my.special.namespace');
 * if (ns !== undefined)
 *    console.log('Namespace is defined');
 * else
 *    console.log('Namespace is NOT defined');
 * ```
 *
 * @param {string|object} ns Namespace to lookup
 * @param {string} [subns] Sub namespace to lookup
 * @param {boolean} define `false` prevents namespace from being defined
 *
 * @returns {object|undefined} Namespace object or `undefined` if namespace is not defined.
 */
 capri.ns = function(ns) {
	var extension, node;
	if (!ns)
		ns = capri.global;

	if (typeof arguments[1] === 'string' && !!arguments[1]) {
		node = capri.ns(arguments[0]);
		ns = arguments[1];
		extension = arguments[2];
	}
	else {
		node = capri.global;
		extension = arguments[1];
	}

	if (typeof ns === 'string') {
		var fragments = ns.split('.');

		// Value of false indicates that namespace should not be defined
		if (extension === false)
			for (var i = 0; i < fragments.length; ++i) {
				var f = fragments[i];
				if (!node[f])
					return undefined;
				node = node[f];
			}
		else
			for (var i = 0; i < fragments.length; ++i) {
				var f = fragments[i];
				node = !node[f] ? (node[f] = {}) : node[f];
			}
	}
	else
		node = ns;

	if (extension)
		capri.extend(node, extension);

	return node;
}

/**
 * Get identifier from namespace qualified identifier
 *
 * @example "Global namespace"
 *
 * ```source
 * capri.ns.id('my.special.namespace');
 * // -> "namespace"
 * ```
 *
 * @example "Module namespace"
 *
 * ```source
 * capri.ns.id('module:my/module#special.namespace');
 * // -> "namespace"
 * ```
 *
 * @param {string} qid Namespace qualified identifier
 *
 * @returns {string} Identifier or `null` when id not present.
 */
capri.ns.id = function(qid) {
	var m = qid.match(/[^#.]*$/);
	return ( m !== null && m[0] !== '' && m[0].indexOf('module:') === -1 ) ? m[0] : null;
}

/**
 * Get base name of namespace qualified identifier
 *
 * @example "Global namespace"
 *
 * ```source
 * capri.ns.baseName('my.special.namespace');
 * // -> "my.special"
 * ```
 *
 * @example "Module namespace"
 *
 * ```source
 * capri.ns.baseName('module:my/module#special.namespace');
 * // -> "special"
 * ```
 *
 * @param {string} qid Namespace qualified identifier
 *
 * @returns {string} Base name as string
 * ```note
 * Returns empty string for, root of module, or global namespace.
 * ```
 */
capri.ns.baseName = function(qid) {
	var m = qid.match(/((^|#)[^#]+)\./);
	return m !== null
		? ( m[1][0] === '#'
			? m[1].substr(1)
			: m[1] )
		: '';
}

/**
 * Get name of module from namespace qualified identifier
 *
 * @example "Global namespace"
 *
 * ```source
 * capri.ns.moduleName('my.special.namespace');
 * // -> null
 * ```
 *
 * @example "Module namespace"
 *
 * ```source
 * capri.ns.moduleName('module:my/module#special.namespace');
 * // -> "my/module"
 * ```
 *
 * @param {string} qid Namespace qualified identifier
 *
 * @returns {string|null} Name of module or `null` for global name.
 */
capri.ns.moduleName = function(qid) {
	var m = qid.match(/^module[:]([^#]+)/);
	return m !== null ? m[1] : null;
}

/**
 * Use alias to access namespace
 *
 * Shorter aliases can be used to access namespaces within a specified scope.
 * This avoids repeatedly entering long namespaces.
 *
 * @example "Use single namespace"
 *
 * ```source
 * capri.ns.use('my.special.namespace', function(myns) {
 *    // Both of the following lines are equivalent:
 *    myns.foo();
 *    my.special.namespace.foo();
 * })
 * ```
 *
 * @example "Use multiple namespaces"
 *
 * ```source
 * capri.ns.use([ 'my.special.namespace', jQuery ], function(myns, $) {
 *    // Both of the following lines are equivalent:
 *    $('#my-element').text(myns.foo());
 *    jQuery('#my-element').text(my.special.namespace.foo());
 * })
 * ```
 *
 * @param {string} ns Namespace to lookup
 * @param {function} fn Scope to use namespace within
 *
 * @returns Value returned by scope `fn`
 */
capri.use = function(ns, fn) {
	if (capri.typeOf(ns) === 'array') {
		for (var i = 0; i < ns.length; ++i)
			ns[i] = capri.ns(ns[i]);
		return fn.apply(capri.global, ns);
	}
	else
		return fn.call(capri.global, capri.ns(ns));
}