## koa

### async/await

async是将一个函数变成异步函数。
```
async function getInfo(){
    return '异步返回数据'
}
let result = getInfo();
console.log(result)  // Promise { '异步返回数据' }
```
从上面我们可以看到getInfo函数返回的是一个promise。
如果我们想要得到返回的值，我们可以通过promise.then进行获取。
```
result.then((res) => {
  console.log(res)
})
```
但是这种方法还是存在一定问题。如果我们里面不断嵌套有异步函数。
那么我们需要不断地使用then。我们希望能够以同步的写法来处理异步。
ES6提供了一个await关键字。await等待异步执行完成。
```
let data2 = await getInfo()  // await is only valid in async function
```
当我们直接使用await调用异步函数时，会发现出现报错。await只能在async函数内部使用。
```
async异步函数
async function getInfo(){
    return '异步返回数据'
}

// async异步函数
async function show(){
    await getInfo() // 使用await得到其他异步函数的执行结果
    console.log('2') // 这里的同步执行会在await后面执行。await把异步变成同步
}
let data3 = show() // 异步返回数据

```

### 路由
**路由:**就是根据不同的url地址，加载不同的页面实现不同的功能。在koa中通过koa-router来实现路由功能。
1. 引入路由并创建实例
```
let Router = require('koa-router');
let router = new Router();
```
2. 使用路由实例编写路由(在express中是使用app应用来编写实例)
```
router.get('/', async (ctx,next) => {
    // res.send('返回数据')
    ctx.body = 'router';// ctx.body返回数据
})
```
3. 注册路由
```
app
  .use(router.routes())
  .use(router.allowedMethods());// 这个是可选设置
```