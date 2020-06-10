---
title: Index geospatial data with Azure Cosmos DB
description: Index spatial data with Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/03/2020
ms.author: tisande

---
# Index geospatial data with Azure Cosmos DB

We designed Azure Cosmos DB's database engine to be truly schema agnostic and provide first class support for JSON. The write optimized database engine of Azure Cosmos DB natively understands spatial data represented in the GeoJSON standard.

In a nutshell, the geometry is projected from geodetic coordinates onto a 2D plane then divided progressively into cells using a **quadtree**. These cells are mapped to 1D based on the location of the cell within a **Hilbert space filling curve**, which preserves locality of points. Additionally when location data is indexed, it goes through a process known as **tessellation**, that is, all the cells that intersect a location are identified and stored as keys in the Azure Cosmos DB index. At query time, arguments like points and Polygons are also tessellated to extract the relevant cell ID ranges, then used to retrieve data from the index.

If you specify an indexing policy that includes spatial index for /* (all paths), then all data found within the container is indexed for efficient spatial queries.

> [!NOTE]
> Azure Cosmos DB supports indexing of Points, LineStrings, Polygons, and MultiPolygons
>
>

## Modifying geospatial data type

In your container, the **Geospatial Configuration** specifies how the spatial data will be indexed. Specify one **Geospatial Configuration** per container: geography or geometry.

You can toggle between the **geography** and **geometry** spatial type in the Azure portal. It's important that you create a [valid spatial geometry indexing policy with a bounding box](#geometry-data-indexing-examples) before switching to the geometry spatial type.

Here's how to set the **Geospatial Configuration** in **Data Explorer** within the Azure portal:

![Setting geospatial configuration](./media/sql-query-geospatial-index/geospatial-configuration.png)

You can also modify the `geospatialConfig` in the .NET SDK to adjust the **Geospatial Configuration**:

If not specified, the `geospatialConfig` will default to the geography data type. When you modify the `geospatialConfig`, all existing geospatial data in the container will be reindexed.

Here is an example for modifying the geospatial data type to `geometry` by setting the `geospatialConfig` property and adding a **boundingBox**:

```csharp
    //Retrieve the container's details
    ContainerResponse containerResponse = await client.GetContainer("db", "spatial").ReadContainerAsync();
    //Set GeospatialConfig to Geometry
    GeospatialConfig geospatialConfig = new GeospatialConfig(GeospatialType.Geometry);
    containerResponse.Resource.GeospatialConfig = geospatialConfig;
    // Add a spatial index including the required boundingBox
    SpatialPath spatialPath = new SpatialPath
            {  
                Path = "/locations/*",
                BoundingBox = new BoundingBoxProperties(){
                    Xmin = 0,
                    Ymin = 0,
                    Xmax = 10,
                    Ymax = 10
                }
            };
    spatialPath.SpatialTypes.Add(SpatialType.Point);
    spatialPath.SpatialTypes.Add(SpatialType.LineString);
    spatialPath.SpatialTypes.Add(SpatialType.Polygon);
    spatialPath.SpatialTypes.Add(SpatialType.MultiPolygon);

    containerResponse.Resource.IndexingPolicy.SpatialIndexes.Add(spatialPath);

    // Update container with changes
    await client.GetContainer("db", "spatial").ReplaceContainerAsync(containerResponse.Resource);
```

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

You can also [modify indexing policy](how-to-manage-indexing-policy.md) using the Azure CLI, PowerShell, or any SDK.

## Geometry data indexing examples

With the **geometry** data type, similar to the geography data type, you must specify relevant paths and types to index. In addition, you must also specify a `boundingBox` within the indexing policy to indicate the desired area to be indexed for that specific path. Each geospatial path requires its own`boundingBox`.

The bounding box consists of the following properties:

- **xmin**: the minimum indexed x coordinate
- **ymin**: the minimum indexed y coordinate
- **xmax**: the maximum indexed x coordinate
- **ymax**: the maximum indexed y coordinate

A bounding box is required because geometric data occupies a plane that can be infinite. Spatial indexes, however, require a finite space. For the **geography** data type, the Earth is the boundary and you do not need to set a bounding box.

Create a bounding box that contains all (or most) of your data. Only operations computed on the objects that are entirely inside the bounding box will be able to utilize the spatial index. Making the bounding box larger than necessary will negatively impact query performance.

Here is an example indexing policy that indexes **geometry** data with **geospatialConfig** set to `geometry`:

```json
 {
    "indexingMode": "consistent",
    "automatic": true,
    "includedPaths": [
        {
            "path": "/*"
        }
    ],
    "excludedPaths": [
        {
            "path": "/\"_etag\"/?"
        }
    ],
    "spatialIndexes": [
        {
            "path": "/locations/*",
            "types": [
                "Point",
                "LineString",
                "Polygon",
                "MultiPolygon"
            ],
            "boundingBox": {
                "xmin": -10,
                "ymin": -20,
                "xmax": 10,
                "ymax": 20
            }
        }
    ]
}
```

The above indexing policy has a **boundingBox** of (-10, 10) for x coordinates and (-20, 20) for y coordinates. The container with the above indexing policy will index all Points, Polygons, MultiPolygons, and LineStrings that are entirely within this region.

> [!NOTE]
> If you try to add an indexing policy with a **boundingBox** to a container with `geography` data type, it will fail. You should modify the container's **geospatialConfig** to be `geometry` before adding a **boundingBox**. You can add data and modify the remainder of
> your indexing policy (such as the paths and types) either before or after selecting the geospatial data type for the container.

## Next steps

Now that you have learned how to get started with geospatial support in Azure Cosmos DB, next you can:

* Learn more about [Azure Cosmos DB Query](sql-query-getting-started.md)
* Learn more about [Querying spatial data with Azure Cosmos DB](sql-query-geospatial-query.md)
* Learn more about [Geospatial and GeoJSON location data in Azure Cosmos DB](sql-query-geospatial-intro.md)
