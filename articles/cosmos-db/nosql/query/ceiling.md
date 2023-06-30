---
title: CEILING
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the smallest integer value greater than or equal to the specified numeric expression.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# CEILING (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the smallest integer value greater than or equal to the specified numeric expression.  
  
## Syntax
  
```sql
CEILING(<numeric_expr>)  
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
    ceilingPostiveNumber: CEILING(62.6),
    ceilingNegativeNumber: CEILING(-145.12),
    ceilingSmallNumber: CEILING(0.2989),
    ceilingZero: CEILING(0.0),
    ceilingNull: CEILING(null)
}
```

```json
[
  {
    "ceilingPostiveNumber": 63,
    "ceilingNegativeNumber": -145,
    "ceilingSmallNumber": 1,
    "ceilingZero": 0
  }
]
```

## Remarks

- This system function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [Introduction to Azure Cosmos DB](../../introduction.md)
