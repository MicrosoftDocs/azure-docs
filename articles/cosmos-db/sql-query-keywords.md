---
title: SQL keywords for Azure Cosmos DB
description: Learn about SQL keywords for Azure Cosmos DB.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/20/2019
ms.author: mjbrown

---
# Keywords in Azure Cosmos DB
This article details keywords which may be used in Azure Cosmos DB SQL queries.

## BETWEEN

As in ANSI SQL, you can use the BETWEEN keyword to express queries against ranges of string or numerical values. For example, the following query returns all items in which the first child's grade is 1-5, inclusive.

```sql
    SELECT *
    FROM Families.children[0] c
    WHERE c.grade BETWEEN 1 AND 5
```

Unlike in ANSI SQL, you can also use the BETWEEN clause in the FROM clause, as in the following example.

```sql
    SELECT (c.grade BETWEEN 0 AND 10)
    FROM Families.children[0] c
```

In SQL API, unlike ANSI SQL, you can express range queries against properties of mixed types. For example, `grade` might be a number like `5` in some items and a string  like `grade4` in others. In these cases, as in JavaScript, the comparison between the two different types results in `Undefined`, so the item is skipped.

> [!TIP]
> For faster query execution times, create an indexing policy that uses a range index type against any numeric properties or paths that the BETWEEN clause filters.

## DISTINCT

The DISTINCT keyword eliminates duplicates in the query's projection.

```sql
SELECT DISTINCT VALUE f.lastName
FROM Families f
```

In this example, the query projects values for each last name.

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

DISTINCT can also be used in the projection within a subquery:

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
## <a name="in"></a> IN

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

The SQL API provides support for [iterating over JSON arrays](sql-query-object-array.md#Iteration), with a new construct added via the in keyword in the FROM source. 

## TOP

The TOP keyword returns the first `N` number of query results in an undefined order. As a best practice, use TOP with the ORDER BY clause to limit results to the first `N` number of ordered values. Combining these two clauses is the only way to predictably indicate which rows TOP affects.

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

- [Getting started](sql-query-getting-started.md)
- [Joins](sql-query-join.md)
- [Subqueries](sql-query-subquery.md)