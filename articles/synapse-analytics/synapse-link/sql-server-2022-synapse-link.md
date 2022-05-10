---
title: Azure Synapse Link for SQL Server 2022 (Preview)
description: Learn about Azure Synapse Link for SQL Server 2022, the link connection, landing zone, Self-hosted integration runtime, and monitoring the Azure Synapse Link for SQL.
services: synapse-analytics 
author: SnehaGunda
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: synapse-link
ms.date: 05/09/2022
ms.author: sngun
ms.reviewer: sngun, wiassaf
---

# Azure Synapse Link for SQL Server 2022 (Preview)

This article helps you to understand the functions of Azure Synapse Link for SQL Server 2022 and use them to land your operational data in Azure Synapse SQL pool from SQL Server 2022.

> [!IMPORTANT]
> Azure Synapse Link for Azure SQL Database is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Link connection

A link connection identifies a mapping relationship between an SQL Server 2022 and an Azure Synapse dedicated SQL pool. You can create, manage, monitor and delete link connections in your Synapse workspace. When creating a link connection, you can select both source database and destination Synapse SQL pool so that the operational data from your source database will be automatically replicated to the specified destination Synapse SQL pool. You can also add or remove one or more tables from your source database to be replicated.

You can start or stop a link connection. When being started, a link connection will start from a full initial load from your source database followed by incremental change feeds via change feed feature in SQL Server 2022. When you stop a link connection, the updates made to the operational data won't be synchronized to your Synapse SQL pool. For more information, see [Azure Synapse Link for SQL change feed](/sql/sql-server/synapse-link/synapse-link-sql-server-change-feed).

You need to select compute core counts for each link connection to replicate your data. The core counts represent the compute power and it impacts your data replication latency and cost.

## Landing zone

Landing zone is an interim staging store required for Azure Synapse Link for SQL Server 2022. First, the operational data is loaded from the SQL Server 2022 to the landing zone. Next, the data is copied from the landing zone to the Synapse SQL pool. You need to provide your own Azure Data Lake Storage Gen2 account to be used as a landing zone. You are not suggested to directly consume or manage the data in the landing zone.

The shared access signature (SAS) token from your own Azure Data Lake Storage Gen2 account is required for a link connection to get access to the landing zone. Be aware that the SAS token has an expiry date. So you need to always rotate the SAS token before the expiry date to ensure the SAS token is valid. Otherwise, Azure Synapse Link will fail to replicate the data from SQL Server 2022 to Synapse SQL pool after the expiry date of SAS token.

## Self-hosted integration runtime

Self-hosted integration runtime is a software agent that you can download and install on an on-premise machine or a virtual machine. It is required for Azure Synapse Link for SQL Server 2022 to get access the data on SQL Server 2022 on premise that is behind the firewall. Currently, the self-hosted IR is only supported on a Windows operating system. For more information, see [Create a self-hosted integration runtime](../../data-factory/create-self-hosted-integration-runtime.md?tabs=synapse-analytics)

## Monitoring

You can monitor Azure Synapse Link for SQL in different levels. For each link connection, you'll see the following status:

* **Initial:** a link connection is created but not started. You will not be charged in initial state.
* **Starting:** a link connection is setting up compute engines to replicate data.
* **Running:** a link connection is replicating data.
* **Stopping:** a link connection is shutting down the compute engines.
* **Stopped:** a link connection is stopped. You will not be charged in stopped state.

For each table, you'll see the following status:

* **Snapshotting:** a source table is initially loaded to the destination with full snapshot.
* **Replicating:** any updates on source table are replicated to the destination.
* **Failed:** the data on source table can't be replicated to destination. If you want to retry after fixing the error, remove the table from link connection and add it back.
* **Suspended:** replication is suspended for this table due to an error. It will be resumed after the error is resolved. 

For more information, see [Manage Synapse Link for SQL change feed](/sql/sql-server/synapse-link/synapse-link-sql-server-change-feed-manage).

## Transactional consistency across tables

You can enable transactional consistency across table for each link connection. However, it limits overall replication throughput.

## Known limitations

The following is the list of known limitations for Synapse Link for SQL Server 2022.

* Users must create new Synapse workspace to get Azure Synapse Link for SQL Server 2022.
* Azure Synapse Link for SQL Server 2022 cannot be used in virtual network environment. Users need to check "Disable Managed virtual network" for Synapse workspace.
* Users need to manually create schema in destination Synapse SQL pool in advance if your expected schema is not available in Synapse SQL pool. The destination database schema object will not be automatically created in data replication. If your schema is dbo, you can skip this step.
* When creating SQL Server linked service, please choose SQL authentication, Windows authentication, or Azure AD authentication.
* Synapse Link for SQL Server 2022 can work with SQL Server on Linux. But HA scenarios with Linux Pacemaker are not supported. Shelf hosted IR cannot be installed on Linux environment 
* Synapse Link for SQL Server 2022 CANNOT be enabled for source tables in SQL Server 2022 in following conditions:
  * Source tables do not have primary keys.
  * The PK columns in source tables contain the unsupported data types including real, float, hierarchyid, sql_variant and timestamp.  
  * Source table row size exceeds the limit of 7500 bytes. SQL Server supports row-overflow storage, which enables variable length columns to be pushed off-row. Only a 24-byte root is stored in the main record for variable length columns pushed out of row.

* When SQL Server 2022 database owner does not have a mapped login, Azure Synapse Link for SQL Server 2022 will run into error when enabling a link connection. User can set database owner to sa to fix this.
* The computed columns and the column containing unsupported data types by Synapse SQL Pool including image, text, xml, timestamp, sql_variant, UDT, geometry, geography in source tables in SQL Server 2022 will be skipped, and not to replicate to the Synapse SQL Pool.
* Maximum 5000 tables can be added to a single link connection.
* When source columns with type datetime2(7) and time(7) are replicated using Synapse Link, the target columns will have last digit truncated.
* The following DDL operations are not allowed on source tables which are enabled for Synapse Link for SQL Server 2022.
  * Switch partition, add/drop/alter column, alter PK, drop/truncate table, rename table is not allowed if the tables have been added into a running link connection of Synapse Link for SQL Server 2022.
  * All other DDL operations are allowed, but those DDL operations will not be replicated to the Synapse SQL Pool.
* If DDL + DML is executed in an explicit transaction (between Begin Transaction and End Transaction statements), replication for corresponding tables will fail within the link connection.
   > [!NOTE]
   > If a table is critical for transactional consistency at the link connection level, please review the state of the Synapse Link table in the Monitoring tab.
* Synapse Link for SQL Server 2022 cannot be enabled if any of the following features are in use for the source tables in SQL Server 2022:
  * Transactional Replication
  * Change Data Capture
  * Temporal history table.
  * Always encrypted.
* System tables in SQL Server 2022 will not be replicated.
* Security configuration of SQL Server 2022 will NOT be reflected to Synapse SQL Pool. 
* Enabling Azure Synapse Link will create a new schema on SQL Server 2022 as `changefeed`, please do not use this schema name for your workload.
* If the SAS key of landing zone expires and gets rotated during Snapshot, new key will not get picked up. Snapshot will fail and restart automatically with the new key.
* Sub core SLOs on the source databases in SQL Server 2022 are not supported.
* Source tables with non-default collations: UTF8, Japanese cannot be replicated to Synapse. Here is the [supported collations in Synapse SQL Pool](../sql/reference-collation-types.md).


## Next steps

* To learn more, see how to [Configure Synapse Link for SQL Server 2022 (Preview)](connect-synapse-link-sql-server-2022.md).
