---
title: Migrate your data to Azure Cosmos DB Cassandra API account
description: Learn how to use the CQL Copy command & Spark to copy data from Apache Cassandra to Azure Cosmos DB Cassandra API.
services: cosmos-db
author: kanshiG

ms.service: cosmos-db
ms.component: cosmosdb-cassandra
ms.author: govindk
ms.topic: tutorial
ms.date: 09/24/2018
ms.reviewer: sngun
---

# Migrate your data to Azure Cosmos DB Cassandra API account

This tutorial provides instructions on how to migrate Apache Cassandra data into Azure Cosmos DB Cassandra API. 

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Plan for migration
> * Prerequisites for migration
> * Migrate data using cqlsh COPY command
> * Migrate data using Spark 

## Plan for migration
before migrating data to Azure Cosmos DB, you should estimate the throughput needs for your existing Cassandra workload. Gather the following details from your source database: 

* **Existing uncompressed data size:** Defines the minimum database size and throughput requirement. 

* **Required throughput:** Approximate read (query/get) and write(update/delete/insert) throughput rate.

* **Gather source cluster’s information:**  From your Cassandra source cluster, use nodetool utility run [nodetool flush](https://docs.datastax.com/en/cassandra/3.0/cassandra/tools/toolsFlush.html) to flush tables from memtable. After a reasonable workload is run, gather [nodetool tablestats](https://docs.datastax.com/en/cassandra/3.0/cassandra/tools/toolsTablestats.html) to get the average data size and average number of reads/writes for a table with the given latency. The average values can be retrieved by Local read count, Local write count, Local read latency, Local write latency values. 

* **Get the schema:** Connect to your existing Cassandra cluster through cqlsh and export schema from Cassandra: 

  ```bash
  cqlsh [IP] "-e DESC SCHEMA" > orig_schema.cql
  ```

* **Determine the latency from your machine to the Azure Cosmos DB service:** If you are within an Azure Data center, the latency should be a low single digit millisecond number. If you are outside the Azure Datacenter, then you can use psping or azurespeed.com to get the approximate latency from your location.

After you identify the requirements of your existing workload, you should create an Azure Cosmos DB account, database, and containers according to the gathered throughput requirements.  

* **Determine the RU charge for an operation:** You can do this by using the Azure Cosmos DB Cassandra API SDK of your choice. This example shows the .NET version of getting RU charges.

  ```csharp
  var tableInsertStatement = table.Insert(sampleEntity);
  var insertResult = await tableInsertStatement.ExecuteAsync();

  foreach (string key in insertResult.Info.IncomingPayload)
    {
       byte[] valueInBytes = customPayload[key];
       string value = Encoding.UTF8.GetString(valueInBytes);
       Console.WriteLine($"CustomPayload:  {key}: {value}");
    }
  ```

* **Allocate the required throughput:** Azure Cosmos DB can automatically scale storage and throughput as your requirements grow. You can estimate your throughput needs by using the [Azure Cosmos DB request unit calculator](). 

## Prerequisites for migration

* **Create tables in Azure Cosmos DB Cassandra API account:** Before you start the migrating data, pre-create all your tables from the Azure portal or from cqlsh.

* **Increase throughput:** The duration of your data migration depends on the amount of throughput you provisioned for the tables in Azure Cosmos DB. Increase the throughput for the duration of migration. With the higher throughput, you can avoid rate limiting and migrate in less time. After you've completed the migration, decrease the throughput to save costs. For more information about increasing throughput, see [set throughput](set-throughput.md) for Azure Cosmos DB containers. It’s also recommended to have Azure Cosmos DB account in the same region as your source database. 

* **Enable SSL:** Azure Cosmos DB has strict security requirements and standards. Be sure to enable SSL when you interact with your account. When you use CQL with SSH, you have an option to provide SSL information.

## Options to migrate data

You can move data from existing Cassandra workloads to Azure Cosmos DB by using the following options:

* [Using cqlsh COPY command](#using-cqlsh-copy-command)  
* [Using Spark](#using-spark) 

## Migrate data using cqlsh COPY command

[CQL COPY command](http://cassandra.apache.org/doc/latest/tools/cqlsh.html#cqlsh) is used to copy local data to Azure Cosmos DB Cassandra API account. Use the following steps to copy data:

1. Get your Cassandra API account’s connection string information:

   * Sign in to the [Azure portal](https://portal.azure.com), and navigate to your Azure Cosmos DB account.

   * Open the **Connection String** pane that contains all the information that you need to connect to your Cassandra API account from cqlsh.

2. Sign in to cqlsh using the connection information from the portal.

3. Use the CQL COPY command to copy local data to the Cassandra API account.

   ```bash
   COPY exampleks.tablename FROM filefolderx/*.csv 
   ```

## Migrate data using Spark 

- provision Azure Databricks or HDInsight cluster, connect to source Cassandra cluster, and then move data to destination Cassandra API endpoint. Migrating data by using spark jobs is also a recommended option if you have data residing in an existing cluster in Azure virtual machines. This requires spark to be set up as intermediary for one time or regular ingestion.

For data residing in an existing cluster in Azure virtual machines, importing data using Spark is a viable option. To do so, set up Spark as an intermediary for one time or regular ingestion. 

## Next steps

In this tutorial, you've learned how to migrate your data to Azure Cosmos DB Cassandra API account. You can now proceed to the concepts section for more information about Azure Cosmos DB. 

> [!div class="nextstepaction"]
> [Tunable data consistency levels in Azure Cosmos DB](../cosmos-db/consistency-levels.md)


