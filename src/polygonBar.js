/**
 * 六边形组合柱状图组件
 * @autor zhanghq
 * @date 2016-1-5
 */

define(function(require) {
  /**
   * 引入公用的文件
   */
  require('lodash')
  require('d3')

  var polygonBar = {
    /**
     * 柱状图默认配置项
     */
    defaultSetting: function() {
     
      var width = 450
      var height = 500
      return {
        width: width,
        height: height,
        min: 0,
        max: 19,
        scale: 1,
        zoom: 6,
        color: ['#49aefe', '#9936e8'],
        padding: {
          bottom: 60,
          left: 50
        },
        margin: {
          left: 60
        },
        coordinate: [60,20, 20,90, 60,160, 140,160, 180,90, 140,20], //六边形的六个坐标点
        itemStyle:{
          strokeWidth: 1,
          stroke: '#06b7c7'
        },
        textStyle: {
          size: 14,
          color: '#fff',
          textAnchor: 'start',
          padding:{
            bottom: 10
          }
        },
        yAxis: {
          show: true
        },
        grid: {   //直角坐标系内绘图网格
          x: 60,  //网格左上角横坐标
          x2: 40, //网格右下角横坐标
          y: 50,  //网格左上角纵坐标
          y2: 0
      }
      }
    },
    /**
     * 绘制饼图
     */
    drawSplitBar: function(svg, data, opt) {
      var config = _.assign({}, this.defaultSetting(), opt)
      var dataset = []
      for(var i = 0, len = data.length; i<len; i++){
        dataset.push(data[i].value)
      }
      
      var dataLen = data.length
     
      
      //基础配置项
      var cfg = {
        min: config.min,
        max: config.max,
        scale: config.scale,
        zoom: config.zoom,
        padding: {
          bottom: config.padding.bottom,
          left: config.padding.left
        },
        margin: {
          left: config.margin.left
        },
        yAxis: {
          show: config.yAxis.show
        }
      }
      /**
       * 获取update部分
       */
      var update = svg.selectAll(".areas")
        .data(data)
      
      //获取enter部分
      var enter = update.enter()

      //获取exit部分
      var exit = update.exit()

      var width = config.width
      var height = config.height
          
      //定义一个线性渐变
      var color = config.color
      var a = d3.hcl(color[0]);    
      var b = d3.hcl(color[1]);    
      var compute = d3.interpolate(a,b); 
      var linear = d3.scale.linear()  
            .domain([0, 15])  
            .range([0, 1.5])
        
      //定义y轴标尺
      var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset)])
        .range([height-cfg.padding.bottom, 0])
      //定义纵轴  
      var yAxis=d3.svg.axis()
        .scale(yScale)
        .orient("left")
          
      //添加y轴
      if(cfg.yAxis.show){
        var yBar=svg.append("g")
          .attr('class','axis axis-y')
          .attr('transform', 'translate('+cfg.padding.left+', '+cfg.padding.bottom/2+')')
          .call(yAxis)
      }
      //添加六边形的area
      var areas = enter.append('g')
        .attr('transform',function(d,i){
          i++
          return 'translate('+(i*cfg.margin.left)+', '+(height-cfg.padding.bottom)+')'
        })
        .attr('class', 'areas')

        var unit = Math.floor(d3.max(dataset) * cfg.scale/ (cfg.max - cfg.min))
        var itemStyle =  {
          strokeWidth: config.itemStyle.strokeWidth,
          stroke: config.itemStyle.stroke
        }

        var oPoints = config.coordinate
        var points = []
        for(var i = 0;i<oPoints.length;i++){
          points.push(oPoints[i]/cfg.zoom)
        }
        var index = 0
        var textPosi = []
        areas.selectAll(".polygon")
           .data(function(d,i){
              var range = Math.floor(dataset[i] / unit)
              textPosi.push(range)
              return d3.range(cfg.min, range)
           })
           .enter()
           .append("polygon")
           .style("stroke-width", itemStyle.strokeWidth)
           .style("stroke", itemStyle.stroke)
           .attr("points", points)
           //渐变色
           .style("fill",function(d){  
              return compute(linear(d));  
           })
          .attr('transform',function(d,i){
              return 'translate(0,'+-(i*23)+')'
           })
          .attr('class', 'polygon')

          //x轴文字
          var textStyle = {
            size: config.textStyle.size,
            color: config.textStyle.color,
            textAnchor: config.textStyle.textAnchor,
            padding: {
              bottom: config.textStyle.padding.bottom
            }
          }
          areas.append('text')
          .attr('fill', textStyle.color)
          .attr('font-size', textStyle.size)
          .attr('text-anchor', textStyle.textAnchor)
          .attr('x', 0)
          .attr('y', (cfg.padding.bottom-textStyle.padding.bottom))
          .text(function(d,i){
            return data[i].name
          })
          
          //添加value
          areas.append('text')
            .attr('fill', textStyle.color)
            .attr('font-size', textStyle.size)
            .attr('text-anchor', textStyle.textAnchor)
            .attr('x', 0)
            .attr('y', function(d,i){
              return textPosi[i]*-22
            })
            .text(function(d,i){
              return data[i].value
            });
          
          //x轴线
          svg.append('rect')
            .attr('width', width-cfg.margin.left/2 - cfg.padding.left)
            .attr('height', 1)
            .attr('fill', '#fff')
            .attr('x', cfg.padding.left)
            .attr('y', (height - cfg.padding.bottom/2))

    }
  }

  return polygonBar
})