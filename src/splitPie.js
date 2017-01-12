
/**
 * 饼图组件
 * @autor baizn
 * @date 2016-12-29
 */

define(function(require) {
    /**
     * 引入公用的文件
     */
    require('lodashJS')
    require('d3')

    var splitPie = {
        /**
         * 饼图默认配置项
         */
        defaultSetting: function() {
            var width = 200
            var height = 200
            return {
                width: width,
                height: height,
                min: 0,
                max: 40, //限制平分最多个数
                scale: 1, //用于控制平分后圆的大小
                outerRadius: width/4,
                innerRadius: height/3,
                color: ['#c00cee', '#5478ff']
            }
        },
        /**
         * 绘制饼图
         */
        drawSplitPie: function(svg, data, opt) {
            var config = _.assign({}, this.defaultSetting(), opt)

            var color = config.color;
            var dataset = data

            var pie = d3.layout.pie().sort(null); //饼图布局
            var pieData = []
            var pieDatas = []
            var nums = []
            var w = config.width
            var h = config.height

            var max = config.max
            var min = config.min
            var scale = config.scale
            
            //计算一个比例
            var unit = Math.ceil(d3.max(dataset) * scale/ (max - min))
            console.log(unit)
            for(var i=0; i<dataset.length; i++){
                //根据比例得到每个值平分多少份
                var num = Math.ceil(dataset[i]/unit)
                for(var j=1;j<num+1;j++){
                    pieData.push(1)
                }
                //保存平分多少份的值用于后面填充颜色
                nums.push(num)
            }

            var outerRadius = config.outerRadius;  //外半径
            var innerRadius = config.innerRadius; //内半径
            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)

            /**
             * 获取update部分
             */
            var update = svg.selectAll(".arc")
                .data(pie(pieData))
            
            //获取enter部分
            var enter = update.enter()

            //获取exit部分
            var exit = update.exit()

            var c =0
            var cc = nums[0]

            //处理update部分
            update.attr("transform", "translate("+w/2+", "+(h/2)+")")
                .append("path")
                .attr("fill", function(d, i) {
                    if(i==cc){
                        c++
                        cc += nums[c]
                    }
                    return color[c]
                })
                .attr("d", arc)

            //处理enter部分
            enter.append("g")
                .attr("class", "arc")
                .attr("transform", "translate("+w/2+", "+(h/2)+")")
                .append("path")
                .attr("fill", function(d, i) {
                    if(i==cc){
                        c++
                        cc += nums[c]
                    }
                    return color[c]
                })
                .attr("d", arc)

            //处理exit部分
            
        }
    }

    return splitPie
})