/**
 * Make inquirer's answers persistence
 * @author imcuttle
 */
const toArray = require('lodash.toarray')

/**
 *
 * @public
 * @param prompt {Function}
 * @param config - same as inquirer
 * @param opts
 * @param opts.store {Store} Use which store
 * @param [opts.deniesStoreKey='deniesStore'] {string}
 *  When config contains `deniesStoreKey` and equals `true`, the prompt's value will not be saved.
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
function inquirerStore(prompt, config, { store, deniesStoreKey = 'deniesStore' } = {}) {
  config = toArray(config)

  config = config.map(conf => {
    if (conf && conf.name && store.get(conf.name)) {
      return Object.assign({}, conf, { default: store.get(conf.name) })
    }
    return conf
  })

  const p = prompt(config)
  const ob = p.ui.process.subscribe(onEachAnswer, null, onComplete)

  function onEachAnswer({ name, answer } = {}) {
    if (p.ui.activePrompt.opt[deniesStoreKey]) {
      store.unset(name)
    } else {
      store.set(name, answer)
      store.write()
    }
  }

  function onComplete() {}

  return p
}

module.exports = inquirerStore
