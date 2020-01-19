import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import renderToTextContent from '../../tests/utils/renderToTextContent'
import { expect } from 'chai'
import TagReactify from '../'

function Link({children}) {
  return <a>
    {children}
  </a>;
}

describe('TagReactify', () => {

  it('should reactify plain text into a renderable object', () => {
    var html = 'this is a test sentence.'
    var fragment = TagReactify(html)
    var rendered = renderToTextContent(fragment);
    expect(rendered).to.be.equal(html)
  })

  it('should reactify plain text with tags into a renderable object', () => {
    var html = 'this is a test sentence. <a>test</a>'
    var fragment = TagReactify(html)
    var rendered = renderToTextContent(fragment);
    expect(rendered).to.be.equal(html)
  })

  it('should reactify plain text with tags with replaced components', () => {
    var html = 'this is a test sentence. <link>test</link>'
    var fragment = TagReactify(html, {
      link: Link
    })
    var rendered = renderToStaticMarkup(fragment);
    expect(rendered).to.be.equal('this is a test sentence. <a>test</a>')
  })

  it('should reactify and replace components', () => {
    var html = 'this is a test sentence. <link>test</link>'
    var fragment = TagReactify(html, {
      link: Link
    })
    var rendered = renderToStaticMarkup(fragment);
    expect(rendered).to.be.equal('this is a test sentence. <a>test</a>')
  })

  it('should replace components even the tag name is a digit', () => {
    var html = 'this is a test sentence. <1>test</1>'
    var fragment = TagReactify(html, {
      1: Link
    })
    var rendered = renderToStaticMarkup(fragment);
    expect(rendered).to.be.equal('this is a test sentence. <a>test</a>')
  })

  it('should reactify with non-replacable tag untouched', () => {
    var html = 'this is a test sentence. <link>test<b> foo</b> bar</link>'
    var fragment = TagReactify(html, {
      link: Link
    })
    var rendered = renderToStaticMarkup(fragment);
    expect(rendered)
      .to.be.equal(
        'this is a test sentence. <a>test&lt;b&gt; foo&lt;/b&gt; bar</a>'
      )
  })

  it('does not mind having 2 adjacent tags', () => {
    var html = 'cv<link1/><link2/>ink>'
    var fragment = TagReactify(html, {
      link1: function() {
        return <span>foo</span>
      },
      link2: function() {
        return <div>bar</div>
      }
    })
    var rendered = renderToStaticMarkup(fragment);
    expect(rendered).to.be.equal('cv<span>foo</span><div>bar</div>ink&gt;')
  })

  it('does not mind one broken tag is followed by a good tag', () => {
    var html = 'cv<link1></link<link2/>ink>'
    var fragment = TagReactify(html, {
      link1: function() {
        return <span>foo</span>
      },
      link2: function() {
        return <div>bar</div>
      }
    })
    var rendered = renderToStaticMarkup(fragment);
    expect(rendered).to.be
      .equal('cv&lt;link1&gt;&lt;/link<div>bar</div>ink&gt;')
  })

  it('does not mind people throw rubbish at it', () => {
    var html = 'cv<link>test< foo</b>ink>'
    var fragment = TagReactify(html, {
      link: Link
    })
    var rendered = renderToStaticMarkup(fragment);
    expect(rendered).to.be.equal('cv&lt;link&gt;test&lt; foo&lt;/b&gt;ink&gt;')
  })

  it('does not mind having some upper or lower cases', () => {
    var html = 'cv<LiNk>test</LiNk>adfj'
    var fragment = TagReactify(html, {
      LiNk: Link
    })
    var rendered = renderToStaticMarkup(fragment);
    expect(rendered).to.be.equal('cv<a>test</a>adfj')
  })

  it('does not mind having some self-closing tags', () => {
    var html = 'cv<ICloseItMySelf />adfj'
    var fragment = TagReactify(html, {
      ICloseItMySelf: Link
    })
    var rendered = renderToStaticMarkup(fragment);
    expect(rendered).to.be.equal('cv<a></a>adfj')
  })

  it('reserves line breaks', () => {
    var html = 'cv<link>t\r\nes\nt</link>ad\nfjnsdfns\rdfos'
    var fragment = TagReactify(html, {
      link: Link
    })
    var rendered = renderToStaticMarkup(fragment);
    expect(rendered)
      .to.be.equal('cv<a>t<br/>es<br/>t</a>ad<br/>fjnsdfns<br/>dfos')
  })
})