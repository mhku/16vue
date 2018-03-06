//nodejs 学子商城:登录
//1:加载对应模块
//  http
//  express
//  mysql
//  body-parser  处理post请求参数
const http = require("http");
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
//2:创建连接池
var pool = mysql.createPool({
  host:"127.0.0.1",
  user:"root",
  password:"",
  database:"xuezi",
  port:3306,
  connectionLimit:25
});
//3:创建服务器 3000
var app = express();
var server = http.createServer(app);
server.listen(3000);
//4:加载静态目录 public
app.use(express.static("public"));
//5:配置 body parser
app.use(bodyParser.urlencoded({extended:false}));

//6:处理登录请求   14:25--15:35
//post /login  req.body.uname  req.body.upwd
app.post("/login",(req,res)=>{
    var uname = req.body.uname;
    var upwd = req.body.upwd;

    var sql = "SELECT uid FROM xz_user";
    sql += " WHERE uname = ? AND upwd = ?";
    pool.getConnection((err,conn)=>{
      if(err)throw err;
      conn.query(sql,[uname,upwd],(err,result)=>{
             if(err)throw err;
             if(result.length>0){
               res.json({code:1,msg:"登录成功"});
             }else{
               res.json({code:-1,msg:"用户名密码有误"});
             }
      });
    })
});

//6:处理登录请求   15:52--16:02
//get /userlist
//#pno       当前页码
//#pageSize  页大小
//{
//  pno:1,
//  pageSize:8,
//  data:[],
//  pageCount:6
//}
app.get("/userlist",(req,res)=>{
  var output = {
    pno:1,        //当前页数
    pageSize:1,   //页大小
    pageCount:1,  //总页数
    data:[]       //当前页内容
  };

  //解决一个问题:
  //发送二条sql语句，希望都执行完成再发送json
  var progress = 0;
  var pno = req.query.pno;
  var pageSize = req.query.pageSize;
  if(!pno){
    pno = 1;
  }
  if(!pageSize){
    pageSize = 8;
  }
  var sql = " SELECT uid,uname,email,phone";
  sql += " FROM xz_user LIMIT ?,?";

  //造型整型数值
  var offset = parseInt((pno-1)*pageSize);
  pageSize = parseInt(pageSize);

  pool.getConnection((err,conn)=>{
    if(err)throw err;
    conn.query(sql,[offset,pageSize],(err,result)=>{
    if(err)throw err;
    output.pno = pno;          //当前页数
    output.pageSize = pageSize;//页大小
    output.data = result       //当前页内容
    progress += 50;
    if(progress == 100) {
      res.json(output);
    }
    conn.release();     //关闭连接
    });//query end
  });//conn end
  pool.getConnection((err,conn)=>{
    if(err)throw err;
    var sql = "SELECT count(uid) AS c";
    sql += " FROM xz_user";
    //console.log(10);
    //console.log(sql);
    conn.query(sql,(err,result)=>{
      if(err)throw  err;
      //console.log(11);
      var count = result[0]["c"];
      //console.log(12);
      //console.log(count);//16:47--16:50
      output.pageCount = Math.ceil(count/output.pageSize);
      progress += 50;
      if(progress==100) {  //
        res.json(output);
      }
      conn.release();
    });
  });
});


//模块二:删除指定用户
//17:30--17:40
//更新:xz_user  (expire=='0'=>'1')
//ALTER TABLE xz_user ADD expire
//ENUM('0','1') NOT NULL  DEFAULT '0'
//get /userdel   uid  json
app.get("/userdel",(req,res)=>{
  var uid = parseInt(req.query.uid);
  pool.getConnection((err,conn)=>{
    if(err)throw err;
    //console.log(1);
    var sql = "UPDATE xz_user SET expire = '1'";
    sql += " WHERE uid = ? AND expire = '0'";
    conn.query(sql,[uid],(err,result)=>{
      if(err)throw err;
      //console.log(2);
      //console.log(result);
      if(result.affectedRows>0){
        res.json({code:1,msg:"删除成功"});
      }else{
        res.json({code:-1,msg:"删除失败"});
      }
      conn.release();
    });
  });
});

