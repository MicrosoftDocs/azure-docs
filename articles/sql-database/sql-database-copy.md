<properties
	pageTitle="Copy an Azure SQL database"
	description="Copy an Azure SQL database"
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


# Copy a SQL Database

**Single database**

> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-copy.md)
- [PowerShell](sql-database-copy-powershell.md)

This following steps show you how to copy a SQL database with the [Azure preview portal](https://portal.azure.com).


> [AZURE.NOTE] Azure SQL Database automatically creates and maintains backups for every user database that you can restore. For details, see [Business Continuity Overview](sql-database-business-continuity.md).


The database copy operation copies a SQL database to a new database. The copy is a snapshot backup of your database that you create on either the same server or a different server.

When the copying process completes, the new database is a fully functioning database that is independent of the source database. The new database is transactionally consistent with the source database at the time when the copy completes. The service tier and performance level (pricing tier) of the database copy are the same as the source database. After the copy is complete, the copy becomes a fully functional, independent database. The logins, users, and permissions can be managed independently.


When you copy a database to the same logical server, the same logins can be used on both databases. The security principal you use to copy the database becomes the database owner (DBO) on the new database. All database users, their permissions, and their security identifiers (SIDs) are copied to the database copy.




To copy a SQL database you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- A SQL database to copy. If you do not have a SQL database, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).



## Copy your SQL database

Open the SQL Server blade for the database you want to copy:

1.	Go to the [Azure Preview Portal](https://portal.azure.com).
2.	Go to the database you want to copy: Browse > SQL databases
3.	In the SQL database blade click **Copy** to open the **Copy** blade:

    ![copy database][1]

1.  Enter a name for the database copy. A default name is provided but you can change it if you want to.
2.  Select a **Target server**. The target server is where the database copy will be created. You can create a new server or select an existing server from the list.
3.  Click **OK** to start the copy process.

    ![database name and server][2]




## Monitor the progress of the copy operation

2.	After starting the copy click on the portal notification for details.


    ![notification][3]

 
    ![monitor][4]





## Verify the database is live on the server

- Click **BROWSE** > **SQL databases** and verify the new database is **Online**.



## Next steps

- [Connect with SQL Server Management Studio (SSMS)](sql-database-connect-to-database.md)



## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)


<!--Image references-->
[1]: ./media/sql-database-copy/copy.png
[2]: ./media/sql-database-copy/copy-ok.png
[3]: ./media/sql-database-copy/copy-notification.png
[4]: ./media/sql-database-copy/monitor-copy.png

