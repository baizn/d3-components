##矩形波动组件说明文档

###1 使用说明
```
var rectFill = require('rectFillGauge')

var data = [
    {
        name: '第一支队',
        rate: 50.5
    },
    {
        name: '第二支队',
        rate: 40.5
    },
    {
        name: '第五支队',
        rate: 20.5
    },
    {
        name: '第八支队',
        rate: 10.5
    },
    {
        name: '第十支队',
        rate: 30.5
    }
]

var config = {
    textColor: "#6db9ff",
    waveTextColor: "#6db9ff",
    circleThickness: 0,
    circleFillGap: 0,
    textVertPosition: 0.8,
    waveAnimateTime: 3000,
    waveHeight: 0.1,
    waveCount: 1
};

rectFill.renderInvolvedCase('container', data, config)

```
###2 效果展示

![rectFillGauge](img/rectFillGauge.gif)

###3 接口说明
####3.1 接口调用
调用方式：`rectFill.renderInvolvedCase('container', data, config)

参数说明：

- container: 页面容器class
- data：数据
- config：配置项

### 配置项参数说明

| 字段                            | 含义         | 是否必选 | 默认值     | 备注                      |
| ----------------------------- | ---------- | ---- | ------- | ----------------------- |
| textColor                  | 文本颜色      | 是    | 无     |                         |
| waveTextColor                 | 数值颜色      | 是    | 无     |   显示在波动矩形里面的值           |
| circleThickness              | 波动与矩形边缘的距离       | 否    | 0.05       |     设置为0，则波动与边缘不留空白                    |
| circleFillGap     | 波动的水纹是否填充满矩形边缘       | 否    | 0.05       |    设置为0，则填充满矩形边缘                     |
| textVertPosition  | 数值显示位置     | 否    | 5 |           默认显示在水纹上部，可根据需要调整              |
| waveAnimateTime  | 水波纹动画持续时间      | 否    | 18000       |                         |
| waveHeight       | 波纹的相对矩形的高度     | 否    | 0.5       |                         |
| waveCount | 波纹个数       | 否    | 1    |                         |

其他详细参数配置可见源码文件`defaultLiquidOpts`方法。