---
title: Limitations and known issues with Azure Synapse Link for SQL
description: Learn about limitations and known issues with Azure Synapse Link for SQL.
author: jonburchel
ms.service: synapse-analytics
ms.topic: troubleshooting
ms.subservice: synapse-link
ms.custom: event-tier1-build-2022
ms.date: 06/13/2023
ms.author: jburchel
ms.reviewer: jburchel, chuckheinzelman, wiassaf, imotiwala
---

# Limitations and known issues with Azure Synapse Link for SQL

This article lists the [limitations](#limitations) and [known issues](#known-issues) with Azure Synapse Link for SQL.

## Limitations

The following sections list limitations for Azure Synapse Link for SQL.

### Azure SQL Database and SQL Server 2022
* Source tables must have primary keys.
* Only a writeable, primary replica is supported as the data source for Azure Synapse Link for SQL.
* The following data types aren't supported for primary keys in the source tables:
  * real
  * float
  * hierarchyid
  * sql_variant
  * timestamp
* Source table row size can't exceed 7,500 bytes. For tables where variable-length columns are stored off-row, a 24-byte pointer is stored in the main record.
* When source tables are being initially snapshotted, any source table data containing large object (LOB) data greater than 1 MB in size is not supported. These LOB data types include: varchar(max), nvarchar(max), varbinary(max). An error is thrown and data is not exported to Azure Synapse Analytics.
* Tables enabled for Azure Synapse Link for SQL can have a maximum of 1,020 columns (not 1,024).
* While a database can have multiple links enabled, a given table can't belong to multiple links.
* When a database owner doesn't have a mapped login, Azure Synapse Link for SQL runs into an error when enabling a link connection.  User can set database owner to a valid user with the `ALTER AUTHORIZATION` command to fix this issue.
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
* The following table DDL operations aren't allowed on source tables when they're enabled for Azure Synapse Link for SQL.  All other DDL operations are allowed, but they won't be replicated to Azure Synapse Analytics.
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
* Enabling Azure Synapse Link for SQL creates a new schema named `changefeed`. Don't use this schema, as it is reserved for system use.
* Source tables with collations that are unsupported by dedicated SQL pools, such as UTF8 and certain Japanese collations, can't be replicated. Here's the [supported collations in Synapse SQL Pool](../sql/reference-collation-types.md).
    * Additionally, some Thai language collations are currently not supported by Azure Synapse Link for SQL. These unsupported collations include:
        *    Thai100CaseInsensitiveAccentInsensitiveKanaSensitive
        *    Thai100CaseInsensitiveAccentSensitiveSupplementaryCharacters
        *    Thai100CaseSensitiveAccentInsensitiveKanaSensitive
        *    Thai100CaseSensitiveAccentInsensitiveKanaSensitiveWidthSensitiveSupplementaryCharacters
        *    Thai100CaseSensitiveAccentSensitiveKanaSensitive
        *    Thai100CaseSensitiveAccentSensitiveSupplementaryCharacters
        *    ThaiCaseSensitiveAccentInsensitiveWidthSensitive
    * Currently, the collation **Latin1_General_BIN2** is not supported as there is a known issue where the link cannot be stopped nor underlying tables could be removed from replication.
* Single row updates (including off-page storage) of > 370 MB are not supported.
* When Azure Synapse Link for SQL on Azure SQL Database or SQL Server 2022 is enabled, the aggressive log truncation feature of Accelerated Database Recovery (ADR) is automatically disabled. This is because Azure Synapse Link for SQL accesses the database transaction log. This behavior is similar to changed data capture (CDC). Active transactions continue to hold the transaction log truncation until the transaction commits and Azure Synapse Link for SQL catches up, or transaction aborts. This might result in the transaction log filling up more than usual and should be monitored so that the transaction log does not fill.

### Azure SQL Database only
* Azure Synapse Link for SQL isn't supported on Free, Basic or Standard tier with fewer than 100 DTUs.
* Azure Synapse Link for SQL isn't supported on SQL Managed Instances.
* Service principal isn't supported for authenticating to source Azure SQL DB, so when creating Azure SQL DB linked Service, choose SQL authentication, user-assigned managed identity (UAMI) or service assigned managed Identity (SAMI).
* If the Azure SQL Database logical server has both a SAMI and UAMI configured, Azure Synapse Link uses SAMI. 
* Azure Synapse Link can't be enabled on the secondary database once a GeoDR failover has happened if the secondary database has a different name from the primary database.
* If you enable Azure Synapse Link for SQL on your database as a Microsoft Azure Active Directory (Azure AD) user, Point-in-time restore (PITR) will fail. PITR only works when you enable Azure Synapse Link for SQL on your database as a SQL user.
* If you create a database as an Azure AD user and enable Azure Synapse Link for SQL, a SQL authentication user (for example, even sysadmin role) won't be able to disable/make changes to Azure Synapse Link for SQL artifacts.  However, another Azure AD user is able to enable/disable Azure Synapse Link for SQL on the same database. Similarly, if you create a database as an SQL authentication user, enabling/disabling Azure Synapse Link for SQL as an Azure AD user won't work.
* Cross-tenant data replication is not supported where an Azure SQL Database and the Azure Synapse workspace are in separate tenants.


### SQL Server 2022 only
* Azure Synapse Link for SQL can't be enabled on databases that are transactional replication publishers or distributors.
* With asynchronous replicas in an availability group, transactions need to be written to all replicas prior to them being published to Azure Synapse Link for SQL.
* Azure Synapse Link for SQL isn't supported on databases with database mirroring enabled.
* Restoring an Azure Synapse Link for SQL-enabled database from on-premises to Azure SQL Managed Instance isn't supported.

> [!CAUTION]
> Azure Synapse Link for SQL is not supported on databases that are also using Azure SQL Managed Instance Link. Caution that in these scenarios, when the managed instance transitions to read-write mode, you may encounter transaction log full issues. 

## Known issues

### Deleting an Azure Synapse Analytics workspace with a running link could cause the transaction log on the source database to fill

* Applies To - Azure Synapse Link for Azure SQL Database and SQL Server 2022
* Issue - When you delete an Azure Synapse Analytics workspace it is possible that running links might not be stopped, which will cause the source database to think that the link is still operational and could lead to the transaction log to not be truncated, and fill.
* Resolution - There are two possible resolutions to this situation:
1. Stop any running links prior to deleting the Azure Synapse Analytics workspace.
1. Manually clean up the link definition in the source database.
    1. Find the `table_group_id` that needs to be stopped using the following query:
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
        ```

### Trying to re-enable change feed on a table for that was recently disabled table will show an error. This is an uncommon behavior.

* Applies To - Azure Synapse Link for Azure SQL Database and SQL Server 2022
* Issue - When you try to enable a table that has been recently disabled with its metadata not yet been cleaned up and state marked as DISABLED, an error is thrown stating `A table can only be enabled once among all table groups`.
* Resolution - Wait for sometime for the disabled table system procedure to complete and then try to re-enable the table again.

### Attempt to enable Azure Synapse Link on database imported using SSDT, SQLPackage for Import/Export and Extract/Deploy operations 

* Applies To - Azure Synapse Link for Azure SQL Database and SQL Server 2022
* Issue - For SQL databases enabled with Azure Synapse Link, when you use SSDT Import/Export and Extract/Deploy operations to import/setup a new database, the `changefeed` schema and user do not get excluded in the new database. However, the tables for the changefeed *are* ignored by DaxFX because they are marked as `is_ms_shipped=1` in `sys.objects`, and those objects never included in SSDT Import/Export and Extract/Deploy operations. When enabling Azure Synapse Link on the imported/deployed database, the system stored procedure `sys.sp_change_feed_enable_db` fails if the `changefeed` user and schema already exist. This issue is encountered if you have created a user or schema named `changefeed` that is not related to Azure Synapse Link change feed capability.
* Resolution - 
    * Manually drop the empty `changefeed` schema and `changefeed` user. Then, Azure Synapse Link can be enabled successfully on the imported/deployed database.
    * If you have defined a custom schema or user named `changefeed` in your database that is not related to Azure Synapse Link, and you do not intend to use Azure Synapse Link for SQL, it is not necessary to drop your `changefeed` schema or user. 
    * If you have defined a customer schema or user named `changefeed` in your database, currently, this database cannot participate in the Azure Synapse Link for SQL.

## Next steps

* [Configure Azure Synapse Link for Azure Cosmos DB](../../cosmos-db/configure-synapse-link.md?context=/azure/synapse-analytics/context/context)
* [Configure Azure Synapse Link for Dataverse](/powerapps/maker/data-platform/azure-synapse-link-synapse?context=/azure/synapse-analytics/context/context)
