---
title: SetIntersect
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that gets expressions that exist in two sets.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# SetIntersect (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Compares expressions in two sets and returns the set of expressions that is contained in both sets with no duplicates.

## Syntax

```sql
SetIntersect(<array_expr_1>, <array_expr_2>)
```

## Arguments

| | Description |
| --- | --- |
| **`array_expr_1`** | An array of expressions. |
| **`array_expr_2`** | An array of expressions. |

## Return types

Returns an array of expressions.

## Examples

This first example uses the function with static arrays to demonstrate the intersect functionality.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/setintersect/query.novalidate.sql" highlight="2-6":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/setintersect/result.novalidate.json":::

This last example uses a single item that share values within two array properties.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/setintersect-field/seed.novalidate.json" range="1-2,4-16" highlight="4-12":::

The query selects the appropriate field from the item\[s\] in the container.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/setintersect-field/query.novalidate.sql" highlight="3":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/setintersect-field/result.novalidate.json":::

## Remarks

- This function doesn't return duplicates.
- This function doesn't use the index.

## See also

- [System functions](system-functions.yml)
- [`ARRAY_CONTAINS`](array-contains.md)
