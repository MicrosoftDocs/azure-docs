---
title: TRIM
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a string with leading or trailing whitespace trimmed.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/24/2023
ms.custom: query-reference
---

# TRIM (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a string expression after it removes leading and trailing whitespace or custom characters.  

## Syntax

```sql
TRIM(<string_expr_1> [, <string_expr_2>])
```

## Arguments

| | Description |
| --- | --- |
| **`string_expr_1`** | A string expression. |
| **`string_expr_2` *(Optional)*** | An optional string expression with a string to trim from `string_expr_1`. If not specified, the default is to trim whitespace. |

## Return types

Returns a string expression.

## Examples

This example illustrates various ways to trim a string expression.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/trim/query.sql" highlight="2-9":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/trim/result.json":::

## Remarks

- This function doesn't use the index.

## Next steps

- [System functions](system-functions.yml)
- [`TRUNC`](trunc.md)
