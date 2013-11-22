/* File Name : condition.js
 * Date : 2013-11-12 00:52
 * Author: DemoHn
 * 附注:这可能是我写过的最神奇的条件判断方法了~~
 * */

/*condition.js使用说明:
 * 本函数的作用只是写一个条件表达式.当然,语法是自己设计的:
 *
 * # 基础语法
 * [condition,param1,param2]
 *
 * 其中condition为一个特殊的字符串,用来表示条件,如"$eq"表示相等.
 * 举例:["$eq",10,100] <==> (10 == 100) => false
 * 注意:第一个一定要是一个字符串!
 *
 * # 嵌套
 * param1(2)里也可以套一个所谓的"条件表达式"
 * 这一般用于"与","或"等运算中
 * 如:["$and",["$eq",100,10],["$eq","hehe","xixi"]]
 * <==> (100 == 10) && ("hehe" == "xixi") => false
 *
 * # 参数
 * 通过函数的第二个参数 (params)来引入参数
 * 具体写法: #string <==> params.string (params["string"])
 * */

var _ = {
   cloneObject : function(obj) {
    var newObj = (obj instanceof Array) ? [] : {};
        for (var i in obj) {
                 if (i == 'cloneObject') continue;
                 if (obj[i] && typeof obj[i] == "object") {
                 newObj[i] = _.cloneObject(obj[i]);
                 } else newObj[i] = obj[i];
        } return newObj;
  },
  isArray : function(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
  },
  isRegExp : function(obj){
    return Object.prototype.toString.call(obj) === '[object RegExp]';
  }
};


var handleCondition = function(condition,params){
  var dup_condition;
  dup_condition = _.cloneObject(condition);

  var __replace = function(str){
    var reg_slot = /^#(.+)/;

    if(reg_slot.test(str) == true){
      var ss = reg_slot.exec(str)[1];
      return params[ss];
    }else{
      return str;
    }
  };

  var compare = function(a){
    var arr = a;
    if(params != undefined){
      for(var j =1;j<arr.length;j++){
        arr[j] = __replace(arr[j]);
      }
    }
    switch(arr[0]){
      case "$eq":
      case "==":
        return (arr[1] == arr[2]);

      case "$eql":
      case "===":
        return (arr[1] === arr[2]);

      case "$ne":
      case "!=":
        return (arr[1] != arr[2]);

      case "$nel":
      case "!==":
        return (arr[1] !== arr[2]);

      case "$lt":
      case "<":
        return (arr[1] < arr[2]);

      case "$gt":
      case ">":
        return (arr[1] > arr[2]);

      case "$and":
      case "&&":
        return (arr[1] && arr[2]);

      case "$or":
      case "||":
        return (arr[1] || arr[2]);

      case "$match":
        if(_.isRegExp(arr[1])){
          return arr[1].test(arr[2]);
        }else{
          var str = String(arr[1]);
          var reg = new RegExp(arr[1]);
          return reg.test(arr[2]);
        }

      default:
        return (arr[1] == arr[2]);
    }
  };

  if(_.isArray(dup_condition)){

     var im = function (arr){
      for(var i=0;i<3;i++){
        if(_.isArray(arr[i])){
          arr[i] = im(arr[i]);
        }
      }
      return compare(arr);
    };

    var res = im(dup_condition);
    return res;
  }
};
exports.handleCondition = handleCondition;
