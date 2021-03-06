'use strict';
/* jshint node:true */
/* global describe, it */

var assert = require("assert");
var jsonAssert = require("..");

var DEBUG = false;

var basicThings = [
  null,
  true,
  false,
  0,
  1,
  "",
  "1",
  "null", [], {},
  [0],
  [1],
  [0, 0],
  [0, 1],
  //[1, 0], expect true
  "a", {
    a: 0
  }, {
    b: 0
  }, {
    a: 1
  }, {
    a: false
  }, {
    a: {
      b: {
        c: false
      }
    }
  }, {
    a: {
      b: {
        c: 0
      }
    }
  }, {
    a: []
  }, {
    a: [1]
  }
];

function check(src, dst, expectedResult) {
  if (DEBUG) {
    console.log('----\n', "expected(", expectedResult, ")\n", src, "\n", dst);
  }
  assert.equal(
    jsonAssert.isEqual(src, dst, true),
    expectedResult,
    "expected(" + expectedResult + ") " + JSON.stringify(src) + " " + JSON.stringify(dst)
  );
}

describe('json-assert', function() {
  describe('isEqual', function() {

    it('should have basic objects as different from each other', function() {
      var len, i, j, src, dst;

      len = basicThings.length;
      for (i = 0; i < len; i++) {
        src = basicThings[i];
        for (j = 0; j < len; j++) {

          // to make them different objects we can stringify then parse
          dst = basicThings[j];
          if (dst !== undefined) {
            dst = JSON.parse(JSON.stringify(dst));
          }

          var expectedResult = (i == j);
          check(src, dst, expectedResult);
        }
      }
    });

    it('should accept functions in the source', function() {
      var len, i, j, src, dst;

      len = basicThings.length;
      for (i = 0; i < len; i++) {
        src = basicThings[i];

        check({
          x: jsonAssert.dontCare
        }, {
          x: src
        }, true);

        check({
          x: jsonAssert.matchType(typeof src)
        }, {
          x: src
        }, true);

        check({
          x: jsonAssert.dontCare,
          y: jsonAssert.optional
        }, {
          x: src
        }, true);

        check({
          x: jsonAssert.dontCare,
          y: jsonAssert.optional
        }, {
          x: src,
          y: src
        }, true);

      }
    });

    it('should check for missing parts', function() {

      var expected = [{
        name: 'admin',
        isSpecial: true
      }, {
        name: 'everyone',
        isSpecial: true
      }, {
        name: 'testGroup',
        isSpecial: false,
        asdasdasd: 4 // extra param
      }];

      var actual = [{
        name: 'admin',
        isSpecial: true
      }, {
        name: 'everyone',
        isSpecial: true
      }, {
        name: 'testGroup',
        isSpecial: false
      }];

      check(expected, actual, false);

    });

    it("test numbers", function(){
        check([1,2,3],[2,1,3],true);
    });

    it("test non-object", function(){
        check([1,2,'a'],[2,'a',1],true);
    });

    it("test empty array",function(){
      check([],[],true);
    });

    it("test empty object",function(){
        check({},{},true)
    });

    it("test empty object array",function(){
        check([{}],[{}],true);
    });

    it("test obejct array",function(){
        check({c:[{b:""},{a:""}]},{c:[{a:""},{b:""}]},true);
    });

    it("test complex obejct",function(){
        check({c:[{b:""},3]},{c:[{b:""},4]},false);
    });
    it("test ownDefined function: case-insensitive", function(){
      check({a:jsonAssert.ownDefined("ABC", function(){
        return arguments[0].toLowerCase() == arguments[1].toLowerCase();
      })},{a:"abc"},true);
    });

    it("test ownDefined function: time format", function(){
      check({a:jsonAssert.ownDefined('2015-01-01T00:00:00',function(){
        return (new Date(arguments[0]).getTime() == new Date(arguments[1]).getTime());
      })},{a:"2015-01-01T00:00:00.000Z"},true);
    });
  });
});
