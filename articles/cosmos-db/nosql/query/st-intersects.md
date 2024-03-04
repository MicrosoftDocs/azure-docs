---
title: ST_INTERSECTS
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns whether two GeoJSON objects intersect.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/24/2023
ms.custom: query-reference
---

# ST_INTERSECTS (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean indicating whether the GeoJSON object (**Point**, **Polygon**, **MultiPolygon**, or **LineString**) specified in the first argument intersects the GeoJSON object in the second argument.  

## Syntax

```sql
ST_INTERSECTS(<spatial_expr_1>, <spatial_expr_2>)  
```  

## Arguments

| | Description |
| --- | --- |
| **`spatial_expr_1`** | Any valid GeoJSON **Point**, **Polygon**, **MultiPolygon** or **LineString** expression. |
| **`spatial_expr_2`** | Any valid GeoJSON **Point**, **Polygon**, **MultiPolygon** or **LineString** expression. |

## Return types

Returns a boolean value.  

## Examples

The following example shows how to find if two polygons intersect.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/st-intersect/query.sql" highlight="2-50":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/st-intersect/result.json":::

## Remarks

- This function benefits from a [geospatial index](../../index-policy.md#spatial-indexes) except in queries with aggregates.
- The GeoJSON specification requires that points within a Polygon be specified in counter-clockwise order. A Polygon specified in clockwise order represents the inverse of the region within it.

## Next steps

- [System functions](system-functions.yml)
- [`ST_WITHIN`](st-within.md)
