/**
 * @file Store
 * @author Cuttle Cong
 * @date 2018/10/10
 *
 */

/**
 * Base Class for storing to anywhere, don't use it directly
 * @public
 * @param options {object}
 * @example
 * const Store = require('inquirer-store/Store')
 * // Write customized store class
 * class MyStore extends Store {
 *    static defaultOptions = {
 *      data: { name: 'imcuttle' }
 *    }
 *    // Note: It must be a sync operation
 *    _read() {
 *      const { data } = this.options
 *      return data
 *    }
 *    // Note: It must be a sync operation
 *    _write(data) {
 *      // Save data for persistence here
 *    }
 * }
 */
class Store {
  constructor(options) {
    /**
     * extends from `this.constructor.defaultOptions` and `options`
     * @public
     * @type {object}
     */
    this.options = Object.assign({}, this.constructor.defaultOptions, options)
    /**
     * Existing data in actually
     * @public
     * @type {object}
     */
    this.data = this._read()
  }

  /* istanbul ignore next */
  _read() {
    return {}
  }

  /**
   * Get `this.data[name]`
   * @public
   * @param name {string}
   * @return {any}
   */
  get(name) {
    return this.data[name]
  }

  /**
   * Set `this.data[name]` to be `value`
   * @public
   * @param name {string}
   * @param value {any}
   */
  set(name, value) {
    this.data[name] = value
  }

  /**
   * Delete `this.data[name]`
   * @public
   * @param name {string}
   */
  unset(name) {
    delete this.data[name]
  }

  /**
   * Clear `this.data`
   * @public
   */
  clear() {
    this.data = {}
  }

  _write() {}

  /**
   * Write `this.data` for persistence
   * @public
   * @param [data {object}={}]
   */
  write(data = {}) {
    this._write(Object.assign({}, this.data, data))
  }
}

Store.defaultOptions = {}

module.exports = Store
