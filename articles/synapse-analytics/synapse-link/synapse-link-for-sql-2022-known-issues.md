---
title: Known limitations and issues with Azure Synapse Link for SQL Server 2022 (Preview)
description: Learn about known limitations and issues with Azure Synapse Link for SQL Server 2022 (Preview).
author: jonburchel
ms.service: synapse-analytics
ms.topic: troubleshooting
ms.subservice: synapse-link
ms.date: 05/09/2022
ms.author: jburchel
ms.reviewer: jburchel
---

# Known limitations and issues with Azure Synapse Link for SQL Server 2022

This article lists the known limitations and issues with Azure Synapse Link for SQL Server 2022

## Known limitations

The following is the list of known limitations for Azure Synapse Link for SQL Server 2022.

* Users must create new Synapse workspace to get Azure Synapse Link for SQL Server 2022.
* Azure Synapse link for SQL Server 2022 cannot be used in virtual network environment. Users need to check “Disable Managed virtual network” for Synapse workspace.
* Users need to manually create schema in destination Synapse SQL pool in advance if your expected schema is not available in Synapse SQL pool. The destination database schema object will not be automatically created in data replication. If your schema is dbo, you can skip this step.
* When creating SQL Server linked service, please choose SQL Auth, Windows Auth or Azure AD auth.
* Azure Synapse Link for SQL Server 2022 can work with SQL Server on Linux. But HA scenarios with Linux Pacemaker are not supported. Shelf hosted IR cannot be installed on Linux environment 
* Azure Synapse Link for SQL Server 2022 CANNOT be enabled for source tables in SQL Server 2022 in following conditions:
  * Source tables do not have primary keys.
  * The PK columns in source tables contain the unsupported data types including real, float, hierarchyid, sql_variant and timestamp.  
  * Source table row size exceeds the limit of 7500 bytes. SQL Server supports row-overflow storage, which enables variable length columns to be pushed off-row. Only a 24-byte root is stored in the main record for variable length columns pushed out of row.
* Tables enabled for Synapse Link can have a maximum of 1020 columns.
* While a database can have multiple links enabled, a table can only belong to one link.

* When SQL Server 2022 database owner does not have a mapped login, Azure Synapse Link for SQL Server 2022 will run into error when enabling a link connection. User can set database owner to sa to fix this.
* The computed columns and the column containing unsupported data types by Synapse SQL Pool including image, text, xml, timestamp, sql_variant, UDT, geometry, geography in source tables in SQL Server 2022 will be skipped, and not to replicate to the Synapse SQL Pool.
* Maximum 5000 tables can be added to a single link connection.
* When source columns with type datetime2(7) and time(7) are replicated using Azure Synapse Link, the target columns will have last digit truncated.
* The following DDL operations are not allowed on source tables in SQL Server 2022 which are enabled for Azure Synapse Link for SQL Server 2022.
  * Switch partition, add/drop/alter column, alter PK, drop/truncate table, rename table is not allowed if the tables have been added into a running link connection of Azure Synapse Link for SQL Server 2022.
  * All other DDL operations are allowed, but those DDL operations will not be replicated to the Synapse SQL Pool.
* If DDL + DML is executed in an explicit transaction (between Begin Transaction and End Transaction statements), replication for corresponding tables will fail within the link connection.
   > [!NOTE]
   > If a table is critical for transactional consistency at the link connection level, please review the state of the Azure Synapse Link table in the Monitoring tab.
* Azure Synapse Link for SQL Server 2022 cannot be enabled if any of the following features are in use for the source tables in SQL Server 2022:
  * Transactional Replication (Publisher/Distributor)
  * Change Data Capture
  * Temporal history table.
  * Always encrypted.
* System tables in SQL Server 2022 will not be replicated.
* Security configuration of SQL Server 2022 will NOT be reflected to Synapse SQL Pool. 
* Enabling Synpase Link will create a new schema on SQL Server 2022 as 'changefeed', please do not use this schema name for your workload.
* If the SAS key of landing zone expires and gets rotated during Snapshot, new key will not get picked up. Snapshot will fail and restart automatically with the new key.
* Prior to breaking an Availability Group, disable any running links. Otherwise both databases will attempt to write their changes to the landing zone.
* When using asynchronous replicas, transactions need to be written to all replicas prior to them being published to Azure Synapse Link.
* Azure Synapse Link is not supported on databases with database mirroring enabled.
* Restoring an Azure Synapse Link-enabled database from on-premises to Azure SQL Managed Instance is not supported.
* Source tables with non-default collations: UTF8, Japanese cannot be replicated to Synapse. Here is the [supported collations in Synapse SQL Pool](../sql/reference-collation-types.md).

## Known issues
### Deleteing an Azure Synapse Analytics workspace with a running link could cause log on source database to fill
* Issue - When you delete an Azure Synapse Analytics workspace, it is possible that running links might not be stopped.  This will cause the source database to think that the link is still operational, and could lead to the log filling and not being truncated.
* Resolution - There are two possible resolutions to this situation:
1. Stop any running links prior to deleting the Azure Synapse Analytics workspace.
1. Manually clean up the link definition in the source database.  To do this:
    1. Find the table_group_id for the link(s) that need to be stopped using the following query:
        ```sql
        SELECT table_group_id, workspace_id, synapse_workgroup_name
        FROM [changefeed].[change_feed_table_groups]
        WHERE synapse_workgroup_name = <synapse workspace name>
        ```
    1. Drop each link identified using the following procedure:
        ```sql
        EXEC sys.sp_change_feed_drop_table_group @table_group_id = <table_group_id>
        ```
    1. Optionally, if you are disabling all of the table groups for a given database, you can also disable change feed on the database with the following command:
        ```sql
        EXEC sys.sp_change_feed_disable_db
 
## Next steps

If you are using a different type of database, see how to:

* [Configure Synapse Link for Azure Cosmos DB](../../cosmos-db/configure-synapse-link.md?context=/azure/synapse-analytics/context/context)
* [Configure Synapse Link for Dataverse](/powerapps/maker/data-platform/azure-synapse-link-synapse?context=/azure/synapse-analytics/context/context)
