---
title: Work with arrays and objects
titleSuffix: Azure Cosmos DB for NoSQL
description: Create arrays and objects and perform actions on them using the array syntax in Azure Cosmos DB for NoSQL.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 07/31/2023
ms.custom: query-reference
---

# Work with arrays and objects in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Here's an item that's used in examples throughout this article.

```json
{
  "name": "Sondon Fins",
  "categories": [
     { "name": "swim" },
     { "name": "gear"}
  ],
  "metadata": {
    "sku": "73310",
    "manufacturer": "AdventureWorks"
  },
  "priceInUSD": 132.35,
  "priceInCAD": 174.50
}
```

## Arrays

You can construct arrays using static values, as shown in the following example.

```sql
SELECT
  [p.priceInUSD, p.priceInCAD] AS priceData
FROM products p
```

```json
[
  {
    "priceData": [
      132.35,
      174.5
    ]
  }
]
```

You can also use the [``ARRAY`` expression](subquery.md#array-expression) to construct an array from a [subquery's](subquery.md) results. This query gets all the distinct categories.

```sql
SELECT
    p.id,
    ARRAY (SELECT DISTINCT VALUE c.name FROM c IN p.categories) AS categoryNames
FROM
    products p
```

```json
[
  {
    "id": "a0151c77-ffc3-4fa6-a495-7b53d936faa6",
    "categoryNames": [
      "swim",
      "gear"
    ]
  }
]
```

## Iteration

The API for NoSQL provides support for iterating over JSON arrays, with the [``IN`` keyword](keywords.md#in) in the ``FROM`` source. 

As an example, the next query performs iteration over ``tags`` for each item in the container. The output splits the array value and flattens the results into a single array.

```sql
SELECT
    *
FROM 
  products IN products.categories
```

```json
[
  {
    "name": "swim"
  },
  {
    "name": "gear"
  }
]
```

You can filter further on each individual entry of the array, as shown in the following example:

```sql
SELECT VALUE
    p.name
FROM
    p IN p.categories
WHERE
    p.name LIKE "ge%"
```

The results are:

```json
[
  "gear"
]
```

You can also aggregate over the result of an array iteration. For example, the following query counts the number of tags:

```sql
SELECT VALUE
    COUNT(1)
FROM
    p IN p.categories
```

The results are:

```json
[
  2
]
```

> [!NOTE]
> When using the ``IN`` keyword for iteration, you cannot filter or project any properties outside of the array. Instead, you should use [self-joins](join.md).

## Next steps

- [Self-joins](join.md)
- [Keywords](keywords.md)
- [Subqueries](subquery.md)
