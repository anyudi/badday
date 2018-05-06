<!----
  * 隐藏：人非草芥
  * 日期：2018/03/31
  * 时间：18:54
  * 作用：BasicSearch 此处打码  class="noPrint"
--->
<template lang="html">
    <div id='BasicSearch' class="">
      <div id="csprint" ref="printBox"></div>
      <el-form :inline="true" :model="USearch" class="demo-form-inline noPrint">
        <el-form-item label="选择时间">
          <el-date-picker v-model="timeSlot" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" @change="getMyTime"  unlink-panels value-format="yyyy-MM-dd hh:mm:ss" ></el-date-picker>
        </el-form-item>
        <el-form-item label="报警电话">
          <el-input v-model.trim="USearch.bjdh" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="案发地址">
          <el-input v-model.trim="USearch.fadz" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="案件类型">
          <el-select v-model="USearch.ajlx" placeholder="案件类型" @change="findajxz">
            <el-option v-for="(item,index) in ajlxItems" :key="index" :value="item" > </el-option>
          </el-select>
          <el-select v-model="USearch.ajxz" placeholder="案件性质" @change="findxzfl">
            <el-option v-for="(item,index) in ajxzItems" :key="index" :value="item" > </el-option>
          </el-select>
          <el-select v-model="USearch.xzfl" placeholder="性质分类" @change="findxzxl">
            <el-option v-for="(item,index) in xzflItems" :key="index" :value="item" > </el-option>
          </el-select>
          <el-select v-model="USearch.xzxl" placeholder="性质细类">
            <el-option v-for="(item,index) in xzxlItems" :key="index" :value="item" > </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接警摘要">
          <el-input v-model.trim="USearch.jjzy" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="接 警 员">
          <el-input v-model.trim="USearch.zby" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">查询</el-button>
          <el-button type="primary"  @click="export2Excel">导出</el-button>
          <el-button type="primary" @click="clearSearch">清空</el-button>
        </el-form-item>
      </el-form>
      <div>{{CSD}}</div>
      <el-table :data="searchResult" border style="width: 100%" v-loading="loading" class="table-small-padding noPrint">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="bjdh" label="报警电话" sortable></el-table-column>
       <!-- <el-table-column prop="bjdw" label="报警单位"></el-table-column>-->
        <el-table-column prop="bjsj" label="报警时间" :formatter="dateFormat" sortable > </el-table-column>
        <el-table-column prop="fadz" label="发案地址"></el-table-column>
        <el-table-column prop="jjzy" label="接警摘要"></el-table-column>
        <el-table-column prop="bjrxm" label="报警人姓名"></el-table-column>
        <el-table-column prop="ajlx" label="案件类型"></el-table-column>
        <el-table-column prop="ajxz" label="案件性质"></el-table-column>
        <el-table-column prop="bjrxb" label="性别" :filters="[{ text: '男', value: '男' }, { text: '女', value: '女' }]" :filter-method="screenSex"> </el-table-column>
        <el-table-column fixed="right" label="操作"  class-name="customTd">
          <template slot-scope="scope">
            <el-tooltip class="item small-badge" effect="dark" content="播放录音" placement="top">
              <el-badge :value="3" :max="9" class="item">
                <el-button class="bigICO" size="mini"  @click="playRecordNow(scope.$index, scope.row)"><i class="fas fa-volume-down"></i></el-button>
              </el-badge>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看详细" placement="top">
              <el-button class="bigICO"  size="mini" @click="handleView(scope.$index, scope.row)"><i class="fa fa-file-alt" aria-hidden="true"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改记录" placement="top">
              <el-button class="bigICO" size="mini" @click="handleEdit(scope.$index, scope.row)"><i class="fa fa-edit" aria-hidden="true"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>



      </el-table>
      <div class="block noPrint" v-if="pageState">
        <el-pagination layout="total, sizes, prev, pager, next, jumper"  :total="total"  :page-size="pageSize" :current-page="currentPage" @current-change
          ="pageNow" @size-change="handleSizeChange">
          total总条目数  page-size	每页显示条目个数   current-page	当前页数 :before-close="handleClose"
        </el-pagination>
      </div>

      <el-dialog title="详细信息" :visible.sync="dialogTableVisible" class="PrintNow" id="printNow" ref="printNow"  >
        <el-form :inline="true" :model="detailed" class="demo-form-inline form-view" :label-position="labelPosition"  label-width="100px">
          <el-row :gutter="20">
            <el-col :md="24" :lg="12">
              <el-form-item label="接警号"><div>{{detailed.jjh}}</div></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="接警员"><div>{{detailed.zby}}</div></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="呼入时间"><div>{{detailed.bjsj}}</div></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="接警时间"><div>{{detailed.jjsj}}</div></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="报警电话"><div>{{detailed.bjdh}}</div></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="报警人"><div>{{detailed.bjrxm}}</div></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="性别"><div>{{detailed.bjrxb}}</div></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="报警时间"><div>{{detailed.bjsj}}</div></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="案件类型"><div>{{detailed.ajlx}}</div></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="案件性质"><div>{{detailed.ajxz}}</div></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="性质分类"><div>{{detailed.xzfl}}</div></el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="性质细类"><div>{{detailed.xzxl}}</div></el-form-item>
            </el-col>
            <el-col :md="24" :lg="24">
              <el-form-item label="发案地址"><div>{{detailed.fadz}}</div></el-form-item>
            </el-col>
            <el-col :md="24" :lg="24">
              <el-form-item label="警情摘要" class="bigHight"><div>{{detailed.jjzy}}</div></el-form-item>
            </el-col>
            <template v-for="(item,index) in detailed.cjbs">
              <el-col :md="24" :lg="12">
                <el-form-item label="处警单位"><div>{{item.gxbq}}</div></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12">
                <el-form-item label="受理人"><div>{{item.slr}}</div></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12">
                <el-form-item label="处警时间"><div></div></el-form-item>
              </el-col>
              <el-col :md="24" :lg="12">
                <el-form-item label="受理时间"><div>{{item.slsj}}</div></el-form-item>
              </el-col>
              <el-col :md="24" :lg="24">
                <el-form-item label="反馈信息" class="bigHight"><div>{{item.cjjg}}</div></el-form-item>
              </el-col>
            </template>


          </el-row>
        </el-form>


        <div style="text-align: right; padding-top: 10px;">
          <el-button type="primary" @click="printNow"><i class="fas fa-print"></i>打印</el-button>
          <a :href="wordDownload" class="el-button el-button--primary" download="别闹腾了好好过日子"><i class="far fa-file-word"></i>导出word</a>



        </div>
      </el-dialog>

      <el-dialog title="编辑信息" :visible.sync="from_edit" class="noPrint">
        <el-form :inline="true" :model="detailed" :rules="rules" class="demo-form-inline" :label-position="labelPosition"  label-width="120px">
          <el-form-item label="报警电话">
            <el-input v-model="detailed.bjdh" placeholder="" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="报警黑幕">
            <el-input v-model="detailed.bjhm" placeholder="" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="报警人性别">
            <el-input v-model="detailed.bjrxb" placeholder="" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="报警人手机">
            <el-input v-model="detailed.bjsj" placeholder="" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="报警学生">
            <el-input v-model="detailed.bjxs" placeholder="" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="发案地址"  prop="fadz">
            <el-input v-model="detailed.fadz" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="guid">
            <el-input v-model="detailed.guid" placeholder="" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="接警手机">
            <el-input v-model="detailed.jjsj" placeholder="" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="喝酒了时间">
            <el-input v-model="detailed.hjlsh" :formatter="dateFormat" placeholder="" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="接警号">
            <el-input v-model="detailed.jjh" placeholder="" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="司机值班员">
            <el-input v-model="detailed.sjzby" placeholder="" clearable disabled></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="播放录音" :visible.sync="playRecord" class="PrintNow"  @close="closeM">

        <aplayer autoplay
                 theme="pic"
                 shuffle  :theme="zxcv"
                 repeat="list"
                 show-lrc
                 :controls="controls"
                 :muted.sync="muted"
                 :volume.sync="volumeVal"
                 :music.sync='music3'
                 :list='recordList'
        />

      </el-dialog>

    </div>
