---
title: VectorDistance
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that return the similarity score between two vectors.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.devlang: nosql
ms.date: 5/5/2024
ms.custom: query-reference, build-2024
---

# VectorDistance (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the similarity score between two specified vectors.

> [!NOTE]
> For more information, see [Geospatial and GeoJSON location data](geospatial-intro.md).

## Syntax

```nosql
VECTORDISTANCE(<vector_expr1>, <vector_expr2>, [<bool_expr>], [<obj_expr>])  
```

## Arguments

| | Description |
| --- | --- |
| **`spatial_expr_1`** | An array of `float32` or smaller.|
| **`spatial_expr_2`** | An array of `float32` or smaller.|
| **`bool_expr`** | A boolean specifying how the computed value is used in an ORDER BY expression. If `true`, then brute force is used. A value of `false` will leverage any index defined on the vector property, if it exists. Default value is `false`.|
|**`obj_expr`**| A JSON formatted object literal used to specify options for the vector distance calculation. Valid items include `distanceFunction` and `dataType`.|
| **`distanceFunction`** | The function used to compute similarity score.`cosine`, `euclidean`, or `dotproduct`. Default value is `cosine`.|
| **`dataType`** | The data type of the vectors. `float32`, `float16`, `int8`, `uint8` values. Default value is `float32`. |

## Return types

Returns a numeric expression that enumerates the similarity score between two expressions.

## Examples

### With required arguments
```sql
SELECT c.name, VectorDistance(c.vector1, c.vector2) AS SimilarityScore
FROM c
ORDER BY VectorDistance(c.vector1, c.vector2)
```

### With optional arguments
```sql
SELECT c.name, VectorDistance(c.vector1, c.vector2, true, {'distanceFunction':'cosine', 'dataType':'float32',}) AS SimilarityScore
FROM c
ORDER BY VectorDistance(c.vector1, c.vector2)
```

## Remarks
- This function requires enrollment in the [Azure Cosmos DB NoSQL Vector Search preview feature](../vector-search.md#enroll-in-the-vector-search-preview-feature).
- This function benefits from a [vector index](../../index-policy.md#vector-indexes)
- if `false` is given as the optional `bool_expr`, then the vector index defined on the path is used, if one exists. If no index is defined on the vector path, then this will revert to full scan and incur higher RU charges and higher latency than if using a vector index. 
- When `VectorDistance` is used in an `ORDER BY` clause, no direction can be specified for the `ORDER BY`, as the results will always be sorted in order of most similar (first) to least similar (last) based on the similarity metric used. If a direction such as `ASC` or `DESC` is specified, an error will occur. 
- The result is expressed as a similarity score.

## Related content
- [System functions](system-functions.yml)
- [Setup Azure Cosmos DB for NoSQL for vector search](../vector-search.md).
- [vector index](../../index-policy.md#vector-indexes)
