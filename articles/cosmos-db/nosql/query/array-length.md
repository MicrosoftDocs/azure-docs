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
ms.devlang: nosql
ms.date: 02/27/2024
ms.custom: query-reference
---

# ARRAY_LENGTH (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the number of elements in the specified array expression.
  
## Syntax
  
```nosql
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

:::code language="nosql" source="~/cosmos-db-nosql-query-samples/scripts/array-length/query.sql" highlight="2-4":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/array-length/result.json":::

## Remarks

- This system function doesn't use the index.

## Related content

- [System functions](system-functions.yml)
- [`ARRAY_SLICE`](array-slice.md)
