---
title: SELECT
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL clause that identifies fields to return in query results.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/31/2023
ms.custom: query-reference
---

# SELECT clause (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Every query consists of a ``SELECT`` clause and optionally [``FROM``](from.md) and [``WHERE``](where.md) clauses, per ANSI SQL standards. Typically, the source in the ``FROM`` clause is enumerated, and the ``WHERE`` clause applies a filter on the source to retrieve a subset of JSON items. The ``SELECT`` clause then projects the requested JSON values in the select list.

## Syntax

```sql
SELECT <select_specification>  

<select_specification> ::=
      '*'
      | [DISTINCT] <object_property_list>
      | [DISTINCT] VALUE <scalar_expression> [[ AS ] value_alias]  
  
<object_property_list> ::=
{ <scalar_expression> [ [ AS ] property_alias ] } [ ,...n ]
```

## Arguments

| | Description |
| --- | --- |
| **``<select_specification>``** | Properties or value to be selected for the result set. |
| **``'*'``** | Specifies that the value should be retrieved without making any changes. Specifically if the processed value is an object, all properties are retrieved. |
| **``<object_property_list>``** | Specifies the list of properties to be retrieved. Each returned value is an object with the properties specified. |
| **``VALUE``** | Specifies that the JSON value should be retrieved instead of the complete JSON object. This argument, unlike ``<property_list>`` doesn't wrap the projected value in an object. |
| **``DISTINCT``** | Specifies that duplicates of projected properties should be removed. |
| **``<scalar_expression>``** | Expression representing the value to be computed. For more information, see [scalar expressions](scalar-expressions.md) section for details. |

## Examples

This first example selects two static string values and returns an array with a single object containing both values. Since the values are unnamed, a sequential generated number is used to name the equivalent json field.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/select/query.sql":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/select/result.json":::

In this next example, JSON projection is used to fine tune the exact structure and field names for the resulting JSON object. Here, a JSON object is created with fields named ``department`` and ``team``. The outside JSON object is still unnamed, so a generated number (``$1``) is used to name this field.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/select-json/query.sql":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/select-json/result.json":::

This example illustrates flattening the result set from the previous example to simplify parsing. The ``VALUE`` keyword is used here to prevent the wrapping of the results into another JSON object.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/select-value-json/query.sql":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/select-value-json/result.json":::

In this example, the ``VALUE`` keyword is used with a static string to create an array of strings as the result.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/select-value/query.sql":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/select-value/result.json":::

In this final example, assume that there's a container with two items with various fields of different data types.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/select-fields/seed.json" range="1-2,4-12,14-22":::

This final example query uses a combination of a ``SELECT`` clause, the ``VALUE`` keyword, a ``FROM`` clause, and JSON projection to perform a common query with the results transformed to a JSON object for the client to parse.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/select-fields/query.sql" range="1-7" highlight="1,6":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/select-fields/result.json":::

## Remarks

- The ``SELECT *`` syntax is only valid if ``FROM`` clause has declared exactly one alias. ``SELECT *`` provides an identity projection, which can be useful if no projection is needed. ``SELECT *`` is only valid if ``FROM`` clause is specified and introduced only a single input source.  
- Both ``SELECT <select_list>`` and ``SELECT *`` are "syntactic sugar" and can be alternatively expressed by using simple ``SELECT`` statements:
  - ``SELECT * FROM ... AS from_alias ...`` is equivalent to: ``SELECT from_alias FROM ... AS from_alias ...``.
  - ``SELECT <expr1> AS p1, <expr2> AS p2,..., <exprN> AS pN [other clauses...]`` is equivalent to: ``SELECT VALUE { p1: <expr1>, p2: <expr2>, ..., pN: <exprN> }[other clauses...]``.

## Next steps

- [``FROM`` clause](from.md)
- [``WHERE`` clause](where.md)
