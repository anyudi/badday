import Vue from 'vue'
import Router from 'vue-router'

import login from '@/components/login'
import index from '@/components/index'
import BasicSearch from '@/components/BasicSearch'
import charts from '@/components/charts'
import typeSearch from '@/components/typeSearch'
import chartHH from '@/components/chartHH'
import shiduanchaxun from '@/components/shiduanchaxun'
import bjhm from '@/components/bjhm'
import hjzt from '@/components/hjzt'
import hjztChart from '@/components/hjztChart'
import zby from '@/components/zby'
import zbyChart from '@/components/zbyChart'
import ssxq from '@/components/ssxq'
import ssxqChart from '@/components/ssxqChart'

/********   ssxqChart   *****/
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
        {path: '/chartHH',name: 'chartHH',component: chartHH},
        {path: '/shiduanchaxun',name: 'shiduanchaxun',component: shiduanchaxun},
        {path: '/bjhm',name: 'bjhm',component: bjhm},
        {path: '/hjzt',name: 'hjzt',component: hjzt},
        {path: '/hjztChart',name: 'hjztChart',component: hjztChart},
        {path: '/zby',name: 'zby',component: zby},
        {path: '/zbyChart',name: 'zbyChart',component: zbyChart},
        {path: '/ssxq',name: 'ssxq',component: ssxq},
        {path: '/ssxqChart',name: 'ssxqChart',component: ssxqChart},
      ]
    }
  ]
})
