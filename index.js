var hasKey = require( "sc-haskey" ),
  merge = require( "sc-merge" ),
  omit = require( "sc-omit" ),
  extend = require( "./extend.johnresig.js" ),
  noop = function () {};

var extendify = function ( fn ) {

  var object,
    protos;

  fn = typeof fn === "function" || typeof fn === "object" ? fn : {};
  protos = fn.prototype || fn;
  object = merge( omit( protos, [ "constructor", "init" ] ) );
  object.init = hasKey( fn, "prototype.constructor", "function" ) ? fn.prototype.constructor : hasKey( fn, "init", "function" ) ? fn.init : typeof fn === "function" ? fn : noop;

  return extend( object );

};

module.exports = extendify;