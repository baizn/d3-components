##三角形柱状图说明文档

###1 使用说明
```
var bar = require('splitBar)

var width = 450
var height = 280

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
    padding:{
      left: 45,
      bottom: 60,
      top:20
    },
    barWidth: 6,
    lineColor: '#2c668e',
    color: ['#b3ff03', '#54a707'],
    borderColor: '#de2528',
    borderWidth: 1,
    circle:{
      color:'#fff',
      r: 3,
    },
    xText:{
      color: '#a5cfe0'
    }
  }
bar.drawTriangleBar(svg, data, config)
```

###2 接口说明
####2.1 接口调用
调用方式：`bar.drawTriangleBar(svg, data, config)

参数说明：

- svg: svg实例
- data：数据
- config：配置项


