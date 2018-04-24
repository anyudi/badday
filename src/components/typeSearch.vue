<!----
  * 隐藏：人非草芥
  * 日期：2018/04/24
  * 时间：11:35
  * 作用：typeSearch 此处打码
--->
<template lang="html">
  <div id='typeSearch' class="">
    <!--
			 <div style="display: none">
			 <el-date-picker v-model="timeSlot" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
											 align="right" @change="getMyTime" unlink-panels value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
			 <el-button type="primary" @click="typeSearch">搜索</el-button>
			 
			 POST /count/findJcjbCountsByDate/{col}
			 <div>
				 重复报警 工作 刑事案件 抢险救援（119） 治安案件 交通类警情 骚扰 灾害事故 火灾事故 群体性事件 处警反馈 其他警情 15 举报投诉 无效 群众求助 社会联动 咨询 行政违法
			 </div>
			 
			 <el-table :data="searchResult" border style="width: 100%" v-loading="loading" class="table-small-padding noPrint">
				 <el-table-column type="index"></el-table-column>
				 <el-table-column prop="countDtoList" label="报警电话" sortable></el-table-column>
			 
			 
			 </el-table>
		 
			 <div class="block noPrint" v-if="pageState">
				 <el-pagination layout="total, sizes, prev, pager, next, jumper"  :total="total"  :page-size="pageSize" :current-page="currentPage" @current-change="pageNow" @size-change="handleSizeChange">
					 total总条目数  page-size	每页显示条目个数   current-page	当前页数 :before-close="handleClose"
				 </el-pagination>
			 </div>
			 </div>
			 -->
    <div>
      <div>
        重复报警 工作 刑事案件 抢险救援（119） 治安案件 交通类警情 骚扰 灾害事故 火灾事故 群体性事件 处警反馈 其他警情 15 举报投诉 无效 群众求助 社会联动 咨询 行政违法
        <button type="button" @click="tableGSH">格式化</button>
        <button type="button" @click="csd">格式化</button>
      </div>
      <el-table :data="LSarray" border style="width: 100%" v-loading="loading" class="table-small-padding noPrint">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="countDtoList" label="报警电话" sortable></el-table-column>
        <el-table-column v-for=""></el-table-column>
      
      
      </el-table>
    
    
    </div>
  </div>
