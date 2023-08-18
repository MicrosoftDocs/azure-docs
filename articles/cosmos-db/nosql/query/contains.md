---
title: CONTAINS
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns whether the first string contains the second.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/18/2023
ms.custom: query-reference
---

# CONTAINS (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean indicating whether the first string expression contains the second string expression.  

## Syntax

```sql
CONTAINS(<string_expr_1>, <string_expr_2> [, <bool_expr>])  
```  

## Arguments

| | Description |
| --- | --- |
| **`string_expr_1`** | The first string to search. |
| **`string_expr_2`** | The second string to find. |
| **`bool_expr` *(Optional)***  | Optional boolean value for ignoring case. When set to `true`, `CONTAINS` performs a case-insensitive search. When `unspecified`, this value defaults to `false`. |

## Return types

Returns a boolean expression.  

## Examples

The following example checks if various static substrings exist in a string.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/contains/query.sql" highlight="2-7":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/contains/result.json":::

## Remarks

- This function performs a full scan.

## Next steps

- [System functions](system-functions.yml)
- [`CONCAT`](concat.md)
