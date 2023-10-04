---
title: Handle map events
titleSuffix: Microsoft Azure Maps
description: Learn which events are fired when users interact with maps. View a list of all supported map events. See how to use the Azure Maps Web SDK to handle events.
author: sinnypan
ms.author: sipa
ms.date: 06/12/2023
ms.topic: how-to
ms.service: azure-maps
---

# Handle map events

This article shows you how to use [map events class]. The property highlight events on the map and on different layers of the map. You can also highlight events when you interact with an HTML marker.

## Interact with the map

The [Map Events] sample highlights the name of the events that are firing as you interact with the map. For the source code for this sample, see [Map Events source code].

:::image type="content" source="./media/map-events/map-events.png"alt-text="A screenshot showing a map with a list of map events that are highlighted anytime your actions on the map trigger that event.":::

<!-----------------------------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/bLZEWd/?height=600&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
----------------------------------------------------------------------->

## Interact with map layers

The [Layer Events] sample highlights the name of the events that are firing as you interact with the Symbol Layer. The symbol, bubble, line, and polygon layer all support the same set of events. The heat map and tile layers don't support any of these events. For the source code for this sample, see [Layer Events source code].

:::image type="content" source="./media/map-events/layer-events.png"alt-text="A screenshot showing a map with a list of layer events that are highlighted anytime you interact with the Symbol Layer.":::

<!-----------------------------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/bQRRPE/?height=600&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
----------------------------------------------------------------------->

## Interact with HTML Marker

The [HTML marker layer events] sample highlights the name of the events that are firing as you interact with the HTML marker layer. For the source code for this sample, see [HTML marker layer Events source code].

:::image type="content" source="./media/map-events/html-marker-layer-events.png"alt-text="A screenshot showing a map with a list of HTML marker layer events that are highlighted anytime your actions on the map trigger that event.":::

