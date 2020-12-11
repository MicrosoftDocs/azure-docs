---
title: Add a shape to a map using Azure Maps Android SDK
description: Learn how to add shapes to maps. See code samples that use the Microsoft Azure Maps Android SDK to add a line and a polygon to a map.
author: anastasia-ms
ms.author: v-stharr
ms.date: 11/18/2020
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Add a shape to a map using Azure Maps Android SDK

This article shows you how to render shapes on a map using Azure Maps Android SDK.

## Prerequisites

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account)
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.
3. Download and install the [Azure Maps Android SDK](./how-to-use-android-map-control-library.md).

## Add a line to the map

Follow the steps below to use the **Line Layer** to add a line on the map.

1. Edit `res > layout > activity_main.xml` to look like the code below:

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
            app:mapcontrol_centerLat="40.743270"
            app:mapcontrol_centerLng="-74.004420"
            app:mapcontrol_zoom="12"
            />
    </FrameLayout>
    ```

2. Copy the code snippet below into the **onCreate()** method of your `MainActivity.java` class.

    >[!WARNING]
    >Android Studio may not have imported the required classes.  As a result, the code will have some unresolvable references. To import the required classes, simply hover over each unresolved reference and press`Alt + Enter` (Option + Return on a Mac).

    ```Java
    mapControl.onReady(map -> {

        //Create a data source and add it to the map.
        DataSource dataSource = new DataSource();
        map.sources.add(dataSource);

        //Create a list of points.
        List<Point> points = Arrays.asList(
            Point.fromLngLat(-73.972340, 40.743270),
            Point.fromLngLat(-74.004420, 40.756800));
    
        //Create a LineString feature and add it to the data source.
        dataSource.add(LineString.fromLngLats(points));
    
        //Create a line layer and add it to the map.
        map.layers.add(new LineLayer(dataSource,
            strokeColor("blue"),
            strokeWidth(5f)));
    });

    ```
    The code snippet above first obtains an Azure Maps map control instance in the **onReady()** callback method. It then creates a data source object using the **DataSource** class and adds it to the map. Then, it creates a list of **Point** objects. A **LineString** is created from the list of points and added to the data source. A **Line Layer** renders line objects wrapped in a data source on the map. A line layer is then created and the data source is added to it.
    
    After adding the code snippet above, your `MainActivity.java` should look like the one below:

    ```Java
    package com.example.myapplication;

    import android.app.Activity;
    import android.os.Bundle;
    import com.mapbox.geojson.LineString;
    import com.mapbox.geojson.Point;
    import android.support.v7.app.AppCompatActivity;
    import com.microsoft.azure.maps.mapcontrol.layer.LineLayer;
    import com.microsoft.azure.maps.mapcontrol.options.LineLayerOptions;
    import com.microsoft.azure.maps.mapcontrol.source.DataSource;
    import java.util.Arrays;
    import java.util.List;
    import com.microsoft.azure.maps.mapcontrol.AzureMaps;
    import com.microsoft.azure.maps.mapcontrol.MapControl;
    import static com.microsoft.azure.maps.mapcontrol.options.LineLayerOptions.strokeColor;
    import static com.microsoft.azure.maps.mapcontrol.options.LineLayerOptions.strokeWidth;
        
    public class MainActivity extends AppCompatActivity {
    
        static{
            AzureMaps.setSubscriptionKey("<Your Azure Maps subscription key>");
        }
    
        MapControl mapControl;
        @Override
        protected void onCreate(Bundle savedInstanceState) {
    
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
    
            mapControl = findViewById(R.id.mapcontrol);
    
            mapControl.onCreate(savedInstanceState);
    
            mapControl.onReady(map -> {

                //Create a data source and add it to the map.
                DataSource dataSource = new DataSource();
                map.sources.add(dataSource);
            
                //Create a list of points.
                List<Point> points = Arrays.asList(
                    Point.fromLngLat(-73.972340, 40.743270),
                    Point.fromLngLat(-74.004420, 40.756800));
            
                //Create a LineString feature and add it to the data source.
                dataSource.add(LineString.fromLngLats(points));
            
                //Create a line layer and add it to the map.
                map.layers.add(new LineLayer(dataSource,
                    strokeColor("blue"),
                    strokeWidth(5f)));
            });    
        }
    
        @Override
        public void onResume() {
            super.onResume();
            mapControl.onResume();
        }
    
        @Override
        public void onPause() {
            super.onPause();
            mapControl.onPause();
        }
    
        @Override
        public void onStop() {
            super.onStop();
            mapControl.onStop();
        }
    
        @Override
        public void onLowMemory() {
            super.onLowMemory();
            mapControl.onLowMemory();
        }
    
        @Override
        protected void onDestroy() {
            super.onDestroy();
            mapControl.onDestroy();
        }
    
        @Override
        protected void onSaveInstanceState(Bundle outState) {
            super.onSaveInstanceState(outState);
            mapControl.onSaveInstanceState(outState);
        }    
    }
    ```

When you run the application, you should see a line on the map as seen below:

![A line rendered on an Android map](./media/how-to-add-shapes-to-android-map/android-map-line.png)</


## Add a polygon to the map

The **Polygon Layer** enables you to render the area of the polygon to the map. Follow the steps below to add a polygon on the map.

1. Edit **res > layout > activity_main.xml** so it looks like the one below:

    ```XML
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
            app:mapcontrol_centerLat="40.78"
            app:mapcontrol_centerLng="-73.97"
            app:mapcontrol_zoom="12"
            />
    
    </FrameLayout>
    ```

2. Copy the following code snippet into the **onCreate()** method of your `MainActivity.java` class.

    ```Java
    mapControl.onReady(map -> {
        //Create a data source and add it to the map.
        DataSource dataSource = new DataSource();
        map.sources.add(dataSource);
    
        //Create a list of point arrays to create polygon rings.
        List<List<Point>> rings = Arrays.asList(Arrays.asList(
            Point.fromLngLat(-73.98235, 40.76799),
            Point.fromLngLat(-73.95785, 40.80044),
            Point.fromLngLat(-73.94928, 40.7968),
            Point.fromLngLat(-73.97317, 40.76437),
            Point.fromLngLat(-73.98235, 40.76799)));
    
        //Create a Polygon feature and add it to the data source.
        dataSource.add(Feature.fromGeometry(Polygon.fromLngLats(rings)));
    
        //Add a polygon layer for rendering the polygon area.
        map.layers.add(new PolygonLayer(dataSource,
            fillColor("red")));
    
        //Add a line layer for rendering the polygon outline.
        map.layers.add(new LineLayer(dataSource,
            strokeColor("blue"),
            strokeWidth(2f)));
    });
    ```
    
    After adding the code snippet above, your `MainActivity.java` should look like the one below:

    ```Java
    package com.example.myapplication;
    
    import android.app.Activity;
    import android.os.Bundle;
    import java.util.Arrays;
    import android.util.Log;
    import java.util.Collections;
    import android.support.v7.app.AppCompatActivity;
    import com.mapbox.geojson.Point;
    import com.mapbox.geojson.Polygon;
    import com.mapbox.geojson.Feature;
    import com.microsoft.azure.maps.mapcontrol.layer.LineLayer;
    import com.microsoft.azure.maps.mapcontrol.options.LineLayerOptions;
    import com.microsoft.azure.maps.mapcontrol.layer.PolygonLayer;
    import com.microsoft.azure.maps.mapcontrol.source.DataSource;
    import com.microsoft.azure.maps.mapcontrol.AzureMaps;
    import com.microsoft.azure.maps.mapcontrol.MapControl;
    import static com.microsoft.azure.maps.mapcontrol.options.LineLayerOptions.strokeColor;
    import static com.microsoft.azure.maps.mapcontrol.options.LineLayerOptions.strokeWidth;
    import static com.microsoft.azure.maps.mapcontrol.options.PolygonLayerOptions.fillColor;
    
    public class MainActivity extends AppCompatActivity {
    
        static{
            AzureMaps.setSubscriptionKey("<Your Azure Maps subscription key>");
        }
    
        MapControl mapControl;
        @Override
        protected void onCreate(Bundle savedInstanceState) {
    
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
    
            mapControl = findViewById(R.id.mapcontrol);
    
            mapControl.onCreate(savedInstanceState);
    
            mapControl.onReady(map -> {
                //Create a data source and add it to the map.
                DataSource dataSource = new DataSource();
                map.sources.add(dataSource);
            
                //Create a list of point arrays to create polygon rings.
                List<List<Point>> rings = Arrays.asList(Arrays.asList(
                    Point.fromLngLat(-73.98235, 40.76799),
                    Point.fromLngLat(-73.95785, 40.80044),
                    Point.fromLngLat(-73.94928, 40.7968),
                    Point.fromLngLat(-73.97317, 40.76437),
                    Point.fromLngLat(-73.98235, 40.76799)));
            
                //Create a Polygon feature and add it to the data source.
                dataSource.add(Feature.fromGeometry(Polygon.fromLngLats(rings)));
            
                //Add a polygon layer for rendering the polygon area.
                map.layers.add(new PolygonLayer(dataSource,
                    fillColor("red")));
            
                //Add a line layer for rendering the polygon outline.
                map.layers.add(new LineLayer(dataSource,
                    strokeColor("blue"),
                    strokeWidth(2f)));
            });    
        }
    
        @Override
        public void onResume() {
            super.onResume();
            mapControl.onResume();
        }
    
        @Override
        public void onPause() {
            super.onPause();
            mapControl.onPause();
        }
    
        @Override
        public void onStop() {
            super.onStop();
            mapControl.onStop();
        }
    
        @Override
        public void onLowMemory() {
            super.onLowMemory();
            mapControl.onLowMemory();
        }
    
        @Override
        protected void onDestroy() {
            super.onDestroy();
            mapControl.onDestroy();
        }
    
        @Override
        protected void onSaveInstanceState(Bundle outState) {
            super.onSaveInstanceState(outState);
            mapControl.onSaveInstanceState(outState);
        }    
    }
    ```

When you run the application, you should see a polygon on the map as seen below:

![A polygon rendered on an Android map](./media/how-to-add-shapes-to-android-map/android-map-polygon.png)</

## Next steps

To add more data to your map:

> [!div class="nextstepaction"]
> [Add a symbol layer](how-to-add-symbol-to-android-map.md)

> [!div class="nextstepaction"]
> [Add a tile layer](how-to-add-tile-layer-android-map.md)

> [!div class="nextstepaction"]
> [Display feature information](display-feature-information-android.md)