---
title: REPLICATE
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a string value repeated a specific number of times.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/24/2023
ms.custom: query-reference
---

# REPLICATE (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Repeats a string value a specified number of times.

## Syntax

```sql
REPLICATE(<string_expr>, <numeric_expr>)
```  

## Arguments

| | Description |
| --- | --- |
| **`string_expr`** | A string expression. |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a string expression.

## Examples

The following example shows how to use this function to build a repeating string.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/replicate/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/replicate/result.json":::

## Remarks

- This function doesn't use the index.
- The maximum length of the result is **10,000** characters.
  - `(length(string_expr) * numeric_expr) <= 10,000`
- If `numeric_expr` is *negative* or *nonfinite*, the result is `undefined`.

## Next steps

- [System functions](system-functions.yml)
- [`REPLACE`](replace.md)
