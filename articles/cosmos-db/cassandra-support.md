---
title: Apache Cassandra features & commands supported by Azure Cosmos DB Cassandra API
description: Learn about the Apache Cassandra feature support in Azure Cosmos DB Cassandra API
services: cosmos-db
author: kanshiG
ms.author: govindk
ms.reviewer: sngun

ms.service: cosmos-db
ms.component: cosmosdb-cassandra
ms.topic: overview
ms.date: 09/24/2018
---

# Apache Cassandra features supported by Azure Cosmos DB Cassandra API 

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can communicate with the Azure Cosmos DB Cassandra API through Cassandra Query Language (CQL) v4 [wire protocol](https://github.com/apache/cassandra/blob/trunk/doc/native_protocol_v4.spec) compliant open-source Cassandra client [drivers](http://cassandra.apache.org/doc/latest/getting_started/drivers.html?highlight=driver). 

By using the Azure Cosmos DB Cassandra API, you can enjoy the benefits of the Apache Cassandra APIs as well as the enterprise capabilities that Azure Cosmos DB provides. The enterprise capabilities include [global distribution](distribute-data-globally.md), [automatic scale out partitioning](partition-data.md), availability and latency guarantees, encryption at rest, backups, and much more.

## Cassandra protocol 

The Azure Cosmos DB Cassandra API is compatible with CQL version **v4**. The supported CQL commands, tools, limitations, and exceptions are listed below. Any client driver that understands these protocols should be able to connect to Azure Cosmos DB Cassandra API.

## Cassandra driver

The following versions of Cassandra drivers are supported by Azure Cosmos DB Cassandra API:

* [Java 3.5+](https://github.com/datastax/java-driver)  
* [C# 3.5+](https://github.com/datastax/csharp-driver)  
* [Nodejs 3.5+](https://github.com/datastax/nodejs-driver)  
* [Python 3.15+](https://github.com/datastax/python-driver)  
* [C++ 2.9](https://github.com/datastax/cpp-driver)   
* [PHP 1.3](https://github.com/datastax/php-driver)  
* [Gocql](https://github.com/gocql/gocql)  
 
## CQL data types 

Azure Cosmos DB Cassandra API supports the following CQL data types:

* ascii  
* bigint  
* blob  
* boolean  
* counter  
* date  
* decimal  
* double  
* float  
* frozen  
* inet  
* int  
* list  
* set  
* smallint  
* text  
* time  
* timestamp  
* timeuuid  
* tinyint  
* tuple  
* uuid  
* varchar  
* varint  
* tuples  
* udts  
* map  

## CQL functions

Azure Cosmos DB Cassandra API supports the following CQL functions:

* Token  
* Blob conversion functions 
  * typeAsBlob(value)  
  * blobAsType(value)
* UUID and timeuuid functions 
  * dateOf()  
  * now()  
  * minTimeuuid()  
  * unixTimestampOf()  
  * toDate(timeuuid)  
  * toTimestamp(timeuuid)  
  * toUnixTimestamp(timeuuid)  
  * toDate(timestamp)  
  * toUnixTimestamp(timestamp)  
  * toTimestamp(date)  
  * toUnixTimestamp(date)  


## Cassandra Query Language limits

Azure Cosmos DB Cassandra API does not have any limits on the size of data stored in a table. Hundreds of terabytes or Petabytes of data can be stored while ensuring partition key limits are honored. Similarly every entity or row equivalent does not have any limits on the number of columns however the total size of the entity should not exceed 2 MB.

## Tools 

Azure Cosmos DB Cassandra API is a managed service platform. It does not require any management overhead or utilities such as Garbage Collector, Java Virtual Machine(JVM), and nodetool to manage the cluster. It supports tools such as cqlsh that utilizes Binary CQLv4 compatibility. 

* Azure portal's data explorer, metrics, log diagnostics, PowerShell, and cli are other supported mechanisms to manage the account.

## CQL Shell  

CQLSH command-line utility comes with Apache Cassandra 3.1.1 and works out of box with following environment variables enabled:

Before running the following commands, [add a Baltimore root certificate to the cacerts store](https://docs.microsoft.com/java/azure/java-sdk-add-certificate-ca-store?view=azure-java-stable#to-add-a-root-certificate-to-the-cacerts-store). 

**Windows:** 

```bash
set SSL_VERSION=TLSv1_2 
SSL_CERTIFICATE=<path to Baltimore root ca cert>
set CQLSH_PORT=10350 
cqlsh <YOUR_ACCOUNT_NAME>.cassandra.cosmosdb.azure.com 10350 -u <YOUR_ACCOUNT_NAME> -p <YOUR_ACCOUNT_PASSWORD> –ssl 
```
**Unix/Linux/Mac:**

```bash
export SSL_VERSION=TLSv1_2 
export SSL_CERTFILE=<path to Baltimore root ca cert>
cqlsh <YOUR_ACCOUNT_NAME>.cassandra.cosmosdb.azure.com 10350 -u <YOUR_ACCOUNT_NAME> -p <YOUR_ACCOUNT_PASSWORD> –ssl 
```

## CQL commands

Azure Cosmos DB supports the following database commands on Cassandra API accounts.

* CREATE KEYSPACE 
* CREATE TABLE 
* ALTER TABLE 
* USE 
* INSERT 
* SELECT 
* UPDATE 
* BATCH - Only unlogged commands are supported 
* DELETE

All crud operations when executed through CQLV4 compatible SDK will return extra information about error, request units consumed, activity ID. Delete and update commands need to be handled with resource governance in consideration, to avoid over use of provisioned resources. 
* Note  gc_grace_seconds value must be zero if specified.

```csharp
var tableInsertStatement = table.Insert(sampleEntity); 
var insertResult = await tableInsertStatement.ExecuteAsync(); 
 
foreach (string key in insertResult.Info.IncomingPayload) 
        { 
            byte[] valueInBytes = customPayload[key]; 
            string value = Encoding.UTF8.GetString(valueInBytes); 
            Console.WriteLine($“CustomPayload:  {key}: {value}”); 
        } 
```

## Consistency mapping 

Azure Cosmos DB Cassandra API provides choice of consistency for read operations. All write operations, irrespective of the account consistency are always written with write performance SLAs.

## Permission and role management

Azure Cosmos DB supports role-based access control (RBAC) and read-write and read-only passwords/keys that can be obtained through the [Azure portal](https://portal.azure.com. Azure Cosmos DB does not yet support users and roles for data plane activities. 

## Planned support 
* Using timestamp and TTL together  
* Region name in create keyspace command is ignored at present- Distribution of data is implemented in underlying Cosmos DB platform and exposed via portal or powershell for the account. 





## Next steps

- Get started with [creating a Cassandra API account, database, and a table](create-cassandra-api-account-java.md) by using a Java application

