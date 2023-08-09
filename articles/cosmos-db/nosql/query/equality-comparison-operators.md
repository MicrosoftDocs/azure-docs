---
title: Equality and comparison operators
titleSuffix: Azure Cosmos DB for NoSQL
description: Equality and comparison operators in Azure Cosmos DB for NoSQL check two different expressions for equivalency or compares both expressions relationally.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/31/2023
ms.custom: query-reference
---

# Equality and comparison operators in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Equality and comparison operators in Azure Cosmos DB for NoSQL check two different expressions for equivalency or compares both expressions relationally.

## Understanding equality comparisons

The following table shows the result of equality comparisons in the API for NoSQL between any two JSON types.

| | **Undefined** | Null | Boolean | Number | String | Object | Array |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Undefined** | Undefined | Undefined | Undefined | Undefined | Undefined | Undefined | Undefined |
| **Null** | Undefined | **Ok** | Undefined | Undefined | Undefined | Undefined | Undefined |
| **Boolean** | Undefined | Undefined | **Ok** | Undefined | Undefined | Undefined | Undefined |
| **Number** | Undefined | Undefined | Undefined | **Ok** | Undefined | Undefined | Undefined |
| **String** | Undefined | Undefined | Undefined | Undefined | **Ok** | Undefined | Undefined |
| **Object** | Undefined | Undefined | Undefined | Undefined | Undefined | **Ok** | Undefined |
| **Array** | Undefined | Undefined | Undefined | Undefined | Undefined | Undefined | **Ok** |

For comparison operators such as ``>``, ``>=``, ``!=``, ``<``, and ``<=``, comparison across types or between two objects or arrays produces ``undefined``.

If the result of the scalar expression is ``undefined``, the item isn't included in the result, because ``undefined`` doesn't equate to ``true``.

For example, the following query's comparison between a number and string value produces ``undefined``. Therefore, the filter doesn't include any results.

```sql
SELECT
    *
FROM
    products p
WHERE 
    0 = "true"
```

## Next steps

- [``SELECT`` clause](select.md)
- [Keywords](keywords.md)
- [Logical operators](logical-operators.md)
