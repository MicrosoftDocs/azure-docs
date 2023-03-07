---
title: Compatibility and feature support
titleSuffix: Azure Cosmos DB for MongoDB (vCore)
description: Learn about Azure Cosmos DB for MongoDB vCore supported features and syntax. Learn about the database commands, query language support, datatypes, aggregation pipeline commands, and operators supported.
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
author: nayakshweta
ms.author: shwetn
ms.reviewer: gahllevy
ms.date: 03/02/2023
---

# MongoDB compatibility and feature support with Azure Cosmos DB for MongoDB (vCore)

Azure Cosmos DB is Microsoft's fully managed NoSQL and relational database, offering [multiple database APIs](../choose-api.md). You can communicate with Azure Cosmos DB for MongoDB using the MongoDB drivers, SDKs and tools you are already familiar with. Azure Cosmos DB for MongoDB enables the use of existing client drivers by adhering to the MongoDB wire protocol.

By using the Azure Cosmos DB for MongoDB, you can enjoy the benefits of the MongoDB you're used to, with all of the enterprise capabilities that Azure Cosmos DB provides.

## Protocol Support

The supported operators and any limitations or exceptions are listed below. Any client driver that understands these protocols should be able to connect to Azure Cosmos DB for MongoDB. When you create Azure Cosmos DB for MongoDB vCore clusters, the endpoint are in the format `*.mongocluster.cosmos.azure.com`.

> [!NOTE]
> This article only lists the supported server commands, and excludes client-side wrapper functions. Client-side wrapper functions such as `deleteMany()` and `updateMany()` internally utilize the `delete()` and `update()` server commands. Functions utilizing supported server commands are compatible with the Azure Cosmos DB for MongoDB.

## Query language support

Azure Cosmos DB for MongoDB provides comprehensive support for MongoDB query language constructs. Below you can find the detailed list of currently supported operations, operators, stages, commands, and options.

## Database commands

Azure Cosmos DB for MongoDB supports the following database commands:

### Query and write operation commands

| Command | Supported |
|---------|---------|
| `change streams` | No |
| `delete` | Yes |
| `find` | Yes |
| `findAndModify` | Yes |
| `getLastError` | No |
| `getMore` | Partial |
| `insert` | Yes |
| `resetError` | No |
| `update` | Yes |

### Session commands

| Command | Supported |
|---------|---------|
| `abortTransaction` | Yes |
| `commitTransaction` | Yes |
| `endSessions` | No |
| `killAllSessions` | No |
| `killAllSessionsByPattern` | No |
| `killSessions` | No |
| `refreshSessions` | No |
| `startSession` | Yes |

### Authentication commands

| Command | Supported |
|---------|---------|
| `authenticate` | No |
| `getnonce` | No |
| `logout` | Yes |

### Geospatial command

| Command | Supported |
|---------|---------|
| `geoSearch` | No |

### Query Plan Cache commands

| Command | Supported |
|---------|---------|
| `planCacheClear` | No |
| `planCacheClearFilters` | No |
| `planCacheListFilters` | No |
| `planCacheSetFilter` | No |

### Administration commands

| Command | Supported |
|---------|---------|
| `cloneCollectionAsCapped` | No |
| `collMod` | No |
| `compact` | No |
| `connPoolSync` | No |
| `convertToCapped` | No |
| `create` | No |
| `createIndexes` | Yes |
| `currentOp` | No |
| `drop` | Yes |
| `dropDatabase` | Yes |
| `dropConnections` | No |
| `dropIndexes` |Yes |
| `filemd5` | No |
| `fsync` | No |
| `fsyncUnlock` | No |
| `getDefaultRWConcern` | No |
| `getClusterParameter` | No |
| `getParameter` | No |
| `killCursors`  |Yes |
| `killOp` | No |
| `listCollections` |Yes |
| `listDatabases`  |Yes |
| `listIndexes` |Yes |
| `logRotate` | No |
| `reIndex` | No |
| `renameCollection` |Yes |
| `rotateCertificates` | No |
| `setFeatureCompatibilityVersion` | No |
| `setIndexCommitQuorum` | No |
| `setParameter` | No |
| `setDefaultRWConcern` | No |
| `shutdown` | No |

