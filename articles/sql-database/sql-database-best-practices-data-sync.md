---
title: "Best Practices for Azure SQL Data Sync | Microsoft Docs"
description: "Learn best practices for configuring and running Azure SQL Data Sync"
services: sql-database
ms.date: "11/13/2017"
ms.topic: "article"
ms.service: "sql-database"
author: "douglaslMS"
ms.author: "douglasl"
manager: "craigg"
---
# Best practices for SQL Data Sync (Preview) 

This article describes best practices for SQL Data Sync (Preview).

For an overview of SQL Data Sync, see [Sync data across multiple cloud and on-premises databases with Azure SQL Data Sync (Preview)](sql-database-sync-data.md).

## <a name="security-and-reliability"></a> Security and reliability

### Client Agent

-   Install the client agent using the least privilege account with network service access.

-   It is best if the client agent is installed on a computer separate from the on-premises SQL Server computer.

-   Do not register an on-premises database with more than one agent.

-   Even if syncing different tables for different sync groups.

-   Registering an on-premises database with multiple client agents poses challenges when deleting one of the sync groups.

### Database accounts with least required privilege

-   **For Sync Setup**. Create/Alter Table, Alter Database, Create Procedure, Select/ Alter Schema, Create User-Defined Type.

-   **For Ongoing Sync**. Select/ Insert/ Update/ Delete on tables selected for syncing and on sync metadata and tracking tables, Execute permission on stored procedures created by the service, Execute permission on user-defined table types.

-   **For de-provisioning**. Alter on tables part of sync, Select/ Delete on Sync Metadata tables, Control on sync tracking Sync Tracking tables, stored procedures, and user-defined types.

**How can you use this information when there is only a single credential for a database in the Sync Group?**

-   Change the credentials for different phases (for example, *credential1* for setup and *credential2* for ongoing).

-   Change the permission of the credentials (that is, change the permission after sync is set up).

## Setup

### <a name="database-considerations-and-constraints"></a> Database considerations and constraints

#### SQL Database instance size

When you create a new SQL Database instance, set the maximum size so that it is always larger than the database you deploy. If you do not set the maximum size larger than the deployed database, synchronization fails. While there is no automatic growth - you can do an ALTER DATABASE to increase the size of the database after it has been created. Make sure you stay within the SQL Database instance size limits.

> [!IMPORTANT]
> SQL Data Sync stores additional metadata with each database. Be sure to account for this metadata when you calculate space needed. The amount of added overhead is governed by the width of the tables (for example, narrow tables require more overhead) and the amount of traffic.

### <a name="table-considerations-and-constraints"></a> Table considerations and constraints

#### Selecting tables

Not all tables in a database are required to be in a sync group. The selection of which tables to include in a sync group and which to exclude (or include in a different Sync Group) can impact efficiency and costs. Include only those tables in a Sync Group that business needs demand and the tables upon which they are dependent.

#### Primary keys

Each table in a sync group must have a Primary Key. The SQL Data Sync (Preview) service is unable to synchronize any table that does not have a Primary Key.

Before rolling into production, test initial and ongoing sync performance.

### <a name="provisioning-destination-databases"></a> Provisioning destination databases

SQL Data Sync (Preview) Preview provides basic database auto-provisioning.

This section discusses the limitations of SQL Data Sync (Preview)'s provisioning.

#### Auto provisioning limitations

The following are limitations of SQL Data Sync (Preview) auto provisioning.

-   Only the columns selected are created in the destination table.
Thus, if some columns are not part of the sync group those columns are not provisioned in the destination tables.

-   Indexes are created only for the selected columns.
If the source table index has columns that are not part of the sync group those indexes are not provisioned in the destination tables.

-   Indexes on XML type columns are not provisioned.

-   CHECK constraints are not provisioned.

-   Existing triggers on the source tables are not provisioned.

-   Views and Stored Procedures are not created on the destination database.

#### Recommendations

-   Use the auto-provisioning capability only for trying the service.

-   For production, you should provision the database schema.

### <a name="locate-hub"></a> Where to locate the Hub Database

#### Enterprise-to-cloud scenario

To minimize latency, keep the hub database close to the greatest concentration of the sync group's database traffic.

#### Cloud-to-cloud scenario

-   When all the databases in a sync group are in one data center, the hub should be located in the same data center. This configuration reduces latency and the cost of data transfer between data centers.

-   When the databases in a sync group are in multiple data centers, the hub should be located in the same data center as most of the databases and database traffic.

#### Mixed scenarios

Apply the preceding guidelines to more complex sync group configurations.

## Sync

### <a name="avoid-a-slow-and-costly-initial-synchronization"></a> Avoid a slow and costly initial synchronization

This section discusses the initial synchronization of a sync group and what you can do to avoid an initial synchronization taking longer than necessary and costing more than it should.

#### How initial synchronization works

When you create a sync group, start with data in only one database. If you have data in multiple databases, SQL Data Sync (Preview) treats each row as a conflict that needs resolution. This conflict resolution causes the initial synchronization to go slowly, taking several days to several months, depending on the database size.

