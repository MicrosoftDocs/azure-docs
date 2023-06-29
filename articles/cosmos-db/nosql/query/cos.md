---
title: COS
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the trigonometric cosine of the specified angle.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# COS (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the trigonometric cosine of the specified angle in radians.
  
## Syntax
  
```sql
COS(<numeric_expr>)  
```  

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.  

## Examples
  
The following example calculates the cosine of the specified angle using the function.
  
```sql
SELECT VALUE {
    cosine: COS(14.78)
}
```  

```json
[
  {
    "cosine": -0.5994654261946543
  }
]
```  

## Remarks

- This system function doesn't utilize the index.

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`SIN`](sin.md)
