---
title: INDEX_OF
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the index of the first occurrence of a string.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/20/2023
ms.custom: query-reference
---

# INDEX_OF (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the starting index of the first occurrence of a substring expression within a specified string expression.

## Syntax

```sql
INDEX_OF(<string_expr_1>, <string_expr_2> [, <numeric_expr>])
```

## Arguments

| | Description |
| --- | --- |
| **`string_expr_1`** | A string expression that is the target of the search. |
| **`string_expr_2`** | A string expression with the substring that is the source of the search (or to search for). |
| **`numeric_expr` *(Optional)*** | An optional numeric expression that indicates where, in `string_expr_1`, to start the search. If not specified, the default value is `0`. |

## Return types

Returns a numeric expression.

## Examples

The following example returns the index of various substrings inside the larger string **"AdventureWorks"**.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/index-of/query.sql" highlight="2-10":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/index-of/result.json":::

## Next steps

- [System functions](system-functions.yml)
- [`SUBSTRING`](substring.md)
