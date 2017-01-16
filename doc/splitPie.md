##刻度饼图说明文档

###1 使用说明
```
var splitPie = require('splitPie)

var width = 300
var height = 300

var svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

var data = [100, 20]

var config = {
    width: width,
    height: height,
    min: 0,
    max: 40, //限制平分最多个数
    //...
}
splitPie.drawSplitPie(svg, data, config)
```

###2 效果展示

![](img/splitPie.png)

###3 接口说明
####3.1 接口调用
调用方式：`splitPie.drawSplitPie(svg, data, config)`

参数说明：

- svg: svg实例
- data：数据
- config：配置项


### 4 配置项字段说明

| 字段          | 含义     | 是否必选 | 默认值                    | 备注         |
| ----------- | ------ | ---- | ---------------------- | ---------- |
| width       | svg宽度  | 否    | 200                    |            |
| height      | svg高度  | 否    | 200                    |            |
| min         | 平分最小个数 | 否    | 0                      |            |
| max         | 平分最大个数 | 否    | 20                     |            |
| scale       | 缩放因子   | 否    | 1                      |            |
| outerRadius | 外半径    | 否    | width/4                |            |
| innerRadius | 内半径    | 否    | width                  |            |
| color       | 两个颜色值  | 否    | ['#c00cee', '#5478ff'] | color类型为数组 |

