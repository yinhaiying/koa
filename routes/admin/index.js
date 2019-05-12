const Route = require('koa-router')
const router = new Route()

router.get('/',async (ctx) => {
  await ctx.render('admin/index')
})

router.get('/changeStatus',(ctx) => {
  console.log(ctx.query)
  ctx.body = {
    mesaage:'更新成功',
    success:true
  }
})

module.exports = router.routes()
