/** 
 * Hactor = Hapi Actor
 *
 * JavaScript Inheritance created for Hapi App actors
 * Node:
 * This is variation of John Resig's Simple Javascript Inheritance
 * http://ejohn.org/blog/simple-javascript-inheritance/ 
 *  
 * MIT Licensed.
 * 
 * TBD:
 *  - function cloning -> http://stackoverflow.com/questions/1833588/javascript-clone-a-function
 */
// Inspired by base2 and Prototype
var initializing = false, 
	fnTest = /\b_super\b/,
// The base Class implementation (does nothing)
	Class  = module.exports = function () {};

// Create a new Class that inherits from this class
Class.extend = function(protoProperties, staticProperties) {
	var _super = this.prototype;


	// Instantiate a base class (but only create the instance,
	// don't run the init constructor)
	initializing = true;
	var prototype = new this();
	initializing = false;

	// Copy the properties over onto the new prototype
	if (protoProperties !== undefined) {
		if (typeof(protoProperties) !== "object" || Array.isArray(protoProperties)) {
			throw new Error('argument: properties must be an object');
		}

		for (var name in protoProperties) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof protoProperties[name] == "function" &&
				typeof _super[name] == "function" && fnTest.test(protoProperties[name]) ?
				(function (name, fn) {
					return function () {
						var tmp = this._super;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _super[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, protoProperties[name]) :
				protoProperties[name];
		}
	}
	
	// The dummy class constructor
	function Class() {
		// All construction is actually done in the init method
		if ( !initializing && this.constructor )
			this.constructor.apply(this, arguments);
	}

	// Expose custom DAO methods on Model Class
	if (staticProperties !== undefined) {
		if (typeof(staticProperties) !== "object" || Array.isArray(staticProperties)) {
			throw new Error('argument: staticProperties must be an object');
		}
		
		for (var staticName in staticProperties) {
			if (staticProperties.hasOwnProperty(staticName)) {
				Class[staticName] = staticProperties[staticName];
			}
		}
	}

	// Populate our constructed prototype object
	Class.prototype = prototype;

	// And make this class extendable
	Class.extend = arguments.callee;

	return Class;
};