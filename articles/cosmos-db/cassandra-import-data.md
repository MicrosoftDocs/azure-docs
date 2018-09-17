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
> * Retrieving your connection string
> * Importing data by using the cqlsh COPY command
> * Importing using the Spark connector 

## Prerequisites for migration

* **Create tables in Azure Cosmos DB Cassandra API account:** Before you start the migrating data, pre-create all your tables from the Azure portal or from cqlsh.

* **Increase throughput:** The duration of your data migration depends on the amount of throughput you provisioned for the tables in Azure Cosmos DB. Increase the throughput for the duration of migration. With the higher throughput, you can avoid rate limiting and migrate in less time. After you've completed the migration, decrease the throughput to save costs. For more information about increasing throughput, see [set throughput](set-throughput.md) for Azure Cosmos DB containers. It’s also recommended to have Azure Cosmos DB account in the same region as your source database. 

* **Enable SSL:** Azure Cosmos DB has strict security requirements and standards. Be sure to enable SSL when you interact with your account. When you use CQL with SSH, you have an option to provide SSL information.

## Get your connection string

1. In the [Azure portal](https://portal.azure.com), select your Azure Cosmos DB account from the list of all resources.

2. Select **Connection String**. The right pane contains all the information that you need to successfully connect to your account.

    ![Connection string page](./media/cassandra-import-data/keys.png)

## Migrate data by using cqlsh COPY

To import Cassandra data into Azure Cosmos DB for use with the Cassandra API, complete the following steps:

1. Log in to cqhsh using the connection information from the portal.

2. Use the [CQL COPY command](http://cassandra.apache.org/doc/latest/tools/cqlsh.html#cqlsh) to copy local data to the Apache Cassandra API endpoint. Refer to the Apache documentation for detailed commands. Ensure the source and target are in same datacenter to minimize latency issues.

### Steps to move data with cqlsh

1. Create and scale your tables:
    * By default, Azure Cosmos DB provisions a new Cassandra API table with 1,000 request units per second (RU/s) (CQL-based creation is provisioned with 400 RU/s). Before you start the migration by using cqlsh, pre-create all your tables from the [Azure portal](https://portal.azure.com) or from the cqlsh shell. 

    * From the [Azure portal](https://portal.azure.com), increase the throughput of your tables from the default throughput (400 or 1000 RU/s) to 10,000 RU/s for the duration of migration. With the higher throughput, you can avoid rate limiting and migrate in less time. With hourly billing in Azure Cosmos DB, you can reduce the throughput immediately after the migration to save costs.

2. Determine the RU charge for an operation. You can do this using the Azure Cosmos DB Cassandra API SDK of your choice. This example shows the .NET version of getting RU charges. 

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

3. Determine the latency from your machine to the Azure Cosmos DB service. If you are within an Azure Data center, the latency should be a low single digit millisecond number. If you are outside the Azure Datacenter, then you can use psping or azurespeed.com to get the approximate latency from your location.

4. Fine-tune the values for parameters `NUMPROCESS`, `INGESTRATE`, `MAXBATCHSIZE`, and `MINBATCHSIZE` to optimize the best performance for your environment.

5. Run the final migration command. Running this command assumes you have started cqlsh using the connection string information.

   ```bash
   COPY exampleks.tablename FROM filefolderx/*.csv 
   ```

## Migrate data by using Spark

For data residing in an existing cluster in Azure virtual machines, importing data using Spark is a viable option. To do so, set up Spark as an intermediary for one time or regular ingestion. 

## Next steps

In this tutorial, you've learned how to complete the following tasks:

> [!div class="checklist"]
> * Retrieve your connection string
> * Import data by using cql copy command
> * Import using the Spark connector 

You can now proceed to the Concepts section for more information about Azure Cosmos DB. 

> [!div class="nextstepaction"]
>[Tunable data consistency levels in Azure Cosmos DB](../cosmos-db/consistency-levels.md)
