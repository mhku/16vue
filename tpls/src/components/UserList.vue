<template>
  <div>
    <div class="row">
      <div class="col-xs-12 x_title">
        <h3>用户列表</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-3">
        <form class="form-inline">
          <div class="form-group">
            <label for="page-size">每页显示记录数：</label>
            <select
              v-model="pageSize"
              class="form-control" id="page-size">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="60">60</option>
              <option value="80">80</option>
              <option value="100">100</option>
            </select>
          </div>
        </form>
      </div>
      <div class="col-xs-4 col-xs-offset-5">
        <div class="form-group has-feedback">
          <label for="product-kw" class="sr-only">搜索关键字：</label>
          <input class="form-control" type="text" id="product-kw" placeholder="请输入搜索关键字">
          <span class="glyphicon glyphicon-search form-control-feedback"></span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <div class="table-responsive">
          <table class="table table-hover table-striped" id="table-laptop">
            <thead>
            <tr>
              <th>
                <div class="checkbox" style="margin: 0;">
                  <label>
                    <input type="checkbox">全选
                  </label>
                </div>
              </th>
              <th>编号</th>
              <th>头像</th>
              <th>登录名</th>
              <th>用户名</th>
              <th>性别</th>
              <th>邮箱</th>
              <th>电话</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="list.length == 0">
              <td colspan="8">
                <div class="loading">
                  <img src="../assets/img/loading.gif" alt="">
                </div>
              </td>
            </tr>

            <tr v-for="user in list">
              <td><input type="checkbox"></td>
              <td>{{user.uid}}</td>
              <td><img class="pic" :src="require('../assets/'+user.avatar)"></td>
              <td><p class="fname" >{{user.uname}}</p></td>
              <td><p class="title" >{{user.user_name}}</p></td>
              <td><p class="spec" >{{user.gender}}</p></td>
              <td><p class="spec" >{{user.email}}</p></td>
              <td><p class="spec" >{{user.phone}}</p></td>
              <td>
                <a href="user_details.html">详情</a>
                <a href="user_update.html">修改</a>
                <a href="user_delete.html">删除</a>
              </td>
            </tr>

            </tbody>
          </table>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <ul class="pagination pull-right" id="pagination">
              <li v-if="pageNo > 1">
                <a href="#">
                  上一页
                </a>
              </li>

              <li :class="{active:page==pageNo}" v-for="page in pageList">
                <a >{{page}}</a>
              </li>

              <li v-if="pageNo < pageCount">
                <a href="#">下一页</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <br>
  </div>
</template>

<script>
  export default{
    data:function(){
      return {
        list:[],
        pageSize:10,
        pageNo:1,
        pageCount:1,
        pageList:[]
      }
    },
    created:function(){
      //请求到用户列表的数据
      this.loadUserList();
    },
    methods:{
      loadUserList:function(){
        this.$http.get('http://localhost/web1709/16vue/admin/data/user_list.php?pageSize='+this.pageSize+'&pno='+this.pageNo)
          .then((response)=>{
            this.list = response.data.data;
            //保存一共有几页
            this.pageCount = response.data.pageCount;
            //初始化一个指定数量元素的数组
            this.pageList = [];
            for(var i=0;i<this.pageCount;i++){
              var page = i+1;
              this.pageList.push(page);
            }
        })
      }
    },
    watch:{
      pageSize:function(){
        this.loadUserList();
      }
    }
  }
</script>