Additionally, if the databases are in different data centers, the costs of initial synchronization are higher than necessary, since each row must travel between the different data centers.

#### Recommendation

Whenever possible start with data in only one of the sync group's databases.

### <a name="design-to-avoid-synchronization-loops"></a> Design to avoid synchronization loops

A synchronization loop results when there are circular references within a sync group so that each change in one database is replicated through the databases in the sync group circularly and endlessly. You want to avoid synchronization loops as they degrade performance and can significantly increase costs.

### <a name="handling-changes-that-fail-to-propagate"></a> Handling changes that fail to propagate

#### Reasons that changes fail to propagate

Changes can fail to propagate due to many reasons. Some causes would be:

-   Schema/Datatype incompatibility.

-   Trying to insert null in non-nullable columns.

-   Violating foreign key constraints.

#### What happens when changes fail to propagate?

-   Sync Group shows it is in a warning state.

-   Details are in the Portal UI Log viewer.

-   If the issue is not resolved for 45 days, the database becomes out of date.

> [!NOTE]
> These changes never propagate. The only way to recover is to recreate the sync group.

#### Recommendation

Monitor the Sync Group and Database health regularly through the portal and log interface.


## Maintenance

### <a name="avoid-out-of-date-databases-and-sync-groups"></a> Avoid out-of-date databases and sync groups

A sync group or a database within a sync group can become out-of-date. When a sync group's status is "out-of-date", it stops functioning. When a database's status is "out-of-date", data can be lost. It is best to avoid these situations rather than have to recover from them.

#### Avoid out-of-date databases

A database's status is set to out-of-date when it has been offline for 45 days or more. Avoid the out-of-date status on a database by ensuring that none of the databases are offline for 45 days or more.

#### Avoid out-of-date sync groups

A sync group's status is set to out-of-date when any change within the sync group fails to propagate to the rest of the sync group for 45 days or more. Avoid the out-of-date status on a sync group by regularly checking the sync group's history log. Ensure that all conflicts are resolved and changes successfully propagated throughout the sync group databases.

Reasons a sync group may fail to apply a change include:

-   Schema incompatibility between tables.

-   Data incompatibility between tables.

-   Inserting a row with a null value in a column that does not allow null values.

-   Updating a row with a value that violates a foreign key constraint.

You can prevent out-of-date sync groups by:

-   Update the schema to allow the values contained in the failed rows.

-   Update the foreign key values to include the values contained in the failed rows.

-   Update the data values in the failed row to be compatible with the schema or foreign keys in the target database.

### <a name="avoid-deprovisioning-issues"></a> Avoid deprovisioning issues

Under certain circumstances, unregistering a database with a client agent can cause synchronizations to fail.

#### Scenario

1. Sync group A was created with a SQL Database instance and an on-premises SQL Server database, which is associated with local agent 1.

2. The same on-premises database is registered with local agent 2 (this agent is not associated with any sync group).

3. Unregistering the on-premises database from local agent 2 removes the tracking/meta tables for the sync group A for the on-premises database.

4. Now, the sync group A operations fail with the following error –
"The current operation could not be completed because the database is not provisioned for sync or you do not have permissions to the sync configuration tables."

#### Solution

Avoid the situation entirely by never registering a database with more than one agent.

To recover from this situation:

1. Remove the database from each sync group it belongs to.

2. Add the database back into each sync group you just removed it from.

3. Deploy each affected sync group (which provisions the database).

### <a name="modifying-your-sync-group"></a> Modifying a sync group

Do not attempt to remove a database from a sync group and then edit the sync group without first deploying one of the changes.

First, remove a database from a sync group. Then deploy the change and wait for de-provisioning to complete. Once this operation has completed, you may edit the sync group and deploy the changes.

If you attempt to remove a database, and then edit a sync group without first deploying one of the changes, one or the other operation fails, and the portal interface may get into an inconsistent state. In this case, you can refresh the page to restore the correct state.

## Next steps
For more info about SQL Data Sync, see:

-   [Sync data across multiple cloud and on-premises databases with Azure SQL Data Sync](sql-database-sync-data.md)
-   [Set up Azure SQL Data Sync](sql-database-get-started-sql-data-sync.md)
-   [Monitor Azure SQL Data Sync with OMS Log Analytics](sql-database-sync-monitor-oms.md)
-   [Troubleshoot issues with Azure SQL Data Sync](sql-database-troubleshoot-data-sync.md)

-   Complete PowerShell examples that show how to configure SQL Data Sync:
    -   [Use PowerShell to sync between multiple Azure SQL databases](scripts/sql-database-sync-data-between-sql-databases.md)
    -   [Use PowerShell to sync between an Azure SQL Database and a SQL Server on-premises database](scripts/sql-database-sync-data-between-azure-onprem.md)

-   [Download the SQL Data Sync REST API documentation](https://github.com/Microsoft/sql-server-samples/raw/master/samples/features/sql-data-sync/Data_Sync_Preview_REST_API.pdf?raw=true)

For more info about SQL Database, see:

-   [SQL Database Overview](sql-database-technical-overview.md)
-   [Database Lifecycle Management](https://msdn.microsoft.com/library/jj907294.aspx)
