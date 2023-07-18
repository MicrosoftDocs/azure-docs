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
ms.date: 07/01/2023
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

```sql
SELECT VALUE
    ObjectToArray({ 
        "a": "12345", 
        "b": "67890"
    })
```

```json
[
  [
    {
      "k": "a",
      "v": "12345"
    },
    {
      "k": "b",
      "v": "67890"
    }
  ]
]
```

In this example, the field name is updated to use the `name` identifier.

```sql
SELECT VALUE
    ObjectToArray({ 
        "a": "12345", 
        "b": "67890"
    }, "name")
```

```json
[
  [
    {
      "name": "a",
      "v": "12345"
    },
    {
      "name": "b",
      "v": "67890"
    }
  ]
]
```

In this example, the value name is  updated to use the `value` identifier and the field name uses the `key` identifier.

```sql
SELECT VALUE
    ObjectToArray({ 
        "a": "12345", 
        "b": "67890"
    }, "key", "value")
```

```json
[
  [
    {
      "key": "a",
      "value": "12345"
    },
    {
      "key": "b",
      "value": "67890"
    }
  ]
]
```

This final example uses an item within an existing container that stores data using fields within a JSON object.

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/object-to-array/seed.json":::

In this example, the function is used to break up the object into an array item for each field/value pair.

:::code language="sql" source="~/cosmos-db-nosql-query-samples/scripts/object-to-array/query.sql":::

:::code language="json" source="~/cosmos-db-nosql-query-samples/scripts/object-to-array/result.json":::

## Remarks

If the input value isn't a valid Object, the result is Undefined\. 

## See also

- [System functions](system-functions.yml)
- [`IS_ARRAY`](is-array.md)
