---
title: Show traffic data on android map | Microsoft Azure Maps
description: In this article you will learn, how to display traffic data on a map using the Microsoft Azure Maps Android SDK.
author: farah-alyasari
ms.author: v-faalya
ms.date: 02/27/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---


# Show traffic incidents on the map using Azure Maps Android SDK


## Prerequisites

To complete the process in this article, you need to install Azure Maps Android SDK to load a map as in the [getting started with Android SDK tutorial](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-use-android-map-control-librar).

## Show traffic on the map

This sample shows how to display traffic on the map.

1. Edit res > layout > activity_main.xml so it looks like the one below:

The `app:mapcontrol_centerLat` and `app:mapcontrol_centerLng` attributes center the map over the respective latitude and longitude. 

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

2. Import the following libraries. This is usually added by default, but as a reminder, make sure you have your package at the top.

```java
//package <your package name>;
import android.os.Bundle;
import android.support.design.widget.Snackbar;
import android.view.Menu;
import android.view.MenuItem;
import com.mapbox.geojson.Feature;
import com.microsoft.azure.maps.demo.R;
import com.microsoft.azure.maps.demo.utils.AndroidUtility;
import com.microsoft.azure.maps.mapcontrol.events.OnFeatureClick;
import static com.microsoft.azure.maps.mapcontrol.options.TrafficOptions.incidents;
//if you wish to use the flow and incident traffic options, use: com.microsoft.azure.maps.mapcontrol.options.TrafficOptions.*;
```

2. Define a class to hold your code inside the `MainActivity.java` file. Use the following snippet, and instantiate a `snackbar` object to use later.

```java
public class TrafficIncidentsExampleActivity extends ExampleActivity {

    Snackbar snackbar;

}
```

3. Inside your `TrafficIncidentsExampleActivity` class, copy the code snippet below. In the snippet below, we pass a boolean value to the `incidents` method, and pass that to the `setTraffic` method. Similarly, there are four values that can be passed to `flow` and then `flow` can be passed to `setTraffic`. These four values are: `TrafficFlow.NONE`, `TrafficFlow.RELATIVE`, `TrafficFlow.RELATIVE_DELAY`, and `TrafficFlow.ABSOLUTE`. Using `TrafficFlow.RELATIVE` shows traffic data that's relative to the free-flow speed of the road.  `TrafficFlow.RELATIVE_DELAY` displays areas that are slower than the average expected delay. And, `TrafficFlow.ABSOLUTE` shows the absolute speed of all vehicles on the road. Overall, flow and incidents are the two types of traffic data that can be displayed on the map. Incident data consists of point and line-based data for things such as construction, road closures, and accidents. And, flow data shows metrics about the flow of traffic. After setting the desired traffic data, we attach an `OnFeatureClick` event to map. When clicked, the code logic obtains incident, if any, for that feature. The code builds a message with the incident information, and displays the message. The message displays using the `snackbar` object instantiated earlier, it's a lightweight widget shown at the bottom of the screen.

```java

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mapControl.getMapAsync(map - > {
            map.setTraffic(incidents(true));

            map.events.add((OnFeatureClick)(features) - > {

                if (snackbar != null) {
                    snackbar.dismiss();
                }

                if (features != null && features.size() > 0) {
                    Feature incident = features.get(0);
                    if (incident.properties() != null) {


                        StringBuilder sb = new StringBuilder();
                        String incidentType = incident.getStringProperty("incidentType");
                        if (incidentType != null) {
                            sb.append(incidentType);
                        }
                        if (sb.length() > 0) sb.append("\n");
                        if ("Road Closed".equals(incidentType)) {
                            sb.append(incident.getStringProperty("from"));
                        } else {
                            String description = incident.getStringProperty("description");
                            if (description != null) {
                                for (String word: description.split(" ")) {
                                    if (word.length() > 0) {
                                        sb.append(word.substring(0, 1).toUpperCase());
                                        if (word.length() > 1) {
                                            sb.append(word.substring(1));
                                        }
                                        sb.append(" ");
                                    }
                                }
                            }
                        }
                        String message = sb.toString();

                        if (message.length() > 0) {
                            snackbar = AndroidUtility.showSnackbar(findViewById(R.id.coordinator), message);
                        }
                    }
                }
            });
        });
    }
```

4. Text

```java
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_incidents, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        switch (item.getItemId()) {

            case R.id.menu_item_incidents_on:
                mapControl.getMapAsync(map -> map.setTraffic(incidents(true)));
                break;

            case R.id.menu_item_incidents_off:
                mapControl.getMapAsync(map -> map.setTraffic(incidents(false)));
                break;

            default:
                return super.onOptionsItemSelected(item);
        }

        AndroidUtility.showToast(this, getString(R.string.a11y_incidents_event, item.getTitle()));
        return true;
    }
```