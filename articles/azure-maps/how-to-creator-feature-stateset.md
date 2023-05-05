---
title: Create a feature stateset
titleSuffix: Microsoft Azure Maps Creator
description: How to create a feature stateset using the Creator REST API.
author: brendansco
ms.author: Brendanc
ms.date: 03/03/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Create a feature stateset

[Feature statesets] define dynamic properties and values on specific features that support them. This article explains how to create a stateset that defines values and corresponding styles for a property and changing a property's state.

## Prerequisites

* Successful completion of [Query datasets with WFS API].
* The `datasetId` obtained in the [Check the dataset creation status] section of the *Use Creator to create indoor maps* tutorial.

>[!IMPORTANT]
>
> * This article uses the `us.atlas.microsoft.com` geographical URL. If your Creator service wasn't created in the United States, you must use a different geographical URL.  For more information, see [Access to Creator Services].
> * In the URL examples in this article you will need to replace:
>   * `{Azure-Maps-Subscription-key}` with your Azure Maps subscription key.
>   * `{datasetId}` with the `datasetId` obtained in the [Check the dataset creation status] section of the *Use Creator to create indoor maps* tutorial

## Create the feature stateset

To create a stateset:

Create a new **HTTP POST Request** that uses the [Stateset API]. The request should look like the following URL:

```http
https://us.atlas.microsoft.com/featurestatesets?api-version=2.0&datasetId={datasetId}&subscription-key={Your-Azure-Maps-Subscription-key}
```

Next, set the `Content-Type` to `application/json` in the **Header** of the request.

If using a tool like [Postman], it should look like this:

:::image type="content" source="./media/tutorial-creator-indoor-maps/stateset-header.png"alt-text="A screenshot of Postman showing the Header tab of the POST request that shows the Content Type Key with a value of application forward slash json.":::

Finally, in the **Body** of the HTTP request, include the style information in raw JSON format, which applies different colors to the `occupied` property depending on its value:

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

After the response returns successfully, copy the `statesetId` from the response body. In the next section, you'll use the `statesetId` to change the `occupancy` property state of the unit with feature `id` "UNIT26". If using Postman, it appears as follows:

:::image type="content" source="./media/tutorial-creator-indoor-maps/response-stateset-id.png"alt-text="A screenshot of Postman showing the resource Stateset ID value in the responses body.":::

## Update a feature state

This section demonstrates how to update the `occupied` state of the unit with feature `id` "UNIT26". To update the `occupied` state, create a new **HTTP PUT Request** calling the [Feature Statesets API]. The request should look like the following URL (replace `{statesetId}` with the `statesetId` obtained in [Create a feature stateset]):

```http
https://us.atlas.microsoft.com/featurestatesets/{statesetId}/featureStates/UNIT26?api-version=2.0&subscription-key={Your-Azure-Maps-Subscription-key}
```

Next, set the `Content-Type` to `application/json` in the **Header** of the request.

If using a tool like [Postman], it should look like this:

:::image type="content" source="./media/tutorial-creator-indoor-maps/stateset-header.png"alt-text="A screenshot of the header tab information for stateset creation.":::

Finally, in the **Body** of the HTTP request, include the style information in raw JSON format, which applies different colors to the `occupied` property depending on its value:

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

Once the HTTP request is sent and the update completes, you receive a `200 OK` HTTP status code. If you implemented [dynamic styling] for an indoor map, the update displays at the specified time stamp in your rendered map.

## Additional information

* For information on how to retrieve the state of a feature using its feature ID, see [Feature State - List States].
* For information on how to delete the stateset and its resources, see [Feature State - Delete Stateset].
* For information on using the Azure Maps Creator [Feature State service] to apply styles that are based on the dynamic properties of indoor map data features, see how to article [Implement dynamic styling for Creator indoor maps].

* For more information on the different Azure Maps Creator services discussed in this article, see [Creator Indoor Maps].

## Next steps

Learn how to implement dynamic styling for indoor maps.

> [!div class="nextstepaction"]
> [dynamic styling]

<!---------   Internal Links     --------------->
[Create a feature stateset]: #create-a-feature-stateset

<!---------   learn.microsoft.com links     --------------->
[Access to Creator Services]: how-to-manage-creator.md#access-to-creator-services
[Check the dataset creation status]: tutorial-creator-indoor-maps.md#check-the-dataset-creation-status
[Creator Indoor Maps]: creator-indoor-maps.md
[dynamic styling]: indoor-map-dynamic-styling.md
[Implement dynamic styling for Creator indoor maps]: indoor-map-dynamic-styling.md
[Query datasets with WFS API]: how-to-creator-wfs.md

<!---------   External Links     --------------->
[Postman]: https://www.postman.com/

<!---------   REST API Links     --------------->
[Feature State - Delete Stateset]: /rest/api/maps/v2/feature-state/delete-stateset
[Feature State - List States]: /rest/api/maps/v2/feature-state/list-states
[Feature State service]: /rest/api/maps/v2/feature-state
[Feature Statesets API]: /rest/api/maps/v2/feature-state/create-stateset
[Feature statesets]: /rest/api/maps/v2/feature-state
[Stateset API]: /rest/api/maps/v2/feature-state/create-stateset
