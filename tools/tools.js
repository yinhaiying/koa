
const md5 = require('md5')
module.exports = {
  md5:(message) => {
    return md5(message)
  },
  cateToList:(data) => {
    var firstArr=[];
    // 获取一级分类
    for(var i=0;i<data.length;i++){
        if(data[i].pid=='0'){
            firstArr.push(data[i]);
        }
    }

    // 获取二级分类

    for(var i=0;i<firstArr.length;i++){

        firstArr[i].list=[];
        for(var j=0;j<data.length;j++){
            if(firstArr[i]._id==data[j].pid){
                firstArr[i].list.push(data[j]);
            }
        }

    }

    return firstArr;



  }
}
