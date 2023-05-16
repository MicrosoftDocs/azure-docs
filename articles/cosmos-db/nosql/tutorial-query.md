---
title: |
  Tutorial: Query data
titleSuffix: Azure Cosmos DB for NoSQL 
description: In this tutorial, learn how to query data in Azure Cosmos DB for NoSQL with the built-in query syntax using the Data Explorer.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: tutorial-develop, mvc, ignite-2022
ms.topic: tutorial
ms.date: 03/16/2023
---

# Tutorial: Query data in Azure Cosmos DB for NoSQL

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[Azure Cosmos DB for NoSQL](../introduction.md) supports querying documents using the built-in query syntax. This article provides a sample document and two sample queries and results.

This article covers the following tasks:

> [!div class="checklist"]
>
> - Query NoSQL data with the built-in query syntax
>

## Prerequisites

This tutorial assumes you have an Azure Cosmos DB account, database, and container.

Don't have any of those resources? Complete this quickstart: [Create an Azure Cosmos DB account, database, container, and items from the Azure portal](quickstart-portal.md).

You can run the queries using the [Azure Cosmos DB Explorer](../data-explorer.md) in the Azure portal. You can also run queries by using the [REST API](/rest/api/cosmos-db/) or [various SDKs](sdk-dotnet-v3.md).

For more information about queries, see [setting started with queries](query/getting-started.md).

## Sample document

The queries in this article use the following sample document.

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
        "grade": 8 
    }
  ],
  "address": { "state": "NY", "county": "Manhattan", "city": "NY" },
  "creationDate": 1431620462,
  "isRegistered": false
}
```

## Select all fields and apply a filter

Given the sample family document, the following query returns the documents where the ID field matches `WakefieldFamily`. Since it's a `SELECT *` statement, the output of the query is the complete JSON document:

Query:

```sql
SELECT * 
FROM Families f 
WHERE f.id = "WakefieldFamily"
```

Results:

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
        "grade": 8 
    }
  ],
  "address": { "state": "NY", "county": "Manhattan", "city": "NY" },
  "creationDate": 1431620462,
  "isRegistered": false
}
```

## Select a cross-product of a child collection field

The next query returns all the given names of children in the family whose ID matches `WakefieldFamily`.

Query:

```sql
SELECT c.givenName 
FROM Families f 
JOIN c IN f.children 
WHERE f.id = 'WakefieldFamily'
```

Results:

```json
[
  {
    "givenName": "Jesse"
  },
  {
    "givenName": "Lisa"
  }
]
```

## Next steps

In this tutorial, you've done the following tasks:

> [!div class="checklist"]
>
> - Learned how to query using the built-in query syntax
>

You can now proceed to the next tutorial to learn how to distribute your data globally.

> [!div class="nextstepaction"]
> [Distribute your data globally](tutorial-global-distribution.md)
