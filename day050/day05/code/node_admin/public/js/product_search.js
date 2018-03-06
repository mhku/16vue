//模块六:商品搜索
/**
 * 该函数完成产品搜索及页面元素创建
 * @param pno     当前页码
 * @param pageSize页大小
 * @param low     价格下限
 * @param high    价格上限
 * @param name    搜索商品名称中关键字
 */
function loadProduectSearch(pno,pageSize,low,high,name){
 //1:发送ajax请求
  $.ajax({
    type:"GET",
    url:"data/07_product_search.php",
    data:{pno:pno,pageSize:pageSize,low:low,high:high,name:name},
    success:function(data){
      //console.log(data);
      //1.1:创建当前页面内容
      var rows = data.data;
      var html = "";
      for(var i=0;i<rows.length;i++){
        var item = rows[i];
        html += `
              <tr>
                <th>
                  <div class="checkbox" style="margin: 0;">
                    <label>
                      <input type="checkbox">
                    </label>
                  </div>
                </th>
                <th>${item.lid}</th>
                <th><img src="${item.sm}" /></th>
                <th>${item.lname}</th>
                <th>${item.title}</th>
                <th>${item.spec}</th>
                <th>${item.price}</th>
                <th>
            <a href="#" class="btn-del">删除</a>
            <a href="#" class="btn-update">更新</a>
            <a href="#" class="btn-detail">详情</a>
               </th>
              </tr>        
        `;
      }  //10:23--10:25
      $("#tbody1").html(html);
      //1.2:创建分页条
      html = "";//清空原有数据
      data.pno = parseInt(data.pno);
      //上上一页
      if(data.pno-2>0){
        html += `
      <li><a href="#">${data.pno-2}</a></li>
      `;
      }
      //上一页
      if(data.pno-1>0){
        html += `
      <li><a href="#">${data.pno-1}</a></li>
      `;
      }
      //当前页
      html += `
      <li class="active"><a href="#">${data.pno}</a></li>
      `;
      //下一页
      if(data.pno+1<=data.pageCount){
        html += `
      <li><a href="#">${data.pno+1}</a></li>
      `;
      }
      //下下一页
      if(data.pno+2<=data.pageCount){
        html += `
      <li><a href="#">${data.pno+2}</a></li>
      `;
      }
      $("#pagination").html(html);
    },
    error:function(){
      alert("网络故障请检查");
    }
  });
}
loadProduectSearch(1,8,0,2100000,"");


//10:40--10:45
//模块七：用户输入 关键字 下限 上限 回车触发搜索功能
//1:获取上限元素
//2:绑定事件 keyup
$("#product-high").keyup(function(e){
 //3:获取用户输入的键代码 e.keyCode
 var code =  e.keyCode;
 //4:如果当前用户输入回车代码  13
 if(code==13) {
   //5:获取价格下限 上限 关键字
   var low  = $("#product-low").val();
   var high = $(this).val();
   var name = $("#product-kw").val();
   //console.log(low+":"+high+":"+name);
   //6:调用函数loadProduectSearch()
   loadProduectSearch(1,8,low,high,name);
 }
});















