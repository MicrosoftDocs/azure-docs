---
title: SetUnion
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that gets all expressions in two sets.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# SetUnion (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Gathers expressions in two sets and returns a set of expressions containing all expressions in both sets with no duplicates.

## Syntax

```sql
SetUnion(<array_expr_1>, <array_expr_2>)
```

## Arguments

| | Description |
| --- | --- |
| **`array_expr_1`** | An array of expressions. |
| **`array_expr_2`** | An array of expressions. |

## Return types

Returns an array of expressions.

## Examples

This first example uses the function with static arrays to demonstrate the union functionality.

```sql
SELECT VALUE {
    simpleUnion: SetUnion([1, 2, 3, 4], [3, 4, 5, 6]),
    emptyUnion: SetUnion([1, 2, 3, 4], []),
    duplicatesUnion: SetUnion([1, 2, 3, 4], [1, 1, 1, 1]),
    unorderedUnion: SetUnion([1, 2, "A", "B"], ["A", 1])
}
```

```json
[
  {
    "simpleUnion": [1, 2, 3, 4, 5, 6],
    "emptyUnion": [1, 2, 3, 4],
    "duplicatesUnion": [1, 2, 3, 4],
    "unorderedUnion": [1, 2, "A", "B"]
  }
]
```

This last example uses two items in a container that share values within an array property.

```json
[
  {
    "name": "Yarbeck Men's Coat",
    "colors": [
      {
        "season": "Winter",
        "values": [
          "Cutty Sark",
          "Horizon",
          "Russet",
          "Fuscous"
        ]
      },
      {
        "season": "Summer",
        "values": [
          "Fuscous",
          "Horizon",
          "Tacha"
        ]
      }
    ]
  }
]
```

```sql
SELECT
    p.name,    
    SetUnion(p.colors[0].values, p.colors[1].values) AS allColors
FROM
    products p
```

```json
[
  {
    "name": "Yarbeck Men's Coat",
    "allColors": [
      "Cutty Sark",
      "Horizon",
      "Russet",
      "Fuscous",
      "Tacha"
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
