<properties
   pageTitle="Enable Transparent Data Encryption (TDE) for SQL Server Stretch Database on Azure | Microsoft Azure"
   description="Enable Transparent Data Encryption (TDE) for SQL Server Stretch Database on Azure"
   services="sql-server-stretch-database"
   documentationCenter=""
   authors="douglaslMS"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-server-stretch-database"
   ms.workload="data-management"
   ms.tgt_pltfrm="na"
   ms.devlang="na"
   ms.topic="article"
   ms.date="06/14/2016"
   ms.author="douglaslMS"/>

# Enable Transparent Data Encryption (TDE) for Stretch Database on Azure
> [AZURE.SELECTOR]
- [Azure portal](sql-server-stretch-database-encryption-tde.md)
- [TSQL](sql-server-stretch-database-tde-tsql.md)

Transparent Data Encryption (TDE) helps protect against the threat of malicious activity by performing real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application.

TDE encrypts the storage of an entire database by using a symmetric key called the database encryption key. The database encryption key is protected by a built-in server certificate. The built-in server certificate is unique for each Azure server. Microsoft automatically rotates these certificates at least every 90 days. For a general description of TDE, see [Transparent Data Encryption (TDE)].

##Enabling Encryption

To enable TDE for an Azure database that's storing the data migrated from a Stretch-enabled SQL Server database, do the following things:

1. Open the database in the [Azure portal](https://portal.azure.com)
2. In the database blade, click the **Settings** button
3. Select the **Transparent data encryption** option
![][1]
4. Select the **On** setting, and then select **Save**
![][2]


##Disabling Encryption

To disable TDE for an Azure database that's storing the data migrated from a Stretch-enabled SQL Server database, do the following things:

1. Open the database in the [Azure portal](https://portal.azure.com)
2. In the database blade, click the **Settings** button
3. Select the **Transparent data encryption** option
4. Select the **Off** setting, and then select **Save**




<!--Anchors-->
[Transparent Data Encryption (TDE)]: https://msdn.microsoft.com/library/bb934049.aspx


<!--Image references-->
[1]: ./media/sql-server-stretch-database-encryption-tde/stretchtde1.png
[2]: ./media/sql-server-stretch-database-encryption-tde/stretchtde2.png


<!--Link references-->
