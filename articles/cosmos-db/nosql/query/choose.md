---
title: CHOOSE
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the expression at the specified index of a list.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# CHOOSE (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the expression at the specified index of a list, or Undefined if the index exceeds the bounds of the list\.

## Syntax

```sql
CHOOSE(<numeric_expr>, <expr_1> [, <expr_N>])
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression, which specifies the index used to get a specific expression in the list. The starting index of the list is `1`. |
| **`expr_1`** | The first expression in the list. |
| **`expr_N` *(Optional)*** | Optional expression\[s\], which can contain a variable number of expressions up to the `N`th item in the list. |

## Return types

Returns an expression, which could be of any type.

## Examples

The following example uses a static list to demonstrate various return values at different indexes.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/choose/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/choose/result.json":::

This example uses a static list to demonstrate various return values at different indexes.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/choose-indexes/query.sql" highlight="2-7":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/choose-indexes/result.json":::

This final example uses an existing item in a container with three relevant fields.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/choose-fields/seed.json" range="1-2,4-12" highlight="3-4,9":::

This example selects an expression from existing paths in the item.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/choose-fields/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/choose-fields/result.json":::

## Remarks

- This function uses one-based list indexing. The first item in the list is referenced using the numeric index `1` instead of `0`.
- This function doesn't utilize the index.

## See also

- [System functions](system-functions.yml)
- [`ARRAY_LENGTH`](array-length.md)
