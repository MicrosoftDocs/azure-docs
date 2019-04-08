---
title: Add a Symbol layer to Azure Maps | Microsoft Docs
description: How to add symbols to the Javascript map
author: rbrundritt
ms.author: richbrun
ms.date: 12/2/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a symbol layer to a map

This article shows you how you can render point data from a data source as a Symbol layer on a map. Symbol layers are rendered using WebGL and support much larger sets of points than HTML markers, but don't support traditional CSS and HTML elements for styling.  

> [!TIP]
> Symbol layers by default will render the coordinates of all geometries in a data source. To limit the layer such that it only renders point geometry features set the `filter` property of the layer to `['==', ['geometry-type'], 'Point']` or `['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']]` if you want to include MultiPoint features as well.

## Add a symbol layer

<iframe height='500' scrolling='no' title='Switch pin location' src='//codepen.io/azuremaps/embed/ZqJjRP/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ZqJjRP/'>Switch pin location</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first block of code above constructs a Map object. You can see [create a map](./map-create.md) for instructions.

In the second block of code, a data source object is created using the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class. A [Feature] containing a [Point](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.point?view=azure-iot-typescript-latest) geometry is wrapped by the [Shape](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.shape?view=azure-iot-typescript-latest) class to make it easier to update, then created and added to the data source.

The third block of code creates an [event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) and updates the point's coordinates upon mouse click using the shape class [setCoordinates](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.shape?view=azure-iot-typescript-latest) method.

A [symbol layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.symbollayer?view=azure-iot-typescript-latest) uses text or icons to render point-based data wrapped in the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) as symbols on the map.  The data source, the click event listener, and the symbol layer are created and added to the map within the `ready` [event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) function to ensure the point is displayed after the map loaded and ready to be accessed.

> [!TIP]
> By default, for performance, symbol layers optimize the rendering of symbols by hiding symbols that overlap. As you zoom in the hidden symbols become visible. To disable this feature and render all symbols at all times, set the `allowOverlap` property of the `iconOptions` options to `true`.

## Add a custom icon to a symbol layer

Symbol layers are rendered using WebGL. As such all resources, such as icon images, must be loaded into the WebGL context. This sample shows how to add a custom icon to the map resources and then use it to render point data with a custom symbol on the map. The `textField` property of the symbol layer requires an expression to be specified. In this case, we want to render the temperature property but since its a number, it needs to be converted to a string. Additionally we want to append the "°F" to it. An expression can be used to do this; `['concat', ['to-string', ['get', 'temperature']], '°F']`. 

<br/>

<iframe height='500' scrolling='no' title='Custom Symbol Image Icon' src='//codepen.io/azuremaps/embed/WYWRWZ/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WYWRWZ/'>Custom Symbol Image Icon</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Customize a symbol layer 

The symbol layer has many styling options available. Here is a tool to test out these various styling options.

<br/>

<iframe height='700' scrolling='no' title='Symbol Layer Options' src='//codepen.io/azuremaps/embed/PxVXje/?height=700&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/PxVXje/'>Symbol Layer Options</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [SymbolLayer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.symbollayer?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [SymbolLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.symbollayeroptions?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [IconOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.iconoptions?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [TexTOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.textoptions?view=azure-iot-typescript-latest)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Add a popup](map-add-popup.md)

> [!div class="nextstepaction"]
> [Use data-driven style expressions](data-driven-style-expressions-web-sdk.md)

> [!div class="nextstepaction"]
> [Add a shape](map-add-shape.md)

> [!div class="nextstepaction"]
> [Add a bubble layer](map-add-bubble-layer.md)

> [!div class="nextstepaction"]
> [Add HTML Makers](map-add-bubble-layer.md)
