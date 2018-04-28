<!----
  * 隐藏：人非草芥
  * 日期：2018/04/26
  * 时间：9:22
  * 作用：chartHH 此处打码 chart 混合图表
--->
<template lang="html">
	<div id='chartHH' class="">
		<div>
      <el-date-picker v-model="timeSlot" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                      align="right" @change="getMyTime" unlink-panels value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
      <el-button type="primary" @click="typeSearch">搜索</el-button>
      <el-button type="primary" @click="cscs">cscs</el-button>
    </div>
    <div></div>
    <div class="chartHHbox" id="chartHHbox" v-loading="loading" ></div>
    
    
	</div>
</template>
<script>

	var echarts = require('echarts');
	var moment = require('moment');
	moment().format();
	export default {
		name: 'chartHH',
		props: {},
		data(){
			return {
				USearch: {
					bjsjStart: '',
					bjsjEnd: ''
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
        chartHHbox:null,
        chartTitle:'这个是图表标题',
        loading: false,
        searchResult: [],//结果存放地
        types:['重复报警', '工作', '刑事案件', '抢险救援（119）', '治安案件', '交通类警情', '骚扰', '灾害事故', '火灾事故', '群体性事件', '处警反馈', '其他警情', '举报投诉', '无效', '群众求助', '社会联动', '咨询', '行政违法'],
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
      cscs(){
				let cscs=[];
				for(let xxx=0;xxx<5;xxx++){
          cscs.push(0);
        }
        console.log(cscs);
  
      },
      
      showError() {
        this.$message({
          showClose: true,
          message: '时间不能为空~~',
          type: 'error'
        });
      },
      //查询
      typeSearch(){
        const self = this;
        if(this.USearch.bjsjStart=='' || this.USearch.bjsjEnd==''){
          self.showError();
        }else{
          self.loading = true;
          self.$http.post('http://39.104.113.229:8761/count/findJcjbCountsByDate/ajlx', self.USearch).then((response) => {
            console.log('success');
            var result = response.body;
            self.searchResult = [];
            self.searchResult = result;
            //console.log(self.searchResult);
            let LSNumArr = [];
            let dateArr = [];
            const types = ['重复报警', '工作', '刑事案件', '抢险救援（119）', '治安案件', '交通类警情', '骚扰', '灾害事故', '火灾事故', '群体性事件', '处警反馈', '其他警情', '举报投诉', '无效', '群众求助', '社会联动', '咨询', '行政违法'];
            for (let i = 0; i < self.searchResult.length; i++) {
              let myData = new Map(self.searchResult[i].countDtoList);
              let arr = [...myData.keys()];
              let arr2 = [...myData.values()];
              let mumArr = [];
              for (let j = 0; j < self.types.length; j++) {
                let dataTrue = arr.findIndex((n) => n == self.types[j]);
                if (dataTrue == -1) {
                  mumArr.push(0)
                }else{
                  mumArr.push(arr2[dataTrue])
                }
              }
              LSNumArr.push(mumArr);
      
              let dateGSH = moment(self.searchResult[i].date).format("YYYY-MM-DD");
              dateArr.push(dateGSH);
            }
            //日期
            for(let k=0; k< self.searchResult.length;k++){
            }
    
            //数据
            let series=[];
            let onlyOneTypeArr =[];
            for(let L=0; L< self.types.length; L++){
      
              let onlyOneType = [];
              for(let M=0; M< self.searchResult.length;M++){
                onlyOneType.push(LSNumArr[M][L])
              }
              onlyOneTypeArr.push(onlyOneType)
            }
            console.log(onlyOneTypeArr);
    
            for(let N=0; N< self.types.length; N++){
              series.push({name:self.types[N],stack: '总量',type: 'bar',data:onlyOneTypeArr[N]})
            }
    
    
            //柱状图
            if(!self.chartHHbox){
              self.chartHHbox = echarts.init(document.getElementById('chartHHbox'));
              var option_chartHHbox = {
                title: {
                  text: self.chartTitle,
                  x:'center'
                },
                legend: {
                  data:self.types,
                  top:'50'
                },
                tooltip: {
                  show: true,
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  }
                },
        
                grid: {
                  top:'20%',
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  data: dateArr,
                  axisLabel: {
                    interval:0,
                    rotate:60
                  }
                },
                yAxis: {type: 'value'},
                series:series
              };
              this.chartHHbox.setOption(option_chartHHbox,true);
            }else{
              self.chartHHbox.setOption({
                title : {
                  text: self.chartTitle,
                },
                xAxis: {
                  data: dateArr,
                },
                series:series
              });
            }
            self.loading = false;
          }, (response) => {
            console.log('error');
          });
        }
      },
      loadChart(title,result){
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
				console.log(row,column);
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
  .chartHHbox{ height: 800px;}
  
</style>
