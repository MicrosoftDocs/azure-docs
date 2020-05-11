---
title: Geospatial and GeoJSON location data in Azure Cosmos DB
description: Understand how to create spatial objects with Azure Cosmos DB and the SQL API.
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/20/2020
ms.author: tisande

---
# Geospatial and GeoJSON location data in Azure Cosmos DB

This article is an introduction to the geospatial functionality in Azure Cosmos DB. Currently storing and accessing geospatial data is supported by Azure Cosmos DB SQL API accounts only. After reading our documentation on geospatial indexing you will be able to answer the following questions:

* How do I store spatial data in Azure Cosmos DB?
* How can I query geospatial data in Azure Cosmos DB in SQL and LINQ?
* How do I enable or disable spatial indexing in Azure Cosmos DB?

## Introduction to spatial data

Spatial data describes the position and shape of objects in space. In most applications, these correspond to objects on the earth and geospatial data. Spatial data can be used to represent the location of a person, a place of interest, or the boundary of a city, or a lake. Common use cases often involve proximity queries, for example, "find all coffee shops near my current location."

Azure Cosmos DB's SQL API supports two spatial data types: the **geometry** data type and the **geography** data type.

- The **geometry** type represents data in a Euclidean (flat) coordinate system
- The **geography** type represents data in a round-earth coordinate system.

## Supported data types

Azure Cosmos DB supports indexing and querying of geospatial point data that's represented using the [GeoJSON specification](https://tools.ietf.org/html/rfc7946). GeoJSON data structures are always valid JSON objects, so they can be stored and queried using Azure Cosmos DB without any specialized tools or libraries.

Azure Cosmos DB supports the following spatial data types:

- Point
- LineString
- Polygon
- MultiPolygon

### Points

A **Point** denotes a single position in space. In geospatial data, a Point represents the exact location, which could be a street address of a grocery store, a kiosk, an automobile, or a city.  A point is represented in GeoJSON (and Azure Cosmos DB) using its coordinate pair or longitude and latitude.

Here's an example JSON for a point:

**Points in Azure Cosmos DB**

```json
{
    "type":"Point",
    "coordinates":[ 31.9, -4.8 ]
}
```

Spatial data types can be embedded in an Azure Cosmos DB document as shown in this example of a user profile containing location data:

**Use Profile with Location stored in Azure Cosmos DB**

```json
{
    "id":"cosmosdb-profile",
    "screen_name":"@CosmosDB",
    "city":"Redmond",
    "topics":[ "global", "distributed" ],
    "location":{
        "type":"Point",
        "coordinates":[ 31.9, -4.8 ]
    }
}
```

### Points in a geometry coordinate system

For the **geometry** data type, GeoJSON specification specifies the horizontal axis first and the vertical axis second.

### Points in a geography coordinate system

For the **geography** data type, GeoJSON specification specifies longitude first and latitude second. Like in other mapping applications, longitude and latitude are angles and represented in terms of degrees. Longitude values are measured from the Prime Meridian and are between -180 degrees and 180.0 degrees, and latitude values are measured from the equator and are between -90.0 degrees and 90.0 degrees.

Azure Cosmos DB interprets coordinates as represented per the WGS-84 reference system. See below for more details about coordinate reference systems.

### LineStrings

**LineStrings** represent a series of two or more points in space and the line segments that connect them. In geospatial data, LineStrings are commonly used to represent highways or rivers.

**LineStrings in GeoJSON**

```json
    "type":"LineString",
    "coordinates":[ [
        [ 31.8, -5 ],
        [ 31.8, -4.7 ]
    ] ]
```

### Polygons

A **Polygon** is a boundary of connected points that forms a closed LineString. Polygons are commonly used to represent natural formations like lakes or political jurisdictions like cities and states. Here's an example of a Polygon in Azure Cosmos DB:

**Polygons in GeoJSON**

```json
{
    "type":"Polygon",
    "coordinates":[ [
        [ 31.8, -5 ],
        [ 31.8, -4.7 ],
        [ 32, -4.7 ],
        [ 32, -5 ],
        [ 31.8, -5 ]
    ] ]
}
```

> [!NOTE]
> The GeoJSON specification requires that for valid Polygons, the last coordinate pair provided should be the same as the first, to create a closed shape.
>
> Points within a Polygon must be specified in counter-clockwise order. A Polygon specified in clockwise order represents the inverse of the region within it.
>
>

### MultiPolygons

A **MultiPolygon** is an array of zero or more Polygons. **MultiPolygons** cannot overlap sides or have any common area. They may touch at one or more points.

**MultiPolygons in GeoJSON**

```json
{
    "type":"MultiPolygon",
    "coordinates":[[[
        [52.0, 12.0],
        [53.0, 12.0],
        [53.0, 13.0],
        [52.0, 13.0],
        [52.0, 12.0]
        ]],
        [[
        [50.0, 0.0],
        [51.0, 0.0],
        [51.0, 5.0],
        [50.0, 5.0],
        [50.0, 0.0]
        ]]]
}
```

## Coordinate reference systems

Since the shape of the earth is irregular, coordinates of geography geospatial data are represented in many coordinate reference systems (CRS), each with their own frames of reference and units of measurement. For example, the "National Grid of Britain" is a reference system is accurate for the United Kingdom, but not outside it.

The most popular CRS in use today is the World Geodetic System  [WGS-84](https://earth-info.nga.mil/GandG/update/index.php). GPS devices, and many mapping services including Google Maps and Bing Maps APIs use WGS-84. Azure Cosmos DB supports indexing and querying of geography geospatial data using the WGS-84 CRS only.

## Creating documents with spatial data
When you create documents that contain GeoJSON values, they are automatically indexed with a spatial index in accordance to the indexing policy of the container. If you're working with an Azure Cosmos DB SDK in a dynamically typed language like Python or Node.js, you must create valid GeoJSON.

**Create Document with Geospatial data in Node.js**

```javascript
var userProfileDocument = {
    "id":"cosmosdb",
    "location":{
        "type":"Point",
        "coordinates":[ -122.12, 47.66 ]
    }
};

client.createDocument(`dbs/${databaseName}/colls/${collectionName}`, userProfileDocument, (err, created) => {
    // additional code within the callback
});
```

If you're working with the SQL APIs, you can use the `Point`, `LineString`, `Polygon`, and `MultiPolygon` classes within the `Microsoft.Azure.Cosmos.Spatial` namespace to embed location information within your application objects. These classes help simplify the serialization and deserialization of spatial data into GeoJSON.

**Create Document with Geospatial data in .NET**

```csharp
using Microsoft.Azure.Cosmos.Spatial;

public class UserProfile
{
    [JsonProperty("id")]
    public string id { get; set; }

    [JsonProperty("location")]
    public Point Location { get; set; }

    // More properties
}

await container.CreateItemAsync( new UserProfile
    {
        id = "cosmosdb",
        Location = new Point (-122.12, 47.66)
    });
```

If you don't have the latitude and longitude information, but have the physical addresses or location name like city or country/region, you can look up the actual coordinates by using a geocoding service like Bing Maps REST Services. Learn more about Bing Maps geocoding [here](https://msdn.microsoft.com/library/ff701713.aspx).

## Next steps

Now that you have learned how to get started with geospatial support in Azure Cosmos DB, next you can:

* Learn more about [Azure Cosmos DB Query](sql-query-getting-started.md)
* Learn more about [Querying spatial data with Azure Cosmos DB](sql-query-geospatial-query.md)
* Learn more about [Index spatial data with Azure Cosmos DB](sql-query-geospatial-index.md)