---
title: Querying geospatial data with Azure Cosmos DB
description: Querying spatial data with Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/20/2020
ms.author: tisande

---
# Querying geospatial data with Azure Cosmos DB

This article will cover how to query geospatial data in Azure Cosmos DB using SQL and LINQ. Currently storing and accessing geospatial data is supported by Azure Cosmos DB SQL API accounts only. Azure Cosmos DB supports the following Open Geospatial Consortium (OGC) built-in functions for geospatial querying. For more information on the complete set of built-in functions in the SQL language, see [Query System Functions in Azure Cosmos DB](sql-query-system-functions.md).

## Spatial SQL built-in functions

Here is a list of geospatial system functions useful for querying in Azure Cosmos DB:

|**Usage**|**Description**|
|---|---|
| ST_DISTANCE (spatial_expr, spatial_expr) | Returns the distance between the two GeoJSON Point, Polygon, or LineString expressions.|
|ST_WITHIN (spatial_expr, spatial_expr) | Returns a Boolean expression indicating whether the first GeoJSON object (Point, Polygon, or LineString) is within the second GeoJSON object (Point, Polygon, or LineString).|
|ST_INTERSECTS (spatial_expr, spatial_expr)| Returns a Boolean expression indicating whether the two specified GeoJSON objects (Point, Polygon, or LineString) intersect.|
|ST_ISVALID| Returns a Boolean value indicating whether the specified GeoJSON Point, Polygon, or LineString expression is valid.|
| ST_ISVALIDDETAILED| Returns a JSON value containing a Boolean value if the specified GeoJSON Point, Polygon, or LineString expression is valid. If invalid, it returns the reason as a string value.|

Spatial functions can be used to perform proximity queries against spatial data. For example, here's a query that returns all family documents that are within 30 km of the specified location using the `ST_DISTANCE` built-in function.

**Query**

```sql
    SELECT f.id
    FROM Families f
    WHERE ST_DISTANCE(f.location, {"type": "Point", "coordinates":[31.9, -4.8]}) < 30000
```

**Results**

```json
    [{
      "id": "WakefieldFamily"
    }]
```

If you include spatial indexing in your indexing policy, then "distance queries" will be served efficiently through the index. For more information on spatial indexing, see [geospatial indexing](sql-query-geospatial-index.md). If you don't have a spatial index for the specified paths, the query will do a scan of the container.

`ST_WITHIN` can be used to check if a point lies within a Polygon. Commonly Polygons are used to represent boundaries like zip codes, state boundaries, or natural formations. Again if you include spatial indexing in your indexing policy, then "within" queries will be served efficiently through the index.

Polygon arguments in `ST_WITHIN` can contain only a single ring, that is, the Polygons must not contain holes in them.

**Query**

```sql
    SELECT *
    FROM Families f
    WHERE ST_WITHIN(f.location, {
        "type":"Polygon",
        "coordinates": [[[31.8, -5], [32, -5], [32, -4.7], [31.8, -4.7], [31.8, -5]]]
    })
```

**Results**

```json
    [{
      "id": "WakefieldFamily",
    }]
```

> [!NOTE]
> Similar to how mismatched types work in Azure Cosmos DB query, if the location value specified in either argument is malformed or invalid, then it evaluates to **undefined** and the evaluated document to be skipped from the query results. If your query returns no results, run `ST_ISVALIDDETAILED` to debug why the spatial type is invalid.
>
>

Azure Cosmos DB also supports performing inverse queries, that is, you can index polygons or lines in Azure Cosmos DB, then query for the areas that contain a specified point. This pattern is commonly used in logistics to identify, for example, when a truck enters or leaves a designated area.

**Query**

```sql
    SELECT *
    FROM Areas a
    WHERE ST_WITHIN({"type": "Point", "coordinates":[31.9, -4.8]}, a.location)
```

**Results**

```json
    [{
      "id": "MyDesignatedLocation",
      "location": {
        "type":"Polygon",
        "coordinates": [[[31.8, -5], [32, -5], [32, -4.7], [31.8, -4.7], [31.8, -5]]]
      }
    }]
```

`ST_ISVALID` and `ST_ISVALIDDETAILED` can be used to check if a spatial object is valid. For example, the following query checks the validity of a point with an out of range latitude value (-132.8). `ST_ISVALID` returns just a Boolean value, and `ST_ISVALIDDETAILED` returns the Boolean and a string containing the reason why it is considered invalid.

**Query**

```sql
    SELECT ST_ISVALID({ "type": "Point", "coordinates": [31.9, -132.8] })
```

**Results**

```json
    [{
      "$1": false
    }]
```

These functions can also be used to validate Polygons. For example, here we use `ST_ISVALIDDETAILED` to validate a Polygon that is not closed.

**Query**

```sql
    SELECT ST_ISVALIDDETAILED({ "type": "Polygon", "coordinates": [[ 
        [ 31.8, -5 ], [ 31.8, -4.7 ], [ 32, -4.7 ], [ 32, -5 ] 
        ]]})
```

**Results**

```json
    [{
       "$1": { 
            "valid": false, 
            "reason": "The Polygon input is not valid because the start and end points of the ring number 1 are not the same. Each ring of a Polygon must have the same start and end points." 
          }
    }]
```

## LINQ querying in the .NET SDK

The SQL .NET SDK also providers stub methods `Distance()` and `Within()` for use within LINQ expressions. The SQL LINQ provider translates this method calls to the equivalent SQL built-in function calls (ST_DISTANCE and ST_WITHIN respectively).

Here's an example of a LINQ query that finds all documents in the Azure Cosmos container whose `location` value is within a radius of 30 km of the specified point using LINQ.

**LINQ query for Distance**

```csharp
    foreach (UserProfile user in container.GetItemLinqQueryable<UserProfile>(allowSynchronousQueryExecution: true)
        .Where(u => u.ProfileType == "Public" && u.Location.Distance(new Point(32.33, -4.66)) < 30000))
    {
        Console.WriteLine("\t" + user);
    }
```

Similarly, here's a query for finding all the documents whose `location` is within the specified box/Polygon.

**LINQ query for Within**

```csharp
    Polygon rectangularArea = new Polygon(
        new[]
        {
            new LinearRing(new [] {
                new Position(31.8, -5),
                new Position(32, -5),
                new Position(32, -4.7),
                new Position(31.8, -4.7),
                new Position(31.8, -5)
            })
        });

    foreach (UserProfile user in container.GetItemLinqQueryable<UserProfile>(allowSynchronousQueryExecution: true)
         .Where(a => a.Location.Within(rectangularArea)))
    {
        Console.WriteLine("\t" + user);
    }
```

## Next steps

Now that you have learned how to get started with geospatial support in Azure Cosmos DB, next you can:

* Learn more about [Azure Cosmos DB Query](sql-query-getting-started.md)
* Learn more about [Geospatial and GeoJSON location data in Azure Cosmos DB](sql-query-geospatial-intro.md)
* Learn more about [Index spatial data with Azure Cosmos DB](sql-query-geospatial-index.md)
