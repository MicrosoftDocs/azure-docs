---
title: ORDER BY
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL clause that specifies a sort order for the query results.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# ORDER BY (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

The optional ``ORDER BY`` clause specifies the sorting order for results returned by the query.

## Syntax

```sql
ORDER BY <sort_specification>  
<sort_specification> ::= <sort_expression> [, <sort_expression>]  
<sort_expression> ::= {<scalar_expression> [ASC | DESC]} [ ,...n ]
```  

## Arguments

| | Description |
| --- | --- |
| **``<sort_specification>``** | Specifies a property or expression on which to sort the query result set. A sort column can be specified as a name or property alias. Multiple properties can be specified. Property names must be unique. The sequence of the sort properties in the ``ORDER BY`` clause defines the organization of the sorted result set. That is, the result set is sorted by the first property and then that ordered list is sorted by the second property, and so on. The property names referenced in the ``ORDER BY`` clause must correspond to either a property in the select list or to a property defined in the collection specified in the ``FROM`` clause without any ambiguities. |
| **``<sort_expression>``** | Specifies one or more properties or expressions on which to sort the query result set. |
| **``<scalar_expression>``** | Expression representing the value to be computed. |
| **``ASC`` or ``DESC``** | Specifies that the values in the specified column should be sorted in ascending or descending order. ``ASC`` sorts from the lowest value to highest value. ``DESC`` sorts from highest value to lowest value. If this argument isn't specified, ``ASC`` (ascending) is the default sort order. ``null`` values are treated as the lowest possible values. |

> [!NOTE]
> For more information on scalar expressions, see [scalar expressions](scalar-expressions.md)

## Examples

For the examples in this section, this reference set of items is used. Each item contains a `name` property with `first` and `last` subproperties.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/order-by/seed.json" range="1-2,4-10,12-18,20-26" highlight="3-6,10-13,17-20":::

In this first example, the ``ORDER BY`` clause is used to sort a field by the default sort order, ascending.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/order-by/query.sql" range="1-6,9-10" highlight="7-8":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/order-by/result.json":::

In this next example, the sort order is explicitly specified to be descending.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/order-by-desc/query.sql" range="1-6,9-10" highlight="7-8":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/order-by-desc/result.json":::

In this final example, the items are sorted using two fields, in a specific order using explicitly specified ordering. A query that sorts using two or more fields requires a [composite index](../../index-policy.md#composite-indexes).

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/order-by-multiple/query.novalidate.sql" range="1-6,9-11" highlight="7-9":::

## Remarks  

- Queries with ``ORDER BY`` return all items, including items where the property in the ORDER BY clause isn't defined. Typically, you can't control the order that different ``undefined`` types appear in the results. To control the sort order of undefined values, assign any ``undefined`` properties an arbitrary value to ensure they sort either before or after the defined values.
- The ``ORDER BY`` clause requires that the indexing policy includes an index for the fields being sorted. The query runtime supports sorting against a property name or [computed properties](./computed-properties.md). The runtime also supports multiple ``ORDER BY`` properties. In order to run a query with multiple ``ORDER BY`` properties, define a [composite index](../../index-policy.md#composite-indexes) on the fields being sorted.
- If the properties being sorted might be ``undefined`` for some items and you want to retrieve them in an ``ORDER BY`` query, you must explicitly include this path in the index. The default indexing policy doesn't allow for the retrieval of the items where the sort property is ``undefined``.

## Related content

- [``GROUP BY`` clause](group-by.md)
- [``OFFSET LIMIT`` clause](offset-limit.md)
