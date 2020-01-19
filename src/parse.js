/*
    A simple parser that parse translation sentences with <tags></tags> into AST
*/
const ALLOWED_TAG_CHARS = '[_a-zA-Z0-9]*?';
const REGEX_TEXT = new RegExp(
  `[\\s\\S]*?(?=(<(${ALLOWED_TAG_CHARS})>[\\s\\S]*?</\\2>|<(${ALLOWED_TAG_CHARS})\\s*?/>|$))`, 
  'g');
const REGEX_TAG = new RegExp(
  `(<(${ALLOWED_TAG_CHARS})>([\\s\\S]*?)</\\2>|<(${ALLOWED_TAG_CHARS})\\s*?/>)`, 
  'g');
const EXPECT_TEXT = 0;
const EXPECT_TAG = 1;

export default function parse(input) {
  let expect = EXPECT_TEXT;
  let look4;
  let extraction;
  let lastIndex = 0;
  let root = [];
  let ast = root;

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

    let childrenInput
    let tag

    switch (expect) {
    case EXPECT_TEXT:
      expect = EXPECT_TAG;
      if (
        extraction[0] && 
        extraction[0] !== '') {
        ast.push(extraction[0]);    
      }
      break;
    case EXPECT_TAG:
      expect = EXPECT_TEXT;
      childrenInput = extraction[3]
      tag = extraction[2] || extraction[4]

      if (!tag) {
        throw new Error('Unexpected error, tag cannot be found')
      }

      tag = tag.trim();

      ast.push({
        tag: tag,
        children: childrenInput?parse(childrenInput):null,
        source: extraction[0]
      });
      break;
    default:
      throw new Error('Unexpected');
    }
  } 
  while (extraction && lastIndex < input.length);

  return root;
}