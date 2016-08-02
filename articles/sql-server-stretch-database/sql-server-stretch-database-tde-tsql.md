<properties
   pageTitle="Enable Transparent Data Encryption (TDE) for SQL Server Stretch Database on Azure TSQL | Microsoft Azure"
   description="Enable Transparent Data Encryption (TDE) for SQL Server Stretch Database on Azure TSQL"
   services="sql-server-stretch-database"
   documentationCenter=""
   authors="douglaslMS"
   manager=""
   editor=""/>

<tags
   ms.service="sql-server-stretch-database"
   ms.workload="data-management"
   ms.tgt_pltfrm="na"
   ms.devlang="na"
   ms.topic="article"
   ms.date="06/14/2016"
   ms.author="douglaslMS"/>

# Enable Transparent Data Encryption (TDE) for Stretch Database on Azure (Transact-SQL)
> [AZURE.SELECTOR]
- [Azure portal](sql-server-stretch-database-encryption-tde.md)
- [TSQL](sql-server-stretch-database-encryption-tde-tsql.md)

Transparent Data Encryption (TDE) helps protect against the threat of malicious activity by performing real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application.

TDE encrypts the storage of an entire database by using a symmetric key called the database encryption key. The database encryption key is protected by a built-in server certificate. The built-in server certificate is unique for each Azure server. Microsoft automatically rotates these certificates at least every 90 days. For a general description of TDE, see [Transparent Data Encryption (TDE)].

##Enabling Encryption

To enable TDE for an Azure database that's storing the data migrated from a Stretch-enabled SQL Server database, do the following things:

1. Connect to the *master* database on the Azure server hosting the database using a login that is an administrator or a member of the **dbmanager** role in the master database
2. Execute the following statement to encrypt the database.

```sql
ALTER DATABASE [database_name] SET ENCRYPTION ON;
```

##Disabling Encryption

To disable TDE for an Azure database that's storing the data migrated from a Stretch-enabled SQL Server database, do the following things:

1. Connect to the *master* database using a login that is an administrator or a member of the **dbmanager** role in the master database
2. Execute the following statement to encrypt the database.

```sql
ALTER DATABASE [database_name] SET ENCRYPTION OFF;
```

##Verifying Encryption

To verify encryption status for an Azure database that's storing the data migrated from a Stretch-enabled SQL Server database, do the following things:

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


<!--Anchors-->
[Transparent Data Encryption (TDE)]: https://msdn.microsoft.com/library/bb934049.aspx


<!--Image references-->

<!--Link references-->
