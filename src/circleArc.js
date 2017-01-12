
/**
 * 半圆弧组件
 * 使用时候一般是成组使用，可以用循环调用该组件，传入的ID或class如id1， id2
 */
define(function(require) {
     /**
     * 引入公用的文件
     */
    require('lodash')
    require('d3')

    var circleArc = {
        /**
         * 组件默认配置项
         */
        defaultSetting: function() {
            return {
                width: 200,
                height: 200,
                outerRadius: 106,
                innerRadius: 96
            }
        },
        /**
         * 画半圆弧
         * @param {object} svg svg对象
         * @param {object} data 数据
         * @param {object} config 图表配置项
         */
        drawArc: function(svg, data, opt) {
            var config = _.assign({}, this.defaultSetting(), opt)
            var xScale = d3.scale.linear()
                .domain([0, 100])
                .range([Math.PI * 0.5, -Math.PI * 0.5])
            
                var dataset = {
                startAngle: Math.PI * 0.5,
                endAngle: xScale(data.value)
            }

            var width = config.width
            var height = config.height

            var arc = d3.svg.arc()
                .innerRadius(config.innerRadius)
                .outerRadius(config.outerRadius)

            var defs = svg.append('defs')

            var linears = defs.append('linearGradient')
                .attr('id', 'arcGradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '0%')
                .attr('y2', '100%')
            
            linears.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', '#069dc1')
                .attr('stop-opacity', '1')

            linears.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', '#041fbf')
                .attr('stop-opacity', '1')
            
            var dataset1 = {
                startAngle: Math.PI * 0.5,
                endAngle: -Math.PI * 0.5
            }

            var arc1 = d3.svg.arc()
                .innerRadius(90)
                .outerRadius(91)

            svg.append('path')
                .attr('d', arc1(dataset1))
                .attr('transform', 'translate(' + width/2 + ',' + (height - 43) + ')')
                .attr('stroke', 'blue')
                .attr('stroke-width', 1)
                .attr('fill', 'url(#arcGradient)')

            svg.append('path')
                .attr('d', arc(dataset))
                .attr('transform', 'translate(' + width/2 + ',' + (height - 43) + ')')
                .attr('stroke', 'blue')
                .attr('stroke-width', 1)
                .attr('fill', 'url(#arcGradient)')
            
            svg.append('text')
                .attr('fill', '#64b4ff')
                .attr('font-size', '30px')
                .attr('transform', 'translate(' + (width/2 - 30) + ',' + (height/2 + 20) + ')')
                .text(parseFloat(data.value))
            
            svg.append('text')
                .attr('fill', '#4689e4')
                .attr('font-size', '15px')
                .attr('transform', 'translate(' + (width/2 + 30) + ',' + (height/2 + 20) + ')')
                .text('%')
            
            var lines = [
                [0, height/1.5 - 12],
                [width, height/1.5 - 12]
            ]

            var linePath = d3.svg.line()
            svg.append('path')
                .attr('d', linePath(lines))
                .attr('stroke', '#022851')
                .attr('stroke-width', '2px')
                .attr('fill', '#022851')
                .attr('transform', 'translate(0, 35)')
            
            svg.append('text')
                .attr('fill', '#64b4ff')
                .attr('font-size', '30px')
                .attr('text-anchor', 'middle')
                .attr('transform', 'translate(' + (width/2) + ',' + (height - 5) + ')')
                .text(data.name)
        }
    }

    return circleArc
})
