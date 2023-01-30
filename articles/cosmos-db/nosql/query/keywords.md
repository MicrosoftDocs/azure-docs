---
title: SQL keywords for Azure Cosmos DB
description: Learn about SQL keywords for Azure Cosmos DB.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 10/05/2021
ms.author: sidandrews
ms.reviewer: jucocchi
---
# Keywords in Azure Cosmos DB
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

This article details keywords which may be used in Azure Cosmos DB SQL queries.

## BETWEEN

You can use the `BETWEEN` keyword to express queries against ranges of string or numerical values. For example, the following query returns all items in which the first child's grade is 1-5, inclusive.

```sql
    SELECT *
    FROM Families.children[0] c
    WHERE c.grade BETWEEN 1 AND 5
```

You can also use the `BETWEEN` keyword in the `SELECT` clause, as in the following example.

```sql
    SELECT (c.grade BETWEEN 0 AND 10)
    FROM Families.children[0] c
```

In API for NoSQL, unlike ANSI SQL, you can express range queries against properties of mixed types. For example, `grade` might be a number like `5` in some items and a string  like `grade4` in others. In these cases, as in JavaScript, the comparison between the two different types results in `Undefined`, so the item is skipped.

## DISTINCT

The `DISTINCT` keyword eliminates duplicates in the query's projection.

In this example, the query projects values for each last name:

```sql
SELECT DISTINCT VALUE f.lastName
FROM Families f
```

The results are:

```json
[
    "Andersen"
]
```

You can also project unique objects. In this case, the lastName field does not exist in one of the two documents, so the query returns an empty object.

```sql
SELECT DISTINCT f.lastName
FROM Families f
```

The results are:

```json
[
    {
        "lastName": "Andersen"
    },
    {}
]
```

`DISTINCT` can also be used in the projection within a subquery:

```sql
SELECT f.id, ARRAY(SELECT DISTINCT VALUE c.givenName FROM c IN f.children) as ChildNames
FROM f
```

This query projects an array which contains each child's givenName with duplicates removed. This array is aliased as ChildNames and projected in the outer query.

The results are:

```json
[
    {
        "id": "AndersenFamily",
        "ChildNames": []
    },
    {
        "id": "WakefieldFamily",
        "ChildNames": [
            "Jesse",
            "Lisa"
        ]
    }
]
```

Queries with an aggregate system function and a subquery with `DISTINCT` are only supported in specific SDK versions. This is because they require coordination of the results returned from every continuation to create an exact result set. For example, queries with the following shape are only supported in the below specific SDK versions:

```sql
SELECT COUNT(1) FROM (SELECT DISTINCT f.lastName FROM f)
```

**Supported SDK versions:**

|**SDK**|**Supported versions**|
|-------|----------------------|
|.NET SDK|3.18.0 or later|
|Java SDK|4.19.0 or later|
|Node.js SDK|Unsupported|
|Python SDK|Unsupported|

There are some additional restrictions on nested queries with `DISTINCT` regardless of SDK version. In these cases, there may be incorrect and inconsistent results because the query would require extra coordination. The below queries are unsupported:

