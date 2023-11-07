---
title: CONCAT
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a string concatenated from two or more strings.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# CONCAT (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a string that is the result of concatenating two or more string values.  

## Syntax

```sql
CONCAT(<string_expr_1>, <string_expr_2> [, <string_expr_N>])  
```  

## Arguments

| | Description |
| --- | --- |
| **`string_expr_1`** | The first string expression in the list. |
| **`string_expr_2`** | The second string expression in the list. |
| **`string_expr_N` *(Optional)*** | Optional string expression\[s\], which can contain a variable number of expressions up to the `N`th item in the list. |

> [!NOTE]
> The `CONCAT` function requires at least two string expression arguments.

## Return types

Returns a string expression.  

## Examples

This first example returns the concatenated string of two string expressions.  

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/concat/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/concat/result.json":::

This next example uses an existing item in a container with various relevant fields.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/concat-fields/seed.json" range="1-2,4-8" highlight="3-5":::

This example uses the function to select two expressions from the item.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/concat-fields/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/concat-fields/result.json":::

## Remarks

- This function doesn't use the index.

## Related content

- [System functions](system-functions.yml)
- [`CONTAINS`](contains.md)
