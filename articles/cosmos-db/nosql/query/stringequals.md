---
title: StringEquals
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a boolean indicating whether two strings are equivalent.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/24/2023
ms.custom: query-reference
---

# StringEquals (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean indicating whether the first string expression matches the second.  

## Syntax

```sql
STRINGEQUALS(<string_expr_1>, <string_expr_2> [, <boolean_expr>])  
```

## Arguments

| | Description |
| --- | --- |
| **`string_expr_1`** | The first string expression to compare. |
| **`string_expr_2`** | The second string expression to compare. |
| **`boolean_expr` *(Optional)*** | An optional boolean expression for ignoring case. When set to `true`, this function performs a case-insensitive search. If not specified, the default value is `false`. |

## Return types

Returns a boolean expression.  

## Examples

The following example checks if "abc" matches "abc" and if "abc" matches "ABC."

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/stringequals/query.sql" highlight="2-4":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/stringequals/result.json":::

## Remarks

- This function performs an index seek.

## Next steps

- [System functions](system-functions.yml)
- [`SUBSTRING`](substring.md)
