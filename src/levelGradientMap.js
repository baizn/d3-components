define(function(require) {
    /**
     * 引入公用的文件
     */
    require('lodash')
    require('d3')
    function toThousands(number){
        //判断是整数还是小数parseInt(number)==number
        var n = 0;
        var re = '';
        if(number){
            if(parseInt(number, 10) == number){
                re = /(\d{1,3})(?=(\d{3})+(?:$|\D))/g;
            }else{
                re = /(\d{1,3})(?=(\d{3})+(?:\.|\D))/g;
            }
            var renumber = number.toString();
            n = renumber.replace(re,"$1,");
            return n ? n : 0;
        }
        return n;
    }
    var GradientMap = function(container, config) {
        this.width = config.width
        this.height = config.height
        this.map_dx = config.mapDeep
        this.scale = config.scale

        this.tooltips = d3.selectAll('.tooltip')
        if(this.tooltips.length) {
            this.tooltips.remove()
        }

        //地图投影
        this.projection = d3.geo.equirectangular()
            .center([106.530635, 29.544606])
            .scale(this.scale)
            .translate([this.width/3.5 + this.map_dx, this.height/1.6])

        this.path = d3.geo.path()
            .projection(this.projection)

        //缩放绑定	
        var zoom = d3.behavior.zoom()
                    .scaleExtent([1, 10])
                    .on("zoom", zoomed);

        function zoomed() {
            d3.select(this).attr("transform", 
                "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        this.svg = null
        if(d3.select(container).selectAll('svg')[0].length > 0) {
            this.svg = d3.select(container).selectAll('svg').select('g')
        } else {
            this.svg = d3.select(container)
                .append('svg')
                .attr('width', this.width)
                .attr('height', this.height)
                .append('g')
                .call(zoom)
        }
        
        if(this.svg.selectAll('.tips-name')[0].length > 0) {
            this.svg.selectAll('.tips-name').remove()
        }

        var filter = this.svg.append('defs')
            .append('filter')
            .attr('id', 'blur')
            .append('feGaussianBlur')
            .attr('stdDeviation', 0.5)
        
        //底部滤镜
        var bottomFilter = this.svg.append("defs")
            .append("filter")
            .attr("id", "blur1")
            .append("feGaussianBlur")
            .attr("stdDeviation", 3)
        
        //线性渐变
        var linearGradient = this.svg.append("defs")
            .append("linearGradient")
            .attr("id", "mylinearGradient")
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%")

        linearGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", "#82282e")
        linearGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", "#7ce435")
        
        var self = this
        this.line = d3.svg.line()
            .x(function(d) {
                return self.projection(d)[0]
            })
            .y(function(d) {
                return self.projection(d)[1]
            })
            .interpolate('monotone')
        
        this.line1 = d3.svg.line()
            .x(function(d, i) {
                return d[0]
            })
            .y(function(d, i) {
                return d[1]
            })
            .interpolate('monotone')
    }

    GradientMap.prototype = {
        constructor: GradientMap,
        /**
         * 绘制地图上面的椭圆
         */
        showEllipse: function(data) {
            var self = this
            var ellipse = this.svg.append("ellipse");
            ellipse.attr({
                cx: function (d, i) { 
                    return self.projection([data.properties.cp[0], data.properties.cp[1]])[0] 
                },
                cy: function (d, i) {
                    return self.projection([data.properties.cp[0], data.properties.cp[1]])[1] 
                },
                rx: 10,
                ry: 5
            }).style({
                fill: function (d, i) {
                    return "#78b231";
                },
            })
        },
        /**
         * 按行政区域绘制的地图，鼠标放上去的回调函数
         */
        mouseOverOnMap: function(d, value) {
            var name = 0
            if(value) {
                for (var i = 0; i < value.length; i++) {
                    if (d.properties.name == value[i].key) {
                        name = value[i].value
                    }
                }
            }
            
            var str = '<p>' + d.properties.name + '</p>' +
                    '<p>' + window.GLOBAL_TIME_OBJ.typeName + ': ' + toThousands(name) + '</p>'

            this.tooltip = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
            
            var y = (d3.event.pageY - 185)/window.Y
            y = y < 0 ? 0 : y
            this.tooltip.html(str)
                .style('left', (d3.event.pageX - 20)/window.X + 'px')
                .style('top', y + 'px')
                .style('opacity', 1.0)
        },
        /**
         * 按支队绘制的地图，鼠标放上去的回调函数
         */
        mouseOver: function(name, value, x, y) {
            y = y < 0 ? 0 : y
            var str = '<p>' + name + '</p>' +
                            '<p>' + window.GLOBAL_TIME_OBJ.typeName + ': ' + toThousands(value) + '</p>'
            this.tooltip = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
                
            this.tooltip.html(str)
                .style('left', x + 'px')
                .style('top', y + 'px')
        },
        /**
         * mousemove的回调函数
         */
        mouseMove: function(x, y) {
            y = y < 0 ? 0 : y
            this.tooltip.style('left', x + 'px')
                .style('top', y + 'px')
        },
        /**
         * mouseout的回调函数
         */
        mouseOut: function() {
            d3.select('body').select('.tooltip').remove()
        },
        /**
         * 绘制地图
         * @param name 当前绘制地图的名称
         * @param color 颜色
         * @param data 绘制地图所需要的数据
         * @param x left方向值
         * @param y top方向值
         * @param value 提示框上显示的值
         */
        showmap: function(name, color, data, x, y, value) {
            var self = this
            if(this.svg.selectAll('.draw-zhidui-map')) {
                this.svg.selectAll('.draw-zhidui-map').remove()
            }

            if(this.svg.selectAll('.zhidui-area')) {
                this.svg.selectAll('.zhidui-area').remove()
            }
            //获取update部分
            var update = this.svg
                .selectAll('.draw-' + name)
                .data(data)

            //获取enter部分
            var enter = update.enter()

            //获取exit部分
            var exit = update.exit()

            //处理update部分
            update.attr("stroke", "#1ff4ff")
                .attr('class', 'draw-' + name)
                .attr("stroke-width", 4)
                .attr("fill", function (d, i) {
                    return color;
                })
                .attr("transform", "translate(" + x + "," + y + ")")
                .attr("d", this.path)
                .attr("fill-opacity",
                    function () {
                        if (name == "shadowend") {
                            return "0.5"
                        }
                    })
                .attr("filter",
                    function () {
                        if (name == "shadow") {
                            return "url(#blur)"
                        }
                        if (name == "shadowend") {
                            return "url(#blur1)"
                        }
                    })
                .on('mouseover', function(d) {
                    if(name == 'map') {
                        self.mouseOverOnMap(d, value)
                    }
                    
                })
                .on('mousemove', function() {
                    if(name == 'map') {
                        self.mouseMove((d3.event.pageX - 20)/window.X, (d3.event.pageY - 185)/window.Y)
                    }
                    
                })
                .on('mouseout', function() {
                    self.mouseOut()
                })
            
            //处理enter部分
            enter.append('g')
                .append("path")
                .attr('class', 'draw-' + name)
                .attr("stroke", "#1ff4ff")
                .attr("stroke-width", 4)
                .attr("fill", function (d, i) {
                    return color;
                })
                .attr("transform", "translate(" + x + "," + y + ")")
                .attr("d", this.path)
                .attr("fill-opacity",
                    function () {
                        if (name == "shadowend") {
                            return "0.5"
                        }
                    })
                .attr("filter",
                    function () {
                        if (name == "shadow") {
                            return "url(#blur)"
                        }
                        if (name == "shadowend") {
                            return "url(#blur1)"
                        }
                    })
                //.append("title")
                .on('mouseover', function(d) {
                    if(name == 'map') {
                        self.mouseOverOnMap(d, value)
                    }
                    
                })
                .on('mousemove', function() {
                    if(name == 'map') {
                        self.mouseMove((d3.event.pageX - 20)/window.X, (d3.event.pageY - 185)/window.Y)
                    }
                    
                })
                .on('mouseout', function() {
                    self.mouseOut()
                })

            //处理exit部分
            exit.remove()
        },
        /**
         * 绘制地图区域上面的绿色层
         */
        showoverView: function(name, data, leve, value) {
            var self = this
            leve = leve == 0 ? 1 : leve
            while (leve) {
                var n = 0.1
                if (leve == 1) {
                    n = 1;
                } else if (leve == 2) {
                    n = 0.8;
                } else if (leve == 3) {
                    n = 0.5;
                }
                else if (leve == 4) {
                    n = 0.3;
                }
                
                if(this.svg.selectAll('.draw-' + name + '' + leve)) {
                    this.svg.selectAll('.draw-' + name + '' + leve).remove()
                }
                var update = this.svg.selectAll('.draw-' + name + '' + leve)
                    .data(data.geometry.coordinates)
                
                var enter = update.enter()
                var exit = update.exit()

                update.attr('class', 'draw-' + name + '' + leve)
                    .attr("fill", function (d, i) {
                        return "#a1e22e"; 
                    })
                    .style("opacity", 0.3)
                    .attr("d", this.line)
                    .attr("transform", function () { 
                        return "translate(" + ((self.width / 2 + self.map_dx) * n 
                            + self.projection(data.properties.cp)[0]) + "," 
                            + (self.projection(data.properties.cp)[1] + self.height / 2 * n) + ")scale(" + n + ")translate(" 
                            + -(self.width / 2 + self.map_dx + self.projection(data.properties.cp)[0]) + "," 
                            + -(self.height / 2 + self.projection(data.properties.cp)[1]) + ")" 
                    })
                    .on('mouseover', function(d) {
                        self.mouseOver(data.properties.name, value, 
                            (d3.event.pageX - 20)/window.X, 
                            (d3.event.pageY - 185)/window.Y)
                    })
                    .on('mousemove', function() {
                        self.mouseMove((d3.event.pageX - 20)/window.X, (d3.event.pageY - 185)/window.Y)
                    })
                    .on('mouseout', function() {
                        self.mouseOut()
                    })

                enter.append("path")
                    .attr('class', 'draw-' + name + '' + leve)
                    .attr("fill", function (d, i) {
                        return "#a1e22e"; 
                    })
                    .style("opacity", 0.3)
                    .attr("d", this.line)
                    .attr("transform", function () { 
                        return "translate(" + ((self.width / 2 + self.map_dx) * n 
                        + self.projection(data.properties.cp)[0]) + "," 
                        + (self.projection(data.properties.cp)[1] + self.height / 2 * n) 
                        + ")scale(" + n + ")translate(" 
                        + -(self.width / 2 + self.map_dx + self.projection(data.properties.cp)[0]) 
                        + "," + -(self.height / 2 + self.projection(data.properties.cp)[1]) + ")" })
                    .on('mouseover', function(d) {
                        self.mouseOver(data.properties.name, value, 
                            (d3.event.pageX - 20)/window.X, 
                            (d3.event.pageY - 185)/window.Y)
                    })
                    .on('mousemove', function() {
                        self.mouseMove((d3.event.pageX - 20)/window.X, (d3.event.pageY - 185)/window.Y)
                    })
                    .on('mouseout', function() {
                        self.mouseOut()
                    })

                exit.remove()
                leve--;
            }
        },
        /**
         * 绘制地图上面的三角尖顶
         */
        showTips: function(name, data, leve, value) {
            var self = this
            var d2 = [[[0, leve], [20, leve], [10, 0]]];

            var update = this.svg.selectAll(name)
                .data(d2)

            var enter = update.enter()

            var exit = update.exit()

            var path0 = update
                .attr('class', 'tips-name')

            path0.attr("d", this.line1)
                .style("fill", "url(#mylinearGradient)")
                .attr("transform", function () { 
                    return "translate(" + (self.projection(data.properties.cp)[0] - 10) + 
                        "," + (self.projection(data.properties.cp)[1] - leve) + ")" 
                })
                .on('mouseover', function(d) {
                    self.mouseOver(data.properties.name, value, 
                            (d3.event.pageX - 20)/window.X, 
                            (d3.event.pageY - 185)/window.Y)
                })
                .on('mousemove', function() {
                    self.mouseMove((d3.event.pageX - 20)/window.X, (d3.event.pageY - 185)/window.Y)
                })
                .on('mouseout', function() {
                    self.mouseOut()
                })
                
            var path1 = enter
                .append("path")
                .attr('class', 'tips-name')

            path1.attr("d", this.line1)
                .style("fill", "url(#mylinearGradient)")
                .attr("transform", function () { 
                    return "translate(" + (self.projection(data.properties.cp)[0] - 10) + 
                        "," + (self.projection(data.properties.cp)[1] - leve) + ")" 
                })
                .on('mouseover', function(d) {
                    self.mouseOver(data.properties.name, value, 
                            (d3.event.pageX - 20)/window.X, 
                            (d3.event.pageY - 185)/window.Y)
                })
                .on('mousemove', function() {
                    self.mouseMove((d3.event.pageX - 20)/window.X, (d3.event.pageY - 185)/window.Y)
                })
                .on('mouseout', function() {
                    self.mouseOut()
                })

            exit.remove()
        }
    }

    return GradientMap
});