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
ms.date: 07/01/2023
ms.custom: query-reference
---

# IS_INTEGER (NoSQL query)

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

```sql
SELECT VALUE {
    smallDecimalValue: IS_INTEGER(3454.123),
    integerValue: IS_INTEGER(5523432),
    minIntegerValue: IS_INTEGER(-9223372036854775808),
    maxIntegerValue: IS_INTEGER(9223372036854775807),
    outOfRangeValue: IS_INTEGER(18446744073709551615)
}
```

```json
[
  {
    "smallDecimalValue": false,
    "integerValue": true,
    "minIntegerValue": true,
    "maxIntegerValue": true,
    "outOfRangeValue": false
  }
]
```

## See also

- [System functions](system-functions.yml)
- [`IS_NUMBER`](is-number.md)
