---
title: Compatibility and feature support
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Review Azure Cosmos DB for MongoDB vCore supported features and syntax including; commands, query support, datatypes, aggregation, operators and indexes.
author: suvishodcitus
ms.author: suvishod
ms.reviewer: abramees
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 10/21/2023
---

# MongoDB compatibility and feature support with Azure Cosmos DB for MongoDB vCore

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Azure Cosmos DB for MongoDB vCore allows you to experience the familiar MongoDB advantages while accessing the enhanced enterprise features offered by Azure Cosmos DB. It ensures compatibility by following the MongoDB wire protocol, allowing you to leverage existing client drivers, SDKs and other tools you're already familiar with.
 

## Protocol support

The supported operators and any limitations or exceptions are listed here. Any client driver that understands these protocols should be able to connect to Azure Cosmos DB for MongoDB. When you create Azure Cosmos DB for MongoDB vCore clusters, the endpoint is in the format `*.mongocluster.cosmos.azure.com`.


## Query language support

Azure Cosmos DB for MongoDB provides comprehensive support for MongoDB query language constructs. Below you can find the detailed list of currently supported database commands, operators, stages, and options.

> [!NOTE]
> This article only lists the supported server commands, and excludes client-side wrapper functions. Client-side wrapper functions such as `deleteMany()` and `updateMany()` internally utilize the `delete()` and `update()` server commands. Functions utilizing supported server commands are compatible with the Azure Cosmos DB for MongoDB.


## Database commands

Azure Cosmos DB for MongoDB vCore supports the following database commands:

<table>
<tr><td><b>Category</b></td><td><b>Command</b></td><td><b>Supported</b></td></tr>
<tr><td rowspan="4">Aggregation Commands</td><td><code>aggregate</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>count</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>distinct</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>mapReduce</code></td><td>Deprecated</td></tr>

<tr><td rowspan="3">Authentication Commands</td><td><code>authenticate</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>getnonce</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>logout</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="1">Geospatial Commands</td><td><code>geoSearch</code></td><td>Deprecated</td></tr>

<tr><td rowspan="1">Query Plan Cache Commands</td><td></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="32">Administrative Commands</td><td><code>cloneCollectionAsCapped</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No. Capped collections are currently not supported.</td></tr>
<tr><td><code>collMod</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Partial</td></tr>
<tr><td><code>compact</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>connPoolSync</code></td><td>Deprecated</td></tr>
<tr><td><code>convertToCapped</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No. Capped collections are currently not supported.</td></tr>
<tr><td><code>create</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Partial</td></tr>
<tr><td><code>createIndexes</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>currentOp</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>drop</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>dropDatabase</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>dropConnections</code></td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td><code>dropIndexes</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>filemd5</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>fsync</code></td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td><code>fsyncUnlock</code></td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td><code>getDefaultRWConcern</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>getClusterParameter</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>getParameter</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>killCursors</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>killOp</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>listCollections</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>listDatabases</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>listIndexes</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>logRotate</code></td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td><code>reIndex</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>renameCollection</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>rotateCertificates</code></td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td><code>setFeatureCompatibilityVersion</code></td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td><code>setIndexCommitQuorum</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>setParameter</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Partial</td></tr>
<tr><td><code>setDefaultRWConcern</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>shutdown</code></td><td>As a PaaS service, this will be managed by Azure.</td></tr>

<tr><td rowspan="1">User & Role Management Commands</td><td></td><td>Not supported today, but will be made available through Azure Active Directory in the future.</td></tr>

<tr><td rowspan="1">Replication Commands</td><td></td><td>Azure manages replication, removing the necessity for customers to replicate manually.</td></tr>

