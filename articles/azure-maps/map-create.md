---
title: Create a map with Azure Maps | Microsoft Docs
description: How to create a Javascript map
author: jingjing-z
ms.author: jinzh
ms.date: 09/14/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Create a map

This article shows you how to create a map.  

## Understand the code

There are two ways you can construct a map. You can set the camera of the map by specifying the center point and zoom level. Set the camera bounds of the map by specifying the southwest bounding point and northeast bounding point.

<a id="setCameraOptions"></a>

### Set the camera

<iframe height='310' scrolling='no' title='Create a map via CameraOptions' src='//codepen.io/azuremaps/embed/qxKBMN/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/qxKBMN/'>Create a map via `CameraOptions` </a>by Azure Location Based Services (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, a [Map object](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) is created via `new atlas.Map()`. Map properties such as center and zoom level are part of [CameraOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/models.cameraoptions?view=azure-iot-typescript-latest). `CameraOptions` can be defined in the Map constructor or via [setCamera](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#setcamera) function of the Map class.

<a id="setCameraBoundsOptions"></a>

### Set the camera bounds

<iframe height='310' scrolling='no' title='Create a map via CameraBoundsOptions' src='//codepen.io/azuremaps/embed/ZrRbPg/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ZrRbPg/'>Create a map via `CameraBoundsOptions` </a>by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

In the code above, a [Map object](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) is constructed via `new atlas.Map()`. Map properties such as bounding box are part of [CameraBoundsOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/models.cameraboundsoptions?view=azure-iot-typescript-latest). `CameraBoundsOptions` can be defined via [setCameraBounds](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#setcamerabounds) function of the Map class.

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
