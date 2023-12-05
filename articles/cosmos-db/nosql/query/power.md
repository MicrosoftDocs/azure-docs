---
title: POWER
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a number multipled by itself a specified number of times.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# POWER (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the value of the specified expression multipled by itself the given number of times.  
  
## Syntax
  
```sql
POWER(<numeric_expr_1>, <numeric_expr_2>)  
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr_1`** | A numeric expression. |
| **`numeric_expr_2`** | A numeric expression indicating the power to raise `numeric_expr_1`. |

## Return types

Returns a numeric expression.  
  
## Examples

The following example demonstrates raising a number to various powers.  

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/power/query.sql" highlight="2-9":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/power/result.json":::

## Remarks

- This function doesn't use the index.

## Related content

- [System functions](system-functions.yml)
- [`SQRT`](sqrt.md)
