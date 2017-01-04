##刻度柱状图说明文档

###1 使用说明
```
var splitBar = require('splitBar)

var width = 300
var height = 300

var svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

var data = [
    {
      name: "江北区",
      value: 6025
    },{
      name: "渝北区",
      value: 4928
    }
  ]

var config = {
    width: width,
    height: height,
    fontFamily: '微软雅黑',
    min: 0,
    max: 25,
    scale: 1,
    rectStyle: {
      width: 4,
      height: 6,
      color: ['#5810ed', '#282f36'],
      spacing: 4, //小方块之间的间距
      skewX: 30,  //倾斜角度
      radius: 3,  //椭圆的半径
      margin: {
        left:10,
        right:10
      },
      symbol: 'tilt',  //方块类型（矩形rect，平行四边形tilt，椭圆circle）
    },
    leftTextStyle: {
      fontSize: 12,
      color: 'yellow',
      textAnchor: 'end'
    },
    rightTextStyle: {
      fontSize: 12,
      color: '#fff',
      textAnchor: 'middle'
    },
    grid: {
      x: 60,
      x2: 40
    }
  }
splitBar.drawSplitBar(svg, data, config)
```

###2 接口说明
####2.1 接口调用
调用方式：`splitBar.drawSplitBar(svg, data, config)`

参数说明：

- svg: svg实例
- data：数据
- config：配置项


