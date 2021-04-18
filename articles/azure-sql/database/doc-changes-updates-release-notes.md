---
title: What's new? 
titleSuffix: Azure SQL Database & SQL Managed Instance
description: Learn about the new features and documentation improvements for Azure SQL Database & SQL Managed Instance.
services: sql-database
author: stevestein
ms.service: sql-db-mi
ms.subservice: service
ms.custom: sqldbrb=2
ms.devlang: 
ms.topic: conceptual
ms.date: 04/17/2021
ms.author: sstein
---
# What's new in Azure SQL Database & SQL Managed Instance?
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

This article lists Azure SQL Database and Azure SQL Managed Instance features that are currently in public preview. For SQL Database and SQL Managed Instance updates and improvements, see [SQL Database & SQL Managed Instance service updates](https://azure.microsoft.com/updates/?product=sql-database). For updates and improvements to other Azure services, see [Service updates](https://azure.microsoft.com/updates).

## What's new?

Documentation for Azure SQL Database and Azure SQL Managed Instance has been split into separate sections. We've also updated how we refer to a managed instance from *Azure SQL Database managed instance* to *Azure SQL Managed Instance*.

We've done this because some features and functionality vary greatly between a single database and a managed instance, and it has become increasingly challenging to explain complex nuances between Azure SQL Database and Azure SQL Managed Instance in individual shared articles.

This clarification between the different Azure SQL products should simplify and streamline the process of working with the SQL Server database engine in Azure, whether it's a single managed database in Azure SQL Database, a fully fledged managed instance hosting multiple databases in Azure SQL Managed Instance, or the familiar on-premises SQL Server product hosted on a virtual machine in Azure.

Consider that this is a work in progress and not every article has been updated yet. For example, documentation for Transact-SQL (T-SQL) statements, stored procedures, and many features shared between Azure SQL Database and Azure SQL Managed Instance are not yet complete, so we thank you for your patience as we continue clarifying the content. 

This table provides a quick comparison for the change in terminology: 


|**New term**  | **Previous term**  |**Explanation** |
|---------|---------|---------|
|**Azure SQL Managed Instance** | Azure SQL Database *managed instance*| Azure SQL Managed Instance is its own product within the Azure SQL family, rather than just a deployment option within Azure SQL Database. | 
|**Azure SQL Database**|Azure SQL Database *single database*| Unless explicitly specified otherwise, the product name Azure SQL Database includes both single databases and databases deployed to an elastic pool. |
|**Azure SQL Database**|Azure SQL Database *elastic pool*| Unless explicitly specified otherwise, the product name Azure SQL Database includes both single databases and databases deployed to an elastic pool.  |
|**Azure SQL Database** |Azure SQL Database | Though the term stays the same, it now only applies to single database and elastic pool deployments, and does not include managed instance. |
| **Azure SQL**| N/A | This refers to the family of SQL Server database engine products that are available in Azure: Azure SQL Database, Azure SQL Managed Instance, and SQL Server on Azure VMs. | 

## Features in public preview

### [Azure SQL Database](#tab/single-database)

| Feature | Details |
| ---| --- |
| Elastic database jobs (preview) | For information, see [Create, configure, and manage elastic jobs](elastic-jobs-overview.md). |
| Elastic queries | For information, see [Elastic query overview](elastic-query-overview.md). |
| Elastic transactions | [Distributed transactions across cloud databases](elastic-transactions-overview.md). |
| Query editor in the Azure portal |For information, see [Use the Azure portal's SQL query editor to connect and query data](connect-query-portal.md).|
|SQL Analytics|For information, see [Azure SQL Analytics](../../azure-monitor/insights/azure-sql.md).|
| &nbsp; |

### [Azure SQL Managed Instance](#tab/managed-instance)

| Feature | Details |
| ---| --- |
| [Distributed transactions](/azure/azure-sql/database/elastic-transactions-overview) | Distributed transactions across Managed Instances. |
| [Instance pools](/azure/sql-database/sql-database-instance-pools) | A convenient and cost-efficient way to migrate smaller SQL instances to the cloud. |
| [Instance-level Azure AD server principals (logins)](/sql/t-sql/statements/create-login-transact-sql) | Create instance-level logins using a [CREATE LOGIN FROM EXTERNAL PROVIDER](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current&preserve-view=true) statement. |
| [Transactional Replication](../managed-instance/replication-transactional-overview.md) | Replicate the changes from your tables into other databases in SQL Managed Instance, SQL Database, or SQL Server. Or update your tables when some rows are changed in other instances of SQL Managed Instance or SQL Server. For information, see [Configure replication in Azure SQL Managed Instance](../managed-instance/replication-between-two-instances-configure-tutorial.md). |
| Threat detection |For information, see [Configure threat detection in Azure SQL Managed Instance](../managed-instance/threat-detection-configure.md).|
| Long-term backup retention | For information, see [Configure long-term back up retention in Azure SQL Managed Instance](../managed-instance/long-term-backup-retention-configure.md), which is currently in limited public preview. |

---

## New features

### SQL Managed Instance H2 2019 updates

- [Service-aided subnet configuration](https://azure.microsoft.com/updates/service-aided-subnet-configuration-for-managed-instance-in-azure-sql-database-available/) is a secure and convenient way to manage subnet configuration where you control data traffic while SQL Managed Instance ensures the uninterrupted flow of management traffic.
- [Transparent Data Encryption (TDE) with Bring Your Own Key (BYOK)](https://azure.microsoft.com/updates/general-avilability-transparent-data-encryption-with-customer-managed-keys-for-azure-sql-database-managed-instance/) enables a bring-your-own-key (BYOK) scenario for data protection at rest and allows organizations to separate management duties for keys and data.
- [Auto-failover groups](https://azure.microsoft.com/updates/azure-sql-database-auto-failover-groups-feature-now-available-in-all-regions/) enable you to replicate all databases from the primary instance to a secondary instance in another region.
- [Global trace flags](https://azure.microsoft.com/updates/global-trace-flags-are-now-available-in-azure-sql-database-managed-instance/) allow you to configure SQL Managed Instance behavior.

### SQL Managed Instance H1 2019 updates

The following features are enabled in the SQL Managed Instance deployment model in H1 2019:
  - Support for subscriptions with <a href="/azure/azure-sql/managed-instance/resource-limits"> Azure monthly credit for Visual Studio subscribers </a> and increased [regional limits](../managed-instance/resource-limits.md#regional-resource-limitations).
  - Support for <a href="/sharepoint/administration/deploy-azure-sql-managed-instance-with-sharepoint-servers-2016-2019"> SharePoint 2016 and SharePoint 2019 </a> and <a href="/business-applications-release-notes/october18/dynamics365-business-central/support-for-azure-sql-database-managed-instance"> Dynamics 365 Business Central. </a>
  - Create a managed instance with <a href="/azure/azure-sql/managed-instance/scripts/create-powershell-azure-resource-manager-template">instance-level collation</a> and a <a href="https://azure.microsoft.com/updates/managed-instance-time-zone-ga/">time zone</a> of your choice.
  - Managed instances are now protected with [built-in firewall](../managed-instance/management-endpoint-verify-built-in-firewall.md).
  - Configure SQL Managed Instance to use [public endpoints](../managed-instance/public-endpoint-configure.md), [Proxy override](connectivity-architecture.md#connection-policy) connection to get better network performance, <a href="https://aka.ms/four-cores-sql-mi-update"> 4 vCores on Gen5 hardware generation</a> or <a href="/azure/azure-sql/database/automated-backups-overview">Configure backup retention up to 35 days</a> for point-in-time restore. [Long-term backup retention](long-term-retention-overview.md) (up to 10 years) is currently in public preview.  
  - New functionalities enable you to <a href="https://medium.com/@jocapc/geo-restore-your-databases-on-azure-sql-instances-1451480e90fa">geo-restore your database to another data center using PowerShell</a>, [rename database](https://azure.microsoft.com/updates/azure-sql-database-managed-instance-database-rename-is-supported/), [delete virtual cluster](../managed-instance/virtual-cluster-delete.md).
  - New built-in [Instance Contributor role](../../role-based-access-control/built-in-roles.md#sql-managed-instance-contributor) enables separation of duty (SoD) compliance with security principles and compliance with enterprise standards.
  - SQL Managed Instance is available in the following Azure Government regions to GA (US Gov Texas, US Gov Arizona) and in China North 2 and China East 2. It is also available in the following public regions: Australia Central, Australia Central 2, Brazil South, France South, UAE Central, UAE North, South Africa North, South Africa West.

## Known issues

|Issue  |Date discovered  |Status  |Date resolved  |
|---------|---------|---------|---------|
|[Changing the connection type does not affect connections through the failover group endpoint](#changing-the-connection-type-does-not-affect-connections-through-the-failover-group-endpoint)|Jan 2021|Has Workaround||
|[Procedure sp_send_dbmail may transiently fail when @query parameter is used](#procedure-sp_send_dbmail-may-transiently-fail-when--parameter-is-used)|Jan 2021|Has Workaround||
|[Distributed transactions can be executed after removing Managed Instance from Server Trust Group](#distributed-transactions-can-be-executed-after-removing-managed-instance-from-server-trust-group)|Oct 2020|Has Workaround||
|[Distributed transactions cannot be executed after Managed Instance scaling operation](#distributed-transactions-cannot-be-executed-after-managed-instance-scaling-operation)|Oct 2020|Has Workaround||
|[BULK INSERT](/sql/t-sql/statements/bulk-insert-transact-sql)/[OPENROWSET](/sql/t-sql/functions/openrowset-transact-sql) in Azure SQL and `BACKUP`/`RESTORE` statement in Managed Instance cannot use Azure AD Manage Identity to authenticate to Azure storage|Sep 2020|Has Workaround||
|[Service Principal cannot access Azure AD and AKV](#service-principal-cannot-access-azure-ad-and-akv)|Aug 2020|Has Workaround||
|[Restoring manual backup without CHECKSUM might fail](#restoring-manual-backup-without-checksum-might-fail)|May 2020|Resolved|June 2020|
|[Agent becomes unresponsive upon modifying, disabling, or enabling existing jobs](#agent-becomes-unresponsive-upon-modifying-disabling-or-enabling-existing-jobs)|May 2020|Resolved|June 2020|
|[Permissions on resource group not applied to SQL Managed Instance](#permissions-on-resource-group-not-applied-to-sql-managed-instance)|Feb 2020|Resolved|Nov 2020|
|[Limitation of manual failover via portal for failover groups](#limitation-of-manual-failover-via-portal-for-failover-groups)|Jan 2020|Has Workaround||
|[SQL Agent roles need explicit EXECUTE permissions for non-sysadmin logins](#in-memory-oltp-memory-limits-are-not-applied)|Dec 2019|Has Workaround||
|[SQL Agent jobs can be interrupted by Agent process restart](#sql-agent-jobs-can-be-interrupted-by-agent-process-restart)|Dec 2019|Resolved|Mar 2020|
|[Azure AD logins and users are not supported in SSDT](#azure-ad-logins-and-users-are-not-supported-in-ssdt)|Nov 2019|No Workaround||
|[In-memory OLTP memory limits are not applied](#in-memory-oltp-memory-limits-are-not-applied)|Oct 2019|Has Workaround||
|[Wrong error returned while trying to remove a file that is not empty](#wrong-error-returned-while-trying-to-remove-a-file-that-is-not-empty)|Oct 2019|Has Workaround||
|[Change service tier and create instance operations are blocked by ongoing database restore](#change-service-tier-and-create-instance-operations-are-blocked-by-ongoing-database-restore)|Sep 2019|Has Workaround||
|[Resource Governor on Business Critical service tier might need to be reconfigured after failover](#resource-governor-on-business-critical-service-tier-might-need-to-be-reconfigured-after-failover)|Sep 2019|Has Workaround||
|[Cross-database Service Broker dialogs must be reinitialized after service tier upgrade](#cross-database-service-broker-dialogs-must-be-reinitialized-after-service-tier-upgrade)|Aug 2019|Has Workaround||
|[Impersonation of Azure AD login types is not supported](#impersonation-of-azure-ad-login-types-is-not-supported)|Jul 2019|No Workaround||
|[@query parameter not supported in sp_send_db_mail](#-parameter-not-supported-in-sp_send_db_mail)|Apr 2019|Resolved|Jan 2021|
|[Transactional Replication must be reconfigured after geo-failover](#transactional-replication-must-be-reconfigured-after-geo-failover)|Mar 2019|No Workaround||
|[Temporary database is used during RESTORE operation](#temporary-database-is-used-during-restore-operation)||Has Workaround||
|[TEMPDB structure and content is re-created](#tempdb-structure-and-content-is-re-created)||No Workaround||
|[Exceeding storage space with small database files](#exceeding-storage-space-with-small-database-files)||Has Workaround||
|[GUID values shown instead of database names](#guid-values-shown-instead-of-database-names)||Has Workaround||
|[Error logs aren't persisted](#error-logs-arent-persisted)||No Workaround||
|[Transaction scope on two databases within the same instance isn't supported](#transaction-scope-on-two-databases-within-the-same-instance-isnt-supported)||Has Workaround|Mar 2020|
|[CLR modules and linked servers sometimes can't reference a local IP address](#clr-modules-and-linked-servers-sometimes-cant-reference-a-local-ip-address)||Has Workaround||
|Database consistency not verified using DBCC CHECKDB after restore database from Azure Blob Storage.||Resolved|Nov 2019|
|Point-in-time database restore from Business Critical tier to General Purpose tier will not succeed if source database contains in-memory OLTP objects.||Resolved|Oct 2019|
|Database mail feature with external (non-Azure) mail servers using secure connection||Resolved|Oct 2019|
|Contained databases not supported in SQL Managed Instance||Resolved|Aug 2019|

### Changing the connection type does not affect connections through the failover group endpoint

If an instance participates in an [auto-failover group](https://docs.microsoft.com/azure/azure-sql/database/auto-failover-group-overview), changing the instance's [connection type](https://docs.microsoft.com/azure/azure-sql/managed-instance/connection-types-overview) does not take effect for the connections established through the failover group listener endpoint.

**Workaround**: Drop and reecreate auto-failover group afer changing the connection type.

### Procedure sp_send_dbmail may transiently fail when @query parameter is used

Procedure sp_send_dbmail may transiently fail when `@query` parameter is used. When this issue occurs, every second execution of procedure sp_send_dbmail fails with error `Msg 22050, Level 16, State 1` and message `Failed to initialize sqlcmd library with error number -2147467259`. To be able to see this error properly, the procedure should be called with default value 0 for the parameter `@exclude_query_output`, otherwise the error will not be propagated.
This problem is caused by a known bug related to how sp_send_dbmail is using impersonation and connection pooling.
To work around this issue wrap code for sending email into a retry logic that relies on output parameter `@mailitem_id`. If the execution fails, then parameter value will be NULL, indicating sp_send_dbmail should be called one more time to successfully send an email. Here is an example this retry logic.
```sql
CREATE PROCEDURE send_dbmail_with_retry AS
BEGIN
    DECLARE @miid INT
    EXEC msdb.dbo.sp_send_dbmail
        @recipients = 'name@mail.com', @subject = 'Subject', @query = 'select * from dbo.test_table',
        @profile_name ='AzureManagedInstance_dbmail_profile', @execute_query_database = 'testdb',
        @mailitem_id = @miid OUTPUT

    -- If sp_send_dbmail returned NULL @mailidem_id then retry sending email.
    --
    IF (@miid is NULL)
    EXEC msdb.dbo.sp_send_dbmail
        @recipients = 'name@mail.com', @subject = 'Subject', @query = 'select * from dbo.test_table',
        @profile_name ='AzureManagedInstance_dbmail_profile', @execute_query_database = 'testdb',
END
```

### Distributed transactions can be executed after removing Managed Instance from Server Trust Group

[Server Trust Groups](../managed-instance/server-trust-group-overview.md) are used to establish trust between Managed Instances that is prerequisite for executing [distributed transactions](./elastic-transactions-overview.md). After removing Managed Instance from Server Trust Group or deleting the group you still might be able to execute distributed transactions. There is a workaround you can apply to be sure that distributed transactions are disabled and that is [user-initiated manual failover](../managed-instance/user-initiated-failover.md) on Managed Instance.

### Distributed transactions cannot be executed after Managed Instance scaling operation

Managed Instance scaling operations that include changing service tier or number of vCores will reset Server Trust Group settings on the backend and disable running [distributed transactions](./elastic-transactions-overview.md). As a workaround, delete and create new [Server Trust Group](../managed-instance/server-trust-group-overview.md) on Azure portal.

### BULK INSERT and BACKUP/RESTORE statements cannot use Managed Identity to access Azure storage

Bulk insert, BACKUP, and RESTORE statements, and OPENROWSET function cannot use `DATABASE SCOPED CREDENTIAL` with Managed Identity to authenticate to Azure storage. As a workaround, switch to SHARED ACCESS SIGNATURE authentication. The following example will not work on Azure SQL (both Database and Managed Instance):

```sql
CREATE DATABASE SCOPED CREDENTIAL msi_cred WITH IDENTITY = 'Managed Identity';
GO
CREATE EXTERNAL DATA SOURCE MyAzureBlobStorage
  WITH ( TYPE = BLOB_STORAGE, LOCATION = 'https://****************.blob.core.windows.net/curriculum', CREDENTIAL= msi_cred );
GO
BULK INSERT Sales.Invoices FROM 'inv-2017-12-08.csv' WITH (DATA_SOURCE = 'MyAzureBlobStorage');
```

**Workaround**: Use [Shared Access Signature to authenticate to storage](/sql/t-sql/statements/bulk-insert-transact-sql#f-importing-data-from-a-file-in-azure-blob-storage).

### Service Principal cannot access Azure AD and AKV

In some circumstances there might exist an issue with Service Principal used to access Azure AD and Azure Key Vault (AKV) services. As a result, this issue impacts usage of Azure AD authentication and Transparent Database Encryption (TDE) with SQL Managed Instance. This might be experienced as an intermittent connectivity issue, or not being able to run statements such are CREATE LOGIN/USER FROM EXTERNAL PROVIDER or EXECUTE AS LOGIN/USER. Setting up TDE with customer-managed key on a new Azure SQL Managed Instance might also not work in some circumstances.

**Workaround**: To prevent this issue from occurring on your SQL Managed Instance before executing any update commands, or in case you have already experienced this issue after update commands, go to Azure portal, access SQL Managed Instance [Active Directory admin blade](./authentication-aad-configure.md?tabs=azure-powershell#azure-portal). Verify if you can see the error message "Managed Instance needs a Service Principal to access Azure Active Directory. Click here to create a Service Principal". In case you have encountered this error message, click on it, and follow the step-by-step instructions provided until this error have been resolved.

### Restoring manual backup without CHECKSUM might fail

In certain circumstances manual backup of databases that was made on a managed instance without CHECKSUM might fail to be restored. In such cases, retry restoring the backup until you're successful.

**Workaround**: Take manual backups of databases on managed instances with CHECKSUM enabled.

### Agent becomes unresponsive upon modifying, disabling, or enabling existing jobs

In certain circumstances, modifying, disabling, or enabling an existing job can cause the agent to become unresponsive. The issue is automatically mitigated upon detection, resulting in a restart of the agent process.

### Permissions on resource group not applied to SQL Managed Instance

When the SQL Managed Instance Contributor Azure role is applied to a resource group (RG), it's not applied to SQL Managed Instance and has no effect.

**Workaround**: Set up a SQL Managed Instance Contributor role for users at the subscription level.

### Limitation of manual failover via portal for failover groups

If a failover group spans across instances in different Azure subscriptions or resource groups, manual failover cannot be initiated from the primary instance in the failover group.

**Workaround**: Initiate failover via the portal from the geo-secondary instance.

### SQL Agent roles need explicit EXECUTE permissions for non-sysadmin logins

If non-sysadmin logins are added to any [SQL Agent fixed database roles](/sql/ssms/agent/sql-server-agent-fixed-database-roles), there exists an issue in which explicit EXECUTE permissions need to be granted to the master stored procedures for these logins to work. If this issue is encountered, the error message "The EXECUTE permission was denied on the object <object_name> (Microsoft SQL Server, Error: 229)" will be shown.

**Workaround**: Once you add logins to a SQL Agent fixed database role (SQLAgentUserRole, SQLAgentReaderRole, or SQLAgentOperatorRole), for each of the logins added to these roles, execute the below T-SQL script to explicitly grant EXECUTE permissions to the stored procedures listed.

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

**(Resolved in March 2020)** SQL Agent creates a new session each time a job is started, gradually increasing memory consumption. To avoid hitting the internal memory limit, which would block execution of scheduled jobs, Agent process will be restarted once its memory consumption reaches threshold. It may result in interrupting execution of jobs running at the moment of restart.

### In-memory OLTP memory limits are not applied

The Business Critical service tier will not correctly apply [max memory limits for memory-optimized objects](../managed-instance/resource-limits.md#in-memory-oltp-available-space) in some cases. SQL Managed Instance may enable workload to use more memory for in-memory OLTP operations, which may affect availability and stability of the instance. In-memory OLTP queries that are reaching the limits might not fail immediately. This issue will be fixed soon. The queries that use more in-memory OLTP memory will fail sooner if they reach the [limits](../managed-instance/resource-limits.md#in-memory-oltp-available-space).

**Workaround**: [Monitor in-memory OLTP storage usage](../in-memory-oltp-monitor-space.md) using [SQL Server Management Studio](/sql/relational-databases/in-memory-oltp/monitor-and-troubleshoot-memory-usage#bkmk_Monitoring) to ensure that the workload is not using more than the available memory. Increase the memory limits that depend on the number of vCores, or optimize your workload to use less memory.
 
### Wrong error returned while trying to remove a file that is not empty

SQL Server and SQL Managed Instance [don't allow a user to drop a file that is not empty](/sql/relational-databases/databases/delete-data-or-log-files-from-a-database#Prerequisites). If you try to remove a nonempty data file using an `ALTER DATABASE REMOVE FILE` statement, the error `Msg 5042 – The file '<file_name>' cannot be removed because it is not empty` will not be immediately returned. SQL Managed Instance will keep trying to drop the file, and the operation will fail after 30 minutes with `Internal server error`.

**Workaround**: Remove the contents of the file using the `DBCC SHRINKFILE (N'<file_name>', EMPTYFILE)` command. If this is the only file in the file group you would need to delete data from the table or partition associated to this file group before you shrink the file, and optionally load this data into another table/partition.

### Change service tier and create instance operations are blocked by ongoing database restore

Ongoing `RESTORE` statement, Data Migration Service migration process, and built-in point-in-time restore will block updating a service tier or resize of the existing instance and creating new instances until the restore process finishes. 

The restore process will block these operations on the managed instances and instance pools in the same subnet where the restore process is running. The instances in instance pools are not affected. Create or change service tier operations will not fail or time out. They will proceed once the restore process is completed or canceled.

**Workaround**: Wait until the restore process finishes, or cancel the restore process if the creation or update-service-tier operation has higher priority.

### Resource Governor on Business Critical service tier might need to be reconfigured after failover

The [Resource Governor](/sql/relational-databases/resource-governor/resource-governor) feature that enables you to limit the resources assigned to the user workload might incorrectly classify some user workload after failover or a user-initiated change of service tier (for example, the change of max vCore or max instance storage size).

**Workaround**: Run `ALTER RESOURCE GOVERNOR RECONFIGURE` periodically or as part of a SQL Agent job that executes the SQL task when the instance starts if you are using 
[Resource Governor](/sql/relational-databases/resource-governor/resource-governor).

### Cross-database Service Broker dialogs must be reinitialized after service tier upgrade

Cross-database Service Broker dialogs will stop delivering the messages to the services in other databases after change service tier operation. The messages are *not lost*, and they can be found in the sender queue. Any change of vCores or instance storage size in SQL Managed Instance will cause a `service_broke_guid` value in [sys.databases](/sql/relational-databases/system-catalog-views/sys-databases-transact-sql) view to be changed for all databases. Any `DIALOG` created using a [BEGIN DIALOG](/sql/t-sql/statements/begin-dialog-conversation-transact-sql) statement that references Service Brokers in other database will stop delivering messages to the target service.

**Workaround**: Stop any activity that uses cross-database Service Broker dialog conversations before updating a service tier, and reinitialize them afterward. If there are remaining messages that are undelivered after a service tier change, read the messages from the source queue and resend them to the target queue.

### Impersonation of Azure AD login types is not supported

Impersonation using `EXECUTE AS USER` or `EXECUTE AS LOGIN` of the following Azure Active Directory (Azure AD) principals is not supported:
-   Aliased Azure AD users. The following error is returned in this case: `15517`.
- Azure AD logins and users based on Azure AD applications or service principals. The following errors are returned in this case: `15517` and `15406`.

### @query parameter not supported in sp_send_db_mail

The `@query` parameter in the [sp_send_db_mail](/sql/relational-databases/system-stored-procedures/sp-send-dbmail-transact-sql) procedure doesn't work.

### Transactional Replication must be reconfigured after geo-failover

If Transactional Replication is enabled on a database in an auto-failover group, the SQL Managed Instance administrator must clean up all publications on the old primary and reconfigure them on the new primary after a failover to another region occurs. For more information, see [Replication](../managed-instance/transact-sql-tsql-differences-sql-server.md#replication).

### Azure AD logins and users are not supported in SSDT

SQL Server Data Tools don't fully support Azure AD logins and users.

### Temporary database is used during RESTORE operation

When a database is restoring in SQL Managed Instance, the restore service will first create an empty database with the desired name to allocate the name on the instance. After some time, this database will be dropped, and restoring of the actual database will be started. 

The database that is in *Restoring* state will temporarily have a random GUID value instead of name. The temporary name will be changed to the desired name specified in the `RESTORE` statement once the restore process finishes. 

In the initial phase, a user can access the empty database and even create tables or load data in this database. This temporary database will be dropped when the restore service starts the second phase.

**Workaround**: Do not access the database that you are restoring until you see that restore is completed.

### TEMPDB structure and content is re-created

The `tempdb` database is always split into 12 data files, and the file structure cannot be changed. The maximum size per file can't be changed, and new files cannot be added to `tempdb`. `Tempdb` is always re-created as an empty database when the instance starts or fails over, and any changes made in `tempdb` will not be preserved.

### Exceeding storage space with small database files

`CREATE DATABASE`, `ALTER DATABASE ADD FILE`, and `RESTORE DATABASE` statements might fail because the instance can reach the Azure Storage limit.

Each General Purpose instance of SQL Managed Instance has up to 35 TB of storage reserved for Azure Premium Disk space. Each database file is placed on a separate physical disk. Disk sizes can be 128 GB, 256 GB, 512 GB, 1 TB, or 4 TB. Unused space on the disk isn't charged, but the total sum of Azure Premium Disk sizes can't exceed 35 TB. In some cases, a managed instance that doesn't need 8 TB in total might exceed the 35 TB Azure limit on storage size due to internal fragmentation.

For example, a General Purpose instance of SQL Managed Instance might have one large file that's 1.2 TB in size placed on a 4-TB disk. It also might have 248 files that are 1 GB each and that are placed on separate 128-GB disks. In this example:

- The total allocated disk storage size is 1 x 4 TB + 248 x 128 GB = 35 TB.
- The total reserved space for databases on the instance is 1 x 1.2 TB + 248 x 1 GB = 1.4 TB.

This example illustrates that under certain circumstances, due to a specific distribution of files, an instance of SQL Managed Instance might reach the 35-TB limit that's reserved for an attached Azure Premium Disk when you might not expect it to.

In this example, existing databases continue to work and can grow without any problem as long as new files aren't added. New databases can't be created or restored because there isn't enough space for new disk drives, even if the total size of all databases doesn't reach the instance size limit. The error that's returned in that case isn't clear.

You can [identify the number of remaining files](https://medium.com/azure-sqldb-managed-instance/how-many-files-you-can-create-in-general-purpose-azure-sql-managed-instance-e1c7c32886c1) by using system views. If you reach this limit, try to [empty and delete some of the smaller files by using the DBCC SHRINKFILE statement](/sql/t-sql/database-console-commands/dbcc-shrinkfile-transact-sql#d-emptying-a-file) or switch to the [Business Critical tier, which doesn't have this limit](../managed-instance/resource-limits.md#service-tier-characteristics).

### GUID values shown instead of database names

Several system views, performance counters, error messages, XEvents, and error log entries display GUID database identifiers instead of the actual database names. Don't rely on these GUID identifiers because they're replaced with actual database names in the future.

**Workaround**: Use sys.databases view to resolve the actual database name from the physical database name, specified in the form of GUID database identifiers:

```tsql
SELECT name as ActualDatabaseName, physical_database_name as GUIDDatabaseIdentifier 
FROM sys.databases
WHERE database_id > 4
```

### Error logs aren't persisted

Error logs that are available in SQL Managed Instance aren't persisted, and their size isn't included in the maximum storage limit. Error logs might be automatically erased if failover occurs. There might be gaps in the error log history because SQL Managed Instance was moved several times on several virtual machines.

### Transaction scope on two databases within the same instance isn't supported

**(Resolved in March 2020)** The `TransactionScope` class in .NET doesn't work if two queries are sent to two databases within the same instance under the same transaction scope:

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

**Workaround (not needed since March 2020)**: Use [SqlConnection.ChangeDatabase(String)](/dotnet/api/system.data.sqlclient.sqlconnection.changedatabase) to use another database in a connection context instead of using two connections.

### CLR modules and linked servers sometimes can't reference a local IP address

CLR modules in SQL Managed Instance and linked servers or distributed queries that reference a current instance sometimes can't resolve the IP of a local instance. This error is a transient issue.

**Workaround**: Use context connections in a CLR module if possible.

## Updates

For a list of SQL Database updates and improvements, see [SQL Database service updates](https://azure.microsoft.com/updates/?product=sql-database).

For updates and improvements to all Azure services, see [Service updates](https://azure.microsoft.com/updates).

## Contribute to content

To contribute to the Azure SQL documentation, see the [Docs contributor guide](/contribute/).
