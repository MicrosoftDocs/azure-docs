---
title: Indexing in Azure Cosmos DB MongoDB API | Microsoft Docs
description: Presents an overview of the indexing capabilities in Azure Cosmos DB MongoDB API.
services: cosmos-db
documentationcenter: ''
author: orestis-ms
manager: sivethe
editor: ''

ms.assetid: daacbabf-1bb5-497f-92db-079910703047
ms.service: cosmos-db
ms.custom: quick start connect, mvc
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: javascript
ms.topic: quickstart
ms.date: 03/01/2018
ms.author: orestis-ms

---


# Indexing in Azure Cosmos DB MongoDB API

Azure Cosmos DB MongoDB API leverages automatic index management capabilities of Azure Cosmos DB. As a result, users have access to the default indexing policies of Azure Cosmos DB. So, if no indexes have been defined by the user, or no indexes have been dropped, then all fields will be automatically indexed by default when inserted into the collection. 
For users that have no requirements for uniqueness on custom document fields, we recommend keeping the default indexing setup.

## Dropping default indexes

The following command can be used to drop the default indexes for a collection ```coll```:

```JavaScript
> db.coll.dropIndexes()
{ "_t" : "DropIndexesResponse", "ok" : 1, "nIndexesWas" : 3 }
```

Dropping the default indexes retains the index on the _id field; this is the default MongoDB behavior.

## Creating Compound indexes

Compound indexes hold references to multiple fields of a document. Logically, they are equivalent to creating multiple individual indexes per field. To take advantage of the optimizations provided by Cosmos DB indexing techniques, we recommend creating multiple individual indexes instead of a single (non-unique) compound index.

## Creating Unique Indexes

Unique indexes are useful for enforcing that no two or more documents contain the same value for the indexed field(s). Currently, unique indexes can be created only when the collection is empty (contains no documents). 
The following command creates a unique index on the field “student_id”:

```JavaScript
globaldb:PRIMARY> db.coll.createIndex( { "student_id" : 1 } ) 
{
        "_t" : "CreateIndexesResponse",
        "ok" : 1,
        "createdCollectionAutomatically" : false,
        "numIndexesBefore" : 1,
        "numIndexesAfter" : 2
}
```

For sharded collections, as per MongoDB behavior, creating a unique index requires providing the shard (partition) key. In other words, all unique indexes on a sharded collection are compound indexes where one of the fields is the partition key.

The following commands create a sharded collection ```coll``` (shard key is ```university```) with a unique index on fields student_id and university:

```JavaScript
globaldb:PRIMARY> db.runCommand({shardCollection: db.coll._fullName, key: { university: "hashed"}});
{
        "_t" : "ShardCollectionResponse",
        "ok" : 1,
        "collectionsharded" : "test.coll"
}
globaldb:PRIMARY> db.coll.createIndex( { "student_id" : 1, "university" : 1 }, {unique:true})
{
        "_t" : "CreateIndexesResponse",
        "ok" : 1,
        "createdCollectionAutomatically" : false,
        "numIndexesBefore" : 3,
        "numIndexesAfter" : 4
}
```

In the above example, if ```"university":1``` clause was omitted, an error with the following message would be returned:

```"cannot create unique index over {student_id : 1.0} with shard key pattern { university : 1.0 }"```

## TTL Indexes

To enable document expiration in a particular collection, a "TTL index" (time-to-live index) needs to be created. A TTL index is an index on the _ts field with an "expireAfterSeconds" value.
 
Example:
```JavaScript
globaldb:PRIMARY> db.coll.createIndex({"_ts":1}, {expireAfterSeconds: 10})
```

The preceding command will cause the deletion of any documents in ```db.coll``` collection that have not been modified in the last 10 seconds. 
 
> [!NOTE]
> **_ts** is a Cosmos DB-specific field and is not accessible from MongoDB clients. It is a reserved (system) property that contains the timestamp of the document's last modification.
>

## Migrating collections with indexes

Currently, creating unique indexes is possible only when the collection contains no documents. Popular MongoDB migration tools attempt to create the unique indexes after importing the data. To circumvent this issue, it is suggested that users manually create the corresponding collections and unique indexes, instead of allowing the migration tool (for ```mongorestore``` this behavior is achieved by using the --noIndexRestore flag in the command line).

## Next steps
*[How does Azure Cosmos DB index data?](../cosmos-db/indexing-policies.md)
