---
title: Indexing in Azure Cosmos DB's API for MongoDB
description: Presents an overview of the indexing capabilities with Azure Cosmos DB's API for MongoDB.
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.devlang: nodejs
ms.topic: conceptual
ms.date: 04/03/2020
author: timsander1
ms.author: tisande

---
# Indexing using Azure Cosmos DB's API for MongoDB

Azure Cosmos DB's API for MongoDB leverages the core index management capabilities of Azure Cosmos DB. This document focuses on how to add indexes using Azure Cosmos DB's API for MongoDB. You can also read an [overview of indexing in Azure Cosmos DB](index-overview.md) that is relevant across all API's.

## Indexing for version 3.6

The `_id` field is always automatically indexed and cannot be dropped. Azure Cosmos DB's API for MongoDB automatically enforces uniqueness of the `_id` field per shard key.

To index additional fields, you should apply the MongoDB index management commands. As in MongoDB, only the `_id` field is indexed automatically. This default indexing policy is different from the Azure Cosmos DB SQL API, which indexes all fields by default.

To apply a sort to a query, an index must be created on the fields used in the sort operation.

## Index types

### Single field

You can create indexes on any single field. The sort order of the single field index does not matter. The following command will create an index on the field `name`:

`db.coll.createIndex({name:1})`

One query will utilize multiple single field indexes, where available. You can create up to 500 single field indexes per container.

### Compound indexes (3.6)

Compound indexes are supported for accounts using the 3.6 wire protocol. You can include up to 8 fields in a compound index. Unlike in MongoDB, you should only create a compound index if your query needs to sort efficiently on multiple fields at once. For queries with multiple filters that don't need to sort, you should create multiple single field indexes instead of one single compound index.

The following command will create a compound index on the fields `name` and `age`:

`db.coll.createIndex({name:1,age:1})`

Compound indexes can be used to sort efficiently on multiple fields at once, such as:

`db.coll.find().sort({name:1,age:1})`

The above compound index can also be used for efficient sorting on a query with the opposite sort order on all fields. Here's an example:

`db.coll.find().sort({name:-1,age:-1})`

However, the sequence of the paths in the compound index must exactly match the query. Here's an example of a query that would require an additional compound index:

`db.coll.find().sort({age:1,name:1})`

### Multikey indexes

Azure Cosmos DB creates multikey indexes to index content stored in arrays. If you index a field with an array value, Azure Cosmos DB automatically indexes every element in the array.

### Geospatial indexes

Many geospatial operators will benefit from geospatial indexes. Currently, Azure Cosmos DB's API for MongoDB supports `2dsphere` indexes. `2d` indexes are not yet supported.

Here's an example for creating a geospatial index on the `location` field:

`db.coll.createIndex({ location : "2dsphere" })`

### Text indexes

