---
title: ST_ISVALID
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns if a GeoJSON object is valid.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# ST_ISVALID (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean value indicating whether the specified GeoJSON **Point**, **Polygon**, **MultiPolygon**, or **LineString** expression is valid.

## Syntax

```sql
ST_ISVALID(<spatial_expr>)  
```

## Arguments

| | Description |
| --- | --- |
| **`spatial_expr`** | Any valid GeoJSON **Point**, **Polygon**, **MultiPolygon**, or **LineString** expression. |

## Return types

Returns a boolean value.  

## Examples

The following example how to check validity of multiple objects.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/st-isvalid/query.sql" highlight="2-9":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/st-isvalid/result.json":::

## Remarks

- The GeoJSON specification requires that points within a Polygon be specified in counter-clockwise order. A Polygon specified in clockwise order represents the inverse of the region within it.

## Related content

- [System functions](system-functions.yml)
- [`ST_ISVALIDDETAILED`](st-isvaliddetailed.md)
