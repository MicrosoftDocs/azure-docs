---
title: Query data with Azure Cosmos DB for MongoDB
description: Learn how to query data from Azure Cosmos DB for MongoDB by using MongoDB shell commands.
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.custom: ignite-2022
ms.topic: tutorial
ms.date: 03/14/2023
ms.reviewer: mjbrown
---

# Query data by using Azure Cosmos DB for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

The [Azure Cosmos DB for MongoDB](introduction.md) supports [MongoDB queries](https://docs.mongodb.com/manual/tutorial/query-documents/).

This article covers the following tasks:

> [!div class="checklist"]
> * Querying data stored in your Azure Cosmos DB database using MongoDB shell

You can get started by using the examples in this article.

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
         "grade": 8 }
  ],
  "address": { "state": "NY", "county": "Manhattan", "city": "NY" },
  "creationDate": 1431620462,
  "isRegistered": false
}
```

## <a id="examplequery1"></a> Example query 1

Given the sample family document, the following query returns the documents where the `id` field matches `WakefieldFamily`.

Query:

```bash
db.families.find({ id: "WakefieldFamily"})
```

Results:

```json
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
```

## <a id="examplequery2"></a>Example query 2

The next query returns all the children in the family.

Query:

```bash
db.families.find( { id: "WakefieldFamily" }, { children: true } )
```

Results:

```json
{
    "_id": "ObjectId("58f65e1198f3a12c7090e68c")",
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
```

## <a id="examplequery3"></a>Example query 3

The next query returns all the families that are registered.

Query:

```bash
db.families.find( { "isRegistered" : true })
```

Results:

No document is returned.

## <a id="examplequery4"></a>Example query 4

The next query returns all the families that aren't registered.

Query:

```bash
db.families.find( { "isRegistered" : false })
```

Results:

```json
{
    "_id": ObjectId("58f65e1198f3a12c7090e68c"),
    "id": "WakefieldFamily",
    "parents": [{
        "familyName": "Wakefield",
        "givenName": "Robin"
    }, {
        "familyName": "Miller",
        "givenName": "Ben"
    }],
    "children": [{
        "familyName": "Merriam",
        "givenName": "Jesse",
        "gender": "female",
        "grade": 1,
        "pets": [{
            "givenName": "Goofy"
        }, {
            "givenName": "Shadow"
        }]
    }, {
        "familyName": "Miller",
        "givenName": "Lisa",
        "gender": "female",
        "grade": 8
    }],
    "address": {
        "state": "NY",
        "county": "Manhattan",
        "city": "NY"
    },
    "creationDate": 1431620462,
    "isRegistered": false
}
```

## <a id="examplequery5"></a>Example query 5

The next query returns all the families that aren't registered and state is NY.

Query:

```bash
db.families.find( { "isRegistered" : false, "address.state" : "NY" })
```

Results:

```json
{
    "_id": ObjectId("58f65e1198f3a12c7090e68c"),
    "id": "WakefieldFamily",
    "parents": [{
        "familyName": "Wakefield",
        "givenName": "Robin"
    }, {
        "familyName": "Miller",
        "givenName": "Ben"
    }],
    "children": [{
        "familyName": "Merriam",
        "givenName": "Jesse",
        "gender": "female",
        "grade": 1,
        "pets": [{
            "givenName": "Goofy"
        }, {
            "givenName": "Shadow"
        }]
    }, {
        "familyName": "Miller",
        "givenName": "Lisa",
        "gender": "female",
        "grade": 8
    }],
    "address": {
        "state": "NY",
        "county": "Manhattan",
        "city": "NY"
    },
    "creationDate": 1431620462,
    "isRegistered": false
}
```

## <a id="examplequery6"></a>Example query 6

The next query returns all the families where children grades are 8.

Query:

```bash
db.families.find( { children : { $elemMatch: { grade : 8 }} } )
```

Results:

```json
{
    "_id": ObjectId("58f65e1198f3a12c7090e68c"),
    "id": "WakefieldFamily",
    "parents": [{
        "familyName": "Wakefield",
        "givenName": "Robin"
    }, {
        "familyName": "Miller",
        "givenName": "Ben"
    }],
    "children": [{
        "familyName": "Merriam",
        "givenName": "Jesse",
        "gender": "female",
        "grade": 1,
        "pets": [{
            "givenName": "Goofy"
        }, {
            "givenName": "Shadow"
        }]
    }, {
        "familyName": "Miller",
        "givenName": "Lisa",
        "gender": "female",
        "grade": 8
    }],
    "address": {
        "state": "NY",
        "county": "Manhattan",
        "city": "NY"
    },
    "creationDate": 1431620462,
    "isRegistered": false
}
```

## <a id="examplequery7"></a>Example query 7

The next query returns all the families where size of children array is 3.

Query:

```bash
db.Family.find( {children: { $size:3} } )
```

Results:

No results are returned because there are no families with more than two children. Only when parameter value is `2` does this query succeed and return the full document.

## Next steps

In this tutorial, you've done the following tasks:

> [!div class="checklist"]
> * Learned how to query using Azure Cosmos DB for MongoDB

You can now proceed to the next tutorial to learn how to distribute your data globally.

> [!div class="nextstepaction"]
> [Distribute your data globally](../nosql/tutorial-global-distribution.md)
