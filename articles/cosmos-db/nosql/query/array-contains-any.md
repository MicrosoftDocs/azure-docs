---
title: ARRAY_CONTAINS_ANY
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a boolean indicating whether the array contains any of the specified values.
author: seesharprun
ms.author: sidandrews
ms.reviewer: jacodel
ms.service: azure-cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.devlang: nosql
ms.date: 08/06/2024
ms.custom: query-reference
---

# ARRAY_CONTAINS_ANY (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean value indicates if the first array contains any of the following elements.

## Syntax

```nosql
ARRAY_CONTAINS_ANY(<array_expr>, <expr> [, exprN])
```

## Arguments

| | Description |
| --- | --- |
| **`array_expr`** | An array expression. |
| **`expr`** | Expression to search for within the array. |
| **`exprN`** (Optional) | One or more extra expressions to to search for within the array. |

## Return types
  
Returns a boolean value.

## Examples
  
The following example illustrates how to check for specific values or objects in an array using this function.  

```nosql
SELECT VALUE {
  matchesEntireArray: ARRAY_CONTAINS_ANY([1, true, "3", [1,2,3]], 1, true, "3", [1,2,3]),
  matchesSomeValues: ARRAY_CONTAINS_ANY([1, 2, 3, 4], 2, 3, 4, 5),
  matchSingleValue: ARRAY_CONTAINS_ANY([1, 2, 3, 4], 1, undefined),
  noMatches: ARRAY_CONTAINS_ANY([1, 2, 3, 4], 5, 6, 7, 8),
  emptyArray: ARRAY_CONTAINS_ANY([], 1, 2, 3),
  noMatchesUndefined: ARRAY_CONTAINS_ANY([1, 2, 3, 4], 5, undefined)
}
```

```json
[
  {
    "matchesEntireArray": true,
    "matchesSomeValues": true,
    "matchSingleValue": true,
    "noMatches": false,
    "emptyArray": false
  }
]
```

## Remarks

- This system function doesn't utilize the index.

## Related content

- [`ARRAY_CONTAINS`](array-contains.md)
- [`ARRAY_CONTAINS_ALL`](array-contains-all.md)
