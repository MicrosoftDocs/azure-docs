---
title: VectorDistance
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that return the similarity score between two vectors for one or more items in a container.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: azure-cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.devlang: nosql
ms.date: 08/06/2024
ms.custom: query-reference, build-2024
---

# VectorDistance (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the similarity score between two specified vectors.

> [!NOTE]
> For more information, see [Geospatial and GeoJSON location data](geospatial-intro.md).

## Syntax

```nosql
VectorDistance(<vector_expr1>, <vector_expr2>, [<bool_expr>], [<obj_expr>])  
```

## Arguments

| | Description |
| --- | --- |
| **`spatial_expr_1`** | An array of `float32` or smaller. |
| **`spatial_expr_2`** | An array of `float32` or smaller. |
| **`bool_expr`** | A boolean specifying how the computed value is used in an ORDER BY expression. If `true`, then brute force is used. A value of `false` uses any index defined on the vector property, if it exists. Default value is `false`. |
|**`obj_expr`**| A JSON formatted object literal used to specify options for the vector distance calculation. Valid items include `distanceFunction` and `dataType`. |
| **`distanceFunction`** | The metric used to compute distance/similarity. |
| **`dataType`** | The data type of the vectors. `float32`, `int8`, `uint8` values. Default value is `float32`. |

Supported metrics for `distanceFunction` are:

- [`cosine`](https://en.wikipedia.org/wiki/Cosine_similarity), which has values from `-1` (least similar) to `+1` (most similar).  
- [`dotproduct`](https://en.wikipedia.org/wiki/Dot_product), which has values from `-∞` (`-inf`) (least similar) to `+∞` (`+inf`) (most similar).
- [`euclidean`](https://en.wikipedia.org/wiki/Euclidean_distance), which has values from `0` (most similar) to `+∞` (`+inf`) (least similar).

## Return types

Returns a numeric expression that enumerates the similarity score between two expressions.

## Examples

This first example includes only the required arguments.

```sql
SELECT VALUE {
  name: s.name, 
  similarityScore: VectorDistance(s.vector1, s.vector2)
}
FROM 
  source s
ORDER BY 
  VectorDistance(s.vector1, s.vector2)
```

This next example also includes optional arguments.

```sql
SELECT VALUE {
  name: s.name, 
  similarityScore: VectorDistance(s.vector1, s.vector2, true, {'distanceFunction':'cosine', 'dataType':'float32',})
}
FROM 
  source s
ORDER BY 
  VectorDistance(s.vector1, s.vector2)
```

## Remarks

- This function requires enrollment in the [Azure Cosmos DB NoSQL Vector Search preview feature](../vector-search.md#enroll-in-the-vector-search-preview-feature).
- This function benefits from a [vector index](../../index-policy.md#vector-indexes)
- if `false` is given as the optional `bool_expr`, then the vector index defined on the path is used, if one exists. If no index is defined on the vector path, then this function reverts to full scan and incurs higher RU charges and higher latency than if using a vector index.
- When `VectorDistance` is used in an `ORDER BY` clause, no direction needs to be specified for the `ORDER BY` as the results are always sorted in order of most similar (first) to least similar (last) based on the similarity metric used.
- The result is expressed as a similarity score.

## Related content

- [System functions](system-functions.yml)
- [Setup Azure Cosmos DB for NoSQL for vector search](../vector-search.md).
- [vector index](../../index-policy.md#vector-indexes)
