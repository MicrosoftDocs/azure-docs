---
title: Add a line layer to a map | Microsoft Azure Maps
description: In this article, you will learn how to add a line layer to a map using the Microsoft Azure Maps Web SDK.
author: rbrundritt
ms.author: richbrun
ms.date: 08/08/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a line layer to the map

A line layer can be used to render `LineString` and `MultiLineString` features as paths or routes on the map. A line layer can also be used to render the outline of `Polygon` and `MultiPolygon` features. A data source is connected to a line layer to provide it with data to render. 

> [!TIP]
> Line layers by default will render the coordinates of polygons as well as lines in a data source. To limit the layer such that it only renders LineString features set the `filter` property of the layer to `['==', ['geometry-type'], 'LineString']` or `['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'MultiLineString']]` if you want to include MultiLineString features as well.

The following code shows how to create a line. Add the line to a data source, then render it with a line layer using the [LineLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.linelayer?view=azure-iot-typescript-latest) class.

```javascript
//Create a data source and add it to the map.
var dataSource = new atlas.source.DataSource();
map.sources.add(dataSource);

//Create a line and add it to the data source.
dataSource.add(new atlas.data.LineString([[-73.972340, 40.743270], [-74.004420, 40.756800]]));
  
//Create a line layer to render the line to the map.
map.layers.add(new atlas.layer.LineLayer(dataSource, null, {
	strokeColor: 'blue',
	strokeWidth: 5
}));
```

Below is the complete running code sample of the above functionality.

<br/>

<iframe height='500' scrolling='no' title='Add a line to a map' src='//codepen.io/azuremaps/embed/qomaKv/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/qomaKv/'>Add a line to a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

Line layers can be styled using [LineLayerOptions](/javascript/api/azure-maps-control/atlas.linelayeroptions?view=azure-iot-typescript-latest) and [Use data-driven style expressions](data-driven-style-expressions-web-sdk.md).

## Add symbols along a line

This sample shows how to add arrow icons along a line on the map. When using a symbol layer, set the "placement" option to "line". This option will render the symbols along the line and rotate the icons (0 degrees = right).

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Show arrow along line" src="//codepen.io/azuremaps/embed/drBJwX/?height=500&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/drBJwX/'>Show arrow along line</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

> [!TIP]
> The Azure Maps web SDK provides several customizable image templates you can use with the symbol layer. For more information, see the [How to use image templates](how-to-use-image-templates-web-sdk.md) document.

<a name="line-stroke-gradient"></a>

## Add a stroke gradient to a line

You may apply a single stroke color to a line. You can also fill a line with a gradient of colors to show transition from one line segment to the next line segment. For example, line gradients can be used to represent changes over time and distance, or different temperatures across a connected line of objects. In order to apply this feature to a line, the data source must have the `lineMetrics` option set to true, and then a color gradient expression can be passed to the `strokeColor` option of the line. The stroke gradient expression has to reference the `['line-progress']` data expression that exposes the calculated line metrics to the expression.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Line with Stroke Gradient" src="//codepen.io/azuremaps/embed/wZwWJZ/?height=500&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/wZwWJZ/'>Line with Stroke Gradient</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Customize a line layer

The Line layer has several styling options. Here is a tool to try them out.

<br/>

<iframe height='700' scrolling='no' title='Line Layer Options' src='//codepen.io/azuremaps/embed/GwLrgb/?height=700&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/GwLrgb/'>Line Layer Options</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [LineLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.linelayer?view=azure-iot-typescript-latest) 

> [!div class="nextstepaction"]
> [LineLayerOptions](/javascript/api/azure-maps-control/atlas.linelayeroptions?view=azure-iot-typescript-latest)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Create a data source](create-data-source-web-sdk.md)

> [!div class="nextstepaction"]
> [Add a popup](map-add-popup.md)

> [!div class="nextstepaction"]
> [Use data-driven style expressions](data-driven-style-expressions-web-sdk.md)

> [!div class="nextstepaction"]
> [How to use image templates](how-to-use-image-templates-web-sdk.md)

> [!div class="nextstepaction"]
> [Add a polygon layer](map-add-shape.md)
