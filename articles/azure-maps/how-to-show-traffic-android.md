---
title: Show traffic data on android map | Microsoft Azure Maps
description: In this article you'll learn, how to display traffic data on a map using the Microsoft Azure Maps Android SDK.
author: farah-alyasari
ms.author: v-faalya
ms.date: 02/27/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---


# Show traffic incidents on the map using Azure Maps Android SDK

This guide shows you how to display traffic data. Flow data and incidents data are the two types of traffic data that can be displayed on the map. Incidents data consists of point and line-based data for things such as constructions, road closures, and accidents. Flow data shows metrics about the flow of traffic on the road.

## Prerequisites

To complete the exercises in this article, you need to install Azure Maps Android SDK, as explained in [getting started with Android SDK](https://docs.microsoft.com/azure/azure-maps/how-to-use-android-map-control-library).

## Show Incidents traffic data on the map

The coding exercise below demonstrates 

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

2. Import the following libraries. The package is added by default, but as a reminder, make sure you have your package at the top.

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

2. Define a ```TrafficIncidentsExampleActivity`` class to hold your code inside the `MainActivity.java` file. Use the following snippet, and instantiate a `snackbar` object to use later. The `SnackBar` class is a lightweight widget, which shows a message briefly at the bottom of the screen.

```java
public class TrafficIncidentsExampleActivity extends ExampleActivity {

    Snackbar snackbar;

    //The rest of your code goes here

}
```

3. Inside your `TrafficIncidentsExampleActivity` class, copy the code snippet below. In the snippet below, we pass a boolean value to the `incidents` method, and pass that to the `setTraffic` method. After setting the desired traffic data, in this case incident data, we attach an `OnFeatureClick` event to map. When clicked, the code logic obtains the incident, if any, for that feature. The code builds a message with the incident information, and displays the message. The message displays using the `snackbar` object instantiated earlier.

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

4. Place the following code inside the `TrafficIncidentsExampleActivity` class to give the user the option to toggle incidents on the map.

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

5. After you run your code, your application should look like the following image:

## Show flow traffic data on the map

he coding exercise below demonstrates 

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

2. Import the following libraries. The package is added by default, but as a reminder, make sure you have your package at the top.

```java
//package <your package name>;
import android.os.Bundle;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import com.microsoft.azure.maps.demo.R;
import com.microsoft.azure.maps.demo.utils.AndroidUtility;
import com.microsoft.azure.maps.mapcontrol.options.TrafficFlow;
import static com.microsoft.azure.maps.mapcontrol.options.TrafficOptions.flow;
//if you wish to use the flow and incident traffic options, use: com.microsoft.azure.maps.mapcontrol.options.TrafficOptions.*;
```

3. Add the following code to your `MainActivity.java` file. Similar to the previous exercise, we pass the return value of the `flow` method to the `setTraffic` method. Four values that can be passed to `flow`, and each would respectively trigger `flow` to pass the desired return value to `setTraffic`. These four values are: `TrafficFlow.NONE`, `TrafficFlow.RELATIVE`, `TrafficFlow.RELATIVE_DELAY`, and `TrafficFlow.ABSOLUTE`. Using `TrafficFlow.RELATIVE` shows traffic data that's relative to the free-flow speed of the road.  The `TrafficFlow.RELATIVE_DELAY` option displays areas that are slower than the average expected delay. And, `TrafficFlow.ABSOLUTE` shows the absolute speed of all vehicles on the road. The `TrafficFlow.NONE` is used to not displays traffic data on the map.

```java
public class TrafficFlowExampleActivity extends ExampleActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mapControl.getMapAsync(map -> 
        
            map.setTraffic(flow(TrafficFlow.RELATIVE)));
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_flow, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        switch (item.getItemId()) {
            case R.id.menu_item_flow_none:
                mapControl.getMapAsync(map -> map.setTraffic(flow(TrafficFlow.NONE)));
                break;

            case R.id.menu_item_flow_absolute:
                mapControl.getMapAsync(map -> map.setTraffic(flow(TrafficFlow.ABSOLUTE)));
                break;

            case R.id.menu_item_flow_relative:
                mapControl.getMapAsync(map -> map.setTraffic(flow(TrafficFlow.RELATIVE)));
                break;

            case R.id.menu_item_flow_relative_delay:
                mapControl.getMapAsync(map -> map.setTraffic(flow(TrafficFlow.RELATIVE_DELAY)));
                break;

            default:
                return super.onOptionsItemSelected(item);
        }

        AndroidUtility.showToast(this, getString(R.string.a11y_flow_event, item.getTitle()));
        return true;

    }
}
```

4. After you run your code, your application should look like the following image:

## Next steps

View the following guides to learn how to add more data to your map:

> [!div class="nextstepaction"]
> [Add a symbol layer](how-to-add-symbol-to-android-map.md)

> [!div class="nextstepaction"]
> [Add a tile layer](how-to-add-tile-layer-android-map.md)

> [!div class="nextstepaction"]
> [Add shapes to android map](how-to-add-shapes-to-android-map.md)

> [!div class="nextstepaction"]
> [Display feature information](display-feature-information-android.md)