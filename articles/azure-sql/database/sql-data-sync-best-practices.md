---
title: Best practices for Azure SQL Data Sync
description: "Learn about best practices for configuring and running Azure SQL Data Sync."
services: sql-database
ms.service: sql-database
ms.subservice: data-movement
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
ms.date: 12/20/2018
---
# Best practices for Azure SQL Data Sync 

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article describes best practices for Azure SQL Data Sync.

For an overview of SQL Data Sync, see [Sync data across multiple cloud and on-premises databases with Azure SQL Data Sync](sql-data-sync-data-sql-server-sql-database.md).

> [!IMPORTANT]
> Azure SQL Data Sync does **not** support Azure SQL Managed Instance at this time.

## <a name="security-and-reliability"></a> Security and reliability

### Client agent

-   Install the client agent by using the least privileged user account that has network service access.  
-   Install the client agent on a computer that isn't the SQL Server computer.  
-   Don't register an on-premises database with more than one agent.    
    -   Avoid this even if you are syncing different tables for different sync groups.  
    -   Registering an on-premises database with multiple client agents poses challenges when you delete one of the sync groups.

### Database accounts with least required privileges

-   **For sync setup**. Create/Alter Table; Alter Database; Create Procedure; Select/ Alter Schema; Create User-Defined Type.

-   **For ongoing sync**. Select/ Insert/ Update/ Delete on tables that are selected for syncing, and on sync metadata and tracking tables; Execute permission on stored procedures created by the service; Execute permission on user-defined table types.

-   **For deprovisioning**. Alter on tables part of sync; Select/ Delete on sync metadata tables; Control on sync tracking tables, stored procedures, and user-defined types.

Azure SQL Database supports only a single set of credentials. To accomplish these tasks within this constraint, consider the following options:

-   Change the credentials for different phases (for example, *credentials1* for setup and *credentials2* for ongoing).  
-   Change the permission of the credentials (that is, change the permission after sync is set up).

## Setup

### <a name="database-considerations-and-constraints"></a> Database considerations and constraints

#### Database size

When you create a new database, set the maximum size so that it's always larger than the database you deploy. If you don't set the maximum size to larger than the deployed database, sync fails. Although SQL Data Sync doesn't offer automatic growth, you can run the `ALTER DATABASE` command to increase the size of the database after it has been created. Ensure that you stay within the database size limits.

> [!IMPORTANT]
> SQL Data Sync stores additional metadata with each database. Ensure that you account for this metadata when you calculate space needed. The amount of added overhead is related to the width of the tables (for example, narrow tables require more overhead) and the amount of traffic.

### <a name="table-considerations-and-constraints"></a> Table considerations and constraints

#### Selecting tables

You don't have to include all the tables that are in a database in a sync group. The tables that you include in a sync group affect efficiency and costs. Include tables, and the tables they are dependent on, in a sync group only if business needs require it.

#### Primary keys

Each table in a sync group must have a primary key. SQL Data Sync can't sync a table that doesn't have a primary key.

Before using SQL Data Sync in production, test initial and ongoing sync performance.

#### Empty tables provide the best performance

Empty tables provide the best performance at initialization time. If the target table is empty, Data Sync uses bulk insert to load the data. Otherwise, Data Sync does a row-by-row comparison and insertion to check for conflicts. If performance is not a concern, however, you can set up sync between tables that already contain data.

### <a name="provisioning-destination-databases"></a> Provisioning destination databases

SQL Data Sync provides basic database autoprovisioning.

This section discusses the limitations of provisioning in SQL Data Sync.

#### Autoprovisioning limitations

SQL Data Sync has the following limitations for autoprovisioning:

-   Select only the columns that are created in the destination table. Any columns that aren't part of the sync group aren't provisioned in the destination tables.
-   Indexes are created only for selected columns. If the source table index has columns that aren't part of the sync group, those indexes aren't provisioned in the destination tables.  
-   Indexes on XML type columns aren't provisioned.  
-   CHECK constraints aren't provisioned.  
-   Existing triggers on the source tables aren't provisioned.  
-   Views and stored procedures aren't created on the destination database.
-   ON UPDATE CASCADE and ON DELETE CASCADE actions on foreign key constraints aren't recreated in the destination tables.
-   If you have decimal or numeric columns with a precision greater than 28, SQL Data Sync may encounter a conversion overflow issue during sync. We recommend that you limit the precision of decimal or numeric columns to 28 or less.

#### Recommendations

-   Use the SQL Data Sync autoprovisioning capability only when you are trying out the service.  
-   For production, provision the database schema.

### <a name="locate-hub"></a> Where to locate the hub database

#### Enterprise-to-cloud scenario

To minimize latency, keep the hub database close to the greatest concentration of the sync group's database traffic.

#### Cloud-to-cloud scenario

-   When all the databases in a sync group are in one datacenter, the hub should be located in the same datacenter. This configuration reduces latency and the cost of data transfer between datacenters.
-   When the databases in a sync group are in multiple datacenters, the hub should be located in the same datacenter as the majority of the databases and database traffic.

#### Mixed scenarios

Apply the preceding guidelines to complex sync group configurations, such as those that are a mix of enterprise-to-cloud and cloud-to-cloud scenarios.

## Sync

### <a name="avoid-a-slow-and-costly-initial-synchronization"></a> Avoid slow and costly initial sync

In this section, we discuss the initial sync of a sync group. Learn how to help prevent an initial sync from taking longer and being more costly than necessary.

#### How initial sync works

When you create a sync group, start with data in only one database. If you have data in multiple databases, SQL Data Sync treats each row as a conflict that needs to be resolved. This conflict resolution causes the initial sync to go slowly. If you have data in multiple databases, initial sync might take between several days and several months, depending on the database size.

