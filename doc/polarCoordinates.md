##极坐标图形说明文档

###1 使用说明
```
var polarCoordinates = require('polarCoordinates')

var data = [
    {"name":"江北区2","value":3},
    {"name":"江北区3","value":13},
    {"name":"江北区4","value":31},
    {"name":"江北区5","value":123},
    {"name":"江北区6","value":213},
    {"name":"江北区7","value":1012},
    {"name":"江北区8","value":321},
    {"name":"江北区1","value":23},
    {"name":"江北区2","value":3},
    {"name":"江北区3","value":13},
    {"name":"江北区4","value":31},
    {"name":"江北区5","value":123},
    {"name":"江北区6","value":213},
    {"name":"江北区7","value":1012},
    {"name":"江北区8","value":321},
    {"name":"江北区1","value":23},
    {"name":"江北区2","value":3},
    {"name":"江北区3","value":13},
    {"name":"江北区4","value":31},
    {"name":"江北区5","value":123},
    {"name":"江北区6","value":213},
    {"name":"江北区7","value":1012},
    {"name":"江北区8","value":321},
    {"name":"江北区1","value":23}
  ]
  var width = 500
  var height = 500
  var config = {
      width: width,
      height: height,
      itemStyle: {
        width: 10,
        color: '#ec44ff',
        borderColor: '#0d173f',
        radius: 150,
        max: 75,
        min: 10
      },
      textStyle: {
        distance: 20,
        fontSize: 12,
        color: '#fff'
      }
  }
  var svg = d3.select('#main')
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style('padding-top', '4.5%')


  polarCoordinates.drawChart(svg, data, config)
```

###2 效果展示

![splitBar](img/polarCoordinates.png)

###3 接口说明

####3.1 接口调用
调用方式：`polarCoordinates.drawChart(svg, data, config)`

参数说明：

- svg: svg实例
- data：数据
- config：配置项


### 配置项参数说明

| 字段                    | 含义       | 是否必选 | 默认值     | 备注                       |
| --------------------- | -------- | ---- | ------- | ------------------------ |
| width                 | svg宽度    | 是    | 500     |                          |
| height                | svg高度    | 是    | 500     |                          |
| itemStyle             | 图形样式     | 否    | 无       |                          |
| itemStyle.width       | 柱子宽度     | 否    | 10      |                          |
| itemStyle.color       | 柱子颜色     | 否    | #ec44ff |                          |
| itemStyle.borderColor | 矩形边框颜色   | 否    | #0d173f |                          |
| itemStyle.radius      | 中间圆的半径   | 否    | 150     | 该半径直接关系到外面柱子的显示位置及内部文字显示 |
| itemStyle.max         | 柱子的最大高度  | 否    | 75      |                          |
| itemStyle.min.left    | 柱子的最小高度  | 否    | 10      |                          |
| textStyle             | 字体样式     | 否    | 无       |                          |
| textStyle.distance    | 字体离圆的的距离 | 否    | 20      |                          |
| textStyle.fontSize    | 字体大小     | 否    | 12      |                          |
| textStyle.color       | 字体颜色     | 否    | #fff    |                          |

