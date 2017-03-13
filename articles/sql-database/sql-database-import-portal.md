---
title: Import a BACPAC file to create an Azure SQL database | Microsoft Docs
description: Create an Azure SQL database by importing an existing BACPAC file.
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: cf9a9631-56aa-4985-a565-1cacc297871d
ms.service: sql-database
ms.custom: migrate and move
ms.devlang: NA
ms.date: 02/07/2017
ms.author: carlrab
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA

---
# Import a BACPAC file to create an Azure SQL database using the Azure portal

This article provides directions for creating an Azure SQL database from a BACPAC file using the [Azure portal](https://portal.azure.com).

## Prerequisites

To import a SQL database from a BACPAC, you need the following:

* An Azure subscription. 
* An Azure SQL Database V12 server. If you do not have a V12 server, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).
* A .bacpac file of the database you want to import in an [Azure Storage account (standard)](../storage/storage-create-storage-account.md) blob container.

> [!IMPORTANT]
> When importing a BACPAC from Azure blob storage, use standard storage. Importing a BACPAC from 
> premium storage is not supported.
> 

## Import the database
Open the SQL Server blade:

1. Go to the [Azure portal](https://portal.azure.com).
2. Click **SQL servers**.
3. Click the server to restore the database into.
4. In the SQL Server blade click **Import database** to open the **Import database** blade:
   
   ![import database][1]
5. Click **Storage** and select your storage account, blob container, and .bacpac file and click **OK**.
   
   ![configure storage options][2]
6. Select the pricing tier for the new database and click **Select**. Importing a database directly into an elastic pool is not supported, but you can first import as a standalone database and then move the database into a pool.
   
   ![select pricing tier][3]
7. Enter a **DATABASE NAME** for the database you are creating from the BACPAC file.
8. Choose the authentication type and then provide the authentication information for the server. 
9. Click **Create** to create the database from the BACPAC.
   
   ![create database][4]

Clicking **Create** submits an import database request to the service. Depending on the size of your database, the import operation may take some time to complete.

## Monitor the progress of the import operation
1. Click **SQL servers**.
2. Click the server you are restoring to.
3. In the SQL server blade, in the Operations area, click **Import/Export history**:
   
   ![import export history][5]
   ![import export history][6]

4. To verify the database is live on the server, click **SQL databases** and verify the new database is **Online**.

## Next steps
* To learn how to connect to and query an imported SQL Database, see [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md).
* For a SQL Server Customer Advisory Team blog about migrating using BACPAC files, see [Migrating from SQL Server to Azure SQL Database using BACPAC Files](https://blogs.msdn.microsoft.com/sqlcat/2016/10/20/migrating-from-sql-server-to-azure-sql-database-using-bacpac-files/).
* For a discussion of the entire SQL Server database migration process, including performance recommendations, see [Migrate a SQL Server database to Azure SQL Database](sql-database-cloud-migrate.md).


<!--Image references-->
[1]: ./media/sql-database-import/import-database.png
[2]: ./media/sql-database-import/storage-options.png
[3]: ./media/sql-database-import/pricing-tier.png
[4]: ./media/sql-database-import/create.png
[5]: ./media/sql-database-import/import-history.png
[6]: ./media/sql-database-import/import-status.png
