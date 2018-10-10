/**
 * @file helper
 * @author Cuttle Cong
 * @date 2018/10/10
 *
 */
const nps = require('path')

function fixture(name = '') {
  return nps.join(__dirname, 'fixture', name)
}

module.exports = {
  fixture
}
