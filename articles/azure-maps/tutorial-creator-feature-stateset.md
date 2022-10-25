---
title: 'Tutorial: Create a feature stateset'
titleSuffix: Microsoft Azure Maps
description: The third tutorial on Microsoft Azure Maps Creator. How to create a feature stateset.
author: stevemunk
ms.author: v-munksteve
ms.date: 01/28/2022
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
---

# Tutorial: Create a feature stateset

[Feature statesets](/rest/api/maps/v2/feature-state) define dynamic properties and values on specific features that support them. In this Tutorial, you'll:

> [!div class="checklist"]
>
> * Create a stateset that defines boolean values and corresponding styles for the **occupancy** property.
> * Change the `occupancy` property state of the desired unit.

## Prerequisites

* Successful completion of [Tutorial: Query datasets with WFS API](tutorial-creator-wfs.md).
* The `datasetId` obtained in the [Check the dataset creation status](tutorial-creator-indoor-maps.md#check-the-dataset-creation-status) section of the *Use Creator to create indoor maps* tutorial.

This tutorial uses the [Postman](https://www.postman.com/) application, but you can use a different API development environment.

>[!IMPORTANT]
>
> * This article uses the `us.atlas.microsoft.com` geographical URL. If your Creator service wasn't created in the United States, you must use a different geographical URL.  For more information, see [Access to Creator Services](how-to-manage-creator.md#access-to-creator-services).
> * In the URL examples in this article you will need to replace:
>    * `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.
>    * `{datasetId}` with the `datasetId` obtained in the [Check the dataset creation status](tutorial-creator-indoor-maps.md#check-the-dataset-creation-status) section of the *Use Creator to create indoor maps* tutorial

## Create a feature stateset

To create a stateset:

1. In the Postman app, create a new **HTTP Request** and save it as *POST Create Stateset*.

2. Select the **POST** HTTP method.

3. Enter the following URL to the [Stateset API](/rest/api/maps/v2/feature-state/create-stateset). The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/featurestatesets?api-version=2.0&datasetId={datasetId}&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

4. Select the **Headers** tab.

5. In the **KEY** field, select `Content-Type`.

6. In the **VALUE** field, select `application/json`.

     :::image type="content" source="./media/tutorial-creator-indoor-maps/stateset-header.png"alt-text="A screenshot of Postman showing the Header tab of the POST request that shows the Content Type Key with a value of application forward slash json.":::

7. Select the **Body** tab.

8. Select **raw** and **JSON**.

9. Copy the following JSON styles, and then paste them in the **Body** window:

    ```json
    {
       "styles":[
          {
             "keyname":"occupied",
             "type":"boolean",
             "rules":[
                {
                   "true":"#FF0000",
                   "false":"#00FF00"
                }
             ]
          }
       ]
    }
    ```

10. Select **Send**.

11. After the response returns successfully, copy the `statesetId` from the response body. In the next section, you'll use the `statesetId` to change the `occupancy` property state of the unit with feature `id` "UNIT26".

    :::image type="content" source="./media/tutorial-creator-indoor-maps/response-stateset-id.png"alt-text="A screenshot of Postman showing the resource Stateset ID value in the responses body.":::

## Update a feature state

To update the `occupied` state of the unit with feature `id` "UNIT26":

1. In the Postman app, create a new **HTTP Request** and save it as *PUT Set Stateset*.

2. Select the **PUT** HTTP method.

3. Enter the following URL to the [Feature Statesets API](/rest/api/maps/v2/feature-state/create-stateset). The request should look like the following URL (replace `{statesetId`} with the `statesetId` obtained in [Create a feature stateset](#create-a-feature-stateset)):

    ```http
    https://us.atlas.microsoft.com/featurestatesets/{statesetId}/featureStates/UNIT26?api-version=2.0&subscription-key={Your-Azure-Maps-Primary-Subscription-key}
    ```

4. Select the **Headers** tab.

5. In the **KEY** field, select `Content-Type`.

6. In the **VALUE** field, select `application/json`.

     :::image type="content" source="./media/tutorial-creator-indoor-maps/stateset-header.png"alt-text="Header tab information for stateset creation.":::

7. Select the **Body** tab.

8. Select **raw** and **JSON**.

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

    >[!NOTE]
    > The update will be saved only if the time posted stamp is after the time stamp of the previous request.

10. Select **Send**.

11. After the update completes, you'll receive a `200 OK` HTTP status code. If you implemented [dynamic styling](indoor-map-dynamic-styling.md) for an indoor map, the update displays at the specified time stamp in your rendered map.

## Additional information

* For information on how to retrieve the state of a feature using its feature id, see [Feature State - List States](/rest/api/maps/v2/feature-state/list-states).
* For information on how to delete the stateset and its resources, see [Feature State - Delete Stateset](/rest/api/maps/v2/feature-state/delete-stateset) .
* For information on using the Azure Maps Creator [Feature State service](/rest/api/maps/v2/feature-state) to apply styles that are based on the dynamic properties of indoor map data features, see how to article [Implement dynamic styling for Creator indoor maps](indoor-map-dynamic-styling.md).

* For more information on the different Azure Maps Creator services discussed in this tutorial, see [Creator Indoor Maps](creator-indoor-maps.md).
