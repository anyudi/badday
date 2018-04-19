
<!----
  * 隐藏：人非草芥
  * 日期：2018/03/31
  * 时间：20:19
  * 作用：login 此处打码
--->
<template lang="html">
    <div id='login' class="login">

      <form @submit="addUser" style="display: none;">
        file:///I:/%E6%96%B0%E5%BB%BA%E6%96%87%E4%BB%B6%E5%A4%B92/%E7%89%9B%E9%80%BC%E7%9A%84%E4%BA%A4%E4%BA%92/27%E6%AC%BE%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E9%A1%B5%E9%9D%A2%E8%AE%BE%E8%AE%A1%20DIV+CSS/26/admin-templates/login.html

      </form>

      <div class="login-box">
        <div class="logo"></div>
        <div class="line"></div>
        <div class="fubiaoti">欢迎登录</div>
        <div class="big-title">{{sysTitle}}</div>
        <div class="login-form">
          <div class="input-box">
            <input type="text" v-model="user" placeholder="请输入用户名">
            <input type="password" v-model="password" placeholder="请输入密码">
          </div>
          <button type="button" class="btn-in" @click="addUser">提交</button>
          <div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
	export default {
		name: 'login',
		props: {},
		data(){
			return {
        sysTitle:"OOXXOO系统",
        user:'admin',
        password:'admin',
        userData:''
      }
		},
    //这个是钩子函数
    mounted: function () {
    },
    //这个是要执行的函数
    methods: {
      tijiao(){

        alert(this.user)
      },

      addUser() {
        //e.preventDefault();
        //console.log('http://61.163.254.186:8761/zbyxxb/' + this.user + '/' + this.password);
        this.$http.get('http://39.104.113.229:8761/zbyxxb/'+this.user + '/' + this.password).then((response) => {
          console.log('success');
          console.log(response);
          this.userData = response.body;
          if(response.body == ""){
            alert("账号或者密码不正确")
          }else{
            console.log(this.userData);
            this.$router.push({ name: 'index', params: { userId: this.userData.id }});
            window.sessionStorage.userMessage = 'accessToken';
            //alert(window.sessionStorage.userMessage)
          }
          // success callback
        }, (response) => {
          console.log('error');
          //alert(response)
          // error callback
        });


      },
    }
	}
</script>

<style lang="css" scoped>
  html,body,.login{ width: 100%; height: 100%; padding: 0; margin: 0; background: rgba(234,235,239,1);}
  .login-box{ width: 500px; height: 300px; position: relative; left: 50%; top:50%; transform: translate(-50%,-50%); font-family: "Microsoft YaHei";box-sizing: border-box; padding-top: 1px;}
  .logo{ width: 100px; height: 100px; position: absolute;left:200px; top:-100px; background: url("../assets/images/logo.png") center no-repeat; background-size: contain;}
  .line{ position: absolute; left: 0; top:23px; width: 100%; height: 1px; background: rgba(0,0,0,0.1); box-shadow:0px 1px rgba(255,255,255,1); z-index: -1; }
  .fubiaoti{ color: rgba(200,200,200,1); font-size: 20px;  text-shadow: 0px -1px 0px rgba(0,0,0,0.4),0px 1px 0 rgba(255,255,255,1); margin:10px auto; width: 100px; text-align: center; background: rgba(234,235,239,1);}
  .big-title{ color:rgba(136,136,138,1); font-size: 36px; font-weight: bold; text-shadow: 0 -2px 0px rgba(0,0,0,0.7),0 1px 0 rgba(255,255,255,1);; text-align:  center;}

  .login-form{background:rgba(249,250,252,1); border: 2px solid rgba(230,230,235,1);box-shadow: inset 0 0 3px #fff, 1px 1px 8px rgba(0,0,0,0.05); padding: 10px; }
  .input-box{box-sizing: border-box; border: 1px solid rgba(185,185,185,1); border-radius: 5px; background: rgba(221,221,221,1); padding: 10px;}
  .input-box input{ display: block; background: none; padding-left: 15px; height: 40px; line-height: 40px; font-size: 22px; box-sizing: border-box; width: 100%;}
  input[type="text"]{ border: none; border-bottom: 1px solid rgba(0,0,0,0.1); }
  input[type="password"]{ border: none; border-top: 1px solid rgba(255,255,255,.8);}
  .btn-in{ width:100%;background:linear-gradient(rgba(255,232,160,1),rgba(254,194,84,1)); display: block; line-height: 36px; text-align: center; border: 1px solid rgba(0,0,0,0.4); margin: 10px auto; cursor: pointer;}

</style>
