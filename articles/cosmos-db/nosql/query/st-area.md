---
title: ST_AREA in Azure Cosmos DB query language
description: Learn about SQL system function ST_AREA in Azure Cosmos DB.
author: jcocchi
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 10/21/2022
ms.author: jucocchi
ms.custom: query-reference, ignite-2022
---

# ST_AREA (Azure Cosmos DB)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

 Returns the total area of a GeoJSON Polygon or MultiPolygon expression. To learn more, see the [Geospatial and GeoJSON location data](geospatial-intro.md) article.
  
## Syntax
  
```sql
ST_AREA (<spatial_expr>)
```
  
## Arguments
  
*spatial_expr*  
   Is any valid GeoJSON Polygon or MultiPolygon object expression.
  
## Return types
  
  Returns the total area of a set of points. This is expressed in square meters for the default reference system.
  
## Examples
  
  The following example shows how to return the area of a polygon using the `ST_AREA` built-in function.
  
```sql
SELECT ST_AREA({
    "type":"Polygon",
    "coordinates":[ [
        [ 31.8, -5 ],
        [ 32, -5 ],
        [ 32, -4.7 ],
        [ 31.8, -4.7 ],
        [ 31.8, -5 ]
    ] ]
}) as Area
```

Here is the result set.

```json
[
    {
        "Area": 735970283.0522614
    }
]
```

## Remarks

Using the ST_AREA function to calculate the area of zero or one-dimensional figures like GeoJSON Points and LineStrings will result in an area of 0.

> [!NOTE]
> The GeoJSON specification requires that points within a Polygon be specified in counter-clockwise order. A Polygon specified in clockwise order represents the inverse of the region within it.

## Next steps

- [Spatial functions Azure Cosmos DB](spatial-functions.md)
- [System functions Azure Cosmos DB](system-functions.md)
- [Introduction to Azure Cosmos DB](../../introduction.md)
