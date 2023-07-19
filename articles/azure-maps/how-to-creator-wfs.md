---
title: Query datasets using the Web Feature Service
titleSuffix: Microsoft Azure Maps Creator
description: How to Query datasets with Web Feature Service (WFS) 
author: brendansco
ms.author: Brendanc
ms.date: 03/03/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Query datasets using the Web Feature Service

This article describes how to query Azure Maps Creator [datasets] using [Web Feature Service (WFS)]. You can use the WFS API to query for all feature collections or a specific collection within a dataset. For example, you can use WFS to find all mid-size meeting rooms in a specific building and floor level.

## Prerequisites

* Successful completion of [Tutorial: Use Creator to create indoor maps].
* The `datasetId` obtained in [Check dataset creation status] section of the *Use Creator to create indoor maps* tutorial.

This article uses the same sample indoor map as used in the Tutorial: Use Creator to create indoor maps.

>[!IMPORTANT]
>
> * This article uses the `us.atlas.microsoft.com` geographical URL. If your Creator service wasn't created in the United States, you must use a different geographical URL.  For more information, see [Access to Creator Services].
> * In the URL examples in this article you will need to replace:
>   * `{Azure-Maps-Subscription-key}` with your Azure Maps subscription key.
>   * `{datasetId}` with the `datasetId` obtained in the [Check the dataset creation status] section of the *Use Creator to create indoor maps* tutorial.

## Query for feature collections

To query all collections in your dataset, create a new **HTTP GET Request**:

Enter the following URL to [WFS API]. The request should look like the following URL:

```http
https://us.atlas.microsoft.com/wfs/datasets/{datasetId}/collections?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=2.0
```

The response body is returned in GeoJSON format and contains all collections in the dataset. For simplicity, the example here only shows the `unit` collection. To see an example that contains all collections, see [WFS Describe Collections API]. To learn more about any collection, you can select any of the URLs inside the `links` element.

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

This section demonstrates querying [WFS API] for the `unit` feature collection.

To query the unit collection in your dataset, create a new **HTTP GET Request**:

```http
https://us.atlas.microsoft.com/wfs/datasets/{datasetId}/collections/unit/items?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=2.0
```

After the response returns, copy the feature `id` for one of the `unit` features. In the following example, the feature `id` is "UNIT26". Use "UNIT26" as your features `id` when you [Update a feature state].

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

## Next steps

> [!div class="nextstepaction"]
> [How to create a feature stateset]

[datasets]: /rest/api/maps/v2/dataset
[WFS API]: /rest/api/maps/v2/wfs
[Web Feature Service (WFS)]: /rest/api/maps/v2/wfs
[Tutorial: Use Creator to create indoor maps]: tutorial-creator-indoor-maps.md
[Check dataset creation status]: tutorial-creator-indoor-maps.md#check-the-dataset-creation-status
[Access to Creator Services]: how-to-manage-creator.md#access-to-creator-services
[WFS Describe Collections API]: /rest/api/maps/v2/wfs/get-collection-definition
[Update a feature state]: how-to-creator-feature-stateset.md#update-a-feature-state
[How to create a feature stateset]: how-to-creator-feature-stateset.md
