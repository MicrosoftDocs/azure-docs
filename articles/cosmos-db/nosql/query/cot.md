---
title: COT
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the trigonometric cotangent of the specified angle.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# COT (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the trigonometric cotangent of the specified angle in radians.
  
## Syntax
  
```sql
COT(<numeric_expr>)  
```  
  
## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |
  
## Return types
  
Returns a numeric expression.  
  
## Examples
  
The following example calculates the cotangent of the specified angle using the function.
  
```sql
SELECT VALUE {
    cotangent: COT(124.1332)
} 
```  
  
```json
[
  {
    "cotangent": -0.040311998371148884
  }
]
```  

## Remarks

- This system function doesn't utilize the index.

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`TAN`](tan.md)
