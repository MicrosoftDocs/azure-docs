---
title: Compatibility and feature support
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Review Azure Cosmos DB for MongoDB vCore supported features and syntax including; commands, query support, datatypes, aggregation, and operators.
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
<tr><td>Category</td><td>Command</td><td>Supported</td></tr>
<tr><td rowspan="4">Aggregation Commands</td><td><code>aggregate</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes" alt="Yes">Yes</td></tr>
<tr><td><code>count</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>distinct</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>mapReduce</code></td><td>Deprecated</td></tr>

<tr><td rowspan="3">Authentication Commands</td><td><code>authenticate</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>getnonce</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td><code>logout</code></td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="1">Geospatial Commands</td><td><code>geoSearch</code></td><td>Deprecated</td></tr>

<tr><td rowspan="1">Query Plan Cache Commands</td><td></td>td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="32">Administrative Commands</td><td>cloneCollectionAsCapped</td><td><img src="media/compatibility/no-icon.svg" alt="No">No. Capped collections are currently not supported.</td></tr>
<tr><td>collMod</td><td><img src="media/compatibility/yes-icon.svg" alt="Partial">Partial</td></tr>
<tr><td>compact</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>connPoolSync</td><td>Deprecated</td></tr>
<tr><td>convertToCapped</td><td><img src="media/compatibility/no-icon.svg" alt="No">No. Capped collections are currently not supported.</td></tr>
<tr><td>create</td><td><img src="media/compatibility/yes-icon.svg" alt="Partial">Partial</td></tr>
<tr><td>createIndexes</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>currentOp</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>drop</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>dropDatabase</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>dropConnections</td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td>dropIndexes</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>filemd5</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>fsync</td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td>fsyncUnlock</td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td>getDefaultRWConcern</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>getClusterParameter</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>getParameter</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>killCursors</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>killOp</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>listCollections</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>listDatabases</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>listIndexes</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>logRotate</td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td>reIndex</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>renameCollection</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>rotateCertificates</td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td>setFeatureCompatibilityVersion</td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td>setIndexCommitQuorum</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>setParameter</td><td><img src="media/compatibility/yes-icon.svg" alt="Partial">Partial</td></tr>
<tr><td>setDefaultRWConcern</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>shutdown</td><td>As a PaaS service, this will be managed by Azure.</td></tr>

<tr><td rowspan="1">User & Role Management Commands</td><td></td><td>Not supported today, but will be made available through Azure Active Directory in the future.</td></tr>

<tr><td rowspan="1">Replication Commands</td><td></td><td>Azure manages replication, removing the necessity for customers to replicate manually.</td></tr>

