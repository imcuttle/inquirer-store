/**
 * @file FileStore
 * @author Cuttle Cong
 * @date 2018/10/10
 * @description
 */
const FileStore = require('../FileStore')
const { fixture } = require('./helper')
const fs = require('fs')

describe('FileStore', function() {
  it('should FileStore.create instance of FileStore', () => {
    expect(new FileStore({ key: 'ok' })).toBeInstanceOf(FileStore)
  })

  it('should FileStore#options matched', () => {
    const opts = { key: 'ok' }
    expect(new FileStore(opts).options).toEqual(Object.assign({}, FileStore.defaultOptions, opts))
    expect(new FileStore(opts).options).not.toEqual(FileStore.defaultOptions)
  })

  it('should FileStore#data matched when storePath is not existed', () => {
    expect(new FileStore().data).toEqual({})
  })

  it('should FileStore#data matched when storePath had already existed with error syntax', () => {
    expect(() => new FileStore({ storePath: fixture('store-error.json') })).toThrowErrorMatchingInlineSnapshot(
      `"Unexpected end of JSON input"`
    )
  })

  it('should FileStore#data matched when storePath had already existed', () => {
    expect(new FileStore({ storePath: fixture('store.json') }).data).toEqual({ tmp: 'tmptrue' })
  })

  it('should FileStore#data matched when `parse` is customized', () => {
    expect(new FileStore({ storePath: fixture('store.json'), parse: str => ({ str }) }).data).toMatchInlineSnapshot(`
Object {
  "str": "{
  \\"tmp\\": \\"tmptrue\\"
}
",
}
`)
  })

  it('should FileStore#data matched calling `set`', () => {
    const s = new FileStore({ storePath: fixture('store.json') })
    s.set('abc', ['ok'])
    expect(s.data).toMatchInlineSnapshot(`
Object {
  "abc": Array [
    "ok",
  ],
  "tmp": "tmptrue",
}
`)
  })

  describe('FileStore stringify', () => {
    const tmpPath = fixture('_tmp.json')
    const tmpData = { tmp: { tmpFile: 'tmpFile' } }
    beforeEach(() => {
      fs.writeFileSync(tmpPath, JSON.stringify(tmpData))
    })
    afterEach(() => {
      fs.unlinkSync(tmpPath)
    })

    it('should FileStore#data matched when `stringify` is customized', () => {
      new FileStore({ storePath: tmpPath, stringify: data => JSON.stringify(data, null, 4) }).write({
        xx: 'yy'
      })

      expect(fs.readFileSync(tmpPath).toString()).toMatchInlineSnapshot(`
"{
    \\"tmp\\": {
        \\"tmpFile\\": \\"tmpFile\\"
    },
    \\"xx\\": \\"yy\\"
}"
`)
    })

    it('should FileStore works well with `key` option', function() {
      const store = new FileStore({ key: 'tmmm', storePath: tmpPath })
      expect(store.data).toEqual({})
      store.write()
      expect(fs.readFileSync(tmpPath).toString()).toMatchInlineSnapshot(
        `"{\\"tmp\\":{\\"tmpFile\\":\\"tmpFile\\"},\\"tmmm\\":{}}"`
      )
    })

    it('should FileStore works well with `key` option when matched', function() {
      const store = new FileStore({ key: 'tmp', storePath: tmpPath })
      expect(store.data).toEqual(tmpData.tmp)
      store.write()
      expect(fs.readFileSync(tmpPath).toString()).toMatchInlineSnapshot(`"{\\"tmp\\":{\\"tmpFile\\":\\"tmpFile\\"}}"`)
    })
  })
})
