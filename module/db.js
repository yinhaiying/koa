// 封装Db类的原因：在mongodb中每次查询时都需要连接数据库。连接数据库需要消耗约
// 1000ms时间。事实上每次连接数据库都是通过创建一个新的client来进行连接，也就是说存在
// 多次连接数据库的问题。我们考虑使用单例模式来得到client实例。只创建一次client，
// 其他的client全都是第一次创建的实例。这样的话就只连接了一次。

const config = require('./config.js')

let MongoClient = require('mongodb').MongoClient;

class Db{
    static getInstance(){
        if(!Db.instance){
            Db.instance = new Db();
        }
        return Db.instance;
    }

    constructor(){
      // 每次重新实例化的时候，这个this都会发生变化。因此使用单例模式确保this不发生变化。
      // 也就是说每次得到的都是同一个实例。
      this.dbClient = '';
      this.connect();
    }
    //连接数据库
    connect(){
        console.log('连接成功')
        return new Promise((resolve,reject) =>{
            if(!this.dbClient){  // 解决数据库多次连接的问题
                MongoClient.connect(config.dbUrl,(err,client) => {
                    if(!err){
                      const db = client.db(config.dbName);
                      this.dbClient = db;
                      resolve(this.dbClient)
                    }else{
                      reject(err)
                    }
                })
            }else{
                resolve(this.dbClient)
            }

        })
    }
    //查询数据库
    find(collection,json){
      // 通过this.connect获取到db对象
      return new Promise((resolve,reject) => {
        this.connect().then((db) => {
            let result = db.collection(collection).find(json);
            result.toArray((err,docs) => {
              if(!err){
                  resolve(docs)
              }else{
                  reject(err)
              }
            })
        })
      })
    }
    // 更新数据
    update(collectionName,json1,json2){
        return new Promise((resolve,reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).updateOne(json1,{$set:json2},(err,result) => {
                    if(!err){
                        resolve(result)
                    }else{
                        reject(err)
                    }
                })
            })
        })
    }
    insert(collectionName,json){
        return new Promise((resolve,reject) => {
          this.connect().then((db) => {
            db.collection(collectionName).insertOne(json,(err,result) => {
              if(!err){
                  resolve(result)
              }else{
                  reject(err)
              }
            })
          })
        })
    }
    remove(collectionName,json){
        console.log('删除文档')
        return new Promise((resolve,reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).deleteOne(json,(err,result) => {
                    if(!err){
                        resolve(result)
                    }else{
                        reject(err)
                    }

                })
            })
        })
    }

}
// let db = Db.getInstance();
// db.find('user',{username:'刘亦菲'})
// .then((res) => {
//     console.log(res)
// })

module.exports = Db.getInstance();