### User Management commands

| Command | Supported |
|---------|---------|
| `createUser` | No |
| `dropAllUsersFromDatabase` | No |
| `dropUser` | No |
| `grantRolesToUser` | No |
| `revokeRolesFromUser` | No |
| `updateUser` | No |
| `usersInfo` | No |

### Role Management commands

| Command | Supported |
|---------|---------|
| `createRole` | No |
| `dropRole` | No |
| `dropAllRolesFromDatabase` | No |
| `grantPrivilegesToRole` | No |
| `grantRolesToRole` | No |
| `invalidateUserCache` | No |
| `revokePrivilegesFromRole` | No |
| `revokeRolesFromRole` | No |
| `rolesInfo` | No |
| `updateRole` | No |

### Replication commands

| Command | Supported |
|---------|---------|
| `applyOps` | No |
| `hello` | Yes |
| `replSetAbortPrimaryCatchUp` | No |
| `replSetFreeze` | No |
| `replSetGetConfig` | No |
| `replSetGetStatus` | No |
| `replSetInitiate` | No |
| `replSetMaintenance` | No |
| `replSetReconfig` | No |
| `replSetResizeOplog` | No |
| `replSetStepDown` | No |
| `replSetSyncFrom` | No |

### Sharding commands

| Command | Supported |
|---------|---------|
| `abortReshardCollection` | No |
| `addShard` | No |
| `addShardToZone` | No |
| `balancerCollectionStatus` | No |
| `balancerStart` | No |
| `balancerStatus` | No |
| `balancerStop` | No |
| `checkShardingIndex` | No |
| `clearJumboFlag` | No |
| `cleanupOrphaned` | No |
| `cleanupReshardCollection` | No |
| `commitReshardCollection` | No |
| `configureCollectionBalancing` | No |
| `enableSharding` | Yes |
| `flushRouterConfig` | No |
| `getShardMap` | No |
| `getShardVersion` | No |
| `isdbgrid` | No |
| `listShards` | No |
| `medianKey` | No |
| `moveChunk` | No |
| `movePrimary` | No |
| `mergeChunks` | No |
| `refineCollectionShardKey` | No |
| `removeShard` | No |
| `removeShardFromZone` | No |
| `reshardCollection` | No |
| `setShardVersion` | No |
| `shardCollection` | Yes |
| `shardingState` | No |
| `split` | No |
| `splitVector` | No |
| `unsetSharding` | No |
| `updateZoneKeyRange` | No |

### Diagnostics commands

| Command | Supported |
|---------|---------|
| `availableQueryOptions` | No |
| `buildInfo`| Yes |
| `collStats` | No |
| `connPoolStats` | No |
| `connectionStatus` | No |
| `cursorInfo` | No |
| `dataSize` | No |
| `dbHash` | No |
| `dbStats` | No |
| `driverOIDTest` | No |
| `explain`| Yes |
| `features` | No |
| `getCmdLineOpts` | No |
| `getLog`| Yes |
| `hostInfo` | No |
| `_isSelf` | No |
| `listCommands` | No |
| `lockInfo` | No |
| `netstat` | No |
| `ping`| Yes |
| `profile` | No |
| `serverStatus` | No |
| `shardConnPoolStats` | No |
| `top` | No |
| `validate`| Yes |
| `whatsmyuri`| Yes |

### Free Monitoring Commands

| Command | Supported |
|---------|---------|
| `getFreeMonitoringStatus` | No |
| `setFreeMonitoring` | No |

### Auditing command

| Command | Supported |
|---------|---------|
| `logApplicationMessage` | No |

