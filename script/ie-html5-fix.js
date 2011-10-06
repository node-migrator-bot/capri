/*!
 * Copyright (c) 2010-2011 Rotorz Limited. All rights reserved.
 * License:	GNU/GPLv2
 * Author:	Lea Hayes <lea@rotorz.com>
 * Website:	http://caprice.rotorz.com
*/
(function() {
	var html5Elements = {
		"article":		{ "display": "block"	},
		"aside":		{ "display": "block"	},
		"audio":		{ "display": "block"	},
		"canvas":		{ "display": "block"	},
		"command":		{ "display": "inline"	},
		"datalist":		{ "display": "block"	},
		"details":		{ "display": "block"	},
		"embed":		{ "display": "block"	},
		"figcaption":	{ "display": "block"	},
		"figure":		{ "display": "block"	},
		"footer":		{ "display": "block"	},
		"header":		{ "display": "block"	},
		"hgroup":		{ "display": "block"	},
		"keygen":		{ "display": "block"	},
		"mark":			{ "display": "inline"	},
		"meter":		{ "display": "inline"	},
		"nav":			{ "display": "block"	},
		"output":		{ "display": "block"	},
		"progress":		{ "display": "inline"	},
		"rp":			{ "display": "inline"	},
		"rt":			{ "display": "inline"	},
		"ruby":			{ "display": "block"	},
		"section":		{ "display": "block"	},
		"source":		{ "display": "block"	},
		"summary":		{ "display": "block"	},
		"time":			{ "display": "inline"	},
		"video":		{ "display": "block"	},
		"wbr":			{ "display": "inline"	}
	};

	var html5DefaultCSS = '';
	for (var el in html5Elements) {
		// Fix element non-detection bug in IE6-8.
		document.createElement(el);
		// Add default CSS styles for HTML5 elements.
		html5DefaultCSS += el + '{';
		for (var style in html5Elements[el])
			html5DefaultCSS += style + ':' + html5Elements[el][style] + ';';
		html5DefaultCSS += '}';
	}

	// Create style element:
	// http://www.phpied.com/dynamic-script-and-style-elements-in-ie/
	var ss1 = document.createElement('style');
	ss1.setAttribute('type', 'text/css');
	if (ss1.styleSheet) {   // IE
		ss1.styleSheet.cssText = html5DefaultCSS;
	} else {                // the world
		var tt1 = document.createTextNode(html5DefaultCSS);
		ss1.appendChild(tt1);
	}
	var hh1 = document.getElementsByTagName('head')[0];
	hh1.appendChild(ss1);
})();