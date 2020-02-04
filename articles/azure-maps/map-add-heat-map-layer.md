---
title: Add a heat map layer to Azure Maps | Microsoft Docs
description: How to add a heat map layer to the Azure Maps Web SDK.
author: rbrundritt
ms.author: richbrun
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a heat map layer

Heat maps, also known as point density maps, are a type of data visualization used to represent the density of data by using a range of colors. They're often used to show the data "hot spots" on a map, and are a great way to render large point datasets. 

For example, rendering tens of thousands of points within the map view as symbols covers most of the map area. This likely results in many symbols overlapping each other, making it difficult to gain much insight into the data. However, visualizing this same dataset as a heat map makes it easy to see where the point data is the densest, and the relative density to other areas.

You can use heat maps in many different scenarios, including:

- **Temperature data**: Provides approximations for what the temperature is between two data points.
- **Data for noise sensors**: Shows not only the intensity of the noise where the sensor is, but can also provide insights into the dissipation over a distance. The noise level at any one site might not be high. But if the noise coverage area from multiple sensors overlaps, it's possible that this overlapping area might experience higher noise levels, and thus would be visible in the heat map.
- **GPS trace**: Includes the speed as a weighted height map, where the intensity of each data point is based on the speed. For example, this provides a way to see where a vehicle was speeding.

> [!TIP]
> Heat map layers by default render the coordinates of all geometries in a data source. To limit the layer so that it only renders point geometry features, set the `filter` property of the layer to `['==', ['geometry-type'], 'Point']`. If you want to include MultiPoint features as well, set the `filter` property of the layer to `['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']]`.

<br/>

<iframe src="https://channel9.msdn.com/Shows/Internet-of-Things-Show/Heat-Maps-and-Image-Overlays-in-Azure-Maps/player" width="960" height="540" allowFullScreen frameBorder="0"></iframe>

## Add a heat map layer

To render a data source of points as a heat map, pass your data source into an instance of the `HeatMapLayer` class, and add it to the map.

In the following code, each heat point has a radius of 10 pixels at all zoom levels. When you add the heat map layer to the map, this sample inserts it below the label layer, to create a better user experience. The labels are clearly visible above the heat map. The data in this sample is sourced from the [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/), and represents significant earthquakes that have occurred in the last 30 days.

```javascript
//Create a data source and add it to the map.
var datasource = new atlas.source.DataSource();
map.sources.add(datasource);

//Load a dataset of points, in this case earthquake data from the USGS.
datasource.importDataFromUrl('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson');

//Create a heat map and add it to the map.
map.layers.add(new atlas.layer.HeatMapLayer(datasource, null, {
  radius: 10,
  opacity: 0.8
}), 'labels');
```

Here's the complete running code sample of the preceding code.

<br/>

<iframe height='500' scrolling='no' title='Simple Heat Map Layer' src='//codepen.io/azuremaps/embed/gQqdQB/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/gQqdQB/'>Simple Heat Map Layer</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Customize the heat map layer

The previous example customized the heat map by setting the radius and opacity options. The heat map layer provides several options for customization, including:

