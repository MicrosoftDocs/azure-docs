---
title: Azure SQL Database-Managed Instance T-SQL Differences | Microsoft Docs
description: This article discusses the T-SQL differences between a Managed Instance in Azure SQL Database and SQL Server
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein, carlrab, bonova 
manager: craigg
ms.date: 03/13/2019
ms.custom: seoapril2019
---

# Azure SQL Database Managed Instance T-SQL differences from SQL Server

This article summarizes and explains the differences in syntax and behavior between Azure SQL Database Managed Instance and on-premises SQL Server Database Engine. <a name="Differences"></a>

- [Availability](#availability) including the differences in [Always-On](#always-on-availability) and [Backups](#backup),
- [Security](#security) including the differences in [Auditing](#auditing), [Certificates](#certificates), [Credentials](#credential), [Cryptographic providers](#cryptographic-providers), [Logins / users](#logins--users), [Service key and service master key](#service-key-and-service-master-key),
- [Configuration](#configuration) including the differences in [Buffer pool extension](#buffer-pool-extension), [Collation](#collation), [Compatibility levels](#compatibility-levels),[Database mirroring](#database-mirroring), [Database options](#database-options), [SQL Server Agent](#sql-server-agent), [Table options](#tables),
- [Functionalities](#functionalities) including [BULK INSERT/OPENROWSET](#bulk-insert--openrowset), [CLR](#clr), [DBCC](#dbcc), [Distributed transactions](#distributed-transactions), [Extended events](#extended-events), [External libraries](#external-libraries), [Filestream and Filetable](#filestream-and-filetable), [Full-text Semantic Search](#full-text-semantic-search), [Linked servers](#linked-servers), [Polybase](#polybase), [Replication](#replication), [RESTORE](#restore-statement), [Service Broker](#service-broker), [Stored procedures, functions, and triggers](#stored-procedures-functions-triggers),
- [Features that have different behavior in Managed Instances](#Changes)
- [Temporary limitations and known issues](#Issues)

The Managed Instance deployment option provides high compatibility with on-premises SQL Server Database Engine. Most of the SQL Server database engine features are supported in a Managed Instance.

![migration](./media/sql-database-managed-instance/migration.png)

## Availability

### <a name="always-on-availability"></a>Always-On

[High availability](sql-database-high-availability.md) is built into Managed Instance and cannot be controlled by users. The following statements are not supported:

- [CREATE ENDPOINT … FOR DATABASE_MIRRORING](https://docs.microsoft.com/sql/t-sql/statements/create-endpoint-transact-sql)
- [CREATE AVAILABILITY GROUP](https://docs.microsoft.com/sql/t-sql/statements/create-availability-group-transact-sql)
- [ALTER AVAILABILITY GROUP](https://docs.microsoft.com/sql/t-sql/statements/alter-availability-group-transact-sql)
- [DROP AVAILABILITY GROUP](https://docs.microsoft.com/sql/t-sql/statements/drop-availability-group-transact-sql)
- [SET HADR](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-set-hadr) clause of the [ALTER DATABASE](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql) statement

### Backup

Managed instances have automatic backups, and enable users to create full database `COPY_ONLY` backups. Differential, log, and file snapshot backups are not supported.

- With a Managed Instance, you can back up an instance database only to an Azure Blob Storage account:
  - Only `BACKUP TO URL` is supported
  - `FILE`, `TAPE`, and backup devices are not supported  
- Most of the general `WITH` options are supported
  - `COPY_ONLY` is mandatory
  - `FILE_SNAPSHOT` not supported
  - Tape options: `REWIND`, `NOREWIND`, `UNLOAD`, and `NOUNLOAD` aren't supported
  - Log-specific options: `NORECOVERY`, `STANDBY`, and `NO_TRUNCATE` aren't supported

Limitations:  

- With a Managed Instance, you can back up an instance database to a backup with up to 32 stripes, which is enough for the databases up to 4 TB if backup compression is used.
- Max backup stripe size using the `BACKUP` command in a managed instance is 195 GB (maximum blob size). Increase the number of stripes in the backup command to reduce individual stripe size and stay within this limit.

    > [!TIP]
    > To work around this limitation when backing up a database from either SQL Server in an on-premises environment or in a virtual machine, you can do the following:
    >
    > - Backup to `DISK` instead of backup to `URL`
    > - Upload the backup files to Blob storage
    > - Restore into the managed instance
    >
    > The `Restore` command in a managed instances supports bigger blob sizes in the backup files because a different blob type is used for storage of the uploaded backup files.

For information about backups using T-SQL, see [BACKUP](https://docs.microsoft.com/sql/t-sql/statements/backup-transact-sql).

## Security

### Auditing

The key differences between auditing in databases in Azure SQL Database and databases in SQL Server are:

- With the Managed Instance deployment option in Azure SQL Database, auditing works at the server level and stores `.xel` log files in  Azure Blob storage.
- With the single database and elastic pool deployment options in Azure SQL Database, auditing works at the database level.
- In SQL Server on-premises / virtual machines, audit works at the server level, but stores events on files system/windows event logs.
  
XEvent auditing in Managed Instance supports Azure Blob storage targets. File and windows logs are not supported.

The key differences in the `CREATE AUDIT` syntax for Auditing to Azure Blob storage are:

- A new syntax `TO URL` is provided and enables you to specify URL of the Azure blob Storage container where `.xel` files will be placed
- The syntax `TO FILE` isn't supported because a Managed Instance can't access Windows file shares.

For more information, see:  

- [CREATE SERVER AUDIT](https://docs.microsoft.com/sql/t-sql/statements/create-server-audit-transact-sql)  
- [ALTER SERVER AUDIT](https://docs.microsoft.com/sql/t-sql/statements/alter-server-audit-transact-sql)
- [Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine)

### Certificates

A Managed Instance cannot access file shares and Windows folders, so the following constraints apply:

- `CREATE FROM`/`BACKUP TO` file isn't supported for certificates
- `CREATE`/`BACKUP` certificate from `FILE`/`ASSEMBLY` isn't supported. Private key files can't be used.  

See [CREATE CERTIFICATE](https://docs.microsoft.com/sql/t-sql/statements/create-certificate-transact-sql) and [BACKUP CERTIFICATE](https://docs.microsoft.com/sql/t-sql/statements/backup-certificate-transact-sql).  
  
**Workaround**: script certificate/private key, store as .sql file and create from binary:

```sql
CREATE CERTIFICATE  
   FROM BINARY = asn_encoded_certificate
WITH PRIVATE KEY (<private_key_options>)
```

### Credential

Only Azure Key Vault and `SHARED ACCESS SIGNATURE` identities are supported. Windows users aren't supported.

See [CREATE CREDENTIAL](https://docs.microsoft.com/sql/t-sql/statements/create-credential-transact-sql) and [ALTER CREDENTIAL](https://docs.microsoft.com/sql/t-sql/statements/alter-credential-transact-sql).

### Cryptographic providers

A Managed Instance can't access files so cryptographic providers can't be created:

- `CREATE CRYPTOGRAPHIC PROVIDER` isn't supported. See [CREATE CRYPTOGRAPHIC PROVIDER](https://docs.microsoft.com/sql/t-sql/statements/create-cryptographic-provider-transact-sql).
- `ALTER CRYPTOGRAPHIC PROVIDER` isn't supported. See [ALTER CRYPTOGRAPHIC PROVIDER](https://docs.microsoft.com/sql/t-sql/statements/alter-cryptographic-provider-transact-sql).

### Logins / users

- SQL logins created `FROM CERTIFICATE`, `FROM ASYMMETRIC KEY`, and `FROM SID` are supported. See [CREATE LOGIN](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql).
- Azure Active Directory (Azure AD) server principals (logins) created with [CREATE LOGIN](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current) syntax or the [CREATE USER FROM LOGIN [Azure AD Login]](https://docs.microsoft.com/sql/t-sql/statements/create-user-transact-sql?view=azuresqldb-mi-current) syntax are supported (**public preview**). These are logins created at the server level.

    Managed Instance supports Azure AD database principals with the syntax `CREATE USER [AADUser/AAD group] FROM EXTERNAL PROVIDER`. This is also known as Azure AD contained database users.

- Windows logins created with `CREATE LOGIN ... FROM WINDOWS` syntax aren't supported. Use Azure Active Directory logins and users.
- Azure AD user who created the instance has [unrestricted admin privileges](sql-database-manage-logins.md#unrestricted-administrative-accounts).
- Non-administrator Azure Active Directory (Azure AD) database-level users can be created using `CREATE USER ... FROM EXTERNAL PROVIDER` syntax. See [CREATE USER ... FROM EXTERNAL PROVIDER](sql-database-manage-logins.md#non-administrator-users).
- Azure AD server principals (logins) support SQL features within one MI instance only. Features that require cross-instance interaction, regardless if within the same Azure AD tenant or different tenant are not supported for Azure AD users. Examples of such features are:

  - SQL Transactional Replication and
  - Link Server

- Setting an Azure AD login mapped to an Azure AD group as the database owner isn't supported.
- Impersonation of Azure AD server-level principals using other Azure AD principals is supported, such as the [EXECUTE AS](/sql/t-sql/statements/execute-as-transact-sql) clause. EXECUTE AS Limitation:

  - EXECUTE AS USER isn't supported for Azure AD users when the name differs from login name. For example, when the user is created through the syntax CREATE USER [myAadUser] FROM LOGIN [john@contoso.com], and impersonation is attempted through EXEC AS USER = _myAadUser_. When creating a **USER** from an Azure AD server principal (login), specify the user_name as the same login_name from **LOGIN**.
  - Only the SQL server-level principals (logins) that are part of the `sysadmin` role can execute the following operations targeting Azure AD principals:

    - EXECUTE AS USER
    - EXECUTE AS LOGIN

- **Public preview** limitations for Azure AD server principals (logins):

  - Active Directory Admin limitations for Managed Instance:

    - The Azure AD admin used to set up the Managed Instance can't be used to create an Azure AD server principal (login) within the Managed Instance. You must create the first Azure AD server principal (login) using a SQL Server account that is a `sysadmin`. This is a temporary limitation that will be removed once Azure AD server principals (logins) become GA. You'll see the following error if you try to use an Azure AD admin account to create the login: `Msg 15247, Level 16, State 1, Line 1 User does not have permission to perform this action.`
      - Currently, the first Azure AD login created in master DB must be created by the standard SQL Server account (non Azure AD) that is a `sysadmin` using the [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current) FROM EXTERNAL PROVIDER. Post GA, this limitation will be removed and an initial Azure AD login can be created by the Active Directory Admin for Managed Instance.
    - DacFx (export/Import) used with SQL Server Management Studio (SSMS) or SqlPackage isn't supported for Azure AD logins. This limitation will be removed once Azure AD server principals (logins) become GA.
    - Using Azure AD server principals (logins) with SSMS

      - Scripting Azure AD logins (using any authenticated login) isn't supported.
      - Intellisense doesn't recognize the **CREATE LOGIN FROM EXTERNAL PROVIDER** statement and will show a red underline.

- Only the server-level principal login (created by the Managed Instance provisioning process), members of the server roles (`securityadmin` or `sysadmin`), or other logins with ALTER ANY LOGIN permission at the server level can create Azure AD server principals (logins) in the master database for Managed Instance.
- If the login is a SQL Principal, only logins that are part of the `sysadmin` role can use the create command to create logins for an Azure AD account.
- Azure AD login must be a member of an Azure AD within the same directory used for Azure SQL Managed Instance.
- Azure AD server principals (logins) are visible in object explorer staring with SSMS 18.0 preview 5.
- Overlapping Azure AD server principals (logins) with an Azure AD admin account is allowed. Azure AD server principals (logins) take precedence over Azure AD admin when resolving the principal and applying permissions to the Managed Instance.
- During authentication, following sequence is applied to resolve the authenticating principal:

    1. If the Azure AD account exists as directly mapped to the Azure AD server principal (login) (present in sys.server_principals as type ‘E’), grant access and apply permissions of the Azure AD server principal (login).
    2. If the Azure AD account is a member of an Azure AD group that is mapped to the Azure AD server principal (login) (present in sys.server_principals as type ‘X’), grant access and apply permissions of the Azure AD group login.
    3. If the Azure AD account is a special portal-configured Azure AD admin for Managed Instance (does not exist in Managed Instance system views), apply special fixed permissions of the Azure AD admin for Managed Instance (legacy mode).
    4. If the Azure AD account exists as directly mapped to an Azure AD user in a database (in sys.database_principals as type ‘E’), grant access and apply permissions of the Azure AD database user.
    5. If the Azure AD account is member of an Azure AD group that is mapped to an Azure AD user in a database (in sys.database_principals as type ‘X’), grant access and apply permissions of the Azure AD group login.
    6. If there is an Azure AD login mapped to either an Azure AD user account or an Azure AD group account, resolving to the user authenticating, all permissions from this Azure AD login will be applied.

### Service key and service master key

- [Master key backup](https://docs.microsoft.com/sql/t-sql/statements/backup-master-key-transact-sql) is not supported (managed by SQL Database service)
- [Master key restore](https://docs.microsoft.com/sql/t-sql/statements/restore-master-key-transact-sql) is not supported (managed by SQL Database service)
- [Service master key backup](https://docs.microsoft.com/sql/t-sql/statements/backup-service-master-key-transact-sql) is not supported (managed by SQL Database service)
- [Service master key restore](https://docs.microsoft.com/sql/t-sql/statements/restore-service-master-key-transact-sql) is not supported (managed by SQL Database service)

## Configuration

### Buffer pool extension

- [Buffer pool extension](https://docs.microsoft.com/sql/database-engine/configure-windows/buffer-pool-extension) is not supported.
- `ALTER SERVER CONFIGURATION SET BUFFER POOL EXTENSION` isn't supported. See [ALTER SERVER CONFIGURATION](https://docs.microsoft.com/sql/t-sql/statements/alter-server-configuration-transact-sql).

### Collation

The default instance collation is `SQL_Latin1_General_CP1_CI_AS` and can be specified as a creation parameter. See [Collations](https://docs.microsoft.com/sql/t-sql/statements/collations).

### Compatibility levels

- Supported compatibility levels are: 100, 110, 120, 130, 140  
- Compatibility levels below 100 aren't supported.
- The default compatibility level for new databases is 140. For restored databases, compatibility level will remain unchanged if it was 100 and above.

See [ALTER DATABASE Compatibility Level](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-compatibility-level).

### Database mirroring

Database mirroring isn't supported.

- `ALTER DATABASE SET PARTNER` and `SET WITNESS` options aren't supported.
- `CREATE ENDPOINT … FOR DATABASE_MIRRORING` isn't supported.

For more information, see [ALTER DATABASE SET PARTNER and SET WITNESS](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-database-mirroring) and [CREATE ENDPOINT … FOR DATABASE_MIRRORING](https://docs.microsoft.com/sql/t-sql/statements/create-endpoint-transact-sql).

### Database options

- Multiple log files aren't supported.
- In-memory objects aren't supported in the General Purpose service tier.  
- There's a limit of 280 files per General Purpose instance implying max 280 files per database. Both data and log files in General Purpose tier are counted toward this limit. [Business Critical tier supports 32,767 files per database](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-resource-limits#service-tier-characteristics).
- Database can't contain filegroups containing filestream data.  Restore will fail if .bak contains `FILESTREAM` data.  
- Every file is placed in Azure Blob storage. IO and throughput per file depend on the size of each individual file.  

#### CREATE DATABASE statement

The following are `CREATE DATABASE` limitations:

- Files and filegroups can't be defined.  
- `CONTAINMENT` option isn't supported.  
- `WITH`options aren't supported.  
   > [!TIP]
   > As workaround, use `ALTER DATABASE` after `CREATE DATABASE` to set database options to add files or to set containment.  

- `FOR ATTACH` option isn't supported
- `AS SNAPSHOT OF` option isn't supported

For more information, see [CREATE DATABASE](https://docs.microsoft.com/sql/t-sql/statements/create-database-sql-server-transact-sql).

#### ALTER DATABASE statement

Some file properties can't be set or changed:

- File path can't be specified in `ALTER DATABASE ADD FILE (FILENAME='path')` T-SQL statement. Remove `FILENAME` from the script because a Managed Instance automatically places the files.  
- File name can't be changed using `ALTER DATABASE` statement.

The following options are set by default and can't be changed:

- `MULTI_USER`
- `ENABLE_BROKER ON`
- `AUTO_CLOSE OFF`

The following options can't be modified:

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

For more information, see [ALTER DATABASE](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-file-and-filegroup-options).

### SQL Server Agent

- SQL Agent settings are read only. Procedure `sp_set_agent_properties` isn't supported in Managed Instance.  
- Jobs
  - T-SQL job steps are supported.
  - The following replication jobs are supported:
    - Transaction-log reader
    - Snapshot
    - Distributor
  - SSIS job steps are supported
  - Other types of job steps aren't currently supported, including:
    - Merge replication job step isn't supported.  
    - Queue Reader isn't supported.  
    - Command shell is not yet supported.
  - Managed Instances can't access external resources (for example, network shares via robocopy).  
  - Analysis Services aren't supported.
- Notifications are partially supported.
- Email notification is supported, requires configuring a Database Mail profile. SQL Agent can use only one database mail profile and it must be called `AzureManagedInstance_dbmail_profile`.  
  - Pager isn't supported.  
  - NetSend isn't supported.
  - Alerts are not yet supported.
  - Proxies are not supported.  
- Eventlog isn't supported.

The following features are currently not supported but will be enabled in future:

- Proxies
- Scheduling jobs on idle CPU
- Enabling/disabling Agent
- Alerts

For information about SQL Server Agent, see [SQL Server Agent](https://docs.microsoft.com/sql/ssms/agent/sql-server-agent).

### Tables

The following aren't supported:

- `FILESTREAM`
- `FILETABLE`
- `EXTERNAL TABLE`
- `MEMORY_OPTIMIZED`  

For information about creating and altering tables, see [CREATE TABLE](https://docs.microsoft.com/sql/t-sql/statements/create-table-transact-sql) and [ALTER TABLE](https://docs.microsoft.com/sql/t-sql/statements/alter-table-transact-sql).

## Functionalities

### Bulk insert / openrowset

A Managed Instance can't access file shares and Windows folders, so the files must be imported from Azure Blob storage:

- `DATASOURCE` is required in `BULK INSERT` command while importing files from Azure Blob storage. See [BULK INSERT](https://docs.microsoft.com/sql/t-sql/statements/bulk-insert-transact-sql).
- `DATASOURCE` is required in `OPENROWSET` function when you read a content of a file from Azure Blob storage. See [OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql).

### CLR

A Managed Instance can't access file shares and Windows folders, so the following constraints apply:

- Only `CREATE ASSEMBLY FROM BINARY` is supported. See [CREATE ASSEMBLY FROM BINARY](https://docs.microsoft.com/sql/t-sql/statements/create-assembly-transact-sql).  
- `CREATE ASSEMBLY FROM FILE` isn't supported. See [CREATE ASSEMBLY FROM FILE](https://docs.microsoft.com/sql/t-sql/statements/create-assembly-transact-sql).
- `ALTER ASSEMBLY` can't reference files. See [ALTER ASSEMBLY](https://docs.microsoft.com/sql/t-sql/statements/alter-assembly-transact-sql).

### DBCC

Undocumented DBCC statements that are enabled in SQL Server aren't supported in Managed Instances.

- `Trace Flags` aren't supported. See [Trace Flags](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-trace-flags-transact-sql).
- `DBCC TRACEOFF` isn't supported. See [DBCC TRACEOFF](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceoff-transact-sql).
- `DBCC TRACEON` isn't supported. See [DBCC TRACEON](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-transact-sql).

### Distributed transactions

Neither MSDTC nor [Elastic Transactions](sql-database-elastic-transactions-overview.md) are currently supported in Managed Instances.

### Extended Events

Some Windows-specific targets for XEvents aren't supported:

- `etw_classic_sync target` isn't supported. Store `.xel` files on Azure blob storage. See [etw_classic_sync target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#etw_classic_sync_target-target).
- `event_file target` isn't supported. Store `.xel` files on Azure blob storage. See [event_file target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#event_file-target).

### External libraries

In-database R and Python external libraries are not yet supported. See [SQL Server Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics/r/sql-server-r-services).

### Filestream and Filetable

- filestream data isn't supported.
- Database can't contain filegroups with `FILESTREAM` data.
- `FILETABLE` isn't supported.
- Tables can't have `FILESTREAM` types.
- The following functions aren't supported:
  - `GetPathLocator()`
  - `GET_FILESTREAM_TRANSACTION_CONTEXT()`
  - `PathName()`
  - `GetFileNamespacePat)`
  - `FileTableRootPath()`

For more information, see [FILESTREAM](https://docs.microsoft.com/sql/relational-databases/blob/filestream-sql-server) and [FileTables](https://docs.microsoft.com/sql/relational-databases/blob/filetables-sql-server).

### Full-text Semantic Search

[Semantic Search](https://docs.microsoft.com/sql/relational-databases/search/semantic-search-sql-server) isn't supported.

### Linked servers

Linked servers in Managed Instances support a limited number of targets:

- Supported targets: SQL Server and SQL Database
- Not supported targets: files, Analysis Services, and other RDBMS.

Operations

- Cross-instance write transactions aren't supported.
- `sp_dropserver` is supported for dropping a linked server. See [sp_dropserver](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-dropserver-transact-sql).
- `OPENROWSET` function can be used to execute queries only on SQL Server instances (either managed, on-premises, or in Virtual Machines). See [OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql).
- `OPENDATASOURCE` function can be used to execute queries only on SQL Server instances (either managed, on-premises, or in virtual machines). Only `SQLNCLI`, `SQLNCLI11`, and `SQLOLEDB` values are supported as provider. For example: `SELECT * FROM OPENDATASOURCE('SQLNCLI', '...').AdventureWorks2012.HumanResources.Employee`. See [OPENDATASOURCE](https://docs.microsoft.com/sql/t-sql/functions/opendatasource-transact-sql).

### Polybase

External tables referencing the files in HDFS or Azure Blob storage aren't supported. For information about Polybase, see [Polybase](https://docs.microsoft.com/sql/relational-databases/polybase/polybase-guide).

### Replication

Replication is available for public preview for Managed Instance. For information about Replication, see [SQL Server Replication](https://docs.microsoft.com/sql/relational-databases/replication/replication-with-sql-database-managed-instance).

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
  - `FROM URL` (Azure Blob storage) is only supported option.
  - `FROM DISK`/`TAPE`/backup device isn't supported.
  - Backup sets aren't supported.
- `WITH` options aren't supported (No `DIFFERENTIAL`, `STATS`, etc.)
- `ASYNC RESTORE` - Restore continues even if client connection breaks. If your connection is dropped, you can check `sys.dm_operation_status` view for the status of a restore operation (as well as for CREATE and DROP database). See [sys.dm_operation_status](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database).  

The following database options are set/overridden and can't be changed later:  

- `NEW_BROKER` (if broker isn't enabled in .bak file)  
- `ENABLE_BROKER` (if broker isn't enabled in .bak file)  
- `AUTO_CLOSE=OFF` (if a database in .bak file has `AUTO_CLOSE=ON`)  
- `RECOVERY FULL` (if a database in .bak file has `SIMPLE` or `BULK_LOGGED` recovery mode)
- Memory optimized filegroup is added and called XTP if it wasn't in the source .bak file  
- Any existing memory optimized filegroup is renamed to XTP  
- `SINGLE_USER` and `RESTRICTED_USER` options are converted to `MULTI_USER`

Limitations:  

- `.BAK` files containing multiple backup sets can't be restored.
- `.BAK` files containing multiple log files can't be restored.
- Restore will fail if .bak contains `FILESTREAM` data.
- Backups containing databases that have active In-memory objects can't be restored on General Purpose instance.  
For information about Restore statements, see [RESTORE Statements](https://docs.microsoft.com/sql/t-sql/statements/restore-statements-transact-sql).

### Service broker

Cross-instance service broker isn't supported:

- `sys.routes` - Prerequisite: select address from sys.routes. Address must be LOCAL on every route. See [sys.routes](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-routes-transact-sql).
- `CREATE ROUTE` - you can't use `CREATE ROUTE` with `ADDRESS` other than `LOCAL`. See [CREATE ROUTE](https://docs.microsoft.com/sql/t-sql/statements/create-route-transact-sql).
- `ALTER ROUTE` can't `ALTER ROUTE` with `ADDRESS` other than `LOCAL`. See [ALTER ROUTE](https://docs.microsoft.com/sql/t-sql/statements/alter-route-transact-sql).  

### Stored procedures, functions, triggers

- `NATIVE_COMPILATION` is not supported in General Purpose tier.
- The following [sp_configure](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-configure-transact-sql) options aren't supported:
  - `allow polybase export`
  - `allow updates`
  - `filestream_access_level`
  - `remote data archive`
  - `remote proc trans`
- `sp_execute_external_scripts` isn't supported. See [sp_execute_external_scripts](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql#examples).
- `xp_cmdshell` isn't supported. See [xp_cmdshell](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql).
- `Extended stored procedures` aren't supported, including `sp_addextendedproc` and `sp_dropextendedproc`. See [Extended stored procedures](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/general-extended-stored-procedures-transact-sql)
- `sp_attach_db`, `sp_attach_single_file_db`, and `sp_detach_db` aren't supported. See [sp_attach_db](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-attach-db-transact-sql), [sp_attach_single_file_db](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-attach-single-file-db-transact-sql), and [sp_detach_db](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-detach-db-transact-sql).

## <a name="Changes"></a> Behavior changes

The following variables, functions, and views return different results:

- `SERVERPROPERTY('EngineEdition')` returns value 8. This property uniquely identifies a Managed Instance. See [SERVERPROPERTY](https://docs.microsoft.com/sql/t-sql/functions/serverproperty-transact-sql).
- `SERVERPROPERTY('InstanceName')` returns NULL, because the concept of instance as it exists for SQL Server doesn't apply to a Managed Instance. See [SERVERPROPERTY('InstanceName')](https://docs.microsoft.com/sql/t-sql/functions/serverproperty-transact-sql).
- `@@SERVERNAME` returns full DNS 'connectable' name, for example, my-managed-instance.wcus17662feb9ce98.database.windows.net. See [@@SERVERNAME](https://docs.microsoft.com/sql/t-sql/functions/servername-transact-sql).  
- `SYS.SERVERS` - returns full DNS 'connectable' name, such as `myinstance.domain.database.windows.net` for properties 'name' and 'data_source'. See [SYS.SERVERS](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-servers-transact-sql).
- `@@SERVICENAME` returns NULL, because the concept of service as it exists for SQL Server doesn't apply to a Managed Instance. See [@@SERVICENAME](https://docs.microsoft.com/sql/t-sql/functions/servicename-transact-sql).
- `SUSER_ID` is supported. Returns NULL if Azure AD login is not in sys.syslogins. See [SUSER_ID](https://docs.microsoft.com/sql/t-sql/functions/suser-id-transact-sql).  
- `SUSER_SID` isn't supported. Returns wrong data (temporary known issue). See [SUSER_SID](https://docs.microsoft.com/sql/t-sql/functions/suser-sid-transact-sql).

## <a name="Issues"></a> Known issues and limitations

### TEMPDB size

Max file size of `tempdb` cannot be greater than 24GB/core on General Purpose tier. Max `tempdb` size on Business Critical tier is limited with the instance storage size. `tempdb` is always split into 12 data files. This maximum size per file can't be changed and new files can be added to `tempdb`. Some queries might return an error if  they need more than 24GB / core in `tempdb`.

### Cannot restore contained database

Managed Instance cannot restore [contained databases](https://docs.microsoft.com/sql/relational-databases/databases/contained-databases). Point-in-time restore of the existing contained databases don't work on Managed Instance. This issue will be removed soon and in the meantime we recommend to remove containment option from your databases that are placed on Managed Instance, and do not use containment option for the production databases.

### Exceeding storage space with small database files

`CREATE DATABASE`, `ALTER DATABASE ADD FILE`, and `RESTORE DATABASE` statements might fail because the instance can reach the Azure Storage limit.

Each General Purpose Managed Instance has up to 35 TB storage reserved for Azure Premium Disk space, and each database file is placed on a separate physical disk. Disk sizes can be 128 GB, 256 GB, 512 GB, 1 TB, or 4 TB. Unused space on disk is not charged, but the total sum of Azure Premium Disk sizes cannot exceed 35 TB. In some cases, a Managed Instance that does not need 8 TB in total might exceed the 35 TB Azure limit on storage size, due to internal fragmentation.

For example, a General Purpose Managed Instance could have one file 1.2 TB in size that is placed on a 4 TB disk, and 248 files (each 1 GB in size) that are placed on separate 128 GB disks. In this example:

- The total allocated disk storage size is 1 x 4 TB + 248 x 128 GB = 35 TB.
- The total reserved space for databases on the instance is 1 x 1.2 TB + 248 x 1 GB = 1.4 TB.

This illustrates that under certain circumstance, due to a specific distribution of files, a Managed Instance might reach the 35 TB reserved for attached Azure Premium Disk when you might not expect it to.

In this example, existing databases will continue to work and can grow without any problem as long as new files are not added. However new databases could not be created or restored because there is not enough space for new disk drives, even if the total size of all databases does not reach the instance size limit. The error that is returned in that case is not clear.

You can [identify number of remaining files](https://medium.com/azure-sqldb-managed-instance/how-many-files-you-can-create-in-general-purpose-azure-sql-managed-instance-e1c7c32886c1) using system views. If you are reaching this limit try to [empty and delete some of the smaller files using DBCC SHRINKFILE statement](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-shrinkfile-transact-sql#d-emptying-a-file) or switch to [Business Critical tier that doesn't have this limit](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-resource-limits#service-tier-characteristics).

### Incorrect configuration of SAS key during database restore

`RESTORE DATABASE` that reads .bak file might be constantly retrying to read .bak file and return error after long period of time if Shared Access Signature in `CREDENTIAL` is incorrect. Execute RESTORE HEADERONLY before restoring a database to be sure that SAS key is correct.
Make sure that you remove the leading `?` from the SAS key that is generated using Azure portal.

### Tooling

SQL Server Management Studio (SSMS) and SQL Server Data Tools (SSDT) might have some issues while accessing a Managed Instance.

- Using Azure AD server principals (logins) and users (**public preview**) with SSDT is currently not supported.
- Scripting for Azure AD server principals (logins) and users (**public preview**) are not supported in SSMS.

### Incorrect database names in some views, logs, and messages

Several system views, performance counters, error messages, XEvents, and error log entries display GUID database identifiers instead of the actual database names. Do not rely on these GUID identifiers because they would be replaced with actual database names in the future.

### Database mail

`@query` parameter in [sp_send_db_mail](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-send-dbmail-transact-sql) procedure don't work.

### Database mail profile

The database mail profile used by SQL Agent must be called `AzureManagedInstance_dbmail_profile`. There are no restriction regarding other database mail profile names.

### Error logs are not-persisted

Error logs that are available in Managed Instance aren't persisted and their size isn't included in the max storage limit. Error logs might be automatically erased in case of failover.

### Error logs are verbose

A Managed Instance places verbose information in error logs and many of them are not relevant. The amount of information in error logs will be decreased in the future.

**Workaround**: Use a custom procedure for reading error logs that filter-out some non-relevant entries. For details, see [Managed Instance – sp_readmierrorlog](https://blogs.msdn.microsoft.com/sqlcat/2018/05/04/azure-sql-db-managed-instance-sp_readmierrorlog/).

### Transaction Scope on two databases within the same instance isn't supported

`TransactionScope` class in .NET doesn't work if two queries are sent to the two databases within the same instance under the same transaction scope:

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

### CLR modules and linked servers sometime can't reference local IP address

CLR modules placed in a Managed Instance and linked servers/distributed queries that are referencing current instance sometime can't resolve the IP of the local instance. This error is a transient issue.

**Workaround**: Use context connections in CLR module if possible.

### TDE encrypted databases with service-managed key don't support user-initiated backups

You can't execute `BACKUP DATABASE ... WITH COPY_ONLY` on a database that is encrypted with service-managed Transparent Data Encryption (TDE). Service-managed TDE forces backups to be encrypted with internal TDE key, and the key can't be exported, so you won't be able to restore the backup.

**Workaround**: Use automatic backups and point-in-time restore, or use [customer-managed (BYOK) TDE](https://docs.microsoft.com/azure/sql-database/transparent-data-encryption-azure-sql#customer-managed-transparent-data-encryption---bring-your-own-key) instead, or disable encryption on database.

## Next steps

- For details about Managed Instances, see [What is a Managed Instance?](sql-database-managed-instance.md)
- For a features and comparison list, see [SQL common features](sql-database-features.md).
- For a quickstart showing you how to create a new Managed Instance, see [Creating a Managed Instance](sql-database-managed-instance-get-started.md).
