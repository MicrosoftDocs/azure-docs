---
title: ARRAY_CONCAT
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that  returns an array that is the result of concatenating two or more array values
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# ARRAY_CONCAT (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns an array that is the result of concatenating two or more array values.  

## Syntax

```sql
ARRAY_CONCAT(<array_expr_1>, <array_expr_2> [, <array_expr_N>])  
```  

## Arguments

| | Description |
| --- | --- |
| **`array_expr_1`** | The first expression in the list. |
| **`array_expr_2`** | The second expression in the list. |
| **`array_expr_N` *(Optional)*** | Optional expression\[s\], which can contain a variable number of expressions up to the `N`th item in the list. |

> [!NOTE]
> The `ARRAY_CONCAT` function requires at least two array expression arguments.

## Return types

Returns an array expression.  

## Examples

The following example shows how to concatenate two arrays.  

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/array-concat/query.sql" highlight="2":::  

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/array-concat/result.json":::

## Remarks

- This function doesn't utilize the index.

## Related content

- [System functions](system-functions.yml)
- [Introduction to Azure Cosmos DB](../../introduction.md)
- [`ARRAY_SLICE`](array-slice.md)
