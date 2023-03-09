---
title: Compatibility and feature support
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Review Azure Cosmos DB for MongoDB vCore supported features and syntax including; commands, query support, datatypes, aggregation, and operators.
author: nayakshweta
ms.author: shwetn
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 03/09/2023
---

# MongoDB compatibility and feature support with Azure Cosmos DB for MongoDB vCore

Azure Cosmos DB is Microsoft's fully managed NoSQL and relational database, offering [multiple database APIs](../../choose-api.md). You can communicate with Azure Cosmos DB for MongoDB using the MongoDB drivers, SDKs and tools you're already familiar with. Azure Cosmos DB for MongoDB enables the use of existing client drivers by adhering to the MongoDB wire protocol.

By using the Azure Cosmos DB for MongoDB, you can enjoy the benefits of the MongoDB you're used to, with all of the enterprise capabilities that Azure Cosmos DB provides.

## Protocol Support

The supported operators and any limitations or exceptions are listed here. Any client driver that understands these protocols should be able to connect to Azure Cosmos DB for MongoDB. When you create Azure Cosmos DB for MongoDB vCore clusters, the endpoint is in the format `*.mongocluster.cosmos.azure.com`.

> [!NOTE]
> This article only lists the supported server commands, and excludes client-side wrapper functions. Client-side wrapper functions such as `deleteMany()` and `updateMany()` internally utilize the `delete()` and `update()` server commands. Functions utilizing supported server commands are compatible with the Azure Cosmos DB for MongoDB.

## Query language support

Azure Cosmos DB for MongoDB provides comprehensive support for MongoDB query language constructs. Below you can find the detailed list of currently supported operations, operators, stages, commands, and options.

## Database commands

Azure Cosmos DB for MongoDB vCore supports the following database commands:

### Query and write operation commands

| Command | Supported |
|---------|---------|
| `change streams` | ![Icon indicating that `change stream` is not supported](media/compatibility/no-icon.svg) |
| `delete` | ![Icon indicating that `delete` is supported.](media/compatibility/yes-icon.svg) |
| `find` | ![Icon indicating that `find` is supported.](media/compatibility/yes-icon.svg) |
| `findAndModify` | ![Icon indicating that `findAndModify` is supported.](media/compatibility/yes-icon.svg) |
| `getLastError` | ![Icon indicating that `getLastError` is not supported](media/compatibility/no-icon.svg) |
| `getMore` | Partial |
| `insert` | ![Icon indicating that `insert` is supported.](media/compatibility/yes-icon.svg) |
| `resetError` | ![Icon indicating that `resetError` is not supported](media/compatibility/no-icon.svg) |
| `update` | ![Icon indicating that `update` is supported.](media/compatibility/yes-icon.svg) |

### Session commands

| Command | Supported |
|---------|---------|
| `abortTransaction` | ![Icon indicating that `abortTransaction` is supported.](media/compatibility/yes-icon.svg) |
| `commitTransaction` | ![Icon indicating that `commitTransaction` is supported.](media/compatibility/yes-icon.svg) |
| `endSessions` | ![Icon indicating that `endSessions` is not supported](media/compatibility/no-icon.svg) |
| `killAllSessions` | ![Icon indicating that `killAllSessions` is not supported](media/compatibility/no-icon.svg) |
| `killAllSessionsByPattern` | ![Icon indicating that `killAllSessionsByPattern` is not supported](media/compatibility/no-icon.svg) |
| `killSessions` | ![Icon indicating that `killSessions` is not supported](media/compatibility/no-icon.svg) |
| `refreshSessions` | ![Icon indicating that `refreshSessions` is not supported](media/compatibility/no-icon.svg) |
| `startSession` | ![Icon indicating that `startSession` is supported.](media/compatibility/yes-icon.svg) |

### Authentication commands

| Command | Supported |
|---------|---------|
| `authenticate` | ![Icon indicating that `authenticate` is not supported](media/compatibility/no-icon.svg) |
| `getnonce` | ![Icon indicating that `getnonce` is not supported](media/compatibility/no-icon.svg) |
| `logout` | ![Icon indicating that `logout` is supported.](media/compatibility/yes-icon.svg) |

### Geospatial command

| Command | Supported |
|---------|---------|
| `geoSearch` | ![Icon indicating that `geoSearch` is not supported](media/compatibility/no-icon.svg) |

### Query Plan Cache commands

| Command | Supported |
|---------|---------|
| `planCacheClear` | ![Icon indicating that `planCacheClear` is not supported](media/compatibility/no-icon.svg) |
| `planCacheClearFilters` | ![Icon indicating that `planCacheClearFilters` is not supported](media/compatibility/no-icon.svg) |
| `planCacheListFilters` | ![Icon indicating that `planCacheListFilters` is not supported](media/compatibility/no-icon.svg) |
| `planCacheSetFilter` | ![Icon indicating that `planCacheSetFilter` is not supported](media/compatibility/no-icon.svg) |

### Administration commands

| Command | Supported |
|---------|---------|
| `cloneCollectionAsCapped` | ![Icon indicating that `cloneCollectionAsCapped` is not supported](media/compatibility/no-icon.svg) |
| `collMod` | ![Icon indicating that `collMod` is not supported](media/compatibility/no-icon.svg) |
| `compact` | ![Icon indicating that `compact` is not supported](media/compatibility/no-icon.svg) |
| `connPoolSync` | ![Icon indicating that `connPoolSync` is not supported](media/compatibility/no-icon.svg) |
| `convertToCapped` | ![Icon indicating that `convertToCapped` is not supported](media/compatibility/no-icon.svg) |
| `create` | ![Icon indicating that `create` is not supported](media/compatibility/no-icon.svg) |
| `createIndexes` | ![Icon indicating that `createIndexes` is supported.](media/compatibility/yes-icon.svg) |
| `currentOp` | ![Icon indicating that `currentOp` is not supported](media/compatibility/no-icon.svg) |
| `drop` | ![Icon indicating that `drop` is supported.](media/compatibility/yes-icon.svg) |
| `dropDatabase` | ![Icon indicating that `dropDatabase` is supported.](media/compatibility/yes-icon.svg) |
| `dropConnections` | ![Icon indicating that `dropConnections` is not supported](media/compatibility/no-icon.svg) |
| `dropIndexes` | ![Icon indicating that `dropIndexes` is supported.](media/compatibility/yes-icon.svg) |
| `filemd5` | ![Icon indicating that `filemd5` is not supported](media/compatibility/no-icon.svg) |
| `fsync` | ![Icon indicating that `fsync` is not supported](media/compatibility/no-icon.svg) |
| `fsyncUnlock` | ![Icon indicating that `fsyncUnlock` is not supported](media/compatibility/no-icon.svg) |
| `getDefaultRWConcern` | ![Icon indicating that `getDefaultRWConcern` is not supported](media/compatibility/no-icon.svg) |
| `getClusterParameter` | ![Icon indicating that `getClusterParameter` is not supported](media/compatibility/no-icon.svg) |
| `getParameter` | ![Icon indicating that `getParameter` is not supported](media/compatibility/no-icon.svg) |
| `killCursors`  | Yes |
| `killOp` | ![Icon indicating that `killOp` is not supported](media/compatibility/no-icon.svg) |
| `listCollections` | ![Icon indicating that `listCollections` is supported.](media/compatibility/yes-icon.svg) |
| `listDatabases`  | Yes |
| `listIndexes` | ![Icon indicating that `listIndexes` is supported.](media/compatibility/yes-icon.svg) |
| `logRotate` | ![Icon indicating that `logRotate` is not supported](media/compatibility/no-icon.svg) |
| `reIndex` | ![Icon indicating that `reIndex` is not supported](media/compatibility/no-icon.svg) |
| `renameCollection` | ![Icon indicating that `renameCollection` is supported.](media/compatibility/yes-icon.svg) |
| `rotateCertificates` | ![Icon indicating that `rotateCertificates` is not supported](media/compatibility/no-icon.svg) |
| `setFeatureCompatibilityVersion` | ![Icon indicating that `setFeatureCompatibilityVersion` is not supported](media/compatibility/no-icon.svg) |
| `setIndexCommitQuorum` | ![Icon indicating that `setIndexCommitQuorum` is not supported](media/compatibility/no-icon.svg) |
| `setParameter` | ![Icon indicating that `setParameter` is not supported](media/compatibility/no-icon.svg) |
| `setDefaultRWConcern` | ![Icon indicating that `setDefaultRWConcern` is not supported](media/compatibility/no-icon.svg) |
| `shutdown` | ![Icon indicating that `shutdown` is not supported](media/compatibility/no-icon.svg) |

