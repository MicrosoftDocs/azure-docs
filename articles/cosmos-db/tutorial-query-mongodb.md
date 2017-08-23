---
title: 'Azure Cosmos DB: How to query using the DocumentDB API? | Microsoft Docs'
description: Learn to query with the DocumentDB API for Azure Cosmos DB
services: cosmos-db
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''
tags: ''

ms.assetid: 
ms.service: cosmos-db
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 05/10/2017
ms.author: mimig

---

# Azure Cosmos DB: How to query with API for MongoDB?

The Azure Cosmos DB [API for MongoDB](mongodb-introduction.md) supports [MongoDB shell queries](https://docs.mongodb.com/manual/tutorial/query-documents/). 

This article covers the following tasks: 

> [!div class="checklist"]
> * Querying data with MongoDB

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

## <a id="examplequery2"></a>Example query 2 

The next query returns all the children in the family. 

**Query**
    
    db.familes.find( { id: “WakefieldFamily” }, { children: true } )

**Results**

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


## <a id="examplequery3"></a>Example query 3 

The next query returns all the families which are registered. 

**Query**
    
    db.families.find( { "isRegistered" : true })
**Results**
	No document will be returned. 

## <a id="examplequery4"></a>Example query 4

The next query returns all the families which are not registered. 

**Query**
    
    db.families.find( { "isRegistered" : false })
**Results**

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

## <a id="examplequery5"></a>Example query 5

The next query returns all the families which are not registered and state is NY. 

**Query**
    
     db.families.find( { "isRegistered" : false, "address.state" : "NY" })

**Results**

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


## <a id="examplequery6"></a>Example query 6

The next query returns all the families where children grades are 8.

**Query**
  
     db.families.find( { children : { $elemMatch: { grade : 8 }} } )

**Results**

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

## <a id="examplequery7"></a>Example query 7

The next query returns all the families where size of children array is 3.

**Query**
  
      db.Family.find( {children: { $size:3} } )

**Results**

No results will be returned as we do not have more than 2 children. Only when parameter is 2 this query will succeed and return the full document.

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Learned how to query using MongoDB 

You can now proceed to the next tutorial to learn how to distribute your data globally.

> [!div class="nextstepaction"]
> [Distribute your data globally](tutorial-global-distribution-documentdb.md)

