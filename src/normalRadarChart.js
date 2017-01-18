define(function(require) {
     /**
     * 引入公用的文件
     */
    require('lodash')
    require('d3')

    var RadarChart = {
        defaultSetting: function() {
            return {
                r: 100,
                level: 4,
                min: 0,
                max: 100,
                arc: 2*Math.PI,
                fixed: false,
                count: 8,
                polygon: {
                    fill: 'white',
                    fillOpacity: 0.5,
                    stroke: 'gray',
                    strokeDasharray: '10 5'
                },
                lines: {
                    stroke: '#ccc',
                    strokeWidth: 2,
                    strokeDasharray: '10 5'
                },
                areas: {
                    fillOpacity: 0.5,
                    fill: '#2ec7c9',
                    strokeWidth: 2,
                    stroke: '#b6a2de'
                },
                points: {
                    show: true,
                    fill: '#b6a2de',//['', '']
                    stroke: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3'],
                    r: 3
                },
                texts: {
                    show: true,
                    fill: 'white',
                    fontSize: 16,
                    offset: 20
                }
            }
        },
        drawRadarChart: function(svg, data, opt) {
            var config = _.assign({}, this.defaultSetting(), opt)

            var radius = config.r;
            var level = config.level;
            var rangeMin = config.min;
            var rangeMax = config.max;
            var arc = config.arc;
            var polygonConfig = config.polygon
            var linesConfig = config.lines
            var areasConfig = config.areas
            var pointConfig = config.points
            var textConfig = config.texts
            var fixed = config.fixed
            
            //转换数据
            var fieldNames = []
            var values = []
            for(var i = 0, len = data.length; i < len; i++) {
                var current = data[i]
                fieldNames.push(current.name)
                values.push(current.value)
            }
            var radarData = {
                fieldNames: fieldNames,
                values: [values]
            }

            //数据量个数，即指标的个数
            var total = 0
            if(fixed) {
                total = config.count
            } else {
                total = fieldNames.length
            }

            //每项指标所在的角度
            var onePiece = arc/total

            //网轴的正多边形所在的坐标
            var polygons = {
                webs: [],
                webPoints: []
            }

            for(var i = level; i > 0; i--) {
                var webs = ''
                var webPoints = []
                var r = radius/level * i

                for(var k = 0; k < total; k++) {
                    var x = r * Math.sin(k * onePiece)
                    var y = r * Math.cos(k * onePiece)

                    webs += x + ',' + y + ' '
                    webPoints.push({
                        x: x,
                        y: y
                    })
                }
                polygons.webs.push(webs)
                polygons.webPoints.push(webPoints)
            }

            //绘制网轴
            var groups = svg.append('g')
                .attr('class', 'groups')
            
            groups.selectAll('.polygon-radar')
                .data(polygons.webs)
                .enter()
                .append('polygon')
                .attr('fill', polygonConfig.fill)
                .attr('fill-opacity', polygonConfig.fillOpacity)
                .attr('stroke', polygonConfig.stroke)
                .attr('stroke-dasharray', polygonConfig.strokeDasharray)
                .attr('points', function(d) {
                    return d
                })

            //添加纵轴
            var lines = svg.append('g')
                .attr('class', 'lines')
            
            lines.selectAll('.lines-radar')
                .data(polygons.webPoints[0])
                .enter()
                .append('line')
                .attr('stroke', linesConfig.stroke)
                .attr('stroke-width', linesConfig.strokeWidth)
                .attr('stroke-dasharray', linesConfig.strokeDasharray)
                .attr('class', 'lines-radar')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', function(d) {
                    return d.x
                })
                .attr('y2', function(d) {
                    return d.y
                })

            //计算雷达图区域并添加
            //计算雷达图的坐标
            var areasData = []
            var values = radarData.values
            for(var i = 0, len = values.length; i < len; i++) {
                var value = values[i]
                var area = ''
                var points = []

                for(var k = 0; k < total; k++) {
                    var r = radius * (value[k] - rangeMin)/(rangeMax - rangeMin)
                    var x = r * Math.sin(k * onePiece)
                    var y = r * Math.cos(k * onePiece)
                    area += x + ',' + y + ' '
                    points.push({
                        x: x,
                        y: y
                    })
                }
                areasData.push({
                    polygon: area,
                    points: points
                })
            }

            //添加雷达图区域分组
            var areas = svg.append('g')
                .attr('class', 'areas-radar')
            
            console.log(areasData)
            areas.selectAll('g')
                .data(areasData)
                .enter()
                .append('g')
                .attr('class', function(d, i) {
                    return 'area-radar' + (i + 1)
                })
            
            for(var i = 0, len = areasData.length; i < len; i++) {
                //依次循环每个雷达图区域
                var area = areas.select('.area-radar' + (i + 1))
                var areaData = areasData[i]
                console.log(areaData)

                //绘制雷达图区域下的多边形
                area.append('polygon')
                    .attr('points', areaData.polygon)
                    .attr('stroke', function(d, index) {
                        return areasConfig.stroke
                    })
                    .attr('stroke-width', areasConfig.strokeWidth)
                    .attr('fill', function(d, index) {
                        return areasConfig.fill
                    })
                    .attr('fill-opacity', areasConfig.fillOpacity)
                
                //绘制雷达图区域上的点
                if(pointConfig.show) {
                    var circles = areas = area.append('g')
                    .attr('class', 'circle-radar')
                
                circles.selectAll('circle-radar-point')
                    .data(areaData.points)
                    .enter()
                    .append('circle')
                    .attr('cx', function(d) {
                        return d.x
                    })
                    .attr('cy', function(d) {
                        return d.y
                    })
                    .attr('r', pointConfig.r)
                    .attr('stroke', function(d, index) {
                        //每个圆点边框色都不同
                        if(pointConfig.stroke && _.isArray(pointConfig.stroke)) {
                            return pointConfig.stroke[index]
                        }
                        return pointConfig.stroke
                    })
                    .attr('fill', function(d, index) {
                        //每个圆点填充色都不同
                        if(pointConfig.fill && _.isArray(pointConfig.fill)) {
                            return pointConfig.fill[index]
                        } else if(pointConfig.fill && _.isString(pointConfig.fill)) {
                            //单一填充色
                            return pointConfig.fill
                        } else {
                            //不填充
                            return 'none'
                        }
                    })
                }
                
                if(textConfig.show) {
                    //绘制文本内容
                    //计算文本的标签坐标
                    var textPoints = []
                    var textRadius = radius + textConfig.offset
                    for(var i = 0; i < total; i++) {
                        var x = textRadius * Math.sin(i * onePiece)
                        var y = textRadius * Math.cos(i * onePiece)
                        textPoints.push({
                            x: x,
                            y: y
                        })
                    }

                    //添加到画布中
                    var texts = svg.append('g')
                        .attr('class', 'text-radar-g')
                    
                    texts.selectAll('.text-radar')
                        .data(textPoints)
                        .enter()
                        .append('text')
                        .attr('x', function(d) {
                            return d.x
                        })
                        .attr('y', function(d) {
                            return d.y
                        })
                        .attr('fill', textConfig.fill)
                        .attr('font-size', textConfig.fontSize)
                        .attr('font-family', textConfig.fontFamily)
                        .text(function(d, i) {
                            return radarData.fieldNames[i]
                        })
                }
            }
        }
    }

    return RadarChart
    
});