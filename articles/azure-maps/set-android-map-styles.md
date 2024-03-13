---
title: Set a map style in Android maps
titleSuffix: Microsoft Azure Maps
description: Learn two ways of setting the style of a map. See how to use the Azure Maps Android SDK in either the layout file or the activity class to adjust the style.
author: sinnypan
ms.author: sipa
ms.date: 02/26/2021
ms.topic: conceptual
ms.service: azure-maps
ms.custom: devx-track-extended-java
services: azure-maps
zone_pivot_groups: azure-maps-android
---

# Set map style (Android SDK)

This article shows you two ways to set map styles using the Azure Maps Android SDK. Azure Maps has six different maps styles to choose from. For more information about supported map styles, see [supported map styles in Azure Maps].

## Prerequisites

Be sure to complete the steps in the Quickstart: [Create an Android app].

## Set map style in the layout

You can set a map style in the layout file for your activity class when adding the map control. The following code sets the center location, zoom level, and map style.

```xml
<com.azure.android.maps.control.MapControl
    android:id="@+id/mapcontrol"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    app:azure_maps_centerLat="47.602806"
    app:azure_maps_centerLng="-122.329330"
    app:azure_maps_zoom="12"
    app:azure_maps_style="grayscale_dark"
    />
```

The following screenshot shows the above code displaying a road map with the grayscale dark style.

![Map with grayscale dark road map style](media/set-android-map-styles/android-grayscale-dark.png)

## Set map style in code

The map style can be set in programmatically in code by using the `setStyle` method of the map. The following code sets the center location and zoom level using the maps `setCamera` method and the map style to `SATELLITE_ROAD_LABELS`.

::: zone pivot="programming-language-java-android"

```java
mapControl.onReady(map -> {

    //Set the camera of the map.
    map.setCamera(center(Point.fromLngLat(-122.33, 47.64)), zoom(14));

    //Set the style of the map.
    map.setStyle(style(MapStyle.SATELLITE_ROAD_LABELS));
});
```

::: zone-end

::: zone pivot="programming-language-kotlin"

```kotlin
mapControl!!.onReady { map: AzureMap ->
    //Set the camera of the map.
    map.setCamera(center(Point.fromLngLat(-122.33, 47.64)), zoom(14))

    //Set the style of the map.
    map.setStyle(style(MapStyle.SATELLITE_ROAD_LABELS))
}
```

::: zone-end

The following screenshot shows the above code displaying a map with the satellite road labels style.

![Map with satellite road labels style](media/set-android-map-styles/android-satellite-road-labels.png)

## Setting the map camera

The map camera controls which part of the world is displayed in the map viewport. The camera can be in the layout our programmatically in code. When setting it in code, there are two main methods for setting the position of the map; using center and zoom, or passing in a bounding box. The following code shows how to set all optional camera options when using `center` and `zoom`.

::: zone pivot="programming-language-java-android"

```java
//Set the camera of the map using center and zoom.
map.setCamera(
    center(Point.fromLngLat(-122.33, 47.64)), 

    //The zoom level. Typically a value between 0 and 22.
    zoom(14),

    //The amount of tilt in degrees the map where 0 is looking straight down.
    pitch(45),

    //Direction the top of the map is pointing in degrees. 0 = North, 90 = East, 180 = South, 270 = West
    bearing(90),

    //The minimum zoom level the map will zoom-out to when animating from one location to another on the map.
    minZoom(10),
    
    //The maximum zoom level the map will zoom-in to when animating from one location to another on the map.
    maxZoom(14)
);
```

::: zone-end

::: zone pivot="programming-language-kotlin"

