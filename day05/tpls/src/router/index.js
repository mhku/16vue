import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Test from '@/components/Test'
import List from '@/components/List'
import Detail from '@/components/Detail'

import MyHeader from '@components/MyHeader'

Vue.component('my-header',MyHeader)

//调用一个组件
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: List
    },
    {
      path:'/myList',
      component: List
    },
    {
      path:'/myDetail/:myIndex',
      component: Detail
    }
  ]
})
