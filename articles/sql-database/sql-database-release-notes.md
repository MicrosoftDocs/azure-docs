---
title: Release Notes
description: Learn about the new features and improvements in the Azure SQL Database service and in the Azure SQL Database documentation
services: sql-database
author: stevestein
ms.service: sql-database
ms.subservice: service
ms.devlang: 
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: sstein
---
# SQL Database release notes

This article lists SQL Database features that are currently in public preview. For SQL Database updates and improvements, see [SQL Database service updates](https://azure.microsoft.com/updates/?product=sql-database). For updates and improvements to other Azure services, see [Service updates](https://azure.microsoft.com/updates).

## Features in public preview

### [Single database](#tab/single-database)

| Feature | Details |
| ---| --- |
| New Fsv2-series and M-series hardware generations| For information, see [Hardware generations](sql-database-service-tiers-vcore.md#hardware-generations).|
| [Azure private link](https://azure.microsoft.com/updates/private-link-now-available-in-preview/)| Private Link simplifies the network architecture and secures the connection between endpoints in Azure by keeping data on the Azure network, thus eliminating exposure to the internet. Private Link also enables you to create and render your own services on Azure. |
| Accelerated database recovery with single databases and elastic pools | For information, see [Accelerated Database Recovery](sql-database-accelerated-database-recovery.md).|
|Approximate Count Distinct|For information, see [Approximate Count Distinct](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing#approximate-query-processing).|
|Batch Mode on Rowstore (under compatibility level 150)|For information, see [Batch Mode on Rowstore](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing#batch-mode-on-rowstore).|
| Data discovery & classification  |For information, see [Azure SQL Database and SQL Data Warehouse data discovery & classification](sql-database-data-discovery-and-classification.md).|
| Elastic database jobs | For information, see [Create, configure, and manage elastic jobs](elastic-jobs-overview.md). |
| Elastic queries | For information, see [Elastic query overview](sql-database-elastic-query-overview.md). |
| Elastic transactions | [Distributed transactions across cloud databases](sql-database-elastic-transactions-overview.md). |
|Memory Grant Feedback (Row Mode) (under compatibility level 150)|For information, see [Memory Grant Feedback (Row Mode)](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing#row-mode-memory-grant-feedback).|
| Query editor in the Azure portal |For information, see [Use the Azure portal's SQL query editor to connect and query data](sql-database-connect-query-portal.md).|
| R services / machine learning with single databases and elastic pools |For information, see [Machine Learning Services in Azure SQL Database](https://docs.microsoft.com/sql/advanced-analytics/what-s-new-in-sql-server-machine-learning-services?view=sql-server-2017#machine-learning-services-in-azure-sql-database).|
|SQL Analytics|For information, see [Azure SQL Analytics](../azure-monitor/insights/azure-sql.md).|
|Table Variable Deferred Compilation (under compatibility level 150)|For information, see [Table Variable Deferred Compilation](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing#table-variable-deferred-compilation).|
| &nbsp; |

### [Managed Instance](#tab/managed-instance)

| Feature | Details |
| ---| --- |
| <a href="/azure/sql-database/sql-database-instance-pools">Instance pools</a> | A convenient and cost-efficient way to migrate smaller SQL instances to the cloud. |
| <a href="https://aka.ms/managed-instance-aadlogins">Instance-level Azure AD server principals (logins)</a> | Create server-level logins using <a href="https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current">CREATE LOGIN FROM EXTERNAL PROVIDER</a> statement. |
| [Transactional Replication](sql-database-managed-instance-transactional-replication.md) | Replicate the changes from your tables into other databases placed on Managed Instances, Single Databases, or SQL Server instances, or update your tables when some rows are changed in other Managed Instances or SQL Server instance. For information, see [Configure replication in an Azure SQL Database managed instance database](replication-with-sql-database-managed-instance.md). |
| Threat detection |For information, see [Configure threat detection in Azure SQL Database managed instance](sql-database-managed-instance-threat-detection.md).|

---

## Managed instance - new features and known issues

### Managed instance H2 2019 updates

- [Service-aided subnet configuration](https://azure.microsoft.com/updates/service-aided-subnet-configuration-for-managed-instance-in-azure-sql-database-available/) A secure and convenient way to manage subnet configuration where you control data traffic while managed instance ensures the uninterrupted flow of management traffic
- [Transparent data encryption (TDE) with Bring Your Own Key (BYOK)](https://azure.microsoft.com/updates/general-avilability-transparent-data-encryption-with-customer-managed-keys-for-azure-sql-database-managed-instance/) enables bring-your-own-key (BYOK) scenario for data protection at rest and allows organizations to separate management duties for keys and data.
- [Auto-failover groups](https://azure.microsoft.com/updates/azure-sql-database-auto-failover-groups-feature-now-available-in-all-regions/) enable you to replicate all databases from the primary instance to a secondary instance in another region.
- Configure your Managed instance behavior with [Global trace flags](https://azure.microsoft.com/updates/global-trace-flags-are-now-available-in-azure-sql-database-managed-instance/).

### Managed instance H1 2019 updates

The following features are enabled in Managed instance deployment model in H1 2019:
  - Support for subscriptions with <a href="https://aka.ms/sql-mi-visual-studio-subscribers"> Azure monthly credit for Visual Studio subscribers </a> and increased [regional limits](sql-database-managed-instance-resource-limits.md#regional-resource-limitations).
  - Support for <a href="https://docs.microsoft.com/sharepoint/administration/deploy-azure-sql-managed-instance-with-sharepoint-servers-2016-2019"> SharePoint 2016 and SharePoint 2019 </a> and <a href="https://docs.microsoft.com/business-applications-release-notes/october18/dynamics365-business-central/support-for-azure-sql-database-managed-instance"> Dynamics 365 Business Central </a>
  - Create instances with <a href="https://aka.ms/managed-instance-collation">server-level collation</a> and <a href="https://azure.microsoft.com/updates/managed-instance-time-zone-ga/">time-zone</a> of your choice.
  - Managed instances are now protected with <a href="sql-database-managed-instance-management-endpoint-verify-built-in-firewall.md">built-in firewall</a>.
  - Configure instances to use [public endpoints](sql-database-managed-instance-public-endpoint-configure.md), [Proxy override](sql-database-connectivity-architecture.md#connection-policy) connection to get better network performance, <a href="https://aka.ms/four-cores-sql-mi-update"> 4 vCores on Gen5 hardware generation</a> or <a href="https://aka.ms/managed-instance-configurable-backup-retention">Configure backup retention up to 35 days</a> for Point-in-time restore. Long-term backup retention (up to 10 years) is still not enabled so you can use <a href="https://docs.microsoft.com/sql/relational-databases/backup-restore/copy-only-backups-sql-server">Copy-only backups</a> as an alternative.
  - New functionalities enable you to <a href="https://medium.com/@jocapc/geo-restore-your-databases-on-azure-sql-instances-1451480e90fa">geo-restore your database to another data center using PowerShell</a>, [rename database](https://azure.microsoft.com/updates/azure-sql-database-managed-instance-database-rename-is-supported/), [delete virtual cluster](sql-database-managed-instance-delete-virtual-cluster.md).
  - New built-in [Instance Contributor role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#sql-managed-instance-contributor) enables separation of duty (SoD) compliance with security principles and compliance with enterprise standards.
  - Managed instance is available in the following Azure Government regions to GA (US Gov Texas, US Gov Arizona) as well as in China North 2 and China East 2. It is also available in the following public regions: Australia Central, Australia Central 2, Brazil South, France South, UAE Central, UAE North, South Africa North, South Africa West.

### Known issues

|Issue  |Date discovered  |Status  |Date resolved  |
|---------|---------|---------|---------|
|[Permissions on resource group not applied to Managed Instance](#permissions-on-resource-group-not-applied-to-managed-instance)|Feb 2020|Has Workaround||
|[Limitation of manual failover via portal for failover groups](#limitation-of-manual-failover-via-portal-for-failover-groups)|Jan 2020|Has Workaround||
|[SQL Agent roles need explicit EXECUTE permissions for non-sysadmin logins](#in-memory-oltp-memory-limits-are-not-applied)|Dec 2019|Has Workaround||
|[SQL Agent jobs can be interrupted by Agent process restart](#sql-agent-jobs-can-be-interrupted-by-agent-process-restart)|Dec 2019|No Workaround|Mar 2020|
|[AAD logins and users are not supported in SSDT](#aad-logins-and-users-are-not-supported-in-ssdt)|Nov 2019|No Workaround||
|[In-memory OLTP memory limits are not applied](#in-memory-oltp-memory-limits-are-not-applied)|Oct 2019|Has Workaround||
|[Wrong error returned while trying to remove a file that is not empty](#wrong-error-returned-while-trying-to-remove-a-file-that-is-not-empty)|Oct 2019|Has Workaround||
|[Change service tier and create instance operations are blocked by ongoing database restore](#change-service-tier-and-create-instance-operations-are-blocked-by-ongoing-database-restore)|Sep 2019|Has Workaround||
|[Resource Governor on Business Critical service tier might need to be reconfigured after failover](#resource-governor-on-business-critical-service-tier-might-need-to-be-reconfigured-after-failover)|Sep 2019|Has Workaround||
|[Cross-database Service Broker dialogs must be re-initialized after service tier upgrade](#cross-database-service-broker-dialogs-must-be-re-initialized-after-service-tier-upgrade)|Aug 2019|Has Workaround||
|[Impersonification of Azure AD login types is not supported](#impersonification-of-azure-ad-login-types-is-not-supported)|Jul 2019|No Workaround||
|[@query parameter not supported in sp_send_db_mail](#-parameter-not-supported-in-sp_send_db_mail)|Apr 2019|No Workaround||
|[Transactional Replication must be reconfigured after geo-failover](#transactional-replication-must-be-reconfigured-after-geo-failover)|Mar 2019|No Workaround||
|[Temporary database is used during RESTORE operation](#temporary-database-is-used-during-restore-operation)||Has Workaround||
|[TEMPDB structure and content is re-created](#tempdb-structure-and-content-is-re-created)||No Workaround||
|[Exceeding storage space with small database files](#exceeding-storage-space-with-small-database-files)||Has Workaround||
|[GUID values shown instead of database names](#guid-values-shown-instead-of-database-names)||Has Workaround||
|[Error logs aren't persisted](#error-logs-arent-persisted)||No Workaround||
|[Transaction scope on two databases within the same instance isn't supported](#transaction-scope-on-two-databases-within-the-same-instance-isnt-supported)||Has Workaround||
|[CLR modules and linked servers sometimes can't reference a local IP address](#clr-modules-and-linked-servers-sometimes-cant-reference-a-local-ip-address)||Has Workaround||
|Database consistency not verified using DBCC CHECKDB after restore database from Azure Blob Storage.||Resolved|Nov 2019|
|Point-in-time database restore from Business Critical tier to General Purpose tier will not succeed if source database contains in-memory OLTP objects.||Resolved|Oct 2019|
|Database Mail feature with external (non-Azure) mail servers using secure connection||Resolved|Oct 2019|
|Contained databases not supported in managed instance||Resolved|Aug 2019|

### Permissions on resource group not applied to managed instance

Managed Instance Contributor RBAC role when applied to a resource group (RG) is not applied to Managed Instance and has no effect.

**Workaround**: Setup Managed Instance Contributor role for users at the subscription level.

### Limitation of manual failover via portal for failover groups

If failover group spans across instances in different Azure subscriptions or resource groups, manual failover cannot be initiated from the primary instance in the failover group.

**Workaround**: Initiate failover via portal from the geo-secondary instance.

### SQL Agent roles need explicit EXECUTE permissions for non-sysadmin logins

If non-sysadmin logins are added to any of [SQL Agent fixed database roles](https://docs.microsoft.com/sql/ssms/agent/sql-server-agent-fixed-database-roles), there exists an issue in which explicit EXECUTE permissions need to be granted to the master stored procedures for these logins to work. If this issue is encountered, the error message “The EXECUTE permission was denied on the object <object_name> (Microsoft SQL Server, Error: 229)” will be shown.

**Workaround**: Once you add logins to either of SQL Agent fixed database roles: SQLAgentUserRole, SQLAgentReaderRole or SQLAgentOperatorRole, for each of the logins added to these roles execute the below T-SQL script to explicitly grant EXECUTE permissions to the stored procedures listed.

```tsql
USE [master]
GO
CREATE USER [login_name] FOR LOGIN [login_name]
GO
GRANT EXECUTE ON master.dbo.xp_sqlagent_enum_jobs TO [login_name]
GRANT EXECUTE ON master.dbo.xp_sqlagent_is_starting TO [login_name]
GRANT EXECUTE ON master.dbo.xp_sqlagent_notify TO [login_name]
```

### SQL Agent jobs can be interrupted by Agent process restart

SQL Agent creates a new session each time job is started, gradually increasing memory consumption. To avoid hitting the internal memory limit which would block execution of scheduled jobs, Agent process will be restarted once its memory consumption reaches threshold. It may result in interrupting execution of jobs running at the moment of restart.

### In-memory OLTP memory limits are not applied

Business Critical service-tier will not correctly apply [max memory limits for memory-optimized objects](sql-database-managed-instance-resource-limits.md#in-memory-oltp-available-space) in some cases. Managed instance may enable workload to use more memory for In-memory OLTP operations, which may affect availability and stability of the instance. In-memory OLTP queries that are reaching the limits might not fail immediately. This issue will be fixed soon. The queries that use more In-memory OLTP memory will fail sooner if they reach the [limits](sql-database-managed-instance-resource-limits.md#in-memory-oltp-available-space).

**Workaround:** [Monitor In-memory OLTP storage usage](https://docs.microsoft.com/azure/sql-database/sql-database-in-memory-oltp-monitoring) using [SQL Server Management Studio](/sql/relational-databases/in-memory-oltp/monitor-and-troubleshoot-memory-usage#bkmk_Monitoring) to ensure that the workload is not using more than available memory. Increase the memory limits that depend on the number of vCores, or optimize your workload to use less memory.

### Wrong error returned while trying to remove a file that is not empty

SQL Server/Managed Instance [don't allow user to drop a file that is not empty](/sql/relational-databases/databases/delete-data-or-log-files-from-a-database#Prerequisites). If you try to remove a non-empty data file using `ALTER DATABASE REMOVE FILE` statement, the error `Msg 5042 – The file '<file_name>' cannot be removed because it is not empty` will not be immediately returned. Managed Instance will keep trying to drop the file and the operation will fail after 30min with `Internal server error`.

**Workaround**: Remove the content of the file using `DBCC SHRINKFILE (N'<file_name>', EMPTYFILE)` command. If this is the only file in the filegroup you would need to delete data from the table or partition associated to this filegroup before you shrink the file, and optionally load this data into another table/partition.

### Change service tier and create instance operations are blocked by ongoing database restore

Ongoing `RESTORE` statement, Data Migration Service migration process, and built-in point-in time restore will block updating service tier or resize of the existing instance and creating new instances until restore process finishes. 
Restore process will block these operations on the Managed instances and instance pools in the same subnet where restore process is running. The instances in instance pools are not affected. Create or change service tier operations will not fail or timeout - they will proceed once the restore process is completed or canceled.

**Workaround**: Wait until the restore process finishes, or cancel the restore process if creation or update service-tier operation has higher priority.

### Resource Governor on Business Critical service tier might need to be reconfigured after failover

[Resource Governor](/sql/relational-databases/resource-governor/resource-governor) feature that enables you to limit the resources assigned to the user workload might incorrectly classify some user workload after failover or user-initiated change of service tier (for example, the change of max vCore or max instance storage size).

**Workaround**: Run `ALTER RESOURCE GOVERNOR RECONFIGURE` periodically or as part of SQL Agent Job that executes the SQL task when the instance starts if you are using 
[Resource Governor](/sql/relational-databases/resource-governor/resource-governor).

### Cross-database Service Broker dialogs must be re-initialized after service tier upgrade

Cross-database Service Broker dialogs will stop delivering the messages to the services in other databases after change service tier operation. The messages are **not lost** and they can be found in the sender queue. Any change of vCores or instance storage size in Managed Instance, will cause `service_broke_guid` value in [sys.databases](/sql/relational-databases/system-catalog-views/sys-databases-transact-sql) view to be changed for all databases. Any `DIALOG` created using [BEGIN DIALOG](/sql/t-sql/statements/begin-dialog-conversation-transact-sql) statement that references Service Brokers in other database will stop delivering messages to the target service.

**Workaround:** Stop any activity that uses cross-database Service Broker dialog conversations before updating service tier and re-initialize them after. If there are remaining messages that are undelivered after service tier change, read the messages from the source queue and resend them to the target queue.

### Impersonification of Azure AD login types is not supported

Impersonation using `EXECUTE AS USER` or `EXECUTE AS LOGIN` of following AAD principals is not supported:
-	Aliased AAD users. The following error is returned in this case `15517`.
- AAD logins and users based on AAD applications or service principals. The following errors are returned in this case `15517` and `15406`.

### @query parameter not supported in sp_send_db_mail

The `@query` parameter in the [sp_send_db_mail](/sql/relational-databases/system-stored-procedures/sp-send-dbmail-transact-sql) procedure doesn't work.

### Transactional Replication must be reconfigured after geo-failover

If Transactional Replication is enabled on a database in an auto-failover group, the managed instance administrator must clean up all publications on the old primary and reconfigure them on the new primary after a failover to another region occurs. See [Replication](sql-database-managed-instance-transact-sql-information.md#replication) for more details.

### AAD logins and users are not supported in SSDT

SQL Server Data Tools don't fully support Azure Active directory logins and users.

### Temporary database is used during RESTORE operation

When a database is restoring on Managed Instance, the restore service will first create an empty database with the desired name to allocate the name on the instance. After some time, this database will be dropped and restoring of the actual database will be started. The database that is in *Restoring* state will temporary have a random GUID value instead of name. The temporary name will be changed to the desired name specified in `RESTORE` statement once the restore process completes. In the initial phase, user can access the empty database and even create tables or load data in this database. This temporary database will be dropped when the restore service starts the second phase.

**Workaround**: Do not access the database that you are restoring until you see that restore is completed.

### TEMPDB structure and content is re-created

The `tempdb` database is always split into 12 data files and the file structure cannot be changed. The maximum size per file can't be changed, and new files cannot be added to `tempdb`. `Tempdb` is always re-created as an empty database when the instance starts or fails over, and any changes made in `tempdb` will not be preserved.

### Exceeding storage space with small database files

`CREATE DATABASE`, `ALTER DATABASE ADD FILE`, and `RESTORE DATABASE` statements might fail because the instance can reach the Azure Storage limit.

Each General Purpose managed instance has up to 35 TB of storage reserved for Azure Premium Disk space. Each database file is placed on a separate physical disk. Disk sizes can be 128 GB, 256 GB, 512 GB, 1 TB, or 4 TB. Unused space on the disk isn't charged, but the total sum of Azure Premium Disk sizes can't exceed 35 TB. In some cases, a managed instance that doesn't need 8 TB in total might exceed the 35 TB Azure limit on storage size due to internal fragmentation.

For example, a General Purpose managed instance might have one large file that's 1.2 TB in size placed on a 4-TB disk. It also might have 248 files with 1 GB size each that are placed on separate 128-GB disks. In this example:

- The total allocated disk storage size is 1 x 4 TB + 248 x 128 GB = 35 TB.
- The total reserved space for databases on the instance is 1 x 1.2 TB + 248 x 1 GB = 1.4 TB.

This example illustrates that under certain circumstances, due to a specific distribution of files, a managed instance might reach the 35-TB limit that's reserved for an attached Azure Premium Disk when you might not expect it to.

In this example, existing databases continue to work and can grow without any problem as long as new files aren't added. New databases can't be created or restored because there isn't enough space for new disk drives, even if the total size of all databases doesn't reach the instance size limit. The error that's returned in that case isn't clear.

You can [identify the number of remaining files](https://medium.com/azure-sqldb-managed-instance/how-many-files-you-can-create-in-general-purpose-azure-sql-managed-instance-e1c7c32886c1) by using system views. If you reach this limit, try to [empty and delete some of the smaller files by using the DBCC SHRINKFILE statement](/sql/t-sql/database-console-commands/dbcc-shrinkfile-transact-sql#d-emptying-a-file) or switch to the [Business Critical tier, which doesn't have this limit](/azure/sql-database/sql-database-managed-instance-resource-limits#service-tier-characteristics).

### GUID values shown instead of database names

Several system views, performance counters, error messages, XEvents, and error log entries display GUID database identifiers instead of the actual database names. Don't rely on these GUID identifiers because they're replaced with actual database names in the future.

**Workaround**: Use sys.databases view to resolve actual database name from the physical database name, specified in form of GUID database identifiers

```tsql
SELECT name as ActualDatabaseName, physical_database_name as GUIDDatabaseIdentifier 
FROM sys.databases
WHERE database_id > 4
```

### Error logs aren't persisted

Error logs that are available in managed instance aren't persisted, and their size isn't included in the maximum storage limit. Error logs might be automatically erased if failover occurs. There might be gaps in the error log history because Managed Instance was moved several times on several virtual machines.

### Transaction scope on two databases within the same instance isn't supported

The `TransactionScope` class in .NET doesn't work if two queries are sent to two databases within the same instance under the same transaction scope:

```csharp
using (var scope = new TransactionScope())
{
    using (var conn1 = new SqlConnection("Server=quickstartbmi.neu15011648751ff.database.windows.net;Database=b;User ID=myuser;Password=mypassword;Encrypt=true"))
    {
        conn1.Open();
        SqlCommand cmd1 = conn1.CreateCommand();
        cmd1.CommandText = string.Format("insert into T1 values(1)");
        cmd1.ExecuteNonQuery();
    }

    using (var conn2 = new SqlConnection("Server=quickstartbmi.neu15011648751ff.database.windows.net;Database=b;User ID=myuser;Password=mypassword;Encrypt=true"))
    {
        conn2.Open();
        var cmd2 = conn2.CreateCommand();
        cmd2.CommandText = string.Format("insert into b.dbo.T2 values(2)");        cmd2.ExecuteNonQuery();
    }

    scope.Complete();
}

```

Although this code works with data within the same instance, it required MSDTC.

**Workaround:** Use [SqlConnection.ChangeDatabase(String)](/dotnet/api/system.data.sqlclient.sqlconnection.changedatabase) to use another database in a connection context instead of using two connections.

### CLR modules and linked servers sometimes can't reference a local IP address

CLR modules placed in a managed instance and linked servers or distributed queries that reference a current instance sometimes can't resolve the IP of a local instance. This error is a transient issue.

**Workaround:** Use context connections in a CLR module if possible.

## Updates

For a list of SQL Database updates and improvements, see [SQL Database service updates](https://azure.microsoft.com/updates/?product=sql-database).

For updates and improvements to all Azure services, see [Service updates](https://azure.microsoft.com/updates).

## Contribute to content

To contribute to the Azure SQL Database documentation, see the [Docs Contributor Guide](https://docs.microsoft.com/contribute/).
