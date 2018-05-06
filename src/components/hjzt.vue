<!----
  * 隐藏：人非草芥
  * 日期：2018/04/28
  * 时间：11:07
  * 作用：hjzt 此处打码
--->
<template lang="html">
  <div id='hjzt' class='hjzt'>
    <el-form :model="USearch" status-icon  ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-date-picker v-model="timeSlot" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" @change="getMyTime" unlink-panels value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
      <el-button type="primary" @click="hjztSearch">搜索</el-button>
    </el-form>
  
    <el-table :data="searchResult" border style="width: 100%" v-loading="loading" class="table-small-padding noPrint LS">
      <el-table-column prop="name" label="状态" ></el-table-column>
      <el-table-column prop="countNum" label="数量" ></el-table-column>
    </el-table>
<!--    -->
  </div>
</template>
<script>
  var moment = require('moment');
  moment().format();
  export default {
    name: 'hjzt',
    props: {},
    data(){
      return {
        USearch: {
          ldsjStart: '',
          ldsjEnd: ''
        },
        loading:false,
        timeSlot: [],//日期
        pickerOptions: {
          //快捷选择日期段
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker){
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker){
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker){
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            },
          ],
          //限制日期
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        searchResult:[],
      }
    },
    //这个是钩子函数
    mounted: function () {
      this.init();
    },
    //这个是要执行的函数
    methods: {
      init(){
      },
      showError() {
        this.$message({
          showClose: true,
          message: '时间不能为空~~',
          type: 'error'
        });
      },
      hjztSearch(){
        const self = this;
    
        if(this.USearch.ldsjStart=='' || this.USearch.ldsjEnd==''){
          self.showError();
        }else{
          console.log(self.USearch);
          self.loading = true;
          self.$http.post(serverRouter.server14, self.USearch).then((response) => {
            console.log('success');
            var result = response.body;
            self.searchResult = [];
            self.searchResult = result;
            self.loading = false;
          }, (response) => {
            console.log('error');
          });
        }
    
      },
      //时间
      getMyTime(val){
        if (val) {
          this.USearch.ldsjStart = moment(val[0]).utc().format();
          this.USearch.ldsjEnd = moment(val[1]).utc().format();
        } else {
          this.USearch.ldsjStart = "";
          this.USearch.ldsjEnd = "";
        }
      },
      //时间格式化
      dateFormat: function (row, column) {
        //console.log(row,column);
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      //时间格式化 年月日
      dateYMD(row, column) {
        //console.log(row,column);
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD");
      },
    }
  }
</script>

<style lang="css" scoped>
  .LS{ text-align: center; line-height: 2rem; background: #fff; border-collapse: collapse; margin-top: 20px;}
  .LS td{border: 1px solid #ebeef5; border-collapse: collapse; line-height: 60px;}
</style>
