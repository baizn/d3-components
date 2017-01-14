/**
 * @Author:      zhq
 * @DateTime:    2017-01-12 21:52:27
 * @Description: 打点柱状图
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-12 21:52:27
 */

define(function(require) {
	/**
	 * 引入公用的文件
	 */
	require('lodash')
	require('d3')


	var pointBar = {
		/**
		 * 柱状图默认配置项
		 */
		defaultSetting: function() {
		  var width = 400
		  var height = 200
		  return {
				width: width,
				height: height,
				min: 1,
				itemStyle: {
					width: 6,
					height: 6,
					color: '#00fcff',
					spacing: 6,
					borderColor: '#0e7b98',
					margin: {
						right:10
					}
				},
				bottomText: {
					fontSize: 12,
					color: '#fff',
					textAnchor: 'start'
				},
				rightText: {
					fontSize: 12,
					color: '#fff',
					textAnchor: 'start'
				},
				grid:{
					x: 0,
					x2: 80
				}
		 }
		},
		/**
		 * 绘制柱状图
		 */
		drawPointBar: function(svg, data, opt) {

		  var config = _.assign({}, this.defaultSetting(), opt)
			var width = config.width
			var height = config.height

			var dataset = []
			for(var i = 0, len = data.length; i<len; i++){
				dataset.push(data[i].value)
			}
			
			//小矩形方块配置
			var itemStyle = config.itemStyle

			//右边文字配置
			var rightText = config.rightText

 			var lineHeigh = height/dataset.length 

			//添加小的矩形box
			var tick = svg.selectAll(".tick")  
     	  .data(data)
        .enter() 
        .append('g')
     		.attr('transform', function(d,i){
     			return 'translate(0,'+(lineHeigh*i)+')'
     		})
     		.attr('class', 'tick')

     	//设置下边文字
			var bottomText = config.bottomText	
			//添加下边文字
			tick.append('text')
				.attr('fill', bottomText.color)
				.attr('font-size', bottomText.fontSize)
				.attr('text-anchor', bottomText.textAnchor)
				.attr('x', 0)
				.attr('y', itemStyle.height*4)
				.text(function(d,i){
					return data[i].name
			})
				.attr('class', 'bottomText')
		
			//添加矩形
			var spacing = itemStyle.spacing + itemStyle.width
			var dataWidth = width  - config.grid.x2 
			var max = Math.floor(dataWidth/(itemStyle.width*2))
			var unit = Math.floor(d3.max(dataset) / max)
	    		
			var  index = 0;
			
			var gRect = tick.append('g')
       	 .attr('class','.gRect')

			gRect.append('rect')
				.attr('width', dataWidth)
				.attr('height', itemStyle.height*2)
				.attr('stroke', itemStyle.borderColor)
				.attr('stroke-width', 1)
				.attr('fill', 'none')
				.attr('transform', function(d,i){
					return 'translate(0, '+-(itemStyle.height/2)+')'
				})

     		gRect.selectAll('.gRect')
         .data(d3.range(0, max))  //产生一系列的数值
         .enter()  
         .append("rect")  
         .attr("x", function(d,i){
						return spacing*i 
         })
         .attr("y",function(d,i){  
            return 0
         })  
         .attr('width', itemStyle.width)
				 .attr('height', itemStyle.height)
         .attr('fill', function(d, i) {
          	var range = Math.floor(dataset[index] / unit);
          	if(range<=0){
          		range = config.min
          	}
          	if(range>max){
          		range = config.max
          	}
          	if(i==max-1){
          		index ++
          	}
						 return i < range ? itemStyle.color : 'none'
				 })
         .attr('class', 'rect')

				//添加右边文字
				tick.append('text')
				.attr('class', 'rightText')
				.attr('fill', rightText.color)
				.attr('font-size', rightText.fontSize)
				.attr('text-anchor', rightText.textAnchor)
				.attr('x', width -  config.grid.x2 +itemStyle.margin.right)
				.attr('y', itemStyle.height)
				.text(function(d,i){
					return data[i].value+'人'
				})

      }

	}

	return pointBar
})