## CMD系统

### 路由设计
整个项目设计主要分为后台、前台和api三个大类。因此整个路由会先分成这三个子路由。
路由目录结构如下：
```
├── routes                                      // 路由目录
│   ├── admin                                      // admin部分子路由
│   │   ├── login.js                               // 登录路由
│   │   ├── user.js                                // 用户管理路由
│   ├── admin.js                                // admin部分路由
│   │
│   │── api.js                                  // api部分路由
│   │
│   │── index.js                                // index部分路由

```

