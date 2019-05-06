
class DB {
    // 单例模式确保只调用一次。
    static getInstance(){
        if(!DB.instance){
            DB.instance = new DB();
        }
        return DB.instance;
    }
    constructor(){
      this.connect();
    }
    connect(){
        // 连接数据库
        console.log('连接成功')
    }
    find(){
        // 查询数据库
    }

}

let db = DB.getInstance();
let db2 = DB.getInstance();



//引入mongodb下面的MongoClient
let MongoClient = require('mongodb').MongoClient;
// 定义连接地址
const url = 'mongodb://localhost:27017';
// 定义数据库名称
const dbName = 'koa';
// 创建MongoClient实例
const client = new MongoClient(url);
// 使用client实例去连接数据库,连接数据库时其实消耗非常多时间
client.connect(function(err) {
    const db = client.db(dbName);
    db.collection('user').insertOne({username:'杨幂',age:30})
    client.close();
});
