---
title: IS_INTEGER
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns a boolean indicating if a number is a 64-bit signed integer.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# IS_INTEGER (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns a boolean indicating if a number is a 64-bit signed integer. 64-bit signed integers range from `-9,223,372,036,854,775,808` to `9,223,372,036,854,775,807`. For more information, see [__int64](/cpp/cpp/int8-int16-int32-int64).

## Syntax

```sql
IS_INTEGER(<numeric_expr>)
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression. |

## Return types

Returns a boolean.

## Examples

This example demonstrates the function with various static values.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/is-integer/query.sql" highlight="2-6":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/is-integer/result.json":::

## Remarks

- This function benefits from a [range index](../../index-policy.md#includeexclude-strategy).

## See also

- [System functions](system-functions.yml)
- [`IS_NUMBER`](is-number.md)
