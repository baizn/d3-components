/**
 * @Author:      zhq
 * @DateTime:    2017-01-13 13:52:27
 * @Description: 渐变柱状图
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-13 13:52:27
 */

define(function(require) {
  /**
   * 引入公用的文件
   */
  require('lodash')
  require('d3')
  var $ = require('jquery')

  var gradientBar = {
    /**
     * 柱状图默认配置项
     */
    defaultSetting: function() {
      var width = 400
      var height = 200
      return {

        width: width,
        height: height,
        fontFamily: '微软雅黑',
        min: 1,
        itemStyle: {
          height: 6,
          color: '#282f36',
          gradientColor: ['#9936e8', '#49aefe'], 
          radius: 3,  //椭圆的半径
          margin: {
            left:10,
            right:40
          },
        },
        leftText: {
          fontSize: 12,
          color: 'yellow',
          textAnchor: 'start'
        },
        rightText: {
          fontSize: 12,
          color: '#fff',
          textAnchor: 'end'
        },
        grid: {  //文字离左右两边的距离
          x: 40,
          x2: 20
        }

     }
    },
    /**
     * 绘制饼图
     */
    drawGradientBar: function(svg, data, opt) {

      var cfg = _.assign({}, this.defaultSetting(), opt)
      var dataset = []
      for(var i = 0, len = data.length; i<len; i++){
        dataset.push(data[i].value)
      }
      var width = cfg.width
      var height = cfg.height
      var lineHeigh = height/dataset.length  

      var grid = cfg.grid

      //设置左边文字
      var leftTxt = cfg.leftText

      //小矩形方块配置
      var itemStyle = cfg.itemStyle

      //右边文字配置
      var rightTxt = cfg.rightText

      //数据的显示范围
      var dataWidth = width  - grid.x - grid.x2 - itemStyle.margin.left - itemStyle.margin.right

      var xScale = d3.scale.linear()
        .domain([0,d3.max(dataset)])
        .range([dataWidth, 0]);
    
    /**
       * 获取update部分
       */
      var update = svg.selectAll(".tick")
        .data(data)
      
      //获取enter部分
      var enter = update.enter()

      //获取exit部分
      var exit = update.exit()

      //处理update部分
      
      //定义一个线性渐变
      var gradientC = itemStyle.gradientColor

      var a = d3.hcl(gradientC[0])
      var b = d3.hcl(gradientC[1])
      var defs = svg.append("defs");
        
      //添加渐变色
      var linearGradient = defs.append("linearGradient")
            .attr("id","linearColor")
            .attr("x1","30%")
            .attr("y1","0%")
            .attr("x2","100%")
            .attr("y2","0%");

      var stop1 = linearGradient.append("stop")
              .attr("offset","0%")
              .style("stop-color",a.toString());
      
      var stop2 = linearGradient.append("stop")
              .attr("offset","100%")
              .style("stop-color",b.toString());
          
        var lineHeigh = height/dataset.length 
        //添加小的矩形box
        var gWrap = svg.selectAll(".gWrap")  
          .data(data)
          .enter() 
          .append('g')
          .attr('transform', function(d,i){
            return 'translate(0,'+(lineHeigh*i)+')'
          })
          .attr('class', 'gWrap')
      
        //添加左边文字
        gWrap.append('text')
          .attr('fill', leftTxt.color)
          .attr('font-size', leftTxt.fontSize)
          .attr('text-anchor', leftTxt.textAnchor)
          .attr('class', 'left-text')
          .attr('x', 0)
          .transition()
          .duration(1000)
          .attr('x', grid.x)
          .attr('y', itemStyle.height )
          .text(function(d,i){
            return data[i].name
          })
          .attr('class', 'leftText')

      //矩形背景
        gWrap.append("rect")
          .attr("class","MyRect")
          .attr('fill', itemStyle.color)
          .attr("y", function(d,i){
            return 0
          })
          .attr("x",  (itemStyle.margin.left+grid.x))
          .attr("height", itemStyle.height)
          .attr("width", function(d){
            return dataWidth
          })
          .attr('rx', itemStyle.radius)
          .attr('ry', itemStyle.radius)
          
          //添加数据
        gWrap.append("rect")
          .attr("class","reactCont")
          .attr("fill","url(#" + linearGradient.attr("id") + ")")
          .attr("y", function(d,i){
            return 0
          })
          .attr("x",  (itemStyle.margin.left+grid.x))
          .attr('rx', itemStyle.radius)
          .attr('ry', itemStyle.radius)
          .attr("height", itemStyle.height)
          .attr("width", function(d){
            var dWidth = dataWidth-xScale(d.value)
            if(dWidth<=0){
              dWidth = cfg.min
            }
            return dWidth
          }); 

          //添加右边文字
          gWrap.append('text')
            .attr('fill', rightTxt.color)
            .attr('font-size', rightTxt.fontSize)
            .attr('text-anchor', rightTxt.textAnchor)
            .attr('x', 0)
            .transition()
            .duration(1000)
            .attr('x', width-grid.x2)
            .attr('y', itemStyle.height )
            .text(function(d,i){
              return data[i].value+'人'
            })
            .attr('class', 'rightText')
 
  }
}
  return gradientBar
})