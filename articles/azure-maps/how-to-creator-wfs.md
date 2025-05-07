---
title: Query datasets using the Web Feature Service
titleSuffix: Microsoft Azure Maps Creator
description: How to Query datasets with Web Feature Service (WFS) 
author: faterceros
ms.author: aterceros
ms.date: 03/03/2023
ms.topic: how-to
ms.service: azure-maps
ms.subservice: creator
---

# Query datasets using the Web Feature Service

> [!NOTE]
>
> **Azure Maps Creator retirement**
>
> The Azure Maps Creator indoor map service is now deprecated and will be retired on 9/30/25. For more information, see [End of Life Announcement of Azure Maps Creator](https://aka.ms/AzureMapsCreatorDeprecation).

This article describes how to query Azure Maps Creator [datasets] using [Web Feature Service (WFS)]. You can use the WFS API to query for all feature collections or a specific collection within a dataset. For example, you can use WFS to find all mid-size meeting rooms in a specific building and floor level.

## Prerequisites

* A [dataset]


>[!IMPORTANT]
>
> * This article uses the `us.atlas.microsoft.com` geographical URL. If your Creator service wasn't created in the United States, you must use a different geographical URL.  For more information, see [Access to Creator Services].
> * In the URL examples in this article you will need to replace:
>   * `{Azure-Maps-Subscription-key}` with your Azure Maps subscription key.

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

After the response returns, copy the feature `id` for one of the `unit` features. In the following example, the feature `id` is "UNIT26".

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

[dataset]: creator-indoor-maps.md#datasets
[datasets]: /rest/api/maps-creator/dataset
[WFS API]: /rest/api/maps-creator/wfs
[Web Feature Service (WFS)]: /rest/api/maps-creator/wfs
[Access to Creator Services]: how-to-manage-creator.md#access-to-creator-services
[WFS Describe Collections API]: /rest/api/maps-creator/wfs/get-collection-definition
