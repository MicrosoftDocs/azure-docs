---
title: 4.0 server version supported features and syntax in Azure Cosmos DB's API for MongoDB 
description: Learn about Azure Cosmos DB's API for MongoDB 4.0 server version supported features and syntax. Learn about the database commands, query language support, datatypes, aggregation pipeline commands, and operators supported.
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: overview
ms.date: 03/02/2021
author: gahl-levy
ms.author: gahllevy
---

# Azure Cosmos DB's API for MongoDB (4.0 server version): supported features and syntax
[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can communicate with the Azure Cosmos DB's API for MongoDB using any of the open-source MongoDB client [drivers](https://docs.mongodb.org/ecosystem/drivers). The Azure Cosmos DB's API for MongoDB enables the use of existing client drivers by adhering to the MongoDB [wire protocol](https://docs.mongodb.org/manual/reference/mongodb-wire-protocol).

By using the Azure Cosmos DB's API for MongoDB, you can enjoy the benefits of the MongoDB you're used to, with all of the enterprise capabilities that Cosmos DB provides: [global distribution](distribute-data-globally.md), [automatic sharding](partitioning-overview.md), availability and latency guarantees, encryption at rest, backups, and much more.

## Protocol Support

The supported operators and any limitations or exceptions are listed below. Any client driver that understands these protocols should be able to connect to Azure Cosmos DB's API for MongoDB. When using Azure Cosmos DB's API for MongoDB accounts, the 3.6+ versions of accounts have the endpoint in the format `*.mongo.cosmos.azure.com` whereas the 3.2 version of accounts has the endpoint in the format `*.documents.azure.com`.

> [!NOTE]
> This article only lists the supported server commands and excludes client-side wrapper functions. Client-side wrapper functions such as `deleteMany()` and `updateMany()` internally utilize the `delete()` and `update()` server commands. Functions utilizing supported server commands are compatible with Azure Cosmos DB's API for MongoDB.

## Query language support

Azure Cosmos DB's API for MongoDB provides comprehensive support for MongoDB query language constructs. Below you can find the detailed list of currently supported operations, operators, stages, commands, and options.

## Database commands

Azure Cosmos DB's API for MongoDB supports the following database commands:

### Query and write operation commands

| Command | Supported |
|---------|---------|
| [change streams](mongodb-change-streams.md) | Yes |
| delete | Yes |
| eval | No |
| find | Yes |
| findAndModify | Yes |
| getLastError | Yes |
| getMore | Yes |
| getPrevError | No |
| insert | Yes |
| parallelCollectionScan | No |
| resetError | No |
| update | Yes |

### Transaction commands

| Command | Supported |
|---------|---------|
| abortTransaction | Yes |
| commitTransaction | Yes |

### Authentication commands

| Command | Supported |
|---------|---------|
| authenticate | Yes |
| getnonce | Yes |
| logout | Yes |

### Administration commands

| Command | Supported |
|---------|---------|
| cloneCollectionAsCapped | No |
| collMod | No |
| connectionStatus | No |
| convertToCapped | No |
| copydb | No |
| create | Yes |
| createIndexes | Yes |
| currentOp | Yes |
| drop | Yes |
| dropDatabase | Yes |
| dropIndexes | Yes |
| filemd5 | Yes |
| killCursors | Yes |
| killOp | No |
| listCollections | Yes |
| listDatabases | Yes |
| listIndexes | Yes |
| reIndex | Yes |
| renameCollection | No |

### Diagnostics commands

| Command | Supported |
|---------|---------|
| buildInfo | Yes |
| collStats | Yes |
| connPoolStats | No |
| connectionStatus | No |
| dataSize | No |
| dbHash | No |
| dbStats | Yes |
| explain | Yes |
| features | No |
| hostInfo | Yes |
| listDatabases | Yes |
| listCommands | No |
| profiler | No |
| serverStatus | No |
| top | No |
| whatsmyuri | Yes |

## <a name="aggregation-pipeline"></a>Aggregation pipeline

### Aggregation commands

| Command | Supported |
|---------|---------|
| aggregate | Yes |
| count | Yes |
| distinct | Yes |
| mapReduce | No |

### Aggregation stages

| Command | Supported |
|---------|---------|
| $addFields | Yes |
| $bucket | No |
| $bucketAuto | No |
| $changeStream | Yes |
| $collStats | No |
| $count | Yes |
| $currentOp | No |
| $facet | Yes |
| $geoNear | Yes |
| $graphLookup | Yes |
| $group | Yes |
| $indexStats | No |
| $limit | Yes |
| $listLocalSessions | No |
| $listSessions | No |
| $lookup | Partial |
| $match | Yes |
| $out | Yes |
| $project | Yes |
| $redact | Yes |
| $replaceRoot | Yes |
| $replaceWith | No |
| $sample | Yes |
| $skip | Yes |
| $sort | Yes |
| $sortByCount | Yes |
| $unwind | Yes |

> [!NOTE]
> `$lookup` does not yet support the [uncorrelated subqueries](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#join-conditions-and-uncorrelated-sub-queries) feature introduced in server version 3.6. You will receive an error with a message containing `let is not supported` if you attempt to use the `$lookup` operator with `let` and `pipeline` fields.

### Boolean expressions

| Command | Supported |
|---------|---------|
| $and | Yes |
| $not | Yes |
| $or | Yes |

### Conversion expressions

| Command | Supported |
|---------|---------|
| $convert | Yes |
| $toBool | Yes |
| $toDate | Yes |
| $toDecimal | Yes |
| $toDouble | Yes |
| $toInt | Yes |
| $toLong | Yes |
| $toObjectId | Yes |
| $toString | Yes |

### Set expressions

| Command | Supported |
|---------|---------|
| $setEquals | Yes |
| $setIntersection | Yes |
| $setUnion | Yes |
| $setDifference | Yes |
| $setIsSubset | Yes |
| $anyElementTrue | Yes |
| $allElementsTrue | Yes |

### Comparison expressions

| Command | Supported |
|---------|---------|
| $cmp | Yes |
| $eq | Yes | 
| $gt | Yes | 
| $gte | Yes | 
| $lt | Yes |
| $lte | Yes | 
| $ne | Yes | 
| $in | Yes | 
| $nin | Yes | 

### Arithmetic expressions

| Command | Supported |
|---------|---------|
| $abs | Yes |
| $add | Yes |
| $ceil | Yes |
| $divide | Yes |
| $exp | Yes |
| $floor | Yes |
| $ln | Yes |
| $log | Yes |
| $log10 | Yes |
| $mod | Yes |
| $multiply | Yes |
| $pow | Yes |
| $sqrt | Yes |
| $subtract | Yes |
| $trunc | Yes |

### String expressions

| Command | Supported |
|---------|---------|
| $concat | Yes |
| $indexOfBytes | Yes |
| $indexOfCP | Yes |
| $ltrim | Yes |
| $rtrim | Yes |
| $trim | Yes |
| $split | Yes |
| $strLenBytes | Yes |
| $strLenCP | Yes |
| $strcasecmp | Yes |
| $substr | Yes |
| $substrBytes | Yes |
| $substrCP | Yes |
| $toLower | Yes |
| $toUpper | Yes |

### Text search operator

| Command | Supported |
|---------|---------|
| $meta | No |

### Array expressions

| Command | Supported |
|---------|---------|
| $arrayElemAt | Yes |
| $arrayToObject | Yes |
| $concatArrays | Yes |
| $filter | Yes |
| $indexOfArray | Yes |
| $isArray | Yes |
| $objectToArray | Yes |
| $range | Yes |
| $reverseArray | Yes |
| $reduce | Yes |
| $size | Yes |
| $slice | Yes |
| $zip | Yes |
| $in | Yes |

### Variable operators

| Command | Supported |
|---------|---------|
| $map | Yes |
| $let | Yes |

### System variables

| Command | Supported |
|---------|---------|
| $$CURRENT | Yes |
| $$DESCEND | Yes |
| $$KEEP | Yes |
| $$PRUNE | Yes |
| $$REMOVE | Yes |
| $$ROOT | Yes |

### Literal operator

| Command | Supported |
|---------|---------|
| $literal | Yes |

### Date expressions

| Command | Supported |
|---------|---------|
| $dayOfYear | Yes |
| $dayOfMonth | Yes |
| $dayOfWeek | Yes |
| $year | Yes |
| $month | Yes | 
| $week | Yes |
| $hour | Yes |
| $minute | Yes | 
| $second | Yes |
| $millisecond | Yes | 
| $dateToString | Yes |
| $isoDayOfWeek | Yes |
| $isoWeek | Yes |
| $dateFromParts | No | 
| $dateToParts | No |
| $dateFromString | No |
| $isoWeekYear | Yes |

### Conditional expressions

| Command | Supported |
|---------|---------|
| $cond | Yes |
| $ifNull | Yes |
| $switch | Yes |

### Data type operator

| Command | Supported |
|---------|---------|
| $type | Yes |

### Accumulator expressions

| Command | Supported |
|---------|---------|
| $sum | Yes |
| $avg | Yes |
| $first | Yes |
| $last | Yes |
| $max | Yes |
| $min | Yes |
| $push | Yes |
| $addToSet | Yes |
| $stdDevPop | Yes |
| $stdDevSamp | Yes |

### Merge operator

| Command | Supported |
|---------|---------|
| $mergeObjects | Yes |

## Data types

Azure Cosmos DB's API for MongoDB supports documents encoded in MongoDB BSON format. The 4.0 API version enhances the internal usage of this format to improve performance and reduce costs. Documents written or updated through an endpoint running 4.0 benefit from this.
 
In an [upgrade scenario](mongodb-version-upgrade.md), documents written prior to the upgrade to version 4.0 will not benefit from the enhanced performance until they are updated via a write operation through the 4.0 endpoint.

| Command | Supported |
|---------|---------|
| Double | Yes |
| String | Yes |
| Object | Yes |
| Array | Yes |
| Binary Data | Yes | 
| ObjectId | Yes |
| Boolean | Yes |
| Date | Yes |
| Null | Yes |
| 32-bit Integer (int) | Yes |
| Timestamp | Yes |
| 64-bit Integer (long) | Yes |
| MinKey | Yes |
| MaxKey | Yes |
| Decimal128 | Yes | 
| Regular Expression | Yes |
| JavaScript | Yes |
| JavaScript (with scope)| Yes |
| Undefined | Yes |

## Indexes and index properties

### Indexes

| Command | Supported |
|---------|---------|
| Single Field Index | Yes |
| Compound Index | Yes |
| Multikey Index | Yes |
| Text Index | No |
| 2dsphere | Yes |
| 2d Index | No |
| Hashed Index | Yes |

### Index properties

| Command | Supported |
|---------|---------|
| TTL | Yes |
| Unique | Yes |
| Partial | No |
| Case Insensitive | No |
| Sparse | No |
| Background | Yes |

## Operators

### Logical operators

| Command | Supported |
|---------|---------|
| $or | Yes |
| $and | Yes |
| $not | Yes |
| $nor | Yes | 

### Element operators

| Command | Supported |
|---------|---------|
| $exists | Yes |
| $type | Yes |

### Evaluation query operators

| Command | Supported |
|---------|---------|
| $expr | No |
| $jsonSchema | No |
| $mod | Yes |
| $regex | Yes |
| $text | No (Not supported. Use $regex instead.)| 
| $where | No | 

In the $regex queries, left-anchored expressions allow index search. However, using 'i' modifier (case-insensitivity) and 'm' modifier (multiline) causes the collection scan in all expressions.

When there's a need to include '$' or '|', it is best to create two (or more) regex queries. For example, given the following original query: `find({x:{$regex: /^abc$/})`, it has to be modified as follows:

`find({x:{$regex: /^abc/, x:{$regex:/^abc$/}})`

The first part will use the index to restrict the search to those documents beginning with ^abc and the second part will match the exact entries. The bar operator '|' acts as an "or" function - the query `find({x:{$regex: /^abc |^def/})` matches the documents in which field 'x' has values that begin with "abc" or "def". To utilize the index, it's recommended to break the query into two different queries joined by the $or operator: `find( {$or : [{x: $regex: /^abc/}, {$regex: /^def/}] })`.

### Array operators

| Command | Supported | 
|---------|---------|
| $all | Yes | 
| $elemMatch | Yes | 
| $size | Yes | 

### Comment operator

| Command | Supported | 
|---------|---------|
| $comment | Yes | 

### Projection operators

| Command | Supported |
|---------|---------|
| $elemMatch | Yes |
| $meta | No |
| $slice | Yes |

### Update operators

#### Field update operators

| Command | Supported |
|---------|---------|
| $inc | Yes |
| $mul | Yes |
| $rename | Yes |
| $setOnInsert | Yes |
| $set | Yes |
| $unset | Yes |
| $min | Yes |
| $max | Yes |
| $currentDate | Yes |

#### Array update operators

| Command | Supported |
|---------|---------|
| $ | Yes |
| $[]| Yes |
| $[<identifier>]| Yes |
| $addToSet | Yes |
| $pop | Yes |
| $pullAll | Yes |
| $pull | Yes |
| $push | Yes |
| $pushAll | Yes |

#### Update modifiers

| Command | Supported |
|---------|---------|
| $each | Yes |
| $slice | Yes |
| $sort | Yes |
| $position | Yes |

#### Bitwise update operator

| Command | Supported |
|---------|---------|
| $bit | Yes | 
| $bitsAllSet | No |
| $bitsAnySet | No |
| $bitsAllClear | No |
| $bitsAnyClear | No |

### Geospatial operators

Operator | Supported | 
--- | --- |
$geoWithin | Yes |
$geoIntersects | Yes | 
$near | Yes |
$nearSphere | Yes |
$geometry | Yes |
$minDistance | Yes |
$maxDistance | Yes |
$center | No |
$centerSphere | No |
$box | No |
$polygon | No |

## Sort operations

When using the `findOneAndUpdate` operation, sort operations on a single field are supported but sort operations on multiple fields are not supported.

## Unique indexes

[Unique indexes](mongodb-indexing.md#unique-indexes) ensure that a specific field doesn't have duplicate values across all documents in a collection, similar to the way uniqueness is preserved on the default "_id" key. You can create unique indexes in Azure Cosmos DB by using the `createIndex` command with the `unique` constraint parameter:

```javascript
globaldb:PRIMARY> db.coll.createIndex( { "amount" : 1 }, {unique:true} )
{
    "_t" : "CreateIndexesResponse",
    "ok" : 1,
    "createdCollectionAutomatically" : false,
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 4
}
```

## Compound indexes

[Compound indexes](mongodb-indexing.md#compound-indexes-mongodb-server-version-36) provide a way to create an index for groups of fields for up to eight fields. This type of index differs from the native MongoDB compound indexes. In Azure Cosmos DB, compound indexes are used for sorting operations that are applied to multiple fields. To create a compound index, you need to specify more than one property as the parameter:

```javascript
globaldb:PRIMARY> db.coll.createIndex({"amount": 1, "other":1})
{
    "createdCollectionAutomatically" : false, 
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok" : 1
}
```

## GridFS

Azure Cosmos DB supports GridFS through any GridFS-compatible Mongo driver.

## Replication

Azure Cosmos DB supports automatic, native replication at the lowest layers. This logic is extended out to achieve low-latency, global replication as well. Cosmos DB does not support manual replication commands.

## Retryable Writes

Cosmos DB does not yet support retryable writes. Client drivers must add the 'retryWrites=false' URL parameter to their connection string. More URL parameters can be added by prefixing them with an '&'. 

## Sharding

Azure Cosmos DB supports automatic, server-side sharding. It manages shard creation, placement, and balancing automatically. Azure Cosmos DB does not support manual sharding commands, which means you don't have to invoke commands such as addShard, balancerStart, moveChunk etc. You only need to specify the shard key while creating the containers or querying the data.

## Sessions

Azure Cosmos DB does not yet support server-side sessions commands.

## Time-to-live (TTL)

Azure Cosmos DB supports a time-to-live (TTL) based on the timestamp of the document. TTL can be enabled for collections by going to the [Azure portal](https://portal.azure.com).

## Transactions

Multi-document transactions are supported within an unsharded collection. Multi-document transactions are not supported across collections or in sharded collections. The timeout for transactions is a fixed 5 seconds.

## User and role management

Azure Cosmos DB does not yet support users and roles. However, Cosmos DB supports Azure role-based access control (Azure RBAC) and read-write and read-only passwords/keys that can be obtained through the [Azure portal](https://portal.azure.com) (Connection String page).

## Write Concern

Some applications rely on a [Write Concern](https://docs.mongodb.com/manual/reference/write-concern/), which specifies the number of responses required during a write operation. Due to how Cosmos DB handles replication in the background all writes are all automatically Quorum by default. Any write concern specified by the client code is ignored. Learn more in [Using consistency levels to maximize availability and performance](consistency-levels.md).

## Next steps

- Learn how to [use Studio 3T](mongodb-mongochef.md) with Azure Cosmos DB's API for MongoDB.
- Learn how to [use Robo 3T](mongodb-robomongo.md) with Azure Cosmos DB's API for MongoDB.
- Explore MongoDB [samples](mongodb-samples.md) with Azure Cosmos DB's API for MongoDB.
