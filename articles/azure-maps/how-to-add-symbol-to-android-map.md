---
title: Add a symbol layer to Android maps in Azure Maps| Microsoft Docs
description: How to add symbols to a map using Azure Maps Android SDK
author: walsehgal
ms.author: v-musehg
ms.date: 04/23/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Add a symbol layer to a map using Azure Maps Android SDK

This article shows you how to render point data from a data source as a Symbol layer on a map using the Azure Maps Android SDK.

## prerequisites

To complete the process in this article, you need to install [Azure Maps Android SDK](https://docs.microsoft.com/azure/azure-maps/how-to-use-android-map-control-library) to load a map.

## Add a symbol layer

To add a marker on the map using the symbol layer, you need to copy the following code snippet into the **onCreate()** method of your `MainActivity.java` class.

```Java
mapControl.onReady(map -> {
    DataSource dataSource = new DataSource();
    dataSource.add(Feature.fromGeometry(Point.fromLngLat(-122.33, 47.64)));

    SymbolLayer symbolLayer = new SymbolLayer(dataSource);
    symbolLayer.setOptions(iconImage("my-icon"));

    map.images.add("my-icon", R.drawable.mapcontrol_marker_red);
    map.sources.add(dataSource);
    map.layers.add(symbolLayer);
});
```

The code snippet above first obtains a reference to the AzureMap instance using the MapControl's **onReady()** callback method. It then creates a data source object using the **DataSource** class and adds a **Feature** containing a Point geometry to it. A **symbol layer** uses text or icons to render point-based data wrapped in the DataSource as symbols on the map. A symbol layer is then created and the data source is passed to it to render. The last part of the code snippet sets the red marker image as icon for the symbol, it then adds the data source to the maps sources and the symbol layer to the map.

After adding the code snippet above, your `MainActivity.java` should look like the one below:

```Java
package com.example.myapplication;

import android.app.Activity;
import android.os.Bundle;
import com.mapbox.geojson.Feature;
import com.mapbox.geojson.Point;
import com.microsoft.azure.maps.mapcontrol.AzureMaps;
import com.microsoft.azure.maps.mapcontrol.MapControl;
import com.microsoft.azure.maps.mapcontrol.layer.SymbolLayer;
import com.microsoft.azure.maps.mapcontrol.source.DataSource;
import static com.microsoft.azure.maps.mapcontrol.options.SymbolLayerOptions.iconImage;
public class MainActivity extends AppCompatActivity {
    
    static{
            AzureMaps.setSubscriptionKey("{subscription-key}");
        }

    MapControl mapControl;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mapControl = findViewById(R.id.mapcontrol);

        mapControl.onCreate(savedInstanceState);

        mapControl.getMapAsync(map -> {
            DataSource dataSource = new DataSource();
            dataSource.add(Feature.fromGeometry(Point.fromLngLat(-122.33, 47.64)));

            SymbolLayer symbolLayer = new SymbolLayer(dataSource);
            symbolLayer.setOptions(iconImage("my-icon"));

            map.images.add("my-icon", R.drawable.mapcontrol_marker_red);
            map.sources.add(dataSource);
            map.layers.add(symbolLayer);
        });
    }

    @Override
    public void onStart() {
        super.onStart();
        mapControl.onStart();
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

At this point, if you run your application you should see a marker on the map, as shown here:

![Android map pin](./media/how-to-add-symbol-to-android-map/android-map-pin.png)