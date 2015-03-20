JSON Assert
===========

This program checks that a javascript object matches another. The main use case is for use in testing a JSON API.

The difference between this and [_.isEqual](http://underscorejs.org/#isEqual) is that jsonAssert accepts a function which will run that can perform addition checks. See the examples below.

The difference between this and [JSON schema](http://json-schema.org/) is that jsonAssert is less verbose, but it is also less flexible.


## Installation


    npm install jsonAssert --save


## Tests


    npm test


## Usage


    var ja = require('jsonAssert');

    // basic things must match
    ja.isValid({ a: 3}, { b: 4}); // false
    ja.isValid({ a: 3}, { a: 3}); // true

    // we don't care what the value is as long as it exists.
    ja.isValid({ a: ja.dontCare }, { a: 3}); // true

    // it must exist and match the type (typeof)
    ja.isValid({ a: ja.matchType('string') }, { a: 4}); // false
    ja.isValid({ a: ja.matchType('string') }, { a: "4"}); // true

    // we don't care if it exists or not
    ja.isValid({ a: ja.optional }, { a: 4 }); // true
    ja.isValid({ a: ja.optional }, { }); // true


Here is a more realistic example.


    var ja = require('jsonAssert');
    var request = require('request');

    function testAjax(url, expected) {
      request(url, function (error, response, body) {
        assert(!error);
        assert.equal(response.statusCode, 200);
        assert(ja.isValid(expected, JSON.parse(body)));
      });
    }

    testAjax('http://api.test.com', {
      name: "bob",
      age: 45,
      lastLogin: ja.matchType('string')
    });


## Contributing

Make sure your code:

- has been run through [js beautifier](http://jsbeautifier.org/)
- passes [js hint](http://jshint.com/)
- has tests written for all new code
- that all tests pass

Then submit a pull request.
