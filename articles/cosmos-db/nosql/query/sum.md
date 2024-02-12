---
title: SUM
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that sums the specified values.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# SUM (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the sum of the values in the expression.
  
## Syntax
  
```sql
SUM(<numeric_expr>)  
```  
  
## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |
  
## Return types
  
Returns a numeric expression.  
  
## Examples
  
For this example, consider a container with multiple items that may contain a `quantity` field.
  
:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/sum/seed.json" range="1-2,4-8,10-13,15-19" highlight="4,13":::

The `SUM` function is used to sum the values of the `quantity` field, when it exists, into a single aggregated value.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/sum/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/sum/result.json":::

## Remarks

- This function benefits from a [range index](../../index-policy.md#includeexclude-strategy).
- If any arguments in `SUM` are string, boolean, or null; the entire aggregate system function returns `undefined`.
- If any individual argument has an `undefined` value that value isn't included in the `SUM` calculation.

## Related content

- [System functions](system-functions.yml)
- [`AVG`](average.md)
