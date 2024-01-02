---
title: Change streams in Azure Cosmos DB’s API for MongoDB
description: Learn how to use change streams n Azure Cosmos DB’s API for MongoDB to get the changes made to your data.
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: how-to
ms.date: 03/02/2021
author: gahl-levy
ms.author: gahllevy
ms.devlang: csharp, javascript
ms.custom: devx-track-csharp, ignite-2022
---

# Change streams in Azure Cosmos DB’s API for MongoDB
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

[Change feed](../change-feed.md) support in Azure Cosmos DB’s API for MongoDB is available by using the change streams API. By using the change streams API, your applications can get the changes made to the collection or to the items in a single shard. Later you can take further actions based on the results. Changes to the items in the collection are captured in the order of their modification time and the sort order is guaranteed per shard key.

> [!NOTE]
> To use change streams, create the Azure Cosmos DB's API for MongoDB account with server version 3.6 or higher. If you run the change stream examples against an earlier version, you might see the *Unrecognized pipeline stage name: $changeStream* error.

## Examples

The following example shows how to get change streams on all the items in the collection. This example creates a cursor to watch items when they are inserted, updated, or replaced. The `$match` stage, `$project` stage, and `fullDocument` option are required to get the change streams. Watching for delete operations using change streams is currently not supported. As a workaround, you can add a soft marker on the items that are being deleted. For example, you can add an attribute in the item called "deleted." When you'd like to delete the item, you can set "deleted" to `true` and set a TTL on the item. Since updating "deleted" to `true` is an update, this change will be visible in the change stream.

# [JavaScript](#tab/javascript)

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

# [C#](#tab/csharp)

```csharp
var collection = new MongoClient("<connection-string>")
    .GetDatabase("<database-name>")
    .GetCollection<BsonDocument>("<collection-name>");

var pipeline = new EmptyPipelineDefinition<ChangeStreamDocument<BsonDocument>>()
    .Match(change => 
        change.OperationType == ChangeStreamOperationType.Insert || 
        change.OperationType == ChangeStreamOperationType.Update || 
        change.OperationType == ChangeStreamOperationType.Replace
    )
    .AppendStage<ChangeStreamDocument<BsonDocument>, ChangeStreamDocument<BsonDocument>, BsonDocument>(
        @"{ 
            $project: { 
                '_id': 1, 
                'fullDocument': 1, 
                'ns': 1, 
                'documentKey': 1 
            }
        }"
    );

ChangeStreamOptions options = new ()
{
    FullDocument = ChangeStreamFullDocumentOption.UpdateLookup
};

using IChangeStreamCursor<BsonDocument> enumerator = collection.Watch(
    pipeline, 
    options
);

Console.WriteLine("Waiting for changes...");
while (enumerator.MoveNext())
{
    IEnumerable<BsonDocument> changes = enumerator.Current;
    foreach(BsonDocument change in changes)
    {
        Console.WriteLine(change);
    }  
}
```

# [Java](#tab/java)

The following example shows how to use change stream functionality in Java, for the complete example, see this [GitHub repo](https://github.com/Azure-Samples/azure-cosmos-db-mongodb-java-changestream/blob/main/mongostream/src/main/java/com/azure/cosmos/mongostream/App.java). This example also shows how to use the `resumeAfter` method to seek all the changes from last read. 

```java
Bson match = Aggregates.match(Filters.in("operationType", asList("update", "replace", "insert")));

// Pick the field you are most interested in
Bson project = Aggregates.project(fields(include("_id", "ns", "documentKey", "fullDocument")));

// This variable is for second example
BsonDocument resumeToken = null;

// Now time to build the pipeline
List<Bson> pipeline = Arrays.asList(match, project);

//#1 Simple example to seek changes

// Create cursor with update_lookup
MongoChangeStreamCursor<ChangeStreamDocument<org.bson.Document>> cursor = collection.watch(pipeline)
        .fullDocument(FullDocument.UPDATE_LOOKUP).cursor();

Document document = new Document("name", "doc-in-step-1-" + Math.random());
collection.insertOne(document);

while (cursor.hasNext()) {
    // There you go, we got the change document.
    ChangeStreamDocument<Document> csDoc = cursor.next();

    // Let is pick the token which will help us resuming
    // You can save this token in any persistent storage and retrieve it later
    resumeToken = csDoc.getResumeToken();
    //Printing the token
    System.out.println(resumeToken);
    
    //Printing the document.
    System.out.println(csDoc.getFullDocument());
    //This break is intentional but in real project feel free to remove it.
    break;
}

cursor.close();

```
---

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

## Scaling change streams
When using change streams at scale, it is best to evenly spread the load. Utilize the [GetChangeStreamTokens custom command](../mongodb/custom-commands.md) to spread the load across physical shards/partitions.

## Current limitations

The following limitations are applicable when using change streams:

* The `operationType` and `updateDescription` properties are not yet supported in the output document.
* The `insert`, `update`, and `replace` operations types are currently supported. However, the delete operation or other events are not yet supported.

Due to these limitations, the $match stage, $project stage, and fullDocument options are required as shown in the previous examples.

Unlike the change feed in Azure Cosmos DB's API for NoSQL, there is not a separate [Change Feed Processor Library](../change-feed-processor.md) to consume change streams or a need for a leases container. There is not currently support for [Azure Functions triggers](../change-feed-functions.md) to process change streams.

## Error handling

The following error codes and messages are supported when using change streams:

* **HTTP error code 16500** - When the change stream is throttled, it returns an empty page.

* **NamespaceNotFound (OperationType Invalidate)** - If you run change stream on the collection that does not exist or if the collection is dropped, then a `NamespaceNotFound` error is returned. Because the `operationType` property can't be returned in the output document, instead of the `operationType Invalidate` error, the `NamespaceNotFound` error is returned.

## Next steps

* [Use time to live to expire data automatically in Azure Cosmos DB's API for MongoDB](time-to-live.md)
* [Indexing in Azure Cosmos DB's API for MongoDB](indexing.md)
