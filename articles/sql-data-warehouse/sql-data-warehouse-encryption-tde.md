<properties
   pageTitle="Get started with Transparent Data Encryption (TDE) in SQL Data Warehouse| Microsoft Azure"
   description="Get started with Transparent Data Encryption (TDE) in SQL Data Warehouse"
   services="sql-data-warehouse"
   documentationCenter=""
   authors="twounder"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.workload="data-management"
   ms.tgt_pltfrm="na"
   ms.devlang="na"
   ms.topic="article"
   ms.date="03/03/2016" 
   ms.author="mausher;barbkess;sonyama"/>

# Get started with Transparent Data Encryption (TDE) in SQL Data Warehouse
> [AZURE.SELECTOR]
- [Azure Classic Portal](sql-data-warehouse-encryption-tde.md)
- [TSQL](sql-data-warehouse-encryption-tde-tsql.md)

Azure SQL Data Warehouse transparent Data Encryption (TDE) helps protect against the threat of malicious activity by performing real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application.

TDE encrypts the storage of an entire database by using a symmetric key called the database encryption key. In SQL Database the database encryption key is protected by a built-in server certificate. The built-in server certificate is unique for each SQL Database server. Microsoft automatically rotates these certificates at least every 90 days. For a general description of TDE, see [Transparent Data Encryption (TDE)].

##Enabling Encryption

To enable TDE for a SQL Data Warehouse, follow the steps below:

1. Open the database in the [Azure Classic Portal](https://portal.azure.com)
2. In the database blade, click the **Settings** button
3. Select the **Transparent data encryption** option
![][1]
4. Select the **On** setting
![][2]
5. Select **Save**
![][3]  

##Disabling Encryption

To disable TDE for a SQL Data Warehouse, follow the steps below:

1. Open the database in the [Azure Classic Portal](https://portal.azure.com)
2. In the database blade, click the **Settings** button
3. Select the **Transparent data encryption** option
![][1]
4. Select the **Off** setting
![][4]
5. Select **Save**
![][5]  




<!--Anchors-->
[Transparent Data Encryption (TDE)]: https://msdn.microsoft.com/library/bb934049.aspx


<!--Image references-->
[1]: ./media/sql-data-warehouse-security-tde/sql-data-warehouse-security-tde-portal-settings.png
[2]: ./media/sql-data-warehouse-security-tde/sql-data-warehouse-security-tde-portal-settings-on.png
[3]: ./media/sql-data-warehouse-security-tde/sql-data-warehouse-security-tde-portal-settings-save.png
[4]: ./media/sql-data-warehouse-security-tde/sql-data-warehouse-security-tde-portal-settings-off.png
[5]: ./media/sql-data-warehouse-security-tde/sql-data-warehouse-security-tde-portal-settings-save2.png

<!--Link references-->