Text indexes are not currently supported. For text search queries on strings, you should use [Azure Cognitive Search's](https://docs.microsoft.com/azure/search/search-howto-index-cosmosdb) integration with Azure Cosmos DB.

## Index properties

The following operations are common for both accounts serving wire protocol version 3.6 and accounts serving earlier wire protocol versions. You can also learn more about [supported indexes and indexed properties](mongodb-feature-support-36.md#indexes-and-index-properties).

### Unique indexes

[Unique indexes](unique-keys.md) are useful for enforcing that no two or more documents contain the same value for the indexed field(s).

>[!Important]
> Unique indexes can be created only when the collection is empty (contains no documents).

The following command creates a unique index on the field "student_id":

```shell
globaldb:PRIMARY> db.coll.createIndex( { "student_id" : 1 }, {unique:true} )
{
        "_t" : "CreateIndexesResponse",
        "ok" : 1,
        "createdCollectionAutomatically" : false,
        "numIndexesBefore" : 1,
        "numIndexesAfter" : 4
}
```

For sharded collections, creating a unique index requires providing the shard (partition) key. In other words, all unique indexes on a sharded collection are compound indexes where one of the fields is the partition key.

The following commands create a sharded collection ```coll``` (shard key is ```university```) with a unique index on fields student_id and university:

```shell
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

### TTL indexes

To enable document expiration in a particular collection, a ["TTL index" (time-to-live index)](../cosmos-db/time-to-live.md) needs to be created. A TTL index is an index on the _ts field with an "expireAfterSeconds" value.

Example:

```JavaScript
globaldb:PRIMARY> db.coll.createIndex({"_ts":1}, {expireAfterSeconds: 10})
```

The preceding command will cause the deletion of any documents in ```db.coll``` collection that have not been modified in the last 10 seconds.

> [!NOTE]
> **_ts** is an Azure Cosmos DB-specific field and is not accessible from MongoDB clients. It is a reserved (system) property that contains the timestamp of the document's last modification.

## Track the index progress

The 3.6 version of Azure Cosmos DB's API for MongoDB accounts support the `currentOp()` command to track index progress on a database instance. This command returns a document that contains information about the in-progress operations on a database instance. The `currentOp` command is used to track all the in-progress operations in native MongoDB whereas in Azure Cosmos DB's API for MongoDB, this command only supports tracking the index operation.

Here are some examples that show how to use the `currentOp` command to track the index progress:

* Get the index progress for a collection:

   ```shell
   db.currentOp({"command.createIndexes": <collectionName>, "command.$db": <databaseName>})
   ```

* Get the index progress for all the collections in a database:

  ```shell
  db.currentOp({"command.$db": <databaseName>})
  ```

* Get the index progress for all the databases and collections in an Azure Cosmos account:

  ```shell
  db.currentOp({"command.createIndexes": { $exists : true } })
  ```

The index progress details contain percentage of progress for the current index operation. The following example shows the output document format for different stages of index progress:

1. If the index operation on a 'foo' collection and 'bar' database that has 60 % indexing complete will have the following output document. `Inprog[0].progress.total` shows 100 as the target completion.

   ```json
   {
        "inprog" : [
        {
                ………………...
                "command" : {
                        "createIndexes" : foo
                        "indexes" :[ ],
                        "$db" : bar
                },
                "msg" : "Index Build (background) Index Build (background): 60 %",
                "progress" : {
                        "done" : 60,
                        "total" : 100
                },
                …………..…..
        }
        ],
        "ok" : 1
   }
   ```

2. For an index operation that has just started on a 'foo' collection and 'bar' database, the output document may show 0% progress until it reaches to a measurable level.

   ```json
   {
        "inprog" : [
        {
                ………………...
                "command" : {
                        "createIndexes" : foo
                        "indexes" :[ ],
                        "$db" : bar
                },
                "msg" : "Index Build (background) Index Build (background): 0 %",
                "progress" : {
                        "done" : 0,
                        "total" : 100
                },
                …………..…..
        }
        ],
       "ok" : 1
   }
   ```

3. When the in-progress index operation completes, the output document shows empty inprog operations.

   ```json
   {
      "inprog" : [],
      "ok" : 1
   }
   ```

### Background index updates

Regardless of the value specified for the **Background** index property, index updates are always done in the background. Index updates consume RU's at a lower priority than other database operations. Therefore, index changes won't result in any downtime for writes, updates, or deletes.

When adding a new index, queries will immediately utilize it. This means that queries may not return all the matching results, and will do so without returning any errors. Once the index transformation is completed, query results will be consistent. You can [track the index progress](#track-the-index-progress).

## Migrating collections with indexes

Currently, creating unique indexes is possible only when the collection contains no documents. Popular MongoDB migration tools attempt to create the unique indexes after importing the data. To circumvent this issue, it is suggested that users manually create the corresponding collections and unique indexes, instead of allowing the migration tool (for ```mongorestore``` this behavior is achieved by using the `--noIndexRestore` flag in the command line).

## Indexing for version 3.2

For Azure Cosmos DB accounts compatible with the 3.2 version of the MongoDB wire protocol, the available indexing features and defaults are different. You can [check your account's version](mongodb-feature-support-36.md#protocol-support). You can upgrade to the 3.6 version by filing a [support request](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

If you are using version 3.2, this section outlines key differences with version 3.6.

### Dropping the default indexes (3.2)

Unlike the 3.6 version of Azure Cosmos DB's API for MongoDB, 3.2 version indexes every property by default. The following command can be used to drop these default indexes for a collection ```coll```:

```JavaScript
> db.coll.dropIndexes()
{ "_t" : "DropIndexesResponse", "ok" : 1, "nIndexesWas" : 3 }
```

After dropping the default indexes, you can add on additional indexes as done in Version 3.6.

### Compound indexes (3.2)

Compound indexes hold references to multiple fields of a document. If you would like to create a compound index, please upgrade to 3.6 version by filing a [support request](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Next steps

* [Indexing in Azure Cosmos DB](../cosmos-db/index-policy.md)
* [Expire data in Azure Cosmos DB automatically with time to live](../cosmos-db/time-to-live.md)
