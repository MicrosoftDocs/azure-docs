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
| `change streams` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `delete` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `find` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `findAndModify` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `getLastError` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `getMore` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Partial |
| `insert` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `resetError` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `update` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Session commands

| Command | Supported |
|---------|---------|
| `abortTransaction` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `commitTransaction` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `endSessions` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `killAllSessions` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `killAllSessionsByPattern` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `killSessions` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `refreshSessions` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `startSession` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Authentication commands

| Command | Supported |
|---------|---------|
| `authenticate` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `getnonce` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `logout` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Geospatial command

| Command | Supported |
|---------|---------|
| `geoSearch` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Query Plan Cache commands

| Command | Supported |
|---------|---------|
| `planCacheClear` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `planCacheClearFilters` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `planCacheListFilters` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `planCacheSetFilter` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Administration commands

| Command | Supported |
|---------|---------|
| `cloneCollectionAsCapped` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `collMod` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Partial |
| `compact` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `connPoolSync` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `convertToCapped` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `create` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Partial |
| `createIndexes` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `currentOp` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `drop` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `dropDatabase` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `dropConnections` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `dropIndexes` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `filemd5` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `fsync` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `fsyncUnlock` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `getDefaultRWConcern` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `getClusterParameter` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `getParameter` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `killCursors`  | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `killOp` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `listCollections` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `listDatabases`  | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `listIndexes` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `logRotate` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `reIndex` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `renameCollection` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `rotateCertificates` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `setFeatureCompatibilityVersion` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `setIndexCommitQuorum` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `setParameter` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `setDefaultRWConcern` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `shutdown` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### User Management commands

| Command | Supported |
|---------|---------|
| `createUser` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `dropAllUsersFromDatabase` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `dropUser` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `grantRolesToUser` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `revokeRolesFromUser` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `updateUser` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `usersInfo` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Role Management commands

| Command | Supported |
|---------|---------|
| `createRole` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `dropRole` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `dropAllRolesFromDatabase` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `grantPrivilegesToRole` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `grantRolesToRole` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `invalidateUserCache` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `revokePrivilegesFromRole` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `revokeRolesFromRole` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `rolesInfo` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `updateRole` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Replication commands

| Command | Supported |
|---------|---------|
| `applyOps` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `hello` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `replSetAbortPrimaryCatchUp` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `replSetFreeze` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `replSetGetConfig` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `replSetGetStatus` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `replSetInitiate` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `replSetMaintenance` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `replSetReconfig` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `replSetResizeOplog` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `replSetStepDown` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `replSetSyncFrom` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Sharding commands

| Command | Supported |
|---------|---------|
| `abortReshardCollection` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `addShard` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `addShardToZone` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `balancerCollectionStatus` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `balancerStart` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `balancerStatus` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `balancerStop` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `checkShardingIndex` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `clearJumboFlag` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `cleanupOrphaned` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `cleanupReshardCollection` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `commitReshardCollection` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `configureCollectionBalancing` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `enableSharding` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `flushRouterConfig` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `getShardMap` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `getShardVersion` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `isdbgrid` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `listShards` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `medianKey` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `moveChunk` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `movePrimary` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `mergeChunks` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `refineCollectionShardKey` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `removeShard` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `removeShardFromZone` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `reshardCollection` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `setShardVersion` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `shardCollection` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `shardingState` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `split` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `splitVector` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `unsetSharding` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `updateZoneKeyRange` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Diagnostics commands

| Command | Supported |
|---------|---------|
| `availableQueryOptions` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `buildInfo`| :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `collStats` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `connPoolStats` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `connectionStatus` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Partial |
| `cursorInfo` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `dataSize` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `dbHash` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `dbStats` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `driverOIDTest` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `explain`| :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `features` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `getCmdLineOpts` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `getLog`| :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `hostInfo` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Partial |
| `_isSelf` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `listCommands` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `lockInfo` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `netstat` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `ping`| :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `profile` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `serverStatus` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `shardConnPoolStats` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `top` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `validate`| :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `whatsmyuri`| :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Free Monitoring Commands

| Command | Supported |
|---------|---------|
| `getFreeMonitoringStatus` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `setFreeMonitoring` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Auditing command

| Command | Supported |
|---------|---------|
| `logApplicationMessage` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

## Aggregation pipeline

Azure Cosmos DB for MongoDB vCore supports the following aggregation pipeline features:

### Aggregation commands

