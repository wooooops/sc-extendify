/**
 * Dejavu
 */

// module.exports = require( "dejavu" ).Class;

/**
 * John Resig's
 */

var hasKey = require( "sc-haskey" ),
  merge = require( "sc-merge" ),
  omit = require( "sc-omit" );

var noop = function () {};

var initializing = false,
  fnTest = /xyz/.test( function () {
    xyz;
  } ) ? /\b_super\b/ : /.*/;

// The base Class implementation (does nothing)
var Class = function () {};

// Create a new Class that inherits from this class
Class.extend = function ( prop ) {
  var _super = this.prototype;

  // Instantiate a base class (but only create the instance,
  // don't run the init constructor)
  initializing = true;
  var prototype = new this();
  initializing = false;

  // Copy the properties over onto the new prototype
  for ( var name in prop ) {
    // Check if we're overwriting an existing function
    prototype[ name ] = typeof prop[ name ] == "function" &&
      typeof _super[ name ] == "function" && fnTest.test( prop[ name ] ) ?
      ( function ( name, fn ) {
      return function () {
        var tmp = this._super;

        // Add a new ._super() method that is the same method
        // but on the super-class
        this._super = _super[ name ];

        // The method only need to be bound temporarily, so we
        // remove it when we're done executing
        var ret = fn.apply( this, arguments );
        this._super = tmp;

        return ret;
      };
    } )( name, prop[ name ] ) :
      prop[ name ];
  }

  // The dummy class constructor
  function Class() {
    // All construction is actually done in the init method
    if ( !initializing && this.init )
      this.init.apply( this, arguments );
  }

  // Populate our constructed prototype object
  Class.prototype = prototype;

  // Enforce the constructor to be what we expect
  Class.prototype.constructor = Class;

  // And make this class extendable
  Class.extend = arguments.callee;

  return Class;

};

var extendify = function ( fn ) {

  var object,
    protos;

  fn = typeof fn === "function" || typeof fn === "object" ? fn : {};
  protos = fn.prototype || fn;
  object = merge( {}, omit( protos, [ "constructor", "init" ] ) );
  object.init = hasKey( fn, "prototype.constructor", "function" ) ? fn.prototype.constructor : hasKey( fn, "init", "function" ) ? fn.init : typeof fn === "function" ? fn : noop;

  return Class.extend( object );

};

module.exports = extendify;

/**
 * Coffee Script
 */

// var __extends = function ( child, parent ) {

//   for ( var key in parent ) {
//     if ( Object.hasOwnProperty.call( parent, key ) ) {
//       child[ key ] = parent[ key ];
//     }
//   }

//   var ctor = function () {
//     this.constructor = child;
//   };
//   ctor.prototype = parent.prototype;
//   child.prototype = new ctor;
//   child.__super__ = parent.prototype;

//   Object.keys( parent.prototype ).forEach( function ( prototypeKey ) {
//     child.prototype[ prototypeKey ].prototype._super = function () {
//       // prototypeKey = prototypeKey === "init" ? "constructor" : prototypeKey;
//       console.log( "prototypeKey", prototypeKey );
//       // parent.prototype[ prototypeKey ].apply( this, arguments );
//       // parent.prototype[ prototypeKey ].apply( parent.prototype );
//     };

//   } );

//   return child;

// };

// var extend = function ( ParentClass ) {

//   ParentClass.extend = function ( obj ) {

//     var SubClass = ( function ( _super ) {

//       var constructing = false;

//       __extends( SubClass, _super );

//       function SubClass() {
//         if ( !constructing ) {
//           obj.init.apply( this, arguments );
//         }
//         // return SubClass.__super__.constructor.apply( this, arguments );
//         // if ( typeof obj.init === "function" ) {
//         //   console.log( 1 );
//         //   obj.init.apply( this, arguments );
//         // } else {
//         //   console.log( 2 );
//         //   SubClass.__super__.constructor.apply( this, arguments );
//         // }
//       }

//       // SubClass.prototype.constructor = obj.init;

//       Object.keys( obj ).forEach( function ( objKey ) {
//         if ( obj.hasOwnProperty( objKey ) && objKey !== "init" ) {
//           SubClass.prototype[ objKey ] = obj[ objKey ];
//         }
//       } );

//       return extend( SubClass );

//     } )( ParentClass );

//     return SubClass;

//   }

//   return ParentClass;

// }

// module.exports = extend;

/**
 * Pierre's
 */

/*jshint loopfunc: true, eqeqeq: false */
// var ctor = function () {};

// var extend = function ( obj ) {
//   Array.prototype.slice.call( arguments, 1 ).forEach( function ( source ) {
//     if ( source ) {
//       for ( var prop in source ) {
//         if ( source.hasOwnProperty( prop ) ) {
//           obj[ prop ] = source[ prop ];
//         }
//       }
//     }
//   } );
//   return obj;
// }

// var inherits = function ( parent, protoProps, staticProps ) {
//   var child,
//     _super = parent.prototype,
//     fnTest = /xyz/.test( function () {
//       xyz;
//     } ) ? /\b_super\b/ : /.*/;

//   // The constructor function for the new subclass is either defined by you
//   // (the "constructor" property in your `extend` definition), or defaulted
//   // by us to simply call the parent's constructor.
//   if ( protoProps && protoProps.hasOwnProperty( "constructor" ) ) {
//     child = protoProps.constructor;
//   } else {
//     child = function () {
//       parent.apply( this, arguments );
//     };
//   }

//   // Inherit class (static) properties from parent.
//   extend( child, parent );

//   // Set the prototype chain to inherit from `parent`, without calling
//   // `parent`'s constructor function.
//   ctor.prototype = parent.prototype;
//   child.prototype = new ctor();

//   // Add prototype properties (instance properties) to the subclass,
//   // if supplied.
//   if ( protoProps ) {
//     extend( child.prototype, protoProps );

//     // Copy the properties over onto the new prototype
//     for ( var name in protoProps ) {
//       // Check if we're overwriting an existing function
//       if ( typeof protoProps[ name ] == "function" && typeof _super[ name ] == "function" /*&& fnTest.test( protoProps[ name ] )*/ ) {
//         child.prototype[ name ] = ( function ( name, fn ) {
//           return function () {
//             var tmp = this._super;

//             // Add a new ._super() method that is the same method
//             // but on the super-class
//             this._super = _super[ name ];

//             // The method only need to be bound temporarily, so we
//             // remove it when we're done executing
//             var ret = fn.apply( this, arguments );
//             this._super = tmp;

//             return ret;
//           };
//         } )( name, protoProps[ name ] );
//       }
//     }
//   }

//   // Add static properties to the constructor function, if supplied.
//   if ( staticProps ) {
//     extend( child, staticProps );
//   }

//   // Correctly set child's `prototype.constructor`.
//   child.prototype.constructor = child;

//   // Set a convenience property in case the parent's prototype is needed later.
//   child.__super__ = parent.prototype;

//   return child;
// }

// var inerith = function ( protoProps, classProps ) {
//   var child = inherits( this, protoProps, classProps );
//   child.extend = this.extend;
//   return child;
// };

// module.exports = inerith;