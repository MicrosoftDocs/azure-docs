---
title: MongoDB extension commands to manage data stored in Azure Cosmos DB’s API for MongoDB 
description: This article describes how to use MongoDB extension commands to manage data stored in Azure Cosmos DB’s API for MongoDB.  
author: SnehaGunda
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/26/2019
ms.author: sngun
---

# Use MongoDB extension commands to manage data stored in Azure Cosmos DB’s API for MongoDB 

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can communicate with the Azure Cosmos DB’s API for MongoDB by using any of the open source [MongoDB client drivers](https://docs.mongodb.org/ecosystem/drivers). The Azure Cosmos DB’s API for MongoDB enables the use of existing client drivers by adhering to the [MongoDB wire protocol](https://docs.mongodb.org/manual/reference/mongodb-wire-protocol).

By using the Azure Cosmos DB’s API for MongoDB, you can enjoy the benefits Cosmos DB such as global distribution, automatic sharding, high availability, latency guarantees, automatic, encryption at rest, backups, and many more, while preserving your investments in your MongoDB app.

## MongoDB protocol support

By default, the Azure Cosmos DB’s API for MongoDB is compatible with MongoDB server version 3.2, for more details, see [supported features and syntax](mongodb-feature-support.md). The features or query operators added in MongoDB version 3.4 are currently available as a preview in the Azure Cosmos DB’s API for MongoDB. The following extension commands support Azure Cosmos DB specific functionality when performing CRUD operations on the data stored in Azure Cosmos DB’s API for MongoDB:

* [Create database](#create-database)
* [Update database](#update-database)
* [Get database](#get-database)
* [Create collection](#create-collection)
* [Update collection](#update-collection)
* [Get collection](#get-collection)

## <a id="create-database"></a> Create database

The create database extension command creates a new MongoDB database. The database name is used from the databases context against which the command is executed. The format of the CreateDatabase command is as follows:

```
{
  customAction: "CreateDatabase",
  offerThroughput: <Throughput that you want to provision on the database>
}
```

The following table describes the parameters within the command:

|**Field**|**Type** |**Description** |
|---------|---------|---------|
| customAction   |  string  |   Name of the custom command, it must be "CreateDatabase".      |
| offerThroughput | int  | Provisioned throughput that you set on the database. This parameter is optional. |

### Output

Returns a default custom command response. See the [default output](#default-output) of custom command for the parameters in the output.

### Examples

**Create a database**

To create a database named "test", use the following command:

```shell
use test
db.runCommand({customAction: "CreateDatabase"});
```

**Create a database with throughput**

To create a database named "test" and provisioned throughput of 1000 RUs, use the following command:

```shell
use test
db.runCommand({customAction: "CreateDatabase", offerThroughput: 1000 });
```

## <a id="update-database"></a> Update database

The update database extension command updates the properties associated with the specified database. Currently, you can only update the "offerThroughput" property.

```
{
  customAction: "UpdateDatabase",
  offerThroughput: <New throughput that you want to provision on the database> 
}
```

The following table describes the parameters within the command:

|**Field**|**Type** |**Description** |
|---------|---------|---------|
| customAction    |    string     |   Name of the custom command. Must be "UpdateDatabase".      |
|  offerThroughput   |  int       |     New provisioned throughput that you want to set on the database.    |

### Output

Returns a default custom command response. See the [default output](#default-output) of custom command for the parameters in the output.

### Examples

**Update the provisioned throughput associated with a database**

To update the provisioned throughput of a database with name "test" to 1200 RUs, use the following command:

```shell
use test
db.runCommand({customAction: "UpdateDatabase", offerThroughput: 1200 });
```

## <a id="get-database"></a> Get database

The get database extension command returns the database object. The database name is used from the database context against which the command is executed.

```
{
  customAction: "GetDatabase"
}
```

The following table describes the parameters within the command:


|**Field**|**Type** |**Description** |
|---------|---------|---------|
|  customAction   |   string      |   Name of the custom command. Must be "GetDatabase"|
		
### Output

If the command succeeds, the response contains a document with the following fields:

|**Field**|**Type** |**Description** |
|---------|---------|---------|
|  `ok`   |   `int`     |   Status of response. 1 == success. 0 == failure.      |
| `database`    |    `string`	     |   Name of the database.      |
|   `provisionedThroughput`  |    `int`	     |    Provisioned throughput that is set on the database. This is an optional response parameter.     |

If the command fails, a default custom command response is returned. See the [default output](#default-output) of custom command for the parameters in the output.

### Examples

**Get the database**

To get the database object for a database named "test", use the following command:

```shell
use test
db.runCommand({customAction: "GetDatabase"});
```

## <a id="create-collection"></a> Create collection

The create collection extension command creates a new MongoDB collection. The database name is used from the databases context against which the command is executed. The format of the CreateCollection command is as follows:

```
{
  customAction: "CreateCollection",
  collection: <Collection Name>,
  offerThroughput: <Throughput that you want to provision on the collection>,
  shardKey: <Shard key path>  
}
```

The following table describes the parameters within the command:

|**Field**|**Type** |**Description** |
|---------|---------|---------|
| customAction    | string | Name of the custom command. Must be "CreateCollection"     |
| collection      | string | Name of the collection                                   |
| offerThroughput | int    | Provisioned Throughput to set on the database. It's an Optional parameter |
| shardKey        | string | Shard Key path to create a sharded collection. It's an Optional parameter |

### Output

Returns a default custom command response. See the [default output](#default-output) of custom command for the parameters in the output.

### Examples

**Create a unsharded collection**

To create a unsharded collection with name "testCollection" and provisioned throughput of 1000 RUs, use the following command: 

```shell
use test
db.runCommand({customAction: "CreateCollection", collection: "testCollection", offerThroughput: 1000});
``` 

**Create a sharded collection**

To create a sharded collection with name "testCollection" and provisioned throughput of 1000 RUs, use the following command:

```shell
use test
db.runCommand({customAction: "CreateCollection", collection: "testCollection", offerThroughput: 1000, shardKey: "a.b" });
```

## <a id="update-collection"></a> Update collection

The update collection extension command updates the properties associated with the specified collection.

```
{
  customAction: "UpdateCollection",
  collection: <Name of the collection that you want to update>,
  offerThroughput: <New throughput that you want to provision on the collection> 
}
```

The following table describes the parameters within the command:

|**Field**|**Type** |**Description** |
|---------|---------|---------|
|  customAction   |   string      |   Name of the custom command. Must be "UpdateCollection".      |
|  collection   |   string      |  	Name of the collection.       |
| offerThroughput	|int|	Provisioned throughput to set on the collection.|

## Output

Returns a default custom command response. See the [default output](#default-output) of custom command for the parameters in the output.

### Examples

**Update the provisioned throughput associated with a collection**

To update the provisioned throughput of a collection with name "testCollection" to 1200 RUs, use the following command:

```shell
use test
db.runCommand({customAction: "UpdateCollection", collection: "testCollection", offerThroughput: 1200 });
```

## <a id="get-collection"></a> Get collection

The get collection custom command returns the collection object.

```
{
  customAction: "GetCollection",
  collection: <Name of the collection>
}
```

The following table describes the parameters within the command:


|**Field**|**Type** |**Description** |
|---------|---------|---------|
| customAction    |   string      |   Name of the custom command. Must be "GetCollection".      |
| collection    |    string     |    Name of the collection.     |

### Output

If the command succeeds, the response contains a document with the following fields


|**Field**|**Type** |**Description** |
|---------|---------|---------|
|  `ok`   |    `int`     |   Status of response. 1 == success. 0 == failure.      |
| `database`    |    `string`     |   Name of the database.      |
| `collection`    |    `string`     |    Name of the collection.     |
|  `shardKeyDefinition`   |   `document`      |  Index specification document used as a shard key. This is an optional response parameter.       |
|  `provisionedThroughput`   |   `int`      |    Provisioned Throughput to set on the collection. This is an optional response parameter.     |

If the command fails, a default custom command response is returned. See the [default output](#default-output) of custom command for the parameters in the output.

### Examples

**Get the collection**

To get the collection object for a collection named "testCollection", use the following command:

```shell
use test
db.runCommand({customAction: "GetCollection", collection: "testCollection"});
```

## <a id="default-output"></a> Default output of a custom command

If not specified, a custom response contains a document with the following fields:

|**Field**|**Type** |**Description** |
|---------|---------|---------|
|  `ok`   |    `int`     |   Status of response. 1 == success. 0 == failure.      |
| `code`    |   `int`      |   Only returned when the command failed (i.e. ok == 0). Contains the MongoDB error code. This is an optional response parameter.      |
|  `errMsg`   |  `string`      | 	Only returned when the command failed (i.e. ok == 0). Contains a user-friendly error message. This is an optional response parameter.      |

## Next steps

Next you can proceed to learn the following Azure Cosmos DB concepts: 

* [Indexing in Azure Cosmos DB](../cosmos-db/index-policy.md)
* [Expire data in Azure Cosmos DB automatically with time to live](../cosmos-db/time-to-live.md)
