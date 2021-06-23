---
title: Implement dynamic styling for Azure Maps Creator indoor maps
description: Learn how to Implement dynamic styling for Creator indoor maps 
author: anastasia-ms
ms.author: v-stharr
ms.date: 05/20/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Implement dynamic styling for Creator indoor maps

You can use Azure Maps Creator [Feature State service](/rest/api/maps/v2/feature-state) to apply styles that are based on the dynamic properties of indoor map data features.  For example, you can render facility meeting rooms with a specific color to reflect occupancy status. This article describes how to dynamically render indoor map features with the [Feature State service](/rest/api/maps/v2/feature-state) and the [Indoor Web module](how-to-use-indoor-module.md).

## Prerequisites

1. [Create an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account)
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key.
3. [Create a Creator resource](how-to-manage-creator.md)
4. Download the [sample Drawing package](https://github.com/Azure-Samples/am-creator-indoor-data-examples).
5. [Create an indoor map](tutorial-creator-indoor-maps.md) to obtain a `tilesetId` and `statesetId`.
6. Build a web application by following the steps in [How to use the Indoor Map module](how-to-use-indoor-module.md).

This tutorial uses the [Postman](https://www.postman.com/) application, but you may choose a different API development environment.

## Implement dynamic styling

After you complete the prerequisites, you should have a simple web application configured with your subscription key, `tilesetId`, and `statesetId`.

### Select features

To implement dynamic styling, a feature - such as a meeting or conference room - must be referenced by its feature `id`. You use the feature `id` to update the dynamic property or *state* of that feature. To view the features defined in a dataset, you can use one of the following methods:

* WFS API (Web Feature service). You can use the [WFS API](/rest/api/maps/v2/wfs) to query datasets. WFS follows the [Open Geospatial Consortium API Features](http://docs.opengeospatial.org/DRAFTS/17-069r1.html). The WFS API is helpful for querying features within a dataset. For example, you can use WFS to find all mid-size meeting rooms of a specific facility and floor level.

* Implement customized code that a user can use to select features on a map using your web application. We use this option in this article.  

The following script implements the mouse-click event. The code retrieves the feature `id` based on the clicked point. In your application, you can insert the code after your Indoor Manager code block. Run your application, and then check the console to obtain the feature `id` of the clicked point.

```javascript
/* Upon a mouse click, log the feature properties to the browser's console. */
map.events.add("click", function(e){

    var features = map.layers.getRenderedShapes(e.position, "indoor");

    features.forEach(function (feature) {
        if (feature.layer.id == 'indoor_unit_office') {
            console.log(feature);
        }
    });
});
```

The [Create an indoor map](tutorial-creator-indoor-maps.md) tutorial configured the feature stateset to accept state updates for `occupancy`.

In the next section, we'll set the occupancy *state* of office `UNIT26` to `true` and  office `UNIT27` to `false`.

### Set occupancy status

 We'll now update the state of the two offices, `UNIT26` and `UNIT27`:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *POST Data Upload*.

4. Enter the following URL to the [Feature Update States API](/rest/api/maps/v2/feature-state/update-states) (replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key and `statesetId` with the `statesetId`):

    ```http
    https://us.atlas.microsoft.com/featurestatesets/{statesetId}/featureStates/UNIT26?api-version=2.0&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

5. Select the **Headers** tab.

6. In the **KEY** field, select `Content-Type`. In the **VALUE** field, select `application/json`.

     :::image type="content" source="./media/indoor-map-dynamic-styling/stateset-header.png"alt-text="Header tab information for stateset creation.":::

7. Select the **Body** tab.

8. In the dropdown lists, select **raw** and **JSON**.

9. Copy the following JSON style, and then paste it in the **Body** window:

    ```json
    {
        "states": [
            {
                "keyName": "occupied",
                "value": true,
                "eventTimestamp": "2020-11-14T17:10:20"
            }
        ]
    }
    ```

    >[!IMPORTANT]
    >The update will be saved only if the posted time stamp is after the time stamp used in previous feature state update requests for the same feature `ID`.

10. Change the URL you used in step 7 by replacing `UNIT26` with `UNIT27`:

    ```http
    https://us.atlas.microsoft.com/featurestatesets/{statesetId}/featureStates/UNIT27?api-version=2.0&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

11. Copy the following JSON style, and then paste it in the **Body** window:

    ``` json
    {
        "states": [
            {
                "keyName": "occupied",
                "value": false,
                "eventTimestamp": "2020-11-14T17:10:20"
            }
        ]
    }
    ```

### Visualize dynamic styles on a map

The web application that you previously opened in a browser should now reflect the updated state of the map features:
- Office `UNIT27`(142) should appear green.
- Office `UNIT26`(143) should appear red.

![Free room in green and Busy room in red](./media/indoor-map-dynamic-styling/room-state.png)

[See live demo](https://azuremapscodesamples.azurewebsites.net/?sample=Creator%20indoor%20maps)

## Next steps

Learn more by reading:

> [!div class="nextstepaction"]
> [Creator for indoor mapping](creator-indoor-maps.md)

See the references for the APIs mentioned in this article:

> [!div class="nextstepaction"]
> [Data Upload](creator-indoor-maps.md#upload-a-drawing-package)

> [!div class="nextstepaction"]
> [Data Conversion](creator-indoor-maps.md#convert-a-drawing-package)

> [!div class="nextstepaction"]
> [Dataset](creator-indoor-maps.md#datasets)

> [!div class="nextstepaction"]
> [Tileset](creator-indoor-maps.md#tilesets)

> [!div class="nextstepaction"]
> [Feature State set](creator-indoor-maps.md#feature-statesets)

> [!div class="nextstepaction"]
> [WFS service](creator-indoor-maps.md#web-feature-service-api)
