---
title: Add a Symbol layer to a map | Microsoft Azure Maps
description: In this article, you'll learn about how to use the Symbol layer to customize a symbol, and add symbols on a map using the Microsoft Azure Maps Web SDK.
author: rbrundritt
ms.author: richbrun
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a symbol layer to a map

Connect a symbol to a data source, and use it to render an icon or a text at a given point. 

Symbol layers are rendered using WebGL. Use a symbol layer to render large collections of points on the map. Compared to HTML marker, the symbol layer renders a large number of point data on the map, with better performance. However, the symbol layer doesn't support traditional CSS and HTML elements for styling.  

> [!TIP]
> Symbol layers by default will render the coordinates of all geometries in a data source. To limit the layer such that it only renders point geometry features set the `filter` property of the layer to `['==', ['geometry-type'], 'Point']` or `['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']]` if you want, you can include MultiPoint features as well.

The maps image sprite manager loads custom images used by the symbol layer. It supports the following image formats:

- JPEG
- PNG
- SVG
- BMP
- GIF (no animations)

## Add a symbol layer

Before you can add a symbol layer to the map, you need to take a couple of steps. First, create a data source, and add it to the map. Create a symbol layer. Then, pass in the data source to the symbol layer, to retrieve the data from the data source. Finally, add data into the data source, so that there's something to be rendered. 

The code below demonstrates what should be added to the map after it has loaded. This sample renders a single point on the map using a symbol layer. 

```javascript
//Create a data source and add it to the map.
var dataSource = new atlas.source.DataSource();
map.sources.add(dataSource);

//Create a symbol layer to render icons and/or text at points on the map.
var layer = new atlas.layer.SymbolLayer(dataSource);

//Add the layer to the map.
map.layers.add(layer);

//Create a point and add it to the data source.
dataSource.add(new atlas.data.Point([0, 0]));
```

There are four different types of point data that can be added to the map:

- GeoJSON Point geometry - This object only contains a coordinate of a point and nothing else. The `atlas.data.Point` helper class can be used to easily create these objects.
- GeoJSON MultiPoint geometry - This object contains the coordinates of multiple points and nothing else. The `atlas.data.MultiPoint` helper class can be used to easily create these objects.
- GeoJSON Feature - This object consists of any GeoJSON geometry and a set of properties that contain metadata associated to the geometry. The `atlas.data.Feature` helper class can be used to easily create these objects.
- `atlas.Shape` class is similar to the GeoJSON feature. Both consist of a GeoJSON geometry and a set of properties that contain metadata associated to the geometry. If a GeoJSON object is added to a data source, it can easily be rendered in a layer. However, if the coordinates property of that GeoJSON object is updated, the data source and map don't change. That's because there's no mechanism in the JSON object to trigger an update. The shape class provides functions for updating the data it contains. When a change is made, the data source and map are automatically notified and updated. 

The following code sample creates a GeoJSON Point geometry and passes it into the `atlas.Shape` class to make it easy to update. The center of the map is initially used to render a symbol. A click event is added to the map such that when it fires, the coordinates of the mouse are used with the shapes `setCoordinates` function. The mouse coordinates are recorded at the time of the click event. Then, the `setCoordinates` updates the location of the symbol on the map.

<br/>

<iframe height='500' scrolling='no' title='Switch pin location' src='//codepen.io/azuremaps/embed/ZqJjRP/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ZqJjRP/'>Switch pin location</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

> [!TIP]
> By default, symbol layers optimize the rendering of symbols by hiding symbols that overlap. As you zoom in, the hidden symbols become visible. To disable this feature and render all symbols at all times, set the `allowOverlap` property of the `iconOptions` options to `true`.

## Add a custom icon to a symbol layer

Symbol layers are rendered using WebGL. As such all resources, such as icon images, must be loaded into the WebGL context. This sample shows how to add a custom icon to the map resources. This icon is then used to render point data with a custom symbol on the map. The `textField` property of the symbol layer requires an expression to be specified. In this case, we want to render the temperature property. Since temperature is a number, it needs to be converted to a string. Additionally we want to append "°F" to it. An expression can be used to do this concatenation; `['concat', ['to-string', ['get', 'temperature']], '°F']`. 

<br/>

<iframe height='500' scrolling='no' title='Custom Symbol Image Icon' src='//codepen.io/azuremaps/embed/WYWRWZ/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WYWRWZ/'>Custom Symbol Image Icon</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

> [!TIP]
> The Azure Maps web SDK provides several customizable image templates you can use with the symbol layer. For more information, see the [How to use image templates](how-to-use-image-templates-web-sdk.md) document.

## Customize a symbol layer 

The symbol layer has many styling options available. Here is a tool to test out these various styling options.

<br/>

<iframe height='700' scrolling='no' title='Symbol Layer Options' src='//codepen.io/azuremaps/embed/PxVXje/?height=700&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/PxVXje/'>Symbol Layer Options</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

> [!TIP]
> When you want to render only text with a symbol layer, you can hide the icon by setting the `image` property of the icon options to `'none'`.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [SymbolLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.symbollayer?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [SymbolLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.symbollayeroptions?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [IconOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.iconoptions?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [TextOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.textoptions?view=azure-iot-typescript-latest)

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
> [Add a line layer](map-add-line-layer.md)

> [!div class="nextstepaction"]
> [Add a polygon layer](map-add-shape.md)

> [!div class="nextstepaction"]
> [Add a bubble layer](map-add-bubble-layer.md)

> [!div class="nextstepaction"]
> [Add HTML Makers](map-add-bubble-layer.md)
