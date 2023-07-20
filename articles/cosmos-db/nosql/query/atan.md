---
title: ATAN
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the trigonometric arctangent of the specified angle.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# ATAN (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the trigonometric arctangent of the specified numeric value. The arcsine is the angle, in radians, whose tangent is the specified numeric expression.

## Syntax

```sql
ATAN(<numeric_expr>)  
```  

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. | 

## Return types

Returns a numeric expression.  

## Examples

The following example calculates the arctangent of the specified angle using the function.

```sql
SELECT VALUE {
  arctangent: ATAN(-45.01)
}
``` 

```json
[
  {
    "arctangent": -1.5485826962062663
  }
]
```  

## Remarks

- This system function doesn't use the index.

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`TAN`](tan.md)
