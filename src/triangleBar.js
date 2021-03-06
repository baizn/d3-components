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
        itemStyle: {
          barWidth: 6,
          color: ['#b3ff03', '#54a707'],
          borderColor: '#de2528',
          borderWidth: 1,
          circle:{
            color:'#fff',
            r: 3,
          }
        },
        xText:{
          fontSize: 12,
          color: '#a5cfe0',
          textAnchor: 'middle',
          margin:{
            top: 20
          }
        },
        xAxis: {
          color: '#2c668e'
        },
        grid:{
          x: 45,
          y: 60,
          y2:20
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
      var color = cfg.itemStyle.color
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
        .range([height-cfg.grid.y-cfg.grid.y2, 0])
      //定义纵轴  
      var yAxis=d3.svg.axis()
        .scale(yScale)
        .orient("left")

      //定义比例尺
      var linear = d3.scale.linear()  
            .domain([0,d3.max(dataset)])  
            .range([0, height-cfg.grid.y-cfg.grid.y2])
      //添加y轴
      var yBar=svg.append("g")
        .attr('class','axis axis-y')
        .attr('transform', 'translate('+cfg.grid.x+', '+cfg.grid.y2+')')
        .call(yAxis)

      //定义纵轴网格线
        var yInner = d3.svg.axis()
        .scale(yScale)
        .tickSize(-(width- cfg.grid.x-10),0)
        .tickFormat("")
        .orient("left")
        
        //添加纵轴网格线
        var yInnerBar=svg.append("g")
        .attr("class", "inner_line")
        .attr('transform', 'translate('+cfg.grid.x+', '+cfg.grid.y2+')')
        .call(yInner)  
      
        //x轴线
        svg.append('rect')
          .attr('width', width- cfg.grid.x-10)
          .attr('height', 1)
          .attr('fill', cfg.xAxis.color)
          .attr('x', cfg.grid.x)
          .attr('y', (height - cfg.grid.y))

        var itemStyle = cfg.itemStyle
        var dLen = dataset.length
        var dwidth = (width - cfg.grid.x - itemStyle.barWidth)/dLen
        var barWidth = itemStyle.barWidth
  
        var group =  svg.selectAll(".group")
           .data(dataset)
           .enter()
           .append('g')
           .attr('class', 'group')
           .attr('transform', function(d, i){
              var x= i*dwidth+cfg.grid.x+barWidth*2+itemStyle.margin.left
              var y = height - cfg.grid.y
              return 'translate('+x+', '+y+')'
           })

        group.append('polygon')  
          .attr('points', function(d, i){
            var p1 = -1
            console.log(linear(d)  )
            var p2 = -linear(d)  
            if(p2==0){
              p2 = -itemStyle.min
            }
            var p3 = p1
            var points = ''+p1+', '+p2+'  '+(p1-barWidth)+',  '+p3+' '+(p1+barWidth)+' '+p3+' '
            return points
             return points
          })
        .attr("fill", function(d,i){
          return 'url(#' + linearGradient1.attr('id') + ')'
        })
        .attr('stroke-width', itemStyle.borderWidth)
        .attr('stroke', itemStyle.borderColor)

        //添加上面小圆圈
        group.append('circle')
          .attr('r', itemStyle.circle.r)
          .attr('cx', function(d,i){
            var cx = i*dwidth+cfg.grid.x+barWidth*2
            return -1
          })
          .attr('cy', function(d,i){
            var cy =   linear(d) 
            if(cy==0){
              cy = itemStyle.min
            }

            return -cy
          })
          .attr('fill', itemStyle.circle.color) 

        var xText = cfg.xText  
        console.log(xText.fontSize)
        group.append('text')
          .attr('fill', xText.color)
          .attr('font-size', xText.fontSize)
          .attr('text-anchor', xText.textAnchor)
          .text(function(d,i){
            return dataX[i]
          })
          .style('transform','rotate(45deg)')
          .attr('x', function(d,i){
            var x = xText.margin.left
            return x 
          })
          .attr('y', function(d,i){
            var y = xText.margin.top
            return y 

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