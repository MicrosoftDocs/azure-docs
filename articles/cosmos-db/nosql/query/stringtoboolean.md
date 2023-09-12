---
title: StringToBoolean
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a string expression converted to a boolean.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/24/2023
ms.custom: query-reference
---

# StringToBoolean (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Converts a string expression to a boolean.
  
## Syntax
  
```sql
StringToBoolean(<string_expr>)  
```  

## Arguments

| | Description |
| --- | --- |
| **`string_expr`** | A string expression. |

## Return types

Returns a boolean value.
  
## Examples
  
The following example illustrates how this function works with various data types.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/stringtoboolean/query.sql" highlight="2-8":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/stringtoboolean/result.json":::

## Remarks

- This function doesn't use the index.
- If the expression can't be converted, the function returns `undefined`.

> [!NOTE]
> For more information on the JSON format, see [https://json.org](https://json.org/).

## Next steps

- [System functions](system-functions.yml)
- [`StringToNumber`](stringtonumber.md)
