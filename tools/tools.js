
const md5 = require('md5')
module.exports = {
  md5:(message) => {
    return md5(message)
  }
}
