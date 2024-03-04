---
title: RIGHT
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a substring from the right side of a string.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/20/2023
ms.custom: query-reference
---

# RIGHT (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the right part of a string up to the specified number of characters.  
  
## Syntax
  
```sql
RIGHT(<string_expr>, <numeric_expr>)  
```  
  
## Arguments
  
| | Description |
| --- | --- |
| **`string_expr`** | A string expression. |
| **`numeric_expr`** | A numeric expression specifying the number of characters to extract from `string_expr`. |
  
## Return types
  
Returns a string expression.  
  
## Examples
  
The following example returns the right part of the string `Microsoft` for various length values.  

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/right/query.sql" highlight="2-6":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/right/result.json":::

## Remarks

- This function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## Next steps

- [System functions](system-functions.yml)
- [`LEFT`](left.md)
