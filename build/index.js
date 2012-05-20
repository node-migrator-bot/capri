/**
 * Entry point for Capri builder
 *
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

var path = require('path')
  ;

var version = '0.0.1';

// Process command line arguments
var args = {};

process.argv.forEach(function(val) {
	var parts = val.split(/\s*[=]\s*/);

	args[ parts[0] ] = parts.length === 2
		? parts[1]
		: true;
}, this)

// Assign default command line arguments
args['target']		= args['target']	|| 'browser';

args['base-dir']	= args['base-dir']	|| path.dirname(__dirname);
if (!/[\/\\]$/.test(args['base-dir']))
	args['base-dir'] += '/';

args['output']		= args['output']	|| __dirname + '/output/';


// Perform build for target
var Builder;

switch (args['target']) {
case 'browser':
	Builder = require('./browser/Builder');
	break;
}

if (!Builder) {
	console.error('Invalid build target');
	process.exit(1);
}

var builder = new Builder(version, args);
builder.build();

console.log('Build complete');