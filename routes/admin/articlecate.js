let Router = require('koa-router');
let router = new Router();
const DB = require('../../model/db.js')
const tools = require('../../tools/tools.js')


router.get('/',async (ctx) => {
  ctx.body = 'articlecates'
})

/**
 * 增加管理员页面展示
 *
 */
router.get('/add',async (ctx) => {
  await ctx.render('admin/manage/add')
})


/**
 * 增加管理员:
 * 1.获取表单提交的数据
 * 2.验证数据是否合法
 * 3.在数据库中查询管理员是否已经存在
 * 4.添加管理员
 *
 */
router.post('/doAdd',async (ctx) => {
  // 1.获取表单数据
  let data = ctx.request.body;
  data.password = tools.md5('123456');
  // 2. 数据库中查询管理员是否存在
  let result = await DB.find('admin',{username:data.username});
  console.log(result)
  if(result.length == 0){
  // 4. 新增管理员
    let json = {
      username:data.username,
      password:tools.md5(data.password),
      status:0,
      last_time:new Date()
    }
    let result = await DB.insert('admin',json)
    const adminList = await DB.find('admin',{});
    // console.log(result)
    await ctx.render('admin/manage/list',{
      list:adminList
    })
  }else{
    ctx.render('admin/error',{
      message:'该管理员已经存在',
      url:ctx.state.__HOST__ + '/admin/manage/add'
    })
  }

})



/**
 * 编辑管理员:
 * 1.根据id通过查询数据库获取到相对应的文档数据
 * 2.跳转后将获取到的数据直接展示出来
 */
router.get('/edit',async (ctx) => {
  let userInfo = await DB.find('admin',{"_id":DB.getObjectId(ctx.query.id)})
  await ctx.render('admin/manage/edit',{userInfo:userInfo[0]})
})

router.post('/doEdit',async (ctx) => {
  // console.log(ctx.request.body)
  await DB.update('admin',{"_id":DB.getObjectId(ctx.request.body.id)},{username:ctx.request.body.username})
  await ctx.render('admin/manage/edit',{list:ctx.request.body})
})


/**
 * 删除管理员:
 * 1.根据id通过查询数据库获取到相对应的文档数据
 * 2.跳转后将获取到的数据直接展示出来
 */
router.get('/delete',async (ctx) => {
  let data = await DB.remove('admin',{"_id":DB.getObjectId(ctx.query.id)});
  const adminList = await DB.find('admin',{});
  if(data.result.ok == 1){
    // console.log(result)
    await ctx.render('admin/manage/list',{
      list:adminList
    })
  }else{
    ctx.render('admin/error',{
      message:'删除失败',
      url:ctx.state.__HOST__ + '/admin/manage/list'
    })
  }

})


module.exports = router.routes();
