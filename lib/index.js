"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _react = _interopRequireWildcard(require("react"));

var _parse = _interopRequireDefault(require("./parse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var LINE_BREAK_MARKUP = '<__ReactifyBreak__></__ReactifyBreak__>';

function Empty() {}

function __ReactifyBreak__() {
  return _react["default"].createElement("br", null);
}

function reactifyString(str) {
  return _react["default"].createElement(_react.Fragment, null, str);
}

function reactifyComponent(obj, components) {
  var TheComp = components[obj.tag];

  if (!TheComp) {
    return reactifyString(obj.source);
  }

  return _react["default"].createElement(TheComp, {}, obj.children ? reactifyASTArray(obj.children, components) : null);
}

function reactifyEach(obj, components) {
  if (typeof obj === 'string') {
    return reactifyString(obj);
  } else {
    return reactifyComponent(obj, components);
  }
}

function reactifyASTArray(ast, components) {
  return _react["default"].createElement(_react.Fragment, null, ast.map(function (itm, idx) {
    return _react["default"].createElement(_react.Fragment, {
      key: idx
    }, reactifyEach(itm, components));
  }));
}

function reactify(str, components) {
  str = str.replace(/\r\n/g, LINE_BREAK_MARKUP).replace(/\r/g, LINE_BREAK_MARKUP).replace(/\n/g, LINE_BREAK_MARKUP).replace(/^\n*?/g, '').replace(/\n*?$/g, '');
  var ast = (0, _parse["default"])(str);
  return reactifyASTArray(ast, components);
}

function _default(html) {
  var components = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  components['__ReactifyBreak__'] = __ReactifyBreak__;
  var fragment = reactify(html, components);
  Empty.prototype = fragment;
  var attributeFriendlyFragment = new Empty();

  attributeFriendlyFragment.toString = function () {
    return html;
  };

  return attributeFriendlyFragment;
}