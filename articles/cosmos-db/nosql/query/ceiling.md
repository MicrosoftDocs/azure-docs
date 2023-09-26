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
ms.date: 09/21/2023
ms.custom: query-reference
---

# CEILING (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the smallest integer value greater than or equal to the specified numeric expression.  
  
## Syntax
  
```sql
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

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/ceiling/query.sql" highlight="2-7":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/ceiling/result.json":::

## Remarks

- This system function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Related content

- [System functions](system-functions.yml)
- [`FLOOR`](floor.md)
