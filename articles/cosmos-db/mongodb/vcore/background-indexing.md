---
title: Background Indexing
titleSuffix: Background Indexing on Azure Cosmos DB for MongoDB vCore
description: background indexing to enable non-blocking operation during index creation
author: avijitkgupta
ms.author: avijitkgupta
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 06/27/2024
---

# Background indexing (Preview)

Background indexing is a technique that enables a database system to perform indexing operations on a collection without blocking other queries or updates. Azure CosmosDB for Mongo vcore accepts the indexing request and asynchronously performs it in background.

Azure Cosmos DB for Mongo vcore allows indexing in background with property `enableIndexBuildBackground` set to true”. All indexes would be created in background except the unique indexes, post enabling the property.

> [!NOTE]
> If anticipated data size is large enough for a collection, then it might be sensible to create index on an empty collection.

## Monitor index build

We can learn about the progress of index build with command `currentOp`.

```javascript
db.currentOp("db_name":"<db_name>", "collection_name":"<collection_name>")
```

- `db_name` is an optional parameter.
- `collection_name` is optional parameter.

```json
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
      createIndexes: 'BRInventory-Multivendor', },
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

We can observe the build status with values depicted in table.

| Status_Value |   Status    | Description |
|--------------|-------------|-------------|
|      1       | Queued      | Request is queued |
|      2       | In progress | Request is picked |
|      3       | Failed      | Request is already failed, 3 more retries will be attempted |
|      4       | Skippable   | It should not be picked for processing. This should be deleted after 20 mins |

## Limitations

- Unique indexes cannot be created as background index. We recommend user to create unique index on empty collection first and then load the data into it.
- Background index are performed in sequence over a single collection. Though background indexes on multiple collections can run in parallel.
