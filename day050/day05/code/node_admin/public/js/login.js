//功能一：用户登录
$("#btn").click(function(e){
  //console.log(1);
  e.preventDefault();
  //console.log(2);
  var uname = $("#uname").val();
  var upwd  = $("#upwd").val();
  console.log(uname+"_"+upwd);
  //console.log(3);
  $.ajax({
    type:"POST",
    url:"/login",
    data:{uname:uname,upwd:upwd},
    success:function(data){
      if(data.code>0){
        alert(data.msg);
        location.href = "user_list.html";
      }else{
        alert(data.msg);
      }
    },
    error:function(){alert("网络故障请检查")}
  });
  console.log(4);
});
//14:51--15:00
//模块二:  /userlist  uid uname email

