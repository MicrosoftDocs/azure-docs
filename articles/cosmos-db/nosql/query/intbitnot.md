---
title: IntBitNot
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns the complement of a number. 
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# IntBitNot (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the bitwise complement of the operand. For example, every `1` bit individually yields `0` for the corresponding bit in the result. For more information, see [bitwise complement operator](/cpp/cpp/one-s-complement-operator-tilde).

## Syntax

```sql
IntBitNot(<int_expr>)
```

## Arguments

| | Description |
| --- | --- |
| **`int_expr`** | An integer expression, which is used as the sole operand. |

## Return types

Returns a 64-bit integer.

> [!NOTE]
> For more information, see [__int64](/cpp/cpp/int8-int16-int32-int64).

## Examples

This example tests the function with various static values.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/intbitnot/query.novalidate.sql" highlight="2-4":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/intbitnot/result.novalidate.json":::

## Remarks

- This function expects integers for both arguments and performs operations assuming the values are a 64-bit integer.
- If any of the arguments aren't an integer, the function returns undefined.
- Overflow behavior is similar to the implementation in C++ (wrap-around).

## See also

- [System functions](system-functions.yml)
- [`IS_NUMBER`](is-number.md)
