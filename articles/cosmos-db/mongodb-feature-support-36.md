---
title: Azure Cosmos DB's API for MongoDB (3.6 version) supported features and syntax
description: Learn about Azure Cosmos DB's API for MongoDB (3.6 version) supported features and syntax.
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: overview
ms.date: 01/15/2020
author: sivethe
ms.author: sivethe
---

# Azure Cosmos DB's API for MongoDB (3.6 version): supported features and syntax

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can communicate with the Azure Cosmos DB's API for MongoDB using any of the open-source MongoDB client [drivers](https://docs.mongodb.org/ecosystem/drivers). The Azure Cosmos DB's API for MongoDB enables the use of existing client drivers by adhering to the MongoDB [wire protocol](https://docs.mongodb.org/manual/reference/mongodb-wire-protocol).

By using the Azure Cosmos DB's API for MongoDB, you can enjoy the benefits of the MongoDB you're used to, with all of the enterprise capabilities that Cosmos DB provides: [global distribution](distribute-data-globally.md), [automatic sharding](partition-data.md), availability and latency guarantees, automatic indexing of every field, encryption at rest, backups, and much more.

## Protocol Support

The Azure Cosmos DB's API for MongoDB is compatible with MongoDB server version **3.6** by default for new accounts. The supported operators and any limitations or exceptions are listed below. Any client driver that understands these protocols should be able to connect to Azure Cosmos DB's API for MongoDB. Note that when using Azure Cosmos DB's API for MongoDB accounts, the 3.6 version of accounts have the endpoint in the format `*.mongo.cosmos.azure.com` whereas the 3.2 version of accounts have the endpoint in the format `*.documents.azure.com`.

## Query language support

Azure Cosmos DB's API for MongoDB provides comprehensive support for MongoDB query language constructs. Below you can find the detailed list of currently supported operations, operators, stages, commands, and options.

## Database commands

Azure Cosmos DB's API for MongoDB supports the following database commands:

### Query and write operation commands

|Command  |Supported |
|---------|---------|
|delete | Yes |
|find | Yes     |
|findAndModify | Yes  |
|getLastError|   Yes |
|getMore  |  Yes  |
|getPrevError | No  |
|insert  |   Yes  |
|parallelCollectionScan  | Yes   |
|resetError |	No  |
|update  |   Yes  |
|[Change streams](mongodb-change-streams.md)  |  Yes  |
|GridFS |   Yes  |

### Authentication commands

|Command  |Supported |
|---------|---------|
|authenticate    |   Yes      |
|logout    |      Yes   |
|getnonce   |    Yes     |


### Administration commands

|Command  |Supported |
|---------|---------|
|Capped Collections   |   No      |
|cloneCollectionAsCapped     |   No      |
|collMod     |   No      |
|collMod: expireAfterSeconds   |   No      |
|convertToCapped   |  No       |
|copydb     |  No       |
|create   |    Yes     |
|createIndexes     |  Yes       |
|currentOp     |  Yes       |
|drop     |   Yes      |
|dropDatabase     |  Yes       |
|dropIndexes     |   Yes      |
|filemd5    |   Yes      |
|killCursors    |  Yes       |
|killOp     |   No      |
|listCollections     |  Yes       |
|listDatabases     |  Yes       |
|listIndexes     |  Yes       |
|reIndex     |    Yes     |
|renameCollection     |    No     |
|connectionStatus    |     No    |

### Diagnostics commands

|Command  |Supported |
|---------|---------|
|buildInfo	     |   Yes      |
|collStats    |  Yes       |
|connPoolStats     |  No       |
|connectionStatus     |  No       |
|dataSize     |   No      |
|dbHash    |    No     |
|dbStats     |   Yes      |
|explain     | No        |
|explain: executionStats     |     No    |
|features     |    No     |
|hostInfo     |   No      |
|listDatabases	     |   Yes      |
|listCommands     |  No       |
|profiler     |  No       |
|serverStatus     |  No       |
|top     |    No     |
|whatsmyuri     |   Yes      |

<a name="aggregation-pipeline"/>

## Aggregation pipeline</a>

### Aggregation commands

|Command  |Supported |
|---------|---------|
|aggregate |   Yes  |
|count     |   Yes  |
|distinct  | Yes |
|mapReduce | No |

### Aggregation stages

|Command  |Supported |
|---------|---------|
|$collStats	|No|
|$project	|Yes|
|$match	|Yes|
|$redact|	Yes|
|$limit	|Yes|
|$skip	|Yes|
|$unwind|	Yes|
|$group	|	Yes|
|$sample|		Yes|
|$sort	|Yes|
|$geoNear|	No|
|$lookup	|	Yes|
|$out		|Yes|
|$indexStats|		No|
|$facet	|No|
|$bucket|	No|
|$bucketAuto|	No|
|$sortByCount|	Yes|
|$addFields	|Yes|
|$replaceRoot|	Yes|
|$count	|Yes|
|$currentOp|	No|
|$listLocalSessions	|No|
|$listSessions	|No|
|$graphLookup	|No|

### Boolean expressions

|Command  |Supported |
|---------|---------|
|$and| Yes|
|$or|Yes|
|$not|Yes|

### Set expressions

|Command  |Supported |
|---------|---------|
| $setEquals | Yes|
|$setIntersection|Yes|
| $setUnion|Yes|
| $setDifference|Yes|
| $setIsSubset|Yes|
| $anyElementTrue|Yes|
| $allElementsTrue|Yes|

### Comparison expressions

|Command  |Supported |
|---------|---------|
|$cmp     |  Yes       |
|$eq|	Yes| 
|$gt |	Yes| 
|$gte|	Yes| 
|$lt	|Yes|
|$lte|	Yes| 
|$ne	|	Yes| 
|$in	|	Yes| 
|$nin	|	Yes| 

### Arithmetic expressions

|Command  |Supported |
|---------|---------|
|$abs |  Yes       |
| $add |  Yes       |
| $ceil |  Yes       |
| $divide |  Yes       |
| $exp |  Yes       |
| $floor |  Yes       |
| $ln |  Yes       |
| $log |  Yes       |
| $log10 |  Yes       |
| $mod |  Yes       |
| $multiply |  Yes       |
| $pow |  Yes       |
| $sqrt |  Yes       |
| $subtract |  Yes       |
| $trunc |  Yes       |

### String expressions

|Command  |Supported |
|---------|---------|
|$concat |  Yes       |
| $indexOfBytes|  Yes       |
| $indexOfCP|  Yes       |
| $split|  Yes       |
| $strLenBytes|  Yes       |
| $strLenCP|  Yes       |
| $strcasecmp|  Yes       |
| $substr|  Yes       |
| $substrBytes|  Yes       |
| $substrCP|  Yes       |
| $toLower|  Yes       |
| $toUpper|  Yes       |

### Text search operator

|Command  |Supported |
|---------|---------|
| $meta | No|

### Array expressions

|Command  |Supported |
|---------|---------|
|$arrayElemAt	|	Yes|
|$arrayToObject|	Yes|
|$concatArrays	|	Yes|
|$filter	|	Yes|
|$indexOfArray	|Yes|
|$isArray	|	Yes|
|$objectToArray	|Yes|
|$range	|Yes|
|$reverseArray	|	Yes|
|$reduce|	Yes|
|$size	|	Yes|
|$slice	|	Yes|
|$zip	|	Yes|
|$in	|	Yes|

### Variable operators

|Command  |Supported |
|---------|---------|
|$map	|No|
|$let	|Yes|

### System variables

|Command  |Supported |
|---------|---------|
|$$CURRENT|	Yes|
|$$DESCEND|		Yes|
|$$KEEP		|Yes|
|$$PRUNE	|	Yes|
|$$REMOVE	|Yes|
|$$ROOT		|Yes|

### Literal operator

|Command  |Supported |
|---------|---------|
|$literal	|Yes|

### Date expressions

|Command  |Supported |
|---------|---------|
|$dayOfYear	|Yes	|
|$dayOfMonth|	Yes	|
|$dayOfWeek	|Yes	|
|$year	|Yes	|
|$month	|Yes|	
|$week	|Yes	|
|$hour	|Yes	|
|$minute|	Yes|	
|$second	|Yes	|
|$millisecond|	Yes|	
|$dateToString	|Yes	|
|$isoDayOfWeek	|Yes	|
|$isoWeek	|Yes	|
|$dateFromParts|	No|	
|$dateToParts	|No	|
|$dateFromString|	No|
|$isoWeekYear	|Yes	|

### Conditional expressions

|Command  |Supported |
|---------|---------|
| $cond| Yes|
| $ifNull| Yes|
| $switch |Yes|

### Data type operator

|Command  |Supported |
|---------|---------|
| $type| Yes|

### Accumulator expressions

|Command  |Supported |
|---------|---------|
|$sum	|Yes	|
|$avg	|Yes	|
|$first|	Yes|
|$last	|Yes	|
|$max	|Yes	|
|$min	|Yes	|
|$push|	Yes|
|$addToSet|	Yes|
|$stdDevPop|	No	|
|$stdDevSamp|	No|

### Merge operator

|Command  |Supported |
|---------|---------|
| $mergeObjects | Yes|

## Data types

|Command  |Supported |
|---------|---------|
|Double	|Yes	|
|String	|Yes	|
|Object	|Yes	|
|Array	|Yes	|
|Binary Data	|Yes|	
|ObjectId	|Yes	|
|Boolean	|Yes	|
|Date	|Yes	|
|Null	|Yes	|
|32-bit Integer (int)	|Yes	|
|Timestamp	|Yes	|
|64-bit Integer (long)	|Yes	|
|MinKey	|Yes	|
|MaxKey	|Yes	|
|Decimal128	|Yes|	
|Regular Expression	|Yes|
|JavaScript	|Yes|
|JavaScript (with scope)|	Yes	|
|Undefined	|Yes	|

## Indexes and index properties

### Indexes

|Command  |Supported |
|---------|---------|
|Single Field Index	|Yes	|
|Compound Index	|Yes	|
|Multikey Index	|Yes	|
|Text Index	|No|
|2dsphere	|Yes	|
|2d Index	|No	|
|Hashed Index	| Yes|

### Index properties

|Command  |Supported |
|---------|---------|
|TTL|	Yes	|
|Unique	|Yes|
|Partial|	No|
|Case Insensitive	|No|
|Sparse	|No |
|Background|	Yes |

## Operators

### Logical operators

|Command  |Supported |
|---------|---------|
|$or	|	Yes|
|$and	|	Yes|
|$not	|	Yes|
|$nor	|	Yes| 

### Element operators

|Command  |Supported |
|---------|---------|
|$exists|	Yes|
|$type	|	Yes|

### Evaluation query operators

|Command  |Supported |
|---------|---------|
|$expr	|	No|
|$jsonSchema	|	No|
|$mod	|	Yes|
|$regex |	Yes|
|$text	| No (Not supported. Use $regex instead.)| 
|$where	|No| 

In the $regex queries, left-anchored expressions allow index search. However, using 'i' modifier (case-insensitivity) and 'm' modifier (multiline) causes the collection scan in all expressions.

When there's a need to include '$' or '|', it is best to create two (or more) regex queries. For example, given the following original query: ```find({x:{$regex: /^abc$/})```, it has to be modified as follows:

```find({x:{$regex: /^abc/, x:{$regex:/^abc$/}})```.

The first part will use the index to restrict the search to those documents beginning with ^abc and the second part will match the exact entries. The bar operator '|' acts as an "or" function - the query ```find({x:{$regex: /^abc|^def/})``` matches the documents in which field 'x' has values that begin with "abc" or "def". To utilize the index, it's recommended to break the query into two different queries joined by the $or operator: ```find( {$or : [{x: $regex: /^abc/}, {$regex: /^def/}] })```.

### Array operators

|Command  |Supported | 
|---------|---------|
| $all | Yes| 
| $elemMatch | Yes| 
| $size | Yes | 

### Comment operator

|Command  |Supported | 
|---------|---------|
$comment |Yes| 

### Projection operators

|Command  |Supported |
|---------|---------|
|$elemMatch	|Yes|
|$meta|	No|
|$slice	| Yes|

### Update operators

#### Field update operators

|Command  |Supported |
|---------|---------|
|$inc	|	Yes|
|$mul	|	Yes|
|$rename	|	Yes|
|$setOnInsert|	Yes|
|$set	|Yes|
|$unset| Yes|
|$min	|Yes|
|$max	|Yes|
|$currentDate	| Yes|

#### Array update operators

|Command  |Supported |
|---------|---------|
|$	|Yes|
|$[]|	Yes|
|$[<identifier>]|	Yes|
|$addToSet	|Yes|
|$pop	|Yes|
|$pullAll|	Yes|
|$pull	|Yes|
|$push	|Yes|
|$pushAll| Yes|


#### Update modifiers

|Command  |Supported |
|---------|---------|
|$each	|	Yes|
|$slice	|Yes|
|$sort	|Yes|
|$position	|Yes|

#### Bitwise update operator

|Command  |Supported |
|---------|---------|
| $bit	|	Yes|	
|$bitsAllSet	|	No|
|$bitsAnySet	|	No|
|$bitsAllClear	|No|
|$bitsAnyClear	|No|

### Geospatial operators

Operator | Supported| 
--- | --- |
$geoWithin | Yes |
$geoIntersects | Yes | 
$near |  Yes |
$nearSphere |  Yes |
$geometry |  Yes |
$minDistance | Yes |
$maxDistance | Yes |
$center | Yes |
$centerSphere | Yes |
$box | Yes |
$polygon |  Yes |

## Cursor methods

|Command  |Supported |
|---------|---------|
|cursor.batchSize()	|	Yes|
|cursor.close()	|Yes|
|cursor.isClosed()|		Yes|
|cursor.collation()|	No|
|cursor.comment()	|Yes|
|cursor.count()	|Yes|
|cursor.explain()|	No|
|cursor.forEach()	|Yes|
|cursor.hasNext()	|Yes|
|cursor.hint()	|Yes|
|cursor.isExhausted()|	Yes|
|cursor.itcount()	|Yes|
|cursor.limit()	|Yes|
|cursor.map()	|Yes|
|cursor.maxScan()	|Yes|
|cursor.maxTimeMS()|	Yes|
|cursor.max()	|Yes|
|cursor.min()	|Yes|
|cursor.next()|	Yes|
|cursor.noCursorTimeout()	|No|
|cursor.objsLeftInBatch()	|Yes|
|cursor.pretty()|	Yes|
|cursor.readConcern()|	Yes|
|cursor.readPref()		|Yes|
|cursor.returnKey()	|No|
|cursor.showRecordId()|	No|
|cursor.size()	|Nes|
|cursor.skip()	|Yes|
|cursor.sort()	|	Yes|
|cursor.tailable()|	No|
|cursor.toArray()	|Yes|

## Sort operations

When using the `findOneAndUpdate` operation, sort operations on a single field are supported but sort operations on multiple fields are not supported.

## Unique indexes

Unique indexes ensure that a specific field doesn’t have duplicate values across all documents in a collection, similar to the way uniqueness is preserved on the default "_id" key. You can create custom indexes in Cosmos DB by using the createIndex command, including the 'unique’ constraint.

## Time-to-live (TTL)

Cosmos DB supports a time-to-live (TTL) based on the timestamp of the document. TTL can be enabled for collections by going to the [Azure portal](https://portal.azure.com).

## User and role management

Cosmos DB does not yet support users and roles. However, Cosmos DB supports role-based access control (RBAC) and read-write and read-only passwords/keys that can be obtained through the [Azure portal](https://portal.azure.com) (Connection String page).

## Replication

Cosmos DB supports automatic, native replication at the lowest layers. This logic is extended out to achieve low-latency, global replication as well. Cosmos DB does not support manual replication commands.

## Write Concern

Some applications rely on a [Write Concern](https://docs.mongodb.com/manual/reference/write-concern/) which specifies the number of responses required during a write operation. Due to how Cosmos DB handles replication in the background all writes are all automatically Quorum by default. Any write concern specified by the client code is ignored. Learn more in [Using consistency levels to maximize availability and performance](consistency-levels.md).

## Sharding

Azure Cosmos DB supports automatic, server-side sharding. It manages shard creation, placement, and balancing automatically. Azure Cosmos DB does not support manual sharding commands, which means you don't have to invoke commands such as addShard, balancerStart, moveChunk etc. You only need to specify the shard key while creating the containers or querying the data.

## Sessions

Azure Cosmos DB does not yet support server side sessions commands.

## Next steps

- For further information check [Mongo 3.6 version features](https://devblogs.microsoft.com/cosmosdb/azure-cosmos-dbs-api-for-mongodb-now-supports-server-version-3-6/)
- Learn how to [use Studio 3T](mongodb-mongochef.md) with Azure Cosmos DB's API for MongoDB.
- Learn how to [use Robo 3T](mongodb-robomongo.md) with Azure Cosmos DB's API for MongoDB.
- Explore MongoDB [samples](mongodb-samples.md) with Azure Cosmos DB's API for MongoDB.

<sup>Note: This article describes a feature of Azure Cosmos DB that provides wire protocol compatibility with MongoDB databases. Microsoft does not run MongoDB databases to provide this service. Azure Cosmos DB is not affiliated with MongoDB, Inc.</sup>
