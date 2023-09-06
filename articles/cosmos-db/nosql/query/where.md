---
title: WHERE
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL clause that applies a filter to return a subset of items in the query results.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/31/2023
ms.custom: query-reference
---

# WHERE clause (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

The optional ``WHERE`` clause (``WHERE <filter_condition>``) specifies condition(s) that the source JSON items must satisfy for the query to include them in results. A JSON item must evaluate the specified conditions to ``true`` to be considered for the result. The index layer uses the ``WHERE`` clause to determine the smallest subset of source items that can be part of the result.

## Syntax

```sql
WHERE <filter_condition>  
<filter_condition> ::= <scalar_expression>
```

| | Description |
| --- | --- |
| **``<filter_condition>``** | Specifies the condition to be met for the items to be returned. |
| **``<scalar_expression>``** | Expression representing the value to be computed. |

> [!NOTE]
> For more information on scalar expressions, see [scalar expressions](scalar-expressions.md)

## Examples

This first example uses a simple equality query to return a subset of items. The ``=`` operator is used with the ``WHERE`` clause to create a filter based on simple equality.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/where/query.sql" highlight="7-8":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/where/result.json":::

In this next example, a more complex filter is composed of [scalar expressions](scalar-expressions.md).

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/where-scalar/query.sql" range="1-8" highlight="7-8":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/where-scalar/result.json":::

In this final example, a property reference to a boolean property is used as the filter.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/where-field/query.sql" range="1-8" highlight="7-8":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/where-field/result.json":::

## Remarks

- In order for an item to be returned, an expression specified as a filter condition must evaluate to true. Only the boolean value ``true`` satisfies the condition, any other value: ``undefined``, ``null``, ``false``, a number scalar, an array, or an object doesn't satisfy the condition.
- If you include your partition key in the ``WHERE`` clause as part of an equality filter, your query automatically filters to only the relevant partitions.
- You can use the following supported binary operators:  
  | | Operators |
  | --- | --- |
  | **Arithmetic** | ``+``,``-``,``*``,``/``,``%`` |
  | **Bitwise** | ``|``, ``&``, ``^``, ``<<``, ``>>``, ``>>>`` *(zero-fill right shift)* |
  | **Logical** | ``AND``, ``OR``, ``NOT`` |
  | **Comparison** | ``=``, ``!=``, ``<``, ``>``, ``<=``, ``>=``, ``<>`` |
  | **String** |  ``||`` *(concatenate)* |

## Next steps

- [``SELECT`` clause](select.md)
- [``FROM`` clause](from.md)