| Command | Supported |
|---------|---------|
| `aggregate` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `count` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `distinct` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `mapReduce` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Aggregation stages

| Command | Supported |
|---------|---------|
| `$addFields` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$bucket` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$bucketAuto` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$changeStream` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$count` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$currentOp` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$facet` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$geoNear` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$graphLookup` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$group` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$indexStats` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$limit` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$listLocalSessions` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$listSessions` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$lookup` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$match` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$merge` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$out` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$planCacheStats` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$project` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$redact` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$regexFind` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$regexFindAll` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$regexMatch` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$replaceRoot` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$replaceWith` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$sample` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$set` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$skip` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$sort` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$sortByCount` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$unset` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$unwind` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

> [!NOTE]
> The `$lookup` aggregation does not yet support using variable expressions using 'let'.

### Boolean expressions

| Command | Supported |
|---------|---------|
| `and` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `not` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `or` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Type expressions

| Command | Supported |
|---------|---------|
| `$type` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$toLong` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$toString` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$convert` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$toDate` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$toDecimal` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$toObjectId` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$toDouble` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$toBool` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$toInt` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$isNumber` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Set expressions

| Command | Supported |
|---------|---------|
| `$anyElementTrue` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$setUnion` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$allElementsTrue` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$setIntersection` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$setDifference` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$setEquals` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$setIsSubset` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Comparison expressions

| Command | Supported |
|---------|---------|
| `$ne` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$lte` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$gt` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$gte` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$lt` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$eq` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$cmp` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Custom Aggregation expressions

| Command | Supported |
|---------|---------|
| `$accumulator` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$function` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Data size Operators

| Command | Supported |
|---------|---------|
| `$binarySize` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$bsonSize` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Arithmetic expressions

| Command | Supported |
|---------|---------|
| `$add` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$multiply` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$subtract` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$divide` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$ceil` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$floor` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$trunc` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$abs` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$mod` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$pow` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$sqrt` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$exp` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$ln` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$log` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$log10` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$round` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Timestamp expressions

| Command | Supported |
|---------|---------|
| `$tsIncrement` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$tsSecond` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Trigonometry expressions

| Command | Supported |
|---------|---------|
| `$sin` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$cos` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$tan` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$asin` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$acos` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$atan` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$atan2` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$asinh` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$acosh` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$atanh` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$sinh` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$cosh` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$tanh` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$degreesToRadians` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$radiansToDegrees` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### String expressions

| Command | Supported |
|---------|---------|
| `$concat` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$dateToString` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$toLower` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$toString` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$substr` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$split` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$strLenCP` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$toUpper` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$indexOfCP` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$substrCP` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$ltrim` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$substrBytes` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$indexOfBytes` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$trim` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$strLenBytes` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$dateFromString` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$regexFind` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$regexFindAll` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$regexMatch` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$replaceOne` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$replaceAll` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$rtrim` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$strcasecmp` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Text expression Operator

| Command | Supported |
|---------|---------|
| `$meta` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Array expressions

| Command | Supported |
|---------|---------|
| `$in` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$size` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$arrayElemAt` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$slice` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$filter` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$map` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$objectToArray` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$arrayToObject` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$reduce` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$indexOfArray` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$concatArrays` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$isArray` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$zip` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$reverseArray` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$range` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$first` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$firstN` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$last` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$lastN` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$maxN` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$minN` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$sortArray` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Variable operator

| Command | Supported |
|---------|---------|
| `$let` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### System variables

| Command | Supported |
|---------|---------|
| `$$CLUSTERTIME` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$$CURRENT` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$$DESCEND` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$$KEEP` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$$NOW` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$$PRUNE` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$$REMOVE` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$$ROOT` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Window operators

| Command | Supported |
|---------|---------|
| `$sum` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$push` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$addToSet` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$count` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$max` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$min` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$avg` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$stdDevPop` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$bottom` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$bottomN` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$covariancePop` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$covarianceSamp` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$denseRank` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$derivative` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$documentNumber` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$expMovingAvg` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$first` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$integral` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$last` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$linearFill` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$locf` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$minN` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$rank` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$shift` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$stdDevSamp` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$top` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$topN` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Literal operator

| Command | Supported |
|---------|---------|
| `$literal` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Date expressions

