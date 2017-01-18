# d3-components
基于CMD规范的D3组件库，包括常用的图表，如饼图、柱状图、地图等。

## 目录说明
### src
组件源代码，每个组件一个单独的JS文件，JS文件内容必须符合CMD规范。

###doc
组件说明文档，必须包括使用示例、接口说明、配置项字段说明内容，其他部分根据实际情况可选。

###lib
引用的第三方库文件。

###page
组件测试页面目录，每个组件都必须经过测试，包括性能测试。

## 组件贡献列表

- splitPie：baizn
- splitBar: zhanghq
- triangleBar: zhanghq
- polygonBar: zhanghq
- circleArc: baizn
- pointBar: zhanghq
- rectFillGaguge: baizn
- polarCoordinates zhanghq
- gradientBar zhanghq
- relationChart zhanghq
- levelGradientMap baizn
- radarChart baizn

## 贡献组件说明
贡献组件时候，必须遵守以下约定：

- 组件源码放到src目录下，且代码结构遵循seajs规范
- 组件必须经过测试，且有测试页面，测试页面必须能正常访问，测试页面放到page目录下
- 组件必须有完整的说明文档，文档需要包括以下内容：使用示例、效果展示、实例及接口说明和配置项参数说明，文档需要包括md和html两种格式
- 在index.html页面添加组件文档入口，添加方式如下
    ```
        /*修改对应的href和src链接*/
        <div class="card">
            <a href="">
                <img src="./doc/img/wait.png" data-holder-rendered="true" style="height: 280px; width: 100%; display: block;">
            </a>
            <p class="card-text">
                <a href="" class="btn btn-secondary">示例</a>
                <a href="" class="btn btn-secondary">文档</a>
            </p>
        </div>
    ```
- 在README.md文件->【组件贡献列表】，添加对应的组件名称和姓名

## 参考资料
[lodash中文文档](http://www.css88.com/doc/lodash/)

