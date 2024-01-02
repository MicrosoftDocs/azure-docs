---
title: GROUP BY
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL clause that splits the results according to specified properties.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# GROUP BY (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

The ``GROUP BY`` clause divides the query's results according to the values of one or more specified properties.

## Syntax

```sql  
<group_by_clause> ::= GROUP BY <scalar_expression_list>

<scalar_expression_list> ::=
          <scalar_expression>
        | <scalar_expression_list>, <scalar_expression>
```  

## Arguments

| | Description |
| --- | --- |
| **``<scalar_expression_list>``** | Specifies the expressions that are used to group (or divide) query results. |
| **``<scalar_expression>``** | Any scalar expression is allowed except for scalar subqueries and scalar aggregates. Each scalar expression must contain at least one property reference. There's no limit to the number of individual expressions or the cardinality of each expression. |

## Examples

For the examples in this section, this reference set of items is used. Each item includes a ``capabilities`` object that may include ``softwareDevelopment`` and ``mediaTrained`` properties.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/group-by/seed.json" range="1-2,4-11,13-20,22-29,31-38,40-46,48-55,57-64" highlight="4-7,12-15,20-23,28-31,36-38,43-46,51-54":::

In this first example, the ``GROUP BY`` clause is used to create groups of items using the value of a specified property.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/group-by/query.sql" range="1-4,7-8" highlight="5-6":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/group-by/result.json":::

In this next example, an aggregate system function ([``COUNT``](count.md)) is used with the groupings to provide a total number of items per group.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/group-by-aggregate/query.sql" range="1-5,8-9" highlight="6-7":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/group-by-aggregate/result.json":::

In this final example, the items are grouped using multiple properties.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/group-by-multiple/query.sql" range="1-6,9-11" highlight="7-9":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/group-by-multiple/result.json":::

## Remarks

- When a query uses a ``GROUP BY`` clause, the ``SELECT`` clause can only contain the subset of properties and system functions included in the ``GROUP BY`` clause. One exception is aggregate functions, which can appear in the ``SELECT`` clause without being included in the ``GROUP BY`` clause. You can also always include literal values in the ``SELECT`` clause.
- The ``GROUP BY`` clause must be after the ``SELECT``, ``FROM``, and ``WHERE`` clause and before the ``OFFSET LIMIT`` clause. You can't use ``GROUP BY`` with an ``ORDER BY`` clause.
- The ``GROUP BY`` clause doesn't allow any of the following features, properties, or functions:
  - Aliasing properties or aliasing system functions (aliasing is still allowed within the ``SELECT`` clause)
  - Subqueries
  - Aggregate system functions (these functions are only allowed in the ``SELECT`` clause)
- Queries with an aggregate system function and a subquery with ``GROUP BY`` aren't supported.
- Cross-partition ``GROUP BY`` queries can have a maximum of **21** aggregate system functions.

## Related content

- [``ORDER BY`` clause](order-by.md)
- [``OFFSET LIMIT`` clause](offset-limit.md)
