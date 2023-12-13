---
title: StringToArray
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a string expression converted to an array.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# StringToArray (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Converts a string expression to an array.

## Syntax

```sql  
StringToArray(<string_expr>)  
```

## Arguments

| | Description |
| --- | --- |
| **`string_expr`** | A string expression. |

## Return types

Returns an array.

## Examples
  
The following example illustrates how this function works with various inputs.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/stringtoarray/query.sql" highlight="2-8":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/stringtoarray/result.json":::

## Remarks

- This function doesn't use the index.
- If the expression can't be converted, the function returns `undefined`.
- Nested string values must be written with double quotes to be valid.
- Single quotes within the array aren't valid JSON. Even though single quotes are valid within a query, they don't parse to valid arrays. Strings within the array string must either be escaped `\"` or the surrounding quote must be a single quote.

> [!NOTE]
> For more information on the JSON format, see [https://json.org](https://json.org/).

## Related content

- [System functions](system-functions.yml)
- [`StringToObject`](stringtoobject.md)
