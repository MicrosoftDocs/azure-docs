---
title: Known limitations and issues with Azure Synapse Link for SQL
description: Learn about known limitations and issues with Azure Synapse Link for SQL.
author: jonburchel
ms.service: synapse-analytics
ms.topic: troubleshooting
ms.subservice: synapse-link
ms.custom: event-tier1-build-2022
ms.date: 11/16/2022
ms.author: jburchel
ms.reviewer: jburchel, chuckheinzelman, wiassaf, imotiwala
---

# Known limitations and issues with Azure Synapse Link for SQL

This article lists the known limitations and issues with Azure Synapse Link for SQL.

## Known limitations

This is the list of known limitations for Azure Synapse Link for SQL.

### Azure SQL DB and SQL Server 2022
* Source tables must have primary keys.
* The following data types aren't supported for primary keys in the source tables:
  * real
  * float
  * hierarchyid
  * sql_variant
  * timestamp
* Source table row size can't exceed 7,500 bytes. For tables where variable-length columns are stored off-row, a 24-byte pointer is stored in the main record.
* Tables enabled for Azure Synapse Link for SQL can have a maximum of 1,020 columns (not 1,024).
* While a database can have multiple links enabled, a given table can't belong to multiple links.
* When a database owner doesn't have a mapped log in, Azure Synapse link for SQL will run into an error when enabling a link connection.  User can set database owner to a valid user with the `ALTER AUTHORIZATION` command to fix this issue.
* If the source table contains computed columns or columns with data types that aren't supported by Azure Synapse Analytics dedicated SQL pools, these columns won't be replicated to Azure Synapse Analytics.  Unsupported columns include:
  * image
  * text
  * xml
  * timestamp
  * sql_variant
  * UDT
  * geometry
  * geography
* A maximum of 5,000 tables can be added to a single link connection.
* When a source column is of type datetime2(7) or time(7), the last digit will be truncated when data is replicated to Azure Synapse Analytics.
* The following table DDL operations aren't allowed on source tables when they are enabled for Azure Synapse Link for SQL.  All other DDL operations are allowed, but they won't be replicated to Azure Synapse Analytics.
  * Switch Partition
  * Add/Drop/Alter Column
  * Alter Primary Key
  * Drop/Truncate Table
  * Rename Table
* If DDL + DML is executed in an explicit transaction (between `BEGIN TRANSACTION` and `END TRANSACTION` statements), replication for corresponding tables will fail within the link connection.
  > [!NOTE]
  > If a table is critical for transactional consistency at the link connection level, please review the state of the Azure Synapse Link table in the Monitoring tab.
* Azure Synapse Link for SQL can't be enabled if any of the following features are in use for the source table:
  * Change Data Capture
  * Temporal history table
  * Always encrypted
  * In-Memory OLTP
  * Column Store Index
  * Graph
* System tables can't be replicated.
* The security configuration from the source database will **NOT** be reflected in the target dedicated SQL pool.
* Enabling Azure Synapse Link for SQL will create a new schema called `changefeed`. Don't use this schema, as it is reserved for system use.
* Source tables with collations that are unsupported by Synapse SQL dedicated pool, such as UTF8 and certain Japanese collations, can't be replicated. Here's the [supported collations in Synapse SQL Pool](../sql/reference-collation-types.md).
* Single row updates (including off-page storage) of > 370MB are not supported.

### Azure SQL DB only
* Azure Synapse Link for SQL isn't supported on Free, Basic or Standard tier with fewer than 100 DTUs.
* Azure Synapse Link for SQL isn't supported on SQL Managed Instances.
* Service principal isn't supported for authenticating to source Azure SQL DB, so when creating Azure SQL DB linked Service, choose SQL authentication, user-assigned managed identity (UAMI) or service assigned managed Identity (SAMI).
* If the Azure SQL Database logical server has both a SAMI and UAMI configured, Azure Synapse Link will use SAMI. 
* Azure Synapse Link can't be enabled on the secondary database once a GeoDR failover has happened if the secondary database has a different name from the primary database.
* If you enabled Azure Synapse Link for SQL on your database as an Microsoft Azure Active Directory (Azure AD) user, Point-in-time restore (PITR) will fail. PITR will only work when you enable Azure Synapse Link for SQL on your database as a SQL user.
* If you create a database as an Azure AD user and enable Azure Synapse Link for SQL, a SQL authentication user (for example, even sysadmin role) won't be able to disable/make changes to Azure Synapse Link for SQL artifacts.  However, another Azure AD user will be able to enable/disable Azure Synapse Link for SQL on the same database. Similarly, if you create a database as an SQL authentication user, enabling/disabling Azure Synapse Link for SQL as an Azure AD user won't work.
* When enabling Azure Synapse Link for SQL on your Azure SQL Database, you should ensure that aggressive log truncation is disabled.

### SQL Server 2022 only
* Azure Synapse Link for SQL can't be enabled on databases that are transactional replication publishers or distributors.
* When using asynchronous replicas, transactions need to be written to all replicas prior to them being published to Azure Synapse Link for SQL.
* Azure Synapse Link for SQL isn't supported on databases with database mirroring enabled.
* Restoring an Azure Synapse Link for SQL-enabled database from on-premises to Azure SQL Managed Instance isn't supported.

> [!CAUTION]
> Azure Synapse Link for SQL is not supported on databases that are also using Azure SQL Managed Instance Link. Caution that in these scenarios, when the managed instance transitions to read-write mode, you may encounter transaction log full issues. 

## Known issues
### Deleting an Azure Synapse Analytics workspace with a running link could cause log in source database to fill
* Applies To - Azure SQL Database and SQL Server 2022
* Issue - When you delete an Azure Synapse Analytics workspace it is possible that running links might not be stopped, which will cause the source database to think that the link is still operational and could lead to the log filling and not being truncated.
* Resolution - There are two possible resolutions to this situation:
1. Stop any running links prior to deleting the Azure Synapse Analytics workspace.
1. Manually clean up the link definition in the source database.
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

### DateTime2(7) and Time(7) Could Cause Snapshot Hang
* Applies To - Azure SQL Database
* Issue - One of the limitations with the data types DateTime2(7) and Time(7) is the loss of precision (only 6 digits are supported). When certain database settings are turned on (`NUMERIC_ROUNDABORT`, `ANSI_WARNINGS`, and `ARITHABORT`), the snapthot process can hang, requiring a database failover to recover.
* Resolution - To resolve this situation, take the following steps:
1. Turn off all three database settings.
    ```sql
    ALTER DATABASE <logical_database_name> SET NUMERIC_ROUNDABORT OFF
    ALTER DATABASE <logical_database_name> SET ANSI_WARNINGS OFF
    ALTER DATABASE <logical_database_name> SET ARITHABORT OFF
    ```
1. Run the following query to verify that the settings are in fact turned off.
    ```sql
    SELECT name, is_numeric_roundabort_on, is_ansi_warnings_on, is_arithabort_on
    FROM sys.databases
    WHERE name = 'logical_database_name'
    ```
1. Open an Azure support ticket requesting a database failover. Alternately, you could change the Service Level Objective (SLO) of your database instead of opening a ticket.

## Next steps

If you are using a different type of database, see how to:

* [Configure Synapse Link for Azure Cosmos DB](../../cosmos-db/configure-synapse-link.md?context=/azure/synapse-analytics/context/context)
* [Configure Synapse Link for Dataverse](/powerapps/maker/data-platform/azure-synapse-link-synapse?context=/azure/synapse-analytics/context/context)
