<template>
    <div>
      <my-header><my-header>
      <h1>这是详情页面</h1>
      <button @click="goBack">
        返回上一页
      </button>
    </div>
</template>

<script>
  export default{
    created:function(){
      //接收传递来的参数
      console.log(
        this.$route.params.myIndex)
    },
    methods:{
      goBack:function(){
        this.$router.go(-1);
      }
    }
  }
</script>
