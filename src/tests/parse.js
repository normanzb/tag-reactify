import { expect } from 'chai'
import parse from '../parse'

describe('Reactify', () => {
  describe('parse', () => {
    it('should parse plain text into ast', () => {
      var ast = parse('this is a test sentence.')
      expect(ast).to.be.an.instanceof(Array)
      expect(ast).to.be.deep.eql(['this is a test sentence.'])
    })

    it('should parse plain text with tag into ast', () => {
      var ast = parse('this is a test sentence. <a>test</a>')
      expect(ast).to.be.an.instanceof(Array)
      expect(ast).to.be.deep.eql([
        'this is a test sentence. ', 
        {
          tag: 'a', 
          children: ['test'],
          source: '<a>test</a>'
        }
      ])
    })

    it('should parse tag into ast', () => {
      var ast = parse('<a>test</a>')
      expect(ast).to.be.an.instanceof(Array)
      expect(ast).to.be.deep.eql([
        {
          tag: 'a', 
          children: ['test'],
          source: '<a>test</a>'
        }
      ])
    })

    it('should parse tag with plain text into ast', () => {
      var ast = parse('<a>test</a> here is another test sentence')
      expect(ast).to.be.an.instanceof(Array)
      expect(ast).to.be.deep.eql([
        {
          tag: 'a', 
          children: [
            'test'
          ],
          source: '<a>test</a>'
        },
        ' here is another test sentence'
      ])
    })

    it('should parse nested tags into ast', () => {
      var ast = parse(
        '<a>test<b>foo</b>bar</a> here is another test sentence'
      )
      expect(ast).to.be.an.instanceof(Array)
      expect(ast).to.be.deep.eql([
        {
          tag: 'a', 
          children: [
            'test',
            {
              tag: 'b',
              children: [
                'foo'
              ],
              source: '<b>foo</b>'
            },
            'bar'
          ],
          source: '<a>test<b>foo</b>bar</a>'
        },
        ' here is another test sentence'
      ])
    })

    it('should parse self-closing tags into ast', () => {
      var ast = parse(
        '<a>test<b />bar</a> here is another<br/> test sentence'
      )
      expect(ast).to.be.an.instanceof(Array)
      expect(ast).to.be.deep.eql([
        {
          tag: 'a', 
          children: [
            'test',
            {
              tag: 'b',
              children: null,
              source: '<b />'
            },
            'bar'
          ],
          source: '<a>test<b />bar</a>'
        },
        ' here is another',
        {
          tag: 'br', 
          children: null,
          source: '<br/>'
        },
        ' test sentence'
      ])
    })

    it(
      'should trim space in self-closing tag but reserve the space in source', 
      () => {
        var ast = parse(
          'test<b />bar'
        )
        expect(ast).to.be.an.instanceof(Array)
        expect(ast).to.be.deep.eql([
          'test',
          {
            tag: 'b', 
            children: null,
            source: '<b />'
          },
          'bar'
        ])
      })

    it(
      'should parse tag without text inside', 
      () => {
        var ast = parse(
          'test<link></link>bar'
        )
        expect(ast).to.be.an.instanceof(Array)
        expect(ast).to.be.deep.eql([
          'test',
          {
            tag: 'link', 
            children: null,
            source: '<link></link>'
          },
          'bar'
        ])
      })

    it(
      'does not mind having digits as tag name', 
      () => {
        var ast = parse(
          'test<1>aaa</1>bar'
        )
        expect(ast).to.be.an.instanceof(Array)
        expect(ast).to.be.deep.eql([
          'test',
          {
            tag: '1', 
            children: ['aaa'],
            source: '<1>aaa</1>'
          },
          'bar'
        ])
      })

    it(
      'should parse adjacent tags just fine', 
      () => {
        var ast = parse(
          'test<link1></link1><link2>a</link2>bar'
        )
        expect(ast).to.be.an.instanceof(Array)
        expect(ast).to.be.deep.eql([
          'test',
          {
            tag: 'link1', 
            children: null,
            source: '<link1></link1>'
          },
          {
            tag: 'link2', 
            children: ['a'],
            source: '<link2>a</link2>'
          },
          'bar'
        ])
      })

    it('should not throw exception when the tag does not match', () => {
      var ast = parse(
        '<a>test<b>foo</b>bar here is another test sentence'
      )
      expect(ast).to.be.an.instanceof(Array)
      expect(ast).to.be.deep.eql([
        '<a>test',
        {
          tag: 'b', 
          children: [
            'foo'
          ],
          source: '<b>foo</b>'
        },
        'bar here is another test sentence'
      ])
    })

    it('should leave unmatch tag as part of literal', () => {
      var ast = parse(
        'test<b>foo</b>bar</a> here is another test sentence'
      )
      expect(ast).to.be.an.instanceof(Array)
      expect(ast).to.be.deep.eql([
        'test',
        {
          tag: 'b', 
          children: [
            'foo'
          ],
          source: '<b>foo</b>'
        },
        'bar</a> here is another test sentence'
      ])
    })

    it('should leave tag with attribute unchanged', () => {
      var ast = parse(
        '<a test="2">test<b>foo</b>bar</a> here is another test sentence'
      )
      expect(ast).to.be.an.instanceof(Array)
      expect(ast).to.be.deep.eql([
        '<a test="2">test',
        {
          tag: 'b', 
          children: [
            'foo'
          ],
          source: '<b>foo</b>'
        },
        'bar</a> here is another test sentence'
      ])
    })

    it('does not mind having some line breaks in between the tags', () => {
      var ast = parse(
        '<a>test\r\nfoo\nbar<b>f\noo</b>bar</a> here is ano\nther test sentence'
      )
      expect(ast).to.be.an.instanceof(Array)
      expect(ast).to.be.deep.eql([
        {
          tag: 'a', 
          children: [
            'test\r\nfoo\nbar',
            {
              tag: 'b',
              children: [
                'f\noo'
              ],
              source: '<b>f\noo</b>'
            },
            'bar'
          ],
          source: '<a>test\r\nfoo\nbar<b>f\noo</b>bar</a>'
        },
        ' here is ano\nther test sentence'
      ])
    })

    // This test is to cover issue in firefox:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1361856
    // We can remove this test when firefox supports it
    it('does not mind when the browser/env does not support flag s', () => {
      let RegExpExec = global.RegExp.prototype.exec
      global.RegExp.prototype.exec = function () {
        if (this.flags.indexOf('s') >= 0) {
          throw new Error(
            'Flag s is not supported by firefox so we dont want it here'
          )
        }
        return RegExpExec.apply(this, arguments);
      }
      let err 
      try {
        parse(
          '<a>test\r\nfoo\nbar<b>f\noo</b>bar</a>'
        )
      } catch(ex) {
        err = ex
      } finally {
        global.RegExp.prototype.exec = RegExpExec
      }
      
      expect(err).to.be.equal(undefined)
    })
  })
})