| Command | Supported |
|---------|---------|
| `$dateToString` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$month` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$year` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$hour` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$minute` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$second` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$dayOfMonth` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$week` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$millisecond` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$toDate` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$dateToParts` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$dayOfWeek` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$dayOfYear` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$isoWeek` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$isoWeekYear` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$isoDayOfWeek` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$dateAdd` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$dateDiff` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$dateFromParts` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$dateFromString` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$dateSubtract` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$dateTrunc` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Conditional expressions

| Command | Supported |
|---------|---------|
| `$cond` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$ifNull` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$switch` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Accumulator expressions

| Command | Supported |
|---------|---------|
| `$accumulator` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$addToSet` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$avg` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$bottom` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$bottomN` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$count` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$first` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$firstN` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$last` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$lastN` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$max` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$maxN` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$mergeObjects` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$min` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$push` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$stdDevPop` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$stdDevSamp` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$sum` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$top` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$topN` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$stdDevPop` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$stdDevSamp` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$sum` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Miscellaneous operators

| Command | Supported |
|---------|---------|
| `$getField` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$rand` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$sampleRate` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Object expressions

| Command | Supported |
|---------|---------|
| `$mergeObjects` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$objectToArray` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$setField` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

## Data types

Azure Cosmos DB for MongoDB supports documents encoded in MongoDB BSON format.

| Command | Supported |
|---------|---------|
| `Double` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `String` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Object` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Array` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Binary Data` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `ObjectId` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Boolean` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Date` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Null` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `32-bit Integer (int)` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Timestamp` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `64-bit Integer (long)` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `MinKey` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `MaxKey` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Decimal128` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Regular Expression` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `JavaScript` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `JavaScript (with scope)` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Undefined` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

## Indexes and index properties

Azure Cosmos DB for MongoDB vCore supports the following indexes and index properties:

### Indexes

| Command | Supported |
|---------|---------|
| `Single Field Index` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Compound Index` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Multikey Index` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Text Index` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `Geospatial Index` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `Hashed Index` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Index properties

| Command | Supported |
|---------|---------|
| `TTL` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Unique` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Partial` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Case Insensitive` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `Sparse` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `Background` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

## Operators

Azure Cosmos DB for MongoDB vCore supports the following operators:

### Comparison Query operators

| Command | Supported |
|---------|---------|
| `$eq` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$gt` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$gte` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$in` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$lt` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$lte` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$ne` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$nin` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Logical operators

| Command | Supported |
|---------|---------|
| `$or` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$and` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$not` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$nor` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Element operators

| Command | Supported |
|---------|---------|
| `$exists` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$type` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Evaluation query operators

| Command | Supported |
|---------|---------|
| `$expr` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$jsonSchema` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$mod` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$regex` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$text` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$where` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Array operators

| Command | Supported |
|---------|---------|
| `$all` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$elemMatch` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$size` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Bitwise Query operators

| Command | Supported |
|---------|---------|
| `$bitsAllClear` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$bitsAllSet` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$bitsAnyClear` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$bitsAnySet` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Miscellaneous operators

| Command | Supported |
|---------|---------|
| `$comment` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$rand` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$natural` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

### Projection operators

| Command | Supported |
|---------|---------|
| `$` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$elemMatch` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$slice` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Update operators

Azure Cosmos DB for MongoDB vCore supports the following update operators:

#### Field update operators

| Command | Supported |
|---------|---------|
| `$currentDate` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$inc` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$min` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$max` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$mul` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$rename` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$set` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$setOnInsert` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$unset` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

#### Array update operators

| Command | Supported |
|---------|---------|
| `$` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$[]` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$[<identifier>]` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$addToSet` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$pop` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$pull` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$push` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$pullAll` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

#### Update modifiers

| Command | Supported |
|---------|---------|
| `$each` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$position` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$slice` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |
| `$sort` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

#### Bitwise update operator

| Command | Supported |
|---------|---------|
| `$bit` | :::image type="icon" source="media/compatibility/yes-icon.svg"::: Yes |

### Geospatial operators

| Operator | Supported |
| --- | --- |
| `$geoIntersects` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$geoWithin` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$near` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$nearSphere` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$box` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$center` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$centerSphere` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$geometry` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$maxDistance` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$minDistance` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$polygon` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |
| `$uniqueDocs` | :::image type="icon" source="media/compatibility/no-icon.svg"::: No |

## Next steps

> [!div class="nextstepaction"]
> [Migration options for Azure Cosmos DB for MongoDB vCore](migration-options.md)
