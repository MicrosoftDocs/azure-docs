---
title: Add controls to an iOS map
titleSuffix: Microsoft Azure Maps
description: How to add zoom control, pitch control, rotate control and a style picker to a map in Microsoft Azure Maps iOS SDK.
author: sinnypan
ms.author: sipa
ms.date: 11/19/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Add controls to a map in the iOS SDK (Preview)

This article shows you how to add UI controls to the map.

## Add zoom control

A zoom control adds buttons for zooming the map in and out. The following code sample creates an instance of the `ZoomControl` class and adds it to a map.

```swift
// Construct a zoom control and add it to the map.
map.controls.add(ZoomControl())
```

This screenshot shows a zoom control loaded on a map.

:::image type="content" source="./media/ios-sdk/add-controls-to-map-ios/zoom.png" alt-text="Screenshot showing the zoom control on a map." lightbox="./media/ios-sdk/add-controls-to-map-ios/zoom.png":::

## Add pitch control

A pitch control adds buttons for tilting the pitch to map relative to the horizon. The following code sample creates an instance of the `PitchControl` class and adds it to a map.

```swift
// Construct a pitch control and add it to the map.
map.controls.add(PitchControl())
```

This screenshot shows a pitch control loaded on a map.

:::image type="content" source="./media/ios-sdk/add-controls-to-map-ios/pitch.png" alt-text="Screenshot showing the pitch control on a map." lightbox="./media/ios-sdk/add-controls-to-map-ios/pitch.png":::

## Add rotation control

A rotation control adds a button for rotating the map. The following code sample creates an instance of the `RotationControl` class and adds it to a map.

```swift
// Construct a rotation control and add it to the map.
map.controls.add(RotationControl())
```

This screenshot shows a rotation control loaded on a map.

:::image type="content" source="./media/ios-sdk/add-controls-to-map-ios/rotation.png" alt-text="Screenshot showing the rotation control on a map." lightbox="./media/ios-sdk/add-controls-to-map-ios/rotation.png":::

## Add traffic control

A traffic control adds a button for toggling the visibility of traffic data on the map. The following code sample creates an instance of the `TrafficControl` class and adds it to a map.

```swift
// Construct a traffic control and add it to the map.
map.controls.add(TrafficControl())
```

This screenshot shows a traffic control loaded on a map.

:::image type="content" source="./media/ios-sdk/add-controls-to-map-ios/traffic.png" alt-text="Screenshot showing the traffic control on a map." lightbox="./media/ios-sdk/add-controls-to-map-ios/traffic.png":::

## A map with all controls

Multiple controls can be added to an array and the map then positioned in the same area of the map to simplify development. The following code adds the standard navigation controls to the map using this approach.

```swift
map.controls.add([
    ZoomControl(),
    RotationControl(),
    PitchControl(),
    TrafficControl()
])
```

This screenshot shows all controls loaded on a map, appearing in the order they were added.

:::image type="content" source="./media/ios-sdk/add-controls-to-map-ios/all.png" alt-text="Screenshot showing a map with all controls added to it." lightbox="./media/ios-sdk/add-controls-to-map-ios/all.png":::

## Additional information

The following articles show how to add other available layers to your maps:

- [Add a symbol layer](add-symbol-layer-ios.md)
- [Add a bubble layer](add-bubble-layer-map-ios.md)
- [Add a line layer](add-line-layer-map-ios.md)
- [Add a polygon layer](add-polygon-layer-map-ios.md)
