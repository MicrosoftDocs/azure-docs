---
title: MIN
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the minimum value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/17/2023
ms.custom: query-reference
---

# MIN (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the minimum of the values in the expression.
  
## Syntax
  
```sql
MIN(<scalar_expr>)  
```  
  
## Arguments

| | Description |
| --- | --- |
| **`scalar_expr`** | A scalar expression. |
  
## Return types
  
Returns a numeric scalar value. 
  
## Examples

This example uses a container with multiple items that each have a `/price` numeric field.
  
:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/min/seed.json" range="1-2,4-8,10-14" highlight="3,8":::

For this example, the `MIN` function is used in a query that includes the numeric field that was mentioned.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/min/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/min/result.json":::

## Remarks

- This function benefits from a [range index](../../index-policy.md#includeexclude-strategy). 
- The arguments in `MIN` can be number, string, boolean, or null.
- Any `undefined` values are ignored.
- The following priority order is used (in ascending order), when comparing different types of data:
   1. null
   1. boolean
   1. number
   1. string

## Next steps

- [System functions](system-functions.yml)
- [`MAX`](max.md)
