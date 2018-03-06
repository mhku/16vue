//
// 1:功能模块二:获取商品列表并且创元素
 function loadProductByPageNo(pno,pageSize) {
   //*2:发送ajax请求
   //*3:获取当前页内容
   //*4:创建当前面内容 dom
   $.ajax({
     type:"GET",
     url:"data/03_product_list.php",
     data:{pno:pno},
     success:function(data){
       //console.log(data); data.pno data.data
       var html = "";
       for(var item of data.data){
         html += `
              <tr>
                <th>
                  <div class="checkbox" style="margin: 0;">
                  <input type="checkbox">
                  </div>
                </th>
                <th>${item.lid}</th>
                <th><img src="${item.sm}" /></th>
                <th>型号</th>
                <th>${item.title}</th>
                <th>${item.spec}</th>
                <th>${item.price}</th>
                <th>
   `;
   if(item.expire=='0'){
      html += `
    <a href="${item.lid}" class="btn-del">删除</a>
    
    <a href="${item.lid}" 
    data-pname="${item.lname}" 
    data-price="${item.price}"    
    class="btn-update">更新</a>  
    <a href="${item.lid}" class="btn-detail">详情</a>
    <a href="${item.lid}" class="btn-upload">上传</a>
    `;
   }
   html += `</th></tr>`;
   }
   $("#tbody1").html(html);//当前页内容拼接完成

       //创建html拼接页码[1][2][3]
       data.pno = parseInt(data.pno);
       var html = "";//创建新变量 html
       //上上一页
       if(data.pno-2>0){
        html += `<li><a href="#">${data.pno-2}</a></li>`;
       }
       //上一页
       if(data.pno-1>0){
       html +=   `<li><a href="#">${data.pno-1}</a></li>`;
       }
       //当前页
       html += `<li class="active"><a href="#">${data.pno}</a></li>`;
       //下一页
       if(data.pno+1<=data.pageCount){
       html += `<li><a href="#">${data.pno+1}</a></li>`;
       }
       //下下一页
       if(data.pno+2<=data.pageCount){
         html += `<li><a href="#">${data.pno+2}</a></li>`;
       }
      $("#pagination").html(html);

     },
     error:function(){
       alert("网络故障，请检查");
     }
   });

  //5:页码  1 2 3 4 5
  //[1][2][3]
  //       |
  //[1][2][3][4][5]   14:34--14:44
 }
 loadProductByPageNo(1,8);
// 2:为页码绑定点击事件  1 2 3 4 5 事件代理
//   调用函数
$("#pagination").on("click","li a",function(e){
   //1:阻止事件默认行为 a
   console.log(1);
   e.preventDefault();
  console.log(2);
   //2:获取当前页码
   var pno = parseInt($(this).html());
  console.log(3);
   //3:调用函数即可
   loadProductByPageNo(pno,8);
  console.log(4);
});



//功能模块三:删除指定商品 11:41--11:47
//1:获取删除按钮并且绑定点击事件
$("#tbody1").on("click","a.btn-del",function(e){
  //2:阻止事件默认行为 a
  e.preventDefault();
  //console.log(1);
  //3:获取当前商品编号 lid
  var lid = $(this).attr("href");
  //3.1:询问是否删除指定记录
  var rs = window.confirm("是否删除指定数据");
  if(!rs){
    return;//停止程序执行
  }
  //4:发送ajax请求  04_product_del.php
  //console.log(2);
  //console.log(rs);
  $.ajax({
    type:"POST",
    url:"data/04_product_del.php",
    data:{lid:lid},
    success:function(data){
      //console.log(data);
      if(data.code>0){
        alert(data.msg);
        loadProductByPageNo(1,8);
      }else{
        alert(data.msg);
      }
    },
    error:function(){
      alert("网络故障，请检查")
    }
  });
  //5:获取返回数据
  //6:如果成功 调用分页数
});


//功能模块四:商品价格更新->显示更新div
//1:获取更新按钮  事件代理
$("#tbody1").on("click","a.btn-update",function(e){
  //2:绑定点击事件
  //3:阻止事件默认行为
  e.preventDefault();
  //4:获取商品名称，商品价格(??)
  var pn  = $(this).data("pname");
  var pr  = $(this).data("price");
  var lid = $(this).attr("href");
  //console.log(pn+"_"+pr+"_"+lid);
  //5:保存 .update-jumbotron  .pname 商品名称
  //  .input-price              商品价格
  $(".pname").html(pn);
  $(".input-price").val(pr);
  //6:显示 .update-jumbotron
  $("[data-action='update-ok']").data("lid",lid);
  $(".update-jumbotron").show();
});

