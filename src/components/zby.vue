<!----
  * 隐藏：人非草芥
  * 日期：2018/04/28
  * 时间：13:52
  * 作用：zby 此处打码
--->
<template lang="html">
	<div id='zby' class='zby'>
    
    <el-date-picker v-model="timeSlot" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" @change="getMyTime" unlink-panels value-format="yyyy-MM-dd hh:mm:ss" ></el-date-picker>
    <el-button type="primary" @click="zbySearch">搜索</el-button>
    
    
    <el-table :data="searchResult" border style="width: 100%" v-loading="loading" class="table-small-padding noPrint LS">
      <el-table-column prop="0" label="状态" ></el-table-column>
      <el-table-column prop="1" label="数量" ></el-table-column>
    </el-table>
	</div>
</template>
<script>

	var moment = require('moment');
	moment().format();
	export default {
		name: 'zby',
		props: {},
		data(){
			return {
				USearch: {
					bjsjStart: '',
          bjsjEnd: ''
				},
				timeSlot: [],//日期
        pickerOptions:{
          //快捷选择日期段
          shortcuts:[
            {
              text:"最近一周",
              onClick(picker){
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600*1000*24*7);
                picker.$emit('pick',[start,end]);
              }
            },
            {
              text:"最近一个月",
              onClick(picker){
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600*1000*24*30);
                picker.$emit('pick',[start,end]);
              }
            },
            {
              text:"最近三个月",
              onClick(picker){
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600*1000*24*90);
                picker.$emit('pick',[start,end]);
              }
            },
          ],
          //限制日期
          disabledDate(time) {
            return time.getTime() > Date.now() ;
          }
        },
        loading:false,
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
      zbySearch(){
        const self = this;
        console.log(self.USearch);
        if(this.USearch.bjsjStart=='' || this.USearch.bjsjEnd==''){
          self.showError();
        }else{
          self.loading = true;
          self.$http.post('http://39.104.113.229:8761/count/findJcjbCountByCol/zby',self.USearch).then((response) => {
            let LS = response.body;
            for(var Znum =0;Znum<LS.length;Znum++ ){
            	let obj={};
            	for(var Ynum =0;Ynum<LS[Znum].length;Ynum++ ){
                obj[Ynum]=LS[Znum][Ynum]
              }
              self.searchResult.push(obj)
            }
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
					this.USearch.bjsjStart = moment(val[0]).utc().format();
					this.USearch.bjsjEnd = moment(val[1]).utc().format();
				} else {
					this.USearch.bjsjStart = "";
					this.USearch.bjsjEnd = "";
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
