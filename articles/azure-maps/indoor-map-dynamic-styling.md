---
title: Implement dynamic styling for Azure Maps Creator indoor maps
titleSuffix:  Microsoft Azure Maps Creator
description: Learn how to Implement dynamic styling for Creator indoor maps 
author: brendansco
ms.author: Brendanc
ms.date: 03/03/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Implement dynamic styling for Creator indoor maps

You can use the Azure Maps Creator [Feature State service] to apply styles that are based on the dynamic properties of indoor map data features.  For example, you can render facility meeting rooms with a specific color to reflect occupancy status. This article describes how to dynamically render indoor map features with the [Feature State service] and the [Indoor Web module].

## Prerequisites

- A `statesetId`.  For more information, see [How to create a feature stateset].
- A web application. For more information, see [How to use the Indoor Map module].

This article uses the [Postman] application, but you may choose a different API development environment.

## Implement dynamic styling

After you complete the prerequisites, you should have a simple web application configured with your subscription key, and `statesetId`.

### Select features

You reference a feature, such as a meeting or conference room, by its ID to implement dynamic styling. Use the feature ID to update the dynamic property or *state* of that feature. To view the features defined in a dataset, use one of the following methods:

- WFS API (Web Feature service). Use the [WFS API] to query datasets. WFS follows the [Open Geospatial Consortium API Features]. The WFS API is helpful for querying features within a dataset. For example, you can use WFS to find all mid-size meeting rooms of a specific facility and floor level.

- Implement customized code that a user can use to select features on a map using your web application, as demonstrated in this article.  

The following script implements the mouse-click event. The code retrieves the feature ID based on the clicked point. In your application, you can insert the code after your Indoor Manager code block. Run your application, and then check the console to obtain the feature ID of the clicked point.

```javascript
/* Upon a mouse click, log the feature properties to the browser's console. */
map.events.add("click", function(e){

    var features = map.layers.getRenderedShapes(e.position, "unit");

    features.forEach(function (feature) {
        if (feature.layer.id == 'indoor_unit_office') {
            console.log(feature);
        }
    });
});
```

The [Create an indoor map] tutorial configured the feature stateset to accept state updates for `occupancy`.

In the next section, you'll set the occupancy *state* of office `UNIT26` to `true` and  office `UNIT27` to `false`.

### Set occupancy status

Update the state of the two offices, `UNIT26` and `UNIT27`:

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *POST Data Upload*.

4. Enter the following URL to the [Feature Update States API] (replace `{Azure-Maps-Subscription-key}` with your Azure Maps subscription key and `statesetId` with the `statesetId`):

    ```http
    https://us.atlas.microsoft.com/featurestatesets/{statesetId}/featureStates/UNIT26?api-version=2.0&subscription-key={Your-Azure-Maps-Subscription-key}
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
    >The update will be saved only if the posted time stamp is after the time stamp used in previous feature state update requests for the same feature ID.

10. Change the URL you used in step 7 by replacing `UNIT26` with `UNIT27`:

    ```http
    https://us.atlas.microsoft.com/featurestatesets/{statesetId}/featureStates/UNIT27?api-version=2.0&subscription-key={Your-Azure-Maps-Subscription-key}
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

[See live demo]

## Next steps

Learn more by reading:

> [!div class="nextstepaction"]
> [What is Azure Maps Creator?]

> [!div class="nextstepaction"]
> [Creator for indoor maps](creator-indoor-maps.md)

[Feature State service]: /rest/api/maps/v2/feature-state
[Indoor Web module]: how-to-use-indoor-module.md
<!--[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[A Creator resource]: how-to-manage-creator.md
[Sample Drawing package]: https://github.com/Azure-Samples/am-creator-indoor-data-examples/tree/master/Drawing%20Package%202.0-->
[How to use the Indoor Map module]: how-to-use-indoor-module.md
[Postman]: https://www.postman.com/
[How to create a feature stateset]: how-to-creator-feature-stateset.md
[See live demo]: https://samples.azuremaps.com/?sample=creator-indoor-maps
[Feature Update States API]: /rest/api/maps/v2/feature-state/update-states
[Create an indoor map]: tutorial-creator-indoor-maps.md
[Open Geospatial Consortium API Features]: https://docs.opengeospatial.org/DRAFTS/17-069r4.html
[WFS API]: /rest/api/maps/v2/wfs
[Creator for indoor maps]: creator-indoor-maps.md
