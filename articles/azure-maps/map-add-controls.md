---
title: Add map controls | Microsoft Docs
description: How to add zoom control, pitch control, rotate control and a style picker to a map in Azure Maps.
author: walsehgal
ms.author: v-musehg
ms.date: 08/29/2018
ms.topic: how-to-guides
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc
---

# Add Map Controls to Azure Maps

This article shows you how to add map controls to a map. You will also learn how to create a map with all controls and a style picker.

## Add zoom control

<iframe height='500' scrolling='no' title='Adding a zoom control' src='//codepen.io/azuremaps/embed/WKOQyN/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WKOQyN/'>Adding a zoom control</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first code block in the above code creates a map object. See [create a map](./map-create.md) for instructions on how to create a map.

The second code block creates a zoom control object using the atlas [ZoomControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.control.zoomcontrol?view=azure-iot-typescript-latest).

Zoom control adds the ability to zoom in and out of the map. The third block adds zoom control to the map using map's [addControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addcontrol) method.

## Add pitch control

<p data-height="500" data-theme-id="0" data-slug-hash="xJrwaP" data-default-tab="js,result" data-user="azuremaps" data-pen-title="Adding a pitch control" class="codepen">See the Pen <a href="https://codepen.io/azuremaps/pen/xJrwaP/">Adding a pitch control</a> by Azure Maps (<a href="https://codepen.io/azuremaps">@azuremaps</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

The first block of code above creates a map object with the style set to Grayscale. See [create a map](./map-create.md) for instructions on how to create a map.

The second code block creates a pitch control object using the atlas [PitchControl](https://docs.microsoft.com/en-us/javascript/api/azure-maps-control/atlas.control.pitchcontrol?view=azure-iot-typescript-latest).

Pitch control adds the ability to change the pitch of the map. The third block adds pitch control to the map using map's [addControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addcontrol) method.

## Add compass control

<iframe height='500' scrolling='no' title='Adding the style picker' src='//codepen.io/azuremaps/embed/OwgyvG/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/OwgyvG/'>Adding the style picker</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first code block in the above code creates a map object. See [create a map](./map-create.md) for instructions on how to create a map.

The second block of code creates a compass control object using the atlas [Compass Control](https://docs.microsoft.com/en-us/javascript/api/azure-maps-control/atlas.control.compasscontrol?view=azure-iot-typescript-latest#compasscontrol). It also adds the compass control to the map using map's [addControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addcontrol) method.

## A Map with all controls

The first code block in the above code creates a map object. See [create a map](./map-create.md) for instructions on how to create a map.

The second code block creates a compass control object using the atlas [CompassControl](https://docs.microsoft.com/en-us/javascript/api/azure-maps-control/atlas.control.compasscontrol?view=azure-iot-typescript-latest#compasscontrol) and adds it to the map using map's [addControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addcontrol) method.

The third block of code creates a zoom control object using the atlas [ZoomControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.control.zoomcontrol?view=azure-iot-typescript-latest) and adds it to the map using map's [addControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addcontrol) method.

The fourth code block creates a pitch control object using the atlas [PitchControl](https://docs.microsoft.com/en-us/javascript/api/azure-maps-control/atlas.control.pitchcontrol?view=azure-iot-typescript-latest) and adds it to the map using map's [addControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addcontrol) method.

The last block of code adds a style picker object to the map by using the atlas [StyleControl](https://docs.microsoft.com/en-us/javascript/api/azure-maps-control/atlas.control.stylecontrol?view=azure-iot-typescript-latest#stylecontrol) and adds it to the map using map's [addControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addcontrol) method.

## Next steps

Learn more about the classes and methods used in this article: 
* [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)
    * [addControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest#addcontrol)

* [Atlas](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas?view=azure-iot-typescript-latest)
    * [CompassControl](https://docs.microsoft.com/en-us/javascript/api/azure-maps-control/atlas.control.compasscontrol?view=azure-iot-typescript-latest#compasscontrol)
    * [ZoomControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.control.zoomcontrol?view=azure-iot-typescript-latest)
    * [PitchControl](https://docs.microsoft.com/en-us/javascript/api/azure-maps-control/atlas.control.pitchcontrol?view=azure-iot-typescript-latest)
    * [StyleControl](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.control.stylecontrol?view=azure-iot-typescript-latest#stylecontrol)
    
For more code examples to add to your maps, see the following articles: 
* [Add a pin](./map-add-pin.md)
* [Add a popup](./map-add-popup.md)