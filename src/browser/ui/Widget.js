/**
 * Widget architecture for jQuery that utilises modules, classes and namespaces
 *
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 * @seealso {@link http://capri.rotorz.com/tutorial/creating-a-widget.html Creating a widget}
 */
capri.module(function(require, define, exports) {

var $ = require('jquery')
  ;

/**
 * Base class for a Capri widget
 *
 * @example "Define colour toggle widget"
 *
 * ```source
 * capri.module(function(require, define, exports) {
 *
 * var Widget = require('capri/ui/Widget')
 *   ;
 *
 * return define('class ColourToggleWidget', {
 *    "extends": Widget,
 *
 *    _current: "colourA",
 *
 *    create: function() {
 *       // Toggle colour on mouse down
 *       this.element.mousedown(this.event('mousedown'));
 *       // Prepare initial state
 *       this.currentState(this._current);
 *    },
 *    toggle: function() {
 *    	  this.currentState( this._current === 'colourA' ? 'colourB' : 'colourA' );
 *    	  return this; // allow chaining
 *    },
 *    currentState: function(value) {
 *    	  if (value !== undefined) { // setter
 *    	     this._current = value;
 *    	     this.element.css('background-color', this.options[ this._current ]);
 *    	     return this; // allow chaining
 *    	  }
 *    	  else { // getter
 *    	     return this._current;
 *    	  }
 *    },
 *    event_mousedown: function() {
 *       this.toggle();
 *    },
 *
 * "static": {
 * 
 *    defaultOptions: {
 *       "colourA": "red",
 *       "colourB": "green"
 *    }
 * 
 * }
 *
 * })
 *
 * }) // capri.module
 * ```
 *
 * @example "Usage of colour toggle widget module"
 *
 * ```source
 * $('#toggle-btn').widget('init', 'module:example/ColourToggleWidget');
 * ```
 *
 * @seealso {@link http://capri.rotorz.com/tutorial/creating-a-widget.html Creating a widget}
 */
 exports = this.exports = capri.define('class Widget', {

	"abstract": true,

	/**
	 * Construct widget instance
	 *
	 * Default options are automatically mixed in and available via `this.options`. Custom
	 * widgets may disable this behaviour by overriding constructor and *not* calling super.
	 *
	 * Plugin scripts can access custom options when extending existing widgets
	 * (see example) with default constructor behaviour.
	 *
	 * @example "Add method to all widgets"
	 * ```note
	 * Custom vendor prefix should always be used when extending to avoid potential
	 * conflicts (present or future)
	 * ```
	 *
	 * ```source
	 * capri.module(function(require, define, exports) {
	 *
	 * var Widget = require('capri/ui/Widget')
	 *   ;
	 *    
	 * Widget.add({
	 *    my_shadow: function() {
	 *       // Add shadow to element
	 *       if (!!this.element) {
	 *          var pos = '0px 0px 5px 30px';
	 *          var color = this.options.my_shadowColor || '#333';
	 *          this.element
	 *             .css('box-shadow', pos + color)
	 *             .css('-moz-box-shadow', pos + color)
	 *             .css('-webkit-shadow', pos + color);
	 *       }
	 *       return this;
	 *    }
	 * })
	 *
	 * })
	 * ```
	 *
	 * @param {string|object|array} [options] Options can be specified:
	 *
	 *  - as semi-colon delimited string
	 *  - as object
	 *  - as associative array
	 */
	__construct: function(options) {
		this.options = this.mixinDefaultOptions(options || {});
	},

	/**
	 * Mixin defaults for missing options
	 *
	 * Defaults can be defined statically on a per widget basis. Subclassed
	 * widgets inherit defaults (unless overridden).
	 *
	 * @example
	 *
	 * ```source
	 * capri.module(function(require, define, exports) {
	 *
	 * var Widget = require('capri/ui/Widget')
	 *   ;
	 *
	 * define('class MyWidget', {
	 *    "extends": Widget,
	 *
	 *    create: function() {
	 *       this.color(this.options.color);
	 *    },
	 *    color: function(color) {
	 *       if (color !== undefined) { // setter
	 *          this.element.css('color', this.color = color);
	 *          return this;
	 *       }
	 *       else { // getter
	 *          return this.color;
	 *       }
	 *    },
	 *    specialMethod: function(a, b, c) {
	 *       return a + b + c;
	 *    },
	 *
	 * "static": {
	 *    defaultOptions: {
	 *       "color": "red"
	 *    }
	 * }
	 *
	 * })
	 *
	 * }) // capri.module
	 * ```
	 *
	 * @param {string|object|array} options Options can be specified:
	 *
	 *  - as semi-colon delimited string
	 *  - as object
	 *  - as associative array
	 *
	 * @returns {object|array} `array` when supplied with an array,
	 *    otherwise returns an `object`.
	 */
	mixinDefaultOptions: function(options) {
		var klass = this.getClass();
		do {
			if (klass.defaultOptions)
				options = capri.parseArgs(options, klass.defaultOptions);
			klass = klass.getSuper();
		}
		while(klass);
		return options;
	},
	/**
	 * Attach widget to DOM element
	 *
	 * Invokes widget method `create` (if present) once attached.
	 *
	 * @param {string|DOMElement} element selector or element reference
	 */
	attach: function(element) {
		(this.element = $(element))
			.data('widget', this)
			.addClass('capri-widget');

		var skin = exports.getDefaultSkin();
		if (skin)
			this.element.addClass('skin-' + skin);

		if (capri.typeOf(this.create) === 'function')
			this.create();
	},
	/**
	 * Detach widget from DOM element
	 *
	 * Invokes widget method `destroy` (if present) before detaching.
	 */
	detach: function() {
		if (capri.typeOf(this.destroy) === 'function')
			this.destroy();
		this.element.removeData('widget');
		delete this.element;
	},

	/**
	 * Get callback for event
	 *
	 * @example
	 *
	 * ```source
	 * capri.module(function(require, define, exports) {
	 *
	 * var Widget = require('capri/ui/Widget')
	 *   ;
	 *
	 * define('class MyWidget', {
	 *    "extends": Widget,
	 *
	 *    create: function() {
	 *       this.element.cick(this.event('click'));
	 *    },
	 *    event_click: function(event) {
	 *       this.element.css('color', 'red');
	 *    }
	 * })
	 *
	 * }) // capri.module
	 * ```
	 *
	 * @param {string} name Name of event
	 *
	 * @returns {function} Proxy function that binds object to event callback
	 */
	event: function(name) {
		return $.proxy(this['event_' + name], this);
	},

	/**
	 * Indicates if widget is enabled
	 * @returns {boolean} `true` when enabled, or `false`
	 *
	 ****
	 * Enable or disable widget
	 *
	 * CSS class 'capri-disabled' is added to disabled widgets.
	 *
	 * @param {boolean} flag `true` indicates that widget should be enabled, `false`
	 *    indicates that widget should be disabled.
	 *
	 * @returns {this}
	 */
	enabled: function(flag) {
		var currentFlag = !this.element.hasClass('capri-disabled');

		if (flag === undefined)
			return currentFlag;

		flag = !!flag;
		if (currentFlag !== flag) {
			if (!flag)
				this.element.addClass('capri-disabled');
			else
				this.element.removeClass('capri-disabled');
		}

		return this;
	},

"static": {
	/**
	 * Set default skin for new widgets
	 *
	 * Class is added to widget element which reflects the associated skin. The
	 * class follows the naming convention `skin-{name}`.
	 *
	 * Skin name is stored in hyphen case, see {@link capri.hyphenCase}
	 *
	 * @param {string|null} skin Name of skin
	 */
	setDefaultSkin: function(skin) {
		exports._defaultSkin = capri.hyphenCase(skin);
	},
	/**
	 * Get default skin that is assigned to new widgets
	 * @returns {string|null} Name of skin or `null` when none is specified.
	 */
	getDefaultSkin: function() {
		return exports._defaultSkin || null;
	}
}

})

/**
 * Widget plugin for jQuery
 *
 * Note: Widget classes *must* extend {@link capri.ui.Widget}.
 *
 * @example "Attach widget to DOM element"
 *
 * ```source
 * capri.run(function(require) {
 *    var $        = require('jquery')
 *      , MyWidget = require('mylib/MyWidget')
 *      ;
 *
 *    // Initialise widget
 *    $('#my-widget').widget('init', MyWidget);
 *
 *    // Initialise widget with custom options
 *    $('#my-widget').widget('init', MyWidget, {
 *       "color": "green"
 *    });
 * })
 * ```
 *
 * @alias jQuery,fn,widget
 *
 * @param {string} message Name of message
 * @param {string|object} widgetClass Class name or class reference
 * @param {string|object|array} [options] Widget options
 *
 * @returns {this}
 *
 * @see {@link module:capri/ui/Widget}
 *
 ****
 * Get widget instance
 *
 * @example "Get widget and invoke instance method"
 *
 * ```source
 * myWidget = $('#my-widget').widget();
 * myWidget.color('blue');
 * ```
 *
 * @returns {capri.ui.Widget|null} Widget instance associated with element
 *
 * @see {@link module:capri/ui/Widget}
 *
 ****
 * Send message to widget
 *
 * @example "Invoke widget method"
 *
 * ```source
 * result = $('#my-widget').widget('specialMethod', 1, 2, 3); // 6
 * ```
 *
 * @example "Detach widget from DOM element"
 *
 * ```source
 * $('#my-widget').widget('detach');
 * ```
 *
 * @example "Getter and setter methods"
 *
 * ```source
 * // Invoke "color" getter method
 * $('#my-widget').widget('color', 'green');
 * // Invoke "color" setter method
 * color = $('#my-widget').widget('color'); // green
 * ```
 *
 * @param {string} message Name of message
 * @param {mixed} [...]
 *
 * @returns {this}
 *
 * @see {@link module:capri/ui/Widget}
 */
$.fn.widget = function(message, a, b) {
	if (!message)
		return this.data('widget');

	return this.each(function() {
		var element = $(this);
		var widget;

		if (message === 'init') {
			a = capri.ns(a);

			// Verify that widget class extends capri `Widget`
			if (!a.is(exports))
				throw 'Widget must extend `capri.ui.Widget`';

			// Create widget object
			widget = new a(b || {});
			widget.attach(element);
		}
		else {
			widget = element.data('widget');
			widget[message].apply(widget, Array.prototype.slice.call(arguments, 1));
		}
	})
}

})