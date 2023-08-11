---
title: LENGTH
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the numeric length of a string expression.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/20/2023
ms.custom: query-reference
---

# LENGTH (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the number of characters in the specified string expression.  
  
## Syntax
  
```sql
LENGTH(<string_expr>)  
```  
  
## Arguments

| | Description |
| --- | --- |
| **`string_expr`** | A string expression. |
  
## Return types
  
Returns a numeric expression.  
  
## Examples
  
The following example returns the length of a static string.  

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/length/query.sql" highlight="2-6":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/length/result.json":::

## Remarks

- This system function doesn't use the index.

## Next steps

- [System functions](system-functions.yml)
- [`REVERSE`](reverse.md)
