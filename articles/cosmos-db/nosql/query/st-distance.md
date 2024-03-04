---
title: ST_DISTANCE
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the distance between two GeoJSON Point, Polygon, MultiPolygon or LineStrings.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/24/2023
ms.custom: query-reference
---

# ST_DISTANCE (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the distance between two GeoJSON Point, Polygon, MultiPolygon or LineString expressions.

> [!NOTE]
> For more information, see [Geospatial and GeoJSON location data](geospatial-intro.md).

## Syntax

```sql
ST_DISTANCE(<spatial_expr_1>, <spatial_expr_2>)  
```

## Arguments

| | Description |
| --- | --- |
| **`spatial_expr_1`** | Any valid GeoJSON **Point**, **Polygon**, **MultiPolygon** or **LineString** expression. |
| **`spatial_expr_2`** | Any valid GeoJSON **Point**, **Polygon**, **MultiPolygon** or **LineString** expression. |

## Return types

Returns a numeric expression that enumerates the distance between two expressions.

## Examples

The following example assumes a container exists with two items.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/st-distance/seed.json" range="1-2,4-14,16-26" highlight="4-10,15-21":::

The example shows how to use the function as a filter to return items within a specified distance.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/st-distance/query.sql" highlight="3-6":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/st-distance/result.json":::

## Remarks

- The result is expressed in meters for the default reference system.
- This function benefits from a [geospatial index](../../index-policy.md#spatial-indexes) except in queries with aggregates.
- The GeoJSON specification requires that points within a Polygon be specified in counter-clockwise order. A Polygon specified in clockwise order represents the inverse of the region within it.

## Next steps

- [System functions](system-functions.yml)
- [`ST_INTERSECTS`](st-intersects.md)
