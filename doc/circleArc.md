##半圆组件说明文档

###1 使用说明
```
var circleArc = require('circleArc')

var width = 300
var height = 300

var config = {
    width: width,
    height: height,
    outerRadius: 106,
    innerRadius: 96
}

var data = {
    value: 10.8,
    name: '名称'
}

//container为页面div元素的ID
var svg = d3.select('#container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

circleArc.drawArc(svg, data, config)
```

###2 效果展示

![](img/circleArc.png)

###3 接口说明
####3.1 接口调用
调用方式：`circleArc.drawArc(svg, data, config)`

参数说明：

- svg: svg实例
- data：数据
- config：配置项


### 4 配置项字段说明

| 字段          | 含义    | 是否必选 | 默认值     | 备注   |
| ----------- | ----- | ---- | ------- | ---- |
| width       | svg宽度 | 否    | 200     |      |
| height      | svg高度 | 否    | 200     |      |
| outerRadius | 外半径   | 否    | width/4 |      |
| innerRadius | 内半径   | 否    | width   |      |

