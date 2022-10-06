---
title: 'Tutorial: Query datasets with WFS API'
titleSuffix: Microsoft Azure Maps
description: The second tutorial on Microsoft Azure Maps Creator. How to Query datasets with WFS API
author: stevemunk
ms.author: v-munksteve
ms.date: 01/28/2022
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
---

# Tutorial: Query datasets with WFS API

This tutorial describes how to query Azure Maps Creator [datasets](/rest/api/maps/v2/dataset) using [WFS API](/rest/api/maps/v2/wfs). You can use the WFS API to query features within a dataset. For example, you can use WFS to find all mid-size meeting rooms in a specific building and floor level.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * Query the Azure Maps Web Feature Service (WFS) API to query for all feature collections.
> * Query the Azure Maps Web Feature Service (WFS) API to query for a specific collection.

First you'll query all collections, and then you'll query for the `unit` collection.

## Prerequisites

* Successful completion of [Tutorial: Use Creator to create indoor maps](tutorial-creator-indoor-maps.md).
* The `datasetId` obtained in [Check dataset creation status](tutorial-creator-indoor-maps.md#check-the-dataset-creation-status) section of the previous tutorial.

This tutorial uses the [Postman](https://www.postman.com/) application, but you can use a different API development environment.

>[!IMPORTANT]
>
> * This article uses the `us.atlas.microsoft.com` geographical URL. If your Creator service wasn't created in the United States, you must use a different geographical URL.  For more information, see [Access to Creator Services](how-to-manage-creator.md#access-to-creator-services).
> * In the URL examples in this article you will need to replace:
>    * `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.
>    * `{datasetId}` with the `datasetId` obtained in the [Check the dataset creation status](tutorial-creator-indoor-maps.md#check-the-dataset-creation-status) section of the *Use Creator to create indoor maps* tutorial

## Query for feature collections

To query all collections in your dataset:

1. In the Postman app, create a new **HTTP Request** and save it as *GET Dataset Collections*.

2. Select the **GET** HTTP method.

3. Enter the following URL to [WFS API](/rest/api/maps/v2/wfs). The request should look like the following URL:

    ```http
    https://us.atlas.microsoft.com/wfs/datasets/{datasetId}/collections?subscription-key={Your-Azure-Maps-Primary-Subscription-key}&api-version=2.0
    ```

4. Select **Send**.

5. The response body is returned in GeoJSON format and contains all collections in the dataset. For simplicity, the example here only shows the `unit` collection. To see an example that contains all collections, see [WFS Describe Collections API](/rest/api/maps/v2/wfs/get-collection-definition). To learn more about any collection, you can select any of the URLs inside the `links` element.

    ```json
    {
    "collections": [
        {
            "name": "unit",
            "description": "A physical and non-overlapping area which might be occupied and traversed by a navigating agent. Can be a hallway, a room, a courtyard, etc. It is surrounded by physical obstruction (wall), unless the is_open_area attribute is equal to true, and one must add openings where the obstruction shouldn't be there. If is_open_area attribute is equal to true, all the sides are assumed open to the surroundings and walls are to be added where needed. Walls for open areas are represented as a line_element or area_element with is_obstruction equal to true.",
            "links": [
                {
                    "href": "https://atlas.microsoft.com/wfs/datasets/{datasetId}/collections/unit/definition?api-version=1.0",
                    "rel": "describedBy",
                    "title": "Metadata catalogue for unit"
                },
                {
                    "href": "https://atlas.microsoft.com/wfs/datasets/{datasetId}/collections/unit/items?api-version=1.0",
                    "rel": "data",
                    "title": "unit"
                }
                {
                    "href": "https://atlas.microsoft.com/wfs/datasets/{datasetId}/collections/unit?api-version=1.0",
                    "rel": "self",
                    "title": "Metadata catalogue for unit"
                }
            ]
        },
    ```

## Query for unit feature collection

In this section, you'll query [WFS API](/rest/api/maps/v2/wfs) for the `unit` feature collection.

To query the unit collection in your dataset:

1. In the Postman app, create a new **HTTP Request** and save it as *GET Unit Collection*.

2. Select the **GET** HTTP method.

3. Enter the following URL:

    ```http
    https://us.atlas.microsoft.com/wfs/datasets/{datasetId}/collections/unit/items?subscription-key={Your-Azure-Maps-Primary-Subscription-key}&api-version=2.0
    ```

4. Select **Send**.

5. After the response returns, copy the feature `id` for one of the `unit` features. In the following example, the feature `id` is "UNIT26". You'll use "UNIT26" as your feature `id` when you [Update a feature state](tutorial-creator-feature-stateset.md#update-a-feature-state) in the next tutorial.

    ```json
    {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": ["..."]
                },
                "properties": {
                    "original_id": "b7410920-8cb0-490b-ab23-b489fd35aed0",
                    "category_id": "CTG8",
                    "is_open_area": true,
                    "navigable_by": [
                        "pedestrian"
                    ],
                    "route_through_behavior": "allowed",
                    "level_id": "LVL14",
                    "occupants": [],
                    "address_id": "DIR1",
                    "name": "157"
                },
                "id": "UNIT26",
                "featureType": ""
            }, {"..."}
        ]
    }
    ```

## Additional information

See [WFS](/rest/api/maps/v2/wfs) for information on the Creator Web Feature Service REST API.

## Next steps

To learn how to use feature statesets to define dynamic properties and values on specific features in the final Creator tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Create a feature stateset](tutorial-creator-feature-stateset.md)
