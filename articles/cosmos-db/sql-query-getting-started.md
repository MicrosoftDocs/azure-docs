---
title: Getting started with SQL queries in Azure Cosmos DB
description: Introduction to SQL queries
author: timsander1
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 06/21/2019
ms.author: tisande

---
# Getting started with SQL queries

Azure Cosmos DB SQL API accounts support querying items using Structured Query Language (SQL) as a JSON query language. The design goals of the Azure Cosmos DB query language are to:

* Support SQL, one of the most familiar and popular query languages, instead of inventing a new query language. SQL provides a formal programming model for rich queries over JSON items.  

* Use JavaScript's programming model as the foundation for the query language. JavaScript's type system, expression evaluation, and function invocation are the roots of the SQL API. These roots provide a natural programming model for features like relational projections, hierarchical navigation across JSON items, self-joins, spatial queries, and invocation of user-defined functions (UDFs) written entirely in JavaScript.

## Upload sample data

In your SQL API Cosmos DB account, create a container called `Families`. Create two simple JSON items in the container. You can run most of the sample queries in the Azure Cosmos DB query docs using this data set.

### Create JSON items

The following code creates two simple JSON items about families. The simple JSON items for the Andersen and Wakefield families include parents, children and their pets, address, and registration information. The first item has strings, numbers, Booleans, arrays, and nested properties.


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

The second item uses `givenName` and `familyName` instead of `firstName` and `lastName`.

```json
{
  "id": "WakefieldFamily",
  "parents": [
      { "familyName": "Wakefield", "givenName": "Robin" },
      { "familyName": "Miller", "givenName": "Ben" }
  ],
  "children": [
      {
        "familyName": "Merriam",
        "givenName": "Jesse",
        "gender": "female",
        "grade": 1,
        "pets": [
            { "givenName": "Goofy" },
            { "givenName": "Shadow" }
        ]
      },
      { 
        "familyName": "Miller",
         "givenName": "Lisa",
         "gender": "female",
         "grade": 8 }
  ],
  "address": { "state": "NY", "county": "Manhattan", "city": "NY" },
  "creationDate": 1431620462,
  "isRegistered": false
}
```

### Query the JSON items

Try a few queries against the JSON data to understand some of the key aspects of Azure Cosmos DB's SQL query language.

The following query returns the items where the `id` field matches `AndersenFamily`. Since it's a `SELECT *` query, the output of the query is the complete JSON item. For more information about SELECT syntax, see [SELECT statement](sql-query-select.md). 

```sql
    SELECT *
    FROM Families f
    WHERE f.id = "AndersenFamily"
```

The query results are: 

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

The following query reformats the JSON output into a different shape. The query projects a new JSON `Family` object with two selected fields, `Name` and `City`, when the address city is the same as the state. "NY, NY" matches this case.

```sql
    SELECT {"Name":f.id, "City":f.address.city} AS Family
    FROM Families f
    WHERE f.address.city = f.address.state
```

The query results are:

```json
    [{
        "Family": {
            "Name": "WakefieldFamily",
            "City": "NY"
        }
    }]
```

The following query returns all the given names of children in the family whose `id` matches `WakefieldFamily`, ordered by city.

```sql
    SELECT c.givenName
    FROM Families f
    JOIN c IN f.children
    WHERE f.id = 'WakefieldFamily'
    ORDER BY f.address.city ASC
```

The results are:

```json
    [
      { "givenName": "Jesse" },
      { "givenName": "Lisa"}
    ]
```

## Remarks

The preceding examples show several aspects of the Cosmos DB query language:  

* Since SQL API works on JSON values, it deals with tree-shaped entities instead of rows and columns. You can refer to the tree nodes at any arbitrary depth, like `Node1.Node2.Node3…..Nodem`, similar to the two-part reference of `<table>.<column>` in ANSI SQL.

* Because the query language works with schemaless data, the type system must be bound dynamically. The same expression could yield different types on different items. The result of a query is a valid JSON value, but isn't guaranteed to be of a fixed schema.  

* Azure Cosmos DB supports strict JSON items only. The type system and expressions are restricted to deal only with JSON types. For more information, see the [JSON specification](https://www.json.org/).  

* A Cosmos DB container is a schema-free collection of JSON items. The relations within and across container items are implicitly captured by containment, not by primary key and foreign key relations. This feature is important for the intra-item joins discussed later in this article.

## Next steps

- [Introduction to Azure Cosmos DB](introduction.md)
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmosdb-dotnet)
- [SELECT clause](sql-query-select.md)
