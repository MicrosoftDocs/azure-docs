---
title: MongoDB extension commands
titleSuffix: Azure Cosmos DB for MongoDB 
description: This article describes how to use MongoDB extension commands to manage data stored in Azure Cosmos DB for MongoDB.  
author: gahl-levy
ms.author: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: sample
ms.date: 02/27/2023
ms.devlang: javascript
ms.custom: ignite-2022
---

# Use MongoDB extension commands to manage data stored in Azure Cosmos DB for MongoDB

[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

The following document contains the custom action commands that are specific to Azure Cosmos DB for MongoDB. These commands can be used to create and obtain database resources that are specific to the [Azure Cosmos DB capacity model](../resource-model.md).

By using Azure Cosmos DB for MongoDB, you can enjoy the shared benefits of Azure Cosmos DB. These benefits include, but aren't limited to:

* Global distribution
* Automatic sharding
* High availability
* Latency guarantees
* Encryption at rest
* Backups

You can enjoy these benefits while preserving your investments in your existing MongoDB application\[s\]. You can communicate with the Azure Cosmos DB for MongoDB by using any of the open-source [MongoDB client drivers](https://docs.mongodb.org/ecosystem/drivers). The Azure Cosmos DB for MongoDB enables the use of existing client drivers by adhering to the [MongoDB wire protocol](https://docs.mongodb.org/manual/reference/mongodb-wire-protocol).

## MongoDB protocol support

Azure Cosmos DB for MongoDB is compatible with MongoDB server version 4.0, 3.6, and 3.2. For more information, see supported features and syntax in versions [4.0](feature-support-40.md), [3.6](feature-support-36.md), and [3.2](feature-support-32.md).

The following extension commands create and modify Azure Cosmos DB-specific resources via database requests:

* [Create database](#create-database)
* [Update database](#update-database)
* [Get database](#get-database)
* [Create collection](#create-collection)
* [Update collection](#update-collection)
* [Get collection](#get-collection)

## <a id="create-database"></a> Create database

The create database extension command creates a new MongoDB database. The database name can be used from the database context set by the `use database` command. The following table describes the parameters within the command:

| Field | Type | Description |
| --- | --- | --- |
| `customAction` | `string` | Name of the custom command. The value must be `CreateDatabase`. |
| `offerThroughput` | `int` | Provisioned throughput that you set on the database. This parameter is optional. |
| `autoScaleSettings` | `Object` | Required for [Autoscale mode](../provision-throughput-autoscale.md). This object contains the settings associated with the Autoscale capacity mode. You can set up the `maxThroughput` value, which describes the highest number of Request Units that the collection can increase to dynamically. |

### Output

If the command is successful, it returns the following response:

```javascript
{ "ok" : 1 }
```

See the [default output](#default-output) of custom command for the parameters in the output.

### Example: Create a database

To create a database named `"test"` that uses all the default values, use the following command:

```javascript
use test
db.runCommand({customAction: "CreateDatabase"});
```

This command creates a database without database-level throughput. This operation means that the collections within this database need to specify the amount of throughput that you need to use.

### Example: Create a database with throughput

To create a database named `"test"` and to specify a [database-level](../set-throughput.md#set-throughput-on-a-database) provisioned throughput of 1000 RUs, use the following command:

```javascript
use test
db.runCommand({customAction: "CreateDatabase", offerThroughput: 1000 });
```

This command creates a database and sets a throughput to it. All collections within this database share the set throughput, unless the collections are created with [a specific throughput level](../set-throughput.md#set-throughput-on-a-database-and-a-container).

### Example: Create a database with Autoscale throughput

To create a database named `"test"` and to specify an Autoscale max throughput of 20,000 RU/s at [database-level](../set-throughput.md#set-throughput-on-a-database), use the following command:

```javascript
use test
db.runCommand({customAction: "CreateDatabase", autoScaleSettings: { maxThroughput: 20000 } });
```

## <a id="update-database"></a> Update database

The update database extension command updates the properties associated with the specified database. Changing your database from provisioned throughput to autoscale and vice-versa is only supported in the Azure portal. The following table describes the parameters within the command:

| Field | Type | Description |
| --- | --- | --- |
| `customAction` | `string` | Name of the custom command. The value must be `UpdateDatabase`. |
| `offerThroughput` | `int` | New provisioned throughput that you want to set on the database if the database uses [database-level throughput](../set-throughput.md#set-throughput-on-a-database) |
| `autoScaleSettings` | `Object` | Required for [Autoscale mode](../provision-throughput-autoscale.md). This object contains the settings associated with the Autoscale capacity mode. You can set up the `maxThroughput` value, which describes the highest number of Request Units that the database can be increased to dynamically. |

This command uses the database specified in the context of the session. This database is the same one you used in the `use <database>` command. At the moment, the database name can't be changed using this command.

### Output

If the command is successful, it returns the following response:

```javascript
{ "ok" : 1 }
```

See the [default output](#default-output) of custom command for the parameters in the output.

### Example: Update the provisioned throughput associated with a database

To update the provisioned throughput of a database with name `"test"` to 1200 RUs, use the following command:

```javascript
use test
db.runCommand({customAction: "UpdateDatabase", offerThroughput: 1200 });
```

### Example: Update the Autoscale throughput associated with a database

To update the provisioned throughput of a database with name `"test"` to 20,000 RUs, or to transform it to an [Autoscale throughput level](../provision-throughput-autoscale.md), use the following command:

```javascript
use test
db.runCommand({customAction: "UpdateDatabase", autoScaleSettings: { maxThroughput: 20000 } });
```

## <a id="get-database"></a> Get database

The get database extension command returns the database object. The database name is used from the database context against which the command is executed.

```javascript
{
  customAction: "GetDatabase"
}
```

The following table describes the parameters within the command:

| Field | Type | Description |
| --- | --- | --- |
| `customAction` | `string` | Name of the custom command. The value must be `GetDatabase`. |

### Output

If the command succeeds, the response contains a document with the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `ok` | `int` | Status of response. 1 == success. 0 == failure. |
| `database` | `string` | Name of the database. |
| `provisionedThroughput` | `int` | Provisioned throughput that is set on the database if the database is using  [manual database-level throughput](../set-throughput.md#set-throughput-on-a-database) |
| `autoScaleSettings` | `Object` | This object contains the capacity parameters associated with the database if it's using the [Autoscale mode](../provision-throughput-autoscale.md). The `maxThroughput` value describes the highest number of Request Units that the database can be increased to dynamically. |

If the command fails, a default custom command response is returned. See the [default output](#default-output) of custom command for the parameters in the output.

### Example: Get the database

To get the database object for a database named `"test"`, use the following command:

```javascript
use test
db.runCommand({customAction: "GetDatabase"});
```

If the database has no associated throughput, the output would be:

```javascript
{ "database" : "test", "ok" : 1 }
```

If the database has a [database-level manual throughput](../set-throughput.md#set-throughput-on-a-database) associated with it, the output would show the `provisionedThroughput` values:

```javascript
{ "database" : "test", "provisionedThroughput" : 20000, "ok" : 1 }
```

If the database has a [database-level Autoscale throughput](../provision-throughput-autoscale.md) associated with it, the output would show the `provisionedThroughput`, which describes the minimum RU/s for the database, and the `autoScaleSettings` object including the `maxThroughput`, which describes the maximum RU/s for the database.

```javascript
{
        "database" : "test",
        "provisionedThroughput" : 2000,
        "autoScaleSettings" : {
                "maxThroughput" : 20000
        },
        "ok" : 1
}
```

## <a id="create-collection"></a> Create collection

The create collection extension command creates a new MongoDB collection. The database name is used from the databases context set by the `use database` command. The format of the CreateCollection command is as follows:

```javascript
{
  customAction: "CreateCollection",
  collection: "<Collection Name>",
  shardKey: "<Shard key path>",
  // Replace the line below with "autoScaleSettings: { maxThroughput: (int) }" to use Autoscale instead of Provisioned Throughput. Fill the required Autoscale max throughput setting.
  offerThroughput: (int) // Provisioned Throughput enabled with required throughput amount set.
  indexes: [{key: {_id: 1}, name: "_id_1"}, ... ] // Optional indexes (3.6+ accounts only).
}
```

The following table describes the parameters within the command:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `customAction` | `string` | Required | Name of the custom command. The value must be `CreateCollection`. |
| `collection` | `string` | Required | Name of the collection. No special characters or spaces are allowed. |
| `offerThroughput` | `int` | Optional | Provisioned throughput to set on the database. If this parameter isn't provided, it defaults to the minimum, 400 RU/s. * To specify throughput beyond 10,000 RU/s, the `shardKey` parameter is required. |
| `shardKey` | `string` | Required for collections with large throughput | The path to the Shard Key for the sharded collection. This parameter is required if you set more than 10,000 RU/s in `offerThroughput`.  If it's specified, all documents inserted require this key and value. |
| `autoScaleSettings` | `Object` | Required for [Autoscale mode](../provision-throughput-autoscale.md) | This object contains the settings associated with the Autoscale capacity mode. You can set up the `maxThroughput` value, which describes the highest number of Request Units that the collection can be increased to dynamically. |
| `indexes` | `Array` | Optionally configure indexes. This parameter is supported for 3.6+ accounts only. | When present, an index on _id is required. Each entry in the array must include a key of one or more fields, a name, and may contain index options. For example, to create a compound unique index on the fields `a` and `b` use this entry: `{key: {a: 1, b: 1}, name:"a_1_b_1", unique: true}`. |

### Output

Returns a default custom command response. See the [default output](#default-output) of custom command for the parameters in the output.

### Example: Create a collection with the minimum configuration

To create a new collection with name `"testCollection"` and the default values, use the following command:

```javascript
use test
db.runCommand({customAction: "CreateCollection", collection: "testCollection"});
```

This operation results in a new fixed, unsharded, collection with 400RU/s and an index on the `_id` field automatically created. This type of configuration also applies when creating new collections via the `insert()` function. For example:

```javascript
use test
db.newCollection.insert({});
```

### Example: Create an unsharded collection

To create an unsharded collection with name `"testCollection"` and provisioned throughput of 1000 RUs, use the following command:

```javascript
use test
db.runCommand({customAction: "CreateCollection", collection: "testCollection", offerThroughput: 1000});
```

You can create a collection with up to 10,000 RU/s as the `offerThroughput` without needing to specify a shard key. For collections with larger throughput, check out the next section.

### Example: Create a sharded collection

To create a sharded collection with name `"testCollection"` and provisioned throughput of 11,000 RUs, and a `shardkey` property "a.b", use the following command:

```javascript
use test
db.runCommand({customAction: "CreateCollection", collection: "testCollection", offerThroughput: 11000, shardKey: "a.b" });
```

This command now requires the `shardKey` parameter, since more than 10,000 RU/s specified in the `offerThroughput`.

### Example: Create an unsharded Autoscale collection

To create an unsharded collection named `'testCollection'` that uses [Autoscale throughput capacity](../provision-throughput-autoscale.md) set to 4,000 RU/s, use the following command:

```javascript
use test
db.runCommand({ 
    customAction: "CreateCollection", collection: "testCollection", 
    autoScaleSettings:{
      maxThroughput: 4000
    } 
});
```

For the `autoScaleSettings.maxThroughput` value, you can specify a range from 4,000 RU/s to 10,000 RU/s without a shard key. For higher autoscale throughput, you need to specify the `shardKey` parameter.

### Example: Create a sharded Autoscale collection

To create a sharded collection named `'testCollection'` with a shard key called `'a.b'`, and that uses [Autoscale throughput capacity](../provision-throughput-autoscale.md) set to 20,000 RU/s, use the following command:

```javascript
use test
db.runCommand({customAction: "CreateCollection", collection: "testCollection", shardKey: "a.b", autoScaleSettings: { maxThroughput: 20000 }});
```

## <a id="update-collection"></a> Update collection

The update collection extension command updates the properties associated with the specified collection. Changing your collection from provisioned throughput to autoscale and vice-versa is only supported in the Azure portal.

```javascript
{
  customAction: "UpdateCollection",
  collection: "<Name of the collection that you want to update>",
  // Replace the line below with "autoScaleSettings: { maxThroughput: (int) }" if using Autoscale instead of Provisioned Throughput. Fill the required Autoscale max throughput setting. Changing between Autoscale and Provisioned throughput is only supported in the Azure Portal.
  offerThroughput: (int) // Provisioned Throughput enabled with required throughput amount set.
  indexes: [{key: {_id: 1}, name: "_id_1"}, ... ] // Optional indexes (3.6+ accounts only).
}
```

The following table describes the parameters within the command:

| Field | Type | Description |
| --- | --- | --- |
| `customAction` | `string` | Name of the custom command. The value must be `UpdateCollection`. |
| `collection` | `string` | Name of the collection. |
| `offerThroughput` | `int` | Provisioned throughput to set on the collection. |
| `autoScaleSettings` | `Object` | Required for [Autoscale mode](../provision-throughput-autoscale.md). This object contains the settings associated with the Autoscale capacity mode. The `maxThroughput` value describes the highest number of Request Units that the collection can be increased to dynamically. |
| `indexes` | `Array` | Optionally configure indexes. This parameter is supported for 3.6+ accounts only. When present, the set of indexes specified (including dropping indexes) replaces the existing indexes of the collection. An index on _id is required. Each entry in the array must include a key of one or more fields, a name, and may contain index options. For example, to create a compound unique index on the fields a and b use this entry: `{key: {a: 1, b: 1}, name: "a_1_b_1", unique: true}`. |

### Output

Returns a default custom command response. See the [default output](#default-output) of custom command for the parameters in the output.

### Example: Update the provisioned throughput associated with a collection

To update the provisioned throughput of a collection with name `"testCollection"` to 1200 RUs, use the following command:

```javascript
use test
db.runCommand({customAction: "UpdateCollection", collection: "testCollection", offerThroughput: 1200 });
```

## <a id="get-collection"></a> Get collection

The get collection custom command returns the collection object.

```javascript
{
  customAction: "GetCollection",
  collection: "<Name of the collection>"
}
```

The following table describes the parameters within the command:

| Field | Type | Description |
| --- | --- | --- |
| `customAction` | `string` | Name of the custom command. The value must be `GetCollection`. |
| `collection` | `string` | Name of the collection. |

### Output

If the command succeeds, the response contains a document with the following fields

| Field | Type | Description |
| --- | --- | --- |
| `ok` | `int` | Status of response. 1 == success. 0 == failure. |
| `database` | `string` | Name of the database. |
| `collection` | `string` | Name of the collection. |
| `shardKeyDefinition` | `document` | Index specification document used as a shard key. This field is an optional response parameter. |
| `provisionedThroughput` | `int` | Provisioned Throughput to set on the collection. This field is an optional response parameter. |
| `autoScaleSettings` | `Object` | This object contains the capacity parameters associated with the database if it's using the [Autoscale mode](../provision-throughput-autoscale.md). The `maxThroughput` value describes the highest number of Request Units that the collection can be increased to dynamically. |

If the command fails, a default custom command response is returned. See the [default output](#default-output) of custom command for the parameters in the output.

### Example: Get the collection

To get the collection object for a collection named `"testCollection"`, use the following command:

```javascript
use test
db.runCommand({customAction: "GetCollection", collection: "testCollection"});
```

If the collection has an associated throughput capacity to it, it includes the `provisionedThroughput` value, and the output would be:

```javascript
{
        "database" : "test",
        "collection" : "testCollection",
        "provisionedThroughput" : 400,
        "ok" : 1
}
```

If the collection has an associated Autoscale throughput, it includes the `autoScaleSettings` object with the `maxThroughput` parameter, which defines the maximum throughput the collection increases to dynamically. Additionally, it also includes the `provisionedThroughput` value, which defines the minimum throughput this collection reduces to if there are no requests in the collection:

```javascript
{
        "database" : "test",
        "collection" : "testCollection",
        "provisionedThroughput" : 1000,
        "autoScaleSettings" : {
            "maxThroughput" : 10000
        },
        "ok" : 1
}
```

If the collection is sharing [database-level throughput](../set-throughput.md#set-throughput-on-a-database), either on Autoscale mode or manual, the output would be:

```javascript
{ "database" : "test", "collection" : "testCollection", "ok" : 1 }
```

```javascript
{
        "database" : "test",
        "provisionedThroughput" : 2000,
        "autoScaleSettings" : {
            "maxThroughput" : 20000
        },
        "ok" : 1
}
```

## <a id="parallel-change-stream"></a> Parallelizing change streams

When using [change streams](change-streams.md) at scale, it's best to evenly spread the load. The following command returns one or more change stream resume tokens - each one corresponding to data from a single physical shard/partition (multiple logical shards/partitions can exist on one physical partition). Each resume token causes watch() to only return data from that physical shard/partition.

Use `db.collection.watch()` on each resume token (one thread per token), to scale change streams efficiently.

```javascript
{
        customAction: "GetChangeStreamTokens", 
        collection: "<Name of the collection>", 
        startAtOperationTime: "<BSON Timestamp>" // Optional. Defaults to the time the command is run.
} 
```

### Example: Get the stream token

Run the custom command to get a resume token for each physical shard/partition.

```javascript
use test
db.runCommand({customAction: "GetChangeStreamTokens", collection: "<Name of the collection>"})
```

Run a watch() thread/process for each resume token returned from the GetChangeStreamTokens custom command. Here's an example for one thread.

```javascript
db.test_coll.watch([{ $match: { "operationType": { $in: ["insert", "update", "replace"] } } }, { $project: { "_id": 1, "fullDocument": 1, "ns": 1, "documentKey": 1 } }], 
{fullDocument: "updateLookup", 
resumeAfter: { "_data" : BinData(0,"eyJWIjoyLCJSaWQiOiJQeFVhQUxuMFNLRT0iLCJDb250aW51YXRpb24iOlt7IkZlZWRSYW5nZSI6eyJ0eXBlIjoiRWZmZWN0aXZlIFBhcnRpdGlvbiBLZXkgUmFuZ2UiLCJ2YWx1ZSI6eyJtaW4iOiIiLCJtYXgiOiJGRiJ9fSwiU3RhdGUiOnsidHlwZSI6ImNvbnRpbndkFLbiIsInZhbHVlIjoiXCIxODQ0XCIifX1dfQ=="), "_kind" : NumberInt(1)}})
```

The document (value) in the resumeAfter field represents the resume token. The command `watch()` returns a curser for all documents that were inserted, updated, or replaced from that physical partition since the GetChangeStreamTokens custom command was run. A sample of the data returned is included here.

```javascript
{
  "_id": {
    "_data": BinData(0,
    "eyJWIjoyLCJSaWQiOiJQeFVhQUxuMFNLRT0iLCJDfdsfdsfdsft7IkZlZWRSYW5nZSI6eyJ0eXBlIjoiRWZmZWN0aXZlIFBhcnRpdGlvbiBLZXkgUmFuZ2UiLCJ2YWx1ZSI6eyJtaW4iOiIiLCJtYXgiOiJGRiJ9fSwiU3RhdGUiOnsidHlwZSI6ImNvbnRpbnVhdGlvbiIsInZhbHVlIjoiXCIxOTgwXCIifX1dfQ=="),
    "_kind": 1
  },
  "fullDocument": {
    "_id": ObjectId("60da41ec9d1065b9f3b238fc"),
    "name": John,
    "age": 6
  },
  "ns": {
    "db": "test-db",
    "coll": "test_coll"
  },
  "documentKey": {
    "_id": ObjectId("60da41ec9d1065b9f3b238fc")
  }
}
```

Each document returned includes a resume token (they're all the same for each page). This resume token should be stored and reused if the thread/process dies. This resume token picks up from where you left off, and receive data only from that physical partition.

## <a id="default-output"></a> Default output of a custom command

If not specified, a custom response contains a document with the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `ok` | `int` | Status of response. 1 == success. 0 == failure. |
| `code` | `int` | Only returned when the command failed (that is, ok == 0). Contains the MongoDB error code. This field is an optional response parameter. |
| `errMsg` | `string` | Only returned when the command failed (that is, ok == 0). Contains a user-friendly error message. This field is an optional response parameter. |

For example:

```javascript
{ "ok" : 1 }
```

## Next steps

Next you can proceed to learn the following Azure Cosmos DB concepts:

* [Indexing in Azure Cosmos DB](../index-policy.md)
* [Expire data in Azure Cosmos DB automatically with time to live](../time-to-live.md)
