---
title: Index geospatial data with Azure Cosmos DB
description: Index spatial data with Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/20/2020
ms.author: tisande

---
# Index geospatial data with Azure Cosmos DB

We designed Azure Cosmos DB’s database engine to be truly schema agnostic and provide first class support for JSON. The write optimized database engine of Azure Cosmos DB natively understands spatial data represented in the GeoJSON standard.

In a nutshell, the geometry is projected from geodetic coordinates onto a 2D plane then divided progressively into cells using a **quadtree**. These cells are mapped to 1D based on the location of the cell within a **Hilbert space filling curve**, which preserves locality of points. Additionally when location data is indexed, it goes through a process known as **tessellation**, that is, all the cells that intersect a location are identified and stored as keys in the Azure Cosmos DB index. At query time, arguments like points and Polygons are also tessellated to extract the relevant cell ID ranges, then used to retrieve data from the index.

If you specify an indexing policy that includes spatial index for /* (all paths), then all data found within the container is indexed for efficient spatial queries.

> [!NOTE]
> Azure Cosmos DB supports indexing of Points, LineStrings, Polygons, and MultiPolygons
>
>

## Geography data indexing examples

The following JSON snippet shows an indexing policy with spatial indexing enabled for the **geography** data type. It is valid for spatial data with the geography data type and will index any GeoJSON Point, Polygon, MultiPolygon, or LineString found within documents for spatial querying. If you are modifying the indexing policy using the Azure portal, you can specify the following JSON for indexing policy to enable spatial indexing on your container:

**Container indexing policy JSON with geography spatial indexing**

```json
    {
       "automatic":true,
       "indexingMode":"Consistent",
        "includedPaths": [
        {
            "path": "/*"
        }
        ],
        "spatialIndexes": [
        {
            "path": "/*",
            "types": [
                "Point",
                "Polygon",
                "MultiPolygon",
                "LineString"
            ]
        }
    ],
       "excludedPaths":[]
    }
```

> [!NOTE]
> If the location GeoJSON value within the document is malformed or invalid, then it will not get indexed for spatial querying. You can validate location values using ST_ISVALID and ST_ISVALIDDETAILED.
>
>
>

You can also [modify indexing policy](how-to-manage-indexing-policy.md) using the Azure CLI, PowerShell, or any SDK.

## Next steps

Now that you have learned how to get started with geospatial support in Azure Cosmos DB, next you can:

* Learn more about [Azure Cosmos DB Query](sql-query-getting-started.md)
* Learn more about [Querying spatial data with Azure Cosmos DB](sql-query-geospatial-query.md)
* Learn more about [Geospatial and GeoJSON location data in Azure Cosmos DB](sql-query-geospatial-intro.md)