//模块三:用户详细  get /userdetail 参数uid
// 返回json 用户列表信息  11:30--11:40
app.get("/userdetail",(req,res)=>{
  //1:获取用户参数 uid
  var uid = req.query.uid;
  //2:创建sql语句
  var sql = " SELECT uid,uname,phone,email";
  sql += " FROM xz_user WHERE uid = ?";
  //3:从连接池中获取连接发送sql并且释放
  pool.getConnection((err,conn)=>{
    if(err)throw err;
    conn.query(sql,[uid],(err,result)=>{
      if(err)throw err;
      res.json(result);
      conn.release();
    });
  });
});  //11:46--11:56
//模块四:用户更新  get /userupdate 参数uid
//  oldupwd newpwd    14:12--14:17
app.get("/userupdate",(req,res)=>{
  var uid      =   req.query.uid;
  var oldupwd  =   req.query.oldupwd;
  var newupwd   =   req.query.newupwd;
  var sql1 = "SELECT uid FROM xz_user WHERE uid=? AND upwd=?";
  var sql2 = "UPDATE xz_user SET upwd=? WHERE uid=?";
  pool.getConnection((err,conn)=>{
    if(err)throw err;
    conn.query(sql1,[uid,oldupwd],(err,result)=>{
      if(err)throw err;
      if(result.length > 0){
        //旧密码输入正确 14:25--14:30
        //res.json({code:1,msg:"密码正确"});
        conn.query(sql2,[newupwd,uid],(err,result)=>{
           if(err)throw err;
           if(result.affectedRows>0){
             res.json({code:1,msg:"更新成功"});
           }else{
             res.json({code:-1,msg:"更新失败"});
           }
           conn.release();
        })
      }else{
        res.json({code:-1,msg:"密码错误"});
      }
      //conn.release();
    })
  });
});

