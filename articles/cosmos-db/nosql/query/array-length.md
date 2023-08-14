---
title: ARRAY_LENGTH
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the number of items in an array.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/18/2023
ms.custom: query-reference
---

# ARRAY_LENGTH (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the number of elements in the specified array expression.
  
## Syntax
  
```sql
ARRAY_LENGTH(<array_expr>)  
```  

## Arguments

| | Description |
| --- | --- |
| **`array_expr`** | An array expression. |

## Return types

Returns a numeric expression.  

## Examples
  
The following example illustrates how to get the length of an array using the function.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/array-length/query.sql" highlight="2-4":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/array-length/result.json":::

## Remarks

- This system function doesn't use the index.

## Next steps

- [System functions](system-functions.yml)
- [`ARRAY_SLICE`](array-slice.md)
