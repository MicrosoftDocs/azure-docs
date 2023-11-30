---
title: Keywords
titleSuffix: Azure Cosmos DB for NoSQL
description: Use various keywords for common functionality in Azure Cosmos DB for NoSQL.
author: jcodella
ms.author: jacodel
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: reference
ms.date: 09/21/2023
ms.custom: query-reference
---

# Keywords in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

Azure Cosmos DB for NoSQL's query language includes a set of reserved keywords that are used in queries for extended functionality.

## BETWEEN

The ``BETWEEN`` keyword evaluates to a boolean indicating whether the target value is between two specified values, inclusive.

You can use the ``BETWEEN`` keyword with a ``WHERE`` clause to express queries that filters results against ranges of string or numerical values. For example, the following query returns all items in which the price is between ``17.25`` and ``25.50``, again inclusive.

```sql
SELECT VALUE
    p.price
FROM
    products p
WHERE
    p.price BETWEEN 17.25 AND 25.50
```

```json
[
  20
]
```

You can also use the ``BETWEEN`` keyword in the ``SELECT`` clause, as in the following example.

```sql
SELECT 
    (p.price BETWEEN 0 AND 10) AS booleanLessThanTen,
    p.price
FROM
    products p
```

```json
[
  {
    "booleanLessThanTen": false,
    "price": 20.0
  },
  {
    "booleanLessThanTen": true,
    "price": 7.5
  }
]
```

> [!NOTE]
> In the API for NoSQL, unlike ANSI SQL, you can express range queries against properties of mixed types. For example, ``price`` might be a number like ``5.0`` in some items and a string  like ``fifteenDollars`` in others. In these cases, as it is in JavaScript, the comparison between the two different types results in ``undefined``, so the item is skipped.

## DISTINCT

The ``DISTINCT`` keyword eliminates duplicates in the projected query results.

In this example, the query projects values for each product category. If two categories are equivalent, only a single occurrence returns in the results.

```sql
SELECT DISTINCT VALUE
    p.category
FROM
    products p
```

```json
[
  "Accessories",
  "Tools"
]
```

You can also project values even if the target field doesn't exist. In this case, the field doesn't exist in one of the items, so the query returns an empty object for that specific unique value.

```sql
SELECT DISTINCT
    p.category
FROM
    products p
```

The results are:

```json
[
  {},
  {
    "category": "Accessories"
  },
  {
    "category": "Tools"
  }
]
```

## LIKE

Returns a boolean value depending on whether a specific character string matches a specified pattern. A pattern can include regular characters and wildcard characters.

> [!TIP]
> You can write logically equivalent queries using either the ``LIKE`` keyword or the [``RegexMatch``](regexmatch.md) system function. You'll observe the same index utilization regardless of which option you choose. The choice of which option to use is largely based on syntax preference.

> [!NOTE]
> Because ``LIKE`` can utilize an index, you should [create a range index](../../index-policy.md) for properties you are comparing using ``LIKE``.

You can use the following wildcard characters with LIKE:

| | Description | Example |
| --- | --- | --- |
| **``%``** | Any string of zero or more characters. | ``WHERE c.description LIKE "%SO%PS%"`` |
| **``_``** *(underscore)* | Any single character. | ``WHERE c.description LIKE"%SO_PS%"`` |
| **``[ ]``** | Any single character within the specified range (``[a-f]``) or set (``[abcdef]``). | ``WHERE c.description LIKE "%SO[t-z]PS%"`` |
| **``[^]``** | Any single character not within the specified range   (``[^a-f]``) or set (``[^abcdef]``). | ``WHERE c.description LIKE "%SO[^abc]PS%"`` |

The ``%`` character matches any string of zero or more characters. For example, by placing a ``%`` at the beginning and end of the pattern, the following query returns all items where the specified field contains the phrase as a substring:

```sql
SELECT VALUE
    p.name
FROM
    products p
WHERE
    p.name LIKE "%driver%"
```

If you only used a ``%`` character at the end of the pattern, you'd only return items with a description that started with `fruit`:

```sql
SELECT VALUE
    p.name
FROM
    products p
WHERE
    p.name LIKE "%glove"
```

Similarly, the wildcard at the start of the pattern indicates that you want to match values with the specified value as a prefix:

```sql
SELECT VALUE
    p.name
FROM
    products p
WHERE
    p.name LIKE "Road%"
```

The ``NOT`` keyword inverses the result of the ``LIKE`` keyword's expression evaluation. This example returns all items that do **not** match the ``LIKE`` expression.

```sql
SELECT VALUE
    p.name
FROM
    products p
WHERE
    p.name NOT LIKE "%winter%"
```

You can search for patterns that include one or more wildcard characters using the ``ESCAPE`` clause. For example, if you wanted to search for descriptions that contained the string ``20%``, you wouldn't want to interpret the ``%`` as a wildcard character. This example interprets the ``^`` as the escape character so you can escape a specific instance of ``%``.

```sql
SELECT VALUE
    p.name
FROM
    products p
WHERE
    p.description LIKE "%20^%%" ESCAPE "^"
```

You can enclose wildcard characters in brackets to treat them as literal characters. When you enclose a wildcard character in brackets, you remove any special attributes. This table includes examples of literal characters.

| | Parsed value |
| --- | --- |
| **``LIKE "20-30[%]"``** | ``20-30%`` |
| **``LIKE "[_]n"``** | ``_n`` |
| **``LIKE "[ [ ]"``** | ``[`` |
| **``LIKE "]"``** | ``]`` |

## IN

Use the ``IN`` keyword to check whether a specified value matches any value in a list. For example, the following query returns all items where the category matches at least one of the values in a list.

```sql
SELECT
    *
FROM
    products p
WHERE
    p.category IN ("Accessories", "Clothing")
```

> [!TIP]
> If you include your partition key in the `IN` filter, your query will automatically filter to only the relevant partitions.

## TOP

The ``TOP`` keyword returns the first ``N`` number of query results in an undefined order. As a best practice, use ``TOP`` with the ``ORDER BY`` clause to limit results to the first ``N`` number of ordered values. Combining these two clauses is the only way to predictably indicate which rows ``TOP`` affects.

You can use ``TOP`` with a constant value, as in the following example, or with a variable value using parameterized queries.

```sql
SELECT TOP 10
    *
FROM
    products p
ORDER BY
    p.price ASC
```

## Related content

- [``WHERE`` clause](where.md)
- [Subqueries](subquery.md)
- [Constants](constants.md)
