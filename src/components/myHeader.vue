<!----
  * 隐藏：人非草芥
  * 日期：2018/03/31
  * 时间：16:16
  * 作用：header 此处打码
--->
<template lang="html">
  <div id="myHeader" class="myHeader">
    <div class="logo"><a href="http://47.98.172.119:8761/swagger-ui.html#!/ajb-controller/findAjlxUsingGET" target="_blank">{{logo}}</a></div>
    <ul class="topMunu">
      <li>测试</li>
      <li>测试</li>
      <li>测试</li>
    </ul>
  </div>
</template>
<script>
	export default {
		name: 'myHeader',
		props: {},
		data(){
			return {
				logo:"警情在线分析处理",
      }
		},
		//这个是钩子函数
		mounted: function () {
		},
		//这个是要执行的函数 addCar.vue

    methods: {}
	}
</script>

<style lang="css" scoped>
  .myHeader{ text-align:left; box-sizing: border-box;}
  .logo{ display: inline-block;  font-size: 28px; font-weight: bold; background: url("../assets/images/logo.png") left center no-repeat;  background-size: 50px 50px;}
  .logo a{ color: #FFF; line-height: 60px; display: inline-block;  padding-left: 70px;}
  .topMunu{ margin:0;  padding: 0; display: inline-block; float:right;}
  .topMunu li{ padding: 5px; margin: 3px; display: inline-block;}
</style>
