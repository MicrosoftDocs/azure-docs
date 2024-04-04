---
title: Azure Cosmos DB for MongoDB (3.6 version) supported features and syntax
description: Learn about Azure Cosmos DB for MongoDB (3.6 version) supported features and syntax.
author: seesharprun
ms.author: sidandrews
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: release-notes
ms.date: 10/12/2022
---

# Azure Cosmos DB for MongoDB (3.6 version): supported features and syntax

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can communicate with the Azure Cosmos DB for MongoDB using any of the open-source MongoDB client [drivers](https://docs.mongodb.org/ecosystem/drivers). The Azure Cosmos DB for MongoDB enables the use of existing client drivers by adhering to the MongoDB [wire protocol](https://docs.mongodb.org/manual/reference/mongodb-wire-protocol).

By using the Azure Cosmos DB for MongoDB, you can enjoy the benefits of the MongoDB you're used to, with all of the enterprise capabilities that Azure Cosmos DB provides: [global distribution](../distribute-data-globally.md), [automatic sharding](../partitioning-overview.md), availability and latency guarantees, encryption at rest, backups, and much more.

> [!NOTE]
> Version 3.6 of the Azure Cosmos DB for MongoDB has no current plans for end-of-life (EOL). The minimum notice for a future EOL is three years.

## Protocol Support

The Azure Cosmos DB for MongoDB is compatible with MongoDB server version **3.6** by default for new accounts. The supported operators and any limitations or exceptions are listed below. Any client driver that understands these protocols should be able to connect to Azure Cosmos DB for MongoDB. When you create Azure Cosmos DB API for MongoDB accounts, the 3.6 version of account has the endpoint in the format `*.mongo.cosmos.azure.com` whereas the 3.2 version of account has the endpoint in the format `*.documents.azure.com`.

## Query language support

Azure Cosmos DB for MongoDB provides comprehensive support for MongoDB query language constructs. The following sections show the detailed list of server operations, operators, stages, commands, and options currently supported by Azure Cosmos DB.

> [!NOTE]
> This article only lists the supported server commands and excludes client-side wrapper functions. Client-side wrapper functions such as `deleteMany()` and `updateMany()` internally utilize the `delete()` and `update()` server commands. Functions utilizing supported server commands are compatible with Azure Cosmos DB for MongoDB.

## Database commands

Azure Cosmos DB for MongoDB supports the following database commands:

### Query and write operation commands

| Command | Supported |
|---------|---------|
| [`change streams`](change-streams.md) | Yes |
| `delete` | Yes |
| `eval` | No |
| `find` | Yes |
| `findAndModify` | Yes |
| `getLastError` | Yes |
| `getMore` | Yes |
| `getPrevError` | No |
| `insert` | Yes |
| `parallelCollectionScan` | No |
| `resetError` | No |
| `update` | Yes |

### Authentication commands

| Command | Supported |
|---------|---------|
| `authenticate` | Yes |
| `getnonce` | Yes |
| `logout` | Yes |

### Administration commands

| Command | Supported |
|---------|---------|
| `cloneCollectionAsCapped` | No |
| `collMod` | No |
| `connectionStatus` | No |
| `convertToCapped` | No |
| `copydb` | No |
| `create` | Yes |
| `createIndexes` | Yes |
| `currentOp` | Yes |
| `drop` | Yes |
| `dropDatabase` | Yes |
| `dropIndexes` | Yes |
| `filemd5` | Yes |
| `killCursors` | Yes |
| `killOp` | No |
| `listCollections` | Yes |
| `listDatabases` | Yes |
| `listIndexes` | Yes |
| `reIndex` | Yes |
| `renameCollection` | No |

### Diagnostics commands

| Command | Supported |
|---------|---------|
| `buildInfo` | Yes |
| `collStats` | Yes |
| `connPoolStats` | No |
| `connectionStatus` | No |
| `dataSize` | No |
| `dbHash` | No |
| `dbStats` | Yes |
| `explain` | Yes |
| `features` | No |
| `hostInfo` | Yes |
| `listDatabases` | Yes |
| `listCommands` | No |
| `profiler` | No |
| `serverStatus` | No |
| `top` | No |
| `whatsmyuri` | Yes |

<a name="aggregation-pipeline"></a>

## Aggregation pipeline</a>

### Aggregation commands

| Command | Supported |
|---------|---------|
| `aggregate` | Yes |
| `count` | Yes |
| `distinct` | Yes |
| `mapReduce` | No |

### Aggregation stages

| Command | Supported |
|---------|---------|
| `addFields` | Yes |
| `bucket` | No |
| `bucketAuto` | No |
| `changeStream` | Yes |
| `collStats` | No |
| `count` | Yes |
| `currentOp` | No |
| `facet` | Yes |
| `geoNear` | Yes |
| `graphLookup` | Yes |
| `group` | Yes |
| `indexStats` | No |
| `limit` | Yes |
| `listLocalSessions` | No |
| `listSessions` | No |
| `lookup` | Partial |
| `match` | Yes |
| `out` | Yes |
| `project` | Yes |
| `redact` | Yes |
| `replaceRoot` | Yes |
| `replaceWith` | No |
| `sample` | Yes |
| `skip` | Yes |
| `sort` | Yes |
| `sortByCount` | Yes |
| `unwind` | Yes |

> [!NOTE]
> `$lookup` does not yet support the [uncorrelated subqueries](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#join-conditions-and-uncorrelated-sub-queries) feature introduced in server version 3.6. You will receive an error with a message containing `let is not supported` if you attempt to use the `$lookup` operator with `let` and `pipeline` fields.

### Boolean expressions

| Command | Supported |
|---------|---------|
| `and` | Yes |
| `not` | Yes |
| `or` | Yes |

### Set expressions

| Command | Supported |
|---------|---------|
| `setEquals` | Yes |
| `setIntersection` | Yes |
| `setUnion` | Yes |
| `setDifference` | Yes |
| `setIsSubset` | Yes |
| `anyElementTrue` | Yes |
| `allElementsTrue` | Yes |

### Comparison expressions

> [!NOTE]
> The API for MongoDB does not support comparison expressions with an array literal in the query.

| Command | Supported |
|---------|---------|
| `cmp` | Yes |
| `eq` | Yes |
| `gt` | Yes |
| `gte` | Yes |
| `lt` | Yes |
| `lte` | Yes |
| `ne` | Yes |
| `in` | Yes |
| `nin` | Yes |

### Arithmetic expressions

| Command | Supported |
|---------|---------|
| `abs` | Yes |
| `add` | Yes |
| `ceil` | Yes |
| `divide` | Yes |
| `exp` | Yes |
| `floor` | Yes |
| `ln` | Yes |
| `log` | Yes |
| `log10` | Yes |
| `mod` | Yes |
| `multiply` | Yes |
| `pow` | Yes |
| `sqrt` | Yes |
| `subtract` | Yes |
| `trunc` | Yes |

### String expressions

| Command | Supported |
|---------|---------|
| `concat` | Yes |
| `indexOfBytes` | Yes |
| `indexOfCP` | Yes |
| `split` | Yes |
| `strLenBytes` | Yes |
| `strLenCP` | Yes |
| `strcasecmp` | Yes |
| `substr` | Yes |
| `substrBytes` | Yes |
| `substrCP` | Yes |
| `toLower` | Yes |
| `toUpper` | Yes |

### Text search operator

| Command | Supported |
|---------|---------|
| `meta` | No |

### Array expressions

| Command | Supported |
|---------|---------|
| `arrayElemAt` | Yes |
| `arrayToObject` | Yes |
| `concatArrays` | Yes |
| `filter` | Yes |
| `indexOfArray` | Yes |
| `isArray` | Yes |
| `objectToArray` | Yes |
| `range` | Yes |
| `reverseArray` | Yes |
| `reduce` | Yes |
| `size` | Yes |
| `slice` | Yes |
| `zip` | Yes |
| `in` | Yes |

### Variable operators

| Command | Supported |
|---------|---------|
| `map` | Yes |
| `let` | Yes |

### System variables

| Command | Supported |
|---------|---------|
| `$$CURRENT` | Yes |
| `$$DESCEND` | Yes |
| `$$KEEP` | Yes |
| `$$PRUNE` | Yes |
| `$$REMOVE` | Yes |
| `$$ROOT` | Yes |

### Literal operator

| Command | Supported |
|---------|---------|
| `literal` | Yes |

### Date expressions

| Command | Supported |
|---------|---------|
| `dayOfYear` | Yes |
| `dayOfMonth` | Yes |
| `dayOfWeek` | Yes |
| `year` | Yes |
| `month` | Yes |
| `week` | Yes |
| `hour` | Yes |
| `minute` | Yes |
| `second` | Yes |
| `millisecond` | Yes |
| `dateToString` | Yes |
| `isoDayOfWeek` | Yes |
| `isoWeek` | Yes |
| `dateFromParts` | Yes |
| `dateToParts` | Yes |
| `dateFromString` | Yes |
| `isoWeekYear` | Yes |

### Conditional expressions

| Command | Supported |
|---------|---------|
| `cond` | Yes |
| `ifNull` | Yes |
| `switch` | Yes |

### Data type operator

| Command | Supported |
|---------|---------|
| `type` | Yes |

### Accumulator expressions

| Command | Supported |
|---------|---------|
| `sum` | Yes |
| `avg` | Yes |
| `first` | Yes |
| `last` | Yes |
| `max` | Yes |
| `min` | Yes |
| `push` | Yes |
| `addToSet` | Yes |
| `stdDevPop` | Yes |
| `stdDevSamp` | Yes |

### Merge operator

| Command | Supported |
|---------|---------|
| `mergeObjects` | Yes |

## Data types

| Command | Supported |
|---------|---------|
| `Double` | Yes |
| `String` | Yes |
| `Object` | Yes |
| `Array` | Yes |
| `Binary Data` | Yes |
| `ObjectId` | Yes |
| `Boolean` | Yes |
| `Date` | Yes |
| `Null` | Yes |
| `32-bit Integer (int)` | Yes |
| `Timestamp` | Yes |
| `64-bit Integer (long)` | Yes |
| `MinKey` | Yes |
| `MaxKey` | Yes |
| `Decimal128` | Yes |
| `Regular Expression` | Yes |
| `JavaScript` | Yes |
| `JavaScript (with scope)` | Yes |
| `Undefined` | Yes |

## Indexes and index properties

### Indexes

| Command | Supported |
|---------|---------|
| `Single Field Index` | Yes |
| `Compound Index` | Yes |
| `Multikey Index` | Yes |
| `Text Index` | No |
| `2dsphere` | Yes |
| `2d Index` | No |
| `Hashed Index` | No |

### Index properties

| Command | Supported |
|---------|---------|
| `TTL` | Yes |
| `Unique` | Yes |
| `Partial` | No |
| `Case Insensitive` | No |
| `Sparse` | No |
| `Background` | Yes |

## Operators

### Logical operators

| Command | Supported |
|---------|---------|
| `or` | Yes |
| `and` | Yes |
| `not` | Yes |
| `nor` | Yes |

### Element operators

| Command | Supported |
|---------|---------|
| `exists` | Yes |
| `type` | Yes |

### Evaluation query operators

| Command | Supported |
|---------|---------|
| `expr` | Yes |
| `jsonSchema` | No |
| `mod` | Yes |
| `regex` | Yes |
| `text` | No (Not supported. Use $regex instead.)|
| `where` | No |

In the $regex queries, left-anchored expressions allow index search. However, using 'i' modifier (case-insensitivity) and 'm' modifier (multiline) causes the collection scan in all expressions.

When there's a need to include `$` or `|`, it's best to create two (or more) regex queries. For example, given the following original query: `find({x:{$regex: /^abc$/})`, it has to be modified as follows:

`find({x:{$regex: /^abc/, x:{$regex:/^abc$/}})`

The first part will use the index to restrict the search to those documents beginning with ^abc and the second part will match the exact entries. The bar operator `|` acts as an "or" function - the query `find({x:{$regex: /^abc |^def/})` matches the documents in which field `x` has values that begin with `"abc"` or `"def"`. To utilize the index, it's recommended to break the query into two different queries joined by the $or operator: `find( {$or : [{x: $regex: /^abc/}, {$regex: /^def/}] })`.

### Array operators

| Command | Supported |
|---------|---------|
| `all` | Yes |
| `elemMatch` | Yes |
| `size` | Yes |

### Comment operator

| Command | Supported |
|---------|---------|
| `comment` | Yes |

### Projection operators

| Command | Supported |
|---------|---------|
| `elemMatch` | Yes |
| `meta` | No |
| `slice` | Yes |

### Update operators

#### Field update operators

| Command | Supported |
|---------|---------|
| `inc` | Yes |
| `mul` | Yes |
| `rename` | Yes |
| `setOnInsert` | Yes |
| `set` | Yes |
| `unset` | Yes |
| `min` | Yes |
| `max` | Yes |
| `currentDate` | Yes |

#### Array update operators

| Command | Supported |
|---------|---------|
| `$` | Yes |
| `$[]` | Yes |
| `$[\<identifier\>]` | Yes |
| `addToSet` | Yes |
| `pop` | Yes |
| `pullAll` | Yes |
| `pull` | Yes |
| `push` | Yes |
| `pushAll` | Yes |

#### Update modifiers

| Command | Supported |
|---------|---------|
| `each` | Yes |
| `slice` | Yes |
| `sort` | Yes |
| `position` | Yes |

#### Bitwise update operator

| Command | Supported |
|---------|---------|
| `bit` | Yes |
| `bitsAllSet` | No |
| `bitsAnySet` | No |
| `bitsAllClear` | No |
| `bitsAnyClear` | No |

### Geospatial operators

| Operator | Supported |
| --- | --- |
| `$geoWithin` | Yes |
| `$geoIntersects` | Yes |
| `$near` | Yes |
| `$nearSphere` | Yes |
| `$geometry` | Yes |
| `$minDistance` | Yes |
| `$maxDistance` | Yes |
| `$center` | No |
| `$centerSphere` | No |
| `$box` | No |
| `$polygon` | No |

## Sort operations

When you use the `findOneAndUpdate` operation, sort operations on a single field are supported, but sort operations on multiple fields aren't supported.

## Indexing

The API for MongoDB [supports various indexes](indexing.md) to enable sorting on multiple fields, improve query performance, and enforce uniqueness.

## GridFS

Azure Cosmos DB supports GridFS through any GridFS-compatible MongoDB driver.

## Replication

Azure Cosmos DB supports automatic, native replication at the lowest layers. This logic is extended out to achieve low-latency, global replication as well. Azure Cosmos DB doesn't support manual replication commands.

## Retryable Writes

Azure Cosmos DB doesn't yet support retryable writes. Client drivers must add `retryWrites=false` to their connection string.

## Sharding

Azure Cosmos DB supports automatic, server-side sharding. It manages shard creation, placement, and balancing automatically. Azure Cosmos DB doesn't support manual sharding commands, which means you don't have to invoke commands such as addShard, balancerStart, moveChunk etc. You only need to specify the shard key while creating the containers or querying the data.

## Sessions

Azure Cosmos DB doesn't yet support server-side sessions commands.

## Time-to-live (TTL)

Azure Cosmos DB supports a time-to-live (TTL) based on the timestamp of the document. TTL can be enabled for collections from the [Azure portal](https://portal.azure.com).

## User and role management

Azure Cosmos DB doesn't yet support users and roles. However, it supports Azure role-based access control (Azure RBAC) and read-write and read-only passwords or keys that can be obtained through the connection string pane in the [Azure portal](https://portal.azure.com).

## Write Concern

Some applications rely on a [Write Concern](https://docs.mongodb.com/manual/reference/write-concern/), which specifies the number of responses required during a write operation. Due to how Azure Cosmos DB handles replication, all writes are automatically majority quorum by default when using strong consistency. Any write concern specified by the client code is ignored. To learn more, see [Using consistency levels to maximize availability and performance](../consistency-levels.md) article.

## Next steps

- For further information check [Mongo 3.6 version features](https://devblogs.microsoft.com/cosmosdb/azure-cosmos-dbs-api-for-mongodb-now-supports-server-version-3-6/)
- Learn how to [use Studio 3T](connect-using-mongochef.md) with Azure Cosmos DB for MongoDB.
- Learn how to [use Robo 3T](connect-using-robomongo.md) with Azure Cosmos DB for MongoDB.
- Explore MongoDB [samples](nodejs-console-app.md) with Azure Cosmos DB for MongoDB.
