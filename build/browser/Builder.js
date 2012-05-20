/**
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */

var path	= require('path')
  , fs		= require('fs')
  , uglify	= require('uglify-js')
  ;

var Builder = function(version, args) {
	this.version	= version;
	this.args		= args;

	var parts = ( args['parts'] || 'core,widget-core' );
	if (parts === 'all')
		parts = 'core,jquery,widget-core';
	this.parts = parts.split(/\s*[,]\s*/);
}

Builder.prototype.sourcePath = function(path) {
	return this.args['base-dir'] + ( path || '' );
}

Builder.prototype.outputPath = function(path) {
	return this.args['output'] + ( path || '' );
}

Builder.prototype.getStub = function(min) {
	var stub = min
		? fs.readFileSync(this.sourcePath('src/browser/stub.min.js'), 'utf8') + '\n'
		: fs.readFileSync(this.sourcePath('src/browser/stub.js'), 'utf8') + '\n\n'
		;

	stub = stub.replace('{{VERSION}}', this.version);

	return stub;
}

Builder.prototype.build = function() {
	// Select sources
	var sources = this.filterSources();
	// Combine source files
	var combined = this.combineSources(sources);

	// Create output directory?
	if (!path.existsSync(this.outputPath()))
		fs.mkdirSync(this.outputPath(), 0755);

	// Output combined file
	var out = this.getStub(false) + combined;
	if (this.parts.indexOf('jquery') !== -1) {
		// Prepend jQuery source to output
		out = fs.readFileSync(this.sourcePath('src/browser/jquery/jquery-1.7.2.js'), 'utf8') + '\n\n' + out;
	}
	fs.writeFileSync(this.outputPath('capri.js'), out, 'utf8');

	// Compress output source
	var compressed = this.getStub(true) + this.compressSource(combined);
	if (this.parts.indexOf('jquery') !== -1) {
		// Prepend jQuery source to output
		compressed = fs.readFileSync(this.sourcePath('src/browser/jquery/jquery-1.7.2.min.js'), 'utf8') + '\n' + compressed;
	}
	// Output compressed file
	fs.writeFileSync(this.outputPath('capri.min.js'), compressed, 'utf8');
}

Builder.prototype.filterSources = function() {
	var sources = [];

	sources.push('src/browser/compat.js');

	sources.push('src/core.js');
	sources.push('src/namespace.js');

	sources.push('src/browser/environment.js');
	sources.push('src/browser/module.js');
	sources.push('src/define.js');
	sources.push('src/oop.js');
	sources.push('src/error.js');


	if (this.parts.indexOf('jquery') !== -1) {
		sources.push('src/browser/jquery/jquery-module.js');
	}

	if (this.parts.indexOf('widget-core') !== -1) {
		sources.push([ 'src/browser/ui/Widget.js', 'capri/ui/Widget' ]);
	}

	return sources;
}

Builder.prototype.combineSources = function(sources) {
	var combined = '';

	sources.forEach(function(path) {
		var moduleName;

		// Use explicit module definitions?
		if (path.constructor === Array.prototype.constructor) {
			moduleName = path[1];
			path = path[0];
		}

		var source = fs.readFileSync(this.sourcePath(path), 'utf8') + ';\n\n';

		// Determine module name
		if (moduleName !== undefined)
			source = source.replace(/capri\s*\.\s*module\s*\(\s*function\s*\(/, 'capri.module("' + moduleName + '",function(');

		combined += source;
	}, this)

	return combined;
}

Builder.prototype.compressSource = function(source) {
	// Parse code and get initial AST
	var ast = uglify.parser.parse(source);

	// Get new AST with mangled names
	ast = uglify.uglify.ast_mangle(ast);
	// Get AST with compression optimizations
	ast = uglify.uglify.ast_squeeze(ast);

	return uglify.uglify.gen_code(ast);
}

module.exports = Builder;