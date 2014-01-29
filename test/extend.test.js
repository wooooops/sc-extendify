var should = require( "should" ),
  extendify = require( ".." ),
  guid = require( "sc-guid" );

describe( "extendify", function () {

  it( "should extend a function with the extendify base class", function () {

    var constructorResult,
      Base = function () {
        constructorResult = "baseConstructor";
      };

    Base.prototype.__base = true;
    Base = extendify( Base );

    var base = new Base();

    Base.prototype.should.have.a.property( "constructor" ).and.be.an.instanceof( Function );
    Base.prototype.should.have.a.property( "init" ).and.be.an.instanceof( Function );
    Base.should.have.a.property( "extend" ).and.be.an.instanceof( Function );
    Base.prototype.should.have.a.property( "__base", true ).and.be.an.instanceof( Boolean );
    should.strictEqual( constructorResult, "baseConstructor" );

  } );

  it( "should extend an object with the extendify base class", function () {

    var constructorResult,
      Base = extendify( {
        init: function () {
          constructorResult = "baseConstructor";
        },
        __base: true
      } );

    var base = new Base();

    Base.prototype.should.have.a.property( "constructor" ).and.be.an.instanceof( Function );
    Base.prototype.should.have.a.property( "init" ).and.be.an.instanceof( Function );
    Base.should.have.a.property( "extend" ).and.be.an.instanceof( Function );
    Base.prototype.should.have.a.property( "__base", true ).and.be.an.instanceof( Boolean );
    should.strictEqual( constructorResult, "baseConstructor" );

  } );

  it( "should handle an object with no constructor defined", function () {

    var Base = extendify( {
      __base: true
    } );

    var base = new Base();

    Base.prototype.should.have.a.property( "constructor" ).and.be.an.instanceof( Function );
    Base.prototype.should.have.a.property( "init" ).and.be.an.instanceof( Function );
    Base.should.have.a.property( "extend" ).and.be.an.instanceof( Function );
    Base.prototype.should.have.a.property( "__base", true ).and.be.an.instanceof( Boolean );

  } );

  describe( "given multiple levels of inhertiance", function () {

    Base = extendify();

    var Member = Base.extend( {
      init: function () {
        this._super();
        this.id = guid.generate();
      }
    } );

    var Person = Member.extend( {
      init: function ( options ) {
        options = typeof options === "object" ? options : {};
        this.name = options.name;
        this._super( options );
      },
      username: "",
      email: ""
    } );

    var Guest = Person.extend( {
      guest: true
    } );

    var VipGuest = Person.extend( {
      vip: true,
    } );

    it( "should handle overriding methods and allow super calls", function () {

      var member = new Member(),
        person = new Person( {
          name: "David"
        } ),
        guest = new Guest();

      member.should.be.an.instanceof( Base );
      person.should.be.an.instanceof( Member ).and.be.an.instanceof( Base );
      guest.should.be.an.instanceof( Person ).and.be.an.instanceof( Member ).and.be.an.instanceof( Base );

      member.should.have.a.property( "id" );
      person.should.have.a.property( "id" );
      guest.should.have.a.property( "id" );

      member.should.not.have.a.property( "email" );
      person.should.have.a.property( "email" );
      guest.should.have.a.property( "email" );

      member.should.not.have.a.property( "username" );
      person.should.have.a.property( "username" );
      guest.should.have.a.property( "username" );

      member.should.not.have.a.property( "name" );
      person.should.have.a.property( "name", "David" );
      guest.should.have.a.property( "name", undefined );

      member.should.not.have.a.property( "guest" );
      person.should.not.have.a.property( "guest" );
      guest.should.have.a.property( "guest", true );

    } );

    it( "should pass arguments up the inheritance tree", function () {

      var member = new Member(),
        david = new Person( {
          name: "David"
        } ),
        guest = new Guest( {
          name: "Mr Guest"
        } ),
        vipGuest = new VipGuest( {
          name: "Vip Guest"
        } );

      guest.should.have.a.property( "name", "Mr Guest" );
      vipGuest.should.have.a.property( "name", "Vip Guest" );

    } );
  } );
} );