* `radius`: Defines a pixel radius in which to render each data point. You can set the radius as a fixed number or as an expression. By using an expression, you can scale the radius based on the zoom level, and represent a consistent spatial area on the map (for example, a 5-mile radius).
* `color`: Specifies how the heat map is colorized. A color gradient is a common feature of heat maps, and you can achieve the effect with an `interpolate` expression. You can also use a `step` expression for colorizing the heat map, breaking up the density visually into ranges that resemble a contour or radar style map. These color palettes define the colors from the minimum to the maximum density value. 

  You specify color values for heat maps as an expression on the `heatmap-density` value. The color at index 0 in an interpolation expression, or the default color of a step expression, defines the color of the area where there's no data. You can use this to define a background color. Often, this value is set to transparent, or a semi-transparent black. 
   
  Here are examples of color expressions:

  | Interpolation color expression | Stepped color expression | 
  |--------------------------------|--------------------------|
  | \[<br/>&nbsp;&nbsp;&nbsp;&nbsp;'interpolate',<br/>&nbsp;&nbsp;&nbsp;&nbsp;\['linear'\],<br/>&nbsp;&nbsp;&nbsp;&nbsp;\['heatmap-density'\],<br/>&nbsp;&nbsp;&nbsp;&nbsp;0, 'transparent',<br/>&nbsp;&nbsp;&nbsp;&nbsp;0.01, 'purple',<br/>&nbsp;&nbsp;&nbsp;&nbsp;0.5, '#fb00fb',<br/>&nbsp;&nbsp;&nbsp;&nbsp;1, '#00c3ff'<br/>\] | \[<br/>&nbsp;&nbsp;&nbsp;&nbsp;'step',<br/>&nbsp;&nbsp;&nbsp;&nbsp;\['heatmap-density'\],<br/>&nbsp;&nbsp;&nbsp;&nbsp;'transparent',<br/>&nbsp;&nbsp;&nbsp;&nbsp;0.01, 'navy',<br/>&nbsp;&nbsp;&nbsp;&nbsp;0.25, 'green',<br/>&nbsp;&nbsp;&nbsp;&nbsp;0.50, 'yellow',<br/>&nbsp;&nbsp;&nbsp;&nbsp;0.75, 'red'<br/>\] |	

- `opacity`: Specifies how opaque or transparent the heat map layer is.
- `intensity`: Applies a multiplier to the weight of each data point to increase the overall intensity of the heat map. This helps to make the small differences in the weight of data points easier to visualize.
- `weight`: By default, all data points have a weight of 1, and are weighted equally. The weight option acts as a multiplier, and you can set it as a number or an expression. If a number (for example, 2) is set as the weight, it's the equivalent of placing each data point on the map twice, thus doubling the density. Setting the weight option to a number renders the heat map in a similar way to using the intensity option. 

  However, if you use an expression, the weight of each data point can be based on the properties of each data point. For example, suppose that each data point represents an earthquake. An important metric each earthquake data point has is a magnitude value. Earthquakes happen all the time, but most have a low magnitude, and aren't even felt. By using the magnitude value in an expression to assign the weight to each data point, you get a better representation of the significance of earthquakes within the heat map.
- `source` and `source-layer`: Enable you to update the data source.

Here's a tool to test out the different heat map layer options.

<br/>

<iframe height='700' scrolling='no' title='Heat Map Layer Options' src='//codepen.io/azuremaps/embed/WYPaXr/?height=700&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WYPaXr/'>Heat Map Layer Options</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Consistent zoomable heat map

By default, the radii of data points rendered in the heat map layer have a fixed pixel radius for all zoom levels. As you zoom the map, the data aggregates together and the heat map layer looks different. 

Use a `zoom` expression to scale the radius for each zoom level, such that each data point covers the same physical area of the map. This makes the heat map layer look more static and consistent. Each zoom level of the map has twice as many pixels vertically and horizontally as the previous zoom level. 

Scaling the radius so that it doubles with each zoom level creates a heat map that looks consistent on all zoom levels. To do this, use the `zoom` with a base 2 `exponential interpolation` expression, as shown in the following sample. Zoom the map to see how the heat map scales with the zoom level.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Consistent zoomable heat map" src="//codepen.io/azuremaps/embed/OGyMZr/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/OGyMZr/'>Consistent zoomable heat map</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

> [!TIP]
> When you enable clustering on the data source, points that are close to one another are grouped together as a clustered point. You can use the point count of each cluster as the weight expression for the heat map, and significantly reduce the number of points that have to be rendered. The point count of a cluster is stored in a `point_count` property of the point feature: 
> ```JavaScript
> var layer = new atlas.layer.HeatMapLayer(datasource, null, {
>    weight: ['get', 'point_count']
> });
> ```
> If the clustering radius is only a few pixels, there's little visual difference in the rendering. A larger radius groups more points into each cluster, and improves the performance of the heat map.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [HeatMapLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.htmlmarker?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [HeatMapLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.heatmaplayeroptions?view=azure-iot-typescript-latest)

For more code examples to add to your maps, see the following articles:

> [!div class="nextstepaction"]
> [Create a data source](create-data-source-web-sdk.md)

> [!div class="nextstepaction"]
> [Use data-driven style expressions](data-driven-style-expressions-web-sdk.md)
