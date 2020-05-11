---
title: Add controls to a map | Microsoft Azure Maps
description: How to add zoom control, pitch control, rotate control and a style picker to a map in Microsoft Azure Maps.
author: philmea
ms.author: philmea
ms.date: 07/29/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Add controls to a map

This article shows you how to add controls to a map. You'll also learn how to create a map with all controls and a [style picker](https://docs.microsoft.com/azure/azure-maps/choose-map-style).

## Add zoom control

A zoom control adds buttons for zooming the map in and out. The following code sample creates an instance of the [ZoomControl](/javascript/api/azure-maps-control/atlas.control.zoomcontrol) class, and adds it the bottom-right corner of the map.

```javascript
//Construct a zoom control and add it to the map.
map.controls.add(new atlas.control.ZoomControl(), {
    position: 'bottom-right'
});
```

Below is the complete running code sample of the above functionality.

<br/>

<iframe height='500' scrolling='no' title='Adding a zoom control' src='//codepen.io/azuremaps/embed/WKOQyN/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WKOQyN/'>Adding a zoom control</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Add pitch control

A pitch control adds buttons for tilting the pitch to map relative to the horizon. The following code sample creates an instance of the [PitchControl](/javascript/api/azure-maps-control/atlas.control.pitchcontrol) class. It adds the PitchControl to top-right corner of the map.

```javascript
//Construct a pitch control and add it to the map.
map.controls.add(new atlas.control.PitchControl(), {
    position: 'top-right'
});
```

Below is the complete running code sample of the above functionality.

<br/>

<iframe height='500' scrolling='no' title='Adding a pitch control' src='//codepen.io/azuremaps/embed/xJrwaP/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/xJrwaP/'>Adding a pitch control</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Add compass control

A compass control adds a button for rotating the map. The following code sample creates an instance of the [Compass Control](/javascript/api/azure-maps-control/atlas.control.compasscontrol) class and adds it the bottom-left corner of the map.

```javascript
//Construct a compass control and add it to the map.
map.controls.add(new atlas.control.Compass(), {
    position: 'bottom-left'
});
```

Below is the complete running code sample of the above functionality.

<br/>

<iframe height='500' scrolling='no' title='Adding a rotate control' src='//codepen.io/azuremaps/embed/GBEoRb/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/GBEoRb/'>Adding a rotate control</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## A Map with all controls

Multiple controls can be put into an array and added to the map all at once and positioned in the same area of the map to simplify development. The following adds the standard navigation controls to the map using this approach.

```javascript
map.controls.add([
	new atlas.control.ZoomControl(),
	new atlas.control.CompassControl(),
	new atlas.control.PitchControl(),
	new atlas.control.StyleControl()
], {
	position: "top-right"
});
```

The following code sample adds the zoom, compass, pitch, and style picker controls to the top-right corner of the map. Notice how they automatically stack. The order of the control objects in the script dictates the order in which they appear on the map. To change the order of the controls on the map, you can change their order in the array.

<br/>

<iframe height='500' scrolling='no' title='A map with all the controls' src='//codepen.io/azuremaps/embed/qyjbOM/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/qyjbOM/'>A map with all the controls</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The style picker control is defined by the [StyleControl](/javascript/api/azure-maps-control/atlas.control.stylecontrol) class. For more information on using the style picker control, see [choose a map style](choose-map-style.md).

## Customize controls

Here is a tool to test out the various options for customizing the controls.

<br/>

<iframe height="700" style="width: 100%;" scrolling="no" title="Navigation control options" src="//codepen.io/azuremaps/embed/LwBZMx/?height=700&theme-id=0&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azuremaps/pen/LwBZMx/'>Navigation control options</a> by Azure Maps
  (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

If you want to create customized navigation controls, create a class that extends from the `atlas.Control` class or create an HTML element and position it above the map div. Have this UI control call the maps `setCamera` function to move the map. 

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Compass Control](/javascript/api/azure-maps-control/atlas.control.compasscontrol)

> [!div class="nextstepaction"]
> [PitchControl](/javascript/api/azure-maps-control/atlas.control.pitchcontrol) 

> [!div class="nextstepaction"]
> [StyleControl](/javascript/api/azure-maps-control/atlas.control.stylecontrol) 

> [!div class="nextstepaction"]
> [ZoomControl](/javascript/api/azure-maps-control/atlas.control.zoomcontrol) 

See the following articles for full code:

> [!div class="nextstepaction"]
> [Add a pin](./map-add-pin.md)

> [!div class="nextstepaction"]
> [Add a popup](./map-add-popup.md)

> [!div class="nextstepaction"]
> [Add a line layer](map-add-line-layer.md)

> [!div class="nextstepaction"]
> [Add a polygon layer](map-add-shape.md)

> [!div class="nextstepaction"]
> [Add a bubble layer](map-add-bubble-layer.md)

