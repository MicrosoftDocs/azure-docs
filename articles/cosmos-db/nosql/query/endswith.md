---
title: ENDSWITH
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a boolean indicating whether one string expression ends with another.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# ENDSWITH (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean value indicating whether the first string expression ends with the second.  
  
## Syntax
  
```sql
ENDSWITH(<string_expr_1>, <string_expr_2> [, <bool_expr>])
```  
  
## Arguments
  
| | Description |
| --- | --- |
| **`string_expr_1`** | A string expression. |
| **`string_expr_2`** | A string expression to be compared to the end of `string_expr_1`. |
| **`bool_expr`** *(Optional)* | Optional value for ignoring case. When set to `true`, `ENDSWITH` does a case-insensitive search. When unspecified, this default value is `false`. |
  
## Return types
  
Returns a boolean expression.  
  
## Examples
  
The following example checks if the string `abc` ends with `b` or `bC`.  
  
:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/endswith/query.sql" highlight="2-5":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/endswith/result.json":::

## Remarks

- This function performs a full index scan.

## Related content

- [System functions](system-functions.yml)
- [`STARTSWITH`](startswith.md)
