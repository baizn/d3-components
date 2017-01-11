/**
 * 六边形组合柱状图组件
 * @autor zhanghq
 * @date 2016-1-5
 */

define(function(require) {
  /**
   * 引入公用的文件
   */
  require('lodashJS')
  require('d3')

  var polygonBar = {
    /**
     * 柱状图默认配置项
     */
    defaultSetting: function() {
      var width = 450
      var height = 400
      return {
        width: width,
        height: height,
        min: 0,
        scale: 1,
        zoom: 8,
        color: ['#d63200', '#9936e8'],
        padding: {
          bottom: 60,
          left: 50
        },
        margin: {
          left: 65
        },
        coordinate: [130,20, 20,40, 20,220, 130,200, 220,220, 220,40] , //六边形的六个坐标点
        //coordinate: [60,20, 20,90, 60,160, 140,160, 180,90, 140,20], //正六边形的六个坐标点
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
        }
      }
    },
    /**
     * 绘制柱状图
     */
    drawPolygonBar: function(svg, data, opt) {
      var config = _.assign({}, this.defaultSetting(), opt)
      var dataset = []
      for(var i = 0, len = data.length; i<len; i++){
        dataset.push(data[i].value)
      }
      var polygonW = 25
      var dataLen = data.length

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
      var dataWidth = height - config.padding.bottom
      var max = Math.floor(dataWidth/polygonW)   

      //定义一个线性渐变
      var color = config.color
      var a = d3.hcl(color[0]);    
      var b = d3.hcl(color[1]);    
      var compute = d3.interpolate(a,b); 
      var linear = d3.scale.linear()  
            .domain([0, max])  
            .range([0, 1.5])
        
      //定义y轴标尺
      var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset)])
        .range([height-config.padding.bottom, 0])
      //定义纵轴  
      
      var yAxis=d3.svg.axis()
        .scale(yScale)
        .orient("left")
          
      //添加y轴
      if(config.yAxis.show){
        var yBar=svg.append("g")
          .attr('class','axis axis-y')
          .attr('transform', 'translate('+config.padding.left+', '+config.padding.bottom/2+')')
          .call(yAxis)
      }
      //添加六边形的area
      var areas = enter.append('g')
        .attr('transform',function(d,i){
          i++
          return 'translate('+(i*config.margin.left)+', '+(height-config.padding.bottom)+')'
        })
        .attr('class', 'areas')

        var unit = Math.floor(d3.max(dataset) * config.scale/ (max - config.min))

        var itemStyle =  {
          strokeWidth: config.itemStyle.strokeWidth,
          stroke: config.itemStyle.stroke
        }

        var oPoints = config.coordinate
        var points = []
        for(var i = 0;i<oPoints.length;i++){
          points.push(oPoints[i]/config.zoom)
        }
        var index = 0
        var textPosi = []
        areas.selectAll(".polygon")
           .data(function(d,i){
              var range = Math.floor(dataset[i] / unit)
              if(range==0){
                range = 1
              }
             if(range>max){
               range = max
             }  
              textPosi.push(range)
              return d3.range(config.min, range)
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
          .attr('y', (config.padding.bottom-textStyle.padding.bottom))
          .text(function(d,i){
            return data[i].name
          })
          
          //添加value
          // areas.append('text')
          //   .attr('fill', textStyle.color)
          //   .attr('font-size', textStyle.size)
          //   .attr('text-anchor', textStyle.textAnchor)
          //   .attr('x', 0)
          //   .attr('y', function(d,i){
          //     console.log(textPosi[i]*-polygonW)
          //     return textPosi[i]*-polygonW+35
          //   })
          //   .text(function(d,i){
          //     return data[i].value
          //   });
          exit.remove()
          //x轴线

          svg.append('rect')
            .attr('width', width-config.margin.left/2 - config.padding.left-polygonW*dataLen)
            .attr('height', 1)
            .attr('fill', '#fff')
            .attr('x', config.padding.left)
            .attr('y', (height - config.padding.bottom/2))

    }
  }

  return polygonBar
})