---
title: IntSub
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that subtracts one number from the other.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# IntSub (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Subtracts the value of the right-hand operand from the left-hand operand. For more information, see [additive operators](/cpp/cpp/additive-operators-plus-and).

## Syntax

```sql
IntSub(<int_expr_1>, <int_expr_2>)
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
    negativeResult: IntSub(25, 50),
    positiveResult: IntSub(25, 15),
    subtractSameNumber: IntSub(25, 25),
    subtractZero: IntSub(25, 0),
    subtractDecimal: IntSub(25, 2.5)
}
```

```json
[
  {
    "negativeResult": -25,
    "positiveResult": 10,
    "subtractSameNumber": 0,
    "subtractZero": 25
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