</template>
<script>
  import Aplayer from 'vue-aplayer'
  import {formatDate} from '@/common/js/data.js'
  var moment = require('moment');
  moment().format();
	export default {
		name: 'BasicSearch',
		props: {},
    components: {
      Aplayer,
    },
    computed: {
      volumeVal: {
        get () {
          return +this.volume
        },
        set (val) {
          this.volume = val
        }
      }
    },
		data(){
			return {
        CSD:'',
        isActive:true,
        labelPosition:'right',

        USearch:{
          bjsjStart:'',
          bjsjEnd:'',
          bjdh:'',
          afdz:'',
          jjzy:'',
          jjy:'',
          ajlx:'',
          ajxz:'',
          xzfl:'',
          xzxl:'',
        },
        ajlxItems:[],
        ajxzItems:[],
        xzflItems:[],
        xzxlItems:[],

        //日期
        timeSlot:'',
        pickerOptions2:{
          //限制日期
          disabledDate(time) {
            return time.getTime() > Date.now() ;
          }
        },
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
        //查看编辑
        from_edit:false,
        dialogTableVisible: false,
        detailed:{},
        rules: {
          fadz: [
            { required: true, message: '案发地址不能为空', trigger: 'blur' },
            { min: 5, message: '长度不能低于 5 个字符', trigger: 'blur' }
          ],
        },
        //翻页
        loading:false,
        searchResult:[],//结果存放地
        total:0,//总条数
        totalPages:0,//总页数
        pageSize:10,//每页显示条目个数
        pageState:false,//是否显示页码
        currentPage:1,//当前第几页

        //录音
        zxcv:"rgba(26,152,225,1)",
        playRecord:false,
        controls: false,
        volume: 1,
        muted: false,
        music3: null,
        recordList: [
          {
            title:"道道道",
            artist: '黄霑',
            src: "/static/music/daodaodao.mp3",
            pic: '/static/music/mp3.jpg',
          },
          {
            title: '浮夸',
            artist: 'eason',
            src: "/static/music/fukua.mp3",
            pic: '/static/music/mp3.jpg',
          },
          {
            title: '好久不见',
            artist: 'eason',
            src: "/static/music/haojiubujian.mp3",
            pic: '/static/music/mp3.jpg',
          }
        ],
        wordDownload:""

      }
		},
		//这个是钩子函数
    mounted: function() {
      //案件类型
      const self = this;
      self.$http.get(serverRouter.server02).then((response) => {
        console.log('success');
        let result =response.body;
        self.ajlxItems = [];
        self.ajxzItems = [];
        self.xzflItems = [];
        self.xzxlItems = [];
        self.ajlxItems =result;
      }, (response) => {
        console.log('error');
        // error callback
      });
    },
    //这个是要执行的函数
    methods: {
			//查询
      searchData(){
        const self = this;
        //console.log(self.USearch);
        if(this.USearch.bjsjStart=='' || this.USearch.bjsjEnd==''){
          self.showError();
        }else{
          self.loading = true;
          self.$http.post(serverRouter.server06+ self.currentPage + "/" + self.pageSize,self.USearch).then((response) => {
            console.log('success');
            var result =response.body;
            self.searchResult =[];
            self.searchResult = result.content;
            console.log(self.searchResult);
            self.total = result.totalElements;
            self.totalPages = result.totalPages;
            self.currentPage =result.number;
            if(self.totalPages >0){
              self.pageState = true;
            }
    
            self.loading = false;
          }, (response) => {
            console.log('error');
          });
        }
      },
      //日期
      getStart(val){
        this.USearch.bjsjStart = val;
      },
      getEnd(val){
        this.USearch.bjsjEnd = val;
      },
      getMyTime(val){
        if(val){
          this.USearch.bjsjStart = moment(val[0]).utc().format();
          this.USearch.bjsjEnd = moment(val[1]).utc().format();
        }else{
          this.USearch.bjsjStart ="";
          this.USearch.bjsjEnd ="";
        }
      },
      //清空
      clearSearch(){
        this.USearch.time='';
        this.USearch.bjdh='';
        this.USearch.afdz='';
        this.USearch.jjzy='';
        this.USearch.jjy='';
        this.USearch.ajlx='';
        this.USearch.ajxz='';
        this.USearch.xzfl='';
        this.USearch.xzxl='';
      },
      //翻页
      pageNow(val){
        const self=this;
        self.loading = true;
        self.currentPage = val;
        self.$http.post(serverRouter.server06 + self.currentPage + "/" + self.pageSize,self.USearch).then((response) =>{
          console.log('success');
          var result =response.body;
          self.searchResult =[];
          self.searchResult = result.content;
          self.total = result.totalElements;
          self.totalPages = result.totalPages;
          self.loading = false;
          /*            var result =response.body;
           self.LSResult ='';
           self.LSResult=result.list;//查询结果
           self.total = result.total;//总条数*/

        }, (response) => {
          console.log('error');
          // error callback
        });
      },
      //每页条数
      handleSizeChange(val){
        const self = this;
        self.pageSize = val;
        self.loading = true;
        self.$http.post(serverRouter.server06 + self.currentPage + "/" + self.pageSize,self.USearch).then((response) => {
          console.log('success');
          let result =response.body;
          self.searchResult =[];
          self.searchResult = result.content;
          self.total = result.totalElements;
          self.totalPages = result.totalPages;
          self.currentPage =result.number;
          if(self.totalPages >0){
            self.pageState = true;
          }

          self.loading = false;
        }, (response) => {
          console.log('error');
        });
      },
      //查看
      handleView(index, row) {
        //console.log(index, row);
        const self = this;
        self.detailed={};
        self.detailed = row;
        self.dialogTableVisible = true;
        self.wordDownload='';

        self.$http.get(serverRouter.server07+self.detailed.jjh).then((response) => {
          console.log('success');
          self.wordDownload=response.body;

          //window.open(response.body)
          //window.location.href=response.body
        }, (response) => {
          console.log('error');
          // error callback
        });


      },
      //编辑
      handleEdit(index, row) {
        //console.log(index, row);
        const self = this;
/*        self.detailed=[];
        self.detailed.push(row);*/
        self.detailed={};
        self.detailed = row;
        //alert(self.detailed)
        self.from_edit = true;
      },
      //播放录音
      playRecordNow(index, row){
        const self = this;
        self.detailed={};
        self.detailed = row;
        self.playRecord = true;
      },
      closeM(){
        document.getElementsByTagName("audio")[0].currentTime = 0;
        document.getElementsByTagName("audio")[0].pause();
      },
      //筛选性别
      screenSex(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },

      //案件性质
      findajxz(val){
        const self = this;
        self.$http.get(serverRouter.server03 + val).then((response) => {
          console.log('success');
          let result =response.body;

          if(result !='' || result != null){
            self.USearch.ajxz = '';
            self.USearch.xzfl ='';
            self.USearch.xzxl = '';
            self.ajxzItems = [];
            self.xzflItems = [];
            self.xzxlItems = [];
            self.ajxzItems =result;
          }
        }, (response) => {
          console.log('error');
        });
      },
      //性质分类
      findxzfl(val){
        const self = this;
        self.$http.get(serverRouter.server04+ self.USearch.ajlx + '/' + val ).then((response) => {
          console.log('success');
          let result =response.body;
          console.log(result);
          if(result !='' || result != null){
            self.USearch.xzfl ='';
            self.USearch.xzxl = '';
            self.xzflItems = [];
            self.xzxlItems = [];
            self.xzflItems =result;
          }
        }, (response) => {
          console.log('error');
        });
      },
      //性质细类
      findxzxl(val){
        const self = this;
        self.$http.get(serverRouter.server05+ self.USearch.ajlx+ '/' + self.USearch.ajxz+ '/' + val + '').then((response) => {
          console.log('success');
          let result =response.body;
          console.log(result);
          if(result !='' || result != null){
            self.USearch.xzxl = '';
            self.xzxlItems = [];
            self.xzxlItems =result;
          }
        }, (response) => {
          console.log('error');
        });
      },
      BasicSearch() {
        console.log(value);
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
  
      showError() {
        this.$message({
          showClose: true,
          message: '时间不能为空~~',
          type: 'error'
        });
      },

      //导出word

      exportWord(val){
      	//alert(val)
        //http://39.104.113.229:8761/jcjb/findJcjbByJjh2Word/
        // 2018040506100000250
        // 2018040506100000247
        const self = this;

      },

      //打印
      printNow(){
        const self = this;
        //alert("212")
        //self.$refs.printNow.style.width = "794";
        //createPdf();
        let newWindow = window.open("_blank");
        let cssText='.el-row{font-size:0;margin:10px!important}.el-col-lg-12{display:inline-block;font-size:14px;width:50%;box-sizing:border-box;line-height:32px;border:1px solid rgba(0,0,0,0.5);margin-top:-1px;margin-left:-1px}.el-col-lg-24{font-size:14px;box-sizing:border-box;line-height:32px;display:block;border:1px solid rgba(0,0,0,0.5);margin-top:-1px;margin-left:-1px;margin-right: 2px;}.el-form-item{margin-bottom:0}.el-form-item__content{display:inline-block;font-weight:bold;padding-left:5px}.el-form-item__label{display:inline-block;color:rgba(0,0,0,0.7);margin-left:-10px;padding-right:5px;padding-left:5px;border-right:1px solid rgba(0,0,0,0.5)}.el-dialog .el-col{border:1px solid rgba(231,235,238,1);margin-top:-2px;margin-left:-1px;padding:0}.bigHight .el-form-item__label{line-height:100px;height:100px}.bigHight .el-form-item__content{letter-spacing:normal;width:calc(100% - 120px);line-height:22px}';
        var head = newWindow.document.getElementsByTagName('head')[0]; //获取head元素
        var style = document.createElement('style'); //创建一个style元素
        style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
        style.rel = 'stylesheet';
        style.appendChild(document.createTextNode(cssText));
        console.log(style);
        /* var textNode = newWindow.document.createTextNode(cssText);
         style.appendChild(textNode);*/


        let codestr = self.$refs.printNow.$children[0].$el.innerHTML;   //获取需要生成pdf页面的div代码
        //console.log(codestr);
        //self.$refs.printBox.text =codestr
        //alert(codestr)
        newWindow.document.write(codestr);   //向文档写入HTML表达式或者JavaScript代码
        newWindow.document.getElementsByTagName('head')[0].appendChild(style);
        //newWindow.document.write(styleLink)
        newWindow.document.close();     //关闭document的输出流, 显示选定的数据
        newWindow.print();   //打印当前窗口
        return true;
        //alert(self.$refs.printNow.offsetWidth)
        //window.print();printBox

      },

      //导出
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      export2Excel() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('../common/js/Export2Excel');
          const tHeader = ['报警电话','报警时间','发案地址','接警摘要','报警人姓名','案件类型','案件性质','性别',];
          const filterVal = ['bjdh','bjsj','fadz','jjzy','bjrxm','ajlx','ajxz','bjrxb', ];
          const list = this.searchResult;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '夭寿了,报警了');
        })
      }

    },
    filters: {
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, "yyyy-MM-dd hh:mm");
      }
    },
    created () {
      this.music3 = this.recordList[0]
    }
	}

  var createPdf = () => {
		alert(document.getElementById("PrintNow").innerHTML);
    let newWindow = window.open("_blank");   //打开新窗口
    let codestr = document.getElementById("PrintNow").innerHTML;   //获取需要生成pdf页面的div代码
    newWindow.document.write(codestr);   //向文档写入HTML表达式或者JavaScript代码
    newWindow.document.close();     //关闭document的输出流, 显示选定的数据
    newWindow.print();   //打印当前窗口
    return true;
  }
</script>

<style lang="css" scoped>
  .bigICO{ padding: 3px; box-sizing: border-box;  width: 26px; height: 26px; margin: 3px; }
  .bigICO i{font-size: 16px;}
  .customTd .cell{ overflow: visible !important;}
  tr>td:first-child .cell{overflow: visible !important;}

.cscs{}

  .grid-content{border-radius: 4px;
    min-height: 36px;}
  .bg-purple {
    background: #d3dce6;
  }

</style>
