---
title: Work with JSON
titleSuffix: Azure Cosmos DB for NoSQL
description: Query and access nested JSON properties and use special characters in Azure Cosmos DB for NoSQL.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 09/21/2023
ms.custom: query-reference
---

# Work with JSON in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

In Azure Cosmos DB for NoSQL, items are stored as JSON. The type system and expressions are restricted to deal only with JSON types. For more information, see the [JSON specification](https://www.json.org/).

We summarize some important aspects of working with JSON:

- JSON objects always begin with a ``{`` left brace and end with a ``}`` right brace
- You can have JSON properties [nested](#nested-properties) within one another
- JSON property values can be arrays
- JSON property names are case sensitive
- JSON property name can be any string value (including spaces or characters that aren't letters)

## Nested properties

You can access nested JSON using a dot (``.``) accessor. You can use nested JSON properties in your queries the same way that you can use any other properties.

Here's a document with nested JSON:

```JSON
{
  "name": "Teapo rainbow surfboard",
  "manufacturer": {
    "name": "AdventureWorks"
  },
  "releaseDate": null,
  "metadata": {
    "sku": "72109",
    "colors": [
      "cruise",
      "picton-blue"
    ],
    "sizes": {
      "small": {
        "inches": 76,
        "feet": 6.33333
      },
      "large": {
        "inches": 92,
        "feet": 7.66667
      }
    }
  }
}
```

In this case, the ``sku``, ``colors``, and ``sizes`` properties are all nested within the ``metadata`` property. The ``name`` property is also nested within the ``manufacturer`` property.

This first example projects two nested properties.

```sql
SELECT
    p.name,
    p.metadata.sku,
    p.sizes.small.inches AS size
FROM
    products p
```

```json
[
  {
    "name": "Teapo rainbow surfboard",
    "sku": "72109"
  }
]
```

## Work with arrays

In addition to nested properties, JSON also supports arrays. When working with arrays, you can access a specific element within the array by referencing its position.

This example accesses an array element at a specific position.

```sql
SELECT
    p.name,
    p.metadata.colors
FROM
    products p
WHERE
    p.metadata.colors[0] NOT LIKE "%orange%"
```

```json
[
  {
    "name": "Teapo rainbow surfboard",
    "colors": [
      "cruise",
      "picton-blue"
    ]
  }
]
```

In most cases, however, you use a [subquery](subquery.md) or [self-join](join.md) when working with arrays.

For example, here's a query that returns multiple permutations using the potential array values and a *cross-join*, 

```sql
SELECT
    p.name,
    c AS color
FROM
    products p
JOIN
    c IN p.metadata.colors
```

```json
[
  {
    "name": "Teapo rainbow surfboard",
    "color": "cruise"
  },
  {
    "name": "Teapo rainbow surfboard",
    "color": "picton-blue"
  }
]
```

As another example, the query could also use [``EXISTS``](subquery.md#exists-expression) with a subquery.

```sql
SELECT VALUE
    p.name
FROM
    products p
WHERE
    EXISTS (SELECT VALUE 
        c
    FROM
        c IN p.metadata.colors
    WHERE
        c LIKE "%picton%")
```

```json
[
  "Teapo rainbow surfboard"
]
```

## Difference between null and undefined

If a property isn't defined in an item, then its value is ``undefined``. A property with the value ``null`` must be explicitly defined and assigned a ``null`` value.

Azure Cosmos DB for NoSQL supports two helpful type checking system functions for ``null`` and ``undefined`` properties:

- [``IS_NULL``](is-null.md) - checks if a property value is ``null``.
- [``IS_DEFINED``](is-defined.md) - checks if a property value is defined or ``undefined``.

Here's an example query that checks for two fields on each item in the container.

```sql
SELECT
    IS_NULL(p.releaseDate) AS isReleaseDateNull,
    IS_DEFINED(p.releaseDate) AS isReleaseDateDefined,
    IS_NULL(p.retirementDate) AS isRetirementDateNull,
    IS_DEFINED(p.retirementDate) AS isRetirementDateDefined
FROM
    products p
```

```json
[
  {
    "isReleaseDateNull": true,
    "isReleaseDateDefined": true,
    "isRetirementDateNull": false,
    "isRetirementDateDefined": false
  }
]
```

For more information about common operators and their behavior for ``null`` and ``undefined`` values, see [equality and comparison operators](equality-comparison-operators.md).

## Reserved keywords and special characters in JSON

You can access properties using the quoted property operator ``[]``. For example, ``SELECT c.grade`` and ``SELECT c["grade"]`` are equivalent. This syntax is useful to escape a property that contains spaces, special characters, or has the same name as a SQL keyword or reserved word.

For example, here's a query that references a property a few distinct ways.

```sql
SELECT
    p.manufacturer.name AS dotNotationReference,
    p["manufacturer"]["name"] AS bracketReference,
    p.manufacturer["name"] AS mixedReference
FROM
    products p
```

```json
[
  {
    "dotNotationReference": "AdventureWorks",
    "bracketReference": "AdventureWorks",
    "mixedReference": "AdventureWorks"
  }
]
```

## JSON expressions

Query projection supports JSON expressions and syntax.

```sql
SELECT {
    "productName": p.name,
    "largeSizeInFeet": p.metadata.sizes.large.feet
}
FROM
    products p
```

```json
[
  {
    "$1": {
      "productName": "Teapo rainbow surfboard",
      "largeSizeInFeet": 7.66667
    }
  }
]
```

In this example, the ``SELECT`` clause creates a JSON object. Since the sample provides no key, the clause uses the implicit argument variable name ``$<index-number>``.

This example explicitly names the same field.

```sql
SELECT {
    "productName": p.name,
    "largeSizeInFeet": p.metadata.sizes.large.feet
} AS product
FROM
    products p
```

```json
[
  {
    "product": {
      "productName": "Teapo rainbow surfboard",
      "largeSizeInFeet": 7.66667
    }
  }
]
```

Alternatively, the query can flatten the object to avoid naming a redundant field.

```sql
SELECT VALUE {
    "productName": p.name,
    "largeSizeInFeet": p.metadata.sizes.large.feet
}
FROM
    products p
```

```json
[
  {
    "productName": "Teapo rainbow surfboard",
    "largeSizeInFeet": 7.66667
  }
]
```

## Alias values

You can explicitly alias values in queries. If a query has two properties with the same name, use aliasing to rename one or both of the properties so they're disambiguated in the projected result.

### Examples

The ``AS`` keyword used for aliasing is optional, as shown in the following example.

```sql
SELECT
    p.name,
    p.metadata.sku AS modelNumber
FROM
    products p
```

```json
[
  {
    "name": "Teapo rainbow surfboard",
    "modelNumber": "72109"
  }
]
```

### Alias values with reserved keywords or special characters

You can't use aliasing to project a value as a property name with a space, special character, or reserved word. If you wanted to change a value's projection to, for example, have a property name with a space, you could use a [JSON expression](#json-expressions).

Here's an example:

```sql
SELECT VALUE {
    "Product's name | ": p.name,
    "Model number => ": p.metadata.sku
}
FROM
    products p
```

```json
[
  {
    "Product's name | ": "Teapo rainbow surfboard",
    "Model number => ": "72109"
  }
]
```

## Related content

- [``SELECT`` clause](select.md)
- [``WHERE`` clause](where.md)
