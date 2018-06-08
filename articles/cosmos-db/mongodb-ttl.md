
---
title: Expire data in Azure Cosmos DB MongoDB API | Microsoft Docs
description: Documentation for the MongoDB per-document TTL feature.
services: cosmos-db
documentationcenter: ''
author: orestis-ms
manager: jhubbard
editor: ''

ms.assetid: daacbabf-1bb5-497f-92db-079910703048
ms.service: cosmos-db
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: javascript
ms.topic: quickstart
ms.date: 06/08/2018
ms.author: orkostak

---
#Expire data in Azure Cosmos DB MongoDB API

Time-to-live (TTL) functionality allows the database to automatically delete expiring data. MongoDB API utilizes Azure Cosmos DB's TTL capabilities. Two modes are supported: setting a default TTL value on the whole collection, and setting individual TTL values for each document. The logic governing TTL indexes and per-document TTL values in MongoDB  API is the [same as in Azure Cosmos DB](../cosmos-db/mongodb-indexing.md).

## TTL Indexes
To enable TTL universally on a collection, a ["TTL index" (time-to-live index)](../cosmos-db/mongodb-indexing.md) needs to be created. The TTL index is an index on the _ts field with an "expireAfterSeconds" value.

Example:
```JavaScript
globaldb:PRIMARY> db.coll.createIndex({"_ts":1}, {expireAfterSeconds: 10})
{
        "_t" : "CreateIndexesResponse",
        "ok" : 1,
        "createdCollectionAutomatically" : true,
        "numIndexesBefore" : 1,
        "numIndexesAfter" : 4
}
```

The command in the above example will create an index with TTL functionality. Once the index is created, the database will automatically delete any documents in that collection that have not been modified in the last 10 seconds. 

> [!NOTE]
> **_ts** is a Cosmos DB-specific field and is not accessible from MongoDB clients. It is a reserved (system) property that contains the timestamp of the document's last modification.
>

## Per-Document TTL
Per-document TTL values are also supported. The document(s) must contain a root-level property "ttl" (lower-case), and a TTL index as described above must have been created for that collection. TTL values set on a document will override the collection's TTL value.

The TTL value must be an int32. Alternatively, an int64 that fits in an int32, or a double with no decimal part that fits in an int32. Values for the TTL property that do not conform to these specifications are allowed but not treated as a meaningful document TTL value.

The TTL value for the document is optional; documents without a TTL value can be inserted into the collection.  In this case, the collection's TTL value will be honored. 

## How to activate the Per-Document TTL feature
The per-document TTL feature can be activated via the MongoDB API account's "Preview Features" tab in Azure Portal.

## Next steps
* [Expire data in Azure Cosmos DB collections automatically with time to live](../cosmos-db/time-to-live.md)
* [Indexing in the Azure Cosmos DB: MongoDB API](../cosmos-db/mongodb-indexing.md))
