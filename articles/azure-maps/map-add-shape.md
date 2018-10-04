---
title: Add a shape with Azure Maps | Microsoft Docs
description: How to add a shape to a Javascript map
author: jingjing-z
ms.author: jinzh
ms.date: 05/07/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a shape to a map

This article shows you how to add a line, a circle, and a polygon to the map. 

<a id="addALine"></a>

## Add a line

<iframe height='500' scrolling='no' title='Add a line to a map' src='//codepen.io/azuremaps/embed/qomaKv/?height=534&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/qomaKv/'>Add a line to a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a Map object. You can see [create a map](./map-create.md) for instructions.

In the second block of code, a line is created. A line is a [Feature](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.feature?view=azure-iot-typescript-latest) of LineString with LineStringProperties as its Feature property. Use `new atlas.data.Feature(new atlas.data.LineString())` to create a line and define its properties.

A line layer is an array of lines. The last block of code uses [addLineStrings](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addlinestrings) function of the map class to add the line layer to the map and define the properties of the line layer. See properties of a line layer at [LinestringLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/models.linestringlayeroptions?view=azure-iot-typescript-latest).

<a id="addACircle"></a>

## Add a circle

<iframe height='500' scrolling='no' title='Add a circle to a map' src='//codepen.io/azuremaps/embed/PRmzJX/?height=538&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/PRmzJX/'>Add a circle to a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a Map object. You can see [create a map](./map-create.md) for instructions.

In the second block of code, a circle is created. A circle is a [Feature](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.feature?view=azure-iot-typescript-latest) of [Point](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.point?view=azure-iot-typescript-latest) with [CircleProperties](https://docs.microsoft.com/javascript/api/azure-maps-control/models.circleproperties?view=azure-iot-typescript-latest) as its Feature property. Use `new atlas.data.Feature(new atlas.data.Point())` to create a circle and define its properties.

A circle layer is an array of circles. The last block of code uses [addCircle](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addcircles) function of the map class to add the circle layer to the map and define the properties of the circle layer. See properties of a circle layer at [CircleLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/models.circlelayeroptions?view=azure-iot-typescript-latest).

<a id="addAPolygon"></a>

## Add a polygon

<iframe height='500' scrolling='no' title='Add a polygon to a map ' src='//codepen.io/azuremaps/embed/yKbOvZ/?height=543&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/yKbOvZ/'>Add a polygon to a map </a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a Map object. You can see [create a map](./map-create.md) for instructions.

In the second block of code, a polygon is created. A polygon is a [Feature](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.feature?view=azure-iot-typescript-latest) of [Polygon](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.polygon?view=azure-iot-typescript-latest) with [PolygonProperties](https://docs.microsoft.com/javascript/api/azure-maps-control/models.polygonproperties?view=azure-iot-typescript-latest) as its Feature property. Use `new atlas.data.Feature(new atlas.data.Polygon())` to create a polygon and define its properties. Provide ordered coordinates of the polygon path in the polygon constructor.

A polygon layer is an array of polygons. The last block of code uses [addPolygons](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addpolygons) function of the map class to add the polygon layer to the map and define its properties. See properties of a polygon layer at [PolygonLayerOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/models.polygonlayeroptions?view=azure-iot-typescript-latest).

## Next steps

For more code examples to add to your maps, see the following articles:

> [!div class="nextstepaction"]
> [Add custom HTML](./map-add-custom-html.md)

> [!div class="nextstepaction"]
> [Show search results](./map-search-location.md)
