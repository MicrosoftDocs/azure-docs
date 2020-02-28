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

## Prerequisites

Before you can show traffic on the map, you need to install [Azure Maps Android SDK](https://docs.microsoft.com/azure/azure-maps/how-to-use-android-map-control-library) and load a map.

# Show traffic incidents on the map using Azure Maps Android SDK

This guide shows you how to display traffic data. Flow data and incidents data are the two types of traffic data that can be displayed on the map. Incidents data consists of point and line-based data for things such as constructions, road closures, and accidents. Flow data shows metrics about the flow of traffic on the road.

## Incidents traffic data 

 The following code snippet shows how to display traffic data on the map. We pass a boolean value to the `incidents` method, and pass that to the `setTraffic` method. 

```java
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    mapControl.getMapAsync(map - > {
        map.setTraffic(incidents(true));
}
}
```

You will need to import the following libraries to call the `setTraffic` and `incidents` methods:

```java
import static com.microsoft.com.azure.maps.mapcontrol.options.TrafficOptions.incidents;
```

To obtain the incidents for a specific feature, you can add the block below to your code. When a feature is clicked, the code logic checks for incidents and builds a message about the incident. The message is shown in a SnackBar, a lightweight widget that shows up at the bottom of the screen.

```java
mapControl.onReady(map -> {
    //Turn on traffic flow and incident data on the map.
    map.setTraffic(
            incidents(true),
            flow(TrafficFlow.RELATIVE));

    map.events.add((OnFeatureClick) (features) -> {
        if (features != null && features.size() > 0) {
            Feature incident = features.get(0);

            //Create a message from the properties of the incident.
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
                        for (String word : description.split(" ")) {
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
                    //Display the message to the user.
                    Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
                }
            }
        }
    });
});
```

Once you incorporate the above code in your application, you'll be able to click on the feature and learn about the traffic incidents for that the feature. You'll see results similar to the following image:

<center>

![Incident-traffic-on-the-map](./media/how-to-show-traffic-android/android-traffic.png)

</center>

## Flow traffic data

Use the following code snippet to set traffic flow data. Similar to the code in the previous section, we pass the return value of the `flow` method to the `setTraffic` method. There are four values that can be passed to `flow`, and each value would trigger `flow` to pass the respective return value. The return value of `flow` will then be passed as the argument to `setTraffic`. See the table below for these four values:

| | |
| :-- | :-- |
| TrafficFlow.NONE | Doesn't displays traffic data on the map |
| TrafficFlow.RELATIVE | Shows traffic data that's relative to the free-flow speed of the road |
| TrafficFlow.RELATIVE_DELAY | Displays areas that are slower than the average expected delay |
| TrafficFlow.ABSOLUTE | Shows the absolute speed of all vehicles on the road |

```java
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    mapControl.getMapAsync(map -> 
        map.setTraffic(flow(TrafficFlow.RELATIVE)));
}
```

You will need to import the following libraries to use the `setTraffic` and `flow` methods:

```java
import com.microsoft.azure.maps.mapcontrol.options.TrafficFlow;
import static com.microsoft.com.azure.maps.mapcontrol.options.TrafficOptions.flow;
```

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