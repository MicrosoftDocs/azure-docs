---
title: FLOOR
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns return the largest integer less than or equal to the specified numeric expression
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# FLOOR (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the largest integer less than or equal to the specified numeric expression.  
  
## Syntax
  
```sql
FLOOR(<numeric_expr>)  
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.  
  
## Examples

The following example shows positive numeric, negative, and zero values evaluated with this function.  

```sql
SELECT VALUE {
    floorPostiveNumber: FLOOR(62.6),
    floorNegativeNumber: FLOOR(-145.12),
    floorSmallNumber: FLOOR(0.2989),
    floorZero: FLOOR(0.0),
    floorNull: FLOOR(null)
}
```

```json
[
  {
    "floorPostiveNumber": 62,
    "floorNegativeNumber": -146,
    "floorSmallNumber": 0,
    "floorZero": 0
  }
]
```

## Remarks

- This system function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [Introduction to Azure Cosmos DB](../../introduction.md)
