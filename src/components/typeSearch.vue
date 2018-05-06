<!----
  * 隐藏：人非草芥
  * 日期：2018/04/24
  * 时间：11:35
  * 作用：typeSearch 此处打码
--->
<template lang="html">
  <div id='typeSearch' class="">
    <el-date-picker v-model="timeSlot" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                    align="right" @change="getMyTime" unlink-panels value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
    <el-button type="primary" @click="typeSearch">搜索</el-button>

    <el-table :data="searchResult" border style="width: 100%;"  height="800" v-loading="loading" class="table-small-padding noPrint">
      <el-table-column prop="date" label="日期" fixed :formatter="dateYMD" sortable></el-table-column>
      <el-table-column prop="刑事案件" label="刑事案件" sortable></el-table-column>
      <el-table-column prop="治安案件" label="治安案件" sortable></el-table-column>
      <el-table-column prop="交通类警情" label="交通类警情" sortable></el-table-column>
      <el-table-column prop="群体性事件" label="群体性事件" sortable></el-table-column>
      <el-table-column prop="灾害事故" label="灾害事故" sortable></el-table-column>
      <el-table-column prop="火灾事故" label="火灾事故" sortable></el-table-column>
      <el-table-column prop="处警反馈" label="处警反馈" sortable></el-table-column>
      <el-table-column prop="举报投诉" label="举报投诉" sortable></el-table-column>
      <el-table-column prop="群众求助" label="群众求助" sortable></el-table-column>
      <el-table-column prop="社会联动" label="社会联动" sortable></el-table-column>
      <el-table-column prop="行政违法" label="行政违法" sortable></el-table-column>
      <el-table-column prop="咨询" label="咨询" sortable></el-table-column>
      <el-table-column prop="骚扰" label="骚扰" sortable></el-table-column>
      <el-table-column prop="抢险救援（119）" label="抢险救援（119）" sortable></el-table-column>
      <el-table-column prop="工作" label="工作" sortable></el-table-column>
      <el-table-column prop="重复报警" label="重复报警" sortable></el-table-column>
      <el-table-column prop="其他警情" label="其他警情" sortable></el-table-column>
      <el-table-column prop="无效" label="无效" sortable></el-table-column>

    </el-table>

    <div class="block noPrint" v-if="pageState">
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="pageSize" :current-page="currentPage" @current-change="pageNow"
                     @size-change="handleSizeChange">
        total总条目数 page-size 每页显示条目个数 current-page 当前页数 :before-close="handleClose"
      </el-pagination>
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

    },
    //这个是要执行的函数
    methods: {
  
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
          self.$http.post(serverRouter.server09, self.USearch).then((response) => {
            console.log('success');
            var result = response.body;
            self.searchResult = [];
            self.searchResult = result;
            const types = ['重复报警', '工作', '刑事案件', '抢险救援（119）', '治安案件', '交通类警情', '骚扰', '灾害事故', '火灾事故', '群体性事件', '处警反馈', '其他警情', '举报投诉', '无效', '群众求助', '社会联动', '咨询', '行政违法'];
            for (let i = 0; i < self.searchResult.length; i++) {
              let myData = new Map(self.searchResult[i].countDtoList);
              let arr = [...myData.keys()];
              let arr2 = [...myData.values()];
              let numobj = {};
              for (let j = 0; j < types.length; j++) {
                let dataTrue = arr.findIndex((n) => n == types[j]);
                if (dataTrue == -1) {
                  numobj[types[j]] = 0
                } else {
                  numobj[types[j]] = arr2[dataTrue];
                }
              }
              //self.searchResult[i].assign(numobj);
              Object.assign(self.searchResult[i], numobj)
            }
    
    
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
        console.log(row,column);
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD");
      },
    },
    watch: {},
  }
</script>

<style lang="css" scoped>
</style>
