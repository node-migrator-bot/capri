/**
 * @copyright (c) 2010-2012 Rotorz Limited
 * @license BSD and GPL licenses ({@link http://capri.rotorz.com/license.html})
 * @author Lea Hayes <lea@rotorz.com>
 *
 * @see {@link http://capri.rotorz.com}
 */
require('./src/core');
require('./src/namespace');

require('./src/node/environment');
require('./src/node/module');

require('./src/define');
require('./src/oop');
require('./src/error');

module.exports = capri;