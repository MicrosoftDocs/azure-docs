---
title: Working with arrays and objects in Azure Cosmos DB
description: Learn the SQL syntax to create arrays and objects in Azure Cosmos DB. This article also provides some examples to perform operations on array objects 
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 02/02/2021
ms.author: sidandrews
ms.reviewer: jucocchi
---
# Working with arrays and objects in Azure Cosmos DB
[!INCLUDE[NoSQL](../../includes/appliesto-nosql.md)]

A key feature of the Azure Cosmos DB for NoSQL is array and object creation. This document uses examples that can be recreated using the [Family dataset](getting-started.md#upload-sample-data).

Here's an example item in this dataset:

```json
{
  "id": "AndersenFamily",
  "lastName": "Andersen",
  "parents": [
     { "firstName": "Thomas" },
     { "firstName": "Mary Kay"}
  ],
  "children": [
     {
         "firstName": "Henriette Thaulow",
         "gender": "female",
         "grade": 5,
         "pets": [{ "givenName": "Fluffy" }]
     }
  ],
  "address": { "state": "WA", "county": "King", "city": "Seattle" },
  "creationDate": 1431620472,
  "isRegistered": true
}
```

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

You can also use the [ARRAY expression](subquery.md#array-expression) to construct an array from [subquery's](subquery.md) results. This query gets all the distinct given names of children in an array.

```sql
SELECT f.id, ARRAY(SELECT DISTINCT VALUE c.givenName FROM c IN f.children) as ChildNames
FROM f
```

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

## <a id="Iteration"></a>Iteration

The API for NoSQL provides support for iterating over JSON arrays, with the [IN keyword](keywords.md#in) in the FROM source. In the following example:

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
SELECT COUNT(1) AS Count
FROM child IN Families.children
```

The results are:

```json
[
  {
    "Count": 3
  }
]
```

> [!NOTE]
> When using the IN keyword for iteration, you cannot filter or project any properties outside of the array. Instead, you should use [JOINs](join.md).

For additional examples, read our [blog post on working with arrays in Azure Cosmos DB](https://devblogs.microsoft.com/cosmosdb/understanding-how-to-query-arrays-in-azure-cosmos-db/).

## Next steps

- [Getting started](getting-started.md)
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmos-dotnet-v3)
- [Joins](join.md)
