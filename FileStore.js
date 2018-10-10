/**
 * @file FileStore
 * @author Cuttle Cong
 * @date 2018/10/10
 *
 */
const fileSys = require('fs')
const nps = require('path')

const Store = require('./Store')

/**
 * Store's implementation in file system
 * @public
 * @param options {object}
 * @param [options.key=null] {string|null}
 *  When `null`, use store from `storePath` as data, otherwise use `store[key]` as data.
 * @param [options.storePath=null] {string|null] - File path for storing data
 * @param [options.parse=JSON.parse] {string: string => object} Parse the text from file `storePath`
 * @param [options.stringify=JSON.stringify] {data: object => string} Stringify data for saving in `storePath`
 * @param [options.fs=require('fs')]
 * It's useful for mocking data by overriding `existsSync / readFileSync / writeFileSync` methods
 */
class FileStore extends Store {
  _read() {
    const { storePath, parse, key, fs } = this.options

    if (fs.existsSync(storePath)) {
      const obj = parse(fs.readFileSync(storePath).toString())
      this._store = obj
      if (key) {
        return obj[key] || {}
      }
      return obj
    }

    return {}
  }

  _write(answers) {
    const { key, storePath, stringify, fs } = this.options
    if (key) {
      this._store[key] = answers
    } else {
      this._store = answers
    }

    fs.writeFileSync(storePath, stringify(this._store))
  }
}

FileStore.defaultOptions = {
  key: null,
  storePath: null,
  stringify: JSON.stringify,
  parse: JSON.parse,
  fs: fileSys
}

module.exports = FileStore
