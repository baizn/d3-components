##极坐标图形说明文档

###1 使用说明
```
var relationChart = require('relationChart')

var width = 500
var height = 500

var data = {
"detail":{
  "caseName": "前端组"
},
"casePerson":[
    {
      "name": "白老师",
      "cardId": "2334344412223",
      "falg": 1
    },
    {
      "name": "帮主",
      "cardId": "2334344412223",
      "falg": 0
    },
    {
      "name": "涂宜冬",
      "cardId": "2334344412223",
      "falg": 0
    },{
      "name": "污妈妈",
      "cardId": "2334344412223",
      "falg": 0
    },{
      "name": "周玉",
      "cardId": "2334344412223",
      "falg": 0
    },{
      "name": "小桥",
      "cardId": "2334344412223",
      "falg": 0
    },{
      "name": "姜神",
      "cardId": "2334344412223",
      "falg": 0
    },{
      "name": "李伟",
      "cardId": "2334344412223",
      "falg": 0
    },{
      "name": "汤全昆",
      "cardId": "2334344412223",
      "falg": 0
    }
]
}

var config = {
  width: width,
  height: height,
  outerCircle: {
    radius: 35,
    color: ['#082463', '#09194a', '#3f00c9', '#6d00bf'] 
  },
  onnectLine:{
    color: '#00feff',
    width: 2
  },
  radius: 120
  
}
var svg = d3.select('body')
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style('padding', '20px')
    .attr('class', 'svg')

relationChart.drawChart(svg, data, config)
```

###2 效果展示

![splitBar](img/relationChart.png)

###3 接口说明

####3.1 接口调用
调用方式：`relationChart.drawChart(svg, data, config)`

参数说明：

- svg: svg实例
- data：数据
- config：配置项


### 配置项参数说明

| 字段                 | 含义    | 是否必选 | 默认值     | 备注   |
| ------------------ | ----- | ---- | ------- | ---- |
| width              | svg宽度 | 是    | 500     |      |
| height             | svg高度 | 是    | 500     |      |
| outerCircle        | 外圆样式  | 否    | 无       |      |
| outerCircle.radius | 圆半径   | 否    | 35      |      |
| onnectLine         | 连接线样式 | 否    |         |      |
| onnectLine.color   | 线的颜色  | 否    | #00feff |      |
| onnectLine.width   | 线宽    | 否    | 2       |      |
| radius             | 内圆半径  | 否    | 120     |      |

