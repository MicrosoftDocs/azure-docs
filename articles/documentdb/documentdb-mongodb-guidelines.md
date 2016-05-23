<properties 
	pageTitle="Preview development guidelines for DocumentDB with protocol support for MongoDB accounts | Microsoft Azure" 
	description="Learn about preview development guidelines for DocumentDB with protocol support for MongoDB accounts, now available for preview." 
	keywords="mongodb protocol, mongodb, mongo database"
	services="documentdb" 
	authors="stephbaron" 
	manager="jhubbard" 
	editor="" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/31/2016" 
	ms.author="stbaro"/>

# Preview development guidelines for DocumentDB with protocol support for MongoDB accounts

You can communicate with DocumentDB through any of the open source MongoDB client [drivers](https://docs.mongodb.org/ecosystem/drivers/). The protocol support for MongoDB assumes that the MongoDB client drivers are communicating with a MongoDB 2.6 or later server endpoint. DocumentDB supports this by adhering to the MongoDB [wire protocol](https://docs.mongodb.org/manual/reference/mongodb-wire-protocol/), version 2.6 (note that wire protocol version 3.2 is nearly fully supported, but certain client experiences such as version 3.2 MongoDB shell sessions may indicate that they are “degrading to 'legacy' mode”).

DocumentDB supports the core MongoDB API functions to Create, Read, Update and Delete (CRUD) data as well as query the database. The implemented capabilities have been prioritized based on the needs of common platforms, frameworks, tools application patterns.
 

## CRUD Operations

MongoDB Insert, Read, Update, Replace and Delete operations are fully supported. This includes support for field, array, bitwise and isolation updates as specified by MongoDB [Update operator specification](https://docs.mongodb.org/manual/reference/operator/update/). For the Update operators that need multiple document manipulations, DocumentDB provides full ACID semantics with snapshot isolation. 

## Query Operations

DocumentDB supports the full grammar of MongoDB Query with a few exceptions. Queries operating on the JSON compatible set of [BSON types](https://docs.mongodb.org/manual/reference/bson-types/) are supported in addition to support for the MongoDB date time  format. For queries requiring non-JSON type specific operators, DocumentDB supports GUID data types. The following table provides the supported vs. unsupported aspects of MongoDB query grammar.

## Aggregation

DocumentDB does not support the MongoDB aggregation pipeline or Map-Reduce operations. The aggregation pipeline is typically used to process documents through a multi-stage set of filters and transformations such as matching and grouping results. DocumentDB natively supports both JavaScript User Defined Functions and Stored Procedure.  Additionally, DocumentDB can easily act as both a source and sink for Hive, Pig, and MapReduce jobs using Azure HDInsight via the DocumentDB [Hadoop connector](documentdb-run-hadoop-with-hdinsight.md).

## Portal Experience
The Azure portal experience for MongoDB protocol enabled accounts is slightly different than the portal experience for standard DocumentDB accounts.  We are looking to expand the experience, but we need your [feedback](mailto:askdocdb@microsoft.com?subject=DocumentDB%20Protocol%20Support%20for%20MongoDB%20Preview%20Portal%20Experience) regarding what portal features would be of most use to you.

## Support Matrix


### CRUD and Query Operations

Feature|Supported|Will be supported|Not Supported 
---|---|---|---
Insert|InsertOne| | 
 |InsertMany| | 
 |Insert| | 
Update|UpdateOne| | 
 |UpdateMany| | 
 |Update| | 
Field Update|$inc, $mul, $rename, $set, $unset, $min, $max|$currentDate| 
Array Update| |-all-| 
Bitwise| |-all-| 
Isolation| |-all-| 
Replace|ReplaceOne| |
Delete|DeleteOne | |
 |DeleteMany| | 
 |Remove| | 
BulkWrite| |bulkWrite()| 
Comparison|-all-| | 
Logical|-all-| | 
Element Query| |-all-| 
Evaluation|$mod|$regex, $text, $where| 
GeoSpatial|2dsphere, 2d, polygon|Everything else| 
Array|$all, $size|$elemMatch| 
Bitwise| |-all-| 
Comment|-all-| | 
Projection| |-all-| 


### Database Commands

Feature|Supported|Will be supported|Not Supported 
---|---|---|---
Aggregation|Count| |aggregate, distinct, group, mapreduce
GeoSpatial| |-all-| 
Query & Write|find, insert, update, delete, getLastError, getMore, findAndModify| |Eval, parallelCollectionScan, getPrevError, resetError
QueryPlan Cache| | |-all-
Authentication|getnonce, logout, authenticate| |Copydbgetnone, authschemaUpgrade
User Management| | |-all-
Role Management| | |-all-
Replication| | |-all-
Administration|createIndex, listIndexes, dropIndexes, connectionStatus, reIndex| |Other commands.  For indexes, no support for the Unique, expireAfterSeconds, storageEngine, weights, default_language, textIndexVersion, min, max, bucketSize
Diagnostic|listDatabases, collStats, dbStats| |Everything else


### Shell Commands

Feature|Supported|Will be supported|Not Supported 
---|---|---|---
Cursor| | |-all-
QueryPlanCache| | |-all-
BulkWrite| |-all-| 
UserManagement| | |-all-
RoleManagement| | |-all-
Replication| | |-all-
Sharding| |-most commands-| 
Subprocess| | |-all-
Native| | |-all-


## Next steps

- Learn how to [use MongoChef](documentdb-mongodb-mongochef.md) with a DocumentDB with protocol support for MongoDB account.
- Explore DocumentDB with protocol support for MongoDB [samples](documentdb-mongodb-samples.md).

 
