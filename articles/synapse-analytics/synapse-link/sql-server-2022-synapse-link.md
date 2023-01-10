---
title: Azure Synapse Link for SQL Server 2022
description: Learn about Azure Synapse Link for SQL Server 2022, the link connection, landing zone, Self-hosted integration runtime, and monitoring the Azure Synapse Link for SQL.
services: synapse-analytics 
author: SnehaGunda
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: synapse-link
ms.custom: event-tier1-build-2022
ms.date: 11/16/2022
ms.author: sngun
ms.reviewer: sngun, wiassaf
---

# Azure Synapse Link for SQL Server 2022

This article helps you to understand the functions of Azure Synapse Link for SQL Server 2022. You can use the Azure Synapse Link for SQL functionality to replicate your operational data into an Azure Synapse Analytics dedicated SQL pool from SQL Server 2022.

## Link connection

A link connection identifies a mapping relationship between an SQL Server 2022 and an Azure Synapse Analytics dedicated SQL pool. You can create, manage, monitor and delete link connections in your Synapse workspace. When creating a link connection, you can select both source database and destination Synapse dedicated SQL pool so that the operational data from your source database will be automatically replicated to the specified destination Synapse dedicated SQL pool. You can also add or remove one or more tables from your source database to be replicated.

You can start, stop, pause or resume a link connection. When started, a link connection will start from a full initial load from your source database followed by incremental change feeds via change feed feature in SQL Server 2022. When you stop a link connection, the updates made to the operational data won't be synchronized to your Synapse dedicated SQL pool. It will do a full initial load from your source database if you start the link connection again. When you pause a link connection, the updates made to the operational data won't be synchronized to your Synapse dedicated SQL pool. When you resume a link connection, it will continue to synchronize the update from the place where you paused the link connection to your Synapse dedicated SQL pool. For more information, see [Azure Synapse Link change feed for SQL Server 2022 and Azure SQL Database](/sql/sql-server/synapse-link/synapse-link-sql-server-change-feed).

You need to select compute core counts for each link connection to replicate your data. The core counts represent the compute power and it impacts your data replication latency and cost.

You also have the chance to make a trade-off between cost and latency by selecting the continuous or batch mode to replicate the data.  When you select continuous mode, the runtime will be running continuously so that any changes applied to your SQL DB or SQL Server will be replicated to Synapse with low latency. When you select batch mode with specified interval, the changes applied to your SQL DB or SQL Server will be accumulated and replicated to Synapse in a batch mode with specified interval.  By doing so, you can save cost as you are only charged for the time when the runtime is required to replicate your data. After each batch of data is replicated, the runtime will be shut down automatically.

## Landing zone

The landing zone is an interim staging store required for Azure Synapse Link for SQL Server 2022. First, the operational data is loaded from the SQL Server 2022 to the landing zone. Next, the data is copied from the landing zone to the Synapse dedicated SQL pool. You need to provide your own Azure Data Lake Storage Gen2 account to be used as a landing zone. It is not supported to use this landing zone for anything other than Azure Synapse Link for SQL.

The shared access signature (SAS) token from your Azure Data Lake Storage Gen2 account is required for a link connection to get access to the landing zone. Be aware that the SAS token has an expiration date. Make sure to rotate the SAS token before the expiration date to ensure the SAS token is valid. Otherwise, Azure Synapse Link for SQL will fail to replicate the data from SQL Server 2022.

## Self-hosted integration runtime

Self-hosted integration runtime is a software agent that you can download and install on an on-premises machine or a virtual machine. It is required for Azure Synapse Link for SQL Server 2022 to get access the data on SQL Server 2022 on premises that is behind the firewall. Currently, the self-hosted IR is only supported on a Windows operating system. For more information, see [Create a self-hosted integration runtime](../../data-factory/create-self-hosted-integration-runtime.md?tabs=synapse-analytics)

## Monitoring

You can monitor Azure Synapse Link for SQL at the link and table levels. For each link connection, you'll see the following status:

* **Initial:** a link connection is created but not started. You will not be charged in initial state.
* **Starting:** a link connection is setting up compute engines to replicate data.
* **Running:** a link connection is replicating data.
* **Stopping:** a link connection is going to be stopped. The compute engine is being shut down. 
* **Stopped:** a link connection is stopped. You will not be charged in stopped state.
* **Pausing:** a link connection is going to be paused. The compute engine is being shut down. 
* **Paused:** a link connection is paused. You will not be charged in paused state.
* **Resuming:** a link connection is going to be resumed by setting up compute engines to continue to replicate the changes.

For each table, you'll see the following status:

* **Snapshotting:** a source table is initially loaded to the destination with full snapshot.
* **Replicating:** any updates on source table are replicated to the destination.
* **Failed:** the data on source table can't be replicated to destination. If you want to retry after fixing the error, remove the table from link connection and add it back.
* **Suspended:** replication is suspended for this table due to an error. It will be resumed after the error is resolved. 

You can also get the following metrics to enable advanced monitoring of the service:

* **Link connection events:** number of link connection events including start, stop or failure.
* **Link table event:** number of link table events including snapshot, removal or failure.
* **Link latency in second:** data processing latency in second.
* **Link data processed data volume (bytes):** data volume in bytes processed by Synapse link for SQL.
* **Link processed row:** row counts (changed) processed by Synapse Link for SQL.

For more information, see [Manage Synapse Link for SQL change feed](/sql/sql-server/synapse-link/synapse-link-sql-server-change-feed-manage).

## Transactional consistency across tables

You can enable transactional consistency across table for each link connection. However, it limits overall replication throughput.

## Known limitations

A consolidated list of known limitations and issues can be found at [Known limitations and issues with Azure Synapse Link for SQL](synapse-link-for-sql-known-issues.md).

## Next steps

* To learn more, see how to [Configure Synapse Link for SQL Server 2022](connect-synapse-link-sql-server-2022.md).
