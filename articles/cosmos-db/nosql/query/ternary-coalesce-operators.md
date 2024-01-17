---
title: Ternary and coalesce operators
titleSuffix: Azure Cosmos DB for NoSQL
description: Ternary and coalesce operators in Azure Cosmos DB for NoSQL evaluates expressions and returns a result depending on a boolean operand or if a field exists.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# Ternary and coalesce operators in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Ternary and coalesce operators in Azure Cosmos DB for NoSQL evaluates expressions and returns a result depending on a boolean operand or if a field exists. Both the ternary and coalesce operators function similarly to popular programming languages like C# and JavaScript. Use the ternary (``?``) and coalesce (``??``) operators to build conditional expressions that are resilient against semi-structured or mixed-type data.

## Ternary operator

The ``?`` operator returns a value depending on the evaluation of the first expression.

### Syntax

```
<bool_expr> ?  
    <expr_true> : 
    <expr_false>
```

### Arguments

| | Description |
| --- | --- |
| **``bool_expr``** | A boolean expression. |
| **``expr_true``** | The expression to evaluate if ``bool_expr`` evaluates to ``true``. |
| **``expr_false``** | The expression to evaluate if ``bool_expr`` evaluates to ``false``. |

### Examples

Consider these items in a container. They contain multiple metadata properties related to pricing, and one of the properties doesn't exist on all items.

```json
[
  {
    "name": "Stangincy trekking poles",
    "price": 24.50,
    "onCloseout": false,
    "onSale": true,
    "collapsible": true
  },
  {
    "name": "Vimero hiking poles",
    "price": 24.50,
    "onCloseout": false,
    "onSale": false
  },
  {
    "name": "Kramundsen trekking poles",
    "price": 24.50,
    "onCloseout": true,
    "onSale": true,
    "collapsible": false
  }
]
```

This query evaluates the expression ``onSale``, which is equivalent to ``onSale = true``. The query then returns the price multiplied by ``0.85`` if ``true`` or the price unchanged if ``false``.

```sql
SELECT
    p.name,
    p.price AS subtotal,
    p.onSale ? (p.price * 0.85) : p.price AS total
FROM
    products p
```

```json
[
  {
    "name": "Stangincy trekking poles",
    "subtotal": 24.5,
    "total": 20.825
  },
  {
    "name": "Vimero hiking poles",
    "subtotal": 24.5,
    "total": 24.5
  },
  {
    "name": "Kramundsen trekking poles",
    "subtotal": 24.5,
    "total": 20.825
  }
]
```

You can also nest calls to the ``?`` operator. This example adds an extra calculation based on a second property (``taxFree``)

```sql
SELECT
    p.name,
    p.price AS subtotal,
    p.onCloseout ? (p.price * 0.55) : p.onSale ? (p.price * 0.85) : p.price AS total
FROM
    products p
```

```json
[
  {
    "name": "Stangincy trekking poles",
    "subtotal": 24.5,
    "total": 20.825
  },
  {
    "name": "Vimero hiking poles",
    "subtotal": 24.5,
    "total": 24.5
  },
  {
    "name": "Kramundsen trekking poles",
    "subtotal": 24.5,
    "total": 13.475000000000001
  }
]
```

As with other query operators, the ``?`` operator excludes items if the referenced properties are missing or the types being compared are different.

## Coalesce operator

Use the ``??`` operator to efficiently check for a property in an item when querying against semi-structured or mixed-type data. 

For example, this query assumes that any item where the property ``collapsible`` isn't present, isn't collapsible.

```sql
SELECT
    p.name,
    p.collapsible ?? false AS isCollapsible
FROM
    products p
```

## Related content

- [``SELECT`` clause](select.md)
- [Keywords](keywords.md)
- [Logical operators](logical-operators.md)
