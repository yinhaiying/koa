let Router = require('koa-router');
let router = new Router();
const DB = require('../../model/db.js')
const tools = require('../../tools/tools.js')


router.get('/',async (ctx) => {
  var result=await DB.find('articlecate',{});

  console.log(tools.cateToList(result));
  await  ctx.render('admin/articlecate/index',{
      list: tools.cateToList(result)
  });
})

/**
 * 增加分类页面展示
 *
 */
router.get('/add',async (ctx) => {

  // 获取一级分类
  let result =await DB.find('articlecate',{pid:'0'})

  await ctx.render('admin/articlecate/add',{
    catelist:result
  })
})


/**
 * 增加分类:
 * 1.获取表单提交的数据
 * 2.验证数据是否合法
 * 3.在数据库中查询管理员是否已经存在
 * 4.添加管理员
 *
 */
router.post('/doAdd',async (ctx) => {
  // 1.获取表单数据
  let data = ctx.request.body;
  console.log(data)
  // 2. 数据库中查询该分类是否存在
  let result = await DB.find('articlecate',{title:data.title});
  console.log(result)
  if(result.length == 0){
  // 4. 新增分类
    let result = await DB.insert('articlecate',data)
    const adminList = await DB.find('articlecat',{pid:'0'});
    await ctx.render('admin/articlecate/add',{
      catelist:result
    })
  }else{
    ctx.render('admin/error',{
      message:'该分类已经存在',
      url:ctx.state.__HOST__ + '/admin/articlecate/add'
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
