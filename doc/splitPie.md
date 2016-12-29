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

###2 接口说明
####2.1 接口调用
调用方式：`splitPie.drawSplitPie(svg, data, config)`

参数说明：

- svg: svg实例
- data：数据
- config：配置项


