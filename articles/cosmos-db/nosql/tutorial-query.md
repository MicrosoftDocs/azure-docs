---
title: 'Tutorial: How to query with SQL in Azure Cosmos DB?'
description: 'Tutorial: Learn how to query with SQL queries in Azure Cosmos DB using the query playground'
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: tutorial-develop, mvc, ignite-2022
ms.topic: tutorial
ms.date: 08/26/2021
---

# Tutorial: Query Azure Cosmos DB by using the API for NoSQL
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The Azure Cosmos DB [API for NoSQL](../introduction.md) supports querying documents using SQL. This article provides a sample document and two sample SQL queries and results.

This article covers the following tasks: 

> [!div class="checklist"]
> * Querying data with SQL

## Sample document

The SQL queries in this article use the following sample document.

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

## Where can I run SQL queries?

You can run queries using the Data Explorer in the Azure portal and via the [REST API and SDKs](sdk-dotnet-v2.md).

For more information about SQL queries, see:
* [SQL query and SQL syntax](query/getting-started.md)

## Prerequisites

This tutorial assumes you have an Azure Cosmos DB account and collection. Don't have any of those resources? Complete the [5-minute quickstart](quickstart-portal.md).

## Example query 1

Given the sample family document above, following SQL query returns the documents where the ID field matches `WakefieldFamily`. Since it's a `SELECT *` statement, the output of the query is the complete JSON document:

**Query**

```sql
    SELECT * 
    FROM Families f 
    WHERE f.id = "WakefieldFamily"
```

**Results**

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

## Example query 2

The next query returns all the given names of children in the family whose ID matches `WakefieldFamily`.

**Query**

```sql
    SELECT c.givenName 
    FROM Families f 
    JOIN c IN f.children 
    WHERE f.id = 'WakefieldFamily'
```

**Results**

```
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
> * Learned how to query using SQL  

You can now proceed to the next tutorial to learn how to distribute your data globally.

> [!div class="nextstepaction"]
> [Distribute your data globally](tutorial-global-distribution.md)

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
