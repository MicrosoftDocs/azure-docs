---
title: CHOOSE
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the expression at the specified index of a list.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# CHOOSE (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the expression at the specified index of a list, or Undefined if the index exceeds the bounds of the list\.

## Syntax

```sql
CHOOSE(<numeric_expr>, <expr_1> [, <expr_N>])
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression, which specifies the index used to get a specific expression in the list. The starting index of the list is `1`. |
| **`expr_1`** | The first expression in the list. |
| **`expr_N` *(Optional)*** | Optional expression\[s\], which can contain a variable number of expressions up to the `N`th item in the list. |

## Return types

Returns an expression, which could be of any type.

## Examples

The following example uses a static list to demonstrate various return values at different indexes.

```sql
SELECT VALUE 
    CHOOSE(1, "abc", 1, true, [1])
```

```json
[
  "abc"
]
```

This example uses a static list to demonstrate various return values at different indexes.

```sql
SELECT VALUE {
    index0: CHOOSE(0, "abc", 1, true, [1]),
    index1: CHOOSE(1, "abc", 1, true, [1]),
    index2: CHOOSE(2, "abc", 1, true, [1]),
    index3: CHOOSE(3, "abc", 1, true, [1]),
    index4: CHOOSE(4, "abc", 1, true, [1]),
    index5: CHOOSE(5, "abc", 1, true, [1])
}
```

```json
[
  {
    "index1": "abc",
    "index2": 1,
    "index3": true,
    "index4": [
      1
    ]
  }
]
```

This final example uses an existing item in a container and selects an expression from existing paths in the item.

```json
[
  {
    "id": "68719519522",
    "name": "Gremon Fins",
    "sku": "73311",
    "tags": [
      "Science Blue",
      "Turbo"
    ]
  }
]
```

```sql
SELECT
    CHOOSE(3, p.id, p.name, p.sku) AS barcode
FROM
    products p
```

```json
[
  {
    "barcode": "73311"
  }
]
```

## Remarks

- This function uses one-based list indexing. The first item in the list is referenced using the numeric index `1` instead of `0`.
- This function doesn't utilize the index.

## See also

- [System functions](system-functions.yml)
- [`ARRAY_LENGTH`](array-length.md)
