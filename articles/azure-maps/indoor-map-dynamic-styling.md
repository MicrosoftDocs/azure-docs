---
title: Implement dynamic styling for Creator Indoor Maps | Microsoft Azure Maps
description: Learn how to Implement dynamic styling for Creator indoor maps 
author: anastasia-ms
ms.author: v-stharr
ms.date: 04/28/2020
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Implement dynamic styling for Creator indoor maps

The Azure Maps Creator [Feature State service](https://docs.microsoft.com/rest/api/maps/featurestate/featurestate) lets you apply styles based on the dynamic properties of indoor map data features.  For example, you can render facility meeting rooms with a specific color to reflect occupancy status. In this article, we'll discuss how to dynamically render indoor map features based on associated dynamic properties (*states*) using the [Feature State service](https://docs.microsoft.com/rest/api/maps/featurestate/featurestate) and the [Indoor Web Module](how-to-use-indoor-module.md).

## Prerequisites

1. [Create an Azure Maps account](quick-demo-map-app.md#create-an-account-with-azure-maps)
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.
3. [Enable Creator](how-to-manage-creator.md)
4. Download the [Sample Drawing package](https://github.com/Azure-Samples/am-creator-indoor-data-examples).
5. [Create an indoor map](tutorial-creator-indoor-maps.md) to obtain a `tilesetId` and `statesetId`.
6. Build a web application by following the steps in [How to use the Indoor Map module](how-to-use-indoor-module.md).

This tutorial uses the [Postman](https://www.postman.com/) application, but you may choose a different API development environment.

## Implement dynamic styling

Once you complete the prerequisites, you should have a simple web application configured with your subscription key, `tilesetId`, and `statesetId`.

### Select features

To implement dynamic styling, a feature, such as a unit, must be identified by a feature `ID`. You'll use the feature `ID` to update the dynamic property or *state* of a specific feature defined in the feature stateset. To view features defined in a dataset, you can use one of the following methods:

* WFS API (Web Feature Service). Datasets can be queried using the WFS API. WFS follows the Open Geospatial Consortium API Features. The WFS API is helpful for querying features within a dataset. For example, you can use WFS to find all mid-size meeting rooms of a given facility and floor level.

* Implement customized code that allows a user to select features on a map using your web application. In this article, we'll make use of this option.  

The following script handles the mouse click event. It retrieves the feature `ID` based on the clicked point and tests the result of changing occupancy status for meeting rooms. In your application, you can insert the code below your Indoor Manager code block. Run your application and check the console to obtain the feature `ID` of the clicked point.

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

For this exercise, choose two feature `ID` for two units, preferably units categorized as meeting rooms.

### Set occupancy status

The feature stateset in use in the application is configured to accept state updates about occupancy and temperature. To update the state of the features:

1. In the Postman application, select **New**. In the **Create New** window, select **Request**. Enter a **Request name** and select a collection. Click **Save**

2. Use the [Feature Update States API](https://docs.microsoft.com/rest/api/maps/featurestate/updatestatespreview) to update the state. Pass the stateset ID, dataset ID, and feature `ID` for one of the two units. Append your Azure Maps subscription key. Here's the URL of a **POST** request to update the state:

    ```http
    https://atlas.microsoft.com/featureState/state?api-version=1.0&statesetID={statesetId}&datasetID={datasetId}&featureID={feature-ID}&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

3. In the **Headers** of the **POST** request, set `Content-Type` to `application/json`. In the **BODY** of the **POST** request, write the following JSON with the feature updates. The update will be saved only if the posted time stamp is after the time stamp used in previous feature state update requests for the same feature `ID`. Pass the "occupied" `keyName` to update its value.

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

4. Redo step 2 and 3 using the other feature `ID`, with the following JSON.

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

The web application you previously opened in a browser should now reflect the updated state of the map features. The feature stateset used in this tutorial defines red for occupied rooms and green for free rooms.

![Free room in green and Busy room in red](./media/indoor-map-dynamic-styling/free-room.png)

## Next steps

Learn more by reading:

> [!div class="nextstepaction"]
> [Creator for indoor mapping](creator-for-indoor-maps.md)

See to the references for the APIs mentioned in this article:

> [!div class="nextstepaction"]
> [Data Upload](creator-for-indoor-maps.md#upload-a-drawing-package)

> [!div class="nextstepaction"]
> [Data Conversion](creator-for-indoor-maps.md#convert-a-drawing-package)

> [!div class="nextstepaction"]
> [Dataset](creator-for-indoor-maps.md#datasets)

> [!div class="nextstepaction"]
> [Tileset](creator-for-indoor-maps.md#tilesets)

> [!div class="nextstepaction"]
> [Feature State set](creator-for-indoor-maps.md#feature-statesets)

> [!div class="nextstepaction"]
> [WFS service](creator-for-indoor-maps.md#web-feature-service-api)

