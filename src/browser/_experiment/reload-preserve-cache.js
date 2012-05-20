/**
 * Functionality for web browsers
 *
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */
capri.module(function(require, define, exports) {

var $ = require('jquery')
  ;

/**
 * Reload page
 *
 * Local cache of resources (images, scripts, styles, etc) is preserved unless explicitly
 * specified.
 *
 * This is achieved by automatically altering query argument `t`. The vertical scroll
 * offset is maintained using fragment in URI which is automatically removed in HTML5
 * conformant web browsers.
 *
 * ```warning
 * This function may cause problems in web applications that make use of URI fragment.
 * Please create a ticket if you do experience any such issue so that we can try to improve
 * this.
 * ```
 *
 * @param {boolean} [clearCache] Indicates if local resource cache (scripts, styles, etc)
 *    should be cleared. Defaults to `false`.
 */
capri.reloadPage = function(clearCache) {
	if (clearCache) {
		// Reload and clear local resource cache
		window.reload();
	}
	else {
		// Reload and preserve local resource cache
		var reload = location.href.split('#')[0];
		var parts = reload.split('?');

		// 't' force page to reload without clearing cache
		var args;
		if (parts.length === 2) {
			args = capri.parseString(parts[1]);
			args['t'] = args['t'] == 1 ? 2 : 1;
		}
		else {
			args = { "t": 1 };
		}
		location = capri.appendQueryString(parts[0], args) + '#y=' + window.pageYOffset;
	}
}

$(function() {
	// Note: Used in conjunction with `capri.reloadPage`

	// Restore vertical scroll offset from fragment?
	if (location.hash && location.hash.indexOf('#y=') === 0) {
		$(window).scrollTop(location.hash.substr(3));
		// Hide fragment from location bar when possible
		if (history.replaceState)
			history.replaceState(null, null, location.href.substr(0, location.href.indexOf('#')));
	}
})

}) // capri.module