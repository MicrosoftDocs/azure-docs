---
title: Add shapes to Android maps in Azure Maps| Microsoft Docs
description: How to add shapes to a map using Azure Maps Android SDK
author: walsehgal
ms.author: v-musehg
ms.date: 04/23/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Add a shape to a map using Azure Maps Android SDK

This article shows you how to render shapes on a map using Azure Maps Android SDK.

## prerequisites

To complete the process in this article, you need to install [Azure Maps Android SDK](https://docs.microsoft.com/azure/azure-maps/how-to-use-android-map-control-library) to load a map.


## Add a line to the map

You can add a line to the map using a **Line Layer**, follow the steps below to add a line on the map.

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
            app:mapcontrol_centerLat="40.743270"
            app:mapcontrol_centerLng="-74.004420"
            app:mapcontrol_zoom="12"
            />
    
    </FrameLayout>
    ```

2. Copy the following code snippet below into the **onCreate()** method of your `MainActivity.java` class.

    ```Java
    mapControl.onReady(map -> {
    
        List<Point> points = Arrays.asList(
            Point.fromLngLat(-73.972340, 40.743270),
            Point.fromLngLat(-74.004420, 40.756800));
    
        DataSource lineSource = new DataSource();
        lineSource.add(LineString.fromLngLats(points));
    
        LineLayer linelayer = new LineLayer(lineSource,
            strokeColor("blue"),
            strokeWidth(5f));
    
        map.sources.add(lineSource);
        map.layers.add(linelayer);
    
    });
    ```
    
    The code snippet above first obtains a reference to the AzureMap instance using the MapControl's **onReady()** callback method. A list of **Point** objects is then created. A **LineString** is created from the list of points and added to a new **DataSource**. A **Line Layer** renders line objects wrapped in a data source on the map. A Line Layer is then created and the data source is added to it. The last part of the code snippet adds the data source to the map's sources and then the line layer to the map.

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
            AzureMaps.setSubscriptionKey("PQqKQ7G5hL0_uVSZeB6nrdsnSNDpu34TnPPKWloxNq0");
        }
    
        MapControl mapControl;
        @Override
        protected void onCreate(Bundle savedInstanceState) {
    
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
    
            mapControl = findViewById(R.id.mapcontrol);
    
            mapControl.onCreate(savedInstanceState);
    
            mapControl.onReady(map -> {
    
                List<Point> points = Arrays.asList(
                        Point.fromLngLat(-73.972340, 40.743270),
                        Point.fromLngLat(-74.004420, 40.756800));
    
                DataSource lineSource = new DataSource();
                lineSource.add(LineString.fromLngLats(points));
    
                LineLayer linelayer = new LineLayer(lineSource,
                        strokeColor("blue"),
                        strokeWidth(5f));
    
                map.sources.add(lineSource);
                map.layers.add(linelayer);
    
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

If you run your application now, you should see a line on the map as seen below:

![Android map line](./media/how-to-add-shapes-to-android-map/android-map-line.png)


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

        DataSource datasource = new DataSource();

        datasource.add(Polygon.fromLngLats(Collections.singletonList(Arrays.asList(Point.fromLngLat(-73.98235, 40.76799),
                Point.fromLngLat(-73.95785, 40.80044),
                Point.fromLngLat(-73.94928, 40.7968),
                Point.fromLngLat(-73.97317, 40.76437),
                Point.fromLngLat(-73.98235, 40.76799)
                ))));

        map.sources.add(datasource);
        map.layers.add(new PolygonLayer(datasource, fillColor("red")));

    });
    ```

    The code snippet above first obtains a reference to the AzureMap instance using the MapControl's **onReady()** callback method. It then creates a **Polygon** object from a list of **Point** data and adds it to a new data source. A **Polygon Layer** renders data wrapped in the data source on the map. The last part of the code snippet adds the data source to the maps sources then creates a polygon layer and adds the data source to it.

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
    import com.microsoft.azure.maps.mapcontrol.layer.PolygonLayer;
    import com.microsoft.azure.maps.mapcontrol.source.DataSource;
    import com.microsoft.azure.maps.mapcontrol.AzureMaps;
    import com.microsoft.azure.maps.mapcontrol.MapControl;
    import static com.microsoft.azure.maps.mapcontrol.options.PolygonLayerOptions.fillColor;
    
    public class MainActivity extends AppCompatActivity {
    
        static{
            AzureMaps.setSubscriptionKey("PQqKQ7G5hL0_uVSZeB6nrdsnSNDpu34TnPPKWloxNq0");
        }
    
        MapControl mapControl;
        @Override
        protected void onCreate(Bundle savedInstanceState) {
    
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
    
            mapControl = findViewById(R.id.mapcontrol);
    
            mapControl.onCreate(savedInstanceState);
    
            mapControl.onReady(map -> {
    
                DataSource datasource = new DataSource();
    
                datasource.add(Polygon.fromLngLats(Collections.singletonList(Arrays.asList(Point.fromLngLat(-73.98235, 40.76799),
                        Point.fromLngLat(-73.95785, 40.80044),
                        Point.fromLngLat(-73.94928, 40.7968),
                        Point.fromLngLat(-73.97317, 40.76437),
                        Point.fromLngLat(-73.98235, 40.76799)
                        ))));
    
                map.sources.add(datasource);
                map.layers.add(new PolygonLayer(datasource, fillColor("red")));
    
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

If you run your application now, you should see a polygon on the map as seen below:

![Android map polygon](./media/how-to-add-shapes-to-android-map/android-map-polygon.png)


## Next steps

See the following article to learn more about ways to set map styles

> [!div class="nextstepaction"]
> [Set map styles in Android maps](https://docs.microsoft.com/azure/azure-maps/set-android-map-styles?branch=pr-en-us-74190)