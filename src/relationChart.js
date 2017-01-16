/**
 * @Author:      zhq
 * @DateTime:    2017-01-13 13:43:27
 * @Description: 关系图
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-13 13:43:27
 */

define(function(require) {
     /**
     * 引入公用的文件
     */
    require('lodash')
    require('d3')

    var relationChart = {
      /**
       * 组件默认配置项
       */
      defaultSetting: function() {
          var width = 500
          var height = 500
          return {
            width: width,
            height: height,
            outerCircle: {
              radius: 35,
              color: ['#082463', '#09194a', '#3f00c9', '#6d00bf'] 
            },
            onnectLine:{
              color: '#00feff',
              width: 2
            },
            radius: 120
          }
      },
      /**
       * 画关系图
       * @param {object} svg svg对象
       * @param {object} data 数据
       * @param {object} config 图表配置项
       */
      
      drawChart: function(svg, data, opt) {

        var cfg = _.assign({}, this.defaultSetting(), opt)
       
        var dataLen = data.length
        var caseName = data.detail.caseName
        var dataset = data.casePerson
        var color= cfg.color
      

        //画圆参照物
        svg.append('circle')
          .attr('r', cfg.radius)
          .attr('cx', cfg.width/2)
          .attr('cy', cfg.height/2)
          .attr('stroke', '#0067ff')
          .attr('stroke-width', 2)
          .attr('fill', 'none')
        
        var pie = d3.layout.pie()
          .value(function(d) {
              return 1
          })
                  
        var pieData = pie(dataset)
        var outerRadius = 115
        var innerRadius = 115

        //创建弧生成器
        var arc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
   
      
        //添加对应数目的弧，即<g>元素
        var arcs = svg.selectAll('g')
          .data(pieData)
          .enter()
          .append('g')
          .attr('transform', 'translate(' + (cfg.width / 2) + ',' + (cfg.height / 2) + ')')
          .attr('class', 'arcs')
          
        //添加内部小圆点
        var innerCircle = arcs.append('g')
          .attr('class', 'innerCircle')
          
        innerCircle.append('circle')  
          .attr('r', 10)
          .attr('fill', 'none')
          .attr('cx', function(d){
            var cx = arc.centroid(d)[0] * 0.9 
            return cx
          })
          .attr('cy', function(d){
            var cy = arc.centroid(d)[1] * 0.9 
            return cy
          })
          .attr('stroke', '#00fefc')
          .attr('stroke-width', 1)
          
        innerCircle.append('circle')
          .attr('fill', '#00fefc')
          .attr('r', 5)
          .attr('cx', function(d){
            var cx = arc.centroid(d)[0] * 0.9 
            return cx
          })
          .attr('cy', function(d){
            var cy = arc.centroid(d)[1] * 0.9 
            return cy
          })

        var onnectLine = cfg.onnectLine
        //添加连接弧外文字的第一条直线元素
        arcs.append('path')
          .attr('stroke', onnectLine.color)
          .attr('stroke-width', onnectLine.width)
          .attr('fill', 'none')
          .attr('d', function(d,i){
            var x1 = arc.centroid(d)[0] 
            var y1 = arc.centroid(d)[1] 
            var x2 = arc.centroid(d)[0] * 2
            var y2 = arc.centroid(d)[1] * 2
            var x3 = x2
            if(x3<0){
              x3 -= 120
            }else{
              x3 += 120
            }
            var coorPoint =  ' M '+x1+' '+y1+' '+x2+'  '+y2+' '
             return coorPoint
          })
        
        
        //外边关系圆配置项
        var outerCircle = cfg.outerCircle
        var color = outerCircle.color
    
        var a = d3.hcl(color[0])
        var b = d3.hcl(color[1])
        var defs = svg.append("defs");

        var linearGradient = defs.append("linearGradient")
              .attr("id","linearColor")
              .attr("x1","30%")
              .attr("y1","0%")
              .attr("x2","0%")
              .attr("y2","100%");

        var stop1 = linearGradient.append("stop")
                .attr("offset","0%")
                .style("stop-color",a.toString());
        
        var stop2 = linearGradient.append("stop")
                .attr("offset","100%")
                .style("stop-color",b.toString());
                
                
        var c = d3.hcl(color[3])
        var d = d3.hcl(color[2])
        var defs2 = svg.append("defs");

        var linearGradient2 = defs2.append("linearGradient")
              .attr("id","linearColor2")
              .attr("x1","30%")
              .attr("y1","0%")
              .attr("x2","0%")
              .attr("y2","100%");

        var stop3 = linearGradient2.append("stop")
                .attr("offset","0%")
                .style("stop-color",c.toString());
        
        var stop4 = linearGradient2.append("stop")
                .attr("offset","100%")
                .style("stop-color",d.toString())

        //外边关系圆
        arcs.append('g')
          .attr('class', 'outerCircle')
          .on('click', function(d, i) {
              falg  = d.data.falg
          })
          .append('circle')
          .attr('r', outerCircle.radius)
          .attr('cx', function(d){
            var x = arc.centroid(d)[0] * 2
            return  x
          })
          .attr('cy', function(d){
            var y = arc.centroid(d)[1] * 2
            return y
          })
          .attr("fill", function(d,i){
              var falg  = d.data.falg
              if(i+1==falg){
                return "url(#" + linearGradient2.attr("id") + ")"
              }else{
                return "url(#" + linearGradient.attr("id") + ")"
              }
          })
          .attr('stroke', '#015fe9')
          .attr('stroke-width', 2)
      
        //添加弧外的文字(名字)
        d3.selectAll('.outerCircle').append('text')
          .attr('transform', function(d) {
              var x = arc.centroid(d)[0] *2
              var y = arc.centroid(d)[1] *2+5
              var tranArr = [ 'translate(', x, ',', y,')']
              return tranArr.join('')
          })
          .attr('text-anchor', 'middle')
          .text(function(d, i) {
            return d.data.name
              
          })
          .attr('fill', '#fff')
          .attr('font-size', 18)
          .on('click', function(d, i) {
            var cardId = d.data[2]
            window.location.href = ''
          })
              
        //圆中心总数文字
        d3.select('.arcs').append('text')
          .attr('fill', '#ffeb00')
          .attr('x', '0')
          .attr('y', '0')
          .text(function(d){
            return caseName
          })
          .attr('font-size', '24px')
          .attr('text-anchor', 'middle')
      }
    }

    return relationChart
})