</template>
<script>
  var moment = require('moment');
  moment().format();
  export default {
    name: 'typeSearch',
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
        //翻页
        loading: false,
        searchResult: [],//结果存放地
        total: 0,//总条数
        totalPages: 0,//总页数
        pageSize: 10,//每页显示条目个数
        pageState: false,//是否显示页码
        currentPage: 1,//当前第几页
        
        
        ///////cscscscscscscscs
        LSarray: [],
        LSarray2: [],
        
        
      }
    },
    //这个是钩子函数
    mounted: function () {
      
      const self = this;
      
      self.LSarray = [{
        "countDtoList": [["刑事案件", 2], ["交通类警情", 15], ["治安案件", 16], ["举报投诉", 1], ["无效", 122], ["群众求助", 4]],
        "date": 1516766627000
      },
        {
          "countDtoList": [["重复报警", 2], ["刑事案件", 2], ["交通类警情", 19], ["治安案件", 18], ["其他警情", 4], ["举报投诉", 3], ["无效", 182], ["群众求助", 5]],
          "date": 1516853027000
          
        },
        {
          "countDtoList": [["刑事案件", 3], ["治安案件", 20], ["交通类警情", 23], ["其他警情", 2], ["举报投诉", 4], ["无效", 220], ["群众求助", 5]],
          "date": 1516939427000
        },
        {
          "countDtoList": [["刑事案件", 2], ["治安案件", 10], ["交通类警情", 21], ["举报投诉", 4], ["无效", 205], ["群众求助", 13]],
          "date": 1517025827000
        }];
      self.LSarray2 = [{
        "countDtoList": [["刑事案件", 2], ["交通类警情", 15], ["治安案件", 16], ["举报投诉", 1], ["无效", 122], ["群众求助", 4]],
        "date": 1516766627000
      },
        {
          "countDtoList": [["重复报警", 2], ["刑事案件", 2], ["交通类警情", 19], ["治安案件", 18], ["其他警情", 4], ["举报投诉", 3], ["无效", 182], ["群众求助", 5]],
          "date": 1516853027000
        },
        {
          "countDtoList": [["刑事案件", 3], ["治安案件", 20], ["交通类警情", 23], ["其他警情", 2], ["举报投诉", 4], ["无效", 220], ["群众求助", 5]],
          "date": 1516939427000
        },
        {
          "countDtoList": [["刑事案件", 2], ["治安案件", 10], ["交通类警情", 21], ["举报投诉", 4], ["无效", 205], ["群众求助", 13]],
          "date": 1517025827000
        },
        {
          "countDtoList": [["重复报警", 1], ["刑事案件", 3], ["治安案件", 17], ["交通类警情", 22], ["其他警情", 1], ["举报投诉", 2], ["无效", 193]],
          "date": 1517112227000
        },
        {
          "countDtoList": [["重复报警", 1], ["刑事案件", 3], ["交通类警情", 26], ["治安案件", 16], ["骚扰", 1], ["其他警情", 1], ["举报投诉", 2], ["无效", 219], ["群众求助", 6]],
          "date": 1517198627000
        },
        {
          "countDtoList": [["重复报警", 1], ["刑事案件", 2], ["交通类警情", 20], ["治安案件", 19], ["举报投诉", 7], ["无效", 292], ["群众求助", 5]],
          "date": 1517285027000
        },
        {
          "countDtoList": [["重复报警", 2], ["刑事案件", 3], ["治安案件", 31], ["交通类警情", 18], ["火灾事故", 1], ["其他警情", 1], ["举报投诉", 8], ["无效", 230], ["群众求助", 5]],
          "date": 1517371427000
        },
        {
          "countDtoList": [["刑事案件", 6], ["治安案件", 17], ["交通类警情", 19], ["举报投诉", 5], ["无效", 234], ["群众求助", 3]],
          "date": 1517457827000
        },
        {
          "countDtoList": [["刑事案件", 7], ["交通类警情", 37], ["治安案件", 25], ["举报投诉", 6], ["无效", 396], ["群众求助", 4]],
          "date": 1517544227000
        },
        {
          "countDtoList": [["重复报警", 3], ["刑事案件", 6], ["治安案件", 16], ["交通类警情", 44], ["火灾事故", 1], ["其他警情", 7], ["举报投诉", 5], ["无效", 484]],
          "date": 1517630627000
        },
        {
          "countDtoList": [["重复报警", 3], ["刑事案件", 4], ["治安案件", 24], ["交通类警情", 33], ["举报投诉", 5], ["无效", 303], ["群众求助", 4]],
          "date": 1517717027000
        },
        {
          "countDtoList": [["刑事案件", 3], ["交通类警情", 37], ["治安案件", 22], ["其他警情", 2], ["举报投诉", 5], ["无效", 262], ["群众求助", 9]],
          "date": 1517803427000
        },
        {
          "countDtoList": [["重复报警", 2], ["刑事案件", 6], ["交通类警情", 27], ["治安案件", 15], ["其他警情", 1], ["举报投诉", 1], ["无效", 222], ["群众求助", 4]],
          "date": 1517889827000
        },
        {
          "countDtoList": [["刑事案件", 5], ["交通类警情", 51], ["治安案件", 19], ["其他警情", 3], ["举报投诉", 5], ["无效", 343], ["群众求助", 7]],
          "date": 1517976227000
        },
        {
          "countDtoList": [["刑事案件", 1], ["交通类警情", 47], ["治安案件", 28], ["灾害事故", 1], ["其他警情", 1], ["举报投诉", 3], ["无效", 334], ["群众求助", 5]],
          "date": 1518062627000
        },
        {
          "countDtoList": [["重复报警", 7], ["刑事案件", 3], ["治安案件", 29], ["交通类警情", 42], ["其他警情", 3], ["举报投诉", 7], ["群众求助", 4], ["无效", 290]],
          "date": 1518149027000
        },
        {
          "countDtoList": [["刑事案件", 3], ["交通类警情", 44], ["治安案件", 35], ["举报投诉", 3], ["无效", 390], ["群众求助", 5]],
          "date": 1518235427000
        },
        {
          "countDtoList": [["刑事案件", 3], ["交通类警情", 48], ["治安案件", 26], ["火灾事故", 3], ["其他警情", 4], ["举报投诉", 6], ["无效", 353], ["群众求助", 12]],
          "date": 1518321827000
        },
        {
          "countDtoList": [["重复报警", 10], ["刑事案件", 4], ["治安案件", 41], ["交通类警情", 48], ["其他警情", 1], ["举报投诉", 4], ["无效", 445], ["群众求助", 12]],
          "date": 1518408227000
        },
        {
          "countDtoList": [["重复报警", 1], ["刑事案件", 9], ["治安案件", 42], ["交通类警情", 32], ["火灾事故", 2], ["举报投诉", 8], ["无效", 386], ["群众求助", 5]],
          "date": 1518494627000
        },
        {
          "countDtoList": [["重复报警", 3], ["刑事案件", 3], ["治安案件", 29], ["交通类警情", 60], ["火灾事故", 1], ["其他警情", 6], ["举报投诉", 3], ["无效", 358], ["群众求助", 12]],
          "date": 1518581027000
        },
        {
          "countDtoList": [["重复报警", 3], ["刑事案件", 8], ["交通类警情", 40], ["治安案件", 42], ["火灾事故", 2], ["举报投诉", 6], ["无效", 344], ["群众求助", 10]],
          "date": 1518667427000
        }];
    },
    //这个是要执行的函数
    methods: {
      csd(){
        const types = ['重复报警', '工作', '刑事案件', '抢险救援（119）', '治安案件', '交通类警情', '骚扰', '灾害事故', '火灾事故', '群体性事件', '处警反馈', '其他警情', '15', '举报投诉', '无效', '群众求助', '社会联动', '咨询', '行政违法'];
        const bbbb = ["刑事案件", "交通类警情", "治安案件", "举报投诉", "无效", "群众求助"];
        for (let j = 0; j < types.length; j++) {
          /*let dataTrue = bbbb.find(function (value, index, arr) {
            return value == types[j];
          })*/
          let dataTrue = bbbb.find((n) => n == types[j])
          //bbbb.find((n) => n < 0)
  
          //console.log(types[j]);
  
          console.log(dataTrue);
          
        }
        
        
      },
      tableGSH(){
        
        const self = this;
        const types = ['重复报警', '工作', '刑事案件', '抢险救援（119）', '治安案件', '交通类警情', '骚扰', '灾害事故', '火灾事故', '群体性事件', '处警反馈', '其他警情', '15', '举报投诉', '无效', '群众求助', '社会联动', '咨询', '行政违法'];
        for (let i = 0; i < self.LSarray.length; i++) {
          let myData = new Map(self.LSarray[i].countDtoList);
          let arr = [...myData.keys()];
          let arr2 = [...myData.values()];
          let numobj = {};
          for (let j = 0; j < types.length; j++) {
            let dataTrue = arr.findIndex((n) => n == types[j])
            if(dataTrue == -1){
              numobj[types[j]] = 0
            }else{
              numobj[types[j]]  = arr2[dataTrue];
            }
          }
          //console.log(numobj);
          //self.LSarray[i].assign(numobj);
          Object.assign(self.LSarray[i],numobj)
          console.log(self.LSarray[i]);
        }
  
      },
      
      
      /*    //查询
       typeSearch(){
       const self = this;
       //console.log(self.USearch);
       self.loading = true;
       self.$http.post('http://39.104.113.229:8761/count/findJcjbCountsByDate/ajlx', self.USearch).then((response) => {
       console.log('success');
       var result = response.body;
       self.searchResult = [];
       self.searchResult = result.content;
       console.log(self.searchResult)
       self.total = result.totalElements;
       self.totalPages = result.totalPages;
       self.currentPage = result.number;
       if (self.totalPages > 0) {
       self.pageState = true;
       }
       
       self.loading = false;
       }, (response) => {
       console.log('error');
       });
       },
       
       //查询
       getMyTime(val){
       if(val){
       this.USearch.bjsjStart = moment(val[0]).utc().format();
       this.USearch.bjsjEnd = moment(val[1]).utc().format();
       }else{
       this.USearch.bjsjStart ="";
       this.USearch.bjsjEnd ="";
       }
       },*/
    },
    watch: {},
  }
</script>

<style lang="css" scoped>
</style>
