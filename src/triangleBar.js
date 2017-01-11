/**
 * @Author:      zhq
 * @DateTime:    2017-01-10 20:12:27
 * @Description: Description
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-10 20:12:27
 */

define(function(require){
    /**
   * 引入公用的文件
   */
  require('lodash')
  require('d3')
  var linearGradient1 = ''

  var triangleBar = {
    defaultSetting: function() {
      var width = 450
      var height = 280
      return {
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
    },
    /**
     * 绘制柱状图
     */
    drawTriangleBar: function(svg, data, opt) {
      var cfg = _.assign({}, this.defaultSetting(), opt)
      var width = cfg.width
      var height = cfg.height
      var color = cfg.color
      var _slef = this
      var dataset = []
      var dataX = []
      for(var i = 0; i<data.length; i++){
        dataset.push(data[i].value)
        dataX.push(data[i].name)
      }

      //定义一个线性渐变     
        _slef.Gradient(svg, color) 
       //定义y轴标尺
      var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset)])
        .range([height-cfg.padding.bottom-cfg.padding.top, 0])
      //定义纵轴  
      var yAxis=d3.svg.axis()
        .scale(yScale)
        .orient("left")
            
      //添加y轴
      var yBar=svg.append("g")
        .attr('class','axis axis-y')
        .attr('transform', 'translate('+cfg.padding.left+', '+cfg.padding.top+')')
        .call(yAxis)
      //定义纵轴网格线
        var yInner = d3.svg.axis()
        .scale(yScale)
        .tickSize(-(width- cfg.padding.left-10),0)
        .tickFormat("")
        .orient("left")
        
        //添加纵轴网格线
        var yInnerBar=svg.append("g")
        .attr("class", "inner_line")
        .attr('transform', 'translate('+cfg.padding.left+', '+cfg.padding.top+')')
        .call(yInner)  
      
        //x轴线
        svg.append('rect')
          .attr('width', width- cfg.padding.left-10)
          .attr('height', 1)
          .attr('fill', cfg.lineColor)
          .attr('x', cfg.padding.left)
          .attr('y', (height - cfg.padding.bottom))

        var polygon = svg.append('g')
          .attr('class', 'polygon')
        
        var dLen = dataset.length
        var dwidth = (width - cfg.padding.left - cfg.barWidth)/dLen
        
        var barWidth = cfg.barWidth
          polygon.selectAll('polygon')
            .data(dataset)
            .enter()
            .append('polygon')  
            .attr('points', function(d, i){
              var p1 = (i*dwidth+cfg.padding.left+cfg.barWidth)+barWidth
              var p2 = yScale(d) + cfg.padding.top
              var p3 = height - cfg.padding.bottom
              var points = ''+p1+', '+p2+'  '+(p1-barWidth)+',  '+p3+' '+(p1+barWidth)+' '+p3+' '
               return points
            })
          .attr("fill", function(d,i){
            return 'url(#' + linearGradient1.attr('id') + ')'
          })
          .attr('stroke-width', cfg.borderWidth)
          .attr('stroke', cfg.borderColor)

        //添加上面小圆圈
        polygon.selectAll('sRect')
          .data(dataset)
          .enter()
          .append('circle')
          .attr('r', cfg.circle.r)
          .attr('cx', function(d,i){
            var cx = i*dwidth+cfg.padding.left+barWidth*2
            return cx
          })
          .attr('cy', function(d,i){
            var cy = yScale(d) +20
            return cy
          })
          .attr('fill', cfg.circle.color) 

        var texts = svg.append('g')
          .attr('class', 'texts')
          .attr('transform', 'translate('+(cfg.padding.left)+', '+(height - cfg.padding.bottom+10)+')')
         
        var spacing = (width- cfg.padding.left-barWidth)/dLen
        texts.selectAll('text')
          .data(dataset)
          .enter()
          .append('text')
          .attr('fill', cfg.xText.color)
          .attr('font-size', 12)
          .attr('text-anchor', 'millde')
          .text(function(d,i){
            return dataX[i]
          })
          .style('writing-mode','tb-rl')
          .attr('x', function(d, i){
            var x = i*spacing+barWidth*2
            return x
          })
          .attr('y', function(d, i){
            return 0
          })
     
    },
    //定义线性渐变
    Gradient: function(svg, color){
      var a = d3.hcl(color[0])
      var b = d3.hcl(color[1])
      var defs = svg.append("defs");
      //添加渐变色
     linearGradient1 = defs.append("linearGradient")
          .attr("id","linearColor")
          .attr("x1","0%")
          .attr("y1","20%")
          .attr("x2","0%")
          .attr("y2","10%");
  
      var stop1 = linearGradient1.append("stop")
              .attr("offset","0%")
              .style("stop-color",a.toString());
      
      var stop2 = linearGradient1.append("stop")
              .attr("offset","100%")
              .style("stop-color",b.toString());     

    }


  }

  return triangleBar
})