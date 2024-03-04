---
title: SUBSTRING
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a portion of a string using a starting position and length.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/24/2023
ms.custom: query-reference
---

# SUBSTRING (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns part of a string expression starting at the specified position and of the specified length, or to the end of the string.  

## Syntax

```sql
SUBSTRING(<string_expr>, <numeric_expr_1>, <numeric_expr_2>)  
```

## Arguments

| | Description |
| --- | --- |
| **`string_expr`** | A string expression. |
| **`numeric_expr_1`** | A numeric expression to denote the start character.  |
| **`numeric_expr_2`** | A numeric expression to denote the maximum number of characters of `string_expr` to be returned.  |

## Return types

Returns a string expression.  

## Examples

The following example returns substrings with various lengths and starting positions.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/substring/query.sql" highlight="2-5":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/substring/result.json":::

## Remarks

- This function benefits from a [range index](../../index-policy.md#includeexclude-strategy) if the starting position is `0`.
- `numeric_expr_1` positions are zero-based, therefore a value of `0` starts from the first character of `string_expr`.
- A value of `0` or less for `numeric_expr_2` results in empty string.

## Next steps

- [System functions](system-functions.yml)
- [`StringEquals`](stringequals.md)
