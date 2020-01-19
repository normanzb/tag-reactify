"use strict";

var _chai = require("chai");

var _parse = _interopRequireDefault(require("../parse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe('Reactify', function () {
  describe('parse', function () {
    it('should parse plain text into ast', function () {
      var ast = (0, _parse["default"])('this is a test sentence.');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql(['this is a test sentence.']);
    });
    it('should parse plain text with tag into ast', function () {
      var ast = (0, _parse["default"])('this is a test sentence. <a>test</a>');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql(['this is a test sentence. ', {
        tag: 'a',
        children: ['test'],
        source: '<a>test</a>'
      }]);
    });
    it('should parse tag into ast', function () {
      var ast = (0, _parse["default"])('<a>test</a>');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql([{
        tag: 'a',
        children: ['test'],
        source: '<a>test</a>'
      }]);
    });
    it('should parse tag with plain text into ast', function () {
      var ast = (0, _parse["default"])('<a>test</a> here is another test sentence');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql([{
        tag: 'a',
        children: ['test'],
        source: '<a>test</a>'
      }, ' here is another test sentence']);
    });
    it('should parse nested tags into ast', function () {
      var ast = (0, _parse["default"])('<a>test<b>foo</b>bar</a> here is another test sentence');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql([{
        tag: 'a',
        children: ['test', {
          tag: 'b',
          children: ['foo'],
          source: '<b>foo</b>'
        }, 'bar'],
        source: '<a>test<b>foo</b>bar</a>'
      }, ' here is another test sentence']);
    });
    it('should parse self-closing tags into ast', function () {
      var ast = (0, _parse["default"])('<a>test<b />bar</a> here is another<br/> test sentence');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql([{
        tag: 'a',
        children: ['test', {
          tag: 'b',
          children: null,
          source: '<b />'
        }, 'bar'],
        source: '<a>test<b />bar</a>'
      }, ' here is another', {
        tag: 'br',
        children: null,
        source: '<br/>'
      }, ' test sentence']);
    });
    it('should trim space in self-closing tag but reserve the space in source', function () {
      var ast = (0, _parse["default"])('test<b />bar');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql(['test', {
        tag: 'b',
        children: null,
        source: '<b />'
      }, 'bar']);
    });
    it('should parse tag without text inside', function () {
      var ast = (0, _parse["default"])('test<link></link>bar');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql(['test', {
        tag: 'link',
        children: null,
        source: '<link></link>'
      }, 'bar']);
    });
    it('does not mind having digits as tag name', function () {
      var ast = (0, _parse["default"])('test<1>aaa</1>bar');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql(['test', {
        tag: '1',
        children: ['aaa'],
        source: '<1>aaa</1>'
      }, 'bar']);
    });
    it('should parse adjacent tags just fine', function () {
      var ast = (0, _parse["default"])('test<link1></link1><link2>a</link2>bar');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql(['test', {
        tag: 'link1',
        children: null,
        source: '<link1></link1>'
      }, {
        tag: 'link2',
        children: ['a'],
        source: '<link2>a</link2>'
      }, 'bar']);
    });
    it('should not throw exception when the tag does not match', function () {
      var ast = (0, _parse["default"])('<a>test<b>foo</b>bar here is another test sentence');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql(['<a>test', {
        tag: 'b',
        children: ['foo'],
        source: '<b>foo</b>'
      }, 'bar here is another test sentence']);
    });
    it('should leave unmatch tag as part of literal', function () {
      var ast = (0, _parse["default"])('test<b>foo</b>bar</a> here is another test sentence');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql(['test', {
        tag: 'b',
        children: ['foo'],
        source: '<b>foo</b>'
      }, 'bar</a> here is another test sentence']);
    });
    it('should leave tag with attribute unchanged', function () {
      var ast = (0, _parse["default"])('<a test="2">test<b>foo</b>bar</a> here is another test sentence');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql(['<a test="2">test', {
        tag: 'b',
        children: ['foo'],
        source: '<b>foo</b>'
      }, 'bar</a> here is another test sentence']);
    });
    it('does not mind having some line breaks in between the tags', function () {
      var ast = (0, _parse["default"])('<a>test\r\nfoo\nbar<b>f\noo</b>bar</a> here is ano\nther test sentence');
      (0, _chai.expect)(ast).to.be.an["instanceof"](Array);
      (0, _chai.expect)(ast).to.be.deep.eql([{
        tag: 'a',
        children: ['test\r\nfoo\nbar', {
          tag: 'b',
          children: ['f\noo'],
          source: '<b>f\noo</b>'
        }, 'bar'],
        source: '<a>test\r\nfoo\nbar<b>f\noo</b>bar</a>'
      }, ' here is ano\nther test sentence']);
    }); // This test is to cover issue in firefox:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1361856
    // We can remove this test when firefox supports it

    it('does not mind when the browser/env does not support flag s', function () {
      var RegExpExec = global.RegExp.prototype.exec;

      global.RegExp.prototype.exec = function () {
        if (this.flags.indexOf('s') >= 0) {
          throw new Error('Flag s is not supported by firefox so we dont want it here');
        }

        return RegExpExec.apply(this, arguments);
      };

      var err;

      try {
        (0, _parse["default"])('<a>test\r\nfoo\nbar<b>f\noo</b>bar</a>');
      } catch (ex) {
        err = ex;
      } finally {
        global.RegExp.prototype.exec = RegExpExec;
      }

      (0, _chai.expect)(err).to.be.equal(undefined);
    });
  });
});