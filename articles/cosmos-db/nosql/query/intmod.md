---
title: IntMod
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that gets the modulus (remainder) from dividing one number by the other.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/20/2023
ms.custom: query-reference
---

# IntMod (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Returns the remainder from dividing the left-hand operator by the right-hand operator.  For more information, see [modulus operators](/cpp/cpp/multiplicative-operators-and-the-modulus-operator).

## Syntax

```sql
IntMod(<int_expr_1>, <int_expr_2>)
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

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/intmod/query.sql" highlight="2-7":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/intmod/result.json":::

## Remarks

- This function expects integers for both arguments and performs operations assuming the values are a 64-bit integer.
- If any of the arguments aren't an integer, the function returns undefined.
- Overflow behavior is similar to the implementation in C++ (wrap-around).
- Modulus operators have left-to-right associativity.

## See also

- [System functions](system-functions.yml)
- [`IS_NUMBER`](is-number.md)
