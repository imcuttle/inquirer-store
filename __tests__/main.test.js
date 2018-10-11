/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
const inquirerStore = require('../')
const FileStore = require('../FileStore')
const { fixture } = require('./helper')

const inquirer = require('inquirer')
const fs = require('fs')
const autoComplete = require('@moyuyc/inquirer-autocomplete-prompt')
inquirer.registerPrompt('autocomplete', autoComplete)

jest.mock('inquirer')

const prompts = [
  {
    type: 'input',
    name: 'name',
    message: 'name message?',
    default: 'abc'
  },
  {
    type: 'list',
    name: 'gender',
    choices: [
      {
        value: 'Man'
      },
      {
        value: 'Woman',
        name: 'girl'
      }
    ],
    message: 'name message?',
    default: 'Man'
  }
]

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('inquirerStore', function() {
  const tmpPath = fixture('main-test-tmp')
  const tmpData = {}

  function readTmpData() {
    return JSON.parse(fs.readFileSync(tmpPath).toString())
  }

  beforeEach(() => {
    fs.writeFileSync(tmpPath, JSON.stringify(tmpData))
  })
  afterEach(() => {
    fs.unlinkSync(tmpPath)
  })

  it('should inquirerStore', async function() {
    let p = inquirerStore(inquirer.prompt, prompts, {
      store: new FileStore({ storePath: tmpPath })
    })

    type('abcdd')
    await enter()

    down()
    await enter()

    return p.then(async answer => {
      expect(answer).toEqual({
        name: 'abcdd',
        gender: 'Woman'
      })
      expect(readTmpData()).toEqual(answer)

      // Verify setting
      p = inquirerStore(inquirer.prompt, prompts, {
        store: new FileStore({ storePath: tmpPath })
      })
      await enter()
      await enter()
      return p.then(answer => {
        expect(answer).toEqual({
          name: 'abcdd',
          gender: 'Woman'
        })
        expect(readTmpData()).toEqual(answer)
      })
    })
  })

  it('should inquirerStore with `mode = write`', async function() {
    let p = inquirerStore(inquirer.prompt, prompts, {
      store: new FileStore({ storePath: tmpPath })
    })

    type('abcdd')
    await enter()

    down()
    await enter()

    return p.then(async answer => {
      expect(answer).toEqual({
        name: 'abcdd',
        gender: 'Woman'
      })
      expect(readTmpData()).toEqual(answer)

      // Verify setting should not be worked
      p = inquirerStore(inquirer.prompt, prompts, {
        mode: 'write',
        store: new FileStore({ storePath: tmpPath })
      })
      await enter()
      await enter()
      return p.then(answer => {
        expect(answer).toEqual({
          name: 'abc',
          gender: 'Man'
        })
        expect(readTmpData()).toEqual({
          name: 'abc',
          gender: 'Man'
        })
      })
    })
  })

  it('should inquirerStore with `mode = read`', async function() {
    let p = inquirerStore(inquirer.prompt, prompts, {
      store: new FileStore({ storePath: tmpPath })
    })

    type('abcdd')
    await enter()

    down()
    await enter()

    return p.then(async answer => {
      expect(answer).toEqual({
        name: 'abcdd',
        gender: 'Woman'
      })
      expect(readTmpData()).toEqual(answer)

      // Verify setting should not be worked
      p = inquirerStore(inquirer.prompt, prompts, {
        mode: 'read',
        store: new FileStore({ storePath: tmpPath })
      })
      type('foo')
      await enter()
      await enter()
      return p.then(answer => {
        expect(answer).toEqual({
          name: 'foo',
          gender: 'Woman'
        })
        expect(readTmpData()).toEqual({
          name: 'abcdd',
          gender: 'Woman'
        })
      })
    })
  })

  it('should inquirerStore when contains key', async function() {
    let p = inquirerStore(
      inquirer.prompt,
      [
        {
          type: 'input',
          name: 'name',
          message: 'name message?',
          default: 'abc'
        }
      ],
      {
        store: new FileStore({ storePath: tmpPath, key: 'tttt' })
      }
    )

    type('abcdd')
    await enter()

    return p.then(async answer => {
      expect(answer).toEqual({
        name: 'abcdd'
      })
      expect(readTmpData()).toEqual({ tttt: answer })

      // Verify setting
      p = inquirerStore(
        inquirer.prompt,
        [
          {
            type: 'input',
            name: 'name',
            message: 'name message?',
            default: 'abc'
          }
        ],
        {
          store: new FileStore({ storePath: tmpPath, key: 'tttt' })
        }
      )
      await enter()
      return p.then(answer => {
        expect(answer).toEqual({
          name: 'abcdd'
        })
        expect(readTmpData()).toEqual({ tttt: answer })
      })
    })
  })

  it('should inquirerStore when contains key which is not equal', async function() {
    let p = inquirerStore(
      inquirer.prompt,
      [
        {
          type: 'input',
          name: 'name',
          message: 'name message?',
          default: 'abc'
        }
      ],
      {
        store: new FileStore({ storePath: tmpPath, key: 'tttt' })
      }
    )

    type('abcdd')
    await enter()

    return p.then(async answer => {
      expect(answer).toEqual({
        name: 'abcdd'
      })
      expect(readTmpData()).toEqual({ tttt: answer })

      // Verify setting
      p = inquirerStore(
        inquirer.prompt,
        [
          {
            type: 'input',
            name: 'name',
            message: 'name message?'
          }
        ],
        {
          store: new FileStore({ storePath: tmpPath, key: 'yyyy' })
        }
      )
      await enter()
      return p.then(answer => {
        expect(answer).toEqual({
          name: ''
        })
        expect(readTmpData()).toEqual({ tttt: { name: 'abcdd' }, yyyy: answer })
      })
    })
  })

  it('should inquirerStore skips prompt which setting `deniesStore`', async function() {
    let p = inquirerStore(
      inquirer.prompt,
      prompts.concat([
        {
          name: 'abc',
          message: 'wwww',
          type: 'input',
          deniesStore: true
        }
      ]),
      {
        store: new FileStore({ storePath: tmpPath, key: 'tttt' })
        // deniesStoreKey: 'deniesStore'
      }
    )

    type('abcdd')
    await enter()

    await enter()
    type('abc-val')
    await enter()

    return p.then(answer => {
      expect(answer).toEqual({
        name: 'abcdd',
        gender: 'Man',
        abc: 'abc-val'
      })
      expect(readTmpData()).toEqual({
        tttt: {
          name: 'abcdd',
          gender: 'Man'
        }
      })
    })
  })

  it('should inquirerStore using `@moyuyc/inquirer-autocomplete-prompt`', async function() {
    let p = inquirerStore(
      inquirer.prompt,
      [
        {
          type: 'autocomplete',
          name: 'name',
          message: 'name message?',
          suggestOnly: true,
          source: (answers, input) => ['auto'],
          default: 'auto'
        }
      ],
      {
        store: new FileStore({ storePath: tmpPath, key: 'tttt' })
      }
    )

    // type('abcdd')
    await enter()

    return p.then(async answer => {
      expect(answer).toEqual({
        name: 'auto'
      })
      expect(readTmpData()).toEqual({ tttt: answer })

      // Verify setting
      p = inquirerStore(
        inquirer.prompt,
        [
          {
            type: 'input',
            name: 'name',
            message: 'name message?',
            default: 'abc'
          }
        ],
        {
          store: new FileStore({ storePath: tmpPath, key: 'tttt' })
        }
      )
      await enter()
      return p.then(answer => {
        expect(answer).toEqual({
          name: 'auto'
        })
        expect(readTmpData()).toEqual({ tttt: answer })
      })
    })
  })
})

function type(chars) {
  const rl = inquirer.rl
  chars.split('').forEach(function(char) {
    rl.line = rl.line + char
    rl.input.emit('keypress', char)
  })
}

function up() {
  inquirer.rl.input.emit('keypress', '', { name: 'up' })
}

function down() {
  inquirer.rl.input.emit('keypress', '', { name: 'down' })
}

async function enter(reset = true) {
  inquirer.rl.emit('line', inquirer.rl.line)
  // Yield for next process
  await delay()
  // Reset
  reset && (inquirer.rl.line = '')
}
