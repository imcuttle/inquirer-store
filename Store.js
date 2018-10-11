/**
 * @file Store
 * @author Cuttle Cong
 * @date 2018/10/10
 *
 */

/**
 * @public
 * Base Class for storing to anywhere, don't use it directly
 * @param options {object}
 * @example
 * class MyStore extends Store {
 *    static defaultOptions = {
 *      data: { name: 'imcuttle' }
 *    }
 *
 *    _read() {
 *      const { data } = this.options
 *      return data
 *    }
 *
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
  }

  /**
   * Read for filling `this.data`
   * @public
   * @return {Promise<any>}
   */
  read() {
    return Promise.resolve(this._read()).then(data => {
      /**
       * Existing data in actually
       * @public
       * @type {object}
       */
      this.data = data
    })
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

  _write(data) {}

  /**
   * Write `this.data` for persistence
   * @public
   * @param [data {object}={}]
   * @return {Promise<any>|any}
   */
  write(data = {}) {
    const newData = Object.assign({}, this.data, data)
    return this._write(newData)
  }
}

Store.defaultOptions = {}

module.exports = Store
