---
title: Add a heat map layer to Azure Maps | Microsoft Docs
description: How to add a heat map layer to the Javascript map
author: rbrundritt
ms.author: richbrun
ms.date: 12/2/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a heat map layer

Heat maps, also known as point density maps, are a type of data visualization used to represent the density of data using a range of colors. They are often used to show the data "hot spots" on a map and are a great way to render large point data sets.  For example, rendering tens of thousands of points within the map view as symbols cover most of the map area and would result in many symbols being covered by others, making it difficult to gain much insight into the data. However, visualizing this same data set as a heat map makes it easy to see where the point data is the densest and the relative density to other areas. There are many scenarios in which heat maps, are used. Here are few examples;

* Temperature data is commonly rendered as heat map as it provides approximations for what the temperature between two data points.
* Rendering data for noise sensors as a heat map not only shows the insanity of the noise where the sensor is but can also provide insights into the dissipation over a distance. The noise level at any one site may not be high, however if the noise coverage area from multiple sensors overlaps, it's possible that this overlapping area may experience higher noise levels, and thus  would be visible in the heat map.
* Visualizing a GPS trace that includes the speed as a weight height map where the intensity of each data point is based on the speed is a great way to quickly see where the vehicle was speeding.

> [!TIP]
> Bubble layers by default will render the coordinates of all geometries in a data source. To limit the layer such that it only renders point geometry features set the `filter` property of the layer to `['==', '$type', 'Point']`

## Add a heat map layer

To render a data source of points as a heat map simple pass your data source into an instance of the HeatMapLayer class and add it to the map as shown here.

<br/>

<iframe height='500' scrolling='no' title='Simple Heat Map Layer' src='//codepen.io/azuremaps/embed/gQqdQB/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/gQqdQB/'>Simple Heat Map Layer</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In this sample, each heat point has a radius of 10 pixels at all zoom levels. When adding the heat map layer to the map, this sample inserts it below the label layer. This creates a better user experience as the labels are clearly visible above the heat map. The data in this sample is sourced from the [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/) and consists of points that represents significant earthquakes that have occurred in the last 30 days.

## Customizing the heat map layer

The previous example customized the heat map by setting the radius and opacity options. The heat map layer provides several options for customization;

* `radius`: Defines a pixel radius in which to render each data point. The radius can be set as a fixed number or as an expression. Setting the radius as an expression that sets the radius based on the zoom level can result in heat maps that appear to have a radius that represents a consistent spatial area on the map.
* `color`: Specifies how the heat map is colorized. A gradient color palette is often used for heat maps, but stepped color palettes are also useful if you want to make your heat map look more like contour data. These color palettes define the colors from the minimum to the maximum density value. Color values for heat maps are specified as an expression on the `heatmap-density` value. The color at index 0 in a gradient expression or the default color of a step color defines the color of the area where there is no data, or background color. Many prefer to set this value to transparent or a semi-transparent black. Here are examples of color expressions;

| Gradient Color Expression | Stepped Color Expression | 
|---------------------------|--------------------------|
| \[<br/>&nbsp;&nbsp;&nbsp;&nbsp;'interpolate',<br/>&nbsp;&nbsp;&nbsp;&nbsp;\['linear'\],<br/>&nbsp;&nbsp;&nbsp;&nbsp;\['heatmap-density'\],<br/>&nbsp;&nbsp;&nbsp;&nbsp;0, 'transparent',<br/>&nbsp;&nbsp;&nbsp;&nbsp;0.01, 'purple',<br/>&nbsp;&nbsp;&nbsp;&nbsp;0.5, '#fb00fb',<br/>&nbsp;&nbsp;&nbsp;&nbsp;1, '#00c3ff'<br/>\] | \[<br/>&nbsp;&nbsp;&nbsp;&nbsp;'step',<br/>&nbsp;&nbsp;&nbsp;&nbsp;\['heatmap-density'\],<br/>&nbsp;&nbsp;&nbsp;&nbsp;'transparent',<br/>&nbsp;&nbsp;&nbsp;&nbsp;0.01, 'navy',<br/>&nbsp;&nbsp;&nbsp;&nbsp;0.25, 'navy',<br/>&nbsp;&nbsp;&nbsp;&nbsp;0.50, 'green',<br/>&nbsp;&nbsp;&nbsp;&nbsp;0.75, 'yellow',<br/>&nbsp;&nbsp;&nbsp;&nbsp;1.00, 'red'<br/>\] |	

* `opacity`: Specifies how opaque or transparent the heat map layer is.
* `intensity`: Applies a multiplier to the weight of each data point to increase the overall intensity of the heatmap. This helps to make the small differences in the weight of data points become easier to visualize.
* `weight`: By default, all data points have a weight of 1, thus all data points are weighted equally. The weight option acts as a multiplier and can be set as a number or an expression. If a number is set as number, say 2, it would be the equivalent of placing each data point on the map twice, thus doubling the density. Setting the weight option to a number renders the heat map in a similar way to using the intensity option. However, if an expression is used, the weight of each data point can be based on different and based on some metric in the properties of the point. Take earthquake data as an example, each data point represents an earthquake and an important metric each earthquake has is magnitude. Earthquakes happen all the time, but most have a low magnitude and aren't even felt. Using the magnitude value in an expression to assign the weight option will allow the more significant earthquakes to be increase be better represented within the heat map.
* In addition to the base layer options; min/max zoom, visible and filter, there is also a `source` option if you want to update the data source and `source-layer` option if your data source is a vector tile source.

Here is a tool to test out the different heat map layer options.

<br/>

<iframe height='700' scrolling='no' title='Heat Map Layer Options' src='//codepen.io/azuremaps/embed/WYPaXr/?height=700&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WYPaXr/'>Heat Map Layer Options</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

> [!TIP]
> By enabling clustering on the data source, points that are close to one another are grouped together as a clustered point. The point count of each cluster can be used as the weight expression for the heat map and significantly reduce the number of points that have to be render. The point count of a cluster is stored in a point_count property of the point feature as shown below. 
> ```JavaScript
> var layer = new atlas.layer.HeatMapLayer(datasource, null, {
>    weight: ['get', 'point_count']
> });
> ```
> If the clustering radius is only a few pixels there will be little visual difference the rendering. A larger radius will group more points into each cluster and improve the performance of the heatmap, but have the a more noticeable the differences will be.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [HeatMapLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.htmlmarker?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [HeatMapLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.heatmaplayeroptions?view=azure-iot-typescript-latest)

For more code examples to add to your maps, see the following articles:

> [!div class="nextstepaction"]
> [Add a symbol layer](./map-add-pin.md)

