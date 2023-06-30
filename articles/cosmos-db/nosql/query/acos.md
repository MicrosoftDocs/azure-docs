---
title: ACOS
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the trigonometric arccosine of the specified angle.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# ACOS (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the trigonometric arccosine of the specified numeric value. The arccosine is the angle, in radians, whose cosine is the specified numeric expression.
  
## Syntax

```sql
ACOS(<numeric_expr>)  
```  

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.  

## Examples

The following example calculates the arccosine of the specified values using the function.

```sql
SELECT VALUE {
  arccosine: ACOS(-1)
}
```

```json
[
  {
    "arccosine": 3.141592653589793
  }
]
```  

## Remarks

- This system function doesn't use the index.

## Next steps

- [System functions Azure Cosmos DB](system-functions.yml)
- [`COS`](cos.md)
