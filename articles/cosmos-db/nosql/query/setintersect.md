---
title: SetIntersect
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that gets expressions that exist in two sets.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# SetIntersect (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Compares expressions in two sets and returns the set of expressions that is contained in both sets with no duplicates.

## Syntax

```sql
SetIntersect(<array_expr_1>, <array_expr_2>)
```

## Arguments

| | Description |
| --- | --- |
| **`array_expr_1`** | An array of expressions. |
| **`array_expr_2`** | An array of expressions. |

## Return types

Returns an array of expressions.

## Examples

This first example uses the function with static arrays to demonstrate the intersect functionality.

```sql
SELECT VALUE {
    simpleIntersect: SetIntersect([1, 2, 3, 4], [3, 4, 5, 6]),
    emptyIntersect: SetIntersect([1, 2, 3, 4], []),
    duplicatesIntersect: SetIntersect([1, 2, 3, 4], [1, 1, 1, 1]),
    noMatchesIntersect: SetIntersect([1, 2, 3, 4], ["A", "B"]),
    unorderedIntersect: SetIntersect([1, 2, "A", "B"], ["A", 1])
}
```

```json
[
  {
    "simpleIntersect": [3, 4],
    "emptyIntersect": [],
    "duplicatesIntersect": [1],
    "noMatchesIntersect": [],
    "unorderedIntersect": ["A", 1]
  }
]
```

This last example uses two items in a container that share values within an array property.

```json
[
  {
    "name": "Snowilla Women's Vest",
    "inStockColors": [
        "Rhino",
        "Finch"
    ],
    "colors": [
      "Finch",
      "Mine Shaft",
      "Rhino"
    ]
  }
]
```

```sql
SELECT
    p.name,
    SetIntersect(p.colors, p.inStockColors) AS availableColors
FROM
    products p
```

```json
[
  {
    "name": "Snowilla Women's Vest",
    "availableColors": [
      "Rhino",
      "Finch"
    ]
  }
]
```

## Remarks

- This function doesn't return duplicates.
- This function doesn't utilize the index.

## See also

- [System functions](system-functions.yml)
- [`ARRAY_CONTAINS`](array-contains.md)
