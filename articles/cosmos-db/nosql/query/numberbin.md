---
title: NumberBin
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that rounds an input value to a multiple of the specified size.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# NumberBin (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Rounds the numeric expression's value down to a multiple of specified bin size.

## Syntax

```sql
NumericBin(<numeric_expr> [, <bin_size>])
```

## Arguments

| | Description |
| --- | --- |
| **`numeric_expr`** | A numeric expression, which is evaluated and then the resulting value is rounded to a multiple of the specified bin size. |
| **`bin_size` *(Optional)*** | A numeric value that specifies the bin size to use when rounding the value. This numeric value defaults to `1` if not specified. |

## Return types

Returns a numeric value.

## Examples

This first example bins a single static number with various bin sizes.

```sql
SELECT VALUE {
    roundToNegativeHundreds: NumberBin(37.752, -100),
    roundToTens: NumberBin(37.752, 10),
    roundToOnes: NumberBin(37.752, 1),
    roundToZeroes: NumberBin(37.752, 0),
    roundToOneTenths: NumberBin(37.752, 0.1),
    roundToOneHundreds: NumberBin(37.752, 0.01)
}
```

```json
[
  {
    "roundToNegativeHundreds": 100,
    "roundToTens": 30,
    "roundToOnes": 37,
    "roundToOneTenths": 37.7,
    "roundToOneHundreds": 37.75
  }
]
```

This next example uses a value from an existing item and rounds that value using the function.

```json
{
  "name": "Ignis Cooking System",
  "price": 155.23478
}
```

```sql
SELECT
    p.name,
    NumberBin(p.price, 0.01) AS price
FROM
    products p
```

```json
[
  {
    "name": "Ignis Cooking System",
    "price": 155.23
  }
]
```

## Remarks

- This function returns **undefined** if the specified bin size is `0`.
- The default bin size is `1`. This bin size effectively returns a numeric value rounded to the next integer.

## See also

- [System functions](system-functions.yml)
- [`ROUND`](round.md)
