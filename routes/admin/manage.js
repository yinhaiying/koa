let Router = require('koa-router');
let router = new Router();
const DB = require('../../model/db.js')

router.get('/',async (ctx) => {
  const adminList = await DB.find('admin',{});
  // console.log(result)
  await ctx.render('admin/manage/list',{
    list:adminList
  })
})
router.get('/add',async (ctx) => {
  await ctx.render('admin/manage/add')
})




module.exports = router.routes();
