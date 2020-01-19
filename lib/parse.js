"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parse;

/*
    A simple parser that parse translation sentences with <tags></tags> into AST
*/
var ALLOWED_TAG_CHARS = '[_a-zA-Z0-9]*?';
var REGEX_TEXT = new RegExp("[\\s\\S]*?(?=(<(".concat(ALLOWED_TAG_CHARS, ")>[\\s\\S]*?</\\2>|<(").concat(ALLOWED_TAG_CHARS, ")\\s*?/>|$))"), 'g');
var REGEX_TAG = new RegExp("(<(".concat(ALLOWED_TAG_CHARS, ")>([\\s\\S]*?)</\\2>|<(").concat(ALLOWED_TAG_CHARS, ")\\s*?/>)"), 'g');
var EXPECT_TEXT = 0;
var EXPECT_TAG = 1;

function parse(input) {
  var expect = EXPECT_TEXT;
  var look4;
  var extraction;
  var lastIndex = 0;
  var root = [];
  var ast = root;

  do {
    switch (expect) {
      case EXPECT_TEXT:
        look4 = REGEX_TEXT;
        break;

      case EXPECT_TAG:
        look4 = REGEX_TAG;
        break;

      default:
        throw new Error('Unexpected');
    }

    look4.lastIndex = lastIndex;
    extraction = look4.exec(input);

    if (!extraction) {
      break;
    }

    lastIndex = look4.lastIndex;
    var childrenInput = void 0;
    var tag = void 0;

    switch (expect) {
      case EXPECT_TEXT:
        expect = EXPECT_TAG;

        if (extraction[0] && extraction[0] !== '') {
          ast.push(extraction[0]);
        }

        break;

      case EXPECT_TAG:
        expect = EXPECT_TEXT;
        childrenInput = extraction[3];
        tag = extraction[2] || extraction[4];

        if (!tag) {
          throw new Error('Unexpected error, tag cannot be found');
        }

        tag = tag.trim();
        ast.push({
          tag: tag,
          children: childrenInput ? parse(childrenInput) : null,
          source: extraction[0]
        });
        break;

      default:
        throw new Error('Unexpected');
    }
  } while (extraction && lastIndex < input.length);

  return root;
}