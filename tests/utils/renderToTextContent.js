import { renderToStaticMarkup } from 'react-dom/server'
import { JSDOM } from 'jsdom'

var { window } = new JSDOM()
var { document } = window

export default function (renderable) {
  var html = renderToStaticMarkup(renderable)
  var div = document.createElement('div')
  div.innerHTML = html;
  return div.textContent;
}