/**
 * Error class
 *
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

/**
 * Error encountered by Capri
 *
 * # Error Codes
 *
 * include_process_locked
 * :   Unable to process includes because include processing has been locked. Processing
 *     is locked during startup ({@link module:capri/doc-manager}).
 *
 * invalid_param
 * :   Invalid parameter was specified when invoking method or function ({@link module:capri/core}).
 *
 * not_implemented
 * :   Invoked an abstract method that has not been implemented.
 *
 * startup_error
 * :   An error was encountered during startup ({@link module:capri/doc-manager})
 *
 * undefined_method
 * :   Attempted to use method or function that has not been defined ({@link module:capri/oop}).
 *
 * unknown_include_type
 * :   Attempted to dynamically include an unknown resource type ({@link module:capri/doc-manager}).
 *
 * @param {string} message Error message
 * @param {string|number} [code] Error code
 */
capri.define('class capri.Error', {

	__construct: function(message, code) {
		// Instantiated as class
		this.message = message;
		this.code = code;

		// Log error message in console
		if (console && typeof console.error === 'function' && !capri.env.isNode)
			console.error(this.toString());
	},

	/**
	 * Get error message string
	 * @returns {string}
	 */
	toString: function() {
		var r = this.getFullClassName() + ': ' + this.message;
		if (!!this.code)
			r += ' (' + this.code + ')';
		return r;
	}

})