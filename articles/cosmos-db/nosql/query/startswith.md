---
title: STARTSWITH
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a boolean indicating whether one string expression starts with another.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# STARTSWITH (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean value indicating whether the first string expression starts with the second.  
  
## Syntax
  
```sql
STARTSWITH(<string_expr_1>, <string_expr_2> [, <bool_expr>])
```  
  
## Arguments
  
| | Description |
| --- | --- |
| **`string_expr_1`** | A string expression. |
| **`string_expr_2`** | A string expression to be compared to the beginning of `string_expr_1`. |
| **`bool_expr`** *(Optional)* | Optional value for ignoring case. When set to `true`, `STARTSWITH` does a case-insensitive search. When unspecified, this default value is `false`. |

## Return types
  
Returns a boolean expression.  
  
## Examples
  
The following example checks if the string `abc` starts with `b` or `ab`.  
  
:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/startswith/query.sql" highlight="2-5":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/startswith/result.json":::

## Remarks

- This function performs a precise index scan.

## Related content

- [System functions](system-functions.yml)
- [`ENDSWITH`](endswith.md)
