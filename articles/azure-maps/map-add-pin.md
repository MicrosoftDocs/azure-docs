---
title: Add a symbols and markers with Azure Maps | Microsoft Docs
description: How to add symbols and markers to a Javascript map
author: walsehgal
ms.author: v-musehg
ms.date: 10/24/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add Symbols and Markers to a map

This article shows you how to add Symbols and Markers to a map using a data source.

## Add point-based data using bubble layer

<iframe height='500' scrolling='no' title='BubbleLayer DataSource' src='//codepen.io/azuremaps/embed/mzqaKB/?height=543&theme-id=0&default-tab=js,resultundefined&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/mzqaKB/'>BubbleLayer DataSource</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a Map object. You can see [create a map](./map-create.md) for instructions.

In the second block of code, a data source object is created using the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class. A point is a [Feature](https://docs.microsoft.com/en-us/javascript/api/azure-maps-control/atlas.data.feature?view=azure-iot-typescript-latest) of [point](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.point?view=azure-iot-typescript-latest) class. It then creates a circle using `new atlas.Shape(new atlas.data.Feature(new atlas.data.Point()))`. The circle is then added to the data source.

A [bubble layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.bubblelayer?view=azure-iot-typescript-latest) renders point-based data as circles on the map. The last block of code creates a bubble layer and adds it to the map. See properties of a bubble layer at [BubblerLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/models.bubblelayeroptions?view=azure-iot-typescript-latest).

The data source and bubble layer are created and added to the map within the [event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) function to ensure that circle is displayed after the map loads fully.

## Add point-based data using symbol layer

<iframe height='500' scrolling='no' title='Switch pin location' src='//codepen.io/azuremaps/embed/ZqJjRP/?height=543&theme-id=0&default-tab=js,resultundefined&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ZqJjRP/'>Switch pin location</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first block of code above constructs a Map object. You can see [create a map](./map-create.md) for instructions.

In the second block of code, a data source object is created using the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class. A point is then created and added to data source. A point is a [Feature](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.feature?view=azure-iot-typescript-latest) of [Point](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.point?view=azure-iot-typescript-latest).

The third block of code creates an event listener and updates the point's coordinates upon mouse click using the shape class [setCoordinates](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.shape?view=azure-iot-typescript-latest#setcoordinates) method.

A [symbol layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.symbollayer?view=azure-iot-typescript-latest) is an array of points. The last block of code creates and adds a symbol layer to the map. The data source, the click event listener, and the symbol layer are created and added to the map within the [event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) function to ensure that the point is displayed after the map loads fully.

## Add point-based data using bubble layer and symbol layer

<iframe height='500' scrolling='no' title='MultiLayer DataSource' src='//codepen.io/azuremaps/embed/LgOJMx/?height=500&theme-id=0&default-tab=js,resultundefined&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/LgOJMx/'>MultiLayer DataSource</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a map object. You can see [create a map](./map-create.md) for instructions.

The second block of code, creates a data source object using the [data source](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class. It then adds the **earthquake feed** data to the data source.

A [bubble layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.bubblelayer?view=azure-iot-typescript-latest) renders point-based data as circles on the map. The third block of code creates a bubble layer and adds it to the map. See properties of a bubble layer at [BubblerLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/models.bubblelayeroptions?view=azure-iot-typescript-latest).

A [symbol layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.symbollayer?view=azure-iot-typescript-latest) renders point-based data as symbols on the map. The last block of code creates and adds a symbol layer to the map that renders magnitudes as text labels on each bubble. See properties of a symbol layer at [SymbolLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/models.symbollayeroptions?view=azure-iot-typescript-latest).

The data source and the layers are created and added to the map within the [event listener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#events) function to ensure that data is displayed after the map loads fully.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Add a popup](./map-add-popup.md)

> [!div class="nextstepaction"]
> [Add a shape](./map-add-shape.md)