---
title: Apache Cassandra features supported by Azure Cosmos DB Cassandra API
description: Learn about the Apache Cassandra feature support in Azure Cosmos DB Cassandra API
author: kanshiG
ms.author: govindk
ms.reviewer: sngun
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: overview
ms.date: 09/24/2018
---

# Apache Cassandra features supported by Azure Cosmos DB Cassandra API 

Azure Cosmos DB is Microsoft's globally distributed multi-model database service. You can communicate with the Azure Cosmos DB Cassandra API through Cassandra Query Language (CQL) v4 [wire protocol](https://github.com/apache/cassandra/blob/trunk/doc/native_protocol_v4.spec) compliant open-source Cassandra client [drivers](https://cassandra.apache.org/doc/latest/getting_started/drivers.html?highlight=driver). 

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
* Aggregate functions
  * min, max, avg, count
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
  


## Cassandra API limits

Azure Cosmos DB Cassandra API does not have any limits on the size of data stored in a table. Hundreds of terabytes or Petabytes of data can be stored while ensuring partition key limits are honored. Similarly, every entity or row equivalent does not have any limits on the number of columns. However, the total size of the entity should not exceed 2 MB. The data per partition key cannot exceed 20 GB as in all other APIs.

## Tools 

Azure Cosmos DB Cassandra API is a managed service platform. It does not require any management overhead or utilities such as Garbage Collector, Java Virtual Machine(JVM), and nodetool to manage the cluster. It supports tools such as cqlsh that utilizes Binary CQLv4 compatibility. 

* Azure portal's data explorer, metrics, log diagnostics, PowerShell, and CLI are other supported mechanisms to manage the account.

## Hosted CQL shell (preview)

You can open a hosted native Cassandra shell (CQLSH v5.0.1) directly from the Data Explorer in the [Azure portal](data-explorer.md) or the [Azure Cosmos explorer](https://cosmos.azure.com/). Before enabling the CQL shell, you must [enable the Notebooks](enable-notebooks.md) feature in your account (if not already enabled, you will be prompted when clicking on `Open Cassandra Shell`). Check the highlighted note in [Enable notebooks for Azure Cosmos DB accounts](enable-notebooks.md) for supported Azure Regions.

![CQLSH](./media/cassandra-support/cqlsh.png)

You can also connect to the Cassandra API in Azure Cosmos DB by using the CQLSH installed on a local machine. It comes with Apache Cassandra 3.1.1 and works out of the box by setting the environment variables. The following sections include the instructions to install, configure, and connect to Cassandra API in Azure Cosmos DB, on Windows or Linux using CQLSH.

**Windows:**

If using windows, we recommend you enable the [Windows filesystem for Linux](https://docs.microsoft.com/windows/wsl/install-win10#install-the-windows-subsystem-for-linux). You can then follow the linux commands below.

**Unix/Linux/Mac:**

```bash
# Install default-jre and default-jdk
sudo apt install default-jre
sudo apt-get update
sudo apt install default-jdk

# Import the Baltimore CyberTrust root certificate:
curl https://cacert.omniroot.com/bc2025.crt > bc2025.crt
keytool -importcert -alias bc2025ca -file bc2025.crt

# Install the Cassandra libraries in order to get CQLSH:
echo "deb http://www.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
curl https://downloads.apache.org/cassandra/KEYS | sudo apt-key add -
sudo apt-get update
sudo apt-get install cassandra

# Export the SSL variables:
export SSL_VERSION=TLSv1_2
export SSL_VALIDATE=false

# Connect to Azure Cosmos DB API for Cassandra:
cqlsh <YOUR_ACCOUNT_NAME>.cassandra.cosmosdb.azure.com 10350 -u <YOUR_ACCOUNT_NAME> -p <YOUR_ACCOUNT_PASSWORD> --ssl

```

## CQL commands

Azure Cosmos DB supports the following database commands on Cassandra API accounts.

* CREATE KEYSPACE (The replication settings for this command are ignored)
* CREATE TABLE 
* CREATE INDEX (without specifying index name, and full frozen indexes not yet supported)
* ALLOW FILTERING
* ALTER TABLE 
* USE 
* INSERT 
* SELECT 
* UPDATE 
* BATCH - Only unlogged commands are supported 
* DELETE

All CRUD operations that are executed through a CQL v4 compatible SDK will return extra information about error and request units consumed. The DELETE and UPDATE commands should be handled with resource governance taken into consideration, to ensure the most efficient use of the provisioned throughput.

* Note  gc_grace_seconds value must be zero if specified.

```csharp
var tableInsertStatement = table.Insert(sampleEntity); 
var insertResult = await tableInsertStatement.ExecuteAsync(); 
 
foreach (string key in insertResult.Info.IncomingPayload) 
        { 
            byte[] valueInBytes = customPayload[key]; 
            double value = Encoding.UTF8.GetString(valueInBytes); 
            Console.WriteLine($"CustomPayload:  {key}: {value}"); 
        } 
```

## Consistency mapping 

Azure Cosmos DB Cassandra API provides choice of consistency for read operations.  The consistency mapping is detailed [here](consistency-levels-across-apis.md#cassandra-mapping).

## Permission and role management

Azure Cosmos DB supports role-based access control (RBAC) for provisioning, rotating keys, viewing metrics and read-write and read-only passwords/keys that can be obtained through the [Azure portal](https://portal.azure.com). Azure Cosmos DB does not support roles for CRUD activities.

## Keyspace and Table options

The options for region name, class, replication_factor, and datacenter in the "Create Keyspace" command are ignored currently. The system uses the underlying Azure Cosmos DB's [global distribution](global-dist-under-the-hood.md) replication method to add the regions. If you need the cross-region presence of data, you can enable it at the account level with PowerShell, CLI, or portal, to learn more, see the [how to add regions](how-to-manage-database-account.md#addremove-regions-from-your-database-account) article. Durable_writes can't be disabled because Azure Cosmos DB ensures every write is durable. In every region, Azure Cosmos DB replicates the data across the replica set that is made up of four replicas and this replica set [configuration](global-dist-under-the-hood.md) can't be modified.
 
All the options are ignored when creating the table, except gc_grace_seconds, which should be set to zero.
The Keyspace and table have an extra option named "cosmosdb_provisioned_throughput" with a minimum value of 400 RU/s. The Keyspace throughput allows sharing throughput across multiple tables and it is useful for scenarios when all tables are not utilizing the provisioned throughput. Alter Table command allows changing the provisioned throughput across the regions. 

```
CREATE  KEYSPACE  sampleks WITH REPLICATION = {  'class' : 'SimpleStrategy'}   AND cosmosdb_provisioned_throughput=2000;  

CREATE TABLE sampleks.t1(user_id int PRIMARY KEY, lastname text) WITH cosmosdb_provisioned_throughput=2000; 

ALTER TABLE gks1.t1 WITH cosmosdb_provisioned_throughput=10000 ;

```


## Usage of Cassandra retry connection policy

Azure Cosmos DB is a resource governed system. This means you can do a certain number of operations in a given second based on the request units consumed by the operations. If an application exceeds that limit in a given second,  requests are rate-limited and exceptions will be thrown. The Cassandra API in Azure Cosmos DB translates these exceptions to overloaded errors on the Cassandra native protocol. To ensure that your application can intercept and retry requests in case of rate limitation, the [spark](https://mvnrepository.com/artifact/com.microsoft.azure.cosmosdb/azure-cosmos-cassandra-spark-helper) and the [Java](https://github.com/Azure/azure-cosmos-cassandra-extensions) extensions are provided. See also Java code samples for [version 3](https://github.com/Azure-Samples/azure-cosmos-cassandra-java-retry-sample) and [version 4](https://github.com/Azure-Samples/azure-cosmos-cassandra-java-retry-sample-v4) Datastax drivers, when connecting to Cassandra API in Azure Cosmos DB. If you use other SDKs to access Cassandra API in Azure Cosmos DB, create a connection policy to retry on these exceptions.

## Next steps

- Get started with [creating a Cassandra API account, database, and a table](create-cassandra-api-account-java.md) by using a Java application
