---
title: Implement dynamic styling for Private Atlas Indoor Maps | Microsoft Azure Maps
description: Learn how to Implement dynamic styling for Private Atlas Indoor Maps
author: farah-alyasari
ms.author: v-faalya
ms.date: 03/19/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Implement dynamic styling for Private Atlas Indoor Maps

Private Atlas provides the functionalities to dynamically render certain parts of the map data. For example, you may have indoor map data for a building with sensors collecting data and you wish to render meeting rooms with styles based on their occupancy state. The [Feature State API]() supports such scenarios in which the tileset features render according to their states that are defined at runtime. In this article we will discuss how to dynamically render indoor map features based on associated feature states using the [Feature State API]() and the [Indoor Module module]().

By the "state" of features, we mean to the feature style properties that can be dynamically changed. The Feature State service lets you create and update the state of features included in a data set. When a web application built using the Azure Maps SDK and Indoor module makes use of the Get Map Tile API to render indoor maps, you can further leverage the feature state service for dynamic styling. In particular, the Get State Tile API allows for control over the tileset style at the level of individual feature. So, the map rendering engine will not re-parse the underlying geometry and data. This offers a significant boost in performance, especially in scenarios when visualizing live data for indoor map features.

## Prerequisites

To calls Azure Maps APIs, [make an Azure Maps account](quick-demo-map-app.md#create-an-account-with-azure-maps) and [obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account). This key may also be referred to as the primary key or the subscription key.

Enable Private Atlas, and use it to create an indoor map. The necessary steps are described in [make a Private Atlas account](how-to-manage-private-atlas.md) and [create an indoor map using Private Atlas](tutorial-private-atlas-indoor-maps.md). When you complete these steps, note your tile set identifier and feature state set identifier.

Build a simple application using the Indoor Maps module, as presented in the [how to use the indoor module](how-to-use-indoor-module.md#use-the-indoor-maps-module) article. 

## Implement dynamic styling

Once you complete the prerequisites, you should have a simple web application, your tile set identifier, and state set identifier. The first steps below show you the key elements you should check in your code.

After the initial checks, we will exemplify an indoor map which includes meeting rooms. We'll render the rooms dynamically based on their occupancy status. The meeting rooms with the "occupied" state set to "true" will be rendered as red and those with a "false" state will be rendered as green.

### Perform initial checks

1. Check that your map instance is centered on the location of your indoor map, by setting the `center` parameter accordingly. If you want, you may also use the `bounds` parameter to constrain your entire map data into a rectangular shape. You can use the following request to the [Tileset List API]() to obtain the bounds for all your tileset IDs. Use the bounds for your chosen tile set ID.

    ```http
    GET https://atlas.microsoft.com/tileset?subscription-key=<Azure-Maps-primary-subscription-key>&api-version=1.0
    ```

    ```javascript
    const subscriptionKey = "<your Azure Maps Primary Subscription Key>";

    const map = new atlas.Map("map-id", {
        //Use your map's coordinates:
        //center: [ longitude, latitude ],
        //bounds: [ longitude1 , latitude1 , longitude2 , latitude2 ]
        //pick a style:
        //style: "blank",
        //pick a zoom level or leave it at auto:
        //zoom: auto,
        subscriptionKey
    });
    ```

2. Check that your Indoor Manager contains your tile set ID and state set ID. If your indoor map has multiple levels, initialize the level control so you can see the different levels in your facility.

    ```javascript

    const tilesetId = "<Your tilesetId>";
    const statesetId = "<Your statesetId>"  

    const indoorManager = new atlas.indoor.IndoorManager(map, {
        levelControl,
        tilesetId,
        statesetId
    });
    ```

3. Check that you have dynamic styling enabled

    ```javascript
    styleManager.setDynamicStyling(true);
    ```

### Select features

To implement dynamic styling, view your map features and select the feature identifier for the feature you want to style. You'll use the feature to make a state for your feature state set. You can learn about your map features in several ways, which are described here:

* Use the Azure Maps QGIS plug-in. It gives you the ability to select map features for your map layers, using a friendly interface. For more information, see [how to use the Azure Maps QGIS plug-in](azure-maps-qgis-plugin.md).

* Make HTTP calls to the Azure Maps WFS service. It gives you systematic access to data set features, and it supports efficient management of feature state sets. For more information, see [common WFS use cases]()

* Write customized code to visually select features in your rendered map. For example, add code to get the feature ID for a point on the map. In this article, we'll show you one way to write custom code to learn about your feature.

The following script adds the ability to click on a point on the map and get the feature ID for the clicked point. This will help you visually select a feature, gather its identifier, and test the result of changing occupancy status for meeting rooms. In your simple application, you can insert the code below your IndoorManager code block. Run your simple application, and check the console to obtain the feature ID of the clicked point.

```javascript
/* Upon a mouse click, log the feature properties to the browser's console. */
map.events.add("click", function(e){

    var features = map.layers.getRenderedShapes(e.position, "indoor")

    var result = features.reduce(function (ids, feature) {
        if (feature.layer.id == "indoor_unit_conference") {
            console.log(feature);
        }
    }, []);
});
```

### Set occupancy status

Create a new feature state set containing the feature ID you want in your feature state set. We'll refer to the style properties of this feature ID as states. We'll update the state of the feature state set and reload your map to see the changes rendered on the map. 

1. 

2. 