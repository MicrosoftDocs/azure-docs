---
title: Add a popup with Azure Maps | Microsoft Docs
description: How to add a popup to Javascript map
author: jingjing-z
ms.author: jinzh
ms.date: 09/17/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Add a popup to the map

This article shows you how to add a popup to a map.  

## Understand the code

<a id="addAPopup"></a>

<iframe height='500' scrolling='no' title='Add a popup to a map' src='//codepen.io/azuremaps/embed/zRyKxj/?height=545&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/zRyKxj/'>Add a popup to a map</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first block of code constructs a Map object. You can see [create a map](./map-create.md) for instructions.

The second block of code creates a pin and add it to the map. You can see [add a pin to the map](./map-add-pin.md) for instructions.

The third block of code creates content to be displayed within a popup. Popup content is HTML element.

The fourth block of code creates a [popup object](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest) via `new atlas.Popup()`. Popup properties such as content and position are part of [PopupOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/models.popupoptions?view=azure-iot-typescript-latest). PopupOptions can be defined in popup constructor or via [setPopupOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest#setpopupoptions) function of the popup class.

The last block of code uses [addEventListener](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addeventlistener) function of the map class to listen for mouseover event on the pins, and uses [open](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest#open) function of the popup class to open the popup if the event occurs.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [Popup](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.popup?view=azure-iot-typescript-latest)

See the following great articles for full code samples:

> [!div class="nextstepaction"]
> [Add a shape](./map-add-shape.md)

> [!div class="nextstepaction"]
> [Add custom HTML](./map-add-custom-html.md)
