---
title: Working with JSON in Azure Cosmos DB
description: Learn about to query and access nested JSON properties and use special characters in Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/19/2020
ms.author: tisande
---

# Working with JSON in Azure Cosmos DB

In Azure Cosmos DB's SQL (Core) API, items are stored as JSON. The type system and expressions are restricted to deal only with JSON types. For more information, see the [JSON specification](https://www.json.org/).

We'll summarize some important aspects of working with JSON:

- JSON objects always begin with a `{` left brace and end with a `}` right brace
- You can have JSON properties [nested](#nested-properties) within one another
- JSON property values can be arrays
- JSON property names are case sensitive
- JSON property name can be any string value (including spaces or characters that aren't letters)

## Nested properties

You can access nested JSON using a dot accessor. You can use nested JSON properties in your queries the same way that you can use any other properties.

Here's a document with nested JSON:

```JSON
{
  "id": "AndersenFamily",
  "lastName": "Andersen",
  "address": {
      "state": "WA",
      "county": "King",
      "city": "Seattle"
      },
  "creationDate": 1431620472,
  "isRegistered": true
}
```

In this case, the `state`, `country`, and `city` properties are all nested within the `address` property.

The following example projects two nested properties: `f.address.state` and `f.address.city`.

```sql
    SELECT f.address.state, f.address.city
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The results are:

```json
    [{
      "state": "WA",
      "city": "Seattle"
    }]
```

## Working with arrays

In addition to nested properties, JSON also supports arrays.

Here's an example document with an array:

```json
{
  "id": "WakefieldFamily",
  "children": [
      {
        "familyName": "Merriam",
        "givenName": "Jesse",
        "gender": "female",
        "grade": 1,
      },
      {
        "familyName": "Miller",
         "givenName": "Lisa",
         "gender": "female",
         "grade": 8
      }
  ],
}
```

When working with arrays, you can access a specific element within the array by referencing its position:

```sql
SELECT *
FROM Families f
WHERE f.children[0].givenName = "Jesse"
```

In most cases, however, you'll use a [subquery](sql-query-subquery.md) or [self-join](sql-query-join.md) when working with arrays.

For example, here's a document that shows the daily balance of a customer's bank account.

```json
{
  "id": "Contoso-Checking-Account-2020",
  "balance": [
      {
        "checkingAccount": 1000,
        "savingsAccount": 5000
      },
      {
        "checkingAccount": 100,
        "savingsAccount": 5000
      },
      {
        "checkingAccount": -10,
        "savingsAccount": 5000,
      },
      {
        "checkingAccount": 5000,
        "savingsAccount": 5000,
      }
         ...
  ]
}
```

If you wanted to run a query that showed all the customers that had a negative balance at some point, you could use [EXISTS](sql-query-subquery.md#exists-expression) with a subquery:

```sql
SELECT c.id
FROM c
WHERE EXISTS(
    SELECT VALUE n
    FROM n IN c.balance
    WHERE n.checkingAccount < 0
)
```

## Reserved keywords and special characters in JSON

You can access properties using the quoted property operator `[]`. For example, `SELECT c.grade` and `SELECT c["grade"]` are equivalent. This syntax is useful to escape a property that contains spaces, special characters, or has the same name as a SQL keyword or reserved word.

For example, here's a document with a property named `order` and a property `price($)` that contains special characters:

```json
{
  "id": "AndersenFamily",
  "order": {
         "orderId": "12345",
         "productId": "A17849",
         "price($)": 59.33
   },
  "creationDate": 1431620472,
  "isRegistered": true
}
```

If you run a queries that includes the `order` property or `price($)` property, you will receive a syntax error.

```sql
SELECT * FROM c where c.order.orderid = "12345"
```

```sql
SELECT * FROM c where c.order.price($) > 50
```

The result is:

`
Syntax error, incorrect syntax near 'order'
`

You should rewrite the same queries as below:

```sql
SELECT * FROM c WHERE c["order"].orderId = "12345"
```

```sql
SELECT * FROM c WHERE c["order"]["price($)"] > 50
```

## JSON expressions

Projection also supports JSON expressions, as shown in the following example:

```sql
    SELECT { "state": f.address.state, "city": f.address.city, "name": f.id }
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The results are:

```json
    [{
      "$1": {
        "state": "WA",
        "city": "Seattle",
        "name": "AndersenFamily"
      }
    }]
```

In the preceding example, the `SELECT` clause needs to create a JSON object, and since the sample provides no key, the clause uses the implicit argument variable name `$1`. The following query returns two implicit argument variables: `$1` and `$2`.

```sql
    SELECT { "state": f.address.state, "city": f.address.city },
           { "name": f.id }
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The results are:

```json
    [{
      "$1": {
        "state": "WA",
        "city": "Seattle"
      },
      "$2": {
        "name": "AndersenFamily"
      }
    }]
```

## Aliasing

You can explicitly alias values in queries. If a query has two properties with the same name, use aliasing to rename one or both of the properties so they're disambiguated in the projected result.

### Examples

The `AS` keyword used for aliasing is optional, as shown in the following example when projecting the second value as `NameInfo`:

```sql
    SELECT
           { "state": f.address.state, "city": f.address.city } AS AddressInfo,
           { "name": f.id } NameInfo
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The results are:

```json
    [{
      "AddressInfo": {
        "state": "WA",
        "city": "Seattle"
      },
      "NameInfo": {
        "name": "AndersenFamily"
      }
    }]
```

### Aliasing with reserved keywords or special characters

You can't use aliasing to project a value as a property name with a space, special character, or reserved word. If you wanted to change a value's projection to, for example, have a property name with a space, you could use a [JSON expression](#json-expressions).

Here's an example:

```sql
    SELECT
           {"JSON expression with a space": { "state": f.address.state, "city": f.address.city }},
           {"JSON expression with a special character!": { "name": f.id }}
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

## Next steps

- [Getting started](sql-query-getting-started.md)
- [SELECT clause](sql-query-select.md)
- [WHERE clause](sql-query-where.md)
