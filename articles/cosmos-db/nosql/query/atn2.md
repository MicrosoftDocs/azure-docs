---
title: ATN2
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the trigonometric arctangent of y / x in radians.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# ATN2 (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the principal value of the arctangent of `y/x`, expressed in radians.  

## Syntax

```sql
ATN2(<numeric_expr>, <numeric_expr>)  
```  

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr_y`** | A numeric expression for the `y` component. |
| **`numeric_expr_x`** | A numeric expression for the `x` component. |

## Return types

Returns a numeric expression.  

## Examples

The following example calculates the arctangent for the specified `x` and `y` components.  

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/atn2/query.sql" highlight="2":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/atn2/result.json":::

## Remarks

- This system function doesn't use the index.

## Related content

- [System functions](system-functions.yml)
- [`TAN`](tan.md)
- [`ATAN`](atan.md)
