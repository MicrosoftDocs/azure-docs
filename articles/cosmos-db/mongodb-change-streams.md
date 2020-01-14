---
title: Change streams in Azure Cosmos DB’s API for MongoDB
description: Learn how to use change streams n Azure Cosmos DB’s API for MongoDB to get the changes made to your data.
author: srchi
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: conceptual
ms.date: 11/16/2019
ms.author: srchi
---

# Change streams in Azure Cosmos DB’s API for MongoDB

[Change feed](change-feed.md) support in Azure Cosmos DB’s API for MongoDB is available by using the change streams API. By using the change streams API, your applications can get the changes made to the collection or to the items in a single shard. Later you can take further actions based on the results. Changes to the items in the collection are captured in the order of their modification time and the sort order is guaranteed per shard key.

The following example shows how to get change streams on all the items in the collection. This example creates a cursor to watch items when they are inserted, updated, or replaced. The $match stage, $project stage, and fullDocument option are required to get the change streams. Watching for delete operations using change streams is currently not supported. As a workaround, you can add a soft marker on the items that are being deleted. For example, you can add an attribute in the item called "deleted" and set it to "true" and set a TTL on the item, so that you can automatically delete it as well as track it.

```javascript
var cursor = db.coll.watch(
    [
        { $match: { "operationType": { $in: ["insert", "update", "replace"] } } },
        { $project: { "_id": 1, "fullDocument": 1, "ns": 1, "documentKey": 1 } }
    ],
    { fullDocument: "updateLookup" });

while (!cursor.isExhausted()) {
    if (cursor.hasNext()) {
        printjson(cursor.next());
    }
}
```

The following example shows how to get changes to the items in a single shard. This example gets the changes of items that have shard key equal to "a" and the shard key value equal to "1".

```javascript
var cursor = db.coll.watch(
    [
        { 
            $match: { 
                $and: [
                    { "fullDocument.a": 1 }, 
                    { "operationType": { $in: ["insert", "update", "replace"] } }
                ]
            }
        },
        { $project: { "_id": 1, "fullDocument": 1, "ns": 1, "documentKey": 1} }
    ],
    { fullDocument: "updateLookup" });

```

## Current limitations

The following limitations are applicable when using change streams:

* The `operationType` and `updateDescription` properties are not yet supported in the output document.
* The `insert`, `update`, and `replace` operations types are currently supported. Delete operation or other events are not yet supported.

Due to these limitations, the $match stage, $project stage, and fullDocument options are required as shown in the previous examples.

## Error handling

The following error codes and messages are supported when using change streams:

* **HTTP error code 429** - When the change stream is throttled, it returns an empty page.

* **NamespaceNotFound (OperationType Invalidate)** - If you run change stream on the collection that does not exist or if the collection is dropped, then a `NamespaceNotFound` error is returned. Because the `operationType` property can't be returned in the output document, instead of the `operationType Invalidate` error, the `NamespaceNotFound` error is returned.

## Next steps

* [Use time to live to expire data automatically in Azure Cosmos DB's API for MongoDB](mongodb-time-to-live.md)
* [Indexing in Azure Cosmos DB's API for MongoDB](mongodb-indexing.md)