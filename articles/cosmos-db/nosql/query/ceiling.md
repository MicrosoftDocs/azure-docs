---
title: CEILING
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the smallest integer value greater than or equal to the specified numeric expression.
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

# CEILING (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the smallest integer value greater than or equal to the specified numeric expression.  
  
## Syntax
  
```nosql
CEILING(<numeric_expr>)  
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a numeric expression.  
  
## Examples

The following example shows positive numeric, negative, and zero values evaluated with this function.  

:::code language="nosql" source="~/cosmos-db-nosql-query-samples/scripts/ceiling/query.sql" highlight="2-7":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/ceiling/result.json":::

## Remarks

- This system function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Related content

- [System functions](system-functions.yml)
- [`FLOOR`](floor.md)
