---
title: COUNT 
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that counts the number of occurrences of a value.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/17/2023
ms.custom: query-reference
---

# COUNT (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the count of the values in the expression.
  
## Syntax
  
```sql
COUNT(<scalar_expr>)  
```  
  
## Arguments

| | Description |
| --- | --- |
| **`scalar_expr`** | A scalar expression. |
  
## Return types
  
Returns a numeric scalar value.
  
## Examples
  
This first example passes in either a scalar value or a numeric expression to the `COUNT` function. The expression is evaluated first to a scalar, making the result of both uses of the function the same value.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/count-expression/query.sql" highlight="2-3":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/count-expression/result.json":::

This next example assumes that there's a container with two items with a `/name` field. There's one item without the same field.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/count/seed.json" range="1-2,4-7,9-12,14-16" highlight="3,7":::

In this example, the function counts the number of times the specified scalar field occurs in the filtered data. Here, the function looks for the number of times the `/name` field occurs which is two out of three times.

:::code language="" source="~/cosmos-db-nosql-query-samples/scripts/count/query.sql" highlight="2":::

:::code language="" source="~/cosmos-db-nosql-query-samples/scripts/count/result.json":::

## Remarks

- This function benefits from a [range index](../../index-policy.md#includeexclude-strategy) for any properties in the query's filter.

## Next steps

- [System functions](system-functions.yml)
- [`AVG`](average.md)
