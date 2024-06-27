---
title: Background Indexing
titleSuffix: Background Indexing on Azure Cosmos DB for MongoDB vCore
description: Background indexing to enable non-blocking operation during index creation
author: avijitgupta
ms.author: avijitgupta
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 06/27/2024
---

# Background indexing (Preview)

[!INCLUDE[MongoDB vCore](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

Background indexing is a technique that enables a database system to perform indexing operations on a collection without blocking other queries or updates. Azure Cosmos DB for Mongo vcore accepts the background indexing request and asynchronously performs it in background.

Background indexing can be enabled using the property `enableIndexBuildBackground` set to `true`. All indexes would be created in background except the unique indexes, post enabling the property.

If working with smaller SKUs or workloads with higher I/O needs, it becomes necessary to predefine indexes on empty collections and avoid relying on background indexing.

> [!NOTE]
> Enabling feature requires raising a support request.

> [!IMPORTANT]
> Ensure creating unique indexes on an empty collection as those are created in foreground.
>
> It is vital to create indexes based on query predicates beforehand, while the collection is still empty. It prevents resource contention if pushed on read-write heavy large collection.

## Monitor index build

We can learn about the progress of index build with command `currentOp`.

```javascript
db.currentOp("db_name":"<db_name>", "collection_name":"<collection_name>")
```

- `db_name` is an optional parameter.
- `collection_name` is optional parameter.

```javascript
// Output for reviewing build status
{
inprog: [
  {
    shard: 'defaultShard',
    active: true,
    type: 'op',
    opid: '10000003049:1701252500485346',
    op_prefix: Long("10000003049"),
    currentOpTime: ISODate("2024-06-24T10:08:20.000Z"),
    secs_running: Long("2"),
    command: {createIndexes: '' },
    op: 'command',
    waitingForLock: true
  },
  {
    shard: 'defaultShard',
    active: true,
    type: 'op',
    opid: '10000003050:1701252500499914',
    op_prefix: Long("10000003050"),
    currentOpTime: ISODate("2024-06-24T10:08:20.000Z"),
    secs_running: Long("2"),
    command: {
      createIndexes: 'BRInventory', },
      indexes: [
        {
          v:2,
          key: {vendorItemId: 1, vendorId: 1, itemType: 1},
          name: 'compound_idx'
        }
      ],
      '$db': 'test'
      op: 'command',
      waitingForLock: false,
      progress: {
         blocks_done: Long("12616"),
         blocks_done: Long("1276873"),
         documents_d: Long("0"),
         documents_to: Long("0")
      },
      msg: 'Building index.Progress 0.0098803875. Waiting on op_prefix: 10000000000.'
    }
  ],
  ok: 1
}
```

## Limitations

- Unique indexes can't be created in the background, it's best to create them on an empty collection and then load the data.
- Background indexing is performed sequentially within a single collection. However, background indexing can run concurrently across multiple collections.

## Next Steps

> [!div class="nextstepaction"]
> [Best Practices](how-to-create-indexes.md)