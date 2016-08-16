<properties
   pageTitle="Get started with SQL Data Warehouse Transparent Data Encryption (TDE) TSQL | Microsoft Azure"
   description="Get started with SQL Data Warehouse Transparent Data Encryption (TDE) TSQL"
   services="sql-data-warehouse"
   documentationCenter=""
   authors="ronortloff"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.workload="data-management"
   ms.tgt_pltfrm="na"
   ms.devlang="na"
   ms.topic="article"
   ms.date="06/07/2016"
   ms.author="rortloff;barbkess;sonyama"/>

# Get started with Transparent Data Encryption (TDE)


> [AZURE.SELECTOR]
- [Security Overview](sql-data-warehouse-overview-manage-security.md)
- [Threat detection](sql-data-warehouse-security-threat-detection.md)
- [Encryption (Portal)](sql-data-warehouse-encryption-tde.md)
- [Encryption (T-SQL)](sql-data-warehouse-encryption-tde-tsql.md)
- [Auditing Overview](sql-data-warehouse-auditing-overview.md)
- [Auditing downlevel clients](sql-data-warehouse-auditing-downlevel-clients.md)


Azure SQL Data Warehouse transparent Data Encryption (TDE) helps protect against the threat of malicious activity by performing real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application.

TDE encrypts the storage of an entire database by using a symmetric key called the database encryption key. In SQL Database the database encryption key is protected by a built-in server certificate. The built-in server certificate is unique for each SQL Database server. Microsoft automatically rotates these certificates at least every 90 days. The encryption algorithm used by SQL Data Warehouse is AES-256. For a general description of TDE, see [Transparent Data Encryption (TDE)].

##Enabling Encryption

To enable TDE for a SQL Data Warehouse, follow the steps below:

1. Connect to the *master* database on the server hosting the database using a login that is an administrator or a member of the **dbmanager** role in the master database
2. Execute the following statement to encrypt the database.

```sql
ALTER DATABASE [AdventureWorks] SET ENCRYPTION ON;
```

##Disabling Encryption

To disable TDE for a SQL Data Warehouse, follow the steps below:

1. Connect to the *master* database using a login that is an administrator or a member of the **dbmanager** role in the master database
2. Execute the following statement to encrypt the database.

```sql
ALTER DATABASE [AdventureWorks] SET ENCRYPTION OFF;
```

##Verifying Encryption

To verify encryption status for a SQL Data Warehouse, follow the steps below:

1. Connect to the *master* or instance database using a login that is an administrator or a member of the **dbmanager** role in the master database
2. Execute the following statement to encrypt the database.

```sql
SELECT
	[name],
	[is_encrypted]
FROM
	sys.databases;
```

A result of ```1``` indicates an encrypted database, ```0``` indicates a non-encrypted database.

##Encryption DMVs  

- [sys.databases][] 
- [sys.dm_pdw_nodes_database_encryption_keys][]


<!--Anchors-->
[Transparent Data Encryption (TDE)]: https://msdn.microsoft.com/library/bb934049.aspx
[sys.databases]: http://msdn.microsoft.com/library/ms178534.aspx  
[sys.dm_pdw_nodes_database_encryption_keys]: https://msdn.microsoft.com/library/mt203922.aspx  

<!--Image references-->

<!--Link references-->
