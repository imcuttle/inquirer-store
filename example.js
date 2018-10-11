/**
 * @file example
 * @author Cuttle Cong
 * @date 2018/10/10
 *
 */
const inquirer = require('inquirer')
const { tmpdir } = require('os')
const { readFileSync, existsSync } = require('fs')
const nps = require('path')
const mkdirp = require('mkdirp')
const autoComplete = require('@moyuyc/inquirer-autocomplete-prompt')

inquirer.registerPrompt('autocomplete', autoComplete)

const inquirerStore = require('.')
const FileStore = require('./FileStore')

const config = [
  {
    type: 'autocomplete',
    name: 'auto',
    message: 'close what?',
    suggestOnly: true,
    source: () => ['me', 'and', 'you'],
    default: 'and'
  },
  {
    type: 'input',
    name: 'name',
    message: "What's your name(deniesStore)?",
    deniesStore: true,
    default: 'yucong'
  },
  {
    type: 'list',
    name: 'gender',
    message: "What's your gender?",
    choices: ['M', 'F'],
    default: 'F'
  },
  {
    type: 'checkbox',
    name: 'movies',
    message: "What're your favorite movies?",
    choices: ['A', 'B', 'C', 'D'],
    default: ['A', 'B']
  }
]

const storePath = nps.join(tmpdir(), 'tmp.json')
existsSync(storePath) && console.log(storePath, readFileSync(storePath).toString())
mkdirp.sync(nps.dirname(storePath))

inquirerStore(inquirer.prompt, config, {
  store: new FileStore({ storePath })
})
  .then(console.log)
  .catch(console.error)
