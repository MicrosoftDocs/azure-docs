<properties
	pageTitle="Import a BACPAC to an Azure SQL Database"
	description="Import a BACPAC to an Azure SQL Database"
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="09/05/2015"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Import a BACPAC to a SQL Database

**Single database**

> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-import.md)
- [PowerShell](sql-database-import-powershell.md)

This article shows you how to create a SQL Database by importing a BACPAC with the [Azure preview portal](https://portal.azure.com).

A BACPAC is a .bacpac file that contains a database schema and data. For details, see Backup Package (.bacpac) in [Data-tier Applications](https://msdn.microsoft.com/library/ee210546.aspx).

The database is created from a BACPAC imported from an Azure storage blob container. If you don't have a .bacpac file in Azure storage you can create one by following the steps in [Create and export a BACPAC of an Azure SQL Database](sql-database-backup.md).


> [AZURE.NOTE] Azure SQL Database automatically creates and maintains backups for every user database that you can restore. For details, see [Business Continuity Overview](sql-database-business-continuity.md).


To import a SQL database from a .bacpac you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- An Azure SQL Database V12 server. If you do not have a V12 server, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).
- A .bacpac file of the database you want to import in an [Azure Storage account (classic)](storage-create-storage-account.md) blob container.


## Select the server that will contain the database

Open the SQL Server blade for the database you want to import:

1.	Go to the [Azure Preview Portal](https//:portal.azure.com).
2.	Click **BROWSE ALL**.
3.	Click **SQL servers**.
2.	Click the server to restore the database into.
3.	In the SQL Server blade click **Import database** to open the **Import database** blade:

    ![import database][1]

1.  Click **Storage** and select your storage account, blob container, and .bacpac file and click **OK**.

    ![configure storage options][2]

1.  Select the pricing tier for the new database and click **Select**.

    ![select pricing tier][3]

1.  Enter a **DATABASE NAME**.
2.  Enter the **Server admin login** and **Password** for the Azure SQL server you are importing the database to.
1.  Click **Create** to create the database from the BACPAC.

    ![create database][4]

Clicking **Create** submits an import database request to the service. Depending on the size of your database the import operation may take some time to complete.

## Monitor the progress of the import operation

2.	Click **BROWSE ALL**.
3.	Click **SQL servers**.
2.	Click the server you are restoring to.
3.	In the SQL server blade click **Import/Export history**:

    ![import export history][5]
    ![import export history][6]





## Verify the database is live on the server

2.	Click **BROWSE ALL**.
3.	Click **SQL databases** and verify the new database is **Online**.



## Next steps

- [Connect with SQL Server Management Studio (SSMS)](sql-database-connect-to-database.md)



## Additional resources

- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)


<!--Image references-->
[1]: ./media/sql-database-import/import-database.png
[2]: ./media/sql-database-import/storage-options.png
[3]: ./media/sql-database-import/pricing-tier.png
[4]: ./media/sql-database-import/create.png
[5]: ./media/sql-database-import/import-history.png
[6]: ./media/sql-database-import/import-status.png
