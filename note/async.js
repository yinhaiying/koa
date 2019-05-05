
async function getInfo(){
    return '异步返回数据'
}

let result = getInfo();
console.log(result)  // Promise { '异步返回数据' }

// 使用then 获取异步执行结果
result.then((res) => {
  console.log(res)
})

// let data2 = await getInfo()  // await is only valid in async function

async function show(){
    await getInfo()
    console.log('2')
}

let data3 = show() // 异步返回数据