### User Management commands

| Command | Supported |
|---------|---------|
| `createUser` | ![Icon indicating that `createUser` is not supported](media/compatibility/no-icon.svg) |
| `dropAllUsersFromDatabase` | ![Icon indicating that `dropAllUsersFromDatabase` is not supported](media/compatibility/no-icon.svg) |
| `dropUser` | ![Icon indicating that `dropUser` is not supported](media/compatibility/no-icon.svg) |
| `grantRolesToUser` | ![Icon indicating that `grantRolesToUser` is not supported](media/compatibility/no-icon.svg) |
| `revokeRolesFromUser` | ![Icon indicating that `revokeRolesFromUser` is not supported](media/compatibility/no-icon.svg) |
| `updateUser` | ![Icon indicating that `updateUser` is not supported](media/compatibility/no-icon.svg) |
| `usersInfo` | ![Icon indicating that `usersInfo` is not supported](media/compatibility/no-icon.svg) |

### Role Management commands

| Command | Supported |
|---------|---------|
| `createRole` | ![Icon indicating that `createRole` is not supported](media/compatibility/no-icon.svg) |
| `dropRole` | ![Icon indicating that `dropRole` is not supported](media/compatibility/no-icon.svg) |
| `dropAllRolesFromDatabase` | ![Icon indicating that `dropAllRolesFromDatabase` is not supported](media/compatibility/no-icon.svg) |
| `grantPrivilegesToRole` | ![Icon indicating that `grantPrivilegesToRole` is not supported](media/compatibility/no-icon.svg) |
| `grantRolesToRole` | ![Icon indicating that `grantRolesToRole` is not supported](media/compatibility/no-icon.svg) |
| `invalidateUserCache` | ![Icon indicating that `invalidateUserCache` is not supported](media/compatibility/no-icon.svg) |
| `revokePrivilegesFromRole` | ![Icon indicating that `revokePrivilegesFromRole` is not supported](media/compatibility/no-icon.svg) |
| `revokeRolesFromRole` | ![Icon indicating that `revokeRolesFromRole` is not supported](media/compatibility/no-icon.svg) |
| `rolesInfo` | ![Icon indicating that `rolesInfo` is not supported](media/compatibility/no-icon.svg) |
| `updateRole` | ![Icon indicating that `updateRole` is not supported](media/compatibility/no-icon.svg) |

### Replication commands

| Command | Supported |
|---------|---------|
| `applyOps` | ![Icon indicating that `applyOps` is not supported](media/compatibility/no-icon.svg) |
| `hello` | ![Icon indicating that `hello` is supported.](media/compatibility/yes-icon.svg) |
| `replSetAbortPrimaryCatchUp` | ![Icon indicating that `replSetAbortPrimaryCatchUp` is not supported](media/compatibility/no-icon.svg) |
| `replSetFreeze` | ![Icon indicating that `replSetFreeze` is not supported](media/compatibility/no-icon.svg) |
| `replSetGetConfig` | ![Icon indicating that `replSetGetConfig` is not supported](media/compatibility/no-icon.svg) |
| `replSetGetStatus` | ![Icon indicating that `replSetGetStatus` is not supported](media/compatibility/no-icon.svg) |
| `replSetInitiate` | ![Icon indicating that `replSetInitiate` is not supported](media/compatibility/no-icon.svg) |
| `replSetMaintenance` | ![Icon indicating that `replSetMaintenance` is not supported](media/compatibility/no-icon.svg) |
| `replSetReconfig` | ![Icon indicating that `replSetReconfig` is not supported](media/compatibility/no-icon.svg) |
| `replSetResizeOplog` | ![Icon indicating that `replSetResizeOplog` is not supported](media/compatibility/no-icon.svg) |
| `replSetStepDown` | ![Icon indicating that `replSetStepDown` is not supported](media/compatibility/no-icon.svg) |
| `replSetSyncFrom` | ![Icon indicating that `replSetSyncFrom` is not supported](media/compatibility/no-icon.svg) |

### Sharding commands

| Command | Supported |
|---------|---------|
| `abortReshardCollection` | ![Icon indicating that `abortReshardCollection` is not supported](media/compatibility/no-icon.svg) |
| `addShard` | ![Icon indicating that `addShard` is not supported](media/compatibility/no-icon.svg) |
| `addShardToZone` | ![Icon indicating that `addShardToZone` is not supported](media/compatibility/no-icon.svg) |
| `balancerCollectionStatus` | ![Icon indicating that `balancerCollectionStatus` is not supported](media/compatibility/no-icon.svg) |
| `balancerStart` | ![Icon indicating that `balancerStart` is not supported](media/compatibility/no-icon.svg) |
| `balancerStatus` | ![Icon indicating that `balancerStatus` is not supported](media/compatibility/no-icon.svg) |
| `balancerStop` | ![Icon indicating that `balancerStop` is not supported](media/compatibility/no-icon.svg) |
| `checkShardingIndex` | ![Icon indicating that `checkShardingIndex` is not supported](media/compatibility/no-icon.svg) |
| `clearJumboFlag` | ![Icon indicating that `clearJumboFlag` is not supported](media/compatibility/no-icon.svg) |
| `cleanupOrphaned` | ![Icon indicating that `cleanupOrphaned` is not supported](media/compatibility/no-icon.svg) |
| `cleanupReshardCollection` | ![Icon indicating that `cleanupReshardCollection` is not supported](media/compatibility/no-icon.svg) |
| `commitReshardCollection` | ![Icon indicating that `commitReshardCollection` is not supported](media/compatibility/no-icon.svg) |
| `configureCollectionBalancing` | ![Icon indicating that `configureCollectionBalancing` is not supported](media/compatibility/no-icon.svg) |
| `enableSharding` | ![Icon indicating that `enableSharding` is supported.](media/compatibility/yes-icon.svg) |
| `flushRouterConfig` | ![Icon indicating that `flushRouterConfig` is not supported](media/compatibility/no-icon.svg) |
| `getShardMap` | ![Icon indicating that `getShardMap` is not supported](media/compatibility/no-icon.svg) |
| `getShardVersion` | ![Icon indicating that `getShardVersion` is not supported](media/compatibility/no-icon.svg) |
| `isdbgrid` | ![Icon indicating that `isdbgrid` is not supported](media/compatibility/no-icon.svg) |
| `listShards` | ![Icon indicating that `listShards` is not supported](media/compatibility/no-icon.svg) |
| `medianKey` | ![Icon indicating that `medianKey` is not supported](media/compatibility/no-icon.svg) |
| `moveChunk` | ![Icon indicating that `moveChunk` is not supported](media/compatibility/no-icon.svg) |
| `movePrimary` | ![Icon indicating that `movePrimary` is not supported](media/compatibility/no-icon.svg) |
| `mergeChunks` | ![Icon indicating that `mergeChunks` is not supported](media/compatibility/no-icon.svg) |
| `refineCollectionShardKey` | ![Icon indicating that `refineCollectionShardKey` is not supported](media/compatibility/no-icon.svg) |
| `removeShard` | ![Icon indicating that `removeShard` is not supported](media/compatibility/no-icon.svg) |
| `removeShardFromZone` | ![Icon indicating that `removeShardFromZone` is not supported](media/compatibility/no-icon.svg) |
| `reshardCollection` | ![Icon indicating that `reshardCollection` is not supported](media/compatibility/no-icon.svg) |
| `setShardVersion` | ![Icon indicating that `setShardVersion` is not supported](media/compatibility/no-icon.svg) |
| `shardCollection` | ![Icon indicating that `shardCollection` is supported.](media/compatibility/yes-icon.svg) |
| `shardingState` | ![Icon indicating that `shardingState` is not supported](media/compatibility/no-icon.svg) |
| `split` | ![Icon indicating that `split` is not supported](media/compatibility/no-icon.svg) |
| `splitVector` | ![Icon indicating that `splitVector` is not supported](media/compatibility/no-icon.svg) |
| `unsetSharding` | ![Icon indicating that `unsetSharding` is not supported](media/compatibility/no-icon.svg) |
| `updateZoneKeyRange` | ![Icon indicating that `updateZoneKeyRange` is not supported](media/compatibility/no-icon.svg) |

