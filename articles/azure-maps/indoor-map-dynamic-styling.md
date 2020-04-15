---
title: Implement dynamic styling for Private Atlas Indoor Maps | Microsoft Azure Maps
description: Learn how to Implement dynamic styling for Private Atlas indoor maps
author: anastasia-ms
ms.author: v-stharr
ms.date: 04/13/2020
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Implement dynamic styling for Private Atlas indoor maps

Private Atlas lets you dynamically render certain parts of your indoor map data. For example, you may have indoor map data for a building with sensors collecting temperature information. You can render meeting rooms with styles based on the room temperature level. The [Feature State service](https://docs.microsoft.com/rest/api/maps/featurestate/featurestate) supports such scenarios in which the tileset features render according to their states. In this article, we'll discuss how to dynamically render indoor map features based on associated feature states using the [Feature State service](https://docs.microsoft.com/rest/api/maps/featurestate/featurestate) and the [Indoor Web Module](how-to-use-indoor-module.md).

When a web application uses the [Indoor Web Module](how-to-use-indoor-module.md) to render indoor maps, you can further leverage the [Feature State service](https://docs.microsoft.com/rest/api/maps/featurestate/featurestate) for dynamic styling. In particular, the [Get Map State Tile API](https://docs.microsoft.com/rest/api/maps/renderv2/getmaptilepreview) allows for control over the tileset style at the level of individual feature. The map rendering engine will not reparse the underlying geometry and data, thus offering a significant boost in performance, especially in scenarios involving live data visualization.

## Prerequisites

1. [Create an Azure Maps account](quick-demo-map-app.md#create-an-account-with-azure-maps) and [obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account). This key may also be referred to as the primary key or the subscription key. You will need this key to call the Azure Map API.

2. Create Private Atlas, and use it to create an indoor map. The necessary steps are described in [How to make a Private Atlas account](how-to-manage-private-atlas.md) and [How to create an indoor map using Private Atlas](tutorial-private-atlas-indoor-maps.md). When you complete these steps, note your tile set identifier and feature state set identifier. In this article, we will assume the sample data provided in the [How to create an indoor map using Private Atlas](tutorial-private-atlas-indoor-maps.md) tutorial.

3. Build a web application by using the sample code as defined in the [How to use the indoor module](how-to-use-indoor-module.md#use-the-indoor-maps-module) article.

4. Make Feature State API calls in any API development environment. In this article, we use the [Postman](https://www.postman.com/) application.

## Implement dynamic styling

Once you complete the prerequisites, you should have a simple web application configured with your tile set identifier, and state set identifier.

### Select features

To implement dynamic styling, rendered features must be identified via the respective feature identifier. You'll use the feature identifier to update the state for your features in the feature state set. You can learn about your map features in different ways, for example: 

* Using WFS API. It gives you access to data set features from all collections (for example, units and zones) which supports programmatic selection and management of feature identifiers.  

* Writing customized code to visually select features on a map using your web application. For example, add code to get the feature ID for a point on the map. In this article, we'll make use of this option.  

The following script adds the ability to click on a point on the map and get the feature ID for the clicked point. This will help you visually select a feature, gather its identifier, and test the result of changing occupancy status for meeting rooms. In your application, you can insert the code below your Indoor Manager code block. Run your application and check the console to obtain the feature ID of the clicked point.

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

For this exercise, choose two feature ID for two units, preferably units categorized as meeting rooms.

### Set occupancy status

The feature state set in use in the application is configured to accept state updates about occupancy and temperature. To update the state of the features: 

1. In the Postman application, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**

2. Use the [Feature Update States API](https://docs.microsoft.com/rest/api/maps/featurestate/updatestatespreview) to update the state. Pass the state set ID, data set ID, and feature ID for one of the two units. Append your Azure Maps subscription key. Here's the URL of a **POST** request to update the state:

    ```http
    https://atlas.microsoft.com/featureState/state?api-version=1.0&statesetID=<stateset-udid>&datasetID=<dataset-udid>&featureID=<feature-ID>&subscription-key=<Azure-Maps-Primary-Subscription-key>
    ```

3. In the **Headers** of the **POST** request, set `Content-Type` to `application/json`. In the **body** of the **POST** request, write the JSON with the feature updates. The update will only be saved, if the posted time stamp is after the time stamp used in previous feature state update request for the same feature id. Pass the "occupied" keyname to update its value. Use the following JSON:

    ```json
    {
        "states": [
            {
                "keyName": "occupied",
                "value": true,
                "eventTimestamp": "2019-11-14T17:10:20"
            }
        ]
    }
    ```

4. Redo step 2 and 3 using the other feature ID, with the following JSON.
    
    ``` json
    {
        "states": [
            {
                "keyName": "occupied",
                "value": false,
                "eventTimestamp": "2019-11-14T17:10:20"
            }
        ]
    }
    ```

### Visualize dynamic styles on a map

The web application you previously opened in a browser should now automatically reflect the state of updated feature states in the map. In particular, the feature state set in use in this article defines rendering in red occupied rooms and in green free rooms. You should see that the units you selected for which you updated the state are now rendered in red and green accordingly with their current state. The map now is indicating the occupancy status, like in the image below: `

![Free room in green and Busy room in red](./media/indoor-map-dynamic-styling/free-room.png)

## Next steps

Learn more by reading:

> [!div class="nextstepaction"]
> [Use the Azure Maps QGIS Plug-in](private-atlas-for-indoor-maps.md)

See to the references for the APIs mentioned in this article:

> [!div class="nextstepaction"]
> [Data Upload](private-atlas-for-indoor-maps.md#uploading-a-drawing-package)

> [!div class="nextstepaction"]
> [Data Conversion](private-atlas-for-indoor-maps.md#converting-a-drawing-package)

> [!div class="nextstepaction"]
> [Dataset](private-atlas-for-indoor-maps.md#datasets)

> [!div class="nextstepaction"]
> [Tileset](private-atlas-for-indoor-maps.md#tilesets)

> [!div class="nextstepaction"]
> [Feature State set](private-atlas-for-indoor-maps.md#feature-statesets)

> [!div class="nextstepaction"]
> [WFS service](private-atlas-for-indoor-maps.md#web-feature-service-api)

