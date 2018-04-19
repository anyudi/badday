<!----
  * 隐藏：人非草芥
  * 日期：2018/03/01
  * 时间：14:00
  * 作用：Header 此处打码
--->
<template lang="html">
  <header class="box">
    <div class="logo">
      <div class="logi_ico"></div>
    </div>
    <div class="logo_text">
      <h2>{{headerTitle}},{{titlex}}</h2>
      <h3>{{headerTitle}}</h3>
      <p>{{headerTitle}}</p>
    </div>
    <button type="button" @click="delecttitlex"> 子组件向父组件传值</button>
  </header>
</template>
<script>
    export default {
      name: 'headerApp',
      props:{
        titlex:{
        	type:String
        }
      },
      data(){
          return{
            headerTitle:'不要开倒车'
          }
      },
      methods: {
        delecttitlex:function () {
          //this.titlex = '改变改变改变';
          //$emit(事件名称,事件内容)
          this.$emit('titleChange',"子组件向父组件传值")
        }
      },
      /*

      //组件 实例化 之前的方法
      beforeCreate(){
      	alert("组件实例化之前执行的函数")
      },
      //组件 实例化结束   但页面未显示
      created(){
        alert(" 实例化结束,但页面未显示")
      },
      //组件挂载前,页面未显示,  但虚拟dom已经配置
      beforeMount(){
        alert(" 组件挂载前,页面未显示,  但虚拟dom已经配置")
      },
      //组件已经挂载,方法执行后,页面显示
      mounted(){
        alert(" 组件已经挂载,方法执行后,页面显示")
      },
      //增删改查
      //组件更新前,页面仍未更新,虚拟dom已经配置
      beforeUpdata(){
        alert(" 组件更新前,页面仍未更新,虚拟dom已经配置")
      },
      // 组件更新,方法执行后,页面显示
      updata(){
        alert(" 组件更新,方法执行后,页面显示")
      },
      beforeDestory(){
        alert(" 组件销毁前")
      },
      destory(){
        alert(" 组件销毁")
      }
*/
    }
</script>

<style lang="css" scoped>
  .box{border-left: 12px solid rgba(0, 0, 0, 0.12); box-sizing: border-box; position: relative;background: rgba(153,185,152,1); height: 120px;}
  .logo{background:rgba(234,73,95,1); border-radius: 20px; width: 80px; height: 80px; position: absolute;left: 20px; top:20px; }
  .logi_ico{ background: #fff;border-radius: 50%; width: 50px; height: 50px; position: absolute; left: 15px; top:15px;}
  .logo_text{ margin-left: 120px;}
  h2{color: #1a1c1d; font-size: 18px;}
  h3{font-size: 14px;color: rgba(0, 0, 0, 0.65);}
  .logo_text p{font-size: 12px;color: white;}
</style>
