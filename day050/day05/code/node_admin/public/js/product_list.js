//
// 1:功能模块二:获取商品列表并且创元素
 function loadProductByPageNo(pno,pageSize) {
   //*2:发送ajax请求
   //*3:获取当前页内容
   //*4:创建当前面内容 dom
   $.ajax({
     type:"GET",
     url:"data/02_product_list.php",
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
                <th>图片</th>
                <th>型号</th>
                <th>${item.title}</th>
                <th>规格</th>
                <th>${item.price}</th>
                <th>
   <a href="${item.lid}" class="btn-del">删除</a>
   <a href="${item.lid}" class="btn-update">更新</a>
   <a href="${item.lid}" class="btn-detail">详情</a>
                </th>
              </tr>
         `;
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




