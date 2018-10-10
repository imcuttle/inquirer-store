/**
 * @file example
 * @author Cuttle Cong
 * @date 2018/10/10
 *
 */
const inquirer = require('inquirer')
const inquirerStore = require('.')

const p = inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: "What's your name?",
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
])

inquirerStore(p)

p.then(answers => {
  console.log(answers)
}).catch(console.error)
