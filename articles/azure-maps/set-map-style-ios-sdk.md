---
title: Set a map style in iOS maps | Microsoft Azure Maps
description: Learn two ways of setting the style of a map. See how to use the Azure Maps iOS SDK in either the layout file or the activity class to adjust the style.
author: sinnypan
ms.author: sipa
ms.date: 07/22/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Set map style in the iOS SDK (Preview)

This article shows you two ways to set map styles using the Azure Maps iOS SDK. Azure Maps has six different maps styles to choose from. For more information about supported map styles, see [supported map styles in Azure Maps].

## Prerequisites

- Complete the [Create an iOS app] quickstart.
- An [Azure Maps account].

## Set map style in the map control init

You can set a map style in the map control init. The following code sets the center location, zoom level, and map style.

```swift
MapControl(options: [
    CameraOption.center(lat: 47.602806, lng: -122.329330),
    CameraOption.zoom(12),
    StyleOption.style(.grayscaleDark)
])
```

The following screenshot shows the above code displaying a road map with the grayscale dark style.

:::image type="content" source="./media/ios-sdk/set-map-style-ios/ios-grayscale-dark.png" alt-text="Screenshot of a map with the grayscale dark road map style.":::

## Set map style via `setStyleOptions` method

The map style can be set in programmatically in code by using the `setStyleOptions` method of the map. The following code sets the center location and zoom level using the maps `setCameraOptions` method and the map style to `.satelliteRoadLabels`.

```swift
mapControl.onReady { map in

    //Set the camera of the map.
    map.setCameraOptions([
        .center(lat: 47.64, lng: -122.33),
        .zoom(14)
    ])

    //Set the style of the map.
    map.setStyleOptions([.style(.satelliteRoadLabels)])
}
```

The following screenshot shows the above code displaying a map with the satellite road labels style.

:::image type="content" source="./media/ios-sdk/set-map-style-ios/ios-satellite-road-labels.png" alt-text="Screenshot of a map with the satellite road labels style.":::

## Set the map camera

The map camera controls which part of the world is displayed in the map viewport. There are two main methods for setting the position of the map; using center and zoom, or passing in a bounding box. The following code shows how to set all optional camera options when using `center` and `zoom`.

```swift
//Set the camera of the map using center and zoom.
map.setCameraOptions([
    .center(lat: 47.64, lng: -122.33),
    .zoom(14),
    .pitch(45),
    .bearing(90),
    .minZoom(10),
    .maxZoom(14)
])
```

Often it's desirable to focus the map over a set of data. A bounding box can be calculated from features using the `BoundingBox.fromData(_:)` method and can be passed into the `bounds` option of the map camera. When setting a map view based on a bounding box, it's often useful to specify a `padding` value to account for the point size of data points being rendered as bubbles or symbols. The following code shows how to set all optional camera options when using a bounding box to set the position of the camera.

```swift
//Set the camera of the map using a bounding box.
map.setCameraBoundsOptions([
    .bounds(
        BoundingBox(
            sw: CLLocationCoordinate2D(latitude: 47.4333, longitude: -122.4594),
            ne: CLLocationCoordinate2D(latitude: 47.75758, longitude: -122.21866)
        )
    ),
    .padding(20),
    .maxZoom(14)
])
```

The aspect ratio of a bounding box may not be the same as the aspect ratio of the map, as such the map often shows the full bounding box area, and are often only tight vertically or horizontally.

### Animate map view

When setting the camera options of the map, animation options can also be used to create a transition between the current map view and the next. These options specify the type of animation and duration it should take to move the camera.

| Option | Description |
|--------|-------------|
| `animationDuration(_ duration: Double)` | Specifies how long the camera animates between the views in milliseconds (ms). |
| `animationType(_ animationType: AnimationType)` | Specifies the type of animation transition to perform.<br><br> - `.jump` - an immediate change.<br> - `.ease` - gradual change of the camera's settings.<br> - `.fly` - gradual change of the camera's settings following an arc resembling flight. |

The following code shows how to animate the map view using a `.fly` animation over a duration of three seconds.

```swift
map.setCameraOptions([
    .animationType(.fly),
    .animationDuration(3000)
    .center(lat: 47.6, lng: -122.33),
    .zoom(12),
])
```

The following animation demonstrates the above code animating the map view from New York to Seattle.

:::image type="content" source="./media/ios-sdk/set-map-style-ios/ios-animate-camera.gif" alt-text="Map animating the camera from New York to Seattle.":::

## Additional information

See the following articles for more code samples to add to your maps:

- [Add a symbol layer]
- [Add a bubble layer]

[Add a bubble layer]: add-bubble-layer-map-ios.md
[Add a symbol layer]: add-symbol-layer-ios.md
[Azure Maps account]: https://azure.microsoft.com/services/azure-maps
[Create an iOS app]: quick-ios-app.md
[supported map styles in Azure Maps]: supported-map-styles.md
