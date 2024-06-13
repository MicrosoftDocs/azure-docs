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
ms.devlang: nosql
ms.date: 02/27/2024
ms.custom: query-reference
---

# ATAN (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the trigonometric arctangent of the specified numeric value. The arcsine is the angle, in radians, whose tangent is the specified numeric expression.

## Syntax

```nosql
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

:::code language="nosql" source="~/cosmos-db-nosql-query-samples/scripts/atan/query.sql" highlight="2":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/atan/result.json":::

## Remarks

- This system function doesn't use the index.

## Related content

- [System functions](system-functions.yml)
- [`TAN`](tan.md)
- [`ATN2`](atn2.md)
