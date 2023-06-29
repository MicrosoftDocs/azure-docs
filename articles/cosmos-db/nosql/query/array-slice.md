---
title: ARRAY_SLICE
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a subset of the items in an array.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# ARRAY_SLICE (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a subset of an array expression using the index and length specified.
  
## Syntax
  
```sql
ARRAY_SLICE(<array_expr>, <numeric_expr_1> [, <numeric_expr_2>])  
```  
  
## Arguments

| | Description |
| --- | --- |
| **`array_expr`** | An array expression. |
| **`numeric_expr_1`** | A numeric expression indicating the index where to begin the array for the subset. Optionally, negative values can be used to specify the starting index relative to the last element of the array. |
| **`numeric_expr_2` *(Optional)*** | An optional numeric expression indicating the maximum length of elements in the resulting array. |

## Return types

Returns an array expression.  

## Examples
  
The following example shows how to get different slices of an array using the function.  
  
```sql
SELECT VALUE {
    sliceFromStart: ARRAY_SLICE([70, 86, 92, 99, 85, 90, 82], 0),
    sliceFromSecond: ARRAY_SLICE([70, 86, 92, 99, 85, 90, 82], 1),
    sliceFromLast: ARRAY_SLICE([70, 86, 92, 99, 85, 90, 82], -1),
    sliceFromSecondToLast: ARRAY_SLICE([70, 86, 92, 99, 85, 90, 82], -2),
    sliceThreeFromStart: ARRAY_SLICE([70, 86, 92, 99, 85, 90, 82], 0, 3),
    sliceTwelveFromStart: ARRAY_SLICE([70, 86, 92, 99, 85, 90, 82], 0, 12),
    sliceFiveFromThird: ARRAY_SLICE([70, 86, 92, 99, 85, 90, 82], 3, 5),
    sliceOneFromSecondToLast: ARRAY_SLICE([70, 86, 92, 99, 85, 90, 82], -2, 1)
}
```

```json
[
  {
    "sliceFromStart": [70, 86, 92, 99, 85, 90, 82],
    "sliceFromSecond": [86, 92, 99, 85, 90, 82],
    "sliceFromLast": [82],
    "sliceFromSecondToLast": [90, 82],
    "sliceThreeFromStart": [70, 86, 92],
    "sliceTwelveFromStart": [70, 86, 92, 99, 85, 90, 82],
    "sliceFiveFromThird": [99, 85, 90, 82],
    "sliceOneFromSecondToLast": [90]
  }
]
```  

## Remarks

- This system function doesn't use the index.

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`ARRAY_LENGTH`](array-length.md)
