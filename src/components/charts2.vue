<!----
  * 隐藏：人非草芥
  * 日期：2018/04/10
  * 时间：10:07
  * 作用：charts 此处打码
--->
<template lang="html">
    <div id='charts' class="">
      <div>
        <el-date-picker v-model="timeSlot" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" @change="getMyTime" unlink-panels value-format="yyyy-MM-dd hh:mm:ss" ></el-date-picker>
        <el-button type="primary" @click="searchType">搜索</el-button>
        <el-button type="success" @click="showChart('pie')">饼状图</el-button>
        <el-button type="success" @click="showChart('bar')" >柱状图</el-button>
        <div class="mianBaoBox">

          <i class="fas fa-home"></i>
          <ul class="mianBao">
            <li v-if="chartOption.LX_level_1" :class="chartOption.link_level_1" @click="to_level_1">案件类型</li>
            <li v-if="chartOption.LX_level_2" :class="chartOption.link_level_2" @click="to_level_2">案件性质</li>
            <li v-if="chartOption.LX_level_3" :class="chartOption.link_level_3" @click="to_level_3">性质分类</li>
            <li v-if="chartOption.LX_level_4" :class="chartOption.link_level_4">性质细类</li>
          </ul>
        </div>
        <div class="chartOutBox" :style="{height: chartOption.boxHeight + 'px'}">
          <div class="chartOption" style=""  v-loading="chartOption.loading2">
            <dl class="chartOption-dl"  :class="chartOption.level_1" >
              <dt>案件类型</dt>
              <dd class="chartOption-item" v-for="(item,index) in chartOption.resule_level_1"  @click="show2(item[0])">
                <label class="chartOption-label">{{item[0]}}</label>
                <div class="chartOption-content">{{item[1]}}</div>
              </dd>
            </dl>
            <dl class="chartOption-dl chartOption-dl2" :class="chartOption.level_2" >
              <dt>{{chartOption.level_2_title}}</dt>
              <dd class="chartOption-item" v-for="(item,index) in chartOption.resule_level_2"  @click="show3(item[0])">
                <label class="chartOption-label">{{item[0]}}</label>
                <div class="chartOption-content">{{item[1]}}</div>
              </dd>
            </dl>
            <dl class="chartOption-dl chartOption-dl2" :class="chartOption.level_3" >
              <dt>{{chartOption.level_3_title}}</dt>
              <dd class="chartOption-item" v-for="(item,index) in chartOption.resule_level_3"  @click="show4(item[0])">
                <label class="chartOption-label">{{item[0]}}</label>
                <div class="chartOption-content">{{item[1]}}</div>
              </dd>
            </dl>
            <dl class="chartOption-dl chartOption-dl2" :class="chartOption.level_4" >
              <dt>{{chartOption.level_4_title}}</dt>
              <dd class="chartOption-item" v-for="(item,index) in chartOption.resule_level_4" >
                <label class="chartOption-label">{{item[0]}}</label>
                <div class="chartOption-content">{{item[1]}}</div>
              </dd>
            </dl>
          </div>
          <div class="chartBox" :style="{ width: chartOption.boxWidth  + 'px', height: chartOption.boxHeight + 'px' }">
            <div id="chartBar" :style="{ width: chartOption.boxWidth  + 'px', height: chartOption.boxHeight + 'px' }"  v-show="showBar"></div>
            <div id="chartPie" :style="{ width: chartOption.boxWidth  + 'px', height: chartOption.boxHeight + 'px' }" v-show="showPie"></div>
<!--
            <div id="chartBar"  :class="{barShow:barShow}"></div>
            <div id="chartPie"  :class="{pieShow:pieShow}"></div>-->
          </div>
        </div>
      </div>
    </div>
