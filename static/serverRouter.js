/**
 * 隐藏：人非草芥
 * 日期：2018/05/06
 * 时间：15:10
 * 作用：serverRouter 此处打码
 */

const serverRouter={
  server01:'http://47.98.172.119:8761/zbyxxb/',//登录
  server02:'http://47.98.172.119:8761/ajb/findAjlx',//案件类型
  server03:'http://47.98.172.119:8761/ajb/findByAjlx/',//案件性质
  server04:'http://47.98.172.119:8761/ajb/findByAjlxAndAjxz/',//性质分类
  server05:'http://47.98.172.119:8761/ajb/findByAjlxAndAjxzAndXzfl/',//性质细类
  server06:'http://47.98.172.119:8761/jcjb/findPagerByJcjb/',//基本查询,翻页
  server07:'http://47.98.172.119:8761/jcjb/findJcjbByJjh2Word/',//基本查询查看
  server08:'http://47.98.172.119:8761/hjjlb/findLdsjBetweenGroupByBjhm',//报警号码查询
  server09:'http://47.98.172.119:8761/count/findJcjbCountsByDate/ajlx',//日期时段类型查询
  server10:'http://47.98.172.119:8761/count/findJcjbCountByCol/ajlx/',//案件类型图表
  server11:'http://47.98.172.119:8761/count/findJcjbCountByCol/ajxz/',//案件性质图表
  server12:'http://47.98.172.119:8761/count/findJcjbCountByCol/xzfl/',//性质分类图表
  server13:'http://47.98.172.119:8761/count/findJcjbCountByCol/xzxl/',//性质细类图表
  server14:'http://47.98.172.119:8761/hjjlb/findLdsjBetweenGroupByHjzt',//呼叫状态
  server15:'http://47.98.172.119:8761/count/findJcjbCountByCol/zby',//值班员
  server16:'http://47.98.172.119:8761/count/findJcjbCountByCol/ssxq',//所属辖区
  server17:'http://47.98.172.119:8761/count/findJcjbCountsByTimeScope/ajlx',//时段查询
/*  server18:'XXXXXXXXXXXXX',//XXXXXXXX
  server19:'XXXXXXXXXXXXX',//XXXXXXXX
  server20:'XXXXXXXXXXXXX',//XXXXXXXX*/
};
