---
title: SQRT
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the square root of the specified numeric value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# SQRT (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the square root of the specified numeric value.  

## Syntax

```sql
SQRT(<numeric_expr>)  
```  

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.  
  
## Examples
  
The following example returns the square roots of various numeric values.
  
```sql
SELECT VALUE {
    sqrtZero: SQRT(0),
    sqrtOne: SQRT(1),
    sqrtFour: SQRT(4),
    sqrtPrime: SQRT(17),
    sqrtTwentyFive: SQRT(25)
}
```  
  
```json
[
  {
    "sqrtZero": 0,
    "sqrtOne": 1,
    "sqrtFour": 2,
    "sqrtPrime": 4.123105625617661,
    "sqrtTwentyFive": 5
  }
]
```  

## Remarks

- This system function doesn't utilize the index.
- If you attempt to find the square root value that results in an imaginary number, you get an error that the value can't be represented in JSON. For example, `SQRT(-25)` gives this error.

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [Introduction to Azure Cosmos DB](../../introduction.md)
