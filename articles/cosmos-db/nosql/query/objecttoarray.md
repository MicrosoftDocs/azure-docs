---
title: ObjectToArray
titleSuffix: Azure Cosmos DB for NoSQL
description: An Azure Cosmos DB for NoSQL system function that converts field/value pairs in a JSON object to a JSON array.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# ObjectToArray (NoSQL query)

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Converts each field/value pair in a JSON object into an element and then returns the set of elements as a JSON array. By default, the array elements contain a new `k` field for the original field's name and a new `v` field for the original field's value. These new field names can be further customized.

## Syntax

```sql
ObjectToArray(<object_expr> [, <string_expr_1>, <string_expr_2>])
```

## Arguments

| | Description |
| --- | --- |
| **`object_expr`** | An object expression with properties in field/value pairs. |
| **`string_expr_1` *(Optional)*** | A string expression with a name for the field representing the *field* portion of the original field/value pair. |
| **`string_expr_2` *(Optional)*** | A string expression with a name for the field representing the *value* portion of the original field/value pair. |

## Return types

An array of elements with two fields, either `k` and `v` or custom-named fields.

## Examples

This example demonstrates converting a static object to an array of field/value pairs using the default `k` and `v` identifiers.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/objecttoarray/query.sql" highlight="2-5":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/objecttoarray/result.json":::

In this example, the field name is updated to use the `name` identifier.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/objecttoarray-key/query.sql" highlight="2-5":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/objecttoarray-key/result.json":::

In this example, the value name is  updated to use the `value` identifier and the field name uses the `key` identifier.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/objecttoarray-key-value/query.sql" highlight="2-5":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/objecttoarray-key-value/result.json":::

This final example uses an item within an existing container that stores data using fields within a JSON object.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/objecttoarray-field/seed.json" range="1-2,4-13" highlight="5-10":::

In this example, the function is used to break up the object into an array item for each field/value pair.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/objecttoarray-field/query.sql" highlight="3":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/objecttoarray-field/result.json":::

## Remarks

- If the input value isn't a valid object, the result is `undefined`.

## See also

- [System functions](system-functions.yml)
- [`IS_ARRAY`](is-array.md)