<tr><td rowspan="35">Sharding Commands</td><td>enableSharding</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>isdbgrid</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>reshardCollection</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>shardCollection</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>unsetSharding</td><td>Deprecated</td></tr>
<tr><td>addShard</td><td rowspan="29">As a Platform-as-a-Service (PaaS) offering, Azure manages shard management and rebalancing. Users only need to specify the sharding strategy for the collections and Azure will handle the rest.</td></tr>
<tr><td>addShardToZone</td></tr>
<tr><td>clearJumboFlag</td></tr>
<tr><td>cleanupOrphaned</td></tr>
<tr><td>removeShard</td></tr>
<tr><td>removeShardFromZone</td></tr>
<tr><td>setShardVersion</td></tr>
<tr><td>mergeChunks</td></tr>
<tr><td>checkShardingIndex</td></tr>
<tr><td>getShardMap</td></tr>
<tr><td>getShardVersion</td></tr>
<tr><td>medianKey</td></tr>
<tr><td>splitVector</td></tr>
<tr><td>shardingState</td></tr>
<tr><td>cleanupReshardCollection</td></tr>
<tr><td>flushRouterConfig</td></tr>
<tr><td>balancerCollectionStatus</td></tr>
<tr><td>balancerStart</td></tr>
<tr><td>balancerStatus</td></tr>
<tr><td>balancerStop</td></tr>
<tr><td>configureCollectionBalancing</td></tr>
<tr><td>listShards</td></tr>
<tr><td>split</td></tr>
<tr><td>moveChunk</td></tr>
<tr><td>updateZoneKeyRange</td></tr>
<tr><td>movePrimary</td></tr>
<tr><td>abortReshardCollection</td></tr>
<tr><td>commitReshardCollection</td></tr>
<tr><td>refineCollectionShardKey</td></tr>
<tr><td>reshardCollection</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="9">Query and Write Operation Commands</td><td>change streams</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>delete</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>find</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>findAndModify</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>getLastError</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>getMore</td><td><img src="media/compatibility/yes-icon.svg" alt="Partial">Partial</td></tr>
<tr><td>insert</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>resetError</td><td>Deprecated</td></tr>
<tr><td>update</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="8">Session Commands</td><td>abortTransaction</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>commitTransaction</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>endSessions</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>killAllSessions</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>killAllSessionsByPattern</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>killSessions</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>refreshSessions</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>startSession</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="25">Diagnostic Commands</td><td>availableQueryOptions</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>buildInfo</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>collStats</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>connPoolStats</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>connectionStatus</td><td><img src="media/compatibility/yes-icon.svg" alt="Partial">Partial</td></tr>
<tr><td>dataSize</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>dbHash</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>dbStats</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>driverOIDTest</td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td>explain</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>features</td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td>getCmdLineOpts</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>getLog</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>hostInfo</td><td><img src="media/compatibility/yes-icon.svg" alt="Partial">Partial</td></tr>
<tr><td>_isSelf</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>listCommands</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>lockInfo</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>netstat</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>ping</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>profile</td><td>As a PaaS service, this will be managed by Azure.</td></tr>
<tr><td>serverStatus</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>shardConnPoolStats</td><td>Deprecated</td></tr>
<tr><td>top</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>validate</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>whatsmyuri</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>


<tr><td rowspan="1">System Events Auditing Commands</td><td>logApplicationMessage</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

</table>


## Operators

Below are the list of operators currently supported on Azure Cosmos DB for MongoDB vCore:

<table>
<tr><td>Category</td><td>Operator</td><td>Supported</td></tr>
<tr><td rowspan="8">Comparison Query Operators</td><td>$eq</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$gt</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$gte</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$in</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$lt</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$lte</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$ne</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$nin</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="4">Logical Query Operators</td><td>$and</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$not</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$nor</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$or</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="2">Element Query Operators</td><td>$exists</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$type</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="6">Evaluation Query Operators</td><td>$expr</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$jsonSchema</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$mod</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$regex</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$text</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$where</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="1">Geospatial Operators</td><td></td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="3">Array Query Operators</td><td>$all</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$elemMatch</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$size</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="4">Bitwise Query Operators</td><td>$bitsAllClear</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$bitsAllSet</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$bitsAnyClear</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$bitsAnySet</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="4">Projection Operators</td><td>$</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$elemMatch</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$meta</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$slice</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="3">Miscellaneous Query Operators</td><td>$comment</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$rand</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$natural</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="9">Field Update Operators</td><td>$currentDate</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$inc</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$min</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$max</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$mul</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$rename</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$set</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$setOnInsert</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$unset</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="12">Array Update Operators</td><td>$</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$[]</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$[identifier]</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$addToSet</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$pop</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$pull</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$push</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$pullAll</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$each</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$position</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$slice</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$sort</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="1">Bitwise Update Operators</td><td>$bit</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="16">Arithmetic Expression Operators</td><td>$abs</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$add</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$ceil</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$divide</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$exp</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$floor</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$ln</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$log</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$log10</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$mod</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$multiply</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$pow</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$round</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$sqrt</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$subtract</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$trunc</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="20">Array Expression Operators</td><td>$arrayElemAt</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$arrayToObject</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$concatArrays</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$filter</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$firstN</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$in</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$indexOfArray</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$isArray</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$lastN</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$map</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$maxN</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$minN</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$objectToArray</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$range</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$reduce</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$reverseArray</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$size</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$slice</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$sortArray</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$zip</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="4">Bitwise Operators</td><td>$bitAnd</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$bitNot</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$bitOr</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$bitXor</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="3">Boolean Expression Operators</td><td>$and</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$not</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$or</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="7">Comparison Expression Operators</td><td>$cmp</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$eq</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$gt</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$gte</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$lt</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$lte</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$ne</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="1">Custom Aggregation Expression Operators</td><td colspan="2">Not supported.</td></tr>

