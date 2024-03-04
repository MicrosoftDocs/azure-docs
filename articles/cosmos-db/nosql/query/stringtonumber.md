---
title: StringToNumber
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a string expression converted to a number.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/24/2023
ms.custom: query-reference
---

# StringToNumber (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Converts a string expression to a number.

## Syntax

```sql
StringToNumber(<string_expr>)  
```  

## Arguments

| | Description |
| --- | --- |
| **`string_expr`** | A string expression. |

## Return types

Returns a number value.

## Examples

The following example illustrates how this function works with various data types.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/stringtonumber/query.sql" highlight="2-10":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/stringtonumber/result.json":::

## Remarks

- This function doesn't use the index.
- String expressions are parsed as a JSON number expression.
- Numbers in JSON must be an integer or a floating point.
- If the expression can't be converted, the function returns `undefined`.

> [!NOTE]
> For more information on the JSON format, see [https://json.org](https://json.org/).

## Next steps

- [System functions](system-functions.yml)
- [`StringToBoolean`](stringtoboolean.md)
