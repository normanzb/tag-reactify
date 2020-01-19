"use strict";

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var _renderToTextContent = _interopRequireDefault(require("../../tests/utils/renderToTextContent"));

var _chai = require("chai");

var _ = _interopRequireDefault(require("../"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Link(_ref) {
  var children = _ref.children;
  return _react["default"].createElement("a", null, children);
}

describe('TagReactify', function () {
  it('should reactify plain text into a renderable object', function () {
    var html = 'this is a test sentence.';
    var fragment = (0, _["default"])(html);
    var rendered = (0, _renderToTextContent["default"])(fragment);
    (0, _chai.expect)(rendered).to.be.equal(html);
  });
  it('should reactify plain text with tags into a renderable object', function () {
    var html = 'this is a test sentence. <a>test</a>';
    var fragment = (0, _["default"])(html);
    var rendered = (0, _renderToTextContent["default"])(fragment);
    (0, _chai.expect)(rendered).to.be.equal(html);
  });
  it('should reactify plain text with tags with replaced components', function () {
    var html = 'this is a test sentence. <link>test</link>';
    var fragment = (0, _["default"])(html, {
      link: Link
    });
    var rendered = (0, _server.renderToStaticMarkup)(fragment);
    (0, _chai.expect)(rendered).to.be.equal('this is a test sentence. <a>test</a>');
  });
  it('should reactify and replace components', function () {
    var html = 'this is a test sentence. <link>test</link>';
    var fragment = (0, _["default"])(html, {
      link: Link
    });
    var rendered = (0, _server.renderToStaticMarkup)(fragment);
    (0, _chai.expect)(rendered).to.be.equal('this is a test sentence. <a>test</a>');
  });
  it('should replace components even the tag name is a digit', function () {
    var html = 'this is a test sentence. <1>test</1>';
    var fragment = (0, _["default"])(html, {
      1: Link
    });
    var rendered = (0, _server.renderToStaticMarkup)(fragment);
    (0, _chai.expect)(rendered).to.be.equal('this is a test sentence. <a>test</a>');
  });
  it('should reactify with non-replacable tag untouched', function () {
    var html = 'this is a test sentence. <link>test<b> foo</b> bar</link>';
    var fragment = (0, _["default"])(html, {
      link: Link
    });
    var rendered = (0, _server.renderToStaticMarkup)(fragment);
    (0, _chai.expect)(rendered).to.be.equal('this is a test sentence. <a>test&lt;b&gt; foo&lt;/b&gt; bar</a>');
  });
  it('does not mind having 2 adjacent tags', function () {
    var html = 'cv<link1/><link2/>ink>';
    var fragment = (0, _["default"])(html, {
      link1: function link1() {
        return _react["default"].createElement("span", null, "foo");
      },
      link2: function link2() {
        return _react["default"].createElement("div", null, "bar");
      }
    });
    var rendered = (0, _server.renderToStaticMarkup)(fragment);
    (0, _chai.expect)(rendered).to.be.equal('cv<span>foo</span><div>bar</div>ink&gt;');
  });
  it('does not mind one broken tag is followed by a good tag', function () {
    var html = 'cv<link1></link<link2/>ink>';
    var fragment = (0, _["default"])(html, {
      link1: function link1() {
        return _react["default"].createElement("span", null, "foo");
      },
      link2: function link2() {
        return _react["default"].createElement("div", null, "bar");
      }
    });
    var rendered = (0, _server.renderToStaticMarkup)(fragment);
    (0, _chai.expect)(rendered).to.be.equal('cv&lt;link1&gt;&lt;/link<div>bar</div>ink&gt;');
  });
  it('does not mind people throw rubbish at it', function () {
    var html = 'cv<link>test< foo</b>ink>';
    var fragment = (0, _["default"])(html, {
      link: Link
    });
    var rendered = (0, _server.renderToStaticMarkup)(fragment);
    (0, _chai.expect)(rendered).to.be.equal('cv&lt;link&gt;test&lt; foo&lt;/b&gt;ink&gt;');
  });
  it('does not mind having some upper or lower cases', function () {
    var html = 'cv<LiNk>test</LiNk>adfj';
    var fragment = (0, _["default"])(html, {
      LiNk: Link
    });
    var rendered = (0, _server.renderToStaticMarkup)(fragment);
    (0, _chai.expect)(rendered).to.be.equal('cv<a>test</a>adfj');
  });
  it('does not mind having some self-closing tags', function () {
    var html = 'cv<ICloseItMySelf />adfj';
    var fragment = (0, _["default"])(html, {
      ICloseItMySelf: Link
    });
    var rendered = (0, _server.renderToStaticMarkup)(fragment);
    (0, _chai.expect)(rendered).to.be.equal('cv<a></a>adfj');
  });
  it('reserves line breaks', function () {
    var html = 'cv<link>t\r\nes\nt</link>ad\nfjnsdfns\rdfos';
    var fragment = (0, _["default"])(html, {
      link: Link
    });
    var rendered = (0, _server.renderToStaticMarkup)(fragment);
    (0, _chai.expect)(rendered).to.be.equal('cv<a>t<br/>es<br/>t</a>ad<br/>fjnsdfns<br/>dfos');
  });
});