</template>
<script>
  var echarts = require('echarts');
  var moment = require('moment');
  moment().format();
	export default {
		name: 'charts',
		props: {},
		data(){
			return {
        screenWidth: document.body.clientWidth,
        screenHeight: document.body.clientHeight,
        USearch:{
          bjsjStart:'',
          bjsjEnd:'',
        },
        //日期
        timeSlot:[],//,
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
        searchResult:{
        	chart_title:"",
          chart_result:[],
        },//结果存放地
        chartOption:{
          chartBarWidth:0,
          chartBarHeight:0,
          boxWidth:0,
          boxHeight:0,
          level_1:"file-in",
          level_2:"",
          level_3:"",
          level_4:"",
          loading2:false,
          resule_level_1:[],
          resule_level_2:[],
          resule_level_3:[],
          resule_level_4:[],
          level_1_title:"案件类型",
          level_2_title:"",
          level_3_title:"",
          level_4_title:"",
          LX_level_1:true,
          link_level_1:"",
          LX_level_2:false,
          link_level_2:"",
          LX_level_3:false,
          link_level_3:"",
          LX_level_4:false,
          link_level_4:"",
        },
        showBar:true,
        showPie:false,
        barShow:false,
        pieShow:true,
        barBox:null,
        pieBox:null,

        asdfasdf:0,


      }
		},
		//这个是钩子函数
		mounted: function () {

      const self = this;

/*
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600*1000*24*7);
      self.timeSlot = [start,end];

      this.USearch.bjsjStart = start;
      this.USearch.bjsjEnd = end;*/

      window.screenWidth = document.body.clientWidth;
      window.screenHeight = document.body.clientHeight;
      self.screenWidth = window.screenWidth;
      self.screenHeight = window.screenHeight;
      self.chartOption.boxWidth = self.screenWidth -460;
      self.chartOption.boxHeight = self.screenHeight  - 180;



      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth;
          window.screenHeight = document.body.clientHeight;
          self.screenWidth = window.screenWidth;
          self.screenHeight = window.screenHeight;

        })()
      }
		},
		//这个是要执行的函数
		methods: {

      to_level_1(){
        const self = this;
        //self.chartOption.resule_level_1=[];
        self.chartOption.resule_level_2=[];
        self.chartOption.resule_level_3=[];
        self.chartOption.resule_level_4=[];
        self.chartOption.level_1="left-in";
        self.chartOption.level_2="";
        self.chartOption.level_3="";
        self.chartOption.level_4="";
        self.chartOption.level_2_title="";
        self.chartOption.level_3_title="";
        self.chartOption.level_4_title="";
        self.chartOption.link_level_1="";
        self.chartOption.LX_level_2=false;
        self.chartOption.link_level_2="";
        self.chartOption.LX_level_3=false;
        self.chartOption.link_level_3="";
        self.chartOption.LX_level_4=false;
        self.searchResult.chart_title = self.chartOption.level_1_title;
        self.searchResult.chart_result = [];
        self.searchResult.chart_result = self.chartOption.resule_level_1;
        self.chartBar(self.searchResult.chart_title,self.searchResult.chart_result);
        self.chartPie(self.searchResult.chart_title,self.searchResult.chart_result);

      },
      to_level_2(){

        const self = this;
        //self.chartOption.resule_level_1=[];
        //self.chartOption.resule_level_2=[];
        self.chartOption.resule_level_3=[];
        self.chartOption.resule_level_4=[];
        self.chartOption.level_1="left-out";
        self.chartOption.level_2="right-in";
        self.chartOption.level_3="";
        self.chartOption.level_4="";
        //self.chartOption.level_2_title="";
        self.chartOption.level_3_title="";
        self.chartOption.level_4_title="";

        self.chartOption.link_level_1="active";
        self.chartOption.LX_level_2=true;
        self.chartOption.link_level_2="";
        self.chartOption.LX_level_3=false;
        self.chartOption.link_level_3="";
        self.chartOption.LX_level_4=false;
        //alert(121)

        self.searchResult.chart_title = self.chartOption.level_2_title;
        self.searchResult.chart_result = [];
        self.searchResult.chart_result = self.chartOption.resule_level_2;
        self.chartBar(self.searchResult.chart_title,self.searchResult.chart_result);
        self.chartPie(self.searchResult.chart_title,self.searchResult.chart_result);
      },
      to_level_3(){
        const self = this;
        //self.chartOption.resule_level_1=[];
        //self.chartOption.resule_level_2=[];
        //self.chartOption.resule_level_3=[];
        self.chartOption.resule_level_4=[];
        self.chartOption.level_1="left-out";
        self.chartOption.level_2="left-out";
        self.chartOption.level_3="right-in";
        self.chartOption.level_4="";
        //self.chartOption.level_2_title="";
        //self.chartOption.level_3_title="";
        self.chartOption.level_4_title="";

        self.chartOption.link_level_1="active";
        self.chartOption.LX_level_2=true;
        self.chartOption.link_level_2="active";
        self.chartOption.LX_level_3=true;
        self.chartOption.link_level_3="";
        self.chartOption.LX_level_4=false;

        //self.chartBar(self.chartOption.level_3_title,self.chartOption.resule_level_3);
        self.searchResult.chart_title = self.chartOption.level_3_title;
        self.searchResult.chart_result = [];
        self.searchResult.chart_result = self.chartOption.resule_level_3;
        self.chartBar(self.searchResult.chart_title,self.searchResult.chart_result);
        self.chartPie(self.searchResult.chart_title,self.searchResult.chart_result);
      },

			//案件类型
      ajlxTJ(){
        const self = this;
        self.$http.post('http://39.104.113.229:8761/count/findJcjbCountByCol/ajlx/',self.USearch).then((response) => {
          console.log('success');
          var result =response.body;
          self.searchResult = result;
        }, (response) => {
          console.log('error');
        });
      },
      //选择时间
      getMyTime(val){
        if(val){
          this.USearch.bjsjStart = moment(val[0]).utc().format();
          this.USearch.bjsjEnd = moment(val[1]).utc().format();
        }else{
          this.USearch.bjsjStart ="";
          this.USearch.bjsjEnd ="";
        }
      },
      //时间格式化
      dateFormat:function(row, column) {
        //console.log(row,column);
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      //柱状图
      chartBar(title,result){
        const self = this;
        self.chartOption.boxWidth = self.screenWidth -460;
        self.chartOption.boxHeight = self.screenHeight  - 180;

        let myData = new Map(result);
        let arr = [...myData.keys()];
        let arr2 = [...myData.values()];
        if(!self.barBox){
          self.barBox = echarts.init(document.getElementById('chartBar'));
          var option_bar = {
            title: {
              text: title,
              x:'center'
            },
            toolbox: {
              show: true,
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
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
      },
      //饼状图

      chartPie(title,result){
        const self = this;
        let myData = new Map(result);
        let arr = [...myData.keys()];
        let arr2 = [...myData.values()];
        let pieData=[];
        for(var i = 0; i < arr.length; i++){
          pieData.push({
            name: arr[i],
            value: arr2[i]
          });
        }
        if(!self.pieBox){
          self.pieBox = echarts.init(document.getElementById('chartPie'));
          var option_pie = {
            title : {
              text: title,
              x:'center'
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: arr
            },
            series : [
              {
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
                }
              }
            ]
          };
          this.pieBox.setOption(option_pie,true);
        }else{
          self.pieBox.setOption({
            title : {
              text: self.searchResult.chart_title,
            },
            series: [{
              data: pieData
            }]
          });
        }
      },
      showChart(val){
        const self = this;
        if(val == "bar"){
          self.showBar = true;
          self.showPie = false;
        }else if (val == "pie"){
          self.showBar = false;
          self.showPie = true;
        }
      },
      searchType(){
        const self = this;
        self.chartOption.loading2=true;
        //ajlx  ajxz xzfl xzxl


        delete self.USearch.ajlx;
        delete self.USearch.ajxz;
        delete self.USearch.xzfl;
        self.barBox = null;
        self.pieBox = null;
        self.chartOption.boxWidth =  document.getElementById("chartBar").offsetWidth;
        self.chartOption.boxHeight =  document.getElementById("chartBar").offsetHeight;
        self.$http.post('http://39.104.113.229:8761/count/findJcjbCountByCol/ajlx/',self.USearch).then((response) => {
          console.log('success');
          var result =response.body;
          self.chartOption.resule_level_1=[];
          self.chartOption.resule_level_2=[];
          self.chartOption.resule_level_3=[];
          self.chartOption.resule_level_4=[];
          self.chartOption.level_1="left-in";
          self.chartOption.level_2="";
          self.chartOption.level_3="";
          self.chartOption.level_4="";
          self.chartOption.level_2_title="";
          self.chartOption.level_3_title="";
          self.chartOption.level_4_title="";

          self.chartOption.link_level_1="";
          self.chartOption.LX_level_2=false;
          self.chartOption.link_level_2="";
          self.chartOption.LX_level_3=false;
          self.chartOption.link_level_3="";
          self.chartOption.LX_level_4=false;
          self.chartOption.resule_level_1 = result;

          self.searchResult.chart_title = self.chartOption.level_1_title;
          self.searchResult.chart_result = [];
          self.searchResult.chart_result = self.chartOption.resule_level_1;
          self.chartBar(self.searchResult.chart_title,self.searchResult.chart_result);
          self.chartPie(self.searchResult.chart_title,self.searchResult.chart_result);

/*          self.chartBar(self.chartOption.level_1_title,self.chartOption.resule_level_1);
          self.chartPie(self.chartOption.level_1_title,self.chartOption.resule_level_1);*/


          self.chartOption.loading2=false;
        }, (response) => {
          console.log('error');
        });
      },
      //2222
      show2(val){
        const self = this;
        delete self.USearch.ajlx;
        delete self.USearch.ajxz;
        delete self.USearch.xzfl;
        self.chartOption.loading2=true;
        self.USearch.ajlx = val;
        self.$http.post('http://39.104.113.229:8761/count/findJcjbCountByCol/ajxz/',self.USearch).then((response) => {
          console.log('success');
          var result =response.body;
          self.chartOption.resule_level_2=[];
          self.chartOption.resule_level_2 = result;
          var result =response.body;
          if(result=="" || result==null){
            this.$message({
              showClose: true,
              message: '此类型无下级目录',
              type: 'warning',
              duration:1000
            });
          }else {
            self.chartOption.level_1 = "left-out";
            self.chartOption.level_2 = "right-in";
            self.chartOption.level_2_title = val;

            self.chartOption.link_level_1="active";
            self.chartOption.LX_level_2=true;
            self.chartOption.link_level_2="";
            self.chartOption.LX_level_3=false;
            self.chartOption.link_level_3="";
            self.chartOption.LX_level_4=false;
            self.searchResult.chart_title = self.chartOption.level_2_title;
            self.searchResult.chart_result = [];
            self.searchResult.chart_result = self.chartOption.resule_level_2;
            self.chartBar(self.searchResult.chart_title,self.searchResult.chart_result);
            self.chartPie(self.searchResult.chart_title,self.searchResult.chart_result);
          }
          self.chartOption.loading2=false;
        }, (response) => {
          console.log('error');
        });

      },
      //33333
      show3(val){
        const self = this;
        delete self.USearch.ajlx;
        delete self.USearch.ajxz;
        delete self.USearch.xzfl;
        self.chartOption.loading2=true;
        self.USearch.ajxz = val;
        self.$http.post('http://39.104.113.229:8761/count/findJcjbCountByCol/xzfl/',self.USearch).then((response) => {
          console.log('success');
          var result =response.body;
          if(result=="" || result==null){
            this.$message({
              showClose: true,
              message: '此类型无下级目录',
              type: 'warning',
              duration:1000
            });
          }else{
            self.chartOption.level_3_title = val;
            self.chartOption.level_2 = "left-out";
            self.chartOption.level_3 = "right-in";
            self.chartOption.resule_level_3=[];
            self.chartOption.resule_level_3 = result;
            self.chartOption.link_level_1="active";
            self.chartOption.LX_level_2=true;
            self.chartOption.link_level_2="active";
            self.chartOption.LX_level_3=true;
            self.chartOption.link_level_3="";
            self.chartOption.LX_level_4=false;

            self.searchResult.chart_title = self.chartOption.level_3_title;
            self.searchResult.chart_result = [];
            self.searchResult.chart_result = self.chartOption.resule_level_3;
            self.chartBar(self.searchResult.chart_title,self.searchResult.chart_result);
            self.chartPie(self.searchResult.chart_title,self.searchResult.chart_result);

          }

          self.chartOption.loading2=false;
        }, (response) => {
          console.log('error');
        });
      },
      //4444
      show4(val){
        const self = this;
        delete self.USearch.ajlx;
        delete self.USearch.ajxz;
        delete self.USearch.xzfl;
        self.chartOption.loading2=true;
        self.USearch.xzfl = val;
        self.$http.post('http://39.104.113.229:8761/count/findJcjbCountByCol/xzxl/',self.USearch).then((response) => {
          console.log('success');
          var result =response.body;

          if(result=="" || result==null){
            this.$message({
              showClose: true,
              message: '此类型无下级目录',
              type: 'warning',
              duration:1000
            });
          }else {
            self.chartOption.level_3 = "left-out";
            self.chartOption.level_4 = "right-in";
            self.chartOption.level_4_title = val;
            self.chartOption.resule_level_4=[];
            self.chartOption.resule_level_4 = result;
            self.chartOption.link_level_1="active";
            self.chartOption.LX_level_2=true;
            self.chartOption.link_level_2="active";
            self.chartOption.LX_level_3=true;
            self.chartOption.link_level_3="active";
            self.chartOption.LX_level_4=true;
            self.searchResult.chart_title = self.chartOption.level_4_title;
            self.searchResult.chart_result = [];
            self.searchResult.chart_result = self.chartOption.resule_level_4;
            self.chartBar(self.searchResult.chart_title,self.searchResult.chart_result);
            self.chartPie(self.searchResult.chart_title,self.searchResult.chart_result);
          }

          self.chartOption.loading2=false;
        }, (response) => {
          console.log('error');
        });
      },
    },
    watch: {
      screenWidth (val) {
        if (!this.timer) {
          this.screenWidth = val;
          this.timer = true;
          const self = this;
          setTimeout(function () {
            self.chartOption.boxWidth = window.screenWidth -460;
            self.timer = false;
            self.barBox.resize();
            self.pieBox.resize();
          }, 400)
        }
      },
//      self.screenHeight = window.screenHeight;
  /*    setTimeout(function () {
        // self.screenWidth = self.$store.state.canvasWidth
        //self.init()
        self.chartOption.boxWidth = self.screenWidth -460;
        self.chartOption.boxHeight = self.screenHeight  - 180;
        console.log(self.chartOption.boxWidth,self.chartOption.boxHeight);
        self.timer2 = false;
        self.barBox.resize();
        self.pieBox.resize();
      }, 400)*/
      screenHeight (val) {
        console.log(val);
        if (!this.timer2) {
          this.screenHeight = val;
          this.timer2 = true;
          const self = this;
          setTimeout(function () {
            // self.screenWidth = self.$store.state.canvasWidth
            //self.init()
            self.chartOption.boxHeight = window.screenHeight - 180;
            console.log(self.screenHeight,self.chartOption.boxHeight);
            self.timer2 = false;
            self.barBox.resize();
            self.pieBox.resize();
          }, 400)
        }
      }

    }
	}
</script>
<style lang="css" scoped>
  .barShow{ display: none;}
  .pieShow{ display: none;}



  #chartBar{}
  #chartPie{}
  .chartOutBox{display: flex;flex-wrap: nowrap; background: rgba(255,255,255,0.8);border: 1px solid rgba(0,0,0,.2);}
  .chartOption{background:rgba(0,0,0,.0); width: 200px; position: relative; overflow: hidden;border-right: 1px solid rgba(0,0,0,.2);}
  .chartBox{flex-grow: 1;;}
  .chartOption-dl{ position: absolute; width: 200px;top: 0;transition: all .5s;}
  .chartOption-dl2{ left: 100%;}
  .chartOption-dl dt{text-align: center; border-bottom: 1px solid rgba(0,0,0,.2);}
  .chartOption-dl dd{border-bottom: 1px solid rgba(0,0,0,.2); line-height: 26px;}
  .chartOption-dl dd:hover{ background: rgba(26,152,225,.2);}
  .chartOption-item{display: flex;}
  .chartOption-label{width: 120px;overflow: hidden; text-overflow:ellipsis;white-space: nowrap; box-sizing: border-box;padding-left: 10px;background: rgba(26,152,225,.2);}
  .chartOption-content{flex-grow: 1; text-align: center;}
  .chartOption-dl.left-out{ left: -100%;}
  .chartOption-dl.left-in{ left:0%;}
  .chartOption-dl.right-out{left: 100%;}
  .chartOption-dl.right-in{left: 0px;}
  .chartBox{}
  .mianBaoBox{display: flex; padding: 8px 5px 5px;}
  .mianBaoBox i{  margin-top: 3px;}
  .mianBao{display: flex; margin-left: 0; padding-left: 0; margin: 0;}
/*  .mianBao li:first-child:before{content:"\f015";font-family:Font Awesome\ 5 Free;color:rgba(180,180,180,1);}*/
  .mianBao li:not(:first-child):before{ content: ">"; color:rgba(180,180,180,1); }
  .mianBao li.active{color:rgba(26,152,225,1); cursor: pointer;}
</style>
