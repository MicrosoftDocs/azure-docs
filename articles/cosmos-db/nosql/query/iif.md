---
title: IIF
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that returns one of two expressions based on a boolean expression input.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/01/2023
ms.custom: query-reference
---

# IIF (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Evaluates a boolean expression and returns the result of one of two expressions depending on the result of the boolean expression. If the boolean expression evaluates to `true`, return the first expression option. Otherwise, return the second expression option.

## Syntax

```sql
IIF(<bool_expr>, <true_expr>, <not_true_expr>)
```

## Arguments

| | Description |
| --- | --- |
| **`bool_expr`** | A boolean expression, which is evaluated and used to determine which of the two supplemental expressions to use. |
| **`true_expr`** | The expression to return if the boolean expression evaluated to `true`. |
| **`not_true_expr`** | The expression to return if the boolean expression evaluated to **NOT** `true`. |

## Return types

Returns an expression, which could be of any type.

## Examples

This first example evaluates a static boolean expression and returns one of two potential expressions.

```sql
SELECT VALUE {
    evalTrue: IIF(true, 123, 456),
    evalFalse: IIF(false, 123, 456),
    evalNumberNotTrue: IIF(123, 123, 456),
    evalStringNotTrue: IIF("ABC", 123, 456),
    evalArrayNotTrue: IIF([1,2,3], 123, 456),
    evalObjectNotTrue: IIF({"name": "Alice", "age": 20}, 123, 456)
}
```

```json
[
  {
    "evalTrue": 123,
    "evalFalse": 456,
    "evalNumberNotTrue": 456,
    "evalStringNotTrue": 456,
    "evalArrayNotTrue": 456,
    "evalObjectNotTrue": 456
  }
]
```

This example evaluates one of two potential expressions on multiple items in a container based on an expression that evaluates a boolean property.

```json
[
  {
    "id": "68719519221",
    "name": "Estrel Set Cutlery",
    "onSale": true,
    "pricing": {
      "msrp": 55.95,
      "sale": 30.85
    }
  },
  {
    "id": "68719520367",
    "name": "Willagno Spork",
    "onSale": false,
    "pricing": {
      "msrp": 20.15,
      "sale": 12.55
    }
  }
]
```

```sql
SELECT
    p.name,
    IIF(p.onSale, p.pricing.sale, p.pricing.msrp) AS price
FROM
    products p
```

```json
[
  {
    "name": "Estrel Set Cutlery",
    "price": 30.85
  },
  {
    "name": "Willagno Spork",
    "price": 20.15
  }
]
```

## Remarks

- This function is similar to the ternary conditional operator in various programming languages. For more information, see [ternary conditional operator](https://wikipedia.org/wiki/ternary_conditional_operator).
- This function doesn't utilize the index.

## See also

- [System functions](system-functions.yml)
- [Equality and comparison operators](equality-comparison-operators.md)
