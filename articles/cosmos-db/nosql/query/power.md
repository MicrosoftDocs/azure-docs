---
title: POWER
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a number multipled by itself a specified number of times.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# POWER (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the value of the specified expression multipled by itself the given number of times.  
  
## Syntax
  
```sql
POWER(<numeric_expr_1>, <numeric_expr_2>)  
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr_1`** | A numeric expression. |
| **`numeric_expr_2`** | A numeric expression indicating the power to raise `numeric_expr_1`. |

## Return types

Returns a numeric expression.  
  
## Examples

The following example demonstrates raising a number to various powers.  

```sql
SELECT VALUE {
    oneFirstPower: POWER(1, 1),
    twoSquared: POWER(2, 2),
    threeCubed: POWER(3, 3),
    fourFourthPower: POWER(4, 4),
    fiveFithPower: POWER(5, 5),
    zeroSquared: POWER(0, 2),
    nullCubed: POWER(null, 3),
    twoNullPower: POWER(2, null)
}
```

```json
[
  {
    "oneFirstPower": 1,
    "twoSquared": 4,
    "threeCubed": 27,
    "fourFourthPower": 256,
    "fiveFithPower": 3125,
    "zeroSquared": 0
  }
]
```

## Remarks

- This system function doesn't utilize the index.

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [Introduction to Azure Cosmos DB](../../introduction.md)