### Diagnostics commands

| Command | Supported |
|---------|---------|
| `availableQueryOptions` | ![Icon indicating that `availableQueryOptions` is not supported](media/compatibility/no-icon.svg) |
| `buildInfo`| Yes |
| `collStats` | ![Icon indicating that `collStats` is not supported](media/compatibility/no-icon.svg) |
| `connPoolStats` | ![Icon indicating that `connPoolStats` is not supported](media/compatibility/no-icon.svg) |
| `connectionStatus` | ![Icon indicating that `connectionStatus` is not supported](media/compatibility/no-icon.svg) |
| `cursorInfo` | ![Icon indicating that `cursorInfo` is not supported](media/compatibility/no-icon.svg) |
| `dataSize` | ![Icon indicating that `dataSize` is not supported](media/compatibility/no-icon.svg) |
| `dbHash` | ![Icon indicating that `dbHash` is not supported](media/compatibility/no-icon.svg) |
| `dbStats` | ![Icon indicating that `dbStats` is not supported](media/compatibility/no-icon.svg) |
| `driverOIDTest` | ![Icon indicating that `driverOIDTest` is not supported](media/compatibility/no-icon.svg) |
| `explain`| Yes |
| `features` | ![Icon indicating that `features` is not supported](media/compatibility/no-icon.svg) |
| `getCmdLineOpts` | ![Icon indicating that `getCmdLineOpts` is not supported](media/compatibility/no-icon.svg) |
| `getLog`| Yes |
| `hostInfo` | ![Icon indicating that `hostInfo` is not supported](media/compatibility/no-icon.svg) |
| `_isSelf` | ![Icon indicating that `_isSelf` is not supported](media/compatibility/no-icon.svg) |
| `listCommands` | ![Icon indicating that `listCommands` is not supported](media/compatibility/no-icon.svg) |
| `lockInfo` | ![Icon indicating that `lockInfo` is not supported](media/compatibility/no-icon.svg) |
| `netstat` | ![Icon indicating that `netstat` is not supported](media/compatibility/no-icon.svg) |
| `ping`| Yes |
| `profile` | ![Icon indicating that `profile` is not supported](media/compatibility/no-icon.svg) |
| `serverStatus` | ![Icon indicating that `serverStatus` is not supported](media/compatibility/no-icon.svg) |
| `shardConnPoolStats` | ![Icon indicating that `shardConnPoolStats` is not supported](media/compatibility/no-icon.svg) |
| `top` | ![Icon indicating that `top` is not supported](media/compatibility/no-icon.svg) |
| `validate`| Yes |
| `whatsmyuri`| Yes |

### Free Monitoring Commands

| Command | Supported |
|---------|---------|
| `getFreeMonitoringStatus` | ![Icon indicating that `getFreeMonitoringStatus` is not supported](media/compatibility/no-icon.svg) |
| `setFreeMonitoring` | ![Icon indicating that `setFreeMonitoring` is not supported](media/compatibility/no-icon.svg) |

### Auditing command

| Command | Supported |
|---------|---------|
| `logApplicationMessage` | ![Icon indicating that `logApplicationMessage` is not supported](media/compatibility/no-icon.svg) |

## Aggregation pipeline

Azure Cosmos DB for MongoDB vCore supports the following aggregation pipeline features:

### Aggregation commands

| Command | Supported |
|---------|---------|
| `aggregate` | ![Icon indicating that `aggregate` is supported.](media/compatibility/yes-icon.svg) |
| `count` | ![Icon indicating that `count` is supported.](media/compatibility/yes-icon.svg) |
| `distinct` | ![Icon indicating that `distinct` is supported.](media/compatibility/yes-icon.svg) |
| `mapReduce` | ![Icon indicating that `mapReduce` is not supported](media/compatibility/no-icon.svg) |

### Aggregation stages

| Command | Supported |
|---------|---------|
| `$addFields` | ![Icon indicating that `$addFields` is supported.](media/compatibility/yes-icon.svg) |
| `$bucket` | ![Icon indicating that `$bucket` is not supported](media/compatibility/no-icon.svg) |
| `$bucketAuto` | ![Icon indicating that `$bucketAuto` is not supported](media/compatibility/no-icon.svg) |
| `$changeStream` | ![Icon indicating that `$changeStream` is not supported](media/compatibility/no-icon.svg) |
| `$count` | ![Icon indicating that `$count` is supported.](media/compatibility/yes-icon.svg) |
| `$currentOp` | ![Icon indicating that `$currentOp` is not supported](media/compatibility/no-icon.svg) |
| `$facet` | ![Icon indicating that `$facet` is not supported](media/compatibility/no-icon.svg) |
| `$geoNear` | ![Icon indicating that `$geoNear` is not supported](media/compatibility/no-icon.svg) |
| `$graphLookup` | ![Icon indicating that `$graphLookup` is not supported](media/compatibility/no-icon.svg) |
| `$group` | ![Icon indicating that `$group` is supported.](media/compatibility/yes-icon.svg) |
| `$indexStats` | ![Icon indicating that `$indexStats` is not supported](media/compatibility/no-icon.svg) |
| `$limit` | ![Icon indicating that `$limit` is supported.](media/compatibility/yes-icon.svg) |
| `$listLocalSessions` | ![Icon indicating that `$listLocalSessions` is not supported](media/compatibility/no-icon.svg) |
| `$listSessions` | ![Icon indicating that `$listSessions` is not supported](media/compatibility/no-icon.svg) |
| `$lookup` | ![Icon indicating that `$lookup` is supported.](media/compatibility/yes-icon.svg) |
| `$match` | ![Icon indicating that `$match` is supported.](media/compatibility/yes-icon.svg) |
| `$merge` | ![Icon indicating that `$merge` is not supported](media/compatibility/no-icon.svg) |
| `$out` | ![Icon indicating that `$out` is not supported](media/compatibility/no-icon.svg) |
| `$planCacheStats` | ![Icon indicating that `$planCacheStats` is not supported](media/compatibility/no-icon.svg) |
| `$project` | ![Icon indicating that `$project` is supported.](media/compatibility/yes-icon.svg) |
| `$redact` | ![Icon indicating that `$redact` is not supported](media/compatibility/no-icon.svg) |
| `$regexFind` | ![Icon indicating that `$regexFind` is not supported](media/compatibility/no-icon.svg) |
| `$regexFindAll` | ![Icon indicating that `$regexFindAll` is not supported](media/compatibility/no-icon.svg) |
| `$regexMatch` | ![Icon indicating that `$regexMatch` is not supported](media/compatibility/no-icon.svg) |
| `$replaceRoot` | ![Icon indicating that `$replaceRoot` is supported.](media/compatibility/yes-icon.svg) |
| `$replaceWith` | ![Icon indicating that `$replaceWith` is supported.](media/compatibility/yes-icon.svg) |
| `$sample` | ![Icon indicating that `$sample` is supported.](media/compatibility/yes-icon.svg) |
| `$set` | ![Icon indicating that `$set` is supported.](media/compatibility/yes-icon.svg) |
| `$skip` | ![Icon indicating that `$skip` is supported.](media/compatibility/yes-icon.svg) |
| `$sort` | ![Icon indicating that `$sort` is supported.](media/compatibility/yes-icon.svg) |
| `$sortByCount` | ![Icon indicating that `$sortByCount` is supported.](media/compatibility/yes-icon.svg) |
| `$unset` | ![Icon indicating that `$unset` is supported.](media/compatibility/yes-icon.svg) |
| `$unwind` | ![Icon indicating that `$unwind` is supported.](media/compatibility/yes-icon.svg) |