<tr><td rowspan="35">Sharding Commands</td><td><code>enableSharding</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>isdbgrid</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>reshardCollection</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>shardCollection</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>unsetSharding</code></td><td>Deprecated</td></tr>
<tr><td><code>addShard</code></td><td rowspan="29">As a Platform-as-a-Service (PaaS) offering, Azure manages shard management and rebalancing. Users only need to specify the sharding strategy for the collections and Azure will handle the rest.</td></tr>
<tr><td><code>addShardToZone</code></td></tr>
<tr><td><code>clearJumboFlag</code></td></tr>
<tr><td><code>cleanupOrphaned</code></td></tr>
<tr><td><code>removeShard</code></td></tr>
<tr><td><code>removeShardFromZone</code></td></tr>
<tr><td><code>setShardVersion</code></td></tr>
<tr><td><code>mergeChunks</code></td></tr>
<tr><td><code>checkShardingIndex</code></td></tr>
<tr><td><code>getShardMap</code></td></tr>
<tr><td><code>getShardVersion</code></td></tr>
<tr><td><code>medianKey</code></td></tr>
<tr><td><code>splitVector</code></td></tr>
<tr><td><code>shardingState</code></td></tr>
<tr><td><code>cleanupReshardCollection</code></td></tr>
<tr><td><code>flushRouterConfig</code></td></tr>
<tr><td><code>balancerCollectionStatus</code></td></tr>
<tr><td><code>balancerStart</code></td></tr>
<tr><td><code>balancerStatus</code></td></tr>
<tr><td><code>balancerStop</code></td></tr>
<tr><td><code>configureCollectionBalancing</code></td></tr>
<tr><td><code>listShards</code></td></tr>
<tr><td><code>split</code></td></tr>
<tr><td><code>moveChunk</code></td></tr>
<tr><td><code>updateZoneKeyRange</code></td></tr>
<tr><td><code>movePrimary</code></td></tr>
<tr><td><code>abortReshardCollection</code></td></tr>
<tr><td><code>commitReshardCollection</code></td></tr>
<tr><td><code>refineCollectionShardKey</code></td></tr>
<tr><td><code>reshardCollection</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="9">Query and Write Operation Commands</td><td><code>change streams</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>delete</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>find</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>findAndModify</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>getLastError</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>getMore</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Partial</td></tr>
<tr><td><code>insert</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>resetError</code></td><td>Deprecated</td></tr>
<tr><td><code>update</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="8">Session Commands</td><td><code>abortTransaction</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>commitTransaction</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>endSessions</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>killAllSessions</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>killAllSessionsByPattern</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>killSessions</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>refreshSessions</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>startSession</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="25">Diagnostic Commands</td><td><code>availableQueryOptions</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>buildInfo</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>collStats</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>connPoolStats</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>connectionStatus</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Partial</td></tr>
<tr><td><code>dataSize</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>dbHash</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>dbStats</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>driverOIDTest</code></td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td><code>explain</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>features</code></td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td><code>getCmdLineOpts</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>getLog</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>hostInfo</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Partial</td></tr>
<tr><td><code>_isSelf</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>listCommands</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>lockInfo</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>netstat</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>ping</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>profile</code></td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td><code>serverStatus</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>shardConnPoolStats</code></td><td>Deprecated</td></tr>
<tr><td><code>top</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>validate</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>whatsmyuri</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>


<tr><td rowspan="1">System Events Auditing Commands</td><td><code>logApplicationMessage</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

</table>


## Operators

Below are the list of operators currently supported on Azure Cosmos DB for MongoDB vCore:

<table>
<tr><td><b>Category</b></td><td><b>Operator</b></td><td><b>Supported</b></td></tr>
<tr><td rowspan="8">Comparison Query Operators</td><td><code>$eq</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$gt</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$gte</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$in</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$lt</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$lte</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$ne</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$nin</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="4">Logical Query Operators</td><td><code>$and</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$not</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$nor</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$or</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="2">Element Query Operators</td><td><code>$exists</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$type</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="6">Evaluation Query Operators</td><td><code>$expr</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$jsonSchema</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$mod</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$regex</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$text</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$where</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="1">Geospatial Operators</td><td></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="3">Array Query Operators</td><td><code>$all</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$elemMatch</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$size</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="4">Bitwise Query Operators</td><td><code>$bitsAllClear</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$bitsAllSet</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$bitsAnyClear</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$bitsAnySet</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="4">Projection Operators</td><td><code>$</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$elemMatch</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$meta</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$slice</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="3">Miscellaneous Query Operators</td><td><code>$comment</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$rand</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$natural</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="9">Field Update Operators</td><td><code>$currentDate</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$inc</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$min</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$max</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$mul</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$rename</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$set</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$setOnInsert</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$unset</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="12">Array Update Operators</td><td><code>$</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$[]</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$[identifier]</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$addToSet</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$pop</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$pull</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$push</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$pullAll</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$each</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$position</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$slice</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$sort</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="1">Bitwise Update Operators</td><td><code>$bit</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="16">Arithmetic Expression Operators</td><td><code>$abs</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$add</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$ceil</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$divide</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$exp</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$floor</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$ln</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$log</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$log10</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$mod</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$multiply</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$pow</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$round</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$sqrt</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$subtract</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$trunc</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="20">Array Expression Operators</td><td><code>$arrayElemAt</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$arrayToObject</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$concatArrays</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$filter</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$firstN</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$in</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$indexOfArray</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$isArray</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$lastN</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$map</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$maxN</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$minN</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$objectToArray</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$range</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$reduce</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$reverseArray</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$size</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$slice</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$sortArray</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$zip</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="4">Bitwise Operators</td><td><code>$bitAnd</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$bitNot</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$bitOr</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$bitXor</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="3">Boolean Expression Operators</td><td><code>$and</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$not</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$or</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="7">Comparison Expression Operators</td><td><code>$cmp</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$eq</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$gt</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$gte</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$lt</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$lte</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$ne</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="1">Custom Aggregation Expression Operators</td><td colspan="2">Not supported.</td></tr>

