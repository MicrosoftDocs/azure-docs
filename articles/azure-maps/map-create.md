---
title: Create a map with Azure Maps | Microsoft Docs
description: How to create a map with the Azure Maps Web SDK.
author: jingjing-z
ms.author: jinzh
ms.date: 07/26/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: 
ms.custom: codepen
---

# Create a map

This article shows you ways to create a map and animate a map.  

## Loading a map

To load a map, create a new instance of the [Map class](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest). When initializing the map, a DIV element ID to render the map and a set of options to use when loading the map are passed in. If default authentication information isn't specified on the `atlas` namespace, this information will need to be specified in the map options when loading the map. The map loads several resources asynchronously for performance. As such, after creating the map instance, attach a `ready` or `load` event to the map and then add any additional code that interacts with the map in that event handler. The `ready` event fires as soon as the map has enough resources loaded to be interacted with programmatically. The `load` event fires after the initial map view has finished loading completely. 

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Basic map load" src="//codepen.io/azuremaps/embed/rXdBXx/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/rXdBXx/'>Basic map load</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

> [!TIP]
> Multiple maps can be loaded on the same page and each one can use the same or different authentication and language settings.

## Show a single copy of the world

When the map is zoomed out on a wide screen, multiple copies of the world will appear horizontally. This is great for most scenarios, but some for some applications it may be desirable to only see a single copy of the world. This can be done by setting the maps `renderWorldCopies` option to `false`.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="renderWorldCopies = false" src="//codepen.io/azuremaps/embed/eqMYpZ/?height=500&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/eqMYpZ/'>renderWorldCopies = false</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Controlling the map camera

There are two ways you can set the displayed area of the map using the camera. You can set camera options such as center, and zoom, when loading the map, or call the `setCamera` option anytime after the map has loaded to programmatically update the map view.  

<a id="setCameraOptions"></a>

### Set the camera

In the following code, a [Map object](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) is created and the center and zoom options are set. Map properties such as center, and zoom level are part of the [CameraOptions](/javascript/api/azure-maps-control/atlas.cameraoptions).

<br/>

<iframe height='500' scrolling='no' title='Create a map via CameraOptions' src='//codepen.io/azuremaps/embed/qxKBMN/?height=543&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/qxKBMN/'>Create a map via `CameraOptions` </a>by Azure Location Based Services (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

<a id="setCameraBoundsOptions"></a>

### Set the camera bounds

In the following code,  a [Map object](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) is constructed via `new atlas.Map()`. Map properties such as `CameraBoundsOptions` can be defined via [setCamera](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) function of the Map class. Bounds and padding properties are set using `setCamera`.

<br/>

<iframe height='500' scrolling='no' title='Create a map via CameraBoundsOptions' src='//codepen.io/azuremaps/embed/ZrRbPg/?height=543&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ZrRbPg/'>Create a map via `CameraBoundsOptions` </a>by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Animate map view

In the following code, the first code block creates a map and sets the map style, center and zoom values. In the second code block, a click event handler is created for the animate button. When this button is clicked the setCamera function is called with some random values for the [CameraOptions](/javascript/api/azure-maps-control/atlas.cameraoptions), [AnimationOptions](/javascript/api/azure-maps-control/atlas.animationoptions).

<br/>

<iframe height='500' scrolling='no' title='Animate Map View' src='//codepen.io/azuremaps/embed/WayvbO/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WayvbO/'>Animate Map View</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Try out the code

Take a look at the sample code above. You can edit the JavaScript code on the **JS tab** on the left and see the map view changes on the **Result tab** on the right. You can also click on the **Edit on CodePen** button and edit the code in CodePen.

<a id="relatedReference"></a>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [CameraOptions](/javascript/api/azure-maps-control/atlas.cameraoptions)

> [!div class="nextstepaction"]
> [AnimationOptions](/javascript/api/azure-maps-control/atlas.animationoptions)

See code examples to add functionality to your app:

> [!div class="nextstepaction"]
> [Change style of the map](choose-map-style.md)

> [!div class="nextstepaction"]
> [Add controls to the map](map-add-controls.md)

> [!div class="nextstepaction"]
> [Code samples](https://docs.microsoft.com/samples/browse/?products=azure-maps)