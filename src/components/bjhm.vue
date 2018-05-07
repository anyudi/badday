<!----
  * 隐藏：人非草芥
  * 日期：2018/04/28
  * 时间：9:46
  * 作用：bjhm 此处打码
--->
<template lang="html">
	<div id='bjhm' class='bjhm'>
    <el-form :model="USearch" status-icon :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-date-picker v-model="timeSlot" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" @change="getMyTime" unlink-panels value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
      <el-button type="primary" @click="bjhmSearch">搜索</el-button>
    </el-form>
		<div></div>
    <el-table :data="searchResult" border style="width: 100%" v-loading="loading" class="table-small-padding noPrint LS">
      <el-table-column prop="name"  label="类型"></el-table-column>
      <el-table-column prop="countNum" label="数量"></el-table-column>
    </el-table>
	</div>
</template>
<script>

	var echarts = require('echarts');
	var moment = require('moment');
	moment().format();
	export default {
		name: 'bjhm',
		props: {},
		data(){
      var checkTime = (rule, value, callback) => {
        console.log(value);
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          /*if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }*/
          callback();
        }
      };
			return {
				USearch: {
          ldsjStart: '',
          ldsjEnd: ''
				},
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
        rules: {
          USearch: [
            { validator: checkTime, trigger: 'blur' }
          ],
  
          ldsjStart: [
            { required: true, message: '案发地址不能为空', trigger: 'blur' },
            { min: 5, message: '长度不能低于 5 个字符', trigger: 'blur' }
          ],
          
        },
        loading: false,
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
      bjhmSearch(){
        ///count/findJcjbCountsByTimeScope/
        const self = this;
        self.loading = true;
        
        if(this.USearch.ldsjStart=='' || this.USearch.ldsjEnd==''){
          self.showError();
        }else{
          console.log(self.USearch);
          self.$http.post(serverRouter.server08, self.USearch).then((response) => {
            console.log('success');
            var result = response.body;
            self.searchResult = [];
            self.searchResult = result;
            console.log(self.searchResult);
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
</style>