<!-----------------------------------------------------------------------
> [!VIDEO //codepen.io/azuremaps/embed/VVzKJY/?height=500&theme-id=0&default-tab=js,result&embed-version=2&editable=true]
----------------------------------------------------------------------->

The following table lists all supported map class events.

| Event               | Description |
|---------------------|-------------|
| `boxzoomend`        | Fired when a "box zoom" interaction ends.|
| `boxzoomstart`      | Fired when a "box zoom" interaction starts.|
| `click`             | Fired when a pointing device is pressed and released at the same point on the map.|
| `close`             | Fired when the popup is closed manually or programmatically.|
| `contextmenu`       | Fired when the right button of the mouse is clicked.|
| `data`              | Fired when any map data loads or changes. |
| `dataadded`         | Fired when shapes are added to the `DataSource`.|
| `dataremoved`       | Fired when shapes are removed from the `DataSource`.|
| `datasourceupdated` | Fired when the `DataSource` object is updated.|
| `dblclick`          | Fired when a pointing device is clicked twice at the same point on the map.|
| `drag`              | Fired repeatedly during a "drag to pan" interaction on the map, popup, or HTML marker.|
| `dragend`           | Fired when a "drag to pan" interaction ends on the map, popup, or HTML marker.|
| `dragstart`         | Fired when a "drag to pan" interaction starts on the map, popup, or HTML marker.|
| `error`             | Fired when an error occurs.|
| `idle`              | <p>Fired after the last frame rendered before the map enters an "idle" state:<ul><li>No camera transitions are in progress.</li><li>All currently requested tiles have loaded.</li><li>All fade/transition animations have completed.</li></ul></p>|
| `keydown`           | Fired when a key is pressed down.|
| `keypress`          | Fired when a key that produces a typeable character (an ANSI key) is pressed.|
| `keyup`             | Fired when a key is released.|
| `layeradded`        | Fired when a layer is added to the map.|
| `layerremoved`      | Fired when a layer is removed from the map.|
| `load`              | Fired immediately after all necessary resources have been downloaded and the first visually complete rendering of the map has occurred.|
| `mousedown`         | Fired when a pointing device is pressed within the map or when on top of an element.|
| `mouseenter`        | Fired when a pointing device is initially moved over the map or an element. |
| `mouseleave`        | Fired when a pointing device is moved out the map or an element. |
| `mousemove`         | Fired when a pointing device is moved within the map or an element.|
| `mouseout`          | Fired when a point device leaves the map's canvas our leaves an element.|
| `mouseover`         | Fired when a pointing device is moved over the map or an element.|
| `mouseup`           | Fired when a pointing device is released within the map or when on top of an element.|
| `move`              | Fired repeatedly during an animated transition from one view to another, as the result of either user interaction or methods.|
| `moveend`           | Fired just after the map completes a transition from one view to another, as the result of either user interaction or methods.|
| `movestart`         | Fired just before the map begins a transition from one view to another, as the result of either user interaction or methods.|
| `open`              | Fired when the popup is opened manually or programmatically.|
| `pitch`             | Fired whenever the map's pitch (tilt) changes as the result of either user interaction or methods.|
| `pitchend`          | Fired immediately after the map's pitch (tilt) finishes changing as the result of either user interaction or methods.|
| `pitchstart`        | Fired whenever the map's pitch (tilt) begins a change as the result of either user interaction or methods.|
| `ready`             | Fired when the minimum required map resources are loaded before the map is ready to be programmatically interacted with.|
| `render`            | <p>Fired whenever the map is drawn to the screen, as the result of:<ul><li>A change to the map's position, zoom, pitch, or bearing.</li><li>A change to the map's style.</li><li>A change to a `DataSource` source.</li><li>The loading of a vector tile, GeoJSON file, glyph, or sprite.</li></ul></p>|
| `resize`            | Fired immediately after the map has been resized.|
| `rotate`            | Fired repeatedly during a "drag to rotate" interaction.|
| `rotateend`         | Fired when a "drag to rotate" interaction ends.|
| `rotatestart`       | Fired when a "drag to rotate" interaction starts.|
| `shapechanged`      | Fired when a shape object property is changed.|
| `sourcedata`        | Fired when one of the map's sources loads or changes, including if a tile belonging to a source loads or changes. |
| `sourceadded`       | Fired when a `DataSource` or `VectorTileSource` is added to the map.|
| `sourceremoved`     | Fired when a `DataSource` or `VectorTileSource` is removed from the map.|
| `styledata`         | Fired when the map's style loads or changes.|
| `styleimagemissing` | Fired when a layer tries to load an image from the image sprite that doesn't exist |
| `tokenacquired`     | Fired when an Azure Active Directory access token is obtained.|
| `touchcancel`       | Fired when a `touchcancel` event occurs within the map.|
| `touchend`          | Fired when a `touchend` event occurs within the map.|
| `touchmove`         | Fired when a `touchmove` event occurs within the map.|
| `touchstart`        | Fired when a `touchstart` event occurs within the map.|
| `wheel`             | Fired when a mouse wheel event occurs within the map.|
| `zoom`              | Fired repeatedly during an animated transition from one zoom level to another, as the result of either user interaction or methods.|
| `zoomend`           | Fired just after the map completes a transition from one zoom level to another, as the result of either user interaction or methods.|
| `zoomstart`         | Fired just before the map begins a transition from one zoom level to another, as the result of either user interaction or methods.|

## Next steps

See the following articles for full code examples:

> [!div class="nextstepaction"]
> [Using the Azure Maps Services module]

> [!div class="nextstepaction"]
> [Code samples]

[map events class]: /javascript/api/azure-maps-control/atlas.map#events
[Map Events]: https://samples.azuremaps.com/map/map-events
[Layer Events]: https://samples.azuremaps.com/symbol-layer/symbol-layer-events
[HTML marker layer events]: https://samples.azuremaps.com/html-markers/html-marker-layer-events

[Map Events source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Map/Map%20Events/Map%20Events.html
[Layer Events source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/Symbol%20Layer/Symbol%20layer%20events/Symbol%20layer%20events.html
[HTML marker layer events source code]: https://github.com/Azure-Samples/AzureMapsCodeSamples/blob/main/Samples/HTML%20Markers/HTML%20marker%20layer%20events/HTML%20marker%20layer%20events.html
[Using the Azure Maps Services module]: how-to-use-services-module.md
[Code samples]: /samples/browse/?products=azure-maps
