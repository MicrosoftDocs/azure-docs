---
title: IntBitOr
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that compares bits of each operand using an inclusive OR operator.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/20/2023
ms.custom: query-reference
---

# IntBitOr (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Compares the bits on both the left-hand and right-hand operators using inclusive `OR` and returns a result for each bit. If either bit is `1`, the corresponding bit is `1`. Otherwise, the corresponding bit is `0`. For more information, see [bitwise inclusive `OR` operator](/cpp/cpp/bitwise-inclusive-or-operator-pipe).

## Syntax

```sql
IntBitOr(<int_expr_1>, <int_expr_2>)
```

## Arguments

| | Description |
| --- | --- |
| **`int_expr_1`** | An integer expression, which is used as the left-hand operand. |
| **`int_expr_2`** | An integer expression, which is used as the right-hand operand. |

## Return types

Returns a 64-bit integer.

> [!NOTE]
> For more information, see [__int64](/cpp/cpp/int8-int16-int32-int64).

## Examples

This example tests the function with various static values.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/intbitor/query.novalidate.sql" highlight="2-5":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/intbitor/result.novalidate.json":::

## Remarks

- This function expects integers for both arguments and performs operations assuming the values are a 64-bit integer.
- If any of the arguments aren't an integer, the function returns undefined.
- Overflow behavior is similar to the implementation in C++ (wrap-around).

## See also

- [System functions](system-functions.yml)
- [`IS_NUMBER`](is-number.md)
