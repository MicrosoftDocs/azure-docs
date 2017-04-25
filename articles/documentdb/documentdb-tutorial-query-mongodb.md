---
title: How to query in Azure Cosmos DB? | Microsoft Docs
description: Learn to query with the different dat models in Azure Cosmos DB
services: documentdb
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''
tags: ''

ms.assetid: 
ms.service: documentdb
ms.custom: tutorial-develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 04/19/2017
ms.author: mimig

---

# Azure Cosmos DB: How to query with MongoDB API?

Each of the Azure Cosmos DB data-models have their own query protocol, so creating queries for each model is slightly different. This article provides links to the query protocol for each model, as well as sample queries for the MongoDB API.

**How to query each data model using Azure Cosmos DB?**

|   |DocumentDB API|Tables API|Graph API|MongoDB API|
|---|-----------------|--------------|-------------|---------------|
|Query protocol|[SQL](documentdb-sql-query.md)|[OData](https://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/querying-tables-and-entities)<br>[LINQ](ttps://docs.microsoft.com/en-us/rest/api/storageservices/fileservices/writing-linq-queries-against-the-table-service)|[Gremlin](http://tinkerpop.apache.org/gremlin.html)|[MongoDB](https://docs.mongodb.com/manual/tutorial/query-documents/)|
|Example queries|[Document query](documentdb-tutorial-query-documentdb.md)|Table query|Graph query|[MongoDB query](#examplequery1)|

The queries in this article use the following sample document.

## Sample Family document

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
## <a id="examplequery1"></a> Example query 1 

Given the sample family document above, the following query returns the documents where the id field matches `WakefieldFamily`.

**Query**
    
    db.families.find({ id: “WakefieldFamily”})

**Results**

    {
    "_id": "ObjectId(\"58f65e1198f3a12c7090e68c\")",
    "id": "WakefieldFamily",
    "parents": [
      {
        "familyName": "Wakefield",
        "givenName": "Robin"
      },
      {
        "familyName": "Miller",
        "givenName": "Ben"
      }
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
        "grade": 8
      }
    ],
    "address": {
      "state": "NY",
      "county": "Manhattan",
      "city": "NY"
    },
    "creationDate": 1431620462,
    "isRegistered": false
    }

## Example query 2 

The next query returns all the children in the family. 

**Query**
    
    db.familes.find( { id: “WakefieldFamily” }, { children: true } )

**Results**

    {
    "_id": "ObjectId(\"58f65e1198f3a12c7090e68c\")",
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
        "grade": 8
      }
    ]
    }

## Next steps

For more information about the MongoDB APIs, see [What is Azure Cosmos DB: API for MongoDB?](documentdb-protocol-mongodb.md).