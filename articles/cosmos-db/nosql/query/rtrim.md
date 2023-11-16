---
title: RTRIM
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a string expression with trailing whitespace or specified characters removed.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# RTRIM (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a string expression after it removes trailing whitespace or specified characters.  
  
## Syntax
  
```sql
RTRIM(<string_expr_1> [, <string_expr_2>])  
```
  
## Arguments
  
| | Description |
| --- | --- |
| **`string_expr_1`** | A string expression. |
| **`string_expr_2` *(Optional)*** | An optional string expression to be trimmed from `string_expr_1`. If not set, the default is to trim whitespace. | 
  
## Return types

Returns a string expression.  
  
## Examples

The following example shows how to use this function with various parameters inside a query.  
  
:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/rtrim/query.sql" highlight="2-9":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/rtrim/result.json":::

## Remarks

- This function doesn't use the index.

## Related content

- [System functions](system-functions.yml)
- [`LTRIM`](ltrim.md)