> [!NOTE]
> The `$lookup` aggregation does not yet support the [uncorrelated subqueries](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#join-conditions-and-uncorrelated-sub-queries) feature introduced in server version 3.6. You will receive an error with a message containing `let is not supported` if you attempt to use the `$lookup` operator with `let` and `pipeline` fields.

### Boolean expressions

| Command | Supported |
|---------|---------|
| `and` | ![Icon indicating that `and` is supported.](media/compatibility/yes-icon.svg) |
| `not` | ![Icon indicating that `not` is supported.](media/compatibility/yes-icon.svg) |
| `or` | ![Icon indicating that `or` expressions are supported.](media/compatibility/yes-icon.svg) |

### Type expressions

| Command | Supported |
|---------|---------|
| `$type` | ![Icon indicating that `$type` is not supported](media/compatibility/no-icon.svg) |
| `$toLong` | ![Icon indicating that `$toLong` is not supported](media/compatibility/no-icon.svg) |
| `$toString` | ![Icon indicating that `$toString` is not supported](media/compatibility/no-icon.svg) |
| `$convert` | ![Icon indicating that `$convert` is not supported](media/compatibility/no-icon.svg) |
| `$toDate` | ![Icon indicating that `$toDate` is not supported](media/compatibility/no-icon.svg) |
| `$toDecimal` | ![Icon indicating that `$toDecimal` is not supported](media/compatibility/no-icon.svg) |
| `$toObjectId` | ![Icon indicating that `$toObjectId` is not supported](media/compatibility/no-icon.svg) |
| `$toDouble` | ![Icon indicating that `$toDouble` is not supported](media/compatibility/no-icon.svg) |
| `$toBool` | ![Icon indicating that `$toBool` is not supported](media/compatibility/no-icon.svg) |
| `$toInt` | ![Icon indicating that `$toInt` is not supported](media/compatibility/no-icon.svg) |
| `$isNumber` | ![Icon indicating that `$isNumber` is not supported](media/compatibility/no-icon.svg) |

### Set expressions

| Command | Supported |
|---------|---------|
| `$anyElementTrue` | ![Icon indicating that `$anyElementTrue` is not supported](media/compatibility/no-icon.svg) |
| `$setUnion` | ![Icon indicating that `$setUnion` is not supported](media/compatibility/no-icon.svg) |
| `$allElementsTrue` | ![Icon indicating that `$allElementsTrue` is not supported](media/compatibility/no-icon.svg) |
| `$setIntersection` | ![Icon indicating that `$setIntersection` is not supported](media/compatibility/no-icon.svg) |
| `$setDifference` | ![Icon indicating that `$setDifference` is not supported](media/compatibility/no-icon.svg) |
| `$setEquals` | ![Icon indicating that `$setEquals` is not supported](media/compatibility/no-icon.svg) |
| `$setIsSubset` | ![Icon indicating that `$setIsSubset` is not supported](media/compatibility/no-icon.svg) |

### Comparison expressions

| Command | Supported |
|---------|---------|
| `$ne` | ![Icon indicating that `$ne` is supported.](media/compatibility/yes-icon.svg) |
| `$lte` | ![Icon indicating that `$lte` is supported.](media/compatibility/yes-icon.svg) |
| `$gt` | ![Icon indicating that `$gt` is supported.](media/compatibility/yes-icon.svg) |
| `$gte` | ![Icon indicating that `$gte` is supported.](media/compatibility/yes-icon.svg) |
| `$lt` | ![Icon indicating that `$lt` is supported.](media/compatibility/yes-icon.svg) |
| `$eq` | ![Icon indicating that `$eq` is supported.](media/compatibility/yes-icon.svg) |
| `$cmp` | ![Icon indicating that `$cmp` is supported.](media/compatibility/yes-icon.svg) |

### Custom Aggregation expressions

| Command | Supported |
|---------|---------|
| `$accumulator` | ![Icon indicating that `$accumulator` is not supported](media/compatibility/no-icon.svg) |
| `$function` | ![Icon indicating that `$function` is not supported](media/compatibility/no-icon.svg) |

### Data size Operators

| Command | Supported |
|---------|---------|
| `$binarySize` | ![Icon indicating that `$binarySize` is not supported](media/compatibility/no-icon.svg) |
| `$bsonSize` | ![Icon indicating that `$bsonSize` is not supported](media/compatibility/no-icon.svg) |

### Arithmetic expressions

| Command | Supported |
|---------|---------|
| `$add` | ![Icon indicating that `$add` is supported.](media/compatibility/yes-icon.svg) |
| `$multiply` | ![Icon indicating that `$multiply` is supported.](media/compatibility/yes-icon.svg) |
| `$subtract` | ![Icon indicating that `$subtract` is supported.](media/compatibility/yes-icon.svg) |
| `$divide` | ![Icon indicating that `$divide` is supported.](media/compatibility/yes-icon.svg) |
| `$ceil` | ![Icon indicating that `$ceil` is supported.](media/compatibility/yes-icon.svg) |
| `$floor` | ![Icon indicating that `$floor` is supported.](media/compatibility/yes-icon.svg) |
| `$trunc` | ![Icon indicating that `$trunc` is not supported](media/compatibility/no-icon.svg) |
| `$abs` | ![Icon indicating that `$abs` is supported.](media/compatibility/yes-icon.svg) |
| `$mod` | ![Icon indicating that `$mod` is supported.](media/compatibility/yes-icon.svg) |
| `$pow` | ![Icon indicating that `$pow` is supported.](media/compatibility/yes-icon.svg) |
| `$sqrt` | ![Icon indicating that `$sqrt` is supported.](media/compatibility/yes-icon.svg) |
| `$exp` | ![Icon indicating that `$exp` is supported.](media/compatibility/yes-icon.svg) |
| `$ln` | ![Icon indicating that `$ln` is supported.](media/compatibility/yes-icon.svg) |
| `$log` | ![Icon indicating that `$log` is supported.](media/compatibility/yes-icon.svg) |
| `$log10` | ![Icon indicating that `$log10` is supported.](media/compatibility/yes-icon.svg) |
| `$round` | ![Icon indicating that `$round` is not supported](media/compatibility/no-icon.svg) |

### Timestamp expressions

| Command | Supported |
|---------|---------|
| `$tsIncrement` | ![Icon indicating that `$tsIncrement` is not supported](media/compatibility/no-icon.svg) |
| `$tsSecond` | ![Icon indicating that `$tsSecond` is not supported](media/compatibility/no-icon.svg) |

### Trigonometry expressions

| Command | Supported |
|---------|---------|
| `$sin` | ![Icon indicating that `$sin` is not supported](media/compatibility/no-icon.svg) |
| `$cos` | ![Icon indicating that `$cos` is not supported](media/compatibility/no-icon.svg) |
| `$tan` | ![Icon indicating that `$tan` is not supported](media/compatibility/no-icon.svg) |
| `$asin` | ![Icon indicating that `$asin` is not supported](media/compatibility/no-icon.svg) |
| `$acos` | ![Icon indicating that `$acos` is not supported](media/compatibility/no-icon.svg) |
| `$atan` | ![Icon indicating that `$atan` is not supported](media/compatibility/no-icon.svg) |
| `$atan2` | ![Icon indicating that `$atan2` is not supported](media/compatibility/no-icon.svg) |
| `$asinh` | ![Icon indicating that `$asinh` is not supported](media/compatibility/no-icon.svg) |
| `$acosh` | ![Icon indicating that `$acosh` is not supported](media/compatibility/no-icon.svg) |
| `$atanh` | ![Icon indicating that `$atanh` is not supported](media/compatibility/no-icon.svg) |
| `$sinh` | ![Icon indicating that `$sinh` is not supported](media/compatibility/no-icon.svg) |
| `$cosh` | ![Icon indicating that `$cosh` is not supported](media/compatibility/no-icon.svg) |
| `$tanh` | ![Icon indicating that `$tanh` is not supported](media/compatibility/no-icon.svg) |
| `$degreesToRadians` | ![Icon indicating that `$degreesToRadians` is not supported](media/compatibility/no-icon.svg) |
| `$radiansToDegrees` | ![Icon indicating that `$radiansToDegrees` is not supported](media/compatibility/no-icon.svg) |

### String expressions

| Command | Supported |
|---------|---------|
| `$concat` | ![Icon indicating that `$concat` is not supported](media/compatibility/no-icon.svg) |
| `$dateToString` | ![Icon indicating that `$dateToString` is not supported](media/compatibility/no-icon.svg) |
| `$toLower` | ![Icon indicating that `$toLower` is not supported](media/compatibility/no-icon.svg) |
| `$toString` | ![Icon indicating that `$toString` is not supported](media/compatibility/no-icon.svg) |
| `$substr` | ![Icon indicating that `$substr` is not supported](media/compatibility/no-icon.svg) |
| `$split` | ![Icon indicating that `$split` is not supported](media/compatibility/no-icon.svg) |
| `$strLenCP` | ![Icon indicating that `$strLenCP` is not supported](media/compatibility/no-icon.svg) |
| `$toUpper` | ![Icon indicating that `$toUpper` is not supported](media/compatibility/no-icon.svg) |
| `$indexOfCP` | ![Icon indicating that `$indexOfCP` is not supported](media/compatibility/no-icon.svg) |
| `$substrCP` | ![Icon indicating that `$substrCP` is not supported](media/compatibility/no-icon.svg) |
| `$ltrim` | ![Icon indicating that `$ltrim` is not supported](media/compatibility/no-icon.svg) |
| `$substrBytes` | ![Icon indicating that `$substrBytes` is not supported](media/compatibility/no-icon.svg) |
| `$indexOfBytes` | ![Icon indicating that `$indexOfBytes` is not supported](media/compatibility/no-icon.svg) |
| `$trim` | ![Icon indicating that `$trim` is not supported](media/compatibility/no-icon.svg) |
| `$strLenBytes` | ![Icon indicating that `$strLenBytes` is not supported](media/compatibility/no-icon.svg) |
| `$dateFromString` | ![Icon indicating that `$dateFromString` is not supported](media/compatibility/no-icon.svg) |
| `$regexFind` | ![Icon indicating that `$regexFind` is not supported](media/compatibility/no-icon.svg) |
| `$regexFindAll` | ![Icon indicating that `$regexFindAll` is not supported](media/compatibility/no-icon.svg) |
| `$regexMatch` | ![Icon indicating that `$regexMatch` is not supported](media/compatibility/no-icon.svg) |
| `$replaceOne` | ![Icon indicating that `$replaceOne` is not supported](media/compatibility/no-icon.svg) |
| `$replaceAll` | ![Icon indicating that `$replaceAll` is not supported](media/compatibility/no-icon.svg) |
| `$rtrim` | ![Icon indicating that `$rtrim` is not supported](media/compatibility/no-icon.svg) |
| `$strcasecmp` | ![Icon indicating that `$strcasecmp` is not supported](media/compatibility/no-icon.svg) |

### Text expression Operator

| Command | Supported |
|---------|---------|
| `$meta` | ![Icon indicating that `$meta` is not supported](media/compatibility/no-icon.svg) |

### Array expressions

| Command | Supported |
|---------|---------|
| `$in` | ![Icon indicating that `$in` is supported.](media/compatibility/yes-icon.svg) |
| `$size` | ![Icon indicating that `$size` is supported.](media/compatibility/yes-icon.svg) |
| `$arrayElemAt` | ![Icon indicating that `$arrayElemAt` is supported.](media/compatibility/yes-icon.svg) |
| `$slice` | ![Icon indicating that `$slice` is supported.](media/compatibility/yes-icon.svg) |
| `$filter` | ![Icon indicating that `$filter` is not supported](media/compatibility/no-icon.svg) |
| `$map` | ![Icon indicating that `$map` is not supported](media/compatibility/no-icon.svg) |
| `$objectToArray` | ![Icon indicating that `$objectToArray` is not supported](media/compatibility/no-icon.svg) |
| `$arrayToObject` | ![Icon indicating that `$arrayToObject` is not supported](media/compatibility/no-icon.svg) |
| `$reduce` | ![Icon indicating that `$reduce` is not supported](media/compatibility/no-icon.svg) |
| `$indexOfArray` | ![Icon indicating that `$indexOfArray` is not supported](media/compatibility/no-icon.svg) |
| `$concatArrays` | ![Icon indicating that `$concatArrays` is not supported](media/compatibility/no-icon.svg) |
| `$isArray` | ![Icon indicating that `$isArray` is supported.](media/compatibility/yes-icon.svg) |
| `$zip` | ![Icon indicating that `$zip` is not supported](media/compatibility/no-icon.svg) |
| `$reverseArray` | ![Icon indicating that `$reverseArray` is not supported](media/compatibility/no-icon.svg) |
| `$range` | ![Icon indicating that `$range` is not supported](media/compatibility/no-icon.svg) |
| `$first` | ![Icon indicating that `$first` is supported.](media/compatibility/yes-icon.svg) |
| `$firstN` | ![Icon indicating that `$firstN` is not supported](media/compatibility/no-icon.svg) |
| `$last` | ![Icon indicating that `$last` is supported.](media/compatibility/yes-icon.svg) |
| `$lastN` | ![Icon indicating that `$lastN` is not supported](media/compatibility/no-icon.svg) |
| `$maxN` | ![Icon indicating that `$maxN` is not supported](media/compatibility/no-icon.svg) |
| `$minN` | ![Icon indicating that `$minN` is not supported](media/compatibility/no-icon.svg) |
| `$sortArray` | ![Icon indicating that `$sortArray` is not supported](media/compatibility/no-icon.svg) |

### Variable operator

| Command | Supported |
|---------|---------|
| `$let` | ![Icon indicating that `$let` is not supported](media/compatibility/no-icon.svg) |

### System variables

| Command | Supported |
|---------|---------|
| `$$CLUSTERTIME` | ![Icon indicating that `$$CLUSTERTIME` is not supported](media/compatibility/no-icon.svg) |
| `$$CURRENT` | ![Icon indicating that `$$CURRENT` is not supported](media/compatibility/no-icon.svg) |
| `$$DESCEND` | ![Icon indicating that `$$DESCEND` is not supported](media/compatibility/no-icon.svg) |
| `$$KEEP` | ![Icon indicating that `$$KEEP` is not supported](media/compatibility/no-icon.svg) |
| `$$NOW` | ![Icon indicating that `$$NOW` is not supported](media/compatibility/no-icon.svg) |
| `$$PRUNE` | ![Icon indicating that `$$PRUNE` is not supported](media/compatibility/no-icon.svg) |
| `$$REMOVE` | ![Icon indicating that `$$REMOVE` is not supported](media/compatibility/no-icon.svg) |
| `$$ROOT` | ![Icon indicating that `$$ROOT` is not supported](media/compatibility/no-icon.svg) |

### Window operators

| Command | Supported |
|---------|---------|
| `$sum` | ![Icon indicating that `$sum` is not supported](media/compatibility/no-icon.svg) |
| `$push` | ![Icon indicating that `$push` is not supported](media/compatibility/no-icon.svg) |
| `$addToSet` | ![Icon indicating that `$addToSet` is not supported](media/compatibility/no-icon.svg) |
| `$count` | ![Icon indicating that `$count` is not supported](media/compatibility/no-icon.svg) |
| `$max` | ![Icon indicating that `$max` is not supported](media/compatibility/no-icon.svg) |
| `$min` | ![Icon indicating that `$min` is not supported](media/compatibility/no-icon.svg) |
| `$avg` | ![Icon indicating that `$avg` is not supported](media/compatibility/no-icon.svg) |
| `$stdDevPop` | ![Icon indicating that `$stdDevPop` is not supported](media/compatibility/no-icon.svg) |
| `$bottom` | ![Icon indicating that `$bottom` is not supported](media/compatibility/no-icon.svg) |
| `$bottomN` | ![Icon indicating that `$bottomN` is not supported](media/compatibility/no-icon.svg) |
| `$covariancePop` | ![Icon indicating that `$covariancePop` is not supported](media/compatibility/no-icon.svg) |
| `$covarianceSamp` | ![Icon indicating that `$covarianceSamp` is not supported](media/compatibility/no-icon.svg) |
| `$denseRank` | ![Icon indicating that `$denseRank` is not supported](media/compatibility/no-icon.svg) |
| `$derivative` | ![Icon indicating that `$derivative` is not supported](media/compatibility/no-icon.svg) |
| `$documentNumber` | ![Icon indicating that `$documentNumber` is not supported](media/compatibility/no-icon.svg) |
| `$expMovingAvg` | ![Icon indicating that `$expMovingAvg` is not supported](media/compatibility/no-icon.svg) |
| `$first` | ![Icon indicating that `$first` is not supported](media/compatibility/no-icon.svg) |
| `$integral` | ![Icon indicating that `$integral` is not supported](media/compatibility/no-icon.svg) |
| `$last` | ![Icon indicating that `$last` is not supported](media/compatibility/no-icon.svg) |
| `$linearFill` | ![Icon indicating that `$linearFill` is not supported](media/compatibility/no-icon.svg) |
| `$locf` | ![Icon indicating that `$locf` is not supported](media/compatibility/no-icon.svg) |
| `$minN` | ![Icon indicating that `$minN` is not supported](media/compatibility/no-icon.svg) |
| `$rank` | ![Icon indicating that `$rank` is not supported](media/compatibility/no-icon.svg) |
| `$shift` | ![Icon indicating that `$shift` is not supported](media/compatibility/no-icon.svg) |
| `$stdDevSamp` | ![Icon indicating that `$stdDevSamp` is not supported](media/compatibility/no-icon.svg) |
| `$top` | ![Icon indicating that `$top` is not supported](media/compatibility/no-icon.svg) |
| `$topN` | ![Icon indicating that `$topN` is not supported](media/compatibility/no-icon.svg) |

### Literal operator

| Command | Supported |
|---------|---------|
| `$literal` | ![Icon indicating that `$literal` is supported.](media/compatibility/yes-icon.svg) |

### Date expressions

| Command | Supported |
|---------|---------|
| `$dateToString` | ![Icon indicating that `$dateToString` is not supported](media/compatibility/no-icon.svg) |
| `$month` | ![Icon indicating that `$month` is not supported](media/compatibility/no-icon.svg) |
| `$year` | ![Icon indicating that `$year` is not supported](media/compatibility/no-icon.svg) |
| `$hour` | ![Icon indicating that `$hour` is not supported](media/compatibility/no-icon.svg) |
| `$minute` | ![Icon indicating that `$minute` is not supported](media/compatibility/no-icon.svg) |
| `$second` | ![Icon indicating that `$second` is not supported](media/compatibility/no-icon.svg) |
| `$dayOfMonth` | ![Icon indicating that `$dayOfMonth` is not supported](media/compatibility/no-icon.svg) |
| `$week` | ![Icon indicating that `$week` is not supported](media/compatibility/no-icon.svg) |
| `$millisecond` | ![Icon indicating that `$millisecond` is not supported](media/compatibility/no-icon.svg) |
| `$toDate` | ![Icon indicating that `$toDate` is not supported](media/compatibility/no-icon.svg) |
| `$dateToParts` | ![Icon indicating that `$dateToParts` is not supported](media/compatibility/no-icon.svg) |
| `$dayOfWeek` | ![Icon indicating that `$dayOfWeek` is not supported](media/compatibility/no-icon.svg) |
| `$dayOfYear` | ![Icon indicating that `$dayOfYear` is not supported](media/compatibility/no-icon.svg) |
| `$isoWeek` | ![Icon indicating that `$isoWeek` is not supported](media/compatibility/no-icon.svg) |
| `$isoWeekYear` | ![Icon indicating that `$isoWeekYear` is not supported](media/compatibility/no-icon.svg) |
| `$isoDayOfWeek` | ![Icon indicating that `$isoDayOfWeek` is not supported](media/compatibility/no-icon.svg) |
| `$dateAdd` | ![Icon indicating that `$dateAdd` is not supported](media/compatibility/no-icon.svg) |
| `$dateDiff` | ![Icon indicating that `$dateDiff` is not supported](media/compatibility/no-icon.svg) |
| `$dateFromParts` | ![Icon indicating that `$dateFromParts` is not supported](media/compatibility/no-icon.svg) |
| `$dateFromString` | ![Icon indicating that `$dateFromString` is not supported](media/compatibility/no-icon.svg) |
| `$dateSubtract` | ![Icon indicating that `$dateSubtract` is not supported](media/compatibility/no-icon.svg) |
| `$dateTrunc` | ![Icon indicating that `$dateTrunc` is not supported](media/compatibility/no-icon.svg) |

### Conditional expressions

| Command | Supported |
|---------|---------|
| `$cond` | ![Icon indicating that `$cond` is supported.](media/compatibility/yes-icon.svg) |
| `$ifNull` | ![Icon indicating that `$ifNull` is supported.](media/compatibility/yes-icon.svg) |
| `$switch` | ![Icon indicating that `$switch` is supported.](media/compatibility/yes-icon.svg) |

### Accumulator expressions

| Command | Supported |
|---------|---------|
| `$accumulator` | ![Icon indicating that `$accumulator` is not supported](media/compatibility/no-icon.svg) |
| `$addToSet` | ![Icon indicating that `$addToSet` is not supported](media/compatibility/no-icon.svg) |
| `$avg` | ![Icon indicating that `$avg` is supported.](media/compatibility/yes-icon.svg) |
| `$bottom` | ![Icon indicating that `$bottom` is not supported](media/compatibility/no-icon.svg) |
| `$bottomN` | ![Icon indicating that `$bottomN` is not supported](media/compatibility/no-icon.svg) |
| `$count` | ![Icon indicating that `$count` is supported.](media/compatibility/yes-icon.svg) |
| `$first` | ![Icon indicating that `$first` is supported.](media/compatibility/yes-icon.svg) |
| `$firstN` | ![Icon indicating that `$firstN` is not supported](media/compatibility/no-icon.svg) |
| `$last` | ![Icon indicating that `$last` is supported.](media/compatibility/yes-icon.svg) |
| `$lastN` | ![Icon indicating that `$lastN` is not supported](media/compatibility/no-icon.svg) |
| `$max` | ![Icon indicating that `$max` is supported.](media/compatibility/yes-icon.svg) |
| `$maxN` | ![Icon indicating that `$maxN` is not supported](media/compatibility/no-icon.svg) |
| `$mergeObjects` | ![Icon indicating that `$mergeObjects` is not supported](media/compatibility/no-icon.svg) |
| `$min` | ![Icon indicating that `$min` is supported.](media/compatibility/yes-icon.svg) |
| `$push` | ![Icon indicating that `$push` is not supported](media/compatibility/no-icon.svg) |
| `$stdDevPop` | ![Icon indicating that `$stdDevPop` is not supported](media/compatibility/no-icon.svg) |
| `$stdDevSamp` | ![Icon indicating that `$stdDevSamp` is not supported](media/compatibility/no-icon.svg) |
| `$sum` | ![Icon indicating that `$sum` is supported.](media/compatibility/yes-icon.svg) |
| `$top` | ![Icon indicating that `$top` is not supported](media/compatibility/no-icon.svg) |
| `$topN` | ![Icon indicating that `$topN` is not supported](media/compatibility/no-icon.svg) |
| `$stdDevPop` | ![Icon indicating that `$stdDevPop` is not supported](media/compatibility/no-icon.svg) |
| `$stdDevSamp` | ![Icon indicating that `$stdDevSamp` is not supported](media/compatibility/no-icon.svg) |
| `$sum` | ![Icon indicating that `$sum` is supported.](media/compatibility/yes-icon.svg) |

### Miscellaneous operators

| Command | Supported |
|---------|---------|
| `$getField` | ![Icon indicating that `$getField` is not supported](media/compatibility/no-icon.svg) |
| `$rand` | ![Icon indicating that `$rand` is supported.](media/compatibility/yes-icon.svg) |
| `$sampleRate` | ![Icon indicating that `$sampleRate` is not supported](media/compatibility/no-icon.svg) |

### Object expressions

| Command | Supported |
|---------|---------|
| `$mergeObjects` | ![Icon indicating that `$mergeObjects` is supported.](media/compatibility/yes-icon.svg) |
| `$objectToArray` | ![Icon indicating that `$objectToArray` is not supported](media/compatibility/no-icon.svg) |
| `$setField` | ![Icon indicating that `$setField` is not supported](media/compatibility/no-icon.svg) |

## Data types

Azure Cosmos DB for MongoDB supports documents encoded in MongoDB BSON format.

| Command | Supported |
|---------|---------|
| `Double` | ![Icon indicating that `Double` is supported.](media/compatibility/yes-icon.svg) |
| `String` | ![Icon indicating that `String` is supported.](media/compatibility/yes-icon.svg) |
| `Object` | ![Icon indicating that `Object` is supported.](media/compatibility/yes-icon.svg) |
| `Array` | ![Icon indicating that `Array` is supported.](media/compatibility/yes-icon.svg) |
| `Binary Data` | ![Icon indicating that `Binary Data` is supported.](media/compatibility/yes-icon.svg) |
| `ObjectId` | ![Icon indicating that `ObjectId` is supported.](media/compatibility/yes-icon.svg) |
| `Boolean` | ![Icon indicating that `Boolean` is supported.](media/compatibility/yes-icon.svg) |
| `Date` | ![Icon indicating that `Date` is supported.](media/compatibility/yes-icon.svg) |
| `Null` | ![Icon indicating that `Null` is supported.](media/compatibility/yes-icon.svg) |
| `32-bit Integer (int)` | ![Icon indicating that `32-bit Integer (int)` is supported.](media/compatibility/yes-icon.svg) |
| `Timestamp` | ![Icon indicating that `Timestamp` is supported.](media/compatibility/yes-icon.svg) |
| `64-bit Integer (long)` | ![Icon indicating that `64-bit Integer (long)` is supported.](media/compatibility/yes-icon.svg) |
| `MinKey` | ![Icon indicating that `MinKey` is supported.](media/compatibility/yes-icon.svg) |
| `MaxKey` | ![Icon indicating that `MaxKey` is supported.](media/compatibility/yes-icon.svg) |
| `Decimal128` | ![Icon indicating that `Decimal128` is supported.](media/compatibility/yes-icon.svg) |
| `Regular Expression` | ![Icon indicating that `Regular Expression` is supported.](media/compatibility/yes-icon.svg) |
| `JavaScript` | ![Icon indicating that `JavaScript` is supported.](media/compatibility/yes-icon.svg) |
| `JavaScript (with scope)` | ![Icon indicating that `JavaScript (with scope)` is supported.](media/compatibility/yes-icon.svg) |
| `Undefined` | ![Icon indicating that `Undefined` is supported.](media/compatibility/yes-icon.svg) |

## Indexes and index properties

Azure Cosmos DB for MongoDB vCore supports the following indexes and index properties:

### Indexes

| Command | Supported |
|---------|---------|
| `Single Field Index` | ![Icon indicating that `Single Field Index` is supported.](media/compatibility/yes-icon.svg) |
| `Compound Index` | ![Icon indicating that `Compound Index` is supported.](media/compatibility/yes-icon.svg) |
| `Multikey Index` | ![Icon indicating that `Multikey Index` is supported.](media/compatibility/yes-icon.svg) |
| `Text Index` | ![Icon indicating that `Text Index` is not supported](media/compatibility/no-icon.svg) |
| `Geospatial Index` | ![Icon indicating that `Geospatial Index` is not supported](media/compatibility/no-icon.svg) |
| `Hashed Index` | ![Icon indicating that `Hashed Index` is supported.](media/compatibility/yes-icon.svg) |

### Index properties

| Command | Supported |
|---------|---------|
| `TTL` | ![Icon indicating that `TTL` is supported.](media/compatibility/yes-icon.svg) |
| `Unique` | ![Icon indicating that `Unique` is supported.](media/compatibility/yes-icon.svg) |
| `Partial` | ![Icon indicating that `Partial` is supported.](media/compatibility/yes-icon.svg) |
| `Case Insensitive` | ![Icon indicating that `Case Insensitive` is not supported](media/compatibility/no-icon.svg) |
| `Sparse` | ![Icon indicating that `Sparse` is supported.](media/compatibility/yes-icon.svg) |
| `Background` | ![Icon indicating that `Background` is supported.](media/compatibility/yes-icon.svg) |

## Operators

Azure Cosmos DB for MongoDB vCore supports the following operators:

### Comparison Query operators

| Command | Supported |
|---------|---------|
| `$eq` | ![Icon indicating that `$eq` is supported.](media/compatibility/yes-icon.svg) |
| `$gt` | ![Icon indicating that `$gt` is supported.](media/compatibility/yes-icon.svg) |
| `$gte` | ![Icon indicating that `$gte` is supported.](media/compatibility/yes-icon.svg) |
| `$in` | ![Icon indicating that `$in` is supported.](media/compatibility/yes-icon.svg) |
| `$lt` | ![Icon indicating that `$lt` is supported.](media/compatibility/yes-icon.svg) |
| `$lte` | ![Icon indicating that `$lte` is supported.](media/compatibility/yes-icon.svg) |
| `$ne` | ![Icon indicating that `$ne` is supported.](media/compatibility/yes-icon.svg) |
| `$nin` | ![Icon indicating that `$nin` is supported.](media/compatibility/yes-icon.svg) |

### Logical operators

| Command | Supported |
|---------|---------|
| `$or` | ![Icon indicating that `$or` is supported.](media/compatibility/yes-icon.svg) |
| `$and` | ![Icon indicating that `$and` is supported.](media/compatibility/yes-icon.svg) |
| `$not` | ![Icon indicating that `$not` is supported.](media/compatibility/yes-icon.svg) |
| `$nor` | ![Icon indicating that `$nor` is supported.](media/compatibility/yes-icon.svg) |

### Element operators

| Command | Supported |
|---------|---------|
| `$exists` | ![Icon indicating that `$exists` is supported.](media/compatibility/yes-icon.svg) |
| `$type` | ![Icon indicating that `$type` is supported.](media/compatibility/yes-icon.svg) |

### Evaluation query operators

| Command | Supported |
|---------|---------|
| `$expr` | ![Icon indicating that `$expr` is supported.](media/compatibility/yes-icon.svg) |
| `$jsonSchema` | ![Icon indicating that `$jsonSchema` is not supported](media/compatibility/no-icon.svg) |
| `$mod` | ![Icon indicating that `$mod` is supported.](media/compatibility/yes-icon.svg) |
| `$regex` | ![Icon indicating that `$regex` is supported.](media/compatibility/yes-icon.svg) |
| `$text` | ![Icon indicating that `$text` is not supported](media/compatibility/no-icon.svg) |
| `$where` | ![Icon indicating that `$where` is not supported](media/compatibility/no-icon.svg) |

### Array operators

| Command | Supported |
|---------|---------|
| `$all` | ![Icon indicating that `$all` is supported.](media/compatibility/yes-icon.svg) |
| `$elemMatch` | ![Icon indicating that `$elemMatch` is supported.](media/compatibility/yes-icon.svg) |
| `$size` | ![Icon indicating that `$size` is supported.](media/compatibility/yes-icon.svg) |

### Bitwise Query operators

| Command | Supported |
|---------|---------|
| `$bitsAllClear` | ![Icon indicating that `$bitsAllClear` is supported.](media/compatibility/yes-icon.svg) |
| `$bitsAllSet` | ![Icon indicating that `$bitsAllSet` is supported.](media/compatibility/yes-icon.svg) |
| `$bitsAnyClear` | ![Icon indicating that `$bitsAnyClear` is supported.](media/compatibility/yes-icon.svg) |
| `$bitsAnySet` | ![Icon indicating that `$bitsAnySet` is supported.](media/compatibility/yes-icon.svg) |

### Miscellaneous operators

| Command | Supported |
|---------|---------|
| `$comment` | ![Icon indicating that `$comment` is not supported](media/compatibility/no-icon.svg) |
| `$rand` | ![Icon indicating that `$rand` is not supported](media/compatibility/no-icon.svg) |
| `$natural` | ![Icon indicating that `$natural` is not supported](media/compatibility/no-icon.svg) |

### Projection operators

| Command | Supported |
|---------|---------|
| `$` | ![Icon indicating that the `$` operator is supported.](media/compatibility/yes-icon.svg) |
| `$elemMatch` | ![Icon indicating that `$elemMatch` is supported.](media/compatibility/yes-icon.svg) |
| `$slice` | ![Icon indicating that `$slice` is supported.](media/compatibility/yes-icon.svg) |

### Update operators

Azure Cosmos DB for MongoDB vCore supports the following update operators:

#### Field update operators

| Command | Supported |
|---------|---------|
| `$currentDate` | ![Icon indicating that `$currentDate` is supported.](media/compatibility/yes-icon.svg) |
| `$inc` | ![Icon indicating that `$inc` is supported.](media/compatibility/yes-icon.svg) |
| `$min` | ![Icon indicating that `$min` is supported.](media/compatibility/yes-icon.svg) |
| `$max` | ![Icon indicating that `$max` is supported.](media/compatibility/yes-icon.svg) |
| `$mul` | ![Icon indicating that `$mul` is supported.](media/compatibility/yes-icon.svg) |
| `$rename` | ![Icon indicating that `$rename` is supported.](media/compatibility/yes-icon.svg) |
| `$set` | ![Icon indicating that `$set` is supported.](media/compatibility/yes-icon.svg) |
| `$setOnInsert` | ![Icon indicating that `$setOnInsert` is supported.](media/compatibility/yes-icon.svg) |
| `$unset` | ![Icon indicating that `$unset` is supported.](media/compatibility/yes-icon.svg) |

#### Array update operators

| Command | Supported |
|---------|---------|
| `$` | ![Icon indicating that the `$` operator is supported.](media/compatibility/yes-icon.svg) |
| `$[]` | ![Icon indicating that `$[]` is supported.](media/compatibility/yes-icon.svg) |
| `$[<identifier>]` | ![Icon indicating that `$[<identifier>]` is supported.](media/compatibility/yes-icon.svg) |
| `$addToSet` | ![Icon indicating that `$addToSet` is supported.](media/compatibility/yes-icon.svg) |
| `$pop` | ![Icon indicating that `$pop` is supported.](media/compatibility/yes-icon.svg) |
| `$pull` | ![Icon indicating that `$pull` is supported.](media/compatibility/yes-icon.svg) |
| `$push` | ![Icon indicating that `$push` is supported.](media/compatibility/yes-icon.svg) |
| `$pullAll` | ![Icon indicating that `$pullAll` is supported.](media/compatibility/yes-icon.svg) |

#### Update modifiers

| Command | Supported |
|---------|---------|
| `$each` | ![Icon indicating that `$each` is supported.](media/compatibility/yes-icon.svg) |
| `$position` | ![Icon indicating that `$position` is supported.](media/compatibility/yes-icon.svg) |
| `$slice` | ![Icon indicating that `$slice` is supported.](media/compatibility/yes-icon.svg) |
| `$sort` | ![Icon indicating that `$sort` is supported.](media/compatibility/yes-icon.svg) |

#### Bitwise update operator

| Command | Supported |
|---------|---------|
| `$bit` | ![Icon indicating that `$bit` is supported.](media/compatibility/yes-icon.svg) |

### Geospatial operators

| Operator | Supported |
| --- | --- |
| `$geoIntersects` | ![Icon indicating that `$geoIntersects` is not supported](media/compatibility/no-icon.svg) |
| `$geoWithin` | ![Icon indicating that `$geoWithin` is not supported](media/compatibility/no-icon.svg) |
| `$near` | ![Icon indicating that `$near` is not supported](media/compatibility/no-icon.svg) |
| `$nearSphere` | ![Icon indicating that `$nearSphere` is not supported](media/compatibility/no-icon.svg) |
| `$box` | ![Icon indicating that `$box` is not supported](media/compatibility/no-icon.svg) |
| `$center` | ![Icon indicating that `$center` is not supported](media/compatibility/no-icon.svg) |
| `$centerSphere` | ![Icon indicating that `$centerSphere` is not supported](media/compatibility/no-icon.svg) |
| `$geometry` | ![Icon indicating that `$geometry` is not supported](media/compatibility/no-icon.svg) |
| `$maxDistance` | ![Icon indicating that `$maxDistance` is not supported](media/compatibility/no-icon.svg) |
| `$minDistance` | ![Icon indicating that `$minDistance` is not supported](media/compatibility/no-icon.svg) |
| `$polygon` | ![Icon indicating that `$polygon` is not supported](media/compatibility/no-icon.svg) |
| `$uniqueDocs` | ![Icon indicating that `$uniqueDocs` is not supported](media/compatibility/no-icon.svg) |

## Next steps

> [!div class="nextstepaction"]
> [Migration options for Azure Cosmos DB for MongoDB vCore](migration-options.md)
