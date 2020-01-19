import React, { Fragment } from 'react';
import parse from './parse';

const LINE_BREAK_MARKUP = '<__ReactifyBreak__></__ReactifyBreak__>';

function Empty() {}

function __ReactifyBreak__() {
  return <br />
}

function reactifyString(str) {
  return <Fragment>
    {str}
  </Fragment>
}

function reactifyComponent(obj, components) {
  var TheComp = components[obj.tag]
  if (
    !TheComp
  ) {
    return reactifyString(obj.source)
  }

  return React.createElement(
    TheComp, 
    {}, 
    obj.children?
      reactifyASTArray(obj.children, components):null
  )
}

function reactifyEach(obj, components) {
  if (typeof obj === 'string') {
    return reactifyString(obj)
  } else {
    return reactifyComponent(obj, components)
  }
}

function reactifyASTArray(ast, components) {
  return <Fragment>
    {ast.map(
      (itm, idx) => <Fragment key={idx}>
        {reactifyEach(itm, components)}
      </Fragment>
    )}
  </Fragment>
}

function reactify(str, components) {
  str = str
    .replace(/\r\n/g, LINE_BREAK_MARKUP)
    .replace(/\r/g, LINE_BREAK_MARKUP)
    .replace(/\n/g, LINE_BREAK_MARKUP)
    .replace(/^\n*?/g, '')
    .replace(/\n*?$/g, '')
  var ast = parse(str);
  return reactifyASTArray(ast, components)
}

export default function (html, components = {}) {
  components['__ReactifyBreak__'] = __ReactifyBreak__
  let fragment = reactify(html, components)
  Empty.prototype = fragment
  let attributeFriendlyFragment = new Empty()
  attributeFriendlyFragment.toString = function() {
    return html
  }
  return attributeFriendlyFragment
}