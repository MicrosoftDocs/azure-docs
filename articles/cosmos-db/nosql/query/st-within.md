---
title: ST_WITHIN
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns if one GeoJSON object is within another.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# ST_WITHIN (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean expression indicating whether the GeoJSON object (GeoJSON **Point**, **Polygon**, or **LineString** expression) specified in the first argument is within the GeoJSON object in the second argument.  

## Syntax

```sql
ST_WITHIN(<spatial_expr_1>, <spatial_expr_2>)  
```

## Arguments

| | Description |
| --- | --- |
| **`spatial_expr_1`** | Any valid GeoJSON **Point**, **Polygon**, **MultiPolygon** or **LineString** expression. |
| **`spatial_expr_2`** | Any valid GeoJSON **Point**, **Polygon**, **MultiPolygon** or **LineString** expression. |

## Return types

Returns a boolean value.  

## Examples

The following example shows how to find if a **Point** is within a **Polygon**.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/st-within/query.sql" highlight="2-32":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/st-within/result.json":::

## Remarks

- This function benefits from a [geospatial index](../../index-policy.md#spatial-indexes) except in queries with aggregates.
- The GeoJSON specification requires that points within a Polygon be specified in counter-clockwise order. A Polygon specified in clockwise order represents the inverse of the region within it.

## Related content

- [System functions](system-functions.yml)
- [`ST_INTERSECT`](st-intersects.md)
