---
title: Create a map with Azure Maps | Microsoft Azure Maps
description: In this article, you'll learn how to render a map on a web page using the Microsoft Azure Maps Web SDK.
author: Philmea
ms.author: philmea
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

To load a map, create a new instance of the [Map class](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map). When initializing the map, pass a DIV element ID to render the map and pass a set of options to use when loading the map. If default authentication information isn't specified on the `atlas` namespace, this information will need to be specified in the map options when loading the map. The map loads several resources asynchronously for performance. As such, after creating the map instance, attach a `ready` or `load` event to the map and then add any additional code that interacts with the map to the event handler. The `ready` event fires as soon as the map has enough resources loaded to be interacted with programmatically. The `load` event fires after the initial map view has finished loading completely. 

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="Basic map load" src="//codepen.io/azuremaps/embed/rXdBXx/?height=500&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/rXdBXx/'>Basic map load</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

> [!TIP]
> You can load multiple maps on the same page. Multiple map on the same page may use the same or different authentication and language settings.

## Show a single copy of the world

When the map is zoomed out on a wide screen, multiple copies of the world will appear horizontally. This option is great for some scenarios, but for other applications it's desirable to see a single copy of the world. This behavior is implemented by setting the maps `renderWorldCopies` option to `false`.

<br/>

<iframe height="500" style="width: 100%;" scrolling="no" title="renderWorldCopies = false" src="//codepen.io/azuremaps/embed/eqMYpZ/?height=500&theme-id=0&default-tab=js,result&editable=true" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/eqMYpZ/'>renderWorldCopies = false</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Map options

When creating a map there, are several different types of options that can be passed in to customize how the map functions as listed below.

- [CameraOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.cameraoptions) and [CameraBoundOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.cameraboundsoptions) are used to specify the area the map should display.
- [ServiceOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.serviceoptions) are used to specify how the map should interact with services that power the map.
- [StyleOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.styleoptions) are used to specify the map should be styled and rendered.
- [UserInteractionOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.userinteractionoptions) are used to specify how the map should reach when the user is interacting with the map. 

These options can also be updated after the map has been loaded using the `setCamera`, `setServiceOptions`, `setStyle`, and `setUserInteraction` functions. 

## Controlling the map camera

There are two ways to set the displayed area of the map using the camera of a map. You can set the camera options when loading the map. Or, you can call the `setCamera` option anytime after the map has loaded to programmatically update the map view.  

<a id="setCameraOptions"></a>

### Set the camera

The map camera controls what is displayed in the viewport of the map canvas. Camera options can be passed into the map options when being initialized or passed into the maps `setCamera` function.

```javascript
//Set the camera options when creating the map.
var map = new atlas.Map('map', {
    center: [-122.33, 47.6],
    zoom: 12

    //Additional map options.
};

//Update the map camera at anytime using setCamera function.
map.setCamera({
    center: [-110, 45],
    zoom: 5 
});
```

In the following code, a [Map object](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map) is created and the center and zoom options are set. Map properties, such as center and zoom level, are part of the [CameraOptions](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.cameraoptions).

<br/>

<iframe height='500' scrolling='no' title='Create a map via CameraOptions' src='//codepen.io/azuremaps/embed/qxKBMN/?height=543&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/qxKBMN/'>Create a map via `CameraOptions` </a>by Azure Location Based Services (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

<a id="setCameraBoundsOptions"></a>

### Set the camera bounds

A bounding box can be used to update the map camera. If the bounding box was calculated from point data, it is often useful to also specify a pixel padding value in the camera options to account for the icon size. This will help ensure that points don't fall off the edge of the map viewport.

```javascript
map.setCamera({
    bounds: [-122.4, 47.6, -122.3, 47.7],
    padding: 10
});
```

In the following code,  a [Map object](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map) is constructed via `new atlas.Map()`. Map properties such as `CameraBoundsOptions` can be defined via [setCamera](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map) function of the Map class. Bounds and padding properties are set using `setCamera`.

<br/>

<iframe height='500' scrolling='no' title='Create a map via CameraBoundsOptions' src='//codepen.io/azuremaps/embed/ZrRbPg/?height=543&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/ZrRbPg/'>Create a map via `CameraBoundsOptions` </a>by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Animate map view

When setting the camera options of the map, [animation options](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.animationoptions) can also be set. These options specify the type of animation and duration it should take to move the camera.

```javascript
map.setCamera({
    center: [-122.33, 47.6],
    zoom: 12,
    duration: 1000,
    type: 'fly'  
});
```

In the following code, the first code block creates a map and sets the enter and zoom map styles. In the second code block, a click event handler is created for the animate button. When this button is clicked, the `setCamera` function is called with some random values for the [CameraOptions](/javascript/api/azure-maps-control/atlas.cameraoptions) and [AnimationOptions](/javascript/api/azure-maps-control/atlas.animationoptions).

<br/>

<iframe height='500' scrolling='no' title='Animate Map View' src='//codepen.io/azuremaps/embed/WayvbO/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WayvbO/'>Animate Map View</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Try out the code

Look at the code samples. You can edit the JavaScript code inside the **JS tab** and see the map view changes on the **Result tab**. You can also click **Edit on CodePen**, in the top-right corner, and modify the code in CodePen.

<a id="relatedReference"></a>

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map)

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
