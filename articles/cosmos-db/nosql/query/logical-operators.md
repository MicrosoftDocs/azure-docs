---
title: Logical operators
titleSuffix: Azure Cosmos DB for NoSQL
description: Logical operators in Azure Cosmos DB for NoSQL compare two different expressions with boolean (true/false) operands.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/31/2023
ms.custom: query-reference
---

# Logical operators in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Logical operators in Azure Cosmos DB for NoSQL compare two different expressions with boolean (``true``/``false``) operands.

## Understanding logical (AND, OR and NOT) operators

Logical operators operate on **boolean** values. The following tables show the logical *truth tables* for each operator.

### OR operator

The ``OR`` operator returns ``true`` when either of the conditions is ``true``.

|  | ``true`` | ``false`` | ``undefined`` |
| --- | --- | --- | --- |
| **``true``** | ``true`` | ``true`` | ``true`` |
| **``false``** | ``true`` | ``false`` | ``undefined`` |
| **``undefined``** | ``true`` | ``undefined`` | ``undefined`` |

### AND operator

The ``AND`` operator returns ``true`` when both expressions are ``true``.

|  | ``true`` | ``false`` | ``undefined`` |
| --- | --- | --- | --- |
| **``true``** | ``true`` | ``false`` | ``undefined`` |
| **``false``** | ``false`` | ``false`` | ``false`` |
| **``undefined``** | ``undefined`` | ``false`` | ``undefined`` |

### NOT operator

The ``NOT`` operator reverses the value of any boolean expression.

|  | ``NOT`` |
| --- | --- |
| **``true``** | ``false`` |
| **``false``** | ``true`` |
| **``undefined``** | ``undefined`` |

## Operator Precedence

The logical operators ``OR``, ``AND``, and ``NOT`` have the precedence level indicated here.

| | Priority |
| --- | --- |
| **``NOT``** | 1 |
| **``AND``** | 2 |
| **``OR``** | 3 |

## * operator

The special operator ``*`` projects the entire item as is. When used, it must be the only projected field. A query like ``SELECT * FROM products p`` is valid, but ``SELECT VALUE * FROM products p`` or ``SELECT *, p.id FROM products p`` aren't valid.

## Next steps

- [``SELECT`` clause](select.md)
- [Keywords](keywords.md)
- [Equality/comparison operators](equality-comparison-operators.md)
