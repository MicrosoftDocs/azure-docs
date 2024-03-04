---
title: REPLACE
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a string with all occurrences of a specified string replaced.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/24/2023
ms.custom: query-reference
---

# REPLACE (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Replaces all occurrences of a specified string value with another string value.  

## Syntax

```sql
REPLACE(<string_expr_1>, <string_expr_2>, <string_expr_3>)  
```

## Arguments

| | Description |
| --- | --- |
| **`string_expr_1`** | A string expression to be searched. |
| **`string_expr_2`** | A string expression to be found within `string_expr_1`. |
| **`string_expr_3`** | A string expression with the text to replace all occurrences of `string_expr_2` within `string_expr_1`. |

## Return types

Returns a string expression.  

## Examples

The following example shows how to use this function to replace static values.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/replace/query.sql" highlight="2":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/replace/result.json":::

## Remarks

- This function doesn't use the index.

## Next steps

- [System functions](system-functions.yml)
- [`SUBSTRING`](substring.md)
