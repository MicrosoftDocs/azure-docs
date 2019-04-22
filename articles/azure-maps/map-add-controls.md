---
title: Add map controls in Azure Maps| Microsoft Docs
description: How to add zoom control, pitch control, rotate control and a style picker to a map in Azure Maps.
author: walsehgal
ms.author: v-musehg
ms.date: 10/08/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Add Map Controls to Azure Maps

This article shows you how to add map controls to a map. You will also learn how to create a map with all controls and a [style picker](https://docs.microsoft.com/azure/azure-maps/choose-map-style).

## Add zoom control

<iframe height='500' scrolling='no' title='Adding a zoom control' src='//codepen.io/azuremaps/embed/WKOQyN/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/WKOQyN/'>Adding a zoom control</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first code block sets the subscription key and creates a Map object without pre-setting the style. See [create a map](./map-create.md) for instructions on how to create a map.

Zoom control adds the ability to zoom in and out of the map. The second code block creates a Zoom Control object using the atlas [ZoomControl](/javascript/api/azure-maps-control/atlas.control.zoomcontrol) and adds it to the map using map's [controls.add](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) method. The Zoom control is within the map **event listener** to ensure it loads after the map loads fully.

## Add pitch control

<iframe height='500' scrolling='no' title='Adding a pitch control' src='//codepen.io/azuremaps/embed/xJrwaP/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/xJrwaP/'>Adding a pitch control</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first code block sets the subscription key and creates a Map object without pre-setting the style. See [create a map](./map-create.md) for instructions on how to create a map.

Pitch control adds the ability to change the pitch of the map. The second block of code creates a Pitch Control object using the atlas [PitchControl](/javascript/api/azure-maps-control/atlas.control.pitchcontrol) and adds it to the map using map's [controls.add](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) method. The Pitch control is within the map **event listener** to ensure it loads after the map loads fully.

## Add compass control

<iframe height='500' scrolling='no' title='Adding a rotate control' src='//codepen.io/azuremaps/embed/GBEoRb/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/GBEoRb/'>Adding a rotate control</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first code block sets the subscription key and creates a Map object without pre-setting the style. See [create a map](./map-create.md) for instructions on how to create a map.

The second block of code creates a Compass Control object using the atlas [Compass Control](/javascript/api/azure-maps-control/atlas.control.compasscontrol). It also adds the compass control to the map using map's [controls.add](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) method. The Compass control is within the map **event listener** to ensure it loads after the map loads fully.

## A Map with all controls

<iframe height='500' scrolling='no' title='A map with all the controls' src='//codepen.io/azuremaps/embed/qyjbOM/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/azuremaps/pen/qyjbOM/'>A map with all the controls</a> by Azure Maps (<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The first code block sets the subscription key and creates a Map object without pre-setting the style. See [create a map](./map-create.md) for instructions on how to create a map.

The second code block creates a Compass Control object using the atlas [CompassControl](/javascript/api/azure-maps-control/atlas.control.compasscontrol) and adds it to the map using map's [controls.add](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) method.

The third block of code creates a Zoom Control object using the atlas [ZoomControl](/javascript/api/azure-maps-control/atlas.control.zoomcontrol) and adds it to the map using map's [controls.add](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) method.

The fourth code block creates a Pitch Control object using the atlas [PitchControl](/javascript/api/azure-maps-control/atlas.control.pitchcontrol) and adds it to the map using map's [controls.add](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) method.

The last block of code creates a Style Picker object by using the atlas [StyleControl](/javascript/api/azure-maps-control/atlas.control.stylecontrol) and adds it to the map using map's [controls.add](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest) method. All of the control objects are added within the map **event listener** to ensure that they load after the map loads fully.

The order of the control objects in the script dictates the order in which they appear on the map. To change the order of the controls on the map, you can change their order in the script.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [Map](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.map?view=azure-iot-typescript-latest)

> [!div class="nextstepaction"]
> [Atlas](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas?view=azure-iot-typescript-latest)

See the following articles for full code:

> [!div class="nextstepaction"]
> [Add a pin](./map-add-pin.md)

> [!div class="nextstepaction"]
> [Add a popup](./map-add-popup.md)