<tr><td rowspan="2">Data Size Operators</td><td>$bsonSize</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$binarySize</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="22">Date Expression Operators</td><td>$dateAdd</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$dateDiff</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$dateFromParts</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$dateFromString</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$dateSubtract</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$dateToParts</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$dateToString</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$dateTrunc</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$dayOfMonth</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$dayOfWeek</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$dayOfYear</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$hour</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$isoDayOfWeek</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$isoWeek</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$isoWeekYear</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$millisecond</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$minute</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$month</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$second</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$toDate</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$week</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$year</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="1">Literal Expression Operator</td><td>$literal</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="3">Miscellaneous Operators</td><td>$getField</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$rand</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$sampleRate</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="3">Object Expression Operators</td><td>$mergeObjects</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$objectToArray</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$setField</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="7">Set Expression Operators</td><td>$allElementsTrue</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$anyElementTrue</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$setDifference</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$setEquals</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$setIntersection</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$setIsSubset</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$setUnion</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="23">String Expression Operators</td><td>$concat</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$dateFromString</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$dateToString</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$indexOfBytes</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$indexOfCP</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$ltrim</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$regexFind</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$regexFindAll</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$regexMatch</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$replaceOne</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$replaceAll</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$rtrim</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$split</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$strLenBytes</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$strLenCP</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$strcasecmp</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$substr</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$substrBytes</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$substrCP</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$toLower</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$toString</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$trim</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$toUpper</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="1">Text Expression Operator</td><td>$meta</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="1">Timestamp Expression Operators</td><td colspan="2">Not supported.</td></tr>

<tr><td rowspan="1">Trigonometry Expression Operators</td><td colspan="2">Not supported.</td></tr>

<tr><td rowspan="11">Type Expression Operators</td><td>$convert</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$isNumber</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$toBool</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$toDate</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$toDecimal</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$toDouble</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$toInt</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$toLong</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$toObjectId</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$toString</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$type</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="22">Accumulators ($group, $bucket, $bucketAuto, $setWindowFields)</td><td>$accumulator</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$addToSet</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$avg</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$bottom</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$bottomN</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$count</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$first</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$firstN</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$last</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$lastN</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$max</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$maxN</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$median</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$mergeObjects</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$min</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$percentile</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$push</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$stdDevPop</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$stdDevSamp</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$sum</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$top</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$topN</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="10">Accumulators (in Other Stages)</td><td>$avg</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$first</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$last</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$max</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$median</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$min</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$percentile</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$stdDevPop</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$stdDevSamp</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$sum</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

<tr><td rowspan="1">Variable Expression Operators</td><td colspan="2">Not supported.</td></tr>

<tr><td rowspan="1">Window Operators</td><td colspan="2">Not supported.</td></tr>

<tr><td rowspan="3">Conditional Expression Operators</td><td>$cond</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$ifNull</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$switch</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>

<tr><td rowspan="44">Aggregation Pipeline Stages</td><td>$addFields</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$bucket</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$bucketAuto</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$changeStream</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$changeStreamSplitLargeEvent</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$collStats</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$count</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$densify</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$documents</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$facet</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$fill</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$geoNear</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$graphLookup</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$group</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$indexStats</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$limit</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$listSampledQueries</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$listSearchIndexes</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$listSessions</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$lookup</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$match</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$merge</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$out</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$planCacheStats</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$project</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$redact</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$replaceRoot</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$replaceWith</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$sample</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$search</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$searchMeta</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$set</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$setWindowFields</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$skip</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$sort</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$sortByCount</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$unionWith</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$unset</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$unwind</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$shardedDataDistribution</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$changeStream</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$currentOp</td><td><img src="media/compatibility/yes-icon.svg" alt="Yes">Yes</td></tr>
<tr><td>$listLocalSessions</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>
<tr><td>$documents</td><td><img src="media/compatibility/no-icon.svg" alt="No">No</td></tr>

> [!NOTE]
> The `$lookup` aggregation does not yet support using variable expressions using 'let'.
> AvgObjsize and size in "collStats" works with document size less than 2KB only.


</table>



## Next steps

> [!div class="nextstepaction"]
> [Migration options for Azure Cosmos DB for MongoDB vCore](migration-options.md)
