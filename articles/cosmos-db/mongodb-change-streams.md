---
title: Change streams in Azure Cosmos DB's API for MongoDB
description: Learn how to use change streams in Azure Cosmos DB's API for MongoDB to get the changes made to your data.
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: conceptual
ms.date: 03/30/2020
ms.author: tisande
---

# Change streams in Azure Cosmos DB's API for MongoDB

[Change feed](change-feed.md) support in Azure Cosmos DB's API for MongoDB is available by using the change streams API. By using the change streams API, your applications can get the changes made to the collection or to the items in a single shard. Later you can take further actions based on the results. Changes to the items in the collection are captured in the order of their modification time and the sort order is guaranteed per shard key.

> [!NOTE]
> To use change streams, create the account with version 3.6 of Azure Cosmos DB's API for MongoDB, or a later version. If you run the change stream examples against an earlier version, you might see the `Unrecognized pipeline stage name: $changeStream` error.

## Current limitations

The following limitations are applicable when using change streams:

* The `operationType` and `updateDescription` properties are not yet supported in the output document.
* The `insert`, `update`, and `replace` operations types are currently supported. 
* Delete operation or other events are not yet supported.

Due to these limitations, the $match stage, $project stage, and fullDocument options are required as shown in the previous examples.

Unlike the change feed in Azure Cosmos DB's SQL API, there is not a separate [Change Feed Processor Library](change-feed-processor.md) to consume change streams or a need for a leases container. There is not currently support for [Azure Functions triggers](change-feed-functions.md) to process change streams.

## Error handling

The following error codes and messages are supported when using change streams:

* **HTTP error code 16500** - When the change stream is throttled, it returns an empty page.

* **NamespaceNotFound (OperationType Invalidate)** - If you run change stream on the collection that does not exist or if the collection is dropped, then a `NamespaceNotFound` error is returned. Because the `operationType` property can't be returned in the output document, instead of the `operationType Invalidate` error, the `NamespaceNotFound` error is returned.

## Examples

The following example shows how to get change streams on all the items in the collection. This example creates a cursor to watch items when they are inserted, updated, or replaced. The `$match` stage, `$project` stage, and `fullDocument` option are required to get the change streams. Watching for delete operations using change streams is currently not supported. As a workaround, you can add a soft marker on the items that are being deleted. For example, you can add an attribute in the item called "deleted." When you'd like to delete the item, you can set "deleted" to `true` and set a TTL on the item. Since updating "deleted" to `true` is an update, this change will be visible in the change stream.

### JavaScript:

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

### C#:

```csharp
var pipeline = new EmptyPipelineDefinition<ChangeStreamDocument<BsonDocument>>()
    .Match(change => change.OperationType == ChangeStreamOperationType.Insert || change.OperationType == ChangeStreamOperationType.Update || change.OperationType == ChangeStreamOperationType.Replace)
    .AppendStage<ChangeStreamDocument<BsonDocument>, ChangeStreamDocument<BsonDocument>, BsonDocument>(
    "{ $project: { '_id': 1, 'fullDocument': 1, 'ns': 1, 'documentKey': 1 }}");

var options = new ChangeStreamOptions{
        FullDocument = ChangeStreamFullDocumentOption.UpdateLookup
    };

var enumerator = coll.Watch(pipeline, options).ToEnumerable().GetEnumerator();

while (enumerator.MoveNext()){
        Console.WriteLine(enumerator.Current);
    }

enumerator.Dispose();
```

## Changes within a single shard

The following example shows how to get changes to the items within a single shard. This example gets the changes of items that have shard key equal to "a" and the shard key value equal to "1". It is possible to have different clients reading changes from different shards in parallel.

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

## Next steps

* [Use time to live to expire data automatically in Azure Cosmos DB's API for MongoDB](mongodb-time-to-live.md)
* [Indexing in Azure Cosmos DB's API for MongoDB](mongodb-indexing.md)
