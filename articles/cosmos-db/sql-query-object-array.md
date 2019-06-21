---
title: Working with arrays and objects in Azure Cosmos DB
description: Learn about array and object creation SQL syntax for Azure Cosmos DB.
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/21/2019
ms.author: tisande

---
# Working with arrays and objects in Azure Cosmos DB

A key feature of the Azure Cosmos DB SQL API is array and object creation.

## Arrays

You can construct arrays, as shown in the following example:

```sql
    SELECT [f.address.city, f.address.state] AS CityState
    FROM Families f
```

The results are:

```json
    [
      {
        "CityState": [
          "Seattle",
          "WA"
        ]
      },
      {
        "CityState": [
          "NY", 
          "NY"
        ]
      }
    ]
```

You can also use the [ARRAY expression](sql-query-subquery.md#array-expression) to construct an array from [subquery's](sql-query-subquery.md) results. This query gets all the distinct given names of children in an array.

```sql
SELECT f.id, ARRAY(SELECT DISTINCT VALUE c.givenName FROM c IN f.children) as ChildNames
FROM f
```

## <a id="Iteration"></a>Iteration

The SQL API provides support for iterating over JSON arrays, with a new construct added via the [IN keyword](sql-query-keywords.md#in) in the FROM source. In the following example:

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

## Next steps

- [Getting started](sql-query-getting-started.md)
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [Joins](sql-query-join.md)