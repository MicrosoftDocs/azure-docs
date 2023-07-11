---
title: IntMul
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that multiples two numbers.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# IntMul (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Multiples the values of the left and right operators. For more information, see [multiplicative operators](/cpp/cpp/multiplicative-operators-and-the-modulus-operator).

## Syntax

```sql
IntMul(<int_expr_1>, <int_expr_2>)
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
    multiply: IntMul(5, 2),
    negativeResult: IntMul(5, -2),
    positiveResult: IntMul(-5, -2),
    square: IntMul(5, 5),
    cube: IntMul(5, IntMul(5, 5)),
    multiplyZero: IntMul(5, 0),
    multiplyDecimal: IntMul(5, 0.5)
}
```

```json
[
  {
    "multiply": 10,
    "negativeResult": -10,
    "positiveResult": 10,
    "square": 25,
    "cube": 125,
    "multiplyZero": 0
  }
]
```

## Remarks

- This function expects integers for both arguments and performs operations assuming the values are a 64-bit integer.
- If any of the arguments aren't an integer, the function returns undefined.
- Overflow behavior is similar to the implementation in C++ (wrap-around).
- Multiplicative operators have left-to-right associativity.

## See also

- [System functions](system-functions.yml)
- [`IS_NUMBER`](is-number.md)
