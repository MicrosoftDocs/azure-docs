---
title: Add a popup with Azure Maps | Microsoft Docs
description: How to add a popup to Javascript map
author: jingjing-z
ms.author: jinzh
ms.date: 11/09/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a popup to the map

This article shows you how to add a popup to a point on a map.

## Understand the code

<a id="addAPopup"></a>

<iframe height='500' scrolling='no' title='Add a pop up using Azure Maps' src='//codepen.io/azuremaps/embed/MPRPvz/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/MPRPvz/'>Add a pop up using Azure Maps</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a Map object. You can see [create a map](./map-create.md) for instructions. It also creates HTML content to be displayed within the popup.

The second block of code creates a data source object using the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) class. A point is a [Feature](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.feature?view=azure-iot-typescript-latest) of the [Point](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.data.point?view=azure-iot-typescript-latest) class. A point object with a name and description properties is then created and added to the data source.

A [symbol layer](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.layer.symbollayer?view=azure-iot-typescript-latest) uses text or icons to render point-based data wrapped in the [DataSource](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.source.datasource?view=azure-iot-typescript-latest) as symbols on the map.  A symbol layer is created in the third block of code. The data source is added to the symbol layer, which is then added to the map.

The fourth block of code creates a [popup object](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest) via `new atlas.Popup()`. Popup properties such as position and pixelOffset are part of [PopupOptions](/javascript/api/azure-maps-control/atlas.popupoptions). PopupOptions can be defined in popup constructor or via [setOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest#setoptions-popupoptions-) function of the popup class. A `mouseover` event listener for the symbol layer is then created.

The last block of code creates a function that is triggered by the `mouseover` event listener. It sets the content and properties of the popup and adds the popup object to the map.

## Reusing a popup with multiple points

When you have a lot of points and only want to show one popup at a time, the best approach is to create one popup and reuse it rather than creating a popup for each point feature. By doing this, the number of DOM elements created by the application is greatly reduced which can provide better performance. This sample creates 3 point features. If you click on any of them, a popup will be displayed with the content for that point feature.

<br/>

<iframe height='500' scrolling='no' title='Reusing Popup with Multiple Pins' src='//codepen.io/azuremaps/embed/rQbjvK/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/rQbjvK/'>Reusing Popup with Multiple Pins</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Popup](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [PopupOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popupoptions?view=azure-iot-typescript-latest)

See the following great articles for full code samples:

> [!div class="nextstepaction"]
> [Add a symbol layer](./map-add-pin.md)

> [!div class="nextstepaction"]
> [Add an HTML marker](./map-add-custom-html.md)

> [!div class="nextstepaction"]
> [Add a shape](./map-add-shape.md)