<!----
  * 隐藏：人非草芥
  * 日期：2018/03/31
  * 时间：18:10
  * 作用：LeftMenu 此处打码
--->
<template lang="html">
    <div id='MainLeft' class="MainLeft">
      <dl class="LM-nav">
        <dt>菜单管理 <span class="menu-SS" style="display: none" @click=""><i class="fas fa-angle-double-left"></i><i class="fas fa-angle-double-right"></i></span></dt>
        <dd v-for="(menu,index) in menus"  :class="{'active':menu.guess}" @click="addClass(index)">
          <router-link :to="{path:menu.pathTo}"><i :class="menu.iClass"></i>{{menu.title}}</router-link>
        </dd>
      </dl>
    </div>
</template>
<script>
	export default {
		name: 'MainLeft',
		props: {},
		data(){
			return {
        menus:[
          {title:'基本查询',iClass:"fas fa-search",pathTo:'BasicSearch',guess:true},
          {title:'图表',iClass:'fas fa-chart-pie',pathTo:'charts',guess:false},
          {title:'动态警情对比',iClass:"far fa-hand-peace",pathTo:'',guess:false},
          {title:'动态警情对比',iClass:"far fa-hand-peace",pathTo:'',guess:false},
          {title:'每日治安动态',iClass:"far fa-hand-peace",pathTo:'',guess:false},
          {title:'智能预警',iClass:"far fa-hand-peace",pathTo:'',guess:false},
          {title:'系统维护',iClass:"far fa-hand-peace",pathTo:'',guess:false},




        ],
      }
		},
		//这个是钩子函数
		mounted: function () {
		},
		//这个是要执行的函数
		methods: {

      addClass(num){
        for(var i= 0;i<this.menus.length;i++){
          this.menus[i].guess=false;
        }
        this.menus[num].guess=true;
      }
    }
	}
</script>

<style lang="css" scoped>
  .MainLeft{width: 200px;position: fixed; left: 0px; top:60px; height: calc(100% - 60px); background: rgba(0,58,91,1); box-shadow: 2px 1px 3px rgba(0, 0, 0, 0.2); line-height: 36px; text-align: left; border-top: 1px solid rgba(255,255,255,.1);}
  .MainLeft dt{text-align: center; color: rgba(255,255,255,0.4); font-weight: bold;}
  .MainLeft dd>a{padding-left: 20px; position: relative; cursor: pointer;display: block; color: rgba(26,152,225,1); font-size: 14px; transition: all 0.3s; box-sizing: border-box;}
  .MainLeft dd:hover>a{background:rgba(255,255,255,0.05);transition: all 0.3s;}
  .MainLeft dd.active>a{background:rgba(0,0,0,0.2); color: rgb(255, 255, 255);font-size: 16px;transition: all 0.3s; border-right: 5px solid rgba(237,136,40,1); }
  .MainLeft dd i{margin-right: 10px;}
</style>
