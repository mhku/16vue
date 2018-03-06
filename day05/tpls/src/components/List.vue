<template>
  <div>
    <my-header><my-header>
    <ul>
        <li v-for="(tmp,index) in list">
          <button @click="jump(index)">
            {{tmp}}
          </button>
        </li>
      </ul>
  </div>
</template>

<script>
  //import MyHeader from '@components/MyHeader'
  //Vue.component('my-header',MyHeader)
  export default{
    methods:{
      jump:function(index){
        this.$router
          .push('/myDetail/'+index)
      }
    },
    data:function(){
      return {list:[100,200,300]}
    }
  }
</script>

<style>
  ul{
    background-color:#ff0000
  }
</style>