## <a name="aggregation-pipeline"></a>Aggregation pipeline

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
| `$addFields` | Yes |
| `$bucket` | No |
| `$bucketAuto` | No |
| `$changeStream` | No |
| `$count` | Yes |
| `$currentOp` | No |
| `$facet` | No |
| `$geoNear` | No |
| `$graphLookup` | No |
| `$group` | Yes |
| `$indexStats` | No |
| `$limit` | Yes |
| `$listLocalSessions` | No |
| `$listSessions` | No |
| `$lookup` | Yes |
| `$match` | Yes |
| `$merge` | No |
| `$out` | No |
| `$planCacheStats` | No |
| `$project` | Yes |
| `$redact` | No |
| `$regexFind` | No |
| `$regexFindAll` | No |
| `$regexMatch` | No |
| `$replaceRoot` | Yes |
| `$replaceWith` | Yes |
| `$sample` |Yes |
| `$set` | Yes |
| `$skip` | Yes |
| `$sort` | Yes |
| `$sortByCount` | Yes |
| `$unset` | Yes |
| `$unwind` | Yes |

> [!NOTE]
> The `$lookup` aggregation does not yet support the [uncorrelated subqueries](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#join-conditions-and-uncorrelated-sub-queries) feature introduced in server version 3.6. You will receive an error with a message containing `let is not supported` if you attempt to use the `$lookup` operator with `let` and `pipeline` fields.

### Boolean expressions

| Command | Supported |
|---------|---------|
| `and` | Yes |
| `not` | Yes |
| `or` | Yes |

### Type expressions

| Command | Supported |
|---------|---------|
| `$type` | No |
| `$toLong` | No |
| `$toString` | No |
| `$convert` | No |
| `$toDate` | No |
| `$toDecimal` | No |
| `$toObjectId` | No |
| `$toDouble` | No |
| `$toBool` | No |
| `$toInt` | No |
| `$isNumber` | No |

### Set expressions

| Command | Supported |
|---------|---------|
| `$anyElementTrue` | No |
| `$setUnion` | No |
| `$allElementsTrue` | No |
| `$setIntersection` | No |
| `$setDifference` | No |
| `$setEquals` | No |
| `$setIsSubset` | No |

### Comparison expressions

| Command | Supported |
|---------|---------|
| `$ne` | Yes |
| `$lte` | Yes |
| `$gt` | Yes |
| `$gte` | Yes |
| `$lt` | Yes |
| `$eq` | Yes |
| `$cmp` | Yes |

### Custom Aggregation expressions

| Command | Supported |
|---------|---------|
| `$accumulator` | No |
| `$function` | No |

### Data size Operators

| Command | Supported |
|---------|---------|
| `$binarySize` | No |
| `$bsonSize` | No |

### Arithmetic expressions

| Command | Supported |
|---------|---------|
| `$add` | Yes |
| `$multiply` | Yes |
| `$subtract` | Yes |
| `$divide` | Yes |
| `$ceil` | Yes |
| `$floor` | Yes |
| `$trunc` | No |
| `$abs` | Yes |
| `$mod` | Yes |
| `$pow` | Yes |
| `$sqrt` | Yes |
| `$exp` | Yes |
| `$ln` | Yes |
| `$log` | Yes |
| `$log10` | Yes |
| `$round` | No |


### Timestamp expressions

| Command | Supported |
|---------|---------|
| `$tsIncrement` No |
| `$tsSecond` No |

### Trigonometry expressions

| Command | Supported |
|---------|---------|
| `$sin` | No |
| `$cos` | No |
| `$tan` | No |
| `$asin` | No |
| `$acos` | No |
| `$atan` | No |
| `$atan2` | No |
| `$asinh` | No |
| `$acosh` | No |
| `$atanh` | No |
| `$sinh` | No |
| `$cosh` | No |
| `$tanh` | No |
| `$degreesToRadians` | No |
| `$radiansToDegrees` | No |

### String expressions

| Command | Supported |
|---------|---------|
| `$concat` | No |
| `$dateToString` | No |
| `$toLower` | No |
| `$toString` | No |
| `$substr` | No |
| `$split` | No |
| `$strLenCP` | No |
| `$toUpper` | No |
| `$indexOfCP` | No |
| `$substrCP` | No |
| `$ltrim` | No |
| `$substrBytes` | No |
| `$indexOfBytes` | No |
| `$trim` | No |
| `$strLenBytes` | No |
| `$dateFromString` | No |
| `$regexFind` | No |
| `$regexFindAll` | No |
| `$regexMatch` | No |
| `$replaceOne` | No |
| `$replaceAll` | No |
| `$rtrim` | No |
| `$strcasecmp` | No |

### Text expression Operator

| Command | Supported |
|---------|---------|
| `$meta` | No |

### Array expressions

| Command | Supported |
|---------|---------|
| `$in` | Yes |
| `$size` | Yes |
| `$arrayElemAt` | Yes |
| `$slice` | Yes |
| `$filter` | No |
| `$map` | No |
| `$objectToArray` | No |
| `$arrayToObject` | No |
| `$reduce` | No |
| `$indexOfArray` | No |
| `$concatArrays` | No |
| `$isArray` | Yes |
| `$zip` | No |
| `$reverseArray` | No |
| `$range` | No |
| `$first` | Yes |
| `$firstN` | No |
| `$last` | Yes |
| `$lastN` | No |
| `$maxN` | No |
| `$minN` | No |
| `$sortArray` | No |

### Variable operator

| Command | Supported |
|---------|---------|
| `$let` | No |

### System variables

| Command | Supported |
|---------|---------|
| `$$CLUSTERTIME` | No |
| `$$CURRENT` | No |
| `$$DESCEND` | No |
| `$$KEEP` | No |
| `$$NOW` | No |
| `$$PRUNE` | No |
| `$$REMOVE` | No |
| `$$ROOT` | No |

### Window operators

| Command | Supported |
|---------|---------|
| `$sum` | No |
| `$push` | No |
| `$addToSet` | No |
| `$count` | No |
| `$max` | No |
| `$min` | No |
| `$avg` | No |
| `$stdDevPop` | No |
| `$bottom` | No |
| `$bottomN` | No |
| `$covariancePop` | No |
| `$covarianceSamp` | No |
| `$denseRank` | No |
| `$derivative` | No |
| `$documentNumber` | No |
| `$expMovingAvg` | No |
| `$first` | No |
| `$integral` | No |
| `$last` | No |
| `$linearFill` | No |
| `$locf` | No |
| `$minN` | No |
| `$rank` | No |
| `$shift` | No |
| `$stdDevSamp` | No |
| `$top` | No |
| `$topN` | No |


### Literal operator

| Command | Supported |
|---------|---------|
| `$literal` | Yes |

### Date expressions

| Command | Supported |
|---------|---------|
| `$dateToString` | No |
| `$month` | No |
| `$year` | No |
| `$hour` | No |
| `$minute` | No |
| `$second` | No |
| `$dayOfMonth` | No |
| `$week` | No |
| `$millisecond` | No |
| `$toDate` | No |
| `$dateToParts` | No |
| `$dayOfWeek` | No |
| `$dayOfYear` | No |
| `$isoWeek` | No |
| `$isoWeekYear` | No |
| `$isoDayOfWeek` | No |
| `$dateAdd` | No |
| `$dateDiff` | No |
| `$dateFromParts` | No |
| `$dateFromString` | No |
| `$dateSubtract` | No |
| `$dateTrunc` | No |

### Conditional expressions

| Command | Supported |
|---------|---------|
| `$cond` | Yes |
| `$ifNull` | Yes |
| `$switch` | Yes |

### Accumulator expressions

| Command | Supported |
|---------|---------|
| `$accumulator` | No |
| `$addToSet` | No |
| `$avg` | Yes |
| `$bottom` | No |
| `$bottomN` | No |
| `$count` | Yes |
| `$first` | Yes |
| `$firstN` | No |
| `$last` | Yes |
| `$lastN` | No |
| `$max` | Yes |
| `$maxN` | No |
| `$mergeObjects` | No |
| `$min` | Yes |
| `$push` | No |
| `$stdDevPop` | No |
| `$stdDevSamp` | No |
| `$sum` | Yes |
| `$top` | No |
| `$topN` | No |
| `$stdDevPop` | No |
| `$stdDevSamp` | No |
| `$sum` | Yes |

### Miscellaneous operators

| Command | Supported |
|---------|---------|
| `$getField` | No |
| `$rand` | Yes |
| `$sampleRate` | No |

### Object expressions

| Command | Supported |
|---------|---------|
| `$mergeObjects` | Yes |
| `$objectToArray` | No |
| `$setField` | No |

## Data types

Azure Cosmos DB for MongoDB supports documents encoded in MongoDB BSON format.

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
| `Geospatial Index` | No |
| `Hashed Index` | Yes |

### Index properties

| Command | Supported |
|---------|---------|
| `TTL` | Yes |
| `Unique` | Yes |
| `Partial` | Yes |
| `Case Insensitive` | No |
| `Sparse` | Yes |
| `Background` | Yes |

## Operators

### Comparison Query operators

| Command | Supported |
|---------|---------|
| `$eq` | Yes |
| `$gt` | Yes |
| `$gte` | Yes |
| `$in` | Yes |
| `$lt` | Yes |
| `$lte` | Yes |
| `$ne` | Yes |
| `$nin` | Yes |

### Logical operators

| Command | Supported |
|---------|---------|
| `$or` | Yes |
| `$and` | Yes |
| `$not` | Yes |
| `$nor` | Yes |

### Element operators

| Command | Supported |
|---------|---------|
| `$exists` | Yes |
| `$type` | Yes |

### Evaluation query operators

| Command | Supported |
|---------|---------|
| `$expr` | Yes |
| `$jsonSchema` | No |
| `$mod` | Yes |
| `$regex` | Yes |
| `$text` | No |
| `$where` | No |

### Array operators

| Command | Supported |
|---------|---------|
| `$all` | Yes |
| `$elemMatch` | Yes |
| `$size` | Yes |

### Bitwise Query operators

| Command | Supported |
|---------|---------|
| `$bitsAllClear` | Yes |
| `$bitsAllSet` | Yes |
| `$bitsAnyClear` | Yes |
| `$bitsAnySet` | Yes |

### Miscellaneous operators

| Command | Supported |
|---------|---------|
| `$comment` | No |
| `$rand` | No |
| `$natural` | No |

### Projection operators

| Command | Supported |
|---------|---------|
| `$` | Yes |
| `$elemMatch` | Yes |
| `$slice` | Yes |

### Update operators

#### Field update operators

| Command | Supported |
|---------|---------|
| `$currentDate` | Yes |
| `$inc` | Yes |
| `$min` | Yes |
| `$max` | Yes |
| `$mul` | Yes |
| `$rename` | Yes |
| `$set` | Yes |
| `$setOnInsert` | Yes |
| `$unset` | Yes |

#### Array update operators

| Command | Supported |
|---------|---------|
| `$` | Yes |
| `$[]` | Yes |
| `$[<identifier>]` | Yes |
| `$addToSet` | Yes |
| `$pop` | Yes |
| `$pull` | Yes |
| `$push` | Yes |
| `$pullAll` | Yes |

#### Update modifiers

| Command | Supported |
|---------|---------|
| `$each` | Yes |
| `$position` | Yes |
| `$slice` | Yes |
| `$sort` | Yes |

#### Bitwise update operator

| Command | Supported |
|---------|---------|
| `$bit` | Yes |

### Geospatial operators

| Operator | Supported |
| --- | --- |
| `$geoIntersects` | No |
| `$geoWithin` | No |
| `$near` | No |
| `$nearSphere` | No |
| `$box` | No |
| `$center` | No |
| `$centerSphere` | No |
| `$geometry` | No |
| `$maxDistance` | No |
| `$minDistance` | No |
| `$polygon` | No |
| `$uniqueDocs` | No |


## Next steps

> [!div class="nextstepaction"]
> [TODO: Link to another topic](about:blank)
