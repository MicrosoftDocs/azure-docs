---
title: Custom commands for MongoDB
description: This article describes how to use custom commands to manage data stored in Azure Cosmos DB for MongoDB API.  
author: SnehaGunda
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 03/26/2019
ms.author: sngun
---

# Use custom commands to manage data stored in Azure Cosmos DB for MongoDB API 

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can communicate with the Azure Cosmos DB for MongoDB API by using any of the open source [MongoDB client drivers](https://docs.mongodb.org/ecosystem/drivers). The Azure Cosmos DB for MongoDB API enables the use of existing client drivers by adhering to the [MongoDB wire protocol](https://docs.mongodb.org/manual/reference/mongodb-wire-protocol).

By using the Azure Cosmos DB for MongoDB API, you can enjoy the benefits of the MongoDB that you're already used to, along with the enterprise capabilities that Azure Cosmos DB provides such as global distribution, automatic sharding, availability and latency guarantees, automatic indexing of every field, encryption at rest, backups, and many more.

## MongoDB protocol support

By default, the Azure Cosmos DB for MongoDB API is compatible with MongoDB server version 3.2. The following custom commands support Azure Cosmos DB specific functionality when performing CRUD operations on the data stored in Azure Cosmos DB for MongoDB API:

* [Create Database](#create-database)
* [Update Database](#update-database)
* [Get Database](#get-database)
* [Create Collection](#create-collection)
* [Update Collection](#update-collection)
* [Get Collection](#get-collection)

## <a id="create-database"></a> Create Database

The create database custom command creates a new MongoDB database. The database name is used from the databases context against which the command is executed. The format of the CreateDatabase command is as follows:

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

Returns a default custom command response. See the [default output]() of custom command for the parameters in the output.

### Examples

**Create a database**

To create a database named "test", use the following command:

```bash
use test
db.runCommand({customAction: "CreateDatabase"});
```

**Create a database with throughput**

To create a database named "test" and provisioned throughput of 1000 RUs, use the following command:

```bash
use test
db.runCommand({customAction: "CreateDatabase", offerThroughput: 1000 });
```

## <a id="update-database"></a> Update Database

The update database custom command updates the properties associated with the specified database. Currently, you can only update the "offerThroughput" property.

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

Returns a default custom command response. See the [default output]() of custom command for the parameters in the output.

### Examples

**Update the provisioned throughput associated with a database**

To update the provisioned throughput of a database with name "test" to 1200 RUs, use the following command:

```bash
use test
db.runCommand({customAction: "UpdateDatabase", offerThroughput: 1200 });
```

## <a id="get-database"></a> Get Database

The get database custom command returns the database object. The database name is used from the database context against which the command is executed.

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

If the command fails, a default custom command response is returned. See the [default output]() of custom command for the parameters in the output.

### Examples

**Get the database**

To get the database object for a database named "test", use the following command:

```bash
use test
db.runCommand({customAction: "GetDatabase"});
```

## <a id="update-collection"></a> Update Collection

The update collection custom command updates the properties associated with the specified collection.

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

Returns a default custom command response. See the [default output]() of custom command for the parameters in the output.

### Examples

**Update the provisioned throughput associated with a collection**

To update the provisioned throughput of a collection with name "testCollection" to 1200 RUs, use the following command:

```bash
use test
db.runCommand({customAction: "UpdateCollection", collection: "testCollection", offerThroughput: 1200 });
```

## <a id="get-collection"></a> Get Collection

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

If the command fails, a default custom command response is returned. See the [default output]() of custom command for the parameters in the output.

### Examples

**Get the collection**

To get the collection object for a collection named "testCollection", use the following command:

```bash
use test
db.runCommand({customAction: "GetCollection", collection: "testCollection"});
```

**Default output of a custom command**

If not specified, a custom response contains a document with the following fields:

|**Field**|**Type** |**Description** |
|---------|---------|---------|
|  `ok`   |    `int`     |   Status of response. 1 == success. 0 == failure.      |
| `code`    |   `int`      |   Only returned when the command failed (i.e. ok == 0). Contains the MongoDB error code. This is an optional response parameter.      |
|  `errMsg`   |  `string`      | 	Only returned when the command failed (i.e. ok == 0). Contains a user-friendly error message. This is an optional response parameter.      |

## Next steps

