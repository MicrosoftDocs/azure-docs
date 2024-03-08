---
title: Handle map events in iOS maps
titleSuffix: Microsoft Azure Maps
description: Learn which events are fired when users interact with maps. View a list of all supported map events. See how to use the Azure Maps iOS SDK to handle events.
author: sinnypan
ms.author: sipa
ms.date: 11/18/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Interact with the map in the iOS SDK (Preview)

This article shows you how to use the maps events manager.

## Interact with the map

The map manages all events through its `events` property accepting delegates, which conform to the `AzureMapDelegate` protocol. The following table lists all supported map events represented as methods of the `AzureMapDelegate` protocol.

| Method                 | Description |
|------------------------|-------------|
| `azureMapCameraIsIdle(_ map: AzureMap)` | <p>Fires after the last frame renders, before the map enters an "idle" state:<ul><li>No camera transitions are in progress.</li><li>All currently requested tiles have loaded.</li><li>All fade/transition animations have completed.</li></ul></p> |
| `azureMapCameraIsMoving(_ map: AzureMap)` | Fires repeatedly during an animated transition from one view to another. This can be the result of either user interaction or methods. |
| `azureMapCameraMoveWasCanceled(_ map: AzureMap)` | Fires when canceling a movement request to the camera. |
| `azureMap(_ map: AzureMap, cameraMoveIsStarted reason: CameraChangeReason)` | Fires just before the map begins to transition from one view to another. This can occur programmatically or as a result of user interaction. The `reason` parameter is an option set that provides details of how the camera movement was initiated. The following list outlines the possible reasons:<ul><li>Unknown</li><li>Programmatic</li><li>North Reset</li><li>Pan Gesture</li><li>Pinch Gesture</li><li>Rotate Gesture</li><li>Zoom-In Gesture</li><li>Zoom-Out Gesture</li><li>One-Finger-Zoom Gesture </li><li>Tilt Gesture</li><li>Transition Canceled</li></ul>   |
| `azureMap(_ map: AzureMap, didTapAt location: CLLocationCoordinate2D)` | Fires when the map is pressed and released at the same point on the map. |
| `azureMap(_ map: AzureMap, didTapOn features: [Feature])` | Fires when the map is pressed and released at the same point on a feature. |
| `azureMap(_ map: AzureMap, didAddLayer layer: Layer)` | Fires when a layer is added to the map. |
| `azureMap(_ map: AzureMap, didRemoveLayer layer: Layer)` | Fires when a layer is removed from the map. |
| `azureMapWillLoad(_ map: AzureMap)` | Fires prior to downloading resources required for rendering. |
| `azureMapDidLoad(_ map: AzureMap)` | Fires after resources have downloaded and the first visual rendering of the map completes. |
| `azureMap(_ map: AzureMap, didLongPressAt location: CLLocationCoordinate2D)` | Fires when the map is pressed, held for a moment, and then released at the same point on the map. |
| `azureMap(_ map: AzureMap, didLongPressOn features: [Feature])` | Fires when the map is pressed, held for a moment, and then released at the same point on a feature. |
| `azureMapIsReady(_ map: AzureMap)` | Fires when the following conditions are met:<ul><li>The map initially loads </li><li>The app orientation changes </li><li>The minimum required map resources finish loading </li><li>The map is ready to be programmatically interacted with.</li></ul> |
| `azureMap(_ map: AzureMap, didAddSource source: Source)` | Fires when a `DataSource` or `VectorTileSource` is added to the map. |
| `azureMap(_ map: AzureMap, didRemoveSource source: Source)` | Fires when a `DataSource` or `VectorTileSource` is removed from the map. |
| `azureMapStyleDidChange(_ map: AzureMap)` | Fires when the map's style loads or changes. |

The following code shows how to add the `azureMap(_ map: AzureMap, didTapAt location: CLLocationCoordinate2D)`, `azureMap(_ map: AzureMap, didTapOn features: [Feature])`, and `azureMapCameraIsMoving(_ map: AzureMap)` events to the map.

```swift
class ShowSimpleEventsHandlingViewController: UIViewController, AzureMapDelegate {

    // Other Setup...

    func setupMapControl() {
        mapControl.onReady { map in

            // Add the delegate to the map to respond to events.
            map.events.addDelegate(self)
        }
    }

    func azureMap(_ map: AzureMap, didTapAt location: CLLocationCoordinate2D) {
        // Map clicked.
    }

    func azureMap(_ map: AzureMap, didTapOn features: [Feature]) {
        // Feature clicked.
    }

    func azureMapCameraIsMoving(_ map: AzureMap) {
        // Map camera moved.
    }
}
```

For more information, see the [Navigating the map] article on how to interact with the map and trigger events.

## Scope feature events to layer

When adding a delegate to the map, layer IDs can be passed in as a second parameter. When layers are passed in, the event only fires if it occurs on that layer. Events scoped to layers are supported by the symbol, bubble, line, and polygon layers.

```swift
class ShowScopedEventsHandlingViewController: UIViewController, AzureMapDelegate {
    
    // Other Setup...

    func setupMapControl() {
        mapControl.onReady { map in

            // Create a data source.
            let source = DataSource()
            map.sources.add(source)

            // Add data to the data source.
            source.add(geometry: Point(CLLocationCoordinate2D(latitude: 0, longitude: 0)))

            // Create a layer and add it to the map.
            let layer = BubbleLayer(source: source)
            map.layers.addLayer(layer)

            // Add the delegate to the map to respond to events.
            map.events.addDelegate(self, for: [layer.id])
        }
    }

    func azureMap(_ map: AzureMap, didTapOn features: [Feature]) {
        // One or more features tapped.
    }

    func azureMap(_ map: AzureMap, didLongPressOn features: [Feature]) {
        // One or more features long pressed.
    }
}
```

## Additional information

See the following articles for full code examples:

- [Navigating the map]
- [Add a symbol layer]
- [Add a bubble layer]
- [Add a line layer]
- [Add a polygon layer]

[Navigating the map]: how-to-use-ios-map-control-library.md
[Add a symbol layer]: add-symbol-layer-ios.md
[Add a bubble layer]: add-bubble-layer-map-ios.md
[Add a line layer]: add-line-layer-map-ios.md
[Add a polygon layer]: add-polygon-layer-map-ios.md
