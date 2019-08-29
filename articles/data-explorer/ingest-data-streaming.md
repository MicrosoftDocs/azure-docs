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
> * [Database cursors](/azure/kusto/management/databasecursor).
> * [Data mapping](/azure/kusto/management/mappings). Only [pre-created](/azure/kusto/management/tables#create-ingestion-mapping) data mappings are supported. 

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Sign in to the [Web UI](https://dataexplorer.azure.com/).
* Create [an Azure Data Explorer cluster and database](create-cluster-database-portal.md)

## Enable streaming ingestion on your cluster

You can enable streaming ingestion on your own cluster.

1. In the Azure portal, go to your Azure Data Explorer cluster. In **Settings**, select **Configurations**. 
1. In the **Configurations** pane, select **On** to enable **Streaming ingestion**.
1. Select **Save**.
 
    ![streaming ingestion on](media/ingest-data-streaming/streaming-ingestion-on.png)
 
1. In the [Web UI](https://dataexplorer.azure.com/), define [streaming ingestion policy](/azure/kusto/concepts/streamingingestionpolicy) on table(s) or database(s) that will receive streaming data. 

    > [!TIP]
    > If the policy is defined at the database level, all tables in the database are enabled for streaming ingestion.

## Supported streaming ingestion types

There are two supported streaming ingestion types:

* [Event Hub](/azure/data-explorer/ingest-data-event-hub) as a data source
* Custom ingestion requires you to write an application that uses one of Azure Data Explorer client libraries. See [streaming ingestion sample](https://github.com/Azure/azure-kusto-samples-dotnet/tree/master/client/StreamingIngestionSample) for a sample application.

### Choose the appropriate streaming ingestion type


|   |Event Hub  |Custom Ingestion  |
|---------|---------|---------|
|Data delay between ingestion initiation and the data available for query   |    longer delay     |   shorter delay      |
|Development overhead    |   fast and easy setup, no development overhead    |   high development overhead for application to handle errors and ensure data consistency     |

## Disable streaming ingestion on your cluster

> [!WARNING]
> Disabling streaming ingestion may take few hours.

1. Drop [streaming ingestion policy](/azure/kusto/concepts/streamingingestionpolicy) from all relevant tables and databases. The streaming ingestion policy removal process triggers movement of the streaming ingestion data from its initial storage to the permanent storage in the column store (extents or shards). The data movement may last a few seconds to a few hours depending the amount of data in the initial storage and the CPU and memory utilization of the cluster.
1. In the Azure portal, go to your Azure Data Explorer cluster. In **Settings**, select **Configurations**. 
1. In the **Configurations** pane, select **Off** to disable **Streaming ingestion**.
1. Select **Save**.

    ![Streaming ingestion off](media/ingest-data-streaming/streaming-ingestion-off.png)

## Limitations

* Streaming ingestion performance and capacity scales with increased VM and cluster sizes. For a single D11 node the recommended load is up to 20 requests per second and for a single D14 node, the recommended load is up to 150 requests per second.
* Currently, support is only for 8 and 16 core SKUs (D13, D14, L8 and L16).
* The data size limitation per ingestion request is 4MB.
* Schema updates, such as creation and modification of tables and ingestion mappings, may take up to 5 minutes for the streaming ingestion service.
* Enabling streaming ingestion on a cluster allocates part of the local SSD disk of the cluster machines for streaming ingestion data and reduces the storage available for the hot cache (even if no data is actually ingested via streaming).