# DataViz-project
数据可视化大作业，204个中央委员的数据统计，新闻网页模式

# 使用方法|Usage
因为有一个timeline-module 需要npm install， 该部分是改自[https://github.com/Genscape/d3-timeline]

> npm install d3-timeline-chart --save

python3 运行data_parser.py

> python data_parser.py

python的依赖库有flask 和 pandas：

> pip install pandas==0.24.2

> pip install flask

**如果有pandas, 也请更新到最新版本0.24.2, 据测试0.23的pandas在处理excel时和0.24有很大不同，会导致最后的页面出现BUG**

打开**chrome**, 进入页面http://localhost:500  建议用F11全屏浏览

*也可以使用其他浏览器，但效果会有比较大的差异*

# 可能出现的问题

1. 运行python时编码方式错误，不能够正确解析
解决办法：把static/data/data_preprocessed 以另一种格式（ANSI/UTF-8）另存为当前目录下。

2. 视图有一部分被遮挡
解决办法：浏览器切换到Chrome，并F11 全屏浏览

# 网页使用简介 四个模块
## 整体布局
![展示图](https://github.com/TissueC/DataViz-project/blob/master/images/%E7%BD%91%E9%A1%B5%E6%95%B4%E4%BD%93.png)
## 模块一：时间线
可以通过手动输入委员名并点击左侧按钮，也可以通过点击模块四的小圆圈（一个小圆代表一个委员）。

之后就会显示出该委员的履历时间条
可以放大缩小以及拖动，可以鼠标停留到时间块显示出具体履历和时间，点击委员名可以弹出对应委员的百度百科网页。
可以显示多个委员名。

![展示图](https://github.com/TissueC/DataViz-project/blob/master/images/%E6%A8%A1%E5%9D%97%E4%B8%80.png)

## 模块二：统计数据图标
有两种视图：bar和pie 包含了图例
包含了四类数据：性别、民族、年龄和学历
可以将鼠标停留到具体的一个矩形/扇形，可以高亮并显示具体数据

![展示图](https://github.com/TissueC/DataViz-project/blob/master/images/%E6%A8%A1%E5%9D%97%E4%BA%8C1.png)
![展示图](https://github.com/TissueC/DataViz-project/blob/master/images/%E6%A8%A1%E5%9D%97%E4%BA%8C2.png)

## 模块三：轨迹地图
该模块需要通过和模块四和模块一进行联动，当添加委员时，可以显示出该委员的生涯轨迹和对应的时间点。

![展示图](https://github.com/TissueC/DataViz-project/blob/master/images/%E6%A8%A1%E5%9D%97%E4%B8%89.png)

## 模块四：聚类分析（力导图 force-directed graph）
该模块分析具有同类属性的委员集合

类别包括：出生省份、出生年份、毕业院校和专业类别
大圆圈表示类别，双击后可以高亮并显示出对应的成员
小圆圈表示成员（委员），单击和模块一手动输入委员同理，可以显示出该委员的履历时间线和生涯轨迹
支持拖动和缩放。

![展示图](https://github.com/TissueC/DataViz-project/blob/master/images/%E6%A8%A1%E5%9D%97%E5%9B%9B1.png)

![展示图](https://github.com/TissueC/DataViz-project/blob/master/images/%E6%A8%A1%E5%9D%97%E5%9B%9B2.png)

