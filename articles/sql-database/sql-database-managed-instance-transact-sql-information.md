---
title: Azure SQL Database Managed Instance T-SQL Differences | Microsoft Docs 
description: This article discusses the T-SQL differences between Azure SQL Database Managed Instance and SQL Server. 
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop 
ms.reviewer: carlrab, bonova 
manager: craigg 
ms.date: 08/13/2018 
--- 
# Azure SQL Database Managed Instance T-SQL differences from SQL Server 

Azure SQL Database Managed Instance provides high compatibility with on-premises SQL Server Database Engine. Most of the SQL Server Database Engine features are supported in Managed Instance. Since there are still some differences in syntax and behavior, this article summarizes and explains these differences.
 - [T-SQL differences and unsupported features](#Differences)
 - [Features that have different behavior in Managed Instance](#Changes)
 - [Temporary limitations and known issues](#Issues)

## <a name="Differences"></a> T-SQL differences from SQL Server 

This section summarizes key differences in T-SQL syntax and behavior between Managed Instance and on-premises SQL Server Database Engine, as well as unsupported features.

### Always-On availability

[High availability](sql-database-high-availability.md) is built into Managed Instance and cannot be controlled by users. The following statements are not supported:
 - [CREATE ENDPOINT … FOR DATABASE_MIRRORING](https://docs.microsoft.com/sql/t-sql/statements/create-endpoint-transact-sql)
 - [CREATE AVAILABILITY GROUP](https://docs.microsoft.com/sql/t-sql/statements/create-availability-group-transact-sql)
 - [ALTER AVAILABILITY GROUP](https://docs.microsoft.com/sql/t-sql/statements/alter-availability-group-transact-sql)
 - [DROP AVAILABILITY GROUP](https://docs.microsoft.com/sql/t-sql/statements/drop-availability-group-transact-sql)
 - [SET HADR](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-set-hadr) clause of the [ALTER DATABASE](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql) statement

### Auditing 
 
The key differences between SQL Audit in Managed Instance, Azure SQL Database, and SQL Server on-premises are:
- In Managed Instance, SQL Audit works at the server level and stores `.xel` files on Azure blob storage account.  
- In Azure SQL Database, SQL Audit works at the database level.
- In SQL Server on-premises / virtual machine, SQL Audit works at the server level, but stores events on files system/windows event logs.  
  
XEvent auditing in Managed Instance supports Azure blob storage targets. File and windows logs are not supported.    
 
The key differences in the `CREATE AUDIT` syntax for Auditing to Azure blob storage are:
- A new syntax `TO URL` is provided and enables you to specify URL of the Azure blob Storage container where `.xel` files will be placed 
- The syntax `TO FILE` is not supported because Managed Instance cannot access Windows file shares. 
 
For more information, see:  
- [CREATE SERVER AUDIT](https://docs.microsoft.com/sql/t-sql/statements/create-server-audit-transact-sql)  
- [ALTER SERVER AUDIT](https://docs.microsoft.com/sql/t-sql/statements/alter-server-audit-transact-sql) 
- [Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine)     

### Backup 

Managed Instance has automatic backups, and enables users to create full database `COPY_ONLY` backups. Differential, log, and file snapshot backups are not supported.  
- Managed Instance can back up a database only to an Azure Blob Storage account: 
 - Only `BACKUP TO URL` is supported 
 - `FILE`, `TAPE`, and backup devices are not supported  
- Most of the general `WITH` options are supported 
 - `COPY_ONLY` is mandatory
 - `FILE_SNAPSHOT` not supported  
 - Tape options: `REWIND`, `NOREWIND`, `UNLOAD`, and `NOUNLOAD` are not supported 
 - Log-specific options: `NORECOVERY`, `STANDBY`, and `NO_TRUNCATE` are not supported 
 
Limitations:  
- Managed Instance can back up a database to a backup with up to 32 stripes, which is enough for the databases up to 4 TB if backup compression is used.
- Max backup stripe size is 195 GB (maximum blob size). Increase the number of stripes in the backup command to reduce individual stripe size and stay within this limit. 

> [!TIP]
> To work around this limitation on-premises, backup to `DISK` instead of backup to `URL`, upload backup file to blob, then restore. Restore supports bigger files because a different blob type is used.  

For information about backups using T-SQL, see [BACKUP](https://docs.microsoft.com/sql/t-sql/statements/backup-transact-sql).

### Buffer pool extension 
 
- [Buffer pool extension](https://docs.microsoft.com/sql/database-engine/configure-windows/buffer-pool-extension) is not supported.
- `ALTER SERVER CONFIGURATION SET BUFFER POOL EXTENSION` is not supported. See [ALTER SERVER CONFIGURATION](https://docs.microsoft.com/sql/t-sql/statements/alter-server-configuration-transact-sql). 
 
### Bulk insert / openrowset

Managed Instance cannot access file shares and Windows folders, so the files must be imported from Azure blob storage.
- `DATASOURCE` is required in `BULK INSERT` command while importing files from Azure blob storage. See [BULK INSERT](https://docs.microsoft.com/sql/t-sql/statements/bulk-insert-transact-sql).
- `DATASOURCE` is required in `OPENROWSET` function when you read a content of a file from Azure blob storage. See [OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql).
 
### Certificates 

Managed Instance cannot access file shares and Windows folders, so the following constraints apply: 
- `CREATE FROM`/`BACKUP TO` file is not supported for certificates
- `CREATE`/`BACKUP` certificate from `FILE`/`ASSEMBLY` is not supported. Private key files cannot be used.  
 
See [CREATE CERTIFICATE](https://docs.microsoft.com/sql/t-sql/statements/create-certificate-transact-sql) and [BACKUP CERTIFICATE](https://docs.microsoft.com/sql/t-sql/statements/backup-certificate-transact-sql).  
  
> [!TIP]
> Workaround: script certificate/private key, store as .sql file and create from binary: 
> 
> ``` 
CREATE CERTIFICATE  
 FROM BINARY = asn_encoded_certificate    
WITH PRIVATE KEY ( <private_key_options> ) 
>```   
 
### CLR 

Managed Instance cannot access file shares and Windows folders, so the following constraints apply: 
- Only `CREATE ASSEMBLY FROM BINARY` is supported. See [CREATE ASSEMBLY FROM BINARY](https://docs.microsoft.com/sql/t-sql/statements/create-assembly-transact-sql).  
- `CREATE ASSEMBLY FROM FILE` is not supported. See [CREATE ASSEMBLY FROM FILE](https://docs.microsoft.com/sql/t-sql/statements/create-assembly-transact-sql).
- `ALTER ASSEMBLY` cannot reference files. See [ALTER ASSEMBLY](https://docs.microsoft.com/sql/t-sql/statements/alter-assembly-transact-sql).
 
### Compatibility levels 
 
- Supported compatibility levels are: 100, 110, 120, 130, 140  
- Compatibility levels below 100 are not supported. 
- The default compatibility level for new databases is 140. For restored databases, compatibility level will remain unchanged if it was 100 and above.

See [ALTER DATABASE Compatibility Level](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-compatibility-level).
 
### Credential 
 
Only Azure Key Vault and `SHARED ACCESS SIGNATURE` identities are supported. Windows users are not supported.
 
See [CREATE CREDENTIAL](https://docs.microsoft.com/sql/t-sql/statements/create-credential-transact-sql) and [ALTER CREDENTIAL](https://docs.microsoft.com/sql/t-sql/statements/alter-credential-transact-sql). 
 
### Cryptographic providers

Managed Instance cannot access files so cryptographic providers cannot be created:
- `CREATE CRYPTOGRAPHIC PROVIDER` is not supported. See [CREATE CRYPTOGRAPHIC PROVIDER](https://docs.microsoft.com/sql/t-sql/statements/create-cryptographic-provider-transact-sql).
- `ALTER CRYPTOGRAPHIC PROVIDER` is not supported. See [ALTER CRYPTOGRAPHIC PROVIDER](https://docs.microsoft.com/sql/t-sql/statements/alter-cryptographic-provider-transact-sql). 

### Collation 
 
Server collation is `SQL_Latin1_General_CP1_CI_AS` and cannot be changed. See [Collations](https://docs.microsoft.com/sql/t-sql/statements/collations).
 
### Database options 
 
- Multiple log files are not supported. 
- In-memory objects are not supported in the General Purpose service tier.  
- There is a limit of 280 files per instance implying max 280 files per database. Both data and log files are counted toward this limit.  
- Database cannot contain filegroups containing filestream data.  Restore will fail if .bak contains `FILESTREAM` data.  
- Every file is placed in Azure Premium storage. IO and throughput per file depend on the size of each individual file, in the same way as they do for Azure Premium Storage disks. See [Azure Premium disk performance](https://docs.microsoft.com/azure/virtual-machines/windows/premium-storage-performance#premium-storage-disk-sizes)  
 
#### CREATE DATABASE statement

The following are `CREATE DATABASE` limitations: 
- Files and filegroups cannot be defined.  
- `CONTAINMENT` option is not supported.  
- `WITH`options are not supported.  
   > [!TIP]
   > As workaround, use `ALTER DATABASE` after `CREATE DATABASE` to set database options to add files or to set containment.  

- `FOR ATTACH` option is not supported 
- `AS SNAPSHOT OF` option is not supported 

For more information, see [CREATE DATABASE](https://docs.microsoft.com/sql/t-sql/statements/create-database-sql-server-transact-sql).

#### ALTER DATABASE statement

Some file properties cannot be set or changed:
- File path cannot be specified in `ALTER DATABASE ADD FILE (FILENAME='path')` T-SQL statement. Remove `FILENAME` from the script because Managed Instance automatically places the files.  
- File name cannot be changed using `ALTER DATABASE` statement.

The following options are set by default and cannot be changed: 
- `MULTI_USER` 
- `ENABLE_BROKER ON` 
- `AUTO_CLOSE OFF` 

The following options cannot be modified: 
- `AUTO_CLOSE` 
- `AUTOMATIC_TUNING(CREATE_INDEX=ON|OFF)` 
- `AUTOMATIC_TUNING(DROP_INDEX=ON|OFF)` 
- `DISABLE_BROKER` 
- `EMERGENCY` 
- `ENABLE_BROKER` 
- `FILESTREAM` 
- `HADR`   
- `NEW_BROKER` 
- `OFFLINE` 
- `PAGE_VERIFY` 
- `PARTNER` 
- `READ_ONLY` 
- `RECOVERY BULK_LOGGED` 
- `RECOVERY_SIMPLE` 
- `REMOTE_DATA_ARCHIVE`  
- `RESTRICTED_USER` 
- `SINGLE_USER` 
- `WITNESS`

Modify name is not supported.

For more information, see [ALTER DATABASE](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-file-and-filegroup-options).

### Database mirroring

Database mirroring is not supported.
 - `ALTER DATABASE SET PARTNER` and `SET WITNESS` options are not supported.
 - `CREATE ENDPOINT … FOR DATABASE_MIRRORING` is not supported.

For more information, see [ALTER DATABASE SET PARTNER and SET WITNESS](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-database-mirroring) and [CREATE ENDPOINT … FOR DATABASE_MIRRORING](https://docs.microsoft.com/sql/t-sql/statements/create-endpoint-transact-sql).

### DBCC 
 
Undocumented DBCC statements that are enabled in SQL Server are not supported in Managed Instance.
- `Trace Flags` are not supported. See [Trace Flags](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-trace-flags-transact-sql).
- `DBCC TRACEOFF` is not supported. See [DBCC TRACEOFF](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceoff-transact-sql).
- `DBCC TRACEON` is not supported. See [DBCC TRACEON](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-transact-sql).

### Distributed transactions

Neither MSDTC nor [Elastic Transactions](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-transactions-overview) are currently supported in Managed Instance.

### Extended Events 

Some Windows-specific targets for XEvents are not supported:
- `etw_classic_sync target` is not supported. Store `.xel` files on Azure blob storage. See [etw_classic_sync target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#etwclassicsynctarget-target). 
- `event_file target`is not supported. Store `.xel` files on Azure blob storage. See [event_file target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#eventfile-target).

### External libraries

In-database R and Python external libraries are not yet supported. See [SQL Server Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics/r/sql-server-r-services).

### Filestream and Filetable

- filestream data is not supported. 
- Database cannot contain filegroups with `FILESTREAM` data
- `FILETABLE` is not supported
- Tables cannot have `FILESTREAM` types
- The following functions are not supported:
 - `GetPathLocator()` 
 - `GET_FILESTREAM_TRANSACTION_CONTEXT()` 
 - `PathName()` 
 - `GetFileNamespacePath()` 
 - `FileTableRootPath()` 

For more information, see [FILESTREAM](https://docs.microsoft.com/sql/relational-databases/blob/filestream-sql-server) and [FileTables](https://docs.microsoft.com/sql/relational-databases/blob/filetables-sql-server).

### Full-text Semantic Search

[Semantic Search](https://docs.microsoft.com/sql/relational-databases/search/semantic-search-sql-server) is not supported.

### Linked servers
 
Linked servers in Managed Instance support limited number of targets: 
- Supported targets: SQL Server and SQL Database
- Not supported targets: files, Analysis Services, and other RDBMS.

Operations

- Cross-instance write transactions are not supported.
- `sp_dropserver` is supported for dropping a linked server. See [sp_dropserver](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-dropserver-transact-sql).
- `OPENROWSET` function can be used to execute queries only on SQL Server instances (either managed, on-premises, or in Virtual Machines). See [OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql).
- `OPENDATASOURCE` function can be used to execute queries only on SQL Server instances (either managed, on-premises, or in virtual machines). Only `SQLNCLI`, `SQLNCLI11`, and `SQLOLEDB` values are supported as provider. For example: `SELECT * FROM OPENDATASOURCE('SQLNCLI', '...').AdventureWorks2012.HumanResources.Employee`. See [OPENDATASOURCE](https://docs.microsoft.com/sql/t-sql/functions/opendatasource-transact-sql).
 
### Logins / users 

- SQL logins created `FROM CERTIFICATE`, `FROM ASYMMETRIC KEY`, and `FROM SID` are supported. See [CREATE LOGIN](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql).
- Windows logins created with `CREATE LOGIN ... FROM WINDOWS` syntax are not supported.
- Azure Active Directory (Azure AD) user who created the instance has [unrestricted admin privileges](https://docs.microsoft.com/azure/sql-database/sql-database-manage-logins#unrestricted-administrative-accounts).
- Non-administrator Azure Active Directory (Azure AD) database-level users can be created using `CREATE USER ... FROM EXTERNAL PROVIDER` syntax. See [CREATE USER ... FROM EXTERNAL PROVIDER](https://docs.microsoft.com/azure/sql-database/sql-database-manage-logins#non-administrator-users)
 
### Polybase

External tables referencing the files in HDFS or Azure blob storage are not supported. For information about Polybase, see [Polybase](https://docs.microsoft.com/sql/relational-databases/polybase/polybase-guide).

### Replication 
 
Replication is available for public preview on Managed Instance. For information about Replication, see [SQL Server Replication](http://docs.microsoft.com/sql/relational-databases/replication/replication-with-sql-database-managed-instance).
 
### RESTORE statement 
 
- Supported syntax  
   - `RESTORE DATABASE` 
   - `RESTORE FILELISTONLY ONLY` 
   - `RESTORE HEADER ONLY` 
   - `RESTORE LABELONLY ONLY` 
   - `RESTORE VERIFYONLY ONLY` 
- Unsupported syntax 
   - `RESTORE LOG ONLY` 
   - `RESTORE REWINDONLY ONLY`
- Source  
 - `FROM URL` (Azure blob storage) is only supported option.
 - `FROM DISK`/`TAPE`/backup device is not supported.
 - Backup sets are not supported. 
- `WITH` options are not supported (No `DIFFERENTIAL`, `STATS`, etc.)     
- `ASYNC RESTORE` - Restore continues even if client connection breaks. If your connection is dropped, you can check `sys.dm_operation_status` view for the status of a restore operation (as well as for CREATE and DROP database). See [sys.dm_operation_status](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database).  
 
The following database options are set/overridden and cannot be changed later:  
- `NEW_BROKER` (if broker is not enabled in .bak file)  
- `ENABLE_BROKER` (if broker is not enabled in .bak file)  
- `AUTO_CLOSE=OFF` (if a database in .bak file has `AUTO_CLOSE=ON`)  
- `RECOVERY FULL` (if a database in .bak file has `SIMPLE` or `BULK_LOGGED` recovery mode)
- Memory optimized filegroup is added and called XTP if it was not in the source .bak file  
- Any existing memory optimized filegroup is renamed to XTP  
- `SINGLE_USER` and `RESTRICTED_USER` options are converted to `MULTI_USER`   
Limitations:  
- `.BAK` files containing multiple backup sets cannot be restored. 
- `.BAK` files containing multiple log files cannot be restored. 
- Restore will fail if .bak contains `FILESTREAM` data.
- Backups containing databases that have active In-memory objects cannot currently be restored.  
- Backups containing databases where at some point In-Memory objects existed cannot currently be restored.   
- Backups containing databases in read-only mode cannot currently be restored. This limitation will be removed soon.   
 
For information about Restore statements, see [RESTORE Statements](https://docs.microsoft.com/sql/t-sql/statements/restore-statements-transact-sql).

### Service broker 
 
- Cross-instance service broker is not supported 
 - `sys.routes` - Prerequisite: select address from sys.routes. Address must be LOCAL on every route. See [sys.routes](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-routes-transact-sql).
 - `CREATE ROUTE` - you cannot `CREATE ROUTE` with `ADDRESS` other than `LOCAL`. See [CREATE ROUTE](https://docs.microsoft.com/sql/t-sql/statements/create-route-transact-sql).
 - `ALTER ROUTE` cannot `ALTER ROUTE` with `ADDRESS` other than `LOCAL`. See [ALTER ROUTE](https://docs.microsoft.com/sql/t-sql/statements/alter-route-transact-sql).  
 
### Service key and service master key 
 
- [Master key backup](https://docs.microsoft.com/sql/t-sql/statements/backup-master-key-transact-sql) is not supported (managed by SQL Database service) 
- [Master key restore](https://docs.microsoft.com/sql/t-sql/statements/restore-master-key-transact-sql) is not supported (managed by SQL Database service) 
- [Service master key backup](https://docs.microsoft.com/sql/t-sql/statements/backup-service-master-key-transact-sql) is not supported (managed by SQL Database service) 
- [Service master key restore](https://docs.microsoft.com/sql/t-sql/statements/restore-service-master-key-transact-sql) is not supported (managed by SQL Database service) 
 
### Stored procedures, functions, triggers 
 
- `NATIVE_COMPILATION` is currently not supported. 
- The following [sp_configure](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-configure-transact-sql) options are not supported: 
 - `allow polybase export` 
 - `allow updates` 
 - `filestream_access_level` 
 - `max text repl size` 
 - `remote data archive` 
 - `remote proc trans` 
- `sp_execute_external_scripts` is not supported. See [sp_execute_external_scripts](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql#examples).
- `xp_cmdshell` is not supported. See [xp_cmdshell](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql).
- `Extended stored procedures` are not supported, including `sp_addextendedproc` and `sp_dropextendedproc`. See [Extended stored procedures](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/general-extended-stored-procedures-transact-sql)
- `sp_attach_db`, `sp_attach_single_file_db`, and `sp_detach_db` are not supported. See [sp_attach_db](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-attach-db-transact-sql), [sp_attach_single_file_db](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-attach-single-file-db-transact-sql), and [sp_detach_db](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-detach-db-transact-sql).
- `sp_renamedb` is not supported. See [sp_renamedb](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-renamedb-transact-sql).

### SQL Server Agent

- SQL Agent settings are read only. Procedure `sp_set_agent_properties` is not supported in Managed Instance.  
- Jobs - T-SQL job steps are currently supported
- Other types of job steps are not currently supported (more step types will be added during public preview).
  - Replication jobs not supported including:
    - Transaction-log reader.  
    - Snapshot.
    - Distributor.  
    - Merge.  
  - SSIS is not yet supported. 
  - Queue Reader is not supported.  
  - Command shell is not yet supported. 
  - Managed Instance cannot access external resources (for example, network shares via robocopy).  
  - PowerShell is not yet supported.
  - Analysis Services are not supported.  
- Notifications are partially supported.
- Email notification is supported, requires configuring a Database Mail profile. There can be only one database mail profile and it must be called `AzureManagedInstance_dbmail_profile` in public preview (temporary limitation).  
 - Pager is not supported.  
 - NetSend is not supported. 
 - Alerts are not yet not supported.
 - Proxies are not supported.  
- Eventlog is not supported. 
 
The following features are currently not supported but will be enabled in future:  
- Proxies
- Scheduling jobs on idle CPU 
- Enabling/disabling Agent
- Alerts

For information about SQL Server Agent, see [SQL Server Agent](https://docs.microsoft.com/sql/ssms/agent/sql-server-agent).
 
### Tables 

The following are not supported: 
- `FILESTREAM` 
- `FILETABLE` 
- `EXTERNAL TABLE`
- `MEMORY_OPTIMIZED`  

For information about creating and altering tables, see [CREATE TABLE](https://docs.microsoft.com/sql/t-sql/statements/create-table-transact-sql) and [ALTER TABLE](https://docs.microsoft.com/sql/t-sql/statements/alter-table-transact-sql).

## <a name="Changes"></a> Behavior changes 
 
The following variables, functions, and views return different results:  
- `SERVERPROPERTY('EngineEdition')` returns value 8. This property uniquely identifies Managed Instance. See [SERVERPROPERTY](https://docs.microsoft.com/sql/t-sql/functions/serverproperty-transact-sql).
- `SERVERPROPERTY('InstanceName')` returns NULL, because the concept of instance as it exists for SQL Server does not apply to Managed Instance. See [SERVERPROPERTY('InstanceName')](https://docs.microsoft.com/sql/t-sql/functions/serverproperty-transact-sql).
- `@@SERVERNAME` returns full DNS 'connectable' name, for example, my-managed-instance.wcus17662feb9ce98.database.windows.net. See [@@SERVERNAME](https://docs.microsoft.com/sql/t-sql/functions/servername-transact-sql).  
- `SYS.SERVERS` - returns full DNS 'connectable' name, such as `myinstance.domain.database.windows.net` for properties 'name' and 'data_source'. See [SYS.SERVERS](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-servers-transact-sql). 
- `@@SERVICENAME` returns NULL, because the concept of service as it exists for SQL Server does not apply to Managed Instance. See [@@SERVICENAME](https://docs.microsoft.com/sql/t-sql/functions/servicename-transact-sql).   
- `SUSER_ID` is supported. Returns NULL if AAD login is not in sys.syslogins. See [SUSER_ID](https://docs.microsoft.com/sql/t-sql/functions/suser-id-transact-sql).  
- `SUSER_SID` is not supported. Returns wrong data (temporary known issue). See [SUSER_SID](https://docs.microsoft.com/sql/t-sql/functions/suser-sid-transact-sql). 
- `GETDATE()` and other built-in date/time functions always returns time in UTC time zone. See [GETDATE](https://docs.microsoft.com/sql/t-sql/functions/getdate-transact-sql).

## <a name="Issues"></a> Known issues and limitations

### TEMPDB size

`tempdb` is split into 12 files each with max size 14 GB per file. This maximum size per file cannot be changed and new files cannot be added to `tempdb`. This limitation will be removed soon. Some queries might return an error if  they need more than 168 GB in `tempdb`.

### Exceeding storage space with small database files

Each Managed Instance has up to 35 TB storage reserved for Azure Premium Disk space, and each database file is placed on a separate physical disk. Disk sizes can be 128 GB, 256 GB, 512 GB, 1 TB, or 4 TB. Unused space on disk is not charged, but the total sum of Azure Premium Disk sizes cannot exceed 35 TB. In some cases, a Managed Instance that does not need 8 TB in total might exceed the 35 TB Azure limit on storage size, due to internal fragmentation. 

For example, a Managed Instance could have one file 1.2 TB in size that is placed on a 4 TB disk, and 248 files each 1 GB ins size that are placed on separate 128 GB disks. In this example, 
* the total disk storage size is 1 x 4 TB + 248 x 128 GB = 35 TB. 
* the total reserved space for databases on the instance is 1 x 1.2 TB + 248 x 1 GB = 1.4 TB.
This illustrates that under certain circumstance, due to a very specific distribution of files, a Managed Instance might reach the 35TB reserved for attached Azure Premium Disk when you might not expect it to. 

In this example existing databases will continue to work and can grow without any problem as long as new files are not added. However new databases could not be created or restored because there is not enough space for new disk drives, even if the total size of all databases does not reach the instance size limit. The error that is returned in that case is not clear.

### Incorrect configuration of SAS key during database restore

`RESTORE DATABASE` that reads .bak file might be constantly retrying to read .bak file and return error after long period of time if Shared Access Signature in `CREDENTIAL` is incorrect. Execute RESTORE HEADERONLY before restoring a database to be sure that SAS key is correct.
Make sure that you remove leading `?` from the SAS key generated using Azure portal.

### Tooling

SQL Server Management Studio and SQL Server Data Tools might have some issues while accessing Managed Instance. All tooling issues will be addressed before General Availability.

### Incorrect database names in some views, logs, and messages

Several system views, performance counters, error messages, XEvents, and error log entries display GUID database identifiers instead of the actual database names. Do not rely on these GUID identifiers because they would be replaced with actual database names in the future.

### Database mail profile
There can be only one database mail profile and it must be called `AzureManagedInstance_dbmail_profile`. This is a temporary limitation that will be removed soon.

### Error logs are not-persisted
Error logs that are available in managed instance are not persisted and their size is not included in the max storage limit. Error logs might be automatically erased in case of failover.

### Error logs are verbose
Managed Instance places verbose information in error logs and many of them are not relevant. The amount of information in error logs will be decreased in the future.

**Workaround**: Use a custom procedure for reading error logs that filter-out some non-relevant entries. For details, see [Azure SQL DB Managed Instance – sp_readmierrorlog](https://blogs.msdn.microsoft.com/sqlcat/2018/05/04/azure-sql-db-managed-instance-sp_readmierrorlog/).

### Transaction Scope on two databases within the same instance is not supported
`TransactionScope` class in .Net does not work if two queries are sent to the two databases within the same instance under the same transaction scope:

```C#
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

Although this code works with data within the same instance it required MSDTC.

**Workaround**: Use [SqlConnection.ChangeDatabase(String)](https://docs.microsoft.com/dotnet/api/system.data.sqlclient.sqlconnection.changedatabase) to use other database in connection context instead of using two connections.

### CLR modules and linked servers sometime cannot reference local IP address
CLR modules placed in Managed Instance and linked servers/distributed queries that are referencing current instance sometime cannot resolve the IP of the local instance. This is transient error.

**Workaround**: Use context connections in CLR module if possible.

## Next steps

- For details about Managed Instance, see [What is a Managed Instance?](sql-database-managed-instance.md)
- For a features and comparison list, see [SQL common features](sql-database-features.md).
- For a quickstart showing you how to create a new Managed Instance, see [Creating a Managed Instance](sql-database-managed-instance-get-started.md).
