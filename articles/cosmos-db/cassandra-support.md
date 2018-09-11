---
title: 'Apache Cassandra features & commands supported by Azure Cosmos DB Cassandra API | Microsoft Docs'
description: Learn about the feature support the Azure Cosmos DB Cassandra API
services: cosmos-db
author: govindk
manager: kfile

ms.service: cosmos-db
ms.component: cosmosdb-cassandra
ms.devlang: na
ms.topic: overview
ms.date: 09/10/2018
ms.author: govindk
 
---
# Apache Cassandra features & commands supported by Azure Cosmos DB Cassandra API 

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can communicate with the Azure Cosmos DB Cassandra API through Cassandra Query Language(CQL) v4 [wire protocol](https://github.com/apache/cassandra/blob/trunk/doc/native_protocol_v4.spec) compliant open source Cassandra client [drivers](http://cassandra.apache.org/doc/latest/getting_started/drivers.html?highlight=driver). 

By using the Azure Cosmos DB Cassandra API, you can enjoy the benefits of the Apache Cassandra APIs as well as the enterprise capabilities that Azure Cosmos DB provides. The enterprise capabilities include [global distribution](distribute-data-globally.md), [automatic scale out partitioning](partition-data.md), availability and latency guarantees, encryption at rest, backups, and much more.

## Cassandra protocol 

The Azure Cosmos DB Cassandra API is compatible with CQL version **v4**. The supported CQL commands, tools, limitations and exceptions are listed below. Any client driver that understands these protocols should be able to connect to Azure Cosmos DB Cassandra API.

## Cassandra driver

The following versions of Cassandra drivers are supported by Azure Cosmos DB Cassandra API:

Supported OSS driver | URL 
--- | --- | --- | 
Java 3.5+ | https://github.com/datastax/java-driver
C#  3.5+ | https://github.com/datastax/csharp-driver
Nodejs 3.5+ | https://github.com/datastax/nodejs-driver 
Python 3.15+ | https://github.com/datastax/python-driver   
C++ 2.9 | https://github.com/datastax/cpp-driver   
PHP 1.3 | https://github.com/datastax/php-driver 
Go | https://github.com/gocql/gocql  
 
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
* frozen lists inside list/set/maps

## CQL functions

Azure Cosmos DB Cassandra API supports the following CQL functions:

* Token

## Cassandra Query Language limits

Azure Cosmos DB Cassandra API does not have any limits on the size of data stored in a table. Hundreds of TB or PB of data can be stored while ensuring partition key limits are honored. Similarly every entity or row equivalent does not have any limits on the number of columns however the total size of the entity should not exceed 2 MB.

* Clustering column value length: 65535 (216-1)
* Key length: 65535 
* Table name length: 48 characters
* Keyspace name length: 48 characters
* Parameters in a query: 65535 
* Statements in a batch: 65535 
* Fields in a tuple: 32768 
* Collection (List): total size of the row should not exceed 2 MB. 
* Collection (Set): total size of the row should not exceed 2 MB. 
* Collection (Map): total size of the row should not exceed 2 MB. 
* Blob size: 1.9 MB ( less than 1 MB is recommended)

## Account commands

You can increase or decrease the throughput capacity of a table at any point of time and the maximum provisioned throughput in clock hour (UTC) is charged. Throughput of the table can be changed through Azure CLI, Azure PowerShell or Azure portal.

Creating more than 5 tables per minute has performance impact so it's not a recommended option. When you are working on a test environment or using Cassandra API account in a CI/CD environment, pre-create all the required tables or create tables with different names.


## Tools 

Azure Cosmos DB Cassandra API is a managed service platform. It does not require any management overhead or utilites such as Garbage Collector, Java Virtual Machine(JVM) and nodetool to manage the cluster. It supports tools such as cqlsh that utilizes Binary CQLv4 compatibility.

* cqlsh  

* Azure portal's data explorer, metrics, log diagnostics , pPowersShell and cli are other supported mechanisms to manage the account.

## CQL Shell  

CQLSH command line utility comes with Apache Cassandra 3.1.1 and works out of box with following environment variables enabled:

**Windows:** 

```bash
set SSL_VERSION=TLSv1_2 
set SSL_VALIDATE=false 
set CQLSH_PORT=10350 
cqlsh.py <YOUR_ACCOUNT_NAME>.cassandra.cosmosdb.azure.com 10350 -u <YOUR_ACCOUNT_NAME> -p <YOUR_ACCOUNT_PASSWORD> –ssl 
```
**Unix/Linux/Mac:**

```bash
export SSL_VERSION=TLSv1_2 
export SSL_VALIDATE=false 
cqlsh.py <YOUR_ACCOUNT_NAME>.cassandra.cosmosdb.azure.com 10350 -u <YOUR_ACCOUNT_NAME> -p <YOUR_ACCOUNT_PASSWORD> –ssl 
```

## CQL commands

Azure Cosmos DB supports the following database commands on all Cassandra API accounts.

* ALTER KEYSPACE 

* ALTER TABLE 

* ALTER TYPE - Alter commands are asynchronously executed so they take time to execute.

* USE 

* INSERT 

* SELECT 

* UPDATE 

* CREATE KEYSPACE - The following options of this command are not applicable to Azure Cosmos DB Cassandra API.

  * replication factor is not applicable. By default, Azure Cosmos DB provides majority quorum writes and replicates data to 3 replicas. So, by default, four copies of your data are available within any datacenter.  

  * class option is not applicable because data is always replicated.

  * Durable writes option is not applicable because data is always committed as a quorum.

* CREATE TABLE - The following options of this command are not applicable to Azure Cosmos DB Cassandra API.

  * The bloom filter, caching, dclocal_read_repair_chance, memtable_flush_period_in_ms, min_index_interval, max_index_interval, read_repair_chance, speculative_retry, compression, compaction options are not applicable because Cassandra API is a managed service with CQL V4 compatibility. It does not require read repair, compaction, it doesn't require additional data structures and their management to provide the SLA based performance, and availability.  
 
  * Table is the unit of cost which is constrained by through provisioned by using cqlsh, code or portal. You can create individual tables with specific throughput or create multiple tables as part of shared throughput database. The following command shows how to create a table with a specific throughput by using cqlsh: 

   ``` bash 
   CREATE TABLE keyspaceName.tablename (user_id int PRIMARY KEY, lastname text) WITH cosmosdb_provisioned_throughput=100000
   ```

* DELETE

All crud operations when executed through CQLV4 compatible SDK will return extra information about error, request units consumed, activity id. Delete/update needs to be handled in resource governance safe way to avoid over use of provisioned resources. 

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

* BATCH - Only unlogged commands are supported 

## Consistency mapping 

Azure Cosmos DB Cassandra API provides choice of consistency for read operations. All write operations are always written with majority quorum irrespective of the account consistency.

Apache Cassandra consistency | Azure Cosmos DB consistency |
--- | --- |
Any(Write)	|  Eventual 
One | Eventual
Two | Strong
Three | Strong
Quorum | Strong 
All | Strong
Local One | Strong
Local Quorum | Strong
Each Quorum | Strong
Serial | Strong
Local Serial | Strong

## Time-to-live (TTL)

Cassandra API currently supports row level TTL, column level TTL is not yet available.

## Permission and role management

Azure Cosmos DB supports role based access control (RBAC) and read-write and read-only passwords/keys that can be obtained through the [Azure portal](https://portal.azure.com. Azure Cosmos DB does not yet support users and roles for data plane activities. 

## Replication

Azure Cosmos DB supports automatic, native replication at the lowest layers. This logic is extended to achieve low-latency and global replication. 

## Write CL level

Certain Cassandra APIs support specifying a CL level which specifies the number of responses required during a write operation. Due to how Cosmos DB handles replication in the background all writes are all automatically Quorum by default. Any CL level specified by client code is ignored.  

## Change Data Capture(CDC)

Azure Cosmos DB supports change feed. Change feed is equivalent to CDC in Cassandra. Change feed logs the changes as data gets modified in a container. 

## Support for co-hosted Solr/Spark or other platforms

Since Azure Cosmos DB is a managed platform, running other systems which are on same nodes is not yet supported. It is suggested to use platforms like Azure Search which provide similar functionality.

## Next steps


- Explore Azure Cosmos DB with protocol support for Cassandra [samples](Cassandra-samples.md).
