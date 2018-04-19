<!----
  * 隐藏：人非草芥
  * 日期：2018/03/31
  * 时间：18:10
  * 作用：LeftMenu 此处打码
--->
<template lang="html">
    <div id='MainLeft' class="MainLeft">
      <dl class="LM-nav">
        <dt>菜单管理</dt>
        <dd v-for="(menu,index) in menus"  :class="{'active':menu.guess}" @click="addClass(index)">
          <router-link :to="{path:menu.pathTo}" v-text="menu.title"></router-link>
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
          {title:'基本查询',pathTo:'BasicSearch',guess:true},
          {title:'动态警情对比',pathTo:'',guess:false},
          {title:'动态警情对比',pathTo:'',guess:false},
          {title:'每日治安动态',pathTo:'',guess:false},
          {title:'智能预警',pathTo:'',guess:false},
          {title:'系统维护',pathTo:'',guess:false},
          {title:'图表',pathTo:'charts',guess:false},




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
  .MainLeft{width: 200px;position: fixed; left: 0px; top:60px; height: calc(100% - 60px); background: rgba(0,0,0,0.8); box-shadow: 2px 1px 3px rgba(0, 0, 0, 0.2); line-height: 36px; text-align: left;}
  .MainLeft dt{text-align: center; color: rgba(255,255,255,0.4); font-weight: bold;}
  .MainLeft dd>a{padding-left: 20px; position: relative; cursor: pointer;display: block; color: rgba(95,184,120,1); font-size: 14px; transition: all 0.3s;}
  .MainLeft dd:hover>a{background:rgba(255,255,255,0.05);transition: all 0.3s;}
  .MainLeft dd.active>a{background:rgba(0,0,0,0.2); color: rgb(255, 208, 75);font-size: 16px;transition: all 0.3s;}
</style>