If the databases are in different datacenters, each row must travel between the different datacenters. This increases the cost of an initial sync.

#### Recommendation

If possible, start with data in only one of the sync group's databases.

### <a name="design-to-avoid-synchronization-loops"></a> Design to avoid sync loops

A sync loop occurs when there are circular references within a sync group. In that scenario, each change in one database is endlessly and circularly replicated through the databases in the sync group.   

Ensure that you avoid sync loops, because they cause performance degradation and might significantly increase costs.

### <a name="handling-changes-that-fail-to-propagate"></a> Changes that fail to propagate

#### Reasons that changes fail to propagate

Changes might fail to propagate for one of the following reasons:

-   Schema/datatype incompatibility.
-   Inserting null in non-nullable columns.
-   Violating foreign key constraints.

#### What happens when changes fail to propagate?

-   Sync group shows that it's in a **Warning** state.
-   Details are listed in the portal UI log viewer.
-   If the issue is not resolved for 45 days, the database becomes out of date.

> [!NOTE]
> These changes never propagate. The only way to recover in this scenario is to re-create the sync group.

#### Recommendation

Monitor the sync group and database health regularly through the portal and log interface.


## Maintenance

### <a name="avoid-out-of-date-databases-and-sync-groups"></a> Avoid out-of-date databases and sync groups

A sync group or a database in a sync group can become out of date. When a sync group's status is **Out-of-date**, it stops functioning. When a database's status is **Out-of-date**, data might be lost. It's best to avoid this scenario instead of trying to recover from it.

#### Avoid out-of-date databases

A database's status is set to **Out-of-date** when it has been offline for 45 days or more. To avoid an **Out-of-date** status on a database, ensure that none of the databases are offline for 45 days or more.

#### Avoid out-of-date sync groups

A sync group's status is set to **Out-of-date** when any change in the sync group fails to propagate to the rest of the sync group for 45 days or more. To avoid an **Out-of-date** status on a sync group, regularly check the sync group's history log. Ensure that all conflicts are resolved, and that changes are successfully propagated throughout the sync group databases.

A sync group might fail to apply a change for one of these reasons:

-   Schema incompatibility between tables.
-   Data incompatibility between tables.
-   Inserting a row with a null value in a column that doesn't allow null values.
-   Updating a row with a value that violates a foreign key constraint.

To prevent out-of-date sync groups:

-   Update the schema to allow the values that are contained in the failed rows.
-   Update the foreign key values to include the values that are contained in the failed rows.
-   Update the data values in the failed row so they are compatible with the schema or foreign keys in the target database.

### <a name="avoid-deprovisioning-issues"></a> Avoid deprovisioning issues

In some circumstances, unregistering a database with a client agent might cause sync to fail.

#### Scenario

1. Sync group A was created by using a SQL Database instance and a SQL Server database, which is associated with local agent 1.
2. The same on-premises database is registered with local agent 2 (this agent is not associated with any sync group).
3. Unregistering the on-premises database from local agent 2 removes the tracking and meta tables for sync group A for the on-premises database.
4. Sync group A operations fail, with this error: "The current operation could not be completed because the database is not provisioned for sync or you do not have permissions to the sync configuration tables."

#### Solution

To avoid this scenario, don't register a database with more than one agent.

To recover from this scenario:

1. Remove the database from each sync group that it belongs to.  
2. Add the database back into each sync group that you removed it from.  
3. Deploy each affected sync group (this action provisions the database).  

### <a name="modifying-your-sync-group"></a> Modifying a sync group

Don't attempt to remove a database from a sync group and then edit the sync group without first deploying one of the changes.

Instead, first remove a database from a sync group. Then, deploy the change and wait for deprovisioning to finish. When deprovisioning is finished, you can edit the sync group and deploy the changes.

If you attempt to remove a database and then edit a sync group without first deploying one of the changes, one or the other operation fails. The portal interface might become inconsistent. If this happens, refresh the page to restore the correct state.

### Avoid schema refresh timeout

If you have a complex schema to sync, you may encounter an "operation timeout" during a schema refresh if the sync metadata database has a lower SKU (example: basic). 

#### Solution

To mitigate this issue, please scale up your sync metadata database to have a higher SKU, such as S3. 

## Next steps
For more information about SQL Data Sync, see:

-   Overview - [Sync data across multiple cloud and on-premises databases with Azure SQL Data Sync](sql-data-sync-data-sql-server-sql-database.md)
-   Set up SQL Data Sync
    - In the portal - [Tutorial: Set up SQL Data Sync to sync data between Azure SQL Database and SQL Server](sql-data-sync-sql-server-configure.md)
    - With PowerShell
        -  [Use PowerShell to sync between multiple databases in Azure SQL Database](scripts/sql-data-sync-sync-data-between-sql-databases.md)
        -  [Use PowerShell to sync between a database in SQL Database and a database in a SQL Server instance](scripts/sql-data-sync-sync-data-between-azure-onprem.md)
-   Data Sync Agent - [Data Sync Agent for Azure SQL Data Sync](sql-data-sync-agent-overview.md)
-   Monitor - [Monitor SQL Data Sync with Azure Monitor logs](sql-data-sync-monitor-sync.md)
-   Troubleshoot - [Troubleshoot issues with Azure SQL Data Sync](sql-data-sync-troubleshoot.md)
-   Update the sync schema
    -   With Transact-SQL - [Automate the replication of schema changes in Azure SQL Data Sync](sql-data-sync-update-sync-schema.md)
    -   With PowerShell - [Use PowerShell to update the sync schema in an existing sync group](scripts/update-sync-schema-in-sync-group.md)

For more information about SQL Database, see:

-   [SQL Database overview](sql-database-paas-overview.md)
-   [Database lifecycle management](https://msdn.microsoft.com/library/jj907294.aspx)
