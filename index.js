/**
 * Make inquirer's answers persistence
 * @author imcuttle
 */
const toArray = require('lodash.toarray')

/**
 * Make inquirer's answers persistence
 * @public
 * @param prompt {Function}
 * @param config - same as inquirer
 * @param opts
 * @param opts.store {Store} Use which store
 * @param [opts.deniesStoreKey='deniesStore'] {string}
 *  When config contains `deniesStoreKey` and equals `true`, the prompt's value will not be saved.
 * @param [opts.mode='duplex'] {'duplex'|'write'|'read'}
 *  <div>The mode about dealing with `store` </div>
 *  - `duplex`: Read and then write with `store`
 *  - `write`: Just write data to `store`
 *  - `read`: Just read data from `store`
 * @example
 * const inquirerStore = require('inquirer-store')
 * const FileStore = require('inquirer-store/FileStore')
 * const inquirer = require('inquirer')
 *
 * inquirerStore(inquirer.prompt, [
 *   { type: 'input', message: 'Hi...', name: 'name' },
 *   { type: 'input', message: 'Hi...', name: 'deny', deniesStore: true },
 * ], {
 *   store: new FileStore({ storePath: '/path/to/where.json' })
 * }).then(answers => {
 *    // `answers` would be setting in `default` as default value at next time
 *    //  but excluding `answers.deny`
 * })
 *
 */
function inquirerStore(prompt, config, { store, deniesStoreKey = 'deniesStore', mode = 'duplex' } = {}) {
  const writeAble = ['write', 'duplex'].includes(mode)
  const readAble = ['read', 'duplex'].includes(mode)

  config = toArray(config)
  if (readAble) config = fillConfigDefault(config, store)

  const p = prompt(config)

  if (writeAble) {
    const ob = p.ui.process.subscribe(onEachAnswer, null, onComplete)

    function onEachAnswer({ name, answer } = {}) {
      if (p.ui.activePrompt && p.ui.activePrompt.opt[deniesStoreKey]) {
        store.unset(name)
      } else {
        store.set(name, answer)
        store.write()
      }
    }

    function onComplete() {}
  }

  return p
}

/**
 * Fill config's `default` field
 * @public
 * @param config {Array<object> | object}
 * @param store {Store}
 * @return {Array<object>}
 * @example
 * const { fillConfigDefault } = require('inquirer-store')
 *
 * fillConfigDefault(
 *   [{ type: 'input', name: 'name', default: 'foo' }],
 *   new FileStore({ storePath: '/path/to/where.json' })
 * )
 * // [{ type: 'input', name: 'name', default: 'the value that you has inputted in last time' }]
 */
function fillConfigDefault(config, store) {
  config = toArray(config)
  config = config.map(conf => {
    if (conf && conf.name && store.get(conf.name)) {
      return Object.assign({}, conf, { default: store.get(conf.name) })
    }
    return conf
  })

  return config
}

module.exports = inquirerStore
module.exports.fillConfigDefault = fillConfigDefault
