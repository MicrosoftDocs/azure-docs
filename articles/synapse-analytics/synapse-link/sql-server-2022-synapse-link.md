---
title: Azure Synapse Link for SQL Server 2022 (Preview)
description: Learn about Azure Synapse Link for SQL Server 2022, the link connection, landing zone, Self-hosted integration runtime, and monitoring the Synapse Link.
services: synapse-analytics 
author: SnehaGunda
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: synapse-link
ms.date: 04/18/2022
ms.author: sngun
ms.reviewer: sngun
---

# Synapse Link for SQL Server 2022 (Preview)

This article helps you to understand the functions of Synapse link for SQL Server 2022 and use them to land your operational data in Azure Synapse SQL pool from SQL Server 2022.

> [!IMPORTANT]
> Synapse Link for Azure SQL Database is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Link connection

Link connection is an artifact for you to create, manage and monitor in your Synapse workspace. A link connection identifies a mapping relationship between an SQL Server 2022 and an Azure Synapse dedicated SQL pool. When you create a link connection, it will guide you to select both source database and destination Synapse SQL pool so that the operational data from your source database will be automatically replicated to the specified destination Synapse SQL pool. You can add or remove one or more tables from your source database to be replicated.

You can start or stop a link connection. When being started, a link connection will start from a full initial load from your source database followed by incremental change feeds via change feed feature in SQL Server 2022. When you stop a link connection, the updates made to the operational data won't be synchronized to your Synapse SQL pool.

You need to select compute core counts for each link connection to replicate your data. The core counts represent the compute power and it impacts your data replication latency and price.

## Landing zone

Landing zone is a folder within the Azure storage account that is required to be provided by users. It's managed by Synapse link for SQL Server 2022 as a staging area for data replication.

SAS token is required for Synapse link for SQL Server 2022 to access the landing zone. It has expiry date so that users need to rotate the SAS token before the expiry date. Otherwise, Synapse link will fail to replicate the data from SQL Server 2022 to Synapse SQL pool.

## Self-hosted integration runtime

Self-hosted integration runtime is required to be set up for Synapse link for SQL Server 2022. It helps Synapse link to access the data on SQL Server 2022 on premise that is behind the firewall. For more information, see [Create a self-hosted integration runtime](../../data-factory/create-self-hosted-integration-runtime.md?tabs=synapse-analytics)

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
* **Failed:** the data on source table can't be replicated to destination. If you want to retry after fixing the error, remove the table from link and add it back.
* **Suspended:** replication is suspended for this table due to an error. It will be resumed after the error is resolved. 

## Transactional consistency across tables

You can enable transactional consistency across table for each link connection. However, it limits overall replication throughput.

## Next steps

* To learn more, see how to [Configure Synapse Link for SQL Server 2022 (Preview)](connect-synapse-link-sql-server-2022.md).
