<template lang="html">
  <div>

    <form @submit="addUser">
      <input type="text" v-model="user" placeholder="请输入用户名">
      <input type="text" v-model="password">
      <button type="submit">提交</button>
    </form>

  <form>
    addUser:function (e){
    e.preventDefault();
    <button type="submit">跳转</button>
  </form>
  </div>
</template>

<script>
export default {
  name: 'App',
  components:{
  },
  data(){
    return {
      user:'',
      password:'',
      userData:''
    }
  },
  //这个是钩子函数
  mounted: function () {
  },
  //这个是要执行的函数
  methods: {
    addUser:function (e) {
      e.preventDefault();
      //alert(this.user)
      console.log('http://61.163.254.186:8761/zbyxxb/' + this.user + '/' + this.password);
      this.$http.get('http://61.163.254.186:8761/zbyxxb/'+this.user + '/' + this.password).then((response) => {
        console.log('success');
        console.log(response);
        this.userData = response.body;
        console.log(this.userData);
        // success callback
      }, (response) => {
        console.log('error');
        // error callback
      });


    },
    addClass(num){
      for(var i= 0;i<this.menus.length;i++){
        this.menus[i].guess=false;
      }
      this.menus[num].guess=true;
    }
  }
}
</script>

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }
</style>
