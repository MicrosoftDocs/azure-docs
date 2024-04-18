---
title: TAN
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the trigonometric tangent of the specified angle.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.devlang: nosql
ms.date: 02/27/2024
ms.custom: query-reference
---

# TAN (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the trigonometric tangent of the specified angle in radians.
  
## Syntax
  
```nosql
TAN(<numeric_expr>)  
```
  
## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types
  
Returns a numeric expression.  
  
## Examples
  
The following example calculates the cotangent of the specified angle using the function.
  
:::code language="nosql" source="~/cosmos-db-nosql-query-samples/scripts/tan/query.sql" highlight="2-3":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/tan/result.json":::

## Remarks

- This function doesn't use the index.

## Related content

- [System functions](system-functions.yml)
- [`COT`](cot.md)
