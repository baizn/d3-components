/**
 * @Author:      zhq
 * @DateTime:    2017-01-13 09:52:27
 * @Description: Description
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-13 09:52:27
 */

define(function(require) {
     /**
     * 引入公用的文件
     */
    require('lodash')
    require('d3')

    var polarCoordinates = {
        /**
         * 组件默认配置项
         */
        defaultSetting: function() {
            var width = 500
            var height = 500
            return {
                width: width,
                height: height,
                itemStyle: {
                  width: 10,
                  color: '#ec44ff',
                  borderColor: '#fff',
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
        },
        /**
         * 画极坐标图
         * @param {object} svg svg对象
         * @param {object} data 数据
         * @param {object} config 图表配置项
         */
        drawChart: function(svg, data, opt) {
            var cfg = _.assign({}, this.defaultSetting(), opt)
            var width = cfg.width
            var height = cfg.height
            var dataLen = data.length

            var valueArray = []
            for(var i = 0 ;i<data.length;i++){
              valueArray.push(data[i].value)
            }
           
            data.forEach(function( e ){
              valueArray.push( e.value )
            })
            valueArray.sort(function(a, b){
                return b - a
            })
            var maxVal = Math.max.apply(Math, valueArray)
            var minVal = Math.min.apply(Math, valueArray)
            var itemStyle = cfg.itemStyle
            //设置比例尺
            var linear = d3.scale.linear()  
                .domain([minVal, maxVal])  
                .range([itemStyle.min, itemStyle.max])

            var pie = d3.layout.pie()
              .value(function(d) {
                  return 1
              })
                     
            var pieData = pie(data)
            //创建弧生成器
            var arc = d3.svg.arc()
              .innerRadius(0)
              .outerRadius(0)

            //获取update部分
            var update = svg.selectAll("g")
              .data(pieData)

            //获取enter部分
            var enter = update.enter()

            //获取exit部分
            var exit = update.exit()
            console.log('exit', exit)
            //处理exit部分
            exit.remove() 
            //处理update部分
            var updateG = update.attr('transform', 'translate(' + (cfg.width/2) + ',' + (cfg.height/2) + ')')
            
             //处理enter部分  添加对应数目的弧，即<g>元素
            var path = enter.append('g')
              .attr('transform', 'translate(' + (cfg.width / 2) + ',' + (cfg.height / 2) + ')')

            var exitLen = exit[0].length
            var lineWidth = itemStyle.width
           
            if(exitLen!=0){
              //updateData
              var path1 = updateG.select('.pathBg')
              var path2 = updateG.select('.pathData')
              var text = updateG.select('.text')
              var dom = {
                path1: path1,
                path2: path2,
                text: text
              }
              addElement(dom)
            }else{
              //enterData
              var path1 = path.append('path')
              var path2 = path.append('path')
              var text = path.append('text')
              var dom = {
                path1: path1,
                path2: path2,
                text: text
              }
              addElement(dom)
            }

            //画圆
           var circle = d3.selectAll('circle').size()
           if(circle===0){
              svg.append('circle')
              .attr('r', itemStyle.radius)
              .attr('cx', cfg.width/2)
              .attr('cy', cfg.height/2)
              .attr('stroke', '#6a1491')
              .attr('stroke-width', 4)
              .attr('fill', 'none')
           }
            
          /**
           *  @param     {[type]}    dom [enter or updata]
           */
          function addElement(dom){
              var path1 = dom.path1
              var path2 = dom.path2
              var text = dom.text
               //边框矩形
              path1
                .attr('stroke', '#fff')
                .attr('stroke-width', 1)
                .attr('fill', itemStyle.borderColor)
                .attr('d', function(d,i){  
                  var x1 = 0
                  var y1 = 0 - itemStyle.radius
                  var x2 = 0
                  var y2 = 0 - itemStyle.radius - itemStyle.min  - itemStyle.max
                  var coorPoint =  'M'+x1+' '+y1+' '+x1+' '+y2+' '+(x1+lineWidth)+' '+y2+' '+(x1+lineWidth)+'  '+y1+' '
                   return coorPoint
                })
                .attr('transform', 'rotate(0)')
                .transition()
                .duration(1500)
                .attr('transform',function(d,i){
                    var len = data.length
                    var angle = 360 / len
                    var rotate = ''
                    var ds = Math.floor(angle * i) 
                    rotate = 'rotate(' + ds + ')'
                    return rotate
                })
                .attr('opacity', 0.5)
                .attr('class', 'pathBg')

              //数据矩形框
              path2
                .attr('stroke', 'none')
                .attr('stroke-width', 'none')
                .attr('fill',  itemStyle.color)
                .attr('d', function(d,i){

                  var x1 = 0
                  var y1 = 0 - itemStyle.radius
                  var x2 = 0
                  var y2 = 0 - itemStyle.radius - itemStyle.min - linear(d.data.value )
                  var coorPoint =  'M'+x1+' '+y1+' '+x1+' '+y2+' '+(x1+lineWidth)+' '+y2+' '+(x1+lineWidth)+'  '+y1+' '
                   return coorPoint
                })
                .attr('transform', 'rotate(0)')
                .transition()
                .duration(1500)
                .attr('transform',function(d,i){
                    var len = data.length
                    var angle = 360 / len
                    var rotate = ''
                    var ds = Math.floor(angle * i) 
                    rotate = 'rotate(' + ds + ')'
                    return rotate
                })
                .attr('class', 'pathData')
              
              var textStyle = cfg.textStyle
              //添加内部文字
              text
               .text(function( d ){
                    return d.data.name
                })
                .attr('width', 100)
                .attr('height', 50)
                .style('writing-mode','tb-rl')
                .attr("x",function() { //ie?  
                    if (!!window.ActiveXObject || "ActiveXObject" in window) { 
                        return -5;  
                    }else{  
                        return 0;
                    }  
                })
                .attr('y',function(d,i){
                  return 0 - itemStyle.radius+textStyle.distance
                })
                .style('font-size', textStyle.fontSize)
                .attr('fill', textStyle.color)
                .attr('transform', 'rotate(0)')
                .transition()
                .duration(1500)
                .attr('transform',function(d,i){
                    var len = data.length
                    var angle = 360 / len
                    var rotate = ''
                    var ds = Math.floor(angle * i)  
                    rotate = 'rotate(' + ds + ')'
                    return rotate
                })
                .attr('class', 'text')
            }
        }
    }

    return polarCoordinates
})
