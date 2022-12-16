---
title: 'Migrate your data to a API for Cassandra account in Azure Cosmos DB- Tutorial'
description: In this tutorial, learn how to copy data from Apache Cassandra to a API for Cassandra account in Azure Cosmos DB.
author: TheovanKraay
ms.author: thvankra
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: tutorial
ms.date: 12/03/2018
ms.devlang: csharp
ms.custom: seodec18, ignite-2022
#Customer intent: As a developer, I want to migrate my existing Cassandra workloads to Azure Cosmos DB so that the overhead to manage resources, clusters, and garbage collection is automatically handled by Azure Cosmos DB.
---

# Tutorial: Migrate your data to a API for Cassandra account
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

As a developer, you might have existing Cassandra workloads that are running on-premises or in the cloud, and you might want to migrate them to Azure. You can migrate such workloads to a API for Cassandra account in Azure Cosmos DB. This tutorial provides instructions on different options available to migrate Apache Cassandra data into the API for Cassandra account in Azure Cosmos DB.

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Plan for migration
> * Prerequisites for migration
> * Migrate data by using the `cqlsh` `COPY` command
> * Migrate data by using Spark

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites for migration

* **Estimate your throughput needs:** Before migrating data to the API for Cassandra account in Azure Cosmos DB, you should estimate the throughput needs of your workload. In general, start with the average throughput required by the CRUD operations, and then include the additional throughput required for the Extract Transform Load or spiky operations. You need the following details to plan for migration: 

  * **Existing data size or estimated data size:** Defines the minimum database size and throughput requirement. If you are estimating data size for a new application, you can assume that the data is uniformly distributed across the rows, and estimate the value by multiplying with the data size. 

  * **Required throughput:** Approximate throughput rate of read (query/get) and write (update/delete/insert) operations. This value is required to compute the required request units, along with steady-state data size.  

  * **The schema:** Connect to your existing Cassandra cluster through `cqlsh`, and export the schema from Cassandra: 

    ```bash
    cqlsh [IP] "-e DESC SCHEMA" > orig_schema.cql
    ```

    After you identify the requirements of your existing workload, create an Azure Cosmos DB account, database, and containers, according to the gathered throughput requirements.  

  * **Determine the RU charge for an operation:** You can determine the RUs by using any of the SDKs supported by the API for Cassandra. This example shows the .NET version of getting RU charges.

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

* **Allocate the required throughput:** Azure Cosmos DB can automatically scale storage and throughput as your requirements grow. You can estimate your throughput needs by using the [Azure Cosmos DB request unit calculator](https://www.documentdb.com/capacityplanner). 

* **Create tables in the API for Cassandra account:** Before you start migrating data, pre-create all your tables from the Azure portal or from `cqlsh`. If you're migrating to an Azure Cosmos DB account that has database-level throughput, make sure to provide a partition key when you create the containers.

* **Increase throughput:** The duration of your data migration depends on the amount of throughput you provisioned for the tables in Azure Cosmos DB. Increase the throughput for the duration of migration. With the higher throughput, you can avoid rate limiting and migrate in less time. After you've completed the migration, decrease the throughput to save costs. We also recommend that you have the Azure Cosmos DB account in the same region as your source database. 

* **Enable TLS:** Azure Cosmos DB has strict security requirements and standards. Be sure to enable TLS when you interact with your account. When you use CQL with SSH, you have an option to provide TLS information.

## Options to migrate data

You can move data from existing Cassandra workloads to Azure Cosmos DB by using the `cqlsh` `COPY` command, or by using Spark. 

### Migrate data by using the cqlsh COPY command

Use the [CQL COPY command](https://cassandra.apache.org/doc/latest/cassandra/tools/cqlsh.html#cqlshrc) to copy local data to the API for Cassandra account in Azure Cosmos DB.

> [!WARNING]
> Only use the CQL COPY to migrate small datasets. To move large datasets, [migrate data by using Spark](#migrate-data-by-using-spark).

1. To be certain that your csv file contains the correct file structure, use the `COPY TO` command to export data directly from your source Cassandra table to a csv file (ensure that cqlsh is connected to the source table using the appropriate credentials):

   ```bash
   COPY exampleks.tablename TO 'data.csv' WITH HEADER = TRUE;   
   ```

1. Now get your API for Cassandra account’s connection string information:

   * Sign in to the [Azure portal](https://portal.azure.com), and go to your Azure Cosmos DB account.

   * Open the **Connection String** pane. Here you see all the information that you need to connect to your API for Cassandra account from `cqlsh`.

1. Sign in to `cqlsh` by using the connection information from the portal.

1. Use the `CQL` `COPY FROM` command to copy `data.csv` (still located in the user root directory where `cqlsh` is installed):

   ```bash
   COPY exampleks.tablename FROM 'data.csv' WITH HEADER = TRUE;
   ```
> [!NOTE]
> API for Cassandra supports protocol version 4, which shipped with Cassandra 3.11. There may be issues with using later protocol versions with our API. COPY FROM with later protocol version can go into a loop and return duplicate rows. 
> Add the protocol-version to the cqlsh command.
```sql
cqlsh <USERNAME>.cassandra.cosmos.azure.com 10350 -u <USERNAME> -p <PASSWORD> --ssl --protocol-version=4
```
##### Add throughput-limiting options to CQL Copy command

The COPY command in cqlsh supports various parameters to control the rate of ingestion of documents into Azure Cosmos DB.

The default configuration for COPY command tries to ingest data at very fast pace and does not account for the rate-limiting behavior of CosmosDB. You should reduce the CHUNKSIZE or INGESTRATE depending on the throughput configured on the collection.

We recommend the below configuration (at minimum) for a collection at 20,000 RUs if the document or record size is 1 KB.

- CHUNKSIZE = 100
- INGESTRATE = 500
- MAXATTEMPTS = 10

###### Example commands

- Copying data from API for Cassandra to local csv file
```sql
COPY standard1 (key, "C0", "C1", "C2", "C3", "C4") TO 'backup.csv' WITH PAGESIZE=100 AND MAXREQUESTS=1 ;
```

- Copying data from local csv file to API for Cassandra
```sql
COPY standard2 (key, "C0", "C1", "C2", "C3", "C4") FROM 'backup.csv' WITH CHUNKSIZE=100 AND INGESTRATE=100 AND MAXATTEMPTS=10;
```

>[!IMPORTANT]
> Only the open-source Apache Cassandra version of CQLSH COPY is supported. Datastax Enterprise (DSE) versions of CQLSH may encounter errors. 


### Migrate data by using Spark 

Use the following steps to migrate data to the API for Cassandra account with Spark:

1. Provision an [Azure Databricks cluster](spark-databricks.md) or an [Azure HDInsight cluster](spark-hdinsight.md). 

1. Move data to the destination API for Cassandra endpoint. Refer to this [how-to guide](migrate-data-databricks.md) for migration with Azure Databricks.

Migrating data by using Spark jobs is a recommended option if you have data residing in an existing cluster in Azure virtual machines or any other cloud. To do this, you must set up Spark as an intermediary for one-time or regular ingestion. You can accelerate this migration by using Azure ExpressRoute connectivity between your on-premises environment and Azure. 

### Live migration

Where a zero-downtime migration from a native Apache Cassandra cluster is required, we recommend configuring dual-writes, and a separate bulk data load to migrate historical data. We've made implementing this pattern more straightforward by providing an open-source [dual-write proxy](https://github.com/Azure-Samples/cassandra-proxy) to allow for minimal application code changes. Take a look at our how-to article on [live migration using dual-write proxy and Apache Spark](migrate-data-dual-write-proxy.md) for more detail on implementing this pattern. 

## Clean up resources

When they're no longer needed, you can delete the resource group, the Azure Cosmos DB account, and all the related resources. To do so, select the resource group for the virtual machine, select **Delete**, and then confirm the name of the resource group to delete.

## Next steps

In this tutorial, you've learned how to migrate your data to a API for Cassandra account in Azure Cosmos DB. You can now learn about other concepts in Azure Cosmos DB:

> [!div class="nextstepaction"]
> [Tunable data consistency levels in Azure Cosmos DB](../consistency-levels.md)
