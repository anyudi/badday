<!----
  * 隐藏：人非草芥
  * 日期：2018/04/28
  * 时间：11:07
  * 作用：hjztChart 此处打码
--->
<template lang="html">
  <div id='hjztChart' class='hjztChart'>
    <el-form :model="USearch" status-icon  ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-date-picker v-model="timeSlot" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" @change="getMyTime" unlink-panels value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
      <el-button type="primary" @click="hjztSearch">搜索</el-button>
      <el-button type="success" @click="showChart('bar')" >柱状图</el-button>
      <el-button type="success" @click="showChart('pie')">饼状图</el-button>
      <el-button type="success" @click="showChart('noPie')">非对称饼状图玫</el-button>
    </el-form>
  
    <div class="chartBox" id="chartBox" v-loading="loading">
      <div class="chartBL" id="chartBar" :style="{zIndex:chartOption.barZindex}"></div>
      <div class="chartBL" id="chartPie" :style="{zIndex:chartOption.pieZindex}"></div>
      <div class="chartBL" id="chartPie2" :style="{zIndex:chartOption.pie2Zindex}"></div>
    </div>
<!--    -->
  </div>
</template>
<script>
  
  var echarts = require('echarts');
  var moment = require('moment');
  moment().format();
  export default {
    name: 'hjztChart',
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
        //结果存放地
        chartOption:{
  
          barZindex:1,
          pieZindex:0,
          pie2Zindex:0,
        }
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
          self.loading = true;
          self.$http.post('http://39.104.113.229:8761/hjjlb/findLdsjBetweenGroupByHjzt', self.USearch).then((response) => {
            console.log('success');
            var result = response.body;
            self.searchResult = [];
            self.searchResult = result;
            console.log(self.searchResult);
            
            self.loadChart("呼叫状态统计",self.searchResult);
    
            self.loading = false;
          }, (response) => {
            console.log('error');
          });
        }
    
      },
  
      //加载图表
      loadChart(title,result){
        const self = this;
/*        let myData = new Map(result);
        console.log(myData);*/
        let arr = [];
        let arr2 = [];
        
        for(let ss=0;ss<result.length;ss++){
          arr.push(result[ss].name);
          arr2.push(result[ss].countNum);
        }
        
        
        
        let pieData=[];
        console.log(arr);
        for(var i = 0; i < arr.length; i++){
          pieData.push({
            name: arr[i],
            value: arr2[i]
          });
        }
        //柱状图
        if(!self.barBox){
          self.barBox = echarts.init(document.getElementById('chartBar'));
          var option_bar = {
            title: {
              text: title,
              x:'center'
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
              data: arr,
              axisLabel: {
                interval:0,
                rotate:60
              }
            },
            yAxis: {},
            series: [{
              type: 'bar',
              itemStyle: {
                normal: {
                  // 随机显示
                  //color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}
                  // 定制显示（按顺序）
                  color: function(params) {
                    var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
                    return colorList[params.dataIndex]
                  }
                },
              },
              data: arr2
            }]
          };
          this.barBox.setOption(option_bar,true);
        }else{
          self.barBox.setOption({
            title : {
              text: title,
            },
            xAxis: {
              data: arr,
            },
            series: [{
              data: arr2
            }]
          });
        }
        //饼状图
        if(!self.pieBox){
          self.pieBox = echarts.init(document.getElementById('chartPie'));
          var option_pie = {
            title : {
              text: title,
              x:'center'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a}<br>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: arr,
            },
            series : [
              {
                name:title,
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:pieData,
                selectedMode: 'single',
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                label: {fontSize:14},
              }
            ]
          };
          this.pieBox.setOption(option_pie,true);
        }else{
          self.pieBox.setOption({
            title : {
              text: title,
            },
        
            legend: {
              orient: 'vertical',
              left: 'left',
              data: arr
            },
            series: [{
              name:title,
              data: pieData
            }]
          });
        }
        //非对称饼图
        if(!self.pieBox2){
          self.pieBox2 = echarts.init(document.getElementById('chartPie2'));
          let option_pie = {
            title : {
              text: title,
              x:'center'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a}<br>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: arr
            },
            series : [
              {
                name:title,
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:pieData.sort(function (a, b) { return a.value - b.value; }),
                selectedMode: 'single',
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                roseType: 'radius',
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                  return Math.random() * 200;
                }
              }
            ]
          };
          this.pieBox2.setOption(option_pie,true);
        }else{
          self.pieBox2.setOption({
            title : {
              text:title,
            },
        
            legend: {
              orient: 'vertical',
              left: 'left',
              data: arr
            },
            series: [{
              name:title,
              data: pieData.sort(function (a, b) { return a.value - b.value; }),
              roseType: 'radius',
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }]
          });
        }
      },
  //hjztSearch
      searchType(){
        const self = this;
        if (this.USearch.bjsjStart == '' || this.USearch.bjsjEnd == '') {
          self.showError();
        } else {
          self.loading = true;
          self.$http.post('http://39.104.113.229:8761/hjjlb/findLdsjBetweenGroupByHjzt', self.USearch).then((response) => {
            console.log('success');
            var result = response.body;
            self.searchResult = [];
            self.searchResult = result;
            self.loadChart("呼叫状态统计",self.searchResult);
            
            self.loading = false;
          }, (response) => {
            console.log('error');
          });
        }
      },
      showChart(val){
        const self = this;
        if(val == "bar"){
          /*self.showBar = true;
           self.showPie = false;*/
          self.chartOption.barZindex = 1;
          self.chartOption.pieZindex = 0;
          self.chartOption.pie2Zindex = 0;
      
        }else if (val == "pie"){
          /*self.showBar = false;
           self.showPie = true;*/
          self.chartOption.barZindex = 0;
          self.chartOption.pieZindex = 1;
          self.chartOption.pie2Zindex = 0;
        }else if(val == "noPie"){
          self.chartOption.barZindex = 0;
          self.chartOption.pieZindex = 0;
          self.chartOption.pie2Zindex = 1;
      
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
  .chartHHbox{ height: 800px;}
  .chartBox{ position: relative;height: 800px;}
  .chartBL{ position: absolute; left: 0; top:0; width: 100%; height: 100%; background: rgba(255,255,255,1); }
</style>
