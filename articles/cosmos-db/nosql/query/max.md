---
title: MAX 
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the maximum value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/17/2023
ms.custom: query-reference
---

# MAX (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the maximum of the values in the expression.
  
## Syntax
  
```sql
MAX(<scalar_expr>)  
```  
  
## Arguments

| | Description |
| --- | --- |
| **`scalar_expr`** | A scalar expression. |
  
## Return types
  
Returns a numeric scalar value.
  
## Examples

This example uses a container with multiple items that each have a `/price` numeric field.
  
:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/max/seed.json" range="1-2,4-8,10-14" highlight="3,8":::

For this example, the `MAX` function is used in a query that includes the numeric field that was mentioned.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/max/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/max/result.json":::

## Remarks

- This function benefits from a [range index](../../index-policy.md#includeexclude-strategy).
- The arguments in `MAX` can be number, string, boolean, or null.
- Any `undefined` values are ignored.
- The following priority order is used (in descending order), when comparing different types of data:
   1. string
   1. number
   1. boolean
   1. null

## Next steps

- [System functions](system-functions.yml)
- [`MIN`](min.md)