//模块四:产品价格更新--更新
//1:为("确定")按钮绑定点击事件
$("[data-action='update-ok']").click(function(e){
  e.preventDefault();
  //console.log(1);
  //2:获取
  var price = $(".input-price").val();
  var lid =  $(this).data("lid");
  //console.log(price+"_"+lid);
  //3:发送ajax
  $.ajax({
    type:"POST", //14:45--14:55
    url:"data/05_product_update.php",
    data:{lid:lid,price:price},
    success:function(data){
      if(data.code>0){
        alert(data.msg);
        loadProductByPageNo(1,8);
      }else{
        alert(data.msg);
      }
      $(".update-jumbotron").hide();
    },
    error:function(){alert("网络故障请检查");}
  });
});
//2:为("取消")按钮绑定点击事件
$("[data-action='update-cancel']").click(function(e){
  e.preventDefault();
  //console.log(2);
  $(".update-jumbotron").hide();
});


//模块五:产品详细信息
//1:获取详情按钮-->事件代理
//2:绑定点击事件
$("#tbody1").on("click","a.btn-detail",function(e){
 e.preventDefault();
 //3:获取产品编号 lid
 var lid = $(this).attr("href");
 //4:发送ajax   06_product_detail.php
 $.ajax({
   type:"GET",
   url:"data/06_product_detail.php",
   data:{lid:lid},
   success:function(data){
     //5:将产品编号,名称,价格,类别,cpu,磁盘保存对应span
     var div = $(".detail-jumbotron");
     div.find(".plid").html(data.lid);
     div.find(".ppname").html(data.lname);
     div.find(".pcategory").html(data.category);
     div.find(".pprice").html(data.price);
     div.find(".pos").html(data.cpu);
     div.find(".pdisk").html(data.disk);
     div.show();
     //6:显示div detail-jumbotron
   },
   error:function(){alert("网络故障请检查!");}
 });
});

//功能模块七:拖动上传文件
//1:为上传图片按钮绑定点击事件
$("#tbody1").on("click","a.btn-upload",function(e){
  //2:阻止事件默认行为
  e.preventDefault();
  //3:显示上传对话框
  $(".upload-jumbotron").show();
  //4:获取商品编号
  var lid = $(this).attr("href");
  //console.log(1);
  //console.log(lid);
  //5:阻止document默认行为 (进入/离开/悬停/释放)
  $(document).on({
    dragenter:function(e){e.preventDefault()},
    dragover:function(e){e.preventDefault()},
    dragleave:function(e){e.preventDefault()},
    drop:function(e){e.preventDefault()}
  });
  //6:获取 拖拽的区域  .drop_area
  var drop_area = document.querySelector(".drop_area");
  //7:为拖拽的区域 释放事件
  drop_area.ondrop = function(e){
    //8:阻止事件默认行为
    e.preventDefault();
    //console.log(3);
    //9:获取拖动文件信息
    var fileInfo = e.dataTransfer.files;
    //console.log(fileInfo[0]);
    //10:47--10:50
    //10:获取文件大小判断
    //不能超过2MB
    var size = Math.ceil(fileInfo[0].size/1024);
    if(size>2048){
      alert("上传图片太大，不能超过2MB");
      return;
    }
    //11:获取文件类型 必须图片 image
    var type = fileInfo[0].type.indexOf("image");
    if(type==-1){
      alert("只能上传图片格式的文件");
      return;
    }
    //12:图片预览
    //13:创建预览图片的对象.(webkitURL读取图片)
    //webkitURL 旧
    var img = window.webkitURL
      .createObjectURL(fileInfo[0]);
    var html = `<img src="${img}" width="120" height="80"/>`;
    //14:显示预览图片
    $(".preview").html(html);
    //预览图片结束

    //15:上传图片:将上传图片保存FormData对象
    //    再通过ajax上传
    //16:创建FormData对象
    var fd = new FormData();
    //17:添加参数!!!!!! php $_FILES["mypic"]
    //一致
    fd.append("mypic",fileInfo[0]);
    fd.append("lid",lid);//10:25--10:35
    //18:创建ajax对象上传
    var xhr = new XMLHttpRequest();
    //19:事件
    xhr.onreadystatechange = function(){
      console.log(xhr.responseText);
    }
    //20:打开连接
    xhr.open("POST","data/08_product_upload.php",true);
    //21:修改请求头
    xhr.setRequestHeader("X-Requested-With",
      "XMLHttpRequest");
    //22:发送数据
    xhr.send(fd);
  }














});































