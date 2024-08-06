---
title:  Indexing Best Practices in Azure Cosmos DB for MongoDB vCore
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Use create Indexing for empty collections in Azure Cosmos DB for MongoDB vCore.
author: abinav2307
ms.author: abramees
ms.reviewer: sidandrews
ms.service: azure-cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 6/24/2024
---

# Indexing Best Practices in Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](~/reusable-content/ce-skilling/azure/includes/cosmos-db/includes/appliesto-mongodb-vcore.md)]

## Queryable fields should always have indexes created
Read operations based on predicates and aggregates consult the index for the corresponding filters. In the absence of indexes, the database engine performs a document scan to retrieve the matching documents. Scans are always expensive and get progressively more expensive as the volume of data in a collection grows. For optimal query performance, indexes should always be created for all queryable fields.

## Avoid unnecessary indexes and indexing all fields by default
Indexes should be created only for queryable fields. Wildcard indexing should be used only when query patterns are unpredictable where any field in the document structure can be part of query filters.

> [!TIP]
> Azure Cosmos DB for MongoDB vCore only indexes the _id field by default. All other fields are not indexed by default. The fields to be indexed should be planned ahead of time to maximize query performance, while minimizing impact on writes from indexing too many fields.

When a new document is inserted for the first time or an existing document is updated or deleted, each of the specified fields in the index is also updated. If the indexing policy contains a large number of fields (or all the fields in the document), more resources are consumed by the server in updating the corresponding indexes. When running at scale, only the queryable fields should be indexed while all remaining fields not used in query predicates should remain excluded from the index. 

## Create the necessary indexes before data ingestion
For optimal performance, indexes should be created upfront before data is loaded. All document writes, updates and deletes will synchronously update the corresponding indices. If indexes are created after data is ingested, more server resources are consumed to index historical data. Depending on the size of the historical data, this operation is time consuming and impacts steady state read and write performance.

> [!NOTE]
> For scenarios where read patterns change and indexes need to be added, background indexing should be enabled, which can be done through a support ticket.

## For multiple indexes created on historical data, issue nonblocking createIndex commands for each field
It is not always possible to plan for all query patterns upfront, particularly as application requirements evolve. Changing application needs inevitably requires fields to be added to the index on a cluster with a large amount of historical data. 

In such scenarios, each createIndex command should be issued asynchronously without waiting on a response from the server.

> [!NOTE]
> By default, Azure Cosmos DB for MongoDB vCore responds to a createIndex operation only after the index is fully built on historical data. Depending on the size of the cluster and the volume of data ingested, this can take time and appear as though the server is not responding to the createIndex command. 

If the createIndex commands are being issued through the Mongo Shell, use Ctrl + C to interrupt the command to stop waiting on a response and issue the next set of operations. 

> [!NOTE]
> Using Ctrl + C to interrupt the createIndex command after it has been issued does not terminate the index build operation on the server. It simply stops the Shell from waiting on a response from the server, while the server asynchronously continues to build the index over the existing documents.

## Create Compound Indexes for queries with predicates on multiple fields
Compound indexes should be used in the following scenarios:
- Queries with filters on multiple fields
- Queries with filters on multiple fields and with one or more fields sorted in ascending or descending order

Consider the following document within the 'cosmicworks' database and 'employee' collection
```json
{
    "firstName": "Steve",
    "lastName": "Smith",
    "companyName": "Microsoft",
    "division": "Azure",
    "subDivision": "Data & AI",
    "timeInOrgInYears": 7
}
```

Consider the following query to find all employees with last name 'Smith' with the organization for more than 5 years:
```javascript
db.employee.find({"lastName": "Smith", "timeInOrgInYears": {"$gt": 5}})
```

A compound index on both 'lastName' and 'timeInOrgInYears' optimizes this query:
```javascript
use cosmicworks;
db.employee.createIndex({"lastName" : 1, "timeInOrgInYears" : 1})
```

## Track the status of a createIndex operation
When indexes are added and historical data needs to be indexed, the progress of the index build operation can be tracked using db.currentOp().

Consider this sample to track the indexing progress on the 'cosmicworks' database.
```javascript
use cosmicworks;
db.currentOp()
```

When a createIndex operation is in progress, the response looks like:
```json
{
  "inprog": [
    {
      "shard": "defaultShard",
      "active": true,
      "type": "op",
      "opid": "30000451493:1719209762286363",
      "op_prefix": 30000451493,
      "currentOpTime": "2024-06-24T06:16:02.000Z",
      "secs_running": 0,
      "command": { "aggregate": "" },
      "op": "command",
      "waitingForLock": false
    },
    {
      "shard": "defaultShard",
      "active": true,
      "type": "op",
      "opid": "30000451876:1719209638351743",
      "op_prefix": 30000451876,
      "currentOpTime": "2024-06-24T06:13:58.000Z",
      "secs_running": 124,
      "command": { "createIndexes": "" },
      "op": "workerCommand",
      "waitingForLock": false,
      "progress": {},
      "msg": ""
    }
  ],
  "ok": 1
}
```

## Enable Large Index Keys by default
Even if the documents do not contain keys that have a large number of characters or the documents do not contain multiple levels of nesting, specifying large index keys ensures these scenarios are covered.

Consider this sampe to enable large index keys on the 'large_index_coll' collection in the 'cosmicworks' database.

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

## Prioritizing Index Builds over new Write Operations using the Blocking Option
For scenarios in which the index should be created before data is loaded, the blocking option should be used to block incoming writes until the index build completes.

Setting `{ "blocking": true }` is particularly useful in migration utilities where indexes are created on empty collections before data writes commence.

Consider an example of the blocking option for index creation on the 'employee' collection in the 'cosmicworks' database:

```javascript
use cosmicworks;
db.runCommand({
  createIndexes: "employee",
  indexes: [{"key":{"name":1}, "name":"name_1"}],
  blocking: true
})

```

## Related content

Check out [text indexing](how-to-create-text-index.md), which allows for efficient searching and querying of text-based data.

## Next step

> [!div class="nextstepaction"]
> [Build a Node.js web application](tutorial-nodejs-web-app.md)
