# inquirer-store

[![Build status](https://img.shields.io/travis/imcuttle/inquirer-store/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/inquirer-store)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/inquirer-store.svg?style=flat-square)](https://codecov.io/github/imcuttle/inquirer-store?branch=master)
[![NPM version](https://img.shields.io/npm/v/inquirer-store.svg?style=flat-square)](https://www.npmjs.com/package/inquirer-store)
[![NPM Downloads](https://img.shields.io/npm/dm/inquirer-store.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/inquirer-store)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

Make inquirer's answers persistence even be aborted halfway

![](./snapshot.svg)

## How it works?

1.  Get default answers by `store`, if `null`, turn to step 3.
2.  Reset `default` field of each config.
3.  Detect each answer's acceptance by calling `prompt.ui.process.subscribe`, then calls `store.set / store.write` for saving.

## Installation

```bash
npm install inquirer-store
# or use yarn
yarn add inquirer-store
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### inquirerStore

[index.js:32-57](https://github.com/imcuttle/inquirer-store/blob/0b1cdb30c76a5a4dc7e7d0d5b87c4f7185bec93f/index.js#L32-L57 'Source code on GitHub')

Make inquirer's answers persistence

#### Parameters

- `prompt` {Function}
- `config` same as inquirer
- `opts` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**
  - `opts.store` {Store} Use which store
  - `opts.deniesStoreKey` {string}
    When config contains `deniesStoreKey` and equals `true`, the prompt's value will not be saved. (optional, default `'deniesStore'`)

#### Examples

```javascript
const inquirerStore = require('inquirer-store')
const FileStore = require('inquirer-store/FileStore')
const inquirer = require('inquirer')

inquirerStore(
  inquirer.prompt,
  [
    { type: 'input', message: 'Hi...', name: 'name' },
    { type: 'input', message: 'Hi...', name: 'deny', deniesStore: true }
  ],
  {
    store: new FileStore({ storePath: '/path/to/where.json' })
  }
).then(answers => {
  // `answers` would be setting in `default` as default value at next time
  //  but excluding `answers.deny`
})
```

### Store

[Store.js:29-97](https://github.com/imcuttle/inquirer-store/blob/0b1cdb30c76a5a4dc7e7d0d5b87c4f7185bec93f/Store.js#L29-L97 'Source code on GitHub')

Base Class for storing to anywhere, don't use it directly

#### Parameters

- `options` {object}

#### Examples

```javascript
// Write customized store class
class MyStore extends Store {
  static defaultOptions = {
    data: { name: 'imcuttle' }
  }
  // Note: It must be a sync operation
  _read() {
    const { data } = this.options
    return data
  }
  // Note: It must be a sync operation
  _write(data) {
    // Save data for persistence here
  }
}
```

#### options

[Store.js:36-36](https://github.com/imcuttle/inquirer-store/blob/0b1cdb30c76a5a4dc7e7d0d5b87c4f7185bec93f/Store.js#L36-L36 'Source code on GitHub')

extends from `this.constructor.defaultOptions` and `options`

Type: [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### data

[Store.js:42-42](https://github.com/imcuttle/inquirer-store/blob/0b1cdb30c76a5a4dc7e7d0d5b87c4f7185bec93f/Store.js#L42-L42 'Source code on GitHub')

Existing data in actually

Type: [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

#### get

[Store.js:56-58](https://github.com/imcuttle/inquirer-store/blob/0b1cdb30c76a5a4dc7e7d0d5b87c4f7185bec93f/Store.js#L56-L58 'Source code on GitHub')

Get `this.data[name]`

##### Parameters

- `name` {string}

Returns **any**

#### set

[Store.js:66-68](https://github.com/imcuttle/inquirer-store/blob/0b1cdb30c76a5a4dc7e7d0d5b87c4f7185bec93f/Store.js#L66-L68 'Source code on GitHub')

Set `this.data[name]` to be `value`

##### Parameters

- `name` {string}
- `value` {any}

#### unset

[Store.js:75-77](https://github.com/imcuttle/inquirer-store/blob/0b1cdb30c76a5a4dc7e7d0d5b87c4f7185bec93f/Store.js#L75-L77 'Source code on GitHub')

Delete `this.data[name]`

##### Parameters

- `name` {string}

#### clear

[Store.js:83-85](https://github.com/imcuttle/inquirer-store/blob/0b1cdb30c76a5a4dc7e7d0d5b87c4f7185bec93f/Store.js#L83-L85 'Source code on GitHub')

Clear `this.data`

#### write

[Store.js:94-96](https://github.com/imcuttle/inquirer-store/blob/0b1cdb30c76a5a4dc7e7d0d5b87c4f7185bec93f/Store.js#L94-L96 'Source code on GitHub')

Write `this.data` for persistence

##### Parameters

- `data` (optional, default `{}`)

### FileStore

[FileStore.js:24-50](https://github.com/imcuttle/inquirer-store/blob/0b1cdb30c76a5a4dc7e7d0d5b87c4f7185bec93f/FileStore.js#L24-L50 'Source code on GitHub')

**Extends Store**

Store's implementation in file system

#### Parameters

- `options` {object}
  - `options.key` {string|null}
    When `null`, use store from `storePath` as data, otherwise use `store[key]` as data. (optional, default `null`)
  - `options.storePath` {string|null] - File path for storing data (optional, default `null`)
  - `options.parse` {string: string => object} Parse the text from file `storePath` (optional, default `JSON.parse`)
  - `options.stringify` {data: object => string} Stringify data for saving in `storePath` (optional, default `JSON.stringify`)
  - `options.fs` It's useful for mocking data by overriding `existsSync / readFileSync / writeFileSync` methods (optional, default `require('fs')`)

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com">moyuyc95@gmail.com</a>.

## License

MIT - [imcuttle](https://github.com/imcuttle) 🐟
