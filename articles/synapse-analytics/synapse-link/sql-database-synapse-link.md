---
title: Azure Synapse Link for Azure SQL Database (Preview)
description: Learn about Azure Synapse Link for Azure SQL Database, the link connection, and monitoring the Synapse Link. 
services: synapse-analytics 
author: SnehaGunda
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: synapse-link
ms.date: 04/18/2022
ms.author: sngun
ms.reviewer: sngun
---

# Synapse Link for Azure SQL Database (Preview)

This article helps you to understand the functions of Synapse link for Azure SQL Database. You can use the Synapse link functionality to land your operational data in the Azure Synapse SQL pool from Azure SQL Database.

> [!IMPORTANT]
> Synapse Link for Azure SQL Database is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Link connection

Link connection is an artifact for you to create, manage, and monitor in your Synapse workspace. A link connection identifies a mapping relationship between an Azure SQL database and an Azure Synapse dedicated SQL pool. When you create a link connection, it will guide you to select both source database and a destination Synapse SQL pool so that the operational data from your source database will be automatically replicated to the specified destination Synapse SQL pool. You can add or remove one or more tables from your source database to be replicated.

You can start or stop a link connection. When being started, a link connection will start from a full initial load from your source database followed by incremental change feeds via the change feed feature in Azure SQL database. When you stop a link connection, the updates made to the operational data won't be synchronized to your Synapse SQL pool.

You need to select compute core counts for each link connection to replicate your data. The core counts represent the compute power and it impacts your data replication latency and price.

## Monitoring

You can monitor Synapse link for SQL in different levels. For each link connection, you'll see the following status:

* **Initial:** a link connection is created but not started.
* **Starting:** a link connection is setting up compute engines to replicate data.
* **Running:** a link connection is replicating data.
* **Stopping:** a link connection is shutting down the compute engines.
* **Stopped:** a link connection is stopped.

For each table, you'll see the following status:

* **Snapshotting:** a source table is initially loaded to destination with full snapshot.
* **Replicating:** any updates on source table are replicated to destination.
* **Failed:** the data on source table can't be replicated to destination due to a fatal error. If you want to retry after fixing the error, remove the table from link and add it back.
* **Suspended:** replication is suspended for this table due to an error. It will be resumed after the error is resolved. 

## Transactional consistency across tables

You can enable transactional consistency across tables for each link connection. However, it limits overall replication throughput.

## Next steps

* To learn more, see how to [Configure Synapse Link for Azure SQL Database (Preview)](connect-synapse-link-sql-database.md).
