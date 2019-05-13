
const md5 = require('md5')
module.exports = {
  md5:(message) => {
    return md5(message)
  },
  cateTolist:(data) => {
    // 1. 获取一级分类  一级分类的pid = 0
    let firstArr = [];
    for(var i = 0; i < data.length;i++){
      if(data[i].pid == 0){
        firstArr.push(data[i])
      }
    }

    // 2. 获取二级分类
    for(var i = 0;i < firstArr.length;i++){
      firstArr[i].list = [];
      for(let j = 0;j < data.length;j++){
        if(firstArr[i]._id == data[i].pid){
          firstArr[i].list.push(data[i])
        }
      }
    }

    return firstArr



  }
}
