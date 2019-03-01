---
title: Create a map with Azure Maps | Microsoft Docs
description: How to create a Javascript map
author: jingjing-z
ms.author: jinzh
ms.date: 10/30/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Create a map

This article shows you ways to create a map and animate a map.  

## Understand the code

There are two ways you can construct a map. You can set the camera of the map by specifying the center point and zoom level or you can set the camera bounds of the map by specifying the southwest and northeast bounding points.

<a id="setCameraOptions"></a>

### Set the camera

<iframe height='500' scrolling='no' title='Create a map via CameraOptions' src='//codepen.io/azuremaps/embed/qxKBMN/?height=543&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/qxKBMN/'>Create a map via `CameraOptions` </a>by Azure Location Based Services (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, a [Map object](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) is created via `new atlas.Map()` and the center and zoom are set. Map properties such as center and zoom level are part of [CameraOptions](/javascript/api/azure-maps-control/atlas.cameraoptions).

<a id="setCameraBoundsOptions"></a>

### Set the camera bounds

<iframe height='500' scrolling='no' title='Create a map via CameraBoundsOptions' src='//codepen.io/azuremaps/embed/ZrRbPg/?height=543&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ZrRbPg/'>Create a map via `CameraBoundsOptions` </a>by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, a [Map object](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) is constructed via `new atlas.Map()`. Map properties such as `CameraBoundsOptions` can be defined via [setCamera](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) function of the Map class. Bounds and padding properties are set using `setCamera`.

### Animate map view

<iframe height='500' scrolling='no' title='Animate Map View' src='//codepen.io/azuremaps/embed/WayvbO/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WayvbO/'>Animate Map View</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, the first code block creates a [Map object](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) via `new atlas.Map()`. Map properties such as center and zoom level are part of [CameraOptions](/javascript/api/azure-maps-control/atlas.cameraoptions). `CameraOptions` can be defined in the Map constructor or via [setCamera](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) function of the Map class. The [map style](https://docs.microsoft.com/azure/azure-maps/supported-map-styles) is set to `road`.

The second code block creates an animate map function, which animates change in map view by defining [AnimationOptions](/javascript/api/azure-maps-control/atlas.animationoptions) via [setCamera](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) function. The function is triggered by the 'Animate Map' button to generate a random zoom level upon each click.

## Try out the code

Take a look at the sample code above. You can edit the JavaScript code on the **JS tab** on the left and see the map view changes on the **Result tab** on the right. You can also click on the **Edit on CodePen** button and edit the code in CodePen.

<a id="relatedReference"></a>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

See code examples to add functionality to your app:

> [!div class="nextstepaction"]
> [Choose a map style](choose-map-style.md)

> [!div class="nextstepaction"]
> [Add map controls](map-add-controls.md)
