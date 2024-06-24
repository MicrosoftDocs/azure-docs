---
title:  Indexing Best Practices in Azure Cosmos DB for MongoDB vCore
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Use create Indexing for empty collections in Azure Cosmos DB for MongoDB vCore.
author: abinav2307
ms.author: abinav2307
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 6/24/2024
---

# Indexing Best Practices in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

The `CreateIndexes` Command in Azure Cosmos DB for MongoDB vCore has an option to optimize index creation, especially beneficial for scenarios involving empty collections. This document outlines the usage and expected behavior of this new option.

## Queryable fields should have indexes created
Azure Cosmos DB for MongoDB vCore only indexes the _id field by default and all other fields are excluded. Thus, indexes should explicitly be created for all queryable fields for the workload.

## Avoid unnecessary indexes and indexing all fields
While indexes should be created for all queryable fields other than the _id field, all fields should not be indexed if unnecessary.

When a new document is inserted for the first time or an existing document is updated or deleted, each of the specified fields in the index also needs to be updated. If the indexing policy contains a large number of fields (or all the fields in the document), additional time will be spent by the server in updating the corresponding indexes and write performance may be sub optimal. When running at scale, only the queryable fields should be indexed while all other fields not used in query predicates should be excluded from the index. 

## Create the necessary indexes prior to data ingestion
For optimal write performance, indexes should be created upfront before data is loaded. This ensures all documents that are inserted for the first time or subsequently updated or deleted will have the corresponding indexes updated as part of the write operation. If indexes are created after data has been ingested, additional server resources will be consumed to index historical data. Depending on the size of the historical data, this can be time consuming and can affect steady state write and read operations.

> [!NOTE]
    > For scenarios where indexes need to be added at a later time due to changes in read patterns, background indexing needs to be enabled on the cluster which can be enabled through a support ticket.

## For multiple indexes created on historical data, issue non-blocking createIndex commands for each field
It is not always possible to plan for all query patterns upfront. Changing application needs will inevitably require fields to be added to the index at a later time on an active cluster with a large amount of historical data. In such scenarios, if multiple fields need to be added to the index, each createIndex command should be issued asynchronously without waiting on a response from the server.

By default, Azure Cosmos DB for MongoDB vCore responds only after the index has been fully built on all the historically loaded documents. Depending on the size of the cluster and the volume of data already ingested, this can take time and may appear as though the server is not responding to the createIndex command. An independent call to getIndexes can be used to verify that the newly added field is now part of the list of fields to be indexed.

## Track the status of a createIndex operation
When indexes are added and historical data needs to be indexed, the progress of the index build operation(s) can be tracked using db.currentOp().

Consider the example below, to track the indexing progress on a database named cosmicworks.
```javascript
use cosmicworks;
db.currentOp()
```

When a createIndex operation is in progress, the response will look like:
```javascript
{
  inprog: [
    {
      shard: 'defaultShard',
      active: true,
      type: 'op',
      opid: '30000451493:1719209762286363',
      op_prefix: Long('30000451493'),
      currentOpTime: ISODate('2024-06-24T06:16:02.000Z'),
      secs_running: Long('0'),
      command: { aggregate: '' },
      op: 'command',
      waitingForLock: false
    },
    {
      shard: 'defaultShard',
      active: true,
      type: 'op',
      opid: '30000451876:1719209638351743',
      op_prefix: Long('30000451876'),
      currentOpTime: ISODate('2024-06-24T06:13:58.000Z'),
      secs_running: Long('124'),
      command: { createIndexes: '' },
      op: 'workerCommand',
      waitingForLock: false,
      progress: {},
      msg: ''
    }
  ],
  ok: 1
}
```

## Enable Large Index Keys by default
Even if the documents do not contain keys that have a large number of characters or the documents do not have multiple levels of nesting, specifying large index keys ensures these scenarios are covered.

Consider the example below to enable large index keys on a collection named large_index_coll within the cosmicworks database.

```javascript
use cosmicworks;
db.runCommand(
{
 "createIndexes": "large_index_coll",
 "indexes": [
    {
        "key": { "ikey": 1 },
        "name": "ikey_1",
        "enableLargeIndexKeys": true
    }
    ]
})
```

## Blocking Option
For scenarios in which the index should strictly be created before data has been loaded and for new writes to be blocked until all the historical data has been fully indexed, the blocking option should be specified when creating the index.

Setting `{ "blocking": true }` blocks all write operations (delete, update, insert) to the collection until index creation is completed. This feature is particularly useful in scenarios such as migration utilities where indexes are created on empty collections before data writes commence.

Consider an example of the blocking option for index creation being specified on a products collection within the cosmicworks database:

```javascript
use cosmicworks;
db.runCommand({
  createIndexes: "products",
  indexes: [{"key":{"name":1}, "name":"name_1"}],
  blocking: true
})

```

## Related content

Check out [text indexing](how-to-create-text-index.md), which allows for efficient searching and querying of text-based data.

## Next step

> [!div class="nextstepaction"]
> [Build a Node.js web application](tutorial-nodejs-web-app.md)