|**Restriction**|**Example**|
|-------|----------------------|
|Nested Subquery|SELECT VALUE f FROM (SELECT DISTINCT c.year FROM c) f|
|WHERE clause in the outer query|SELECT COUNT(1) FROM (SELECT DISTINCT VALUE c.lastName FROM c) AS lastName WHERE lastName = "Smith"|
|ORDER BY clause in the outer query|SELECT VALUE COUNT(1) FROM (SELECT DISTINCT VALUE c.lastName FROM c) AS lastName ORDER BY lastName|
|GROUP BY clause in the outer query|SELECT COUNT(1) as annualCount, d.year FROM (SELECT DISTINCT c.year, c.id FROM c) AS d GROUP BY d.year|
|Nested subquery with aggregate system function|SELECT COUNT(1) FROM (SELECT y FROM (SELECT VALUE StringToNumber(SUBSTRING(d.date, 0, 4 FROM (SELECT DISTINCT c.date FROM c) d) AS y WHERE y > 2012)|
|Multiple aggregations|SELECT COUNT(1) as AnnualCount, SUM(d.sales) as TotalSales FROM (SELECT DISTINCT c.year, c.sales, c.id FROM c) AS d|
|COUNT() must have 1 as a parameter|SELECT COUNT(lastName) FROM (SELECT DISTINCT VALUE c.lastName FROM c) AS lastName|

## LIKE

Returns a Boolean value depending on whether a specific character string matches a specified pattern. A pattern can include regular characters and wildcard characters. You can write logically equivalent queries using either the `LIKE` keyword or the [RegexMatch](regexmatch.md) system function. You’ll observe the same index utilization regardless of which one you choose. Therefore, you should use `LIKE` if you prefer its syntax more than regular expressions.

> [!NOTE]
> Because `LIKE` can utilize an index, you should [create a range index](../../index-policy.md) for properties you are comparing using `LIKE`.

You can use the following wildcard characters with LIKE:

| Wildcard character | Description                                                  | Example                                     |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------- |
| %                    | Any   string of zero or more characters                      | WHERE   c.description LIKE   “%SO%PS%”      |
| _   (underscore)     | Any   single character                                       | WHERE   c.description LIKE   “%SO_PS%”      |
| [ ]                  | Any single character within the specified range ([a-f]) or   set ([abcdef]). | WHERE   c.description LIKE   “%SO[t-z]PS%”  |
| [^]                  | Any single character not within the specified range   ([^a-f]) or set ([^abcdef]). | WHERE   c.description LIKE   “%SO[^abc]PS%” |


### Using LIKE with the % wildcard character

The `%` character matches any string of zero or more characters. For example, by placing a `%` at the beginning and end of the pattern, the following query returns all items with a description that contains `fruit`:

```sql
SELECT *
FROM c
WHERE c.description LIKE "%fruit%"
```

If you only used a `%` character at the end of the pattern, you’d only return items with a description that started with `fruit`:

```sql
SELECT *
FROM c
WHERE c.description LIKE "fruit%"
```


### Using NOT LIKE

The below example returns all items with a description that does not contain `fruit`:

```sql
SELECT *
FROM c
WHERE c.description NOT LIKE "%fruit%"
```

### Using the escape clause

You can search for patterns that include one or more wildcard characters using the ESCAPE clause. For example, if you wanted to search for descriptions that contained the string `20-30%`, you wouldn’t want to interpret the `%` as a wildcard character.

```sql
SELECT *
FROM c
WHERE c.description LIKE '%20-30!%%' ESCAPE '!'
```

### Using wildcard characters as literals

You can enclose wildcard characters in brackets to treat them as literal characters. When you enclose a wildcard character in brackets, you remove any special attributes. Here are some examples:

| Pattern           | Meaning |
| ----------------- | ------- |
| LIKE   “20-30[%]” | 20-30%  |
| LIKE   “[_]n”     | _n      |
| LIKE   “[ [ ]”    | [       |
| LIKE   “]”        | ]       |

## IN

Use the IN keyword to check whether a specified value matches any value in a list. For example, the following query returns all family items where the `id` is `WakefieldFamily` or `AndersenFamily`.

```sql
    SELECT *
    FROM Families
    WHERE Families.id IN ('AndersenFamily', 'WakefieldFamily')
```

The following example returns all items where the state is any of the specified values:

```sql
    SELECT *
    FROM Families
    WHERE Families.address.state IN ("NY", "WA", "CA", "PA", "OH", "OR", "MI", "WI", "MN", "FL")
```

The API for NoSQL provides support for [iterating over JSON arrays](object-array.md#Iteration), with a new construct added via the in keyword in the FROM source.

If you include your partition key in the `IN` filter, your query will automatically filter to only the relevant partitions.

## TOP

The TOP keyword returns the first `N` number of query results in an undefined order. As a best practice, use TOP with the `ORDER BY` clause to limit results to the first `N` number of ordered values. Combining these two clauses is the only way to predictably indicate which rows TOP affects.

You can use TOP with a constant value, as in the following example, or with a variable value using parameterized queries.

```sql
    SELECT TOP 1 *
    FROM Families f
```

The results are:

```json
    [{
        "id": "AndersenFamily",
        "lastName": "Andersen",
        "parents": [
           { "firstName": "Thomas" },
           { "firstName": "Mary Kay"}
        ],
        "children": [
           {
               "firstName": "Henriette Thaulow", "gender": "female", "grade": 5,
               "pets": [{ "givenName": "Fluffy" }]
           }
        ],
        "address": { "state": "WA", "county": "King", "city": "Seattle" },
        "creationDate": 1431620472,
        "isRegistered": true
    }]
```

## Next steps

- [Getting started](getting-started.md)
- [Joins](join.md)
- [Subqueries](subquery.md)
