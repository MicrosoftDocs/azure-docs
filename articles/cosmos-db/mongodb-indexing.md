---
title: Indexing in Azure Cosmos DB's API for MongoDB
description: Presents an overview of the indexing capabilities with Azure Cosmos DB's API for MongoDB.
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: nodejs
ms.topic: conceptual
ms.date: 12/26/2018
author: sivethe
ms.author: sivethe

---


# Indexing using Azure Cosmos DB's API for MongoDB

Azure Cosmos DB's API for MongoDB leverages automatic index management capabilities of Cosmos DB. As a result, users have access to the default indexing policies of Cosmos DB. So, if no indexes have been defined by the user, or no indexes have been dropped, then all fields will be automatically indexed by default when inserted into a collection. For most scenarios, we recommend using the default indexing policy set on the account.

## Dropping the default indexes

The following command can be used to drop the default indexes for a collection ```coll```:

```JavaScript
> db.coll.dropIndexes()
{ "_t" : "DropIndexesResponse", "ok" : 1, "nIndexesWas" : 3 }
```

## Creating compound indexes

Compound indexes hold references to multiple fields of a document. Logically, they are equivalent to creating multiple individual indexes per field. To take advantage of the optimizations provided by Cosmos DB indexing techniques, we recommend creating multiple individual indexes instead of a single (non-unique) compound index.

## Creating unique indexes

[Unique indexes](unique-keys.md) are useful for enforcing that no two or more documents contain the same value for the indexed field(s). 
>[!important] 
> Currently, unique indexes can be created only when the collection is empty (contains no documents). 

The following command creates a unique index on the field "student_id":

```JavaScript
globaldb:PRIMARY> db.coll.createIndex( { "student_id" : 1 }, {unique:true} ) 
{
        "_t" : "CreateIndexesResponse",
        "ok" : 1,
        "createdCollectionAutomatically" : false,
        "numIndexesBefore" : 1,
        "numIndexesAfter" : 4
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

## TTL indexes

To enable document expiration in a particular collection, a ["TTL index" (time-to-live index)](../cosmos-db/time-to-live.md) needs to be created. A TTL index is an index on the _ts field with an "expireAfterSeconds" value.
 
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
* [Indexing in Azure Cosmos DB](../cosmos-db/index-policy.md)
* [Expire data in Azure Cosmos DB automatically with time to live](../cosmos-db/time-to-live.md)
