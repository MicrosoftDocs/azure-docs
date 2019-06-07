---
title: SQL keywords for Azure Cosmos DB
description: Learn about SQL keywords for Azure Cosmos DB.
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: mjbrown

---
# <a id="Keywords"></a>Keywords
This article details keywords which may be used in Azure Cosmos DB SQL queries.

##  <a name="bk_between"></a> BETWEEN keyword

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

##  <a name="bk_distinct"></a> DISTINCT keyword

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
##  <a name="bk_in"></a> IN keyword

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
##  <a name="bk_Iteration"></a> Iteration (with and without using IN)

The SQL API provides support for iterating over JSON arrays, with a new construct added via the IN keyword in the FROM source. In the following example:

```sql
    SELECT *
    FROM Families.children
```

The results are:

```json
    [
      [
        {
          "firstName": "Henriette Thaulow",
          "gender": "female",
          "grade": 5,
          "pets": [{ "givenName": "Fluffy"}]
        }
      ], 
      [
        {
            "familyName": "Merriam",
            "givenName": "Jesse",
            "gender": "female",
            "grade": 1
        }, 
        {
            "familyName": "Miller",
            "givenName": "Lisa",
            "gender": "female",
            "grade": 8
        }
      ]
    ]
```

The next query performs iteration over `children` in the `Families` container. The output array is different from the preceding query. This example splits `children`, and flattens the results into a single array:  

```sql
    SELECT *
    FROM c IN Families.children
```

The results are:

```json
    [
      {
          "firstName": "Henriette Thaulow",
          "gender": "female",
          "grade": 5,
          "pets": [{ "givenName": "Fluffy" }]
      },
      {
          "familyName": "Merriam",
          "givenName": "Jesse",
          "gender": "female",
          "grade": 1
      },
      {
          "familyName": "Miller",
          "givenName": "Lisa",
          "gender": "female",
          "grade": 8
      }
    ]
```

You can filter further on each individual entry of the array, as shown in the following example:

```sql
    SELECT c.givenName
    FROM c IN Families.children
    WHERE c.grade = 8
```

The results are:

```json
    [{
      "givenName": "Lisa"
    }]
```

You can also aggregate over the result of an array iteration. For example, the following query counts the number of children among all families:

```sql
    SELECT COUNT(child)
    FROM child IN Families.children
```

The results are:

```json
    [
      {
        "$1": 3
      }
    ]
```

##  <a name="bk_TopKeyword"></a> Top Keyword

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

## <a id="References"></a>References

- [Azure Cosmos DB SQL specification](https://go.microsoft.com/fwlink/p/?LinkID=510612)
- [ANSI SQL 2011](https://www.iso.org/iso/iso_catalogue/catalogue_tc/catalogue_detail.htm?csnumber=53681)
- [JSON](https://json.org/)
- [Javascript Specification](https://www.ecma-international.org/publications/standards/Ecma-262.htm) 
- [LINQ](/previous-versions/dotnet/articles/bb308959(v=msdn.10)) 
- Graefe, Goetz. [Query evaluation techniques for large databases](https://dl.acm.org/citation.cfm?id=152611). *ACM Computing Surveys* 25, no. 2 (1993).
- Graefe, G. "The Cascades framework for query optimization." *IEEE Data Eng. Bull.* 18, no. 3 (1995).
- Lu, Ooi, Tan. "Query Processing in Parallel Relational Database Systems." *IEEE Computer Society Press* (1994).
- Olston, Christopher, Benjamin Reed, Utkarsh Srivastava, Ravi Kumar, and Andrew Tomkins. "Pig Latin: A Not-So-Foreign Language for Data Processing." *SIGMOD* (2008).

## Next steps

- [Introduction to Azure Cosmos DB][introduction]
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Azure Cosmos DB consistency levels][consistency-levels]

[1]: ./media/how-to-sql-query/sql-query1.png
[introduction]: introduction.md
[consistency-levels]: consistency-levels.md