---
title: IntBitXor
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that compares bits of each operand using an exclusive OR operator.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# IntBitXor (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Compares the bits on both the left-hand and right-hand operators using exclusive `OR` and returns a result for each bit. If a bit is a `0` and the other bit is `1`, the corresponding bit is `1`. Otherwise, the corresponding bit is `0`. For more information, see [bitwise exclusive `OR` operator](/cpp/cpp/bitwise-exclusive-or-operator-hat).

## Syntax

```sql
IntBitXor(<int_expr_1>, <int_expr_2>)
```

## Arguments

| | Description |
| --- | --- |
| **`int_expr_1`** | An integer expression, which is used as the left-hand operand. |
| **`int_expr_2`** | An integer expression, which is used as the right-hand operand. |

## Return types

Returns a 64-bit integer. For more information, see [__int64](/cpp/cpp/int8-int16-int32-int64).

## Examples

This example tests the function with various static values.

```sql
SELECT VALUE {
    exclusiveOr: IntBitXor(56, 100),
    exclusiveOrSame: IntBitXor(56, 56),
    exclusiveOrZero: IntBitXor(56, 0),
    exclusiveOrDecimal: IntBitXor(56, 0.1)
}
```

```json
[
  {
    "exclusiveOr": 92,
    "exclusiveOrSame": 0,
    "exclusiveOrZero": 56
  }
]
```

## Remarks

- This function expects integers for both arguments and performs operations assuming the values are a 64-bit integer.
- If any of the arguments aren't an integer, the function returns undefined.
- Overflow behavior is similar to the implementation in C++ (wrap-around).

## See also

- [System functions](system-functions.yml)
- [`IS_NUMBER`](is-number.md)
