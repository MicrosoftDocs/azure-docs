<properties
	pageTitle="Import a BACPAC file to create a new Azure SQL database | Microsoft Azure"
	description="Create a new Azure SQL database by importing an existing BACPAC file."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="07/09/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Import a BACPAC file to create a new Azure SQL database


**Single database**

> [AZURE.SELECTOR]
- [Azure Portal](sql-database-import.md)
- [PowerShell](sql-database-import-powershell.md)
- [SSMS](sql-database-cloud-migrate-compatible-import-bacpac-ssms.md)
- [SqlPackage](sql-database-cloud-migrate-compatible-import-bacpac-sqlpackage.md)

This article provides directions for creating a new Azure SQL database from a BACPAC file using the [Azure portal](https://portal.azure.com).

A BACPAC is a .bacpac file that contains a database schema and data. The database is created from a BACPAC imported from an Azure storage blob container. If you don't have a .bacpac file in Azure storage you can create one by following the steps in [Create and export a BACPAC of an Azure SQL Database](sql-database-export.md).


> [AZURE.NOTE] Azure SQL Database automatically creates and maintains backups for every user database that you can restore. For details, see [Business Continuity Overview](sql-database-business-continuity.md).


To import a SQL database from a .bacpac you need the following:

- An Azure subscription. 
- An Azure SQL Database V12 server. If you do not have a V12 server, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).
- A .bacpac file of the database you want to import in an [Azure Storage account (standard)](../storage/storage-create-storage-account.md) blob container.

***Important*** When importing a BACPAC from Azure blob storage, use standard storage. Importing a BACPAC from 
premium storage is not supported.


## Select the server that will contain the database

Open the SQL Server blade:

1.	Go to the [Azure portal](https://portal.azure.com).
2.	Click **SQL servers**.
3.	Click the server to restore the database into.
4.	In the SQL Server blade click **Import database** to open the **Import database** blade:

    ![import database][1]

1.  Click **Storage** and select your storage account, blob container, and .bacpac file and click **OK**.

    ![configure storage options][2]

1.  Select the pricing tier for the new database and click **Select**. Importing a database directly into an elastic pool is not supported, but you can first import into a single database and then move the database into a pool.

    ![select pricing tier][3]

1.  Enter a **DATABASE NAME** for the database you will be creating from the BACPAC file.
2.  Choose the authentication type and then provide the authentication information for the server. 
3.  Click **Create** to create the database from the BACPAC.

    ![create database][4]

Clicking **Create** submits an import database request to the service. Depending on the size of your database the import operation may take some time to complete.

## Monitor the progress of the import operation

1.	Click **SQL servers**.
2.	Click the server you are restoring to.
3.	In the SQL server blade, in the Operations area, click **Import/Export history**:

    ![import export history][5]
    ![import export history][6]





## Verify the database is live on the server

1.	Click **SQL databases** and verify the new database is **Online**.



## Next steps

- To learn how to connect to and query an imported SQL Database, see [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md)


<!--Image references-->
[1]: ./media/sql-database-import/import-database.png
[2]: ./media/sql-database-import/storage-options.png
[3]: ./media/sql-database-import/pricing-tier.png
[4]: ./media/sql-database-import/create.png
[5]: ./media/sql-database-import/import-history.png
[6]: ./media/sql-database-import/import-status.png
