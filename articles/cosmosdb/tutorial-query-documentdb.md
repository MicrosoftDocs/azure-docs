---
title: How to query with SQL in Azure Cosmos DB? | Microsoft Docs
description: Learn to query with DocumentDB data with SQL in Azure Cosmos DB
services: cosmosdb
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''
tags: ''

ms.assetid: 
ms.service: cosmosdb
ms.custom: tutorial-develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 05/01/2017
ms.author: mimig

---

# Azure Cosmos DB: How to query using SQL?

The Azure Cosmos DB [DocumentDB API](../documentdb/documentdb-introduction.md) supports supports querying documents using [SQL (Structured Query Language)](../documentdb/documentd-sql-syntax.md). This article provides a sample document and two sample queries and results using SQL.

You can run queries on your data using the Data Explorer in the Azure portal, [Query Explorer](../documentdb/documentdb-query-collections-query-explorer) in the Azure portal, via the [REST API and SDKs](../documentdb/documentdb-query-collections-query-explorer.md), and even the [Query playground](https://www.documentdb.com/sql/demo), which runs queries on an existing set of sample data.

The SQL queries in this article use the following sample document.

**Sample family document**

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
        "gender": "female", "grade": 1,
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

## Example query 1

Given the sample family document above, following SQL query returns the documents where the id field matches `WakefieldFamily`. Since it's a `SELECT *` statement, the output of the query is the complete JSON document:

**Query**

    SELECT * 
    FROM Families f 
    WHERE f.id = "WakefieldFamily"

**Results**

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
        "address": { "state": "WA", "county": "King", "city": "seattle" },
        "creationDate": 1431620472,
        "isRegistered": true
    }]

## Example query 2

The next query returns all the given names of children in the family whose id matches `WakefieldFamily` ordered by their grade.

**Query**

    SELECT c.givenName 
    FROM Families f 
    JOIN c IN f.children 
    WHERE f.id = 'WakefieldFamily'
    ORDER BY f.children.grade ASC

**Results**

    [
      { "givenName": "Jesse" }, 
      { "givenName": "Lisa"}
    ]


## Next steps

Additional information about SQL queries in Azure Cosmos DB is available in the [SQL query](../documentdb/documentdb-sql-query.md) article, the [SQL syntax](https://msdn.microsoft.com/en-us/library/azure/dn782250.aspx) reference, and the [SQL Query Cheat Sheet](../documentdb/documentdb-sql-query-cheat-sheet.md).