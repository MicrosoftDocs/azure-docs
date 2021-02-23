---
title: Handle map events in Android maps | Microsoft Azure Maps
description: Learn which events are fired when users interact with maps. View a list of all supported map events. See how to use the Azure Maps Android SDK to handle events.
author: rbrundritt
ms.author: richbrun
ms.date: 12/08/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: cpendle
---

# Interact with the map (Android SDK)

This article shows you how to use the maps events manager.

## Interact with the map

The map manages all events through its `events` property. The following table lists all of the supported map events.

| Event                  | Event handler format | Description |
|------------------------|----------------------|-------------|
| `OnCameraIdle`         | `()`                 | <p>Fired after the last frame rendered before the map enters an "idle" state:<ul><li>No camera transitions are in progress.</li><li>All currently requested tiles have loaded.</li><li>All fade/transition animations have completed.</li></ul></p> |
| `OnCameraMove`         | `()`                 | Fired repeatedly during an animated transition from one view to another, as the result of either user interaction or methods. |
| `OnCameraMoveCanceled` | `()`                 | Fired when a movement request to the camera has been canceled. |
| `OnCameraMoveStarted`  | `(int reason)`       | Fired just before the map begins a transition from one view to another, as the result of either user interaction or methods. The `reason` argument of the event listener returns an integer value that provides details of how the camera movement was initiated. The following is the list of possible reasons:<ul><li>1: Gesture</li><li>2: Developer animation</li><li>3: API Animation</li></ul>   |
| `OnClick`              | `(double lat, double lon)` | Fired when the map is pressed and released at the same point on the map. |
| `OnFeatureClick`       | `(List<Feature>)`    | Fired when the map is pressed and released at the same point on a feature.  |
| `OnLongClick`          | `(double lat, double lon)` | Fired when the map is pressed, held for a moment, and then released at the same point on the map. |
| `OnLongFeatureClick `  | `(List<Feature>)`    | Fired when the map is pressed, held for a moment, and then released at the same point on a feature. |
| `OnReady`              | `(AzureMap map)`     | Fired when the map initially is loaded or when the app orientation change and the minimum required map resources are loaded and the map is ready to be programmatically interacted with. |

The following code shows how to add the `OnClick`, `OnFeatureClick`, and `OnCameraMove` events to the map.

```java
map.events.add((OnClick) (lat, lon) -> {
    //Map clicked.
});

map.events.add((OnFeatureClick) (features) -> {
    //Feature clicked.
});

map.events.add((OnCameraMove) () -> {
    //Map camera moved.
});
```

For more information, see the [Navigating the map](how-to-use-android-map-control-library.md#navigating-the-map) documentation on how to interact with the map and trigger events.

## Scope feature events to layer

When adding the `OnFeatureClick` or `OnLongFeatureClick` events to the map, a layer ID can be passed in as a second parameter. When a layer ID is passed in, the event will only fire if the event occurs on that layer. Events scoped to layers is supported by the symbol, bubble, line, and polygon layers.

```java
//Create a data source.
DataSource source = new DataSource();
map.sources.add(source);

//Add data to the data source.
source.add(Point.fromLngLat(0, 0));

//Create a layer and add it to the map.
BubbleLayer layer = new BubbleLayer(source);
map.layers.add(layer);

//Add a feature click event to the map and pass the layer ID to limit the event to the specified layer.
map.events.add((OnFeatureClick) (features) -> {
    //One or more features clicked.
}, layer.getId());

//Add a long feature click event to the map and pass the layer ID to limit the event to the specified layer.
map.events.add((OnLongFeatureClick) (features) -> {
    //One or more features long clicked.
}, layer.getId());
```

## Next steps

See the following articles for full code examples:

> [!div class="nextstepaction"]
> [Navigating the map](how-to-use-android-map-control-library.md#navigating-the-map)

> [!div class="nextstepaction"]
> [Add a symbol layer](how-to-add-symbol-to-android-map.md)

> [!div class="nextstepaction"]
> [Add a bubble layer](map-add-bubble-layer-android.md)

> [!div class="nextstepaction"]
> [Add a line layer](android-map-add-line-layer.md)

> [!div class="nextstepaction"]
> [Add a polygon layer](how-to-add-shapes-to-android-map.md)
