---
title: Azure Synapse Link for Azure SQL Database (Preview)
description: Learn about Azure Synapse Link for Azure SQL Database, the link connection, and monitoring the Synapse Link. 
services: synapse-analytics 
author: SnehaGunda
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: synapse-link
ms.date: 05/09/2022
ms.author: sngun
ms.reviewer: sngun, wiassaf
---

# Azure Synapse Link for Azure SQL Database (Preview)

This article helps you to understand the functions of Azure Synapse Link for Azure SQL Database. You can use the Azure Synapse Link functionality to land your operational data in the Azure Synapse SQL pool from Azure SQL Database.

> [!IMPORTANT]
> Synapse Link for Azure SQL Database is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Link connection

A link connection identifies a mapping relationship between an Azure SQL database and an Azure Synapse dedicated SQL pool. You can create, manage, monitor and delete link connections in your Synapse workspace. When creating a link connection, you can select both source database and a destination Synapse SQL pool so that the operational data from your source database will be automatically replicated to the specified destination Synapse SQL pool. You can also add or remove one or more tables from your source database to be replicated.

You can start or stop a link connection. When being started, a link connection will start from a full initial load from your source database followed by incremental change feeds via the change feed feature in Azure SQL database. When you stop a link connection, the updates made to the operational data won't be synchronized to your Synapse SQL pool.

You need to select compute core counts for each link connection to replicate your data. The core counts represent the compute power and it impacts your data replication latency and cost.

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
* **Failed:** the data on source table can't be replicated to destination due to a fatal error. If you want to retry after fixing the error, remove the table from link connection and add it back.
* **Suspended:** replication is suspended for this table due to an error. It will be resumed after the error is resolved. 

## Transactional consistency across tables

You can enable transactional consistency across tables for each link connection. However, it limits overall replication throughput.

## <a name="known-issues"></a>Known limitations

The following is the list of known limitations for Synapse Link for Azure SQL Database.

* Users must create new Synapse workspace to get Azure Synapse Link for Azure SQL Database. 

* Azure Synapse Link for Azure SQL Database is not supported on Free, Basic or Standard tier S0, S1, S2 in Azure SQL database. Users need to use Azure SQL database tiers at least Standard 3.

* Azure Synapse Link for Azure SQL Database cannot be used in virtual network environment. Users need to check "Allow Azure Service and resources to access to this server" on Azure SQL database and check "Disable Managed virtual network" and "Allow connections from all IP address" for Synapse workspace.

* Users need to manually create schema in destination Synapse SQL pool in advance if your expected schema is not available in Synapse SQL pool. The destination database schema object will not be automatically created in data replication. If your schema is dbo, you can skip this step.

* Service principal and user-assigned managed identity are not supported for authenticating to source Azure SQL Database, so when creating Azure SQL Database linked service, please choose SQL authentication or service assigned managed Identity (SAMI).

* Synapse Link for Azure SQL Database CANNOT be enabled for source tables in Azure SQL Database in following conditions:

  * Source tables do not have primary keys.
  * The PK columns in source tables contain the unsupported data types including real, float, hierarchyid, sql_variant and timestamp.  
  * Source table row size exceeds the limit of 7500 bytes. SQL Server supports row-overflow storage, which enables variable length columns to be pushed off-row. Only a 24-byte root is stored in the main record for variable length columns pushed out of row.

* When SQL DB owner does not have a mapped login, Azure Synapse Link for SQL DB will run into error when enabling a link connection. User can set database owner to sa to fix this.

* The computed columns and the column containing unsupported data types by Synapse SQL Pool including image, text, xml, timestamp, sql_variant, UDT, geometry, geography in source tables in Azure SQL Database will be skipped, and not to replicate to the Synapse SQL Pool.

* Maximum 5000 tables can be added to a single link connection.

* When source columns with type datetime2(7) and time(7) are replicated using Synapse Link, the target columns will have last digit truncated.

* The following DDL operations are not allowed on source tables which are enabled for Synapse Link for Azure SQL Database.

  * Switch partition, add/drop/alter column, alter PK, drop/truncate table, rename table are not allowed if the tables have been added into a running link connection of Synapse Link for Azure SQL Database. 
  * All other DDL operations are allowed, but those DDL operations will not be replicated to the Synapse SQL Pool.

* If DDL + DML is executed in an explicit transaction (between Begin Transaction and End Transaction statements), replication for corresponding tables will fail within the link connection.

  > [!NOTE]
  > If a table is critical for transactional consistency at the link connection level, please review the state of the Synapse Link table in the Monitoring tab.

* Synapse Link for SQL DB cannot be enabled if any of the following features are in use for the source tables in Azure SQL database:

  * Change Data Capture
  * Temporal history table
  * Always encrypted
    
* System tables in SQL database will not be replicated.
* Security configuration of Azure SQL database will NOT be reflected to Synapse SQL Pool. 
* Enabling Azure Synpase Link will create a new schema on the Azure SQL Database as `changefeed`, please do not use this schema name for your workload.
* Source tables with non-default collations: UTF8, Japanese cannot be replicated to Synapse. Here is the [supported collations in Synapse SQL Pool](../sql/reference-collation-types.md).

## Next steps

* To learn more, see how to [Configure Synapse Link for Azure SQL Database (Preview)](connect-synapse-link-sql-database.md).
