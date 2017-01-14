
/**
 * 柱状图组件
 * @autor zhanghq
 * @date 2016-12-30
 */

define(function(require) {
	/**
	 * 引入公用的文件
	 */
	require('lodash')
	require('d3')
	var $ = require('jquery')

	var splitBar = {
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
				scale: 1,
				itemStyle: {
					width: 4,
					height: 6,
					color: ['#5810ed', '#282f36'],
					spacing: 4, //小方块之间的间距
					symbol: 'tilt',  //方块类型（矩形rect，平行四边形tilt，椭圆circle）
					skewX: 30,	//倾斜角度
					radius: 3,	//椭圆的半径
					margin: {
						left:10,
						right:10
					},
				},
				leftText: {
					fontSize: 12,
					color: 'yellow',
					textAnchor: 'end'
				},
				rightText: {
					fontSize: 12,
					color: '#fff',
					textAnchor: 'middle'
				},
				grid: {  //文字离左右两边的距离
					x: 60,
					x2: 40
				}
		 }
		},
		/**
		 * 绘制饼图
		 */
		drawSplitBar: function(svg, data, opt) {

		  var config = _.assign({}, this.defaultSetting(), opt)
			var dataset = []
			for(var i = 0, len = data.length; i<len; i++){
				dataset.push(data[i].value)
			}
			var width = config.width
			var height = config.height
			var lineHeigh = height/dataset.length  

			var grid = config.grid

			//设置左边文字
			var leftTxt = config.leftText

			//小矩形方块配置
			var itemStyle = config.itemStyle
      
			var symbol = config.itemStyle.symbol  //方块类型（矩形，平行四边形，椭圆）
					
			//右边文字配置
			var rightTxt = config.rightText

			//获取矩形样式
			var spacing = itemStyle.spacing + itemStyle.width 
			var dataWidth = width  - grid.x - grid.x2
			var max = Math.floor(dataWidth/(itemStyle.width*2))-itemStyle.width
			var unit = Math.floor(d3.max(dataset)/ max)
	
			var xScale = d3.scale.linear()
				.domain([0,d3.max(dataset)])
				.range([dataWidth, 0]);

			var  index = 0;
		
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
			var updateG = update.attr('transform', function(d,i){
					return 'translate(0,'+(lineHeigh*i)+')'
				})
				.attr('class', 'tick')

			
			//处理enter部分 添加小的矩形box
			var tick = enter.append('g')
				.attr('transform', function(d,i){
					return 'translate(0,'+(lineHeigh*i)+')'
				})
				.attr('class', 'tick')

			//处理exit部分
			 exit.remove()	
			 d3.selectAll('.gRect').remove()	

			var exitLen = exit[0].length
			
      if(exitLen!=0){
        //updateData
        var gRect0 = updateG.append('g')
        var leftText = updateG.select('.leftText')
        var rightText = updateG.select('.rightText')
        var dom0 = {
          gRect: gRect0,
          leftText: leftText,
          rightText: rightText
        }
        addElement(dom0)
      }else{
        //enterData
        var gRect = tick.append('g')
        var leftText = tick.append('text')
        var rightText = tick.append('text')
        var dom = {
          gRect: gRect,
          leftText: leftText,
          rightText: rightText
        }
        addElement(dom)
      }	

      function addElement(dom){
      	var gRect = dom.gRect
        var leftText = dom.leftText
        var rightText = dom.rightText

        //添加左边文字
				leftText
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

				//添加数据矩形
				gRect
				 .attr('class','gRect')
				 .attr('transform', 'translate('+(grid.x+itemStyle.margin.left)+',0)')
				 .selectAll(".rect")
				 .data(d3.range(0, max))  //产生一系列的数值
				 .enter()  
				 .append('rect') 
				 .attr('x', 0) 
				 .transition()
	       .duration(1000)
				 .attr("x", function(d,i){
					//如果所有间距一样，不需要加if
	          // if(i%2==0){
	          //     return spacing*i  +3
	          // }
						return spacing*i 
				 })
				 .attr("y",function(d,i){  
					return 0
				 })  
				 .attr('width', itemStyle.width)
				 .attr('height', itemStyle.height)
				 .attr('fill', function(d, i) {
					var range = Math.floor(dataset[index] / unit)
						if(range<=0){
							range = cfg.min
						}
						if(i==max-1){
							index ++
						}
						return i < range ? itemStyle.color[0] : itemStyle.color[1]
					})
				 .attr('class', 'rect')
					//类型样式	   
					if(symbol=='circle'){
						d3.selectAll('rect')
							.attr('rx', itemStyle.radius)
							.attr('ry', itemStyle.radius)
							.attr('width', itemStyle.width+2)
					}
					
					if(symbol=='tilt'){
						d3.selectAll('rect')
							.attr('transform','skewX('+-(itemStyle.skewX)+')')
					}

				//添加右边文字(value)
				rightText
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
	}

	return splitBar
})