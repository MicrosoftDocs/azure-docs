---
title: Azure SQL Database Managed Instance T-SQL differences | Microsoft Docs
description: This article discusses the T-SQL differences between a managed instance in Azure SQL Database and SQL Server
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein, carlrab, bonova 
manager: craigg
ms.date: 07/07/2019
ms.custom: seoapril2019
---

# Azure SQL Database Managed Instance T-SQL differences from SQL Server

This article summarizes and explains the differences in syntax and behavior between Azure SQL Database Managed Instance and on-premises SQL Server Database Engine. The following subjects are discussed: <a name="Differences"></a>

- [Availability](#availability) includes the differences in [Always-On](#always-on-availability) and [backups](#backup).
- [Security](#security) includes the differences in [auditing](#auditing), [certificates](#certificates), [credentials](#credential), [cryptographic providers](#cryptographic-providers), [logins and users](#logins-and-users), and the [service key and service master key](#service-key-and-service-master-key).
- [Configuration](#configuration) includes the differences in [buffer pool extension](#buffer-pool-extension), [collation](#collation), [compatibility levels](#compatibility-levels), [database mirroring](#database-mirroring), [database options](#database-options), [SQL Server Agent](#sql-server-agent), and [table options](#tables).
- [Functionalities](#functionalities) includes [BULK INSERT/OPENROWSET](#bulk-insert--openrowset), [CLR](#clr), [DBCC](#dbcc), [distributed transactions](#distributed-transactions), [extended events](#extended-events), [external libraries](#external-libraries), [filestream and FileTable](#filestream-and-filetable), [full-text Semantic Search](#full-text-semantic-search), [linked servers](#linked-servers), [PolyBase](#polybase), [replication](#replication), [RESTORE](#restore-statement), [Service Broker](#service-broker), [stored procedures, functions, and triggers](#stored-procedures-functions-and-triggers).
- [Environment settings](#Environment) such as VNets and subnet configurations.
- [Features that have different behavior in managed instances](#Changes).
- [Temporary limitations and known issues](#Issues).

The Managed Instance deployment option provides high compatibility with on-premises SQL Server Database Engine. Most of the SQL Server database engine features are supported in a managed instance.

![Migration](./media/sql-database-managed-instance/migration.png)

## Availability

### <a name="always-on-availability"></a>Always On

[High availability](sql-database-high-availability.md) is built into Managed Instance and can't be controlled by users. The following statements aren't supported:

- [CREATE ENDPOINT … FOR DATABASE_MIRRORING](https://docs.microsoft.com/sql/t-sql/statements/create-endpoint-transact-sql)
- [CREATE AVAILABILITY GROUP](https://docs.microsoft.com/sql/t-sql/statements/create-availability-group-transact-sql)
- [ALTER AVAILABILITY GROUP](https://docs.microsoft.com/sql/t-sql/statements/alter-availability-group-transact-sql)
- [DROP AVAILABILITY GROUP](https://docs.microsoft.com/sql/t-sql/statements/drop-availability-group-transact-sql)
- The [SET HADR](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-set-hadr) clause of the [ALTER DATABASE](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql) statement

### Backup

Managed instances have automatic backups, so users can create full database `COPY_ONLY` backups. Differential, log, and file snapshot backups aren't supported.

- With a managed instance, you can back up an instance database only to an Azure Blob storage account:
  - Only `BACKUP TO URL` is supported.
  - `FILE`, `TAPE`, and backup devices aren't supported.
- Most of the general `WITH` options are supported.
  - `COPY_ONLY` is mandatory.
  - `FILE_SNAPSHOT` isn't supported.
  - Tape options: `REWIND`, `NOREWIND`, `UNLOAD`, and `NOUNLOAD` aren't supported.
  - Log-specific options: `NORECOVERY`, `STANDBY`, and `NO_TRUNCATE` aren't supported.

Limitations: 

- With a managed instance, you can back up an instance database to a backup with up to 32 stripes, which is enough for databases up to 4 TB if backup compression is used.
- The maximum backup stripe size by using the `BACKUP` command in a managed instance is 195 GB, which is the maximum blob size. Increase the number of stripes in the backup command to reduce individual stripe size and stay within this limit.

    > [!TIP]
    > To work around this limitation, when you back up a database from either SQL Server in an on-premises environment or in a virtual machine, you can:
    >
    > - Back up to `DISK` instead of backing up to `URL`.
    > - Upload the backup files to Blob storage.
    > - Restore into the managed instance.
    >
    > The `Restore` command in a managed instance supports bigger blob sizes in the backup files because a different blob type is used for storage of the uploaded backup files.

For information about backups using T-SQL, see [BACKUP](https://docs.microsoft.com/sql/t-sql/statements/backup-transact-sql).

## Security

### Auditing

The key differences between auditing in databases in Azure SQL Database and databases in SQL Server are:

- With the Managed Instance deployment option in Azure SQL Database, auditing works at the server level. The `.xel` log files are stored in Azure Blob storage.
- With the single database and elastic pool deployment options in Azure SQL Database, auditing works at the database level.
- In SQL Server on-premises or virtual machines, auditing works at the server level. Events are stored on file system or Windows event logs.
 
XEvent auditing in Managed Instance supports Azure Blob storage targets. File and Windows logs aren't supported.

The key differences in the `CREATE AUDIT` syntax for auditing to Azure Blob storage are:

- A new syntax `TO URL` is provided that you can use to specify the URL of the Azure Blob storage container where the `.xel` files are placed.
- The syntax `TO FILE` isn't supported because a managed instance can't access Windows file shares.

For more information, see: 

- [CREATE SERVER AUDIT](https://docs.microsoft.com/sql/t-sql/statements/create-server-audit-transact-sql) 
- [ALTER SERVER AUDIT](https://docs.microsoft.com/sql/t-sql/statements/alter-server-audit-transact-sql)
- [Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine)

### Certificates

A managed instance can't access file shares and Windows folders, so the following constraints apply:

- The `CREATE FROM`/`BACKUP TO` file isn't supported for certificates.
- The `CREATE`/`BACKUP` certificate from `FILE`/`ASSEMBLY` isn't supported. Private key files can't be used. 

See [CREATE CERTIFICATE](https://docs.microsoft.com/sql/t-sql/statements/create-certificate-transact-sql) and [BACKUP CERTIFICATE](https://docs.microsoft.com/sql/t-sql/statements/backup-certificate-transact-sql). 
 
**Workaround**: Script for the certificate or private key, store as .sql file, and create from binary:

```sql
CREATE CERTIFICATE  
   FROM BINARY = asn_encoded_certificate
WITH PRIVATE KEY (<private_key_options>)
```

### Credential

Only Azure Key Vault and `SHARED ACCESS SIGNATURE` identities are supported. Windows users aren't supported.

See [CREATE CREDENTIAL](https://docs.microsoft.com/sql/t-sql/statements/create-credential-transact-sql) and [ALTER CREDENTIAL](https://docs.microsoft.com/sql/t-sql/statements/alter-credential-transact-sql).

### Cryptographic providers

A managed instance can't access files, so cryptographic providers can't be created:

- `CREATE CRYPTOGRAPHIC PROVIDER` isn't supported. See [CREATE CRYPTOGRAPHIC PROVIDER](https://docs.microsoft.com/sql/t-sql/statements/create-cryptographic-provider-transact-sql).
- `ALTER CRYPTOGRAPHIC PROVIDER` isn't supported. See [ALTER CRYPTOGRAPHIC PROVIDER](https://docs.microsoft.com/sql/t-sql/statements/alter-cryptographic-provider-transact-sql).

### Logins and users

- SQL logins created by using `FROM CERTIFICATE`, `FROM ASYMMETRIC KEY`, and `FROM SID` are supported. See [CREATE LOGIN](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql).
- Azure Active Directory (Azure AD) server principals (logins) created with the [CREATE LOGIN](https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current) syntax or the [CREATE USER FROM LOGIN [Azure AD Login]](https://docs.microsoft.com/sql/t-sql/statements/create-user-transact-sql?view=azuresqldb-mi-current) syntax are supported (public preview). These logins are created at the server level.

    Managed Instance supports Azure AD database principals with the syntax `CREATE USER [AADUser/AAD group] FROM EXTERNAL PROVIDER`. This feature is also known as Azure AD contained database users.

- Windows logins created with the `CREATE LOGIN ... FROM WINDOWS` syntax aren't supported. Use Azure Active Directory logins and users.
- The Azure AD user who created the instance has [unrestricted admin privileges](sql-database-manage-logins.md#unrestricted-administrative-accounts).
- Non-administrator Azure AD database-level users can be created by using the `CREATE USER ... FROM EXTERNAL PROVIDER` syntax. See [CREATE USER ... FROM EXTERNAL PROVIDER](sql-database-manage-logins.md#non-administrator-users).
- Azure AD server principals (logins) support SQL features within one managed instance only. Features that require cross-instance interaction, no matter whether they're within the same Azure AD tenant or different tenants, aren't supported for Azure AD users. Examples of such features are:

  - SQL transactional replication.
  - Link server.

- Setting an Azure AD login mapped to an Azure AD group as the database owner isn't supported.
- Impersonation of Azure AD server-level principals by using other Azure AD principals is supported, such as the [EXECUTE AS](/sql/t-sql/statements/execute-as-transact-sql) clause. EXECUTE AS limitations are:

  - EXECUTE AS USER isn't supported for Azure AD users when the name differs from the login name. An example is when the user is created through the syntax CREATE USER [myAadUser] FROM LOGIN [john@contoso.com] and impersonation is attempted through EXEC AS USER = _myAadUser_. When you create a **USER** from an Azure AD server principal (login), specify the user_name as the same login_name from **LOGIN**.
  - Only the SQL Server-level principals (logins) that are part of the `sysadmin` role can execute the following operations that target Azure AD principals:

    - EXECUTE AS USER
    - EXECUTE AS LOGIN

- Public preview limitations for Azure AD server principals (logins):

  - Active Directory admin limitations for Managed Instance:

    - The Azure AD admin used to set up the managed instance can't be used to create an Azure AD server principal (login) within the managed instance. You must create the first Azure AD server principal (login) by using a SQL Server account that's a `sysadmin` role. This temporary limitation will be removed after Azure AD server principals (logins) become generally available. If you try to use an Azure AD admin account to create the login, you see the following error: `Msg 15247, Level 16, State 1, Line 1 User does not have permission to perform this action.`
      - Currently, the first Azure AD login created in the master database must be created by the standard SQL Server account (non-Azure AD) that's a `sysadmin` role by using [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current) FROM EXTERNAL PROVIDER. After general availability, this limitation will be removed. Then you can create an initial Azure AD login by using the Active Directory admin for Managed Instance.
    - DacFx (export/import) used with SQL Server Management Studio or SqlPackage isn't supported for Azure AD logins. This limitation will be removed after Azure AD server principals (logins) become generally available.
    - Using Azure AD server principals (logins) with SQL Server Management Studio:

      - Scripting Azure AD logins that use any authenticated login isn't supported.
      - IntelliSense doesn't recognize the CREATE LOGIN FROM EXTERNAL PROVIDER statement and shows a red underline.

- Only the server-level principal login, which is created by the Managed Instance provisioning process, members of the server roles, such as `securityadmin` or `sysadmin`, or other logins with ALTER ANY LOGIN permission at the server level can create Azure AD server principals (logins) in the master database for Managed Instance.
- If the login is a SQL principal, only logins that are part of the `sysadmin` role can use the create command to create logins for an Azure AD account.
- The Azure AD login must be a member of an Azure AD within the same directory that's used for Azure SQL Database Managed Instance.
- Azure AD server principals (logins) are visible in Object Explorer starting with SQL Server Management Studio 18.0 preview 5.
- Overlapping Azure AD server principals (logins) with an Azure AD admin account is allowed. Azure AD server principals (logins) take precedence over the Azure AD admin when you resolve the principal and apply permissions to the managed instance.
- During authentication, the following sequence is applied to resolve the authenticating principal:

    1. If the Azure AD account exists as directly mapped to the Azure AD server principal (login), which is present in sys.server_principals as type "E," grant access and apply permissions of the Azure AD server principal (login).
    2. If the Azure AD account is a member of an Azure AD group that's mapped to the Azure AD server principal (login), which is present in sys.server_principals as type "X," grant access and apply permissions of the Azure AD group login.
    3. If the Azure AD account is a special portal-configured Azure AD admin for Managed Instance, which doesn't exist in Managed Instance system views, apply special fixed permissions of the Azure AD admin for Managed Instance (legacy mode).
    4. If the Azure AD account exists as directly mapped to an Azure AD user in a database, which is present in sys.database_principals as type "E," grant access and apply permissions of the Azure AD database user.
    5. If the Azure AD account is a member of an Azure AD group that's mapped to an Azure AD user in a database, which is present in sys.database_principals as type "X," grant access and apply permissions of the Azure AD group login.
    6. If there's an Azure AD login mapped to either an Azure AD user account or an Azure AD group account, which resolves to the user who's authenticating, all permissions from this Azure AD login are applied.

### Service key and service master key

- [Master key backup](https://docs.microsoft.com/sql/t-sql/statements/backup-master-key-transact-sql) isn't supported (managed by SQL Database service).
- [Master key restore](https://docs.microsoft.com/sql/t-sql/statements/restore-master-key-transact-sql) isn't supported (managed by SQL Database service).
- [Service master key backup](https://docs.microsoft.com/sql/t-sql/statements/backup-service-master-key-transact-sql) isn't supported (managed by SQL Database service).
- [Service master key restore](https://docs.microsoft.com/sql/t-sql/statements/restore-service-master-key-transact-sql) isn't supported (managed by SQL Database service).

## Configuration

### Buffer pool extension

- [Buffer pool extension](https://docs.microsoft.com/sql/database-engine/configure-windows/buffer-pool-extension) isn't supported.
- `ALTER SERVER CONFIGURATION SET BUFFER POOL EXTENSION` isn't supported. See [ALTER SERVER CONFIGURATION](https://docs.microsoft.com/sql/t-sql/statements/alter-server-configuration-transact-sql).

### Collation

The default instance collation is `SQL_Latin1_General_CP1_CI_AS` and can be specified as a creation parameter. See [Collations](https://docs.microsoft.com/sql/t-sql/statements/collations).

### Compatibility levels

- Supported compatibility levels are 100, 110, 120, 130, and 140.
- Compatibility levels below 100 aren't supported.
- The default compatibility level for new databases is 140. For restored databases, the compatibility level remains unchanged if it was 100 and above.

See [ALTER DATABASE Compatibility Level](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-compatibility-level).

### Database mirroring

Database mirroring isn't supported.

- `ALTER DATABASE SET PARTNER` and `SET WITNESS` options aren't supported.
- `CREATE ENDPOINT … FOR DATABASE_MIRRORING` isn't supported.

For more information, see [ALTER DATABASE SET PARTNER and SET WITNESS](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-database-mirroring) and [CREATE ENDPOINT … FOR DATABASE_MIRRORING](https://docs.microsoft.com/sql/t-sql/statements/create-endpoint-transact-sql).

### Database options

- Multiple log files aren't supported.
- In-memory objects aren't supported in the General Purpose service tier. 
- There's a limit of 280 files per General Purpose instance, which implies a maximum of 280 files per database. Both data and log files in the General Purpose tier are counted toward this limit. [The Business Critical tier supports 32,767 files per database](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-resource-limits#service-tier-characteristics).
- The database can't contain filegroups that contain filestream data. Restore fails if .bak contains `FILESTREAM` data. 
- Every file is placed in Azure Blob storage. IO and throughput per file depend on the size of each individual file.

#### CREATE DATABASE statement

The following limitations apply to `CREATE DATABASE`:

- Files and filegroups can't be defined. 
- The `CONTAINMENT` option isn't supported. 
- `WITH` options aren't supported. 
   > [!TIP]
   > As a workaround, use `ALTER DATABASE` after `CREATE DATABASE` to set database options to add files or to set containment. 

- The `FOR ATTACH` option isn't supported.
- The `AS SNAPSHOT OF` option isn't supported.

For more information, see [CREATE DATABASE](https://docs.microsoft.com/sql/t-sql/statements/create-database-sql-server-transact-sql).

#### ALTER DATABASE statement

Some file properties can't be set or changed:

- A file path can't be specified in the `ALTER DATABASE ADD FILE (FILENAME='path')` T-SQL statement. Remove `FILENAME` from the script because a managed instance automatically places the files. 
- A file name can't be changed by using the `ALTER DATABASE` statement.

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

- Enabling and disabling SQL Server Agent is currently not supported in managed instance. SQL Agent is always running.
- SQL Server Agent settings are read only. The procedure `sp_set_agent_properties` isn't supported in Managed Instance. 
- Jobs
  - T-SQL job steps are supported.
  - The following replication jobs are supported:
    - Transaction-log reader
    - Snapshot
    - Distributor
  - SSIS job steps are supported.
  - Other types of job steps aren't currently supported:
    - The merge replication job step isn't supported. 
    - Queue Reader isn't supported. 
    - Command shell isn't yet supported.
  - Managed instances can't access external resources, for example, network shares via robocopy. 
  - SQL Server Analysis Services aren't supported.
- Notifications are partially supported.
- Email notification is supported, although it requires that you configure a Database Mail profile. SQL Server Agent can use only one Database Mail profile, and it must be called `AzureManagedInstance_dbmail_profile`. 
  - Pager isn't supported.
  - NetSend isn't supported.
  - Alerts aren't yet supported.
  - Proxies aren't supported.
- EventLog isn't supported.

The following SQL Agent features currently aren't supported:

- Proxies
- Scheduling jobs on an idle CPU
- Enabling or disabling an Agent
- Alerts

For information about SQL Server Agent, see [SQL Server Agent](https://docs.microsoft.com/sql/ssms/agent/sql-server-agent).

### Tables

The following tables aren't supported:

- `FILESTREAM`
- `FILETABLE`
- `EXTERNAL TABLE`
- `MEMORY_OPTIMIZED` 

For information about how to create and alter tables, see [CREATE TABLE](https://docs.microsoft.com/sql/t-sql/statements/create-table-transact-sql) and [ALTER TABLE](https://docs.microsoft.com/sql/t-sql/statements/alter-table-transact-sql).

## Functionalities

### Bulk insert / openrowset

A managed instance can't access file shares and Windows folders, so the files must be imported from Azure Blob storage:

- `DATASOURCE` is required in the `BULK INSERT` command while you import files from Azure Blob storage. See [BULK INSERT](https://docs.microsoft.com/sql/t-sql/statements/bulk-insert-transact-sql).
- `DATASOURCE` is required in the `OPENROWSET` function when you read the content of a file from Azure Blob storage. See [OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql).

### CLR

A managed instance can't access file shares and Windows folders, so the following constraints apply:

- Only `CREATE ASSEMBLY FROM BINARY` is supported. See [CREATE ASSEMBLY FROM BINARY](https://docs.microsoft.com/sql/t-sql/statements/create-assembly-transact-sql). 
- `CREATE ASSEMBLY FROM FILE` isn't supported. See [CREATE ASSEMBLY FROM FILE](https://docs.microsoft.com/sql/t-sql/statements/create-assembly-transact-sql).
- `ALTER ASSEMBLY` can't reference files. See [ALTER ASSEMBLY](https://docs.microsoft.com/sql/t-sql/statements/alter-assembly-transact-sql).

### DBCC

Undocumented DBCC statements that are enabled in SQL Server aren't supported in managed instances.

- `Trace flags` aren't supported. See [Trace flags](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-trace-flags-transact-sql).
- `DBCC TRACEOFF` isn't supported. See [DBCC TRACEOFF](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceoff-transact-sql).
- `DBCC TRACEON` isn't supported. See [DBCC TRACEON](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-transact-sql).

### Distributed transactions

MSDTC and [elastic transactions](sql-database-elastic-transactions-overview.md) currently aren't supported in managed instances.

### Extended Events

Some Windows-specific targets for Extended Events (XEvents) aren't supported:

- The `etw_classic_sync` target isn't supported. Store `.xel` files in Azure Blob storage. See [etw_classic_sync target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#etw_classic_sync_target-target).
- The `event_file` target isn't supported. Store `.xel` files in Azure Blob storage. See [event_file target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#event_file-target).

### External libraries

In-database R and Python, external libraries aren't yet supported. See [SQL Server Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics/r/sql-server-r-services).

### Filestream and FileTable

- Filestream data isn't supported.
- The database can't contain filegroups with `FILESTREAM` data.
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

- Supported targets are SQL Server and SQL Database.
- Targets that aren't supported are files, Analysis Services, and other RDBMS.

Operations

- Cross-instance write transactions aren't supported.
- `sp_dropserver` is supported for dropping a linked server. See [sp_dropserver](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-dropserver-transact-sql).
- The `OPENROWSET` function can be used to execute queries only on SQL Server instances. They can be either managed, on-premises, or in virtual machines. See [OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql).
- The `OPENDATASOURCE` function can be used to execute queries only on SQL Server instances. They can be either managed, on-premises, or in virtual machines. Only the `SQLNCLI`, `SQLNCLI11`, and `SQLOLEDB` values are supported as a provider. An example is `SELECT * FROM OPENDATASOURCE('SQLNCLI', '...').AdventureWorks2012.HumanResources.Employee`. See [OPENDATASOURCE](https://docs.microsoft.com/sql/t-sql/functions/opendatasource-transact-sql).

### PolyBase

External tables that reference the files in HDFS or Azure Blob storage aren't supported. For information about PolyBase, see [PolyBase](https://docs.microsoft.com/sql/relational-databases/polybase/polybase-guide).

### Replication

[Transactional Replication](sql-database-managed-instance-transactional-replication.md) is available for public preview on Managed Instance with some constraints:
- Al types of replication participants (Publisher, Distributor, Pull Subscriber, and Push Subscriber) can be placed on Managed Instance, but Publisher and Distributor cannot be placed on different instances.
- Transactional, Snapshot, and Bi-directional replication types are supported. Merge replication, Peer-to-peer replication and updateable subscriptions are not supported.
- Managed Instance can communicate with the recent versions of SQL Server. See the supported versions [here](sql-database-managed-instance-transactional-replication.md#supportability-matrix-for-instance-databases-and-on-premises-systems).
- Transactional Replication has some [additional networking requirements](sql-database-managed-instance-transactional-replication.md#requirements).

For information about configuring replication, see [replication tutorial](replication-with-sql-database-managed-instance.md).

### RESTORE statement 

- Supported syntax:
  - `RESTORE DATABASE`
  - `RESTORE FILELISTONLY ONLY`
  - `RESTORE HEADER ONLY`
  - `RESTORE LABELONLY ONLY`
  - `RESTORE VERIFYONLY ONLY`
- Unsupported syntax:
  - `RESTORE LOG ONLY`
  - `RESTORE REWINDONLY ONLY`
- Source: 
  - `FROM URL` (Azure Blob storage) is the only supported option.
  - `FROM DISK`/`TAPE`/backup device isn't supported.
  - Backup sets aren't supported.
- `WITH` options aren't supported, such as no `DIFFERENTIAL` or `STATS`.
- `ASYNC RESTORE`: Restore continues even if the client connection breaks. If your connection is dropped, you can check the `sys.dm_operation_status` view for the status of a restore operation, and for a CREATE and DROP database. See [sys.dm_operation_status](https://docs.microsoft.com/sql/relational-databases/system-dynamic-management-views/sys-dm-operation-status-azure-sql-database). 

The following database options are set or overridden and can't be changed later: 

- `NEW_BROKER` if the broker isn't enabled in the .bak file. 
- `ENABLE_BROKER` if the broker isn't enabled in the .bak file. 
- `AUTO_CLOSE=OFF` if a database in the .bak file has `AUTO_CLOSE=ON`. 
- `RECOVERY FULL` if a database in the .bak file has `SIMPLE` or `BULK_LOGGED` recovery mode.
- A memory-optimized filegroup is added and called XTP if it wasn't in the source .bak file. 
- Any existing memory-optimized filegroup is renamed to XTP. 
- `SINGLE_USER` and `RESTRICTED_USER` options are converted to `MULTI_USER`.

Limitations: 

- `.BAK` files that contain multiple backup sets can't be restored. 
- `.BAK` files that contain multiple log files can't be restored.
- Restore fails if .bak contains `FILESTREAM` data.
- Backups that contain databases that have active in-memory objects can't be restored on a General Purpose instance. 
For information about restore statements, see [RESTORE statements](https://docs.microsoft.com/sql/t-sql/statements/restore-statements-transact-sql).

### Service broker

Cross-instance service broker isn't supported:

- `sys.routes`: As a prerequisite, you must select the address from sys.routes. The address must be LOCAL on every route. See [sys.routes](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-routes-transact-sql).
- `CREATE ROUTE`: You can't use `CREATE ROUTE` with `ADDRESS` other than `LOCAL`. See [CREATE ROUTE](https://docs.microsoft.com/sql/t-sql/statements/create-route-transact-sql).
- `ALTER ROUTE`: You can't use `ALTER ROUTE` with `ADDRESS` other than `LOCAL`. See [ALTER ROUTE](https://docs.microsoft.com/sql/t-sql/statements/alter-route-transact-sql). 

### Stored procedures, functions, and triggers

- `NATIVE_COMPILATION` isn't supported in the General Purpose tier.
- The following [sp_configure](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-configure-transact-sql) options aren't supported: 
  - `allow polybase export`
  - `allow updates`
  - `filestream_access_level`
  - `remote data archive`
  - `remote proc trans`
- `sp_execute_external_scripts` isn't supported. See [sp_execute_external_scripts](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql#examples).
- `xp_cmdshell` isn't supported. See [xp_cmdshell](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql).
- `Extended stored procedures` aren't supported, which includes `sp_addextendedproc` and `sp_dropextendedproc`. See [Extended stored procedures](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/general-extended-stored-procedures-transact-sql).
- `sp_attach_db`, `sp_attach_single_file_db`, and `sp_detach_db` aren't supported. See [sp_attach_db](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-attach-db-transact-sql), [sp_attach_single_file_db](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-attach-single-file-db-transact-sql), and [sp_detach_db](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-detach-db-transact-sql).

## <a name="Environment"></a>Environment constraints

### Subnet
- In the subnet reserved for your Managed Instance you cannot place any other resources (for example virtual machines). Place these resources in others subnets.
- Subnet must have sufficient number of available [IP addresses](sql-database-managed-instance-connectivity-architecture.md#network-requirements). Minimum is 16, while recommendation is to have at least 32 IP addresses in the subnet.
- [Service endpoints cannot be associated with the managed instance's subnet](sql-database-managed-instance-connectivity-architecture.md#network-requirements). Make sure that the service endpoints option is disabled when you create the virtual network.
- The number of vCores and types of instances that you can deploy in a region have some [constraints and limits](sql-database-managed-instance-resource-limits.md#regional-resource-limitations).
- There are some [security rules that must be applied on the subnet](sql-database-managed-instance-connectivity-architecture.md#network-requirements).

### VNET
- VNet can be deployed using Resource Model - Classic Model for VNet is not supported.
- Some services such as App Service Environments, Logic apps, and Managed Instances (used for Geo-replication, Transactional replication, or via linked servers) cannot access Managed Instances in different regions if their VNets are connected using [global peering](../virtual-network/virtual-networks-faq.md#what-are-the-constraints-related-to-global-vnet-peering-and-load-balancers). You can connect to these resource via ExpressRoute or VNet-to-VNet through VNet Gateways.

## <a name="Changes"></a> Behavior changes

The following variables, functions, and views return different results:

- `SERVERPROPERTY('EngineEdition')` returns the value 8. This property uniquely identifies a managed instance. See [SERVERPROPERTY](https://docs.microsoft.com/sql/t-sql/functions/serverproperty-transact-sql).
- `SERVERPROPERTY('InstanceName')` returns NULL because the concept of instance as it exists for SQL Server doesn't apply to a managed instance. See [SERVERPROPERTY('InstanceName')](https://docs.microsoft.com/sql/t-sql/functions/serverproperty-transact-sql).
- `@@SERVERNAME` returns a full DNS "connectable" name, for example, my-managed-instance.wcus17662feb9ce98.database.windows.net. See [@@SERVERNAME](https://docs.microsoft.com/sql/t-sql/functions/servername-transact-sql). 
- `SYS.SERVERS` returns a full DNS "connectable" name, such as `myinstance.domain.database.windows.net` for the properties "name" and "data_source." See [SYS.SERVERS](https://docs.microsoft.com/sql/relational-databases/system-catalog-views/sys-servers-transact-sql).
- `@@SERVICENAME` returns NULL because the concept of service as it exists for SQL Server doesn't apply to a managed instance. See [@@SERVICENAME](https://docs.microsoft.com/sql/t-sql/functions/servicename-transact-sql).
- `SUSER_ID` is supported. It returns NULL if the Azure AD login isn't in sys.syslogins. See [SUSER_ID](https://docs.microsoft.com/sql/t-sql/functions/suser-id-transact-sql). 
- `SUSER_SID` isn't supported. The wrong data is returned, which is a temporary known issue. See [SUSER_SID](https://docs.microsoft.com/sql/t-sql/functions/suser-sid-transact-sql). 

## <a name="Issues"></a> Known issues and limitations

### TEMPDB size

The maximum file size of `tempdb` can't be greater than 24 GB per core on a General Purpose tier. The maximum `tempdb` size on a Business Critical tier is limited with the instance storage size. `tempdb` log file size is limited to 120 GB both on General Purpose and Business Critical tiers. The `tempdb` database is always split into 12 data files. This maximum size per file can't be changed, and new files cannot be added to `tempdb`. Some queries might return an error if they need more than 24 GB per core in `tempdb` or if they produce more than 120GB of log. `tempdb` is always re-created as an empty database when the instance starts or fail-over and any change made in `tempdb` will not be preserved. 

### Can't restore contained database

Managed Instance can't restore [contained databases](https://docs.microsoft.com/sql/relational-databases/databases/contained-databases). Point-in-time restore of the existing contained databases doesn't work on Managed Instance. This issue will be resolved soon. In the meantime, we recommend that you remove the containment option from your databases that are placed on Managed Instance. Don't use the containment option for the production databases. 

### Exceeding storage space with small database files

`CREATE DATABASE`, `ALTER DATABASE ADD FILE`, and `RESTORE DATABASE` statements might fail because the instance can reach the Azure Storage limit.

Each General Purpose managed instance has up to 35 TB of storage reserved for Azure Premium Disk space. Each database file is placed on a separate physical disk. Disk sizes can be 128 GB, 256 GB, 512 GB, 1 TB, or 4 TB. Unused space on the disk isn't charged, but the total sum of Azure Premium Disk sizes can't exceed 35 TB. In some cases, a managed instance that doesn't need 8 TB in total might exceed the 35 TB Azure limit on storage size due to internal fragmentation.

For example, a General Purpose managed instance might have one file that's 1.2 TB in size placed on a 4-TB disk. It also might have 248 files that are each 1 GB in size that are placed on separate 128-GB disks. In this example:

- The total allocated disk storage size is 1 x 4 TB + 248 x 128 GB = 35 TB.
- The total reserved space for databases on the instance is 1 x 1.2 TB + 248 x 1 GB = 1.4 TB.

This example illustrates that under certain circumstances, due to a specific distribution of files, a managed instance might reach the 35-TB limit that's reserved for an attached Azure Premium Disk when you might not expect it to.

In this example, existing databases continue to work and can grow without any problem as long as new files aren't added. New databases can't be created or restored because there isn't enough space for new disk drives, even if the total size of all databases doesn't reach the instance size limit. The error that's returned in that case isn't clear.

You can [identify the number of remaining files](https://medium.com/azure-sqldb-managed-instance/how-many-files-you-can-create-in-general-purpose-azure-sql-managed-instance-e1c7c32886c1) by using system views. If you reach this limit, try to [empty and delete some of the smaller files by using the DBCC SHRINKFILE statement](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-shrinkfile-transact-sql#d-emptying-a-file) or switch to the [Business Critical tier, which doesn't have this limit](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-resource-limits#service-tier-characteristics).

### Incorrect configuration of the SAS key during database restore

`RESTORE DATABASE` that reads the .bak file might be constantly retrying to read the .bak file and return an error after a long period of time if the shared access signature in `CREDENTIAL` is incorrect. Execute RESTORE HEADERONLY before you restore a database to be sure that the SAS key is correct.
Make sure that you remove the leading `?` from the SAS key that's generated by using the Azure portal.

### Tooling

SQL Server Management Studio and SQL Server Data Tools might have some issues while they access a managed instance.

- Using Azure AD server principals (logins) and users (public preview) with SQL Server Data Tools currently isn't supported.
- Scripting for Azure AD server principals (logins) and users (public preview) isn't supported in SQL Server Management Studio.

### Incorrect database names in some views, logs, and messages

Several system views, performance counters, error messages, XEvents, and error log entries display GUID database identifiers instead of the actual database names. Don't rely on these GUID identifiers because they're replaced with actual database names in the future.

### Database mail

The `@query` parameter in the [sp_send_db_mail](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-send-dbmail-transact-sql) procedure doesn't work.

### Database Mail profile

The Database Mail profile used by the SQL Server Agent must be called `AzureManagedInstance_dbmail_profile`. There are no restrictions for other Database Mail profile names.

### Error logs aren't persisted

Error logs that are available in Managed Instance aren't persisted, and their size isn't included in the maximum storage limit. Error logs might be automatically erased if failover occurs.

### Error logs are verbose

A managed instance places verbose information in error logs, and much of it isn't relevant. The amount of information in error logs will decrease in the future.

**Workaround:** Use a custom procedure to read error logs that filters out some irrelevant entries. For more information, see [Managed Instance – sp_readmierrorlog](https://blogs.msdn.microsoft.com/sqlcat/2018/05/04/azure-sql-db-managed-instance-sp_readmierrorlog/).

### Transaction scope on two databases within the same instance isn't supported

The `TransactionScope` class in .NET doesn't work if two queries are sent to two databases within the same instance under the same transaction scope:

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

Although this code works with data within the same instance, it required MSDTC.

**Workaround:** Use [SqlConnection.ChangeDatabase(String)](https://docs.microsoft.com/dotnet/api/system.data.sqlclient.sqlconnection.changedatabase) to use another database in a connection context instead of using two connections.

### CLR modules and linked servers sometimes can't reference a local IP address

CLR modules placed in a managed instance and linked servers or distributed queries that reference a current instance sometimes can't resolve the IP of a local instance. This error is a transient issue.

**Workaround:** Use context connections in a CLR module if possible.

### TDE-encrypted databases with a service-managed key don't support user-initiated backups

You can't execute `BACKUP DATABASE ... WITH COPY_ONLY` on a database that's encrypted with service-managed Transparent Data Encryption (TDE). Service-managed TDE forces backups to be encrypted with an internal TDE key. The key can't be exported, so you can't restore the backup.

**Workaround:** Use automatic backups and point-in-time restore, or use [customer-managed (BYOK) TDE](https://docs.microsoft.com/azure/sql-database/transparent-data-encryption-azure-sql#customer-managed-transparent-data-encryption---bring-your-own-key) instead. You also can disable encryption on the database.

### Point-in-time restore follows time by the time zone set on the source instance

Point-in-time restore currently interprets time to restore to by following time zone of the source instance instead by following UTC.
Check [Managed Instance time zone known issues](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-timezone#known-issues) for more details.

## Next steps

- For more information about managed instances, see [What is a managed instance?](sql-database-managed-instance.md)
- For a features and comparison list, see [Azure SQL Database feature comparison](sql-database-features.md).
- For a quickstart that shows you how to create a new managed instance, see [Create a managed instance](sql-database-managed-instance-get-started.md).
