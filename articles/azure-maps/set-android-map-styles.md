---
title: Set a map style using Azure Maps Android SDK
description: Learn two ways of setting the style of a map. See how to use the Microsoft Azure Maps Android SDK in either the layout file or the activity class to adjust the style.
author: anastasia-ms
ms.author: v-stharr
ms.date: 11/18/2020
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Set map style using Azure Maps Android SDK

This article shows you how to set map styles using the Azure Maps Android SDK. Azure Maps has six different maps styles to choose from. For more information about supported map styles, see [supported map styles in Azure Maps](./supported-map-styles.md).

## Prerequisites

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account)
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.
3. Download and install the [Azure Maps Android SDK](./how-to-use-android-map-control-library.md).


## Set map style in the layout

You can set a map style in the layout file for your activity class. Edit `res > layout > activity_main.xml`, so it looks like the one below:

```XML
<FrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    >

    <com.microsoft.azure.maps.mapcontrol.MapControl
        android:id="@+id/mapcontrol"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:mapcontrol_centerLat="47.602806"
        app:mapcontrol_centerLng="-122.329330"
        app:mapcontrol_zoom="12"
        app:mapcontrol_style="grayscale_dark"
        />

</FrameLayout>
```

The `mapcontrol_style` attribute above sets the map style to **grayscale_dark**.

:::image type="content" source="./media/set-android-map-styles/grayscale-dark.png" border="true" alt-text="Azure Maps, map image  showing style as grayscale_dark":::

## Set map style in the MainActivity class

The map style can also be set in the MainActivity class. Open the `java > com.example.myapplication > MainActivity.java` file, and copy the following code snippet into the **onCreate()** method. This code sets the map style to **satellite_road_labels**.

>[!WARNING]
>Android Studio may not have imported the required classes.  As a result, the code will have some unresolvable references. To import the required classes, simply hover over each unresolved reference and press`Alt + Enter` (Option + Return on a Mac).

```Java
mapControl.onReady(map -> {

    //Set the camera of the map.
    map.setCamera(center(47.64, -122.33), zoom(14));

    //Set the style of the map.
    map.setStyle((style(SATELLITE_ROAD_LABELS)));
       
});
```

:::image type="content" source="./media/set-android-map-styles/satellite-road-labels.png" border="true" alt-text="Azure Maps, map image  showing style as satellite_road_labels":::