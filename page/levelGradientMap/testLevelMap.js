define(function(require) {
    /**
     * 引入公用的文件
     */
    require('../../lib/d3.v3')

    //引入地图组件
    var GradientMap = require('../../src/levelGradientMap.js')

    window.X = 1
    window.Y = 1
    window.GLOBAL_TIME_OBJ = {
        typeName: '全市案件数'
    }
    var config = {
        width: 1448,
        height: 800,
        mapDeep: 0,
        scale: 10000
    }

    var gradientMap = new GradientMap('#container', config)
    
    /**
     * 读取重庆地区json文件
     */
    d3.json("./chongqingtopo.json", function(error, toporoot) {
        if (error) {
            return console.error(error);
        }

        console.log(toporoot)
        var root = topojson.feature(toporoot, toporoot.objects.chongqing)

        //显示底层阴影
        gradientMap.showmap("shadowend", "#178dc3", root.features, 0, 50);
        //显示二层阴影
        gradientMap.showmap("shadow", "#6bfdff", root.features, 0, 30);
        //显示阴影
        gradientMap.showmap("shadow", "#006ecb", root.features, 0, 20);

        /**
         * 读取测试数据，真实情况下通过ajax请求后台数据
         */
        d3.json('./data.json', function(err, result) {
            var mapData = result.troopsMap

            //获取返回值中的最大值
            var maxValue = d3.max(mapData, function(d, i) {
                return parseInt(d.value, 10)
            })
            
            var areaUnit = maxValue/6
            var unit = maxValue/300
            unit = unit.toFixed(2)
            
            //显示地图
            gradientMap.showmap("map", "#1a4a4e", root.features, 0, 0, mapData);

            //按行政区域绘制地图
            //绘制绿色区域
            for (var i = 0; i < mapData.length; i++) {
                for (var j = 0; j < root.features.length; j++) {
                    if (root.features[j].properties.name == mapData[i].key) {
                        gradientMap.showoverView("overView" + i, root.features[j], Math.round(mapData[i].value/areaUnit), mapData[i].value);
                    }
                }
            }

            //绘制尖尖
            for (var i = 0; i < mapData.length; i++) {
                for (var j = 0; j < root.features.length; j++) {
                    if (root.features[j].properties.name == mapData[i].key) {
                        gradientMap.showTips("Tips", root.features[j], mapData[i].value/unit, mapData[i].value)
                    }
                }
            }
        })
    })
});