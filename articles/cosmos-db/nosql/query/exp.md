---
title: EXP
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the exponential value of the specified number.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# EXP (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the exponential value of the specified numeric expression.  

## Syntax

```sql
EXP(<numeric_expr>)  
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.

## Examples

The following example returns the exponential value for various numeric inputs.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/exp/query.sql" highlight="2-4":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/exp/result.json":::

## Remarks

- The constant `e` (`2.718281…`), is the base of natural logarithms.  
- The exponent of a number is the constant `e` raised to the power of the number. For example, `EXP(1.0) = e^1.0 = 2.71828182845905` and `EXP(10) = e^10 = 22026.4657948067`.  
- The exponential of the natural logarithm of a number is the number itself: `EXP (LOG (n)) = n`. And the natural logarithm of the exponential of a number is the number itself: `LOG (EXP (n)) = n`.  

## Related content

- [System functions](system-functions.yml)
- [`LOG`](log.md)
