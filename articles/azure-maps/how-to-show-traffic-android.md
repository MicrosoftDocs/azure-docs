---
title: Show traffic on a map | Microsoft Azure Maps
description: In this article you will learn, how to display traffic data on a map using the Microsoft Azure Maps Android SDK.
author: farah-alyasari
ms.author: v-faalya
ms.date: 02/27/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---


# Show traffic on the map using Azure Maps Android SDK


## Prerequisites

To complete the process in this article, you need to [install Azure Maps Android SDK to load a map](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-use-android-map-control-library).

## Show traffic on the map

This sample shows how to display traffic on the map.

1. Edit res > layout > activity_main.xml so it looks like the one below:

```xml
<?xml version="1.0" encoding="utf-8"?>
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
        app:mapcontrol_centerLat="40.75"
        app:mapcontrol_centerLng="-99.47"
        app:mapcontrol_zoom="3"
        />

</FrameLayout>
```

2. Copy the following code snipped below into the **onCreate** method of your `MainActivity.java` class.

```java

```