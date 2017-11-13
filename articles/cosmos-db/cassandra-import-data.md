---
title: Import Cassandra data into Azure Cosmos DB | Microsoft Docs
description: Learn how to use the CQL Copy command to copy Cassandra data into Azure Cosmos DB.
services: cosmos-db
author: govindk
manager: jhubbard
documentationcenter: ''

ms.assetid: eced5f6a-3f56-417a-b544-18cf000af33a
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/15/2017
ms.author: govindk
ms.custom: mvc
---
# Azure Cosmos DB: Import Cassandra data

This tutorial provides instructions on importing Cassandra data into Azure Cosmos DB using the CQL COPY command. 

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Retrieving your connection string
> * Importing data by using cql copy command
> * Import using the Spark connector 

# Prerequisites

* Install Apache Cassandra and specifically ensure *cqlsh* is present   [Apache Cassandra Download location](http://cassandra.apache.org/download/).
* Increase throughput: The duration of your data migration depends on the amount of throughput you set up for your Tables. Be sure to increase the throughput for larger data migrations. After you've completed the migration, decrease the throughput to save costs. For more information about increasing throughput in the [Azure portal](https://portal.azure.com), see [Performance levels and pricing tiers in Azure Cosmos DB](performance-levels.md).
* Enable SSL: Azure Cosmos DB has strict security requirements and standards. Be sure to enable SSL when you interact with your account. When you use cql with ssh, you have an option to provide ssl information. 

## Find your connection string

1. In the [Azure portal](https://portal.azure.com), on the far left, click **Azure Cosmos DB**.
2. In the **Subscriptions** pane, select your account name.
3. Click **Connection String**. The right pane contains all the information that you need to successfully connect to your account.

    ![Connection String blade](./media/cassandra-import-data/keys.png)

## Use cqlsh COPY

To import data to your Azure Cosmos DB account for Cassandra API, use following guidance.

1. Log in to CQLSH using the connection information from the portal.
2. Use the [CQL COPY command](http://cassandra.apache.org/doc/latest/tools/cqlsh.html#cqlsh) to copy local data to the Apache Cassandra API endpoint. Ensure the source and target are in same datacenter to minimize latency issues.

### Guide for moving data wit cqlsh

1. Pre-create and scale your Table:
    * By default, Azure Cosmos DB provisions a new Cassandra API table with 1,000 request units per second (RU/s) (CQL-based creation is provisioned with 400 RU/s). Before you start the migration by using cqlsh, pre-create all your Tables from the [Azure portal](https://portal.azure.com) or from cqlsh. 

    * From the [Azure portal](https://portal.azure.com), increase your Tables' throughput from given RU (400 or 1000 or 2,500 RU/s) for a table just for the migration. With the higher throughput, you can avoid throttling and migrate in less time. With hourly billing in Azure Cosmos DB, you can reduce the throughput immediately after the migration to save costs.

2. Determine the RU charge for an operation, please do this against the Azure Cosmos DB Cassandra account using SDK of your choice. This example shows the .NET version of getting RU charges. 

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
3. Determine the latency from your machine to the Azure Cosmos DB service. If you are within Azure Data center, this should be with low single digit milliseconds. If you are outside the Azure Datacenter - then you can psping or azurespeed.com to get approximate latency from your location.   

4. Calculate the proper values for parameters that can provide good performance. NUMPROCESS, INGESTRATE, MAXBATCHSIZE, or MINBATCHSIZE

6. Run the final migration command: (this assumes you have started cqlsh using the connectiong information)

   ```
   COPY exampleks.tablename FROM filefolderx/*.csv 
   ```

## Use Spark to import data

For data residing in an existing cluster in Azure virtual machines, importing data is possible by using Spark. This requires Spark to be set up as intermediary  for one time or regular ingestion. 

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Retrieve your connection string
> * Import data by using cql copy command
> * Import using the Spark connector 

You can now proceed to the Concepts section for more information about Azure Cosmos DB. 

> [!div class="nextstepaction"]
>[Tunable data consistency levels in Azure Cosmos DB](../cosmos-db/consistency-levels.md)
