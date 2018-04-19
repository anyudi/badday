<!----
  * 隐藏：人非草芥
  * 日期：2018/03/31
  * 时间：19:15
  * 作用：index 此处打码
--->
<template lang="html">

  <el-container>
    <el-header class="noPrint">
      <my-header></my-header>
    </el-header>
    <el-container>
      <el-aside width="200px"  class="noPrint">
        <main-left></main-left>
      </el-aside>
      <el-main>
        <router-view class=""></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import myHeader from '@/components/myHeader'
  import MainLeft from '@/components/MainLeft'
  export default {
    name: 'index',
    components:{
      'my-header': myHeader,
      'main-left': MainLeft,
    }
  }
</script>

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
</style>