```kotlin
//Set the camera of the map using center and zoom.
map.setCamera(
    center(Point.fromLngLat(-122.33, 47.64)), 

    //The zoom level. Typically a value between 0 and 22.
    zoom(14),

    //The amount of tilt in degrees the map where 0 is looking straight down.
    pitch(45),

    //Direction the top of the map is pointing in degrees. 0 = North, 90 = East, 180 = South, 270 = West
    bearing(90),

    //The minimum zoom level the map will zoom-out to when animating from one location to another on the map.
    minZoom(10),
    
    //The maximum zoom level the map will zoom-in to when animating from one location to another on the map.
    maxZoom(14)
)
```

::: zone-end

Often it's desirable to focus the map over a set of data. A bounding box can be calculated from features using the `MapMath.fromData` method and can be passed into the `bounds` option of the map camera. When setting a map view based on a bounding box, it's often useful to specify a `padding` value to account for the pixel size of points being rendered as bubbles or symbols. The following code shows how to set all optional camera options when using a bounding box to set the position of the camera.

::: zone pivot="programming-language-java-android"

```java
//Set the camera of the map using a bounding box.
map.setCamera(
    //The area to focus the map on.
    bounds(BoundingBox.fromLngLats(
        //West
        -122.4594,

        //South
        47.4333,
        
        //East
        -122.21866,
        
        //North
        47.75758
    )),

    //Amount of pixel buffer around the bounding box to provide extra space around the bounding box.
    padding(20),

    //The maximum zoom level the map will zoom-in to when animating from one location to another on the map.
    maxZoom(14)
);
```

::: zone-end

::: zone pivot="programming-language-kotlin"

```kotlin
//Set the camera of the map using a bounding box.
map.setCamera(
    //The area to focus the map on.
    bounds(BoundingBox.fromLngLats(
        //West
        -122.4594,

        //South
        47.4333,
        
        //East
        -122.21866,
        
        //North
        47.75758
    )),

    //Amount of pixel buffer around the bounding box to provide extra space around the bounding box.
    padding(20),

    //The maximum zoom level the map will zoom-in to when animating from one location to another on the map.
    maxZoom(14)
)
```

::: zone-end

The aspect ratio of a bounding box may not be the same as the aspect ratio of the map, as such the map often show the full bounding box area, but are often only tight vertically or horizontally.

### Animate map view

When setting the camera options of the map, animation options can also be used to create a transition between the current map view and the next. These options specify the type of animation and duration it should take to move the camera.

| Option | Description |
|--------|-------------|
| `animationDuration(Integer durationMs)` | Specifies how long the camera animates between the views in milliseconds (ms). |
| `animationType(AnimationType animationType)` | Specifies the type of animation transition to perform.<br><br> - `JUMP` - an immediate change.<br> - `EASE` - gradual change of the camera's settings.<br> - `FLY` - gradual change of the camera's settings that create an arc resembling flight. |

This code shows how to animate the map view using a `FLY` animation over a duration of three seconds:

::: zone pivot="programming-language-java-android"

``` java
map.setCamera(
    center(Point.fromLngLat(-122.33, 47.6)),
    zoom(12),
    animationType(AnimationType.FLY), 
    animationDuration(3000)
);
```

::: zone-end

::: zone pivot="programming-language-kotlin"

```kotlin
map.setCamera(
    center(Point.fromLngLat(-122.33, 47.6)),
    zoom(12.0),
    AnimationOptions.animationType(AnimationType.FLY),
    AnimationOptions.animationDuration(3000)
)
```

::: zone-end

The above code demonstrates animating the map view from New York to Seattle:

![Map animating the camera from New York to Seattle](media/set-android-map-styles/android-animate-camera.gif)

## Next steps

See the following articles for more code samples to add to your maps:

> [!div class="nextstepaction"]
> [Add a symbol layer]

> [!div class="nextstepaction"]
> [Add a bubble layer]

[Add a bubble layer]: map-add-bubble-layer-android.md
[Add a symbol layer]: how-to-add-symbol-to-android-map.md
[Create an Android app]: quick-android-map.md
[supported map styles in Azure Maps]: supported-map-styles.md
