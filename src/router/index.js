import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import login from '@/components/login'
import index from '@/components/index'
import BasicSearch from '@/components/BasicSearch'
import charts from '@/components/charts'
import typeSearch from '@/components/typeSearch'

/********   typeSearch   *****/
Vue.use(Router);
window.eventBus = new Vue();

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [

    {path: '', component:login},
    {path: '/login',name:'login' , component:login},
    {
      path: '/index', name: 'index', component: index,redirect:'/BasicSearch',
      children: [
        {path: '/BasicSearch',name: 'BasicSearch',component: BasicSearch},
        {path: '/typeSearch',name: 'typeSearch',component: typeSearch},
        {path: '/charts',name: 'charts',component: charts},
      ]
    }
  ]
})
