---
title: Use streaming ingestion to ingest data into Azure Data Explorer
description: Learn about how to ingest (load) data into Azure Data Explorer using streaming ingestion.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 08/29/2019
---

# Streaming ingestion (Preview)

Streaming ingestion is targeted for scenarios in which you have requirements for low latency with less than 10 seconds ingestion time of varied volume data. In addition, it is targeted for optimization of operational processing when you have a large number of tables (in one or more databases), and the stream of data into each one is relatively small (few records per second) but overall data ingestion volume is high (thousands of records per second).

The classic (bulk) ingestion is advised when the amount of data grows to more than 1MB/sec per table. Read [Data ingestion overview](/azure/data-explorer/ingest-data-overview) for an overview of the various methods of ingestion.

> [NOTE]
> Streaming ingestion doesn't support the following features:
> * [Database cursors](../databasecursor.md).
> * [Data mapping](../../management/mappings.md). Only [pre-created](../../management/ tables.md#create-ingestion-mapping) data mappings are supported. 

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Sign in to the [Web UI](https://dataexplorer.azure.com/).
* Create [an Azure Data Explorer cluster and database](create-cluster-database-portal.md)

## Enable streaming ingestion on your cluster

You can enable streaming ingestion on your own cluster.

1. In the Azure portal, go to your Azure Data Explorer cluster. In **Settings**, select **Configurations**. 
1. In the **Configurations** window, select **On** for **Streaming ingestion**.
1. Select **Save**.
 
    ![streaming ingestion on](media/ingest-data-streaming/streaming-ingestion-on.png)
 
1. In the [Web UI](https://dataexplorer.azure.com/), define [streaming ingestion policy](../../concepts/streamingingestionpolicy.md) on table(s) or database(s) that will receive streaming data. If the policy is defined at the database level, all tables in the database are enabled for streaming ingestion.

## Supported ingestion methods

* **Event Hub** 
    * Establish [Event Hub as a data source](/azure/data-explorer/ingest-data-event-hub). 
    * Data delay is longer than custom ingestion.
    * Many aspects of the data ingestion are handled by Azure Data Explorer Data Management service.

* **Custom ingestion**
    * Write an application that uses one of Azure Data Explorer client libraries. See [streaming ingestion sample](https://github.com/Azure/azure-kusto-samples-dotnet/tree/master/client/StreamingIngestionSample) for a simple application.
    * Achieves the shortest delay between initiating the ingestion and the data being available for query. 
    * Incurs the most development overhead since the application for custom ingestion must handle errors and ensure data consistency.

## Disable streaming ingestion on your cluster

> [!WARNING]
> Disabling streaming ingestion may take few hours.

1. Drop all [streaming ingestion policy](../../concepts/streamingingestionpolicy.md) from all tables and databases. Streaming ingestion policy removal might be from several GBs to several hundreds of GBs of data stored in the rowstore (the initial storage of the data that comes via streaming ingestion). This data should be moved to extents. Usually it would take up to several minutes to move the data, but if the cluster is under CPU or memory pressure, it might take much longer.
1. Only after all streaming ingestion policies were dropped, go to your Azure Data Explorer cluster resource in Azure portal.
1. In the Configurations window, select Off for the Streaming ingestion.
1. Select Save.

    ![Streaming ingestion off](media/ingest-data-streaming/streaming-ingestion-off.PNG)


## Limitations

* The data size limitation per ingestion request is 4MB.
* Schema updates, such as creation and modification of tables and ingestion mappings, may take up to 5 minutes for the streaming ingestion service.
* Enabling streaming ingestion on a cluster allocates part of the local SSD disk of the cluster machines for streaming ingestion data and reduces the storage available for the hot cache
(even if no data is actually ingested via streaming).