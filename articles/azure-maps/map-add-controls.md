---
title: Add controls to a map | Microsoft Azure Maps
description: How to add zoom control, pitch control, rotate control and a style picker to a map in Microsoft Azure Maps.
author: sinnypan
ms.author: sipa
ms.date: 05/15/2023
ms.topic: conceptual
ms.service: azure-maps
ms.custom:
---

# Add controls to a map

This article shows you how to add controls to a map, including how to create a map with all controls and a [style picker].

## Add zoom control

A zoom control adds buttons for zooming the map in and out. The following code sample creates an instance of the [ZoomControl] class, and adds it the bottom-right corner of the map.

```javascript
//Construct a zoom control and add it to the map.
map.controls.add(new atlas.control.ZoomControl(), {
    position: 'bottom-right'
});
```

<!----------------------------------------------------------
<br/>
> [!VIDEO //codepen.io/azuremaps/embed/WKOQyN/?height=265&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
---------------------------------------------------------->

## Add pitch control

A pitch control adds buttons for tilting the pitch to map relative to the horizon. The following code sample creates an instance of the [PitchControl] class. It adds the PitchControl to top-right corner of the map.

```javascript
//Construct a pitch control and add it to the map.
map.controls.add(new atlas.control.PitchControl(), {
    position: 'top-right'
});
```

<!----------------------------------------------------------
<br/>
> [!VIDEO //codepen.io/azuremaps/embed/xJrwaP/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
---------------------------------------------------------->

## Add compass control

A compass control adds a button for rotating the map. The following code sample creates an instance of the [CompassControl] class and adds it the bottom-left corner of the map.

```javascript
//Construct a compass control and add it to the map.
map.controls.add(new atlas.control.CompassControl(), {
    position: 'bottom-left'
});
```

<!----------------------------------------------------------
<br/>
> [!VIDEO //codepen.io/azuremaps/embed/GBEoRb/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
---------------------------------------------------------->

## A Map with all controls

Multiple controls can be put into an array and added to the map all at once and positioned in the same area of the map to simplify development. The following code snippet adds the standard navigation controls to the map using this approach.

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

The following image shows a map with the zoom, compass, pitch, and style picker controls in the top-right corner of the map. Notice how they automatically stack. The order of the control objects in the script dictates the order in which they appear on the map. To change the order of the controls on the map, you can change their order in the array.

:::image type="content" source="./media/map-add-controls/map-with-all-controls.png" alt-text="Screenshot showing a map displaying zoom, compass, pitch and style controls.":::

<!----------------------------------------------------------
<br/>
> [!VIDEO //codepen.io/azuremaps/embed/qyjbOM/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
---------------------------------------------------------->

The style picker control is defined by the [StyleControl] class. For more information on using the style picker control, see [choose a map style].

## Customize controls

The [Navigation Control Options] sample is a tool to test out the various options for customizing the controls. For the source code for this sample, see [Navigation Control Options source code].

:::image type="content" source="./media/map-add-controls/map-navigation-control-options.png" alt-text="Screenshot showing the Map Navigation Control Options sample, which contains a map displaying zoom, compass, pitch and style controls and options on the left side of the screen that enable you to change the Control Position, Control Style, Zoom Delta, Pitch Delta, Compass Rotation Delta, Picker Styles, and Style Picker Layout properties.":::

<!----------------------------------------------------------
<br/>
> [!VIDEO //codepen.io/azuremaps/embed/LwBZMx/?height=700&theme-id=0&default-tab=result]
---------------------------------------------------------->

If you want to create customized navigation controls, create a class that extends from the `atlas.Control` class or create an HTML element and position it above the map div. Have this UI control call the maps `setCamera` function to move the map.

## Next steps

Learn more about the classes and methods used in this article:

> [!div class="nextstepaction"]
> [CompassControl]

> [!div class="nextstepaction"]
> [PitchControl]

> [!div class="nextstepaction"]
> [StyleControl]

> [!div class="nextstepaction"]
> [ZoomControl]

See the following articles for full code:

> [!div class="nextstepaction"]
> [Add a pin]

> [!div class="nextstepaction"]
> [Add a popup]

> [!div class="nextstepaction"]
> [Add a line layer]

> [!div class="nextstepaction"]
> [Add a polygon layer]

> [!div class="nextstepaction"]
> [Add a bubble layer]

[style picker]: choose-map-style.md
[ZoomControl]: /javascript/api/azure-maps-control/atlas.control.zoomcontrol
[PitchControl]: /javascript/api/azure-maps-control/atlas.control.pitchcontrol
[CompassControl]: /javascript/api/azure-maps-control/atlas.control.compasscontrol
[StyleControl]: /javascript/api/azure-maps-control/atlas.control.stylecontrol
[Navigation Control Options]: https://samples.azuremaps.com/controls/map-navigation-control-options
[Navigation Control Options source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Controls/Map%20Navigation%20Control%20Options/Map%20Navigation%20Control%20Options.html
[choose a map style]: choose-map-style.md
[Add a pin]: map-add-pin.md
[Add a popup]: map-add-popup.md
[Add a line layer]: map-add-line-layer.md
[Add a polygon layer]: map-add-shape.md
[Add a bubble layer]: map-add-bubble-layer.md
