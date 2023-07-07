---
title: SQUARE
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the square of the specified numeric value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# SQUARE (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the square of the specified numeric value.  
  
## Syntax
  
```sql
SQUARE(<numeric_expr>)  
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.  
  
## Examples

The following example returns the squares of various numbers.

```sql
SELECT VALUE {
    squareZero: SQUARE(0),
    squareOne: SQUARE(1),
    squareTwo: SQUARE(2),
    squareThree: SQUARE(3),
    squareNull: SQUARE(null)
}
```

```json
[
  {
    "squareZero": 0,
    "squareOne": 1,
    "squareTwo": 4,
    "squareThree": 9
  }
]
```

## Remarks

- This system function doesn't utilize the index.

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [Introduction to Azure Cosmos DB](../../introduction.md)
