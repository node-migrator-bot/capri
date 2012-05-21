/**
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

var program = require('commander');

program
	.version('0.1.0')
	.option('-s, --source [path]', 'Specify one or more comma delimited script paths')
	.parse(process.argv);


// List of unit tests
var units = [
	'test-core',
	'test-namespace',
	'test-define',
	'test-oop',
	'test-error'
];

for (var i = 0; i < units.length; ++i)
	units[ i ] = __dirname + '/unit/' + units[ i ] + '.js';

// Prepare for unit testing
var qunit = require('qunit');
qunit.options.coverage = false;


// Prepare list of source files
var sources;

if (program.source !== undefined) {
	sources = [];

	program.source.split(/\s*[,]\s*/).forEach(function(src) {
		// Skip incompatible sources
		if (src.indexOf('/browser/') !== -1)
			return;
	
		sources.push(src);
	});
}
else {
	// Assume node sources...
	sources = [
		'./src/core',
		'./src/namespace',

		'./src/node/environment',
		'./src/node/module',

		'./src/define',
		'./src/oop',
		'./src/error'
	];
}

qunit.run({
	deps: sources.slice(0, sources.length - 1),
	code: sources[ sources.length - 1 ],
	tests: units
})