---
title: Azure SQL Database Managed Instance T-SQL Differences | Microsoft Docs 
description: This article discusses the T-SQL differences between Azure SQL Database Managed Instance and SQL Server. 
services: sql-database 
author: CarlRabeler 
editor:  
ms.service: sql-database 
ms.custom: 
ms.devlang:  
ms.topic: article 
ms.workload: "Active" 
ms.date: 03/07/2018 
ms.author: carlrab 
manager: cguyer 
--- 
 
# Azure SQL Database Managed Instance T-SQL differences from SQL Server 
 
## Auditing 
 
SQL Audit work on server level and stores .xel files on Azure Blob Storage account. The key differences between Auditing in Managed Instance, Azure SQL Database, and SQL Server on-premises are: 
- On Azure DB, SQL Audit works on database level  
- On on-premises, SQL Audit works at server level, but stores events on files system/windows event logs  
  
XEvent supports Azure blob storage targets. File and windows logs are not supported.    
 
The key differences in CREATE AUDIT syntax for Auditing to Azure `BLOB_STORAGE` 
- New syntax `TO URL` is provided and enables you to specify URL of the Azure blob Storage container where .xel files will be placed 
- Syntax `TO FILE` is not supported because Managed instance cannot access Windows file shares. 
 
Changes in:  
- [CREATE SERVER AUDIT](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-server-audit-transact-sql)  
- [ALTER SERVER AUDIT](https://docs.microsoft.com/en-us/sql/t-sql/statements/alter-server-audit-transact-sql) 
See [Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine)     
 
## Backup 
 
- Only full database COPY_ONLY backups are supported. Differential, log, and FILESNAPSHOT backups are not supported.  
- Target: 
 - Only `BACKUP TO URL` is supported 
 - `FILE`, `TAPE`, and backup devices are not supported  
- `WITH` <options>  
 - `COPY_ONLY` is mandatory  
 - Most of the general `WITH` <options> are supported  
 - `FILE_SNAPSHOT` not supported  
 - Tape options: `REWIND`, `NOREWIND`, `UNLOAD`, and `NOUNLOAD` are not supported 
 - Log-specific options: `NORECOVERY`, `STANDBY`, and `NO_TRUNCATE` are not supported 
 
Limitations:  
- Max stripe size is 195GB (PAGE blob size). Increase number of stripes in backup command to distribute stripe sizes. 
> To work around this limitation on premises, you can backup to `DISK` instead of backup to `URL`, upload backup file to blob, then restore. Restore support bigger files because a different blob types is used.   
 
## Buffer pool extension 
 
Buffer pool extension - not supported 
 
## Bulk insert / openrowset 
Managed Instance cannot access file shares and Windows folders, so the following constraint apply: 
- Azure blob storage as target - supported 
- Files and network shares - not supported 
 
## Certificates 
Managed Instance cannot access file shares and Windows folders, so the following constraint apply: 
- `CREATE`/`BACKUP` `FROM`/`TO` files is not supported for certificates  
- `CREATE`/`BACKUP` certificate from `FILE`/`ASSEMBLY` is not supported. Private key files cannot be used.  
 
See [CREATE CERTIFICATE (Transact-SQL) ](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-certificate-transact-sql) and [BACKUP CERTIFICATE (Transact-SQL)](https://docs.microsoft.com/en-us/sql/t-sql/statements/backup-certificate-transact-sql)  
  
> Workaround: script certificate/private key, store as .sql file and create from binary: 
 
``` 
CREATE CERTIFICATE  
 FROM BINARY = asn_encoded_certificate    
WITH PRIVATE KEY ( <private_key_options> ) 
```   
 
## CLR 
Managed Instance cannot access file shares and Windows folders, so the following constraint apply: 
- `CREATE ASSEMBLY FROM BINARY` is supported. See [CREATE ASSEMBLY](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-assembly-transact-sql) FROM BINARY 
- `CREATE ASSEMBLY FROM FILE` is not supported. See [CREATE ASSEMBLY](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-assembly-transact-sql) FROM FILE 
- [ALTER ASSEMBLY](https://docs.microsoft.com/en-us/sql/t-sql/statements/alter-assembly-transact-sql) cannot reference files 
 
## Compatibility levels 
 
- Supported compatibility levels are: 100, 110, 120, 130, 140, 150  
- Compatibility levels below 100 are not supported. 
- The default compatibility level is 140. 
 
## Credential 
 
Only Azure Key vault and `SHARED ACCESS SIGNATURE` identities are supported. 
- Windows user - not supported 
 
See [CREATE CREDENTIAL](https://docs.microsoft.com/sql/t-sql/statements/create-credential-transact-sql) and [ALTER CREDENTIAL](https://docs.microsoft.com/sql/t-sql/statements/alter-credential-transact-sql)  
 
## Collation 
 
Server collation is always SQL_Latin1_General_CP1_CI_AS  
 
## Create database / alter database 
 
- Multiple log files are not supported. 
- In-memory objects are not supported  
- There is a limit 280 files per instance implying max 280 files per database.  
- Every database has one FILEGROUP called XTP that contains memory optimized data. If original database backup didn't have memory optimized file group, it will be added during restore. 
- Cannot create general purpose database with objects in XTP filegroups (Memory-optimized tables, natively compiled stored procedures)  
- File groups containing file stream data are not supported. Restore will fail if .bak contains `FILESTREAM` data.  
- Every file is placed on separate Azure Premium Disk. IO and throughput depend on the size of each individual file See [Azure Premium disk performance](https://docs.microsoft.com/azure/virtual-machines/windows/premium-storage-performance#premium-storage-disk-sizes)  
 
### CREATE DATABASE 
The following are `CREATE DATABASE` limitations: 
- Files and file groups cannot be defined  
- `CONTAINMENT PARTIAL` not supported  
- `WITH `<options> are not supported  
  
- FOR ATTACH option is not supported 
- AS SNAPSHOT OF option is not supported 
 
### ALTER DATABASE 
- Use `ALTER DATABASE` after `CREATE DATABASE` to set database options or to add files  
- File path cannot be specified in `ALTER DATABASE ADD FILE (FILENAME='path')` T-SQL statement. Remove `FILENAME` from the script because Managed Instance places the files.  
 
 
 
The following options are on by default and cannot be changed: 
- `MULTI_USER` 
- `ENABLE_BROKER ON` 
- `AUTO_CLOSE OFF` 
 
The following options are not supported: 
- `AUTO_CLOSE` 
- `AUTOMATIC_TUNING(CREATE_INDEX=ON)` 
- `AUTOMATIC_TUNING(CREATE_INDEX=OFF)` 
- `AUTOMATIC_TUNING(DROP_INDEX=OFF)` 
- `AUTOMATIC_TUNING(DROP_INDEX=OFF)` 
- `DISABLE_BROKER` 
- `EMERGENCY` 
- `ENABLE_BROKER` 
- `FILESTREAM(NON_TRANSACTED_ACCESS=OFF)` 
- `FILESTREAM(NON_TRANSACTED_ACCESS=READ_ONLY)` 
- `FILESTREAM(NON_TRANSACTED_ACCESS=FULL)` 
- `FILESTREAM(DIRECTORY_NAME = N'F:\\FILESTREAM\')`  
- `HADR RESUME`  
- `HADR SUSPEND` 
- `NEW_BROKER` 
- `OFFLINE` 
- `PAGE_VERIFY CHECKSUM` 
- `PAGE_VERIFY TORN_PAGE_DETECTION` 
- `PAGE_VERIFY NONE` 
- `READ_ONLY` 
- `RECOVERY BULK_LOGGED` 
- `RECOVERY_SIMPLE` 
- `REMOTE_DATA_ARCHIVE = ON ( SERVER = '<server_name>' , CREDENTIAL = <db_scoped_credential_name> )`  
- `RESTRICTED_USER` 
- `SINGLE_USER` 
- `TARGET_RECOVERY_TIME` 
 
The following options are automatically applied and cannot be changed by `ALTER DATABASE SET`: 
- `ENABLE_BROKER` - If the source database didn't have service broker enabled (BEHAVIOUR CHANGE)  
- `AUTO_CLOSE OFF` - if the source database had `AUTO_CLOSE ON`  
- `RECOVERY FULL`  - if source database had `RECOVERY BULK_LOGGED`, `RECOVERY_SIMPLE` (BEHAVIOUR/BREAKING CHANGE)  
- `MULTI_USER`, `SINGLE_USER` and `RESTRICTED_USER` user are converted to `MULTI_USER`  
 
## DBCC 
 
- [Trace Flags (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-trace-flags-transact-sql) – not supported  
 - [DBCC TRACEOFF](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceoff-transact-sql) – not supported 
 - [DBCC TRACEON](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-transact-sql) – not supported 
 
## Extended Events 
- [etw_classic_sync target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#etwclassicsynctarget-target) - not supported, store xel files on Azure blob storage 
- [event_file target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#eventfile-target) - not supported, store xel files on Azure blob storage 
 
## External procedures 
 
Not supported 
- [sp_execute_external_script](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql) 
- [Extended stored procedures](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/general-extended-stored-procedures-transact-sql) 
- [xp_cmdshell](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql) 
 
## File groups 
 
File stream data - not supported 
 
## Getdate 
 
`GETDATE()` always returns UTC date 
 
## Linked servers 
 
Targets: 
- Supported targets: SQL Server, SQL Database Managed Instance, SQL Server on a virtual machine 
- Not supported targets: files, Analysis Services, other RDBMS 
 
[sp_dropserver](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-dropserver-transact-sql) supported for dropping a linked server 
 
## Logins / users 
 
Supported: 
- Users from SQL logins 
 - `FROM CERTIFICATE` 
 - `FROM ASYMMETRIC KEY` 
 - `FROM SID`  
- Users from Azure Active Directory (AAD) 
 
Not supported: 
- Windows logins 
 
## ON/OFF options 
 
The following ON/OFF options are supported: 
- `ALLOW_SNAPSHOT_ISOLATION` 
- `ANSI_NULL_DEFAULT` 
- `ANSI_NULLS` 
- `ANSI_PADDING` 
- `ANSI_WARNINGS` 
- `ARITHABORT` 
- `AUTO_CREATE_STATISTICS` 
- `AUTO_SHRINK` 
- `AUTO_UPDATE_STATISTICS` 
- `AUTO_UPDATE_STATISTICS_ASYNC` 
- `CHANGE_TRACKING= ` 
- `CONCAT_NULL_YIELDS_NULL` 
- `CURSOR_CLOSE_ON_COMMIT` 
- `DATE_CORRELATION_OPTIMIZATION` 
- `DB_CHAINING` 
- `HONOR_BROKER_PRIORITY` 
- `MEMORY_OPTIMIZED_ELEVATE_TO_SNAPSHOT` 
- `NUMERIC_ROUNDABORT` 
- `QUERY_STORE=` 
- `QUOTED_IDENTIFIER` 
- `READ_COMMITTED_SNAPSHOT` 
- `RECURSIVE_TRIGGERS` 
- `TORN_PAGE_DETECTION` 
- `TRUSTWORTHY` 
 
## Replication 
 
Replication - not yet supported 
 
## Restore 
 
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
 - `FROM URL` (Azure blob storage) - supported 
 - `FROM DISK`/`TAPE`/backup device - not supported 
 - Backup sets - not supported 
- `WITH` <options> are not supported (No differential, `STATS`, etc.)     
- `ASYNC RESTORE` - Restore continues even if client connection breaks. If customer loses connection, he/she can check sys.dm_operation_status view for the status of a restore operation (as well as CREATE and DROP database)  
 
The following database options that are set/overridden and cannot be changed later:  
- `NEW_BROKER` (if broker is not enabled in .bak file)  
- `ENABLE_BROKER` (if broker is not enabled in .bak file)  
- `AUTO_CLOSE=OFF` (if .bak file has AUTO_CLOSE=ON)  
- `RECOVERY FULL` (if .bak file has `SIMPLE` or `BULK_LOGGED` recovery mode)  
- Memory optimized file group is added and called XTP if it was not in the source .bak file  
- Any existing memory optimized file group is renamed to XTP  
  
Limitations:  
- `.BAK` files containing multiple backup sets cannot be restored. 
- Backups containing databases that have active Hekaton objects cannot be currently restored.  
- Backups containing databases where at some point in-memory objects existed cannot currently be restored to General Purpose Tier.   
- Backups containing databases in read-only mode cannot currently be restored.   
 
 
## Service broker 
 
- Cross-instance service broker is not supported 
- [sys.routes](https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-routes-transact-sql):Prerequisite: select address from sys.routes. Address must be LOCAL on every route. 
- [CREATE ROUTE](https://docs.microsoft.com/en-us/sql/t-sql/statements/create-route-transact-sql): cannot `CREATE ROUTE` with `ADDRESS` <> `LOCAL` 
- [ALTER ROUTE](https://docs.microsoft.com/en-us/sql/t-sql/statements/alter-route-transact-sql) cannot `ALTER ROUTE` with `ADDRESS` <> `LOCAL`  
 
## Service key and service master key 
 
- Master key [backup](https://docs.microsoft.com/sql/t-sql/statements/backup-master-key-transact-sql) - not supported (managed by SQL Database service) 
- Master key [restore](https://docs.microsoft.com/sql/t-sql/statements/restore-master-key-transact-sql) - not supported (managed by SQL Database service) 
- Service master key [backup](https://docs.microsoft.com/sql/t-sql/statements/backup-service-master-key-transact-sql) - not supported (managed by SQL Database service) 
- Service master key [restore](https://docs.microsoft.com/sql/t-sql/statements/restore-service-master-key-transact-sql) - not supported (managed by SQL Database service) 
 
 
## Stored procedures, functions, triggers 
 
`NATIVE_COMPILATION` is currently not supported 
  
The following [sp_configure](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-configure-transact-sql) options are not supported: 
 - `allow polybase export` 
 - `allow updates` 
 - `filestream_access_level` 
 - `max text repl size` 
 - `remote data archive` 
 - `remote proc trans` 
 
## SQL Server Agent 
 
- SQL Agent settings are read only. `sp_set_agent_properties` throws the following error:  
Stored procedure sp_set_agent_properties is not supported in SQL Database Managed Instance.  
- Jobs  
 - Subsystems  
  - T-SQL - supported  
  - SSIS - not yet supported 
  - Replication - not yet supported  
   - Transaction-Log reader - not yet supported  
   - Snapshot - not yet supported  
   - Distributor - not yet supported  
   - Merge - not supported  
   - Queue Reader - not supported  
  - Command shell - not yet supported 
   - No access to external resources (e.g. network shares via robocopy)  
  - PowerShell - not yet supported  
  - Analysis Services - not supported  
 - Notifications  
  - Email - supported, requires configuring a Database Mail profile. 
   - There can be only one database mail profile and it must be called 'AzureManagedInstance_dbmail_profile' in public preview (temporary limitation)  
  - Pager - not supported  
  - NetSend - not supported 
 - Alerts - not supported 
 - Proxies - not supported  
- Eventlog - not supported 
 
Currently not supported but to be enabled in future:  
- Proxies  
- Job schedule on idle CPU 
- ON/OFF switch  
 
## System functions 
 
- [SUSER_ID](https://docs.microsoft.com/sql/t-sql/functions/suser-id-transact-sql) - supported, returns NULL if AAD login is not in sys.syslogins  
- [SUSER_SID](https://docs.microsoft.com/sql/t-sql/functions/suser-sid-transact-sql) – not supported. Returns wrong data (temporary known issue) 
 
 
## Tables 
The following are not supported: 
- `FILESTREAM` 
- `FILETABLE` 
- `EXTERNAL TABLE` 
- `MEMORY_OPTIMIZED`  
 
## Variables 
 
The following variables return different results:  
- [@@SERVERNAME](https://docs.microsoft.com/sql/t-sql/functions/servername-transact-sql) returns full DNS 'connectable' name, e.g. testcl.myserver.onebox.xdb.mscds.com2  
- [SYS.SERVERS](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-servers-transact-sql) - returns full DNS 'connectable' name, such as testcl.myserver.onebox.xdb.mscds.com2 for properties 'name' and 'data_source'.  
- [SERVERPROPERTY('InstanceName')](https://docs.microsoft.com/sql/t-sql/functions/serverproperty-transact-sql) - returns short instance name, e.g. 'myserver'  
- [@@SERVICENAME](https://docs.microsoft.com/sql/t-sql/functions/servicename-transact-sql) returns NULL, as it makes no sense in Managed Instance environment   