<template>
  <div>
    <div class="row">
      <div class="col-xs-12 x_title">
        <h3>笔记本商品列表</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-3">
        <form class="form-inline">
          <div class="form-group">
            <label for="page-size">每页显示记录数：</label>
            <select v-model="pageSize" class="form-control" id="page-size">
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
              <th>图片</th>
              <th>型号</th>
              <th>主标题</th>
              <th>规格</th>
              <th>单价</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="list.length == 0">
              <td colspan="8">
                <div class="loading">
                  <img
                    src="../assets/img/loading.gif" alt="">
                </div>
              </td>
            </tr>

            <tr v-for="product in list">
              <td><input type="checkbox"></td>
              <td>{{product.lid}}</td>
              <td><img
                style="width: 70px;height:70px"
                class="pic"
                :src="require('../assets/'+product.pic)"></td>
              <td><p class="fname" :title="product.fname">{{product.fname}}</p></td>
              <td><p class="title" :title="product.title">{{product.title}}</p></td>
              <td><p class="spec" :title="product.spec">{{product.spec}}</p></td>
              <td>￥{{product.price}}</td>
              <td>
                <a href="product_details.html">详情</a>
                <a href="product_update.html">修改</a>
                <a href="product_delete.html">删除</a>
              </td>
            </tr>


            </tbody>
          </table>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <ul class="pagination pull-right" id="pagination">
              <li v-if="pageNo >1">
                <a
                  @click="modifyPage(false)">
                  上一页
                </a>
              </li>

              <li
                v-for="tmp in pageList"
                :class="{active:pageNo == tmp}">
                <a @click="changePage(tmp)">
                  {{tmp}}
                </a>
              </li>

              <li v-if="pageNo < pageCount">
                <a @click="modifyPage(true)">
                  下一页
                </a>
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
    data: function () {
      return {
        list: [],
        pageSize: 10,
        pageNo:1,
        pageCount:1,
        pageList:[]
      }
    },
    watch:{
      pageSize:function(){
        this.pageNo = 1;
        this.loadProduct();
      }
    },
    methods:{
      //上一页 下一页调用的方法
      modifyPage:function(isNext){
        if(isNext){
          this.pageNo++;
        }
        else{
          this.pageNo--;
        }
        this.loadProduct();

      },
      changePage:function(nowPage){
        //加载对应页面的数据
        //高亮显示当前选中的页码
        this.pageNo = nowPage;
        this.loadProduct();

      },
      loadProduct:function(){
        this.$http
          .get('http://localhost/web1709/16vue/admin/data/product_list.php?pno='+this.pageNo+"&pageSize="+this.pageSize)
          .then((response) => {
            console.log(response.data);
            //保存产品列表
            this.list =
              response.data.data;
            //保存一共有几页
            this.pageCount =
              response.data.pageCount
            //初始化一个有this.pageCount数量的数组
            this.pageList = [];
            for(var i=0;i<this.pageCount;i++){
              var page = i+1;
              this.pageList.push(page)
            }
          })
      }
    },
    created: function () {
      //向服务器端获取商品列表的数据
      this.loadProduct();
    }
  }
</script>