<tr><td rowspan="2">Data Size Operators</td><td><code>$bsonSize</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$binarySize</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="22">Date Expression Operators</td><td><code>$dateAdd</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$dateDiff</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$dateFromParts</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$dateFromString</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$dateSubtract</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$dateToParts</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$dateToString</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$dateTrunc</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$dayOfMonth</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$dayOfWeek</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$dayOfYear</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$hour</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$isoDayOfWeek</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$isoWeek</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$isoWeekYear</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$millisecond</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$minute</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$month</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$second</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$toDate</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$week</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$year</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="1">Literal Expression Operator</td><td><code>$literal</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="3">Miscellaneous Operators</td><td><code>$getField</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$rand</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$sampleRate</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="3">Object Expression Operators</td><td><code>$mergeObjects</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$objectToArray</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$setField</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="7">Set Expression Operators</td><td><code>$allElementsTrue</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$anyElementTrue</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$setDifference</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$setEquals</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$setIntersection</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$setIsSubset</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$setUnion</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="23">String Expression Operators</td><td><code>$concat</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$dateFromString</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$dateToString</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$indexOfBytes</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$indexOfCP</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$ltrim</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$regexFind</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$regexFindAll</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$regexMatch</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$replaceOne</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$replaceAll</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$rtrim</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$split</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$strLenBytes</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$strLenCP</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$strcasecmp</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$substr</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$substrBytes</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$substrCP</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$toLower</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$toString</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$trim</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$toUpper</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="1">Text Expression Operator</td><td><code>$meta</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="1">Timestamp Expression Operators</td><td colspan="2">Not supported.</td></tr>

<tr><td rowspan="1">Trigonometry Expression Operators</td><td colspan="2">Not supported.</td></tr>

<tr><td rowspan="11">Type Expression Operators</td><td><code>$convert</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$isNumber</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$toBool</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$toDate</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$toDecimal</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$toDouble</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$toInt</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$toLong</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$toObjectId</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$toString</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$type</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="22">Accumulators ($group, $bucket, $bucketAuto, $setWindowFields)</td><td><code>$accumulator</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$addToSet</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$avg</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$bottom</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$bottomN</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$count</code>/td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$first</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$firstN</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$last</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$lastN</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$max</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$maxN</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$median</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$mergeObjects</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$min</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$percentile</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$push</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$stdDevPop</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$stdDevSamp</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$sum</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$top</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$topN</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="10">Accumulators (in Other Stages)</td><td><code>$avg</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$first</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$last</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$max</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$median</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$min</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$percentile</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$stdDevPop</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$stdDevSamp</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$sum</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="1">Variable Expression Operators</td><td colspan="2">Not supported.</td></tr>

<tr><td rowspan="1">Window Operators</td><td colspan="2">Not supported.</td></tr>

<tr><td rowspan="3">Conditional Expression Operators</td><td><code>$cond</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$ifNull</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$switch</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="44">Aggregation Pipeline Stages</td><td><code>$addFields</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$bucket</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$bucketAuto</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$changeStream</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$changeStreamSplitLargeEvent</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$collStats</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$count</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$densify</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$documents</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$facet</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$fill</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$geoNear</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$graphLookup</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$group</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$indexStats</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$limit</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$listSampledQueries</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$listSearchIndexes</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$listSessions</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$lookup</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$match</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$merge</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$out</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$planCacheStats</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$project</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$redact</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$replaceRoot</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$replaceWith</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$sample</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$search</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$searchMeta</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$set</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$setWindowFields</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$skip</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$sort</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$sortByCount</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$unionWith</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$unset</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$unwind</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$shardedDataDistribution</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$changeStream</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$currentOp</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>$listLocalSessions</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td><code>$documents</code></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

> [!NOTE]
> The `$lookup` aggregation does not yet support using variable expressions using 'let'.
> AvgObjsize and size in "collStats" works with document size less than 2KB only.

</table>

## Indexes and index properties

Azure Cosmos DB for MongoDB vCore supports the following indexes and index properties:

> [!NOTE]
> Creating a **unique index** obtains an exclusive lock on the collection for the entire duration of the build process. This blocks read and write operations on the collection until the operation is completed.

### Indexes

<table>
<tr><td>Command</td><td>Supported</td></tr>
<tr><td>Single Field Index</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>Compound Index</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>Multikey Index</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>Text Index</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>Geospatial Index</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>Hashed Index</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>Vector Index (only available in Cosmos DB)</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes, with [vector search](vector-search.md)</td></tr>
</table>


### Index properties

<table>
<tr><td>Command</td><td>Supported</td></tr>
<tr><td>TTL</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>Unique</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>Partial</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>Case Insensitive</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>Sparse</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
 <tr><td>Background</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
</td></tr>
</table>



## Next steps

> [!div class="nextstepaction"]
> [Migration options for Azure Cosmos DB for MongoDB vCore](migration-options.md)
