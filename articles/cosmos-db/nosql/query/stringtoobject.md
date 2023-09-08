---
title: StringToObject
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a string expression converted to an object.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/24/2023
ms.custom: query-reference
---

# StringToObject (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Converts a string expression to an object.

## Syntax

```sql
StringToObject(<string_expr>)  
```

## Arguments

| | Description |
| --- | --- |
| **`string_expr`** | A string expression. |

## Return types

Returns an object.

## Examples
  
The following example illustrates how this function works with various inputs.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/stringtoobject/query.sql" highlight="2-7":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/stringtoobject/result.json":::

## Remarks

- This function doesn't use the index.
- If the expression can't be converted, the function returns `undefined`.
- Nested string values must be written with double quotes to be valid.

> [!NOTE]
> For more information on the JSON format, see [https://json.org](https://json.org/).

## Next steps

- [System functions](system-functions.yml)
- [`StringToArray`](stringtoarray.md)
