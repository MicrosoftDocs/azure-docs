---
title: Handle map events in Android maps | Microsoft Azure Maps
description: Learn which events are fired when users interact with maps. View a list of all supported map events. See how to use the Azure Maps Android SDK to handle events.
author: sinnypan
ms.author: sipa
ms.date: 2/26/2021
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
zone_pivot_groups: azure-maps-android
---

# Interact with the map (Android SDK)

This article shows you how to use the maps events manager.

## Interact with the map

The map manages all events through its `events` property. The following table lists the supported map events.

| Event                  | Event handler format | Description |
|------------------------|----------------------|-------------|
| `OnCameraIdle`         | `()`                 | <p>Fires after the last frame rendered before the map enters an "idle" state:<ul><li>No camera transitions are in progress.</li><li>All currently requested tiles have loaded.</li><li>All fade/transition animations have completed.</li></ul></p> |
| `OnCameraMove`         | `()`                 | Fires repeatedly during an animated transition from one view to another, as the result of either user interaction or methods. |
| `OnCameraMoveCanceled` | `()`                 | Fires when a movement request to the camera has been canceled. |
| `OnCameraMoveStarted`  | `(int reason)`       | Fires just before the map begins a transition from one view to another, as the result of either user interaction or methods. The `reason` argument of the event listener returns an integer value that provides details of how the camera movement was initiated. The following list outlines the possible reasons:<ul><li>1: Gesture</li><li>2: Developer animation</li><li>3: API Animation</li></ul>   |
| `OnClick`              | `(double lat, double lon): boolean` | Fires when the map is pressed and released at the same point on the map. This event handler returns a boolean value indicating if the event should be consumed or passed further to other event listeners. |
| `OnFeatureClick`       | `(List<Feature>): boolean`    | Fires when the map is pressed and released at the same point on a feature. This event handler returns a boolean value indicating if the event should be consumed or passed further to other event listeners. |
| `OnLayerAdded` | `(Layer layer)` | Fires when a layer is added to the map. |
| `OnLayerRemoved` | `(Layer layer)` | Fires when a layer is removed from the map. |
| `OnLoaded` | `()` | Fires immediately after all necessary resources have been downloaded and the first visually complete rendering of the map has occurred. |
| `OnLongClick`          | `(double lat, double lon): boolean` | Fires when the map is pressed, held for a moment, and then released at the same point on the map. This event handler returns a boolean value indicating if the event should be consumed or passed further to other event listeners. |
| `OnLongFeatureClick `  | `(List<Feature>): boolean`    | Fires when the map is pressed, held for a moment, and then released at the same point on a feature. This event handler returns a boolean value indicating if the event should be consumed or passed further to other event listeners. |
| `OnReady`              | `(AzureMap map)`     | Fires when the map initially loads, the orientation changes, the minimum required map resources load and the map is ready to be interacted with programmatically. |
| `OnSourceAdded` | `(Source source)` | Fires when a `DataSource` or `VectorTileSource` is added to the map. |
| `OnSourceRemoved` | `(Source source)` | Fires when a `DataSource` or `VectorTileSource` is removed from the map. |
| `OnStyleChange` | `()` | Fires when the map's style loads or changes. |

The following code shows how to add the `OnClick`, `OnFeatureClick`, and `OnCameraMove` events to the map.

::: zone pivot="programming-language-java-android"

```java
map.events.add((OnClick) (lat, lon) -> {
    //Map clicked.

    //Return true indicating if event should be consumed and not passed further to other listeners registered afterwards, false otherwise.
    return true;
});

map.events.add((OnFeatureClick) (features) -> {
    //Feature clicked.

    //Return true indicating if event should be consumed and not passed further to other listeners registered afterwards, false otherwise.
    return true;
});

map.events.add((OnCameraMove) () -> {
    //Map camera moved.
});
```

::: zone-end

::: zone pivot="programming-language-kotlin"

```kotlin
map.events.add(OnClick { lat: Double, lon: Double -> 
    //Map clicked.

    //Return true indicating if event should be consumed and not passed further to other listeners registered afterwards, false otherwise.
    return false
})

map.events.add(OnFeatureClick { features: List<Feature?>? -> 
    //Feature clicked.

    //Return true indicating if event should be consumed and not passed further to other listeners registered afterwards, false otherwise.
    return false
})

map.events.add(OnCameraMove {
    //Map camera moved.
})
```

::: zone-end

For more information, see the [Navigating the map](how-to-use-android-map-control-library.md#navigating-the-map) documentation on how to interact with the map and trigger events.

## Scope feature events to layer

When the `OnFeatureClick` or `OnLongFeatureClick` events are added to the map, a layer instance or layer ID can be passed in as a second parameter. When a layer is passed in, an event fires if it occurs on that layer. Events scoped to layers are supported by the symbol, bubble, line, and polygon layers.

::: zone pivot="programming-language-java-android"

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

    //Return true indicating if event should be consumed and not passed further to other listeners registered afterwards, false otherwise.
    return true;
}, layer);

//Add a long feature click event to the map and pass the layer ID to limit the event to the specified layer.
map.events.add((OnLongFeatureClick) (features) -> {
    //One or more features long clicked.

    //Return true indicating if event should be consumed and not passed further to other listeners registered afterwards, false otherwise.
    return true;
}, layer);
```

::: zone-end

::: zone pivot="programming-language-kotlin"

```kotlin
//Create a data source.
val source = DataSource()
map.sources.add(source)

//Add data to the data source.
source.add(Point.fromLngLat(0, 0))

//Create a layer and add it to the map.
val layer = BubbleLayer(source)
map.layers.add(layer)

//Add a feature click event to the map and pass the layer ID to limit the event to the specified layer.
map.events.add(
    OnFeatureClick { features: List<Feature?>? -> 
        //One or more features clicked.

        //Return true indicating if event should be consumed and not passed further to other listeners registered afterwards, false otherwise.
        return false
    },
    layer
)

//Add a long feature click event to the map and pass the layer ID to limit the event to the specified layer.
map.events.add(
    OnLongFeatureClick { features: List<Feature?>? -> 
         //One or more features long clicked.

        //Return true indicating if event should be consumed and not passed further to other listeners registered afterwards, false otherwise.
        return false
    },
    layer
)
```

::: zone-end

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
