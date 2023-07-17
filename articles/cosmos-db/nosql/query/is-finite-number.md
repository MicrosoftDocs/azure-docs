---
title: IS_FINITE_NUMBER
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a boolean indicating if a number is a countable (finite) number.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# IS_FINITE_NUMBER (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean indicating if a number is a finite number (not infinite).

## Syntax

```sql
IS_FINITE_NUMBER(<numeric_expr>)
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a boolean.

## Examples

This example demonstrates the function with various static values.

```sql
SELECT VALUE {
    finiteValue: IS_FINITE_NUMBER(1234.567),
    infiniteValue: IS_FINITE_NUMBER(8.9 / 0.0),
    nanValue: IS_FINITE_NUMBER(SQRT(-1.0))
}
```

```json
[
  {
    "finiteValue": true,
    "infiniteValue": false,
    "nanValue": false
  }
]
```

## See also

- [System functions](system-functions.yml)
- [`IS_NUMBER`](is-number.md)