//
//模块五:用户搜索  get /usersearch 参数uname
//返回json 用户列表信息
app.get("/usersearch",(req,res)=>{
  var output = {
    pno:1,        //当前页数
    pageSize:1,   //页大小
    pageCount:1,  //总页数
    data:[]       //当前页内容
  };

  //1:控制执行程序过程  sql1 count sql2
  var progress = 0;
  //2:参数
  var uname = req.query.uname;      //搜索用户名
  var pno = req.query.pno;          //当前页
  var pageSize = req.query.pageSize;//当前行数
  if(!uname){                       //判断
    uname = "";
  }
  if(!pno){
    pno = 1;
  }
  if(!pageSize){
    pageSize = 8;
  }
  //3:第一条sql语句 查询总记录
  var sql1 = "SELECT count(uid) as c FROM";
  sql1 += " xz_user WHERE uname LIKE ?";
  pool.getConnection((err,conn)=>{
    if(err)throw err;
    conn.query(sql1,[`%${uname}%`],(err,result)=>{
      if(err)throw err;
      var totalCount = result[0]["c"];
      output.pageCount =
        Math.ceil(totalCount/pageSize);
        progress+=50;
        if(progress==100) {
          res.json(output);
        }
        conn.release();
      });
  });
  //3:第二条sql语句 查询当前页内容 LIKE
   var offset = parseInt((pno-1)*pageSize);
   pageSize = parseInt(pageSize);
   var sql2 = ` SELECT uid,uname,email`;
   sql2 += ` FROM xz_user`;
   sql2 += ` WHERE uname LIKE '%${uname}%'`;
   sql2 += ` LIMIT ${offset},${pageSize}`;

   pool.getConnection((err,conn)=>{
     if(err)throw err;
     conn.query(sql2,(err,result)=>{
       if(err)throw err;
       progress += 50;
       if(progress==100){
         output.pno = pno;          //当前页码
         output.pageSize = pageSize;//页大小
         output.data = result;      //当前页内容
         res.json(output);
       }
       conn.release();
     });
   })
});
//模块六:订单分页  get /orders      参数pno,pageSize
//1:添加5条记录           15:57-16:02
app.get("/orders",(req,res)=>{
  //2:获取参数 pno pageSize 并且判断
  var pno = req.query.pno;
  var pageSize = req.query.pageSize;
  if(!pno){
    pno = 1;
  }
  if(!pageSize){
    pageSize = 8;
  }

  var progress = 0;
  var output = {
    pno:pno,        //当前页数
    pageSize:pageSize,   //页大小
    pageCount:1,  //总页数
    data:[]       //当前页内容
  };


  //3:创建sql1 查询总页数
  var sql1 = " SELECT count(aid) AS c";
  sql1 += " FROM xz_order";
  pool.getConnection((err,conn)=>{
    if(err)throw err;
    conn.query(sql1,(err,result)=>{
      progress+=50;               //加载进度增50
      var counts = result[0]["c"];//总记录数
      output.pageCount =
        Math.ceil(counts/pageSize);//总页数
      if(progress==100) {          //如果二次发送结束
        res.json(output);          //发送output
        conn.release();
      }
    });
  });
  //4:创建sql2 查询当前页内容 	status/user_id ?
  var offset = parseInt(pno/pageSize);
  pageSize = parseInt(pageSize);
  var sql2 = " SELECT o.aid,o.user_id,o.status";
  sql2 += " ,o.order_time,u.uname";
  sql2 += " FROM xz_order o,xz_user u";
  sql2 += " WHERE o.user_id = u.uid";
  sql2 += " LIMIT ?,?";
  pool.getConnection((err,conn)=>{
    if(err)throw err;
    conn.query(sql2,[offset,pageSize],(err,result)=>{
      progress+=50;
      output.data = result;
      if(progress==100) {
        res.json(output);
        conn.release();
      }
    });
  });
});
//模块七:订单删除  get /orderdel    参数oid
//ALTER TABLE xz_order ADD expire
//ENUM('1','0') NOT NULL DEFAULT '0'
app.get("/orderdel",(req,res)=>{
  //1:为订单表添加一列 expire enum('1','0')
  //2:获取参数aid
  var aid = req.query.aid;
  if(!aid){
    res.json({code:-1,msg:"参数不能为空"});
    return;
  }
  //3:创建sql语句 UPDATE
  var sql = "UPDATE xz_order SET expire = '1'";
  sql += " WHERE aid=?";
  //4:发送成功失败
  pool.getConnection((err,conn)=>{
    if(err)throw err;
    conn.query(sql,[aid],(err,result)=>{
      if(result.affectedRows>0){
        res.json({code:1,msg:"删除成功"});
      }else{
        res.json({code:-1,msg:"删除失败"});
      }
      conn.release();
    });
  });
});
//17:40--17:50
//模块八:订单更新  get /orderupdate 参数aid,status
app.get("/orderupdate",(req,res)=>{
  var aid = req.query.aid;
  var status = req.query.status;
  if(!aid){
    res.json({code:-1,msg:"aid参数不能为空"});
    return;
  }
  if(!status){
    res.json({code:-2,msg:"status参数不能为空"});
    return;
  }
  var sql = "UPDATE xz_order SET status=?";
  sql += " WHERE aid = ?";
  //造型 17:55--18:00
  status = parseInt(status);
  aid = parseInt(aid);
  pool.getConnection((err,conn)=>{
    if(err)throw err;
    conn.query(sql,[status,aid],(err,result)=>{
       if(err)throw err;
       if(result.affectedRows>0){
         res.json({code:1,msg:"更新成功"});
       }else{
         res.json({code:-1,msg:"更新失败"});
       }
       conn.release();
    });
  });
});
//模块九:订单详情  get /orderdetail 参数aid
//模块十:订单搜索  get /ordersearch 参数aname
//模块十一:首页图片轮播  get /indeximgs   参数
//模块十二:首页图片轮播  get /indexupdate 参数

//Error: Can't set headers after they are sent.
//原因:一个请求地址中  res.json() 多次












