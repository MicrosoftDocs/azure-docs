---
title: Background indexing
titleSuffix: Background indexing on Azure Cosmos DB for MongoDB vCore
description: Background indexing to enable non-blocking operation during index creation
author: avijitgupta
ms.author: avijitgupta
ms.reviewer: gahllevy
ms.service: azure-cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 07/01/2024
---

# Background indexing (Preview)

[!INCLUDE[MongoDB vCore](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

Background indexing is a technique that enables a database system to perform indexing operations on a collection without blocking other queries or updates. Azure Cosmos DB for Mongo vcore accepts the background indexing request and asynchronously performs it in background.

If working with smaller tiers or workloads with higher I/O needs, it's recommended to predefine indexes on empty collections and avoid relying on background indexing.

> [!NOTE]
> Background indexing is a Preview feature. Enabling this feature requires raising a support request.

> [!IMPORTANT]
> It is advised to create `unique` indexes on an empty collection as those are created in foreground, which results in blocking of reads and writes.
>
> It is advised to create indexes based on query predicates beforehand, while the collection is still empty. It prevents resource contention if pushed on read-write heavy large collection.

## Monitor index build

We can learn about the progress of index build using command `currentOp()`.

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

- Unique indexes can't be created in the background. It's best to create them on an empty collection and then load the data.
- Background indexing is performed sequentially within a single collection. However, the number of simultaneous index builds on different collections is configurable (default: 2).

## Next Steps

> [!div class="nextstepaction"]
> [Best practices](how-to-create-indexes.md)