<properties 
    pageTitle="Copy an Azure SQL database using Transact-SQL | Microsoft Azure" 
    description="Create copy of an Azure SQL database using Transact-SQL" 
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="06/16/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Copy an Azure SQL database using Transact-SQL


> [AZURE.SELECTOR]
- [Overview](sql-database-copy.md)
- [Azure Portal](sql-database-copy-portal.md)
- [PowerShell](sql-database-copy-powershell.md)
- [T-SQL](sql-database-copy-transact-sql.md)


This following steps show you how to copy a SQL database with Transact-SQL to the same server or a different server. The database copy operation uses the [CREATE DATABASE](https://msdn.microsoft.com/library/ms176061.aspx) statement.

To complete the steps in this article you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- An Azure SQL Database. If you do not have a SQL database, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).
- [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/ms174173.aspx). If you don't have SSMS, or if features described in this article are not available, [download the latest version](https://msdn.microsoft.com/library/mt238290.aspx).


## Copy your SQL database

Log on to the master database using the server-level principal login or the login that created the database you want to copy. Logins that are not the server-level principal must be members of the dbmanager role in order to copy databases. For more information about logins and connecting to the server, see [Manage logins](sql-database-manage-logins.md).

Start copying the source database with the [CREATE DATABASE](https://msdn.microsoft.com/library/ms176061.aspx) statement. Executing this statement initiates the database copying process. Because copying a database is an asynchronous process, the CREATE DATABASE statement returns before the database completes copying.


### Copy a SQL database to the same server

Log on to the master database using the server-level principal login or the login that created the database you want to copy. Logins that are not the server-level principal must be members of the dbmanager role in order to copy databases.

This command copies Database1 on to a new database named Database2 on the same server. Depending on the size of your database the copy operation may take some time to complete.

    -- Execute on the master database.
    -- Start copying.
    CREATE DATABASE Database1_copy AS COPY OF Database1;

### Copy a SQL database to a different server

Log on to the master database of the destination server, the Azure SQL Database server where the new database is to be created. Use a login that has the same name and password as the database owner (DBO) of the source database on the source Azure SQL Database server. The login on the destination server must also be a member of the dbmanager role or be the server-level principal login.

This command copies Database1 on server1- to a new database named Database2 on server2. Depending on the size of your database the copy operation may take some time to complete.


    -- Execute on the master database of the target server (server2)
    -- Start copying from Server1 to Server2
    CREATE DATABASE Database1_copy AS COPY OF server1.Database1;
    

## Monitor the progress of the copy operation

Monitor the copying process by querying the sys.databases and sys.dm_database_copies views. While the copying is in progress, the state_desc column of the sys.databases view for the new database is set to COPYING.


- If the copying fails, the state_desc column of the sys.databases view for the new database is set to SUSPECT. In this case, execute the DROP statement on the new database and try again later.
- If the copying succeeds, the state_desc column of the sys.databases view for the new database is set to ONLINE. In this case, the copying is complete and the new database is a regular database, able to be changed independent of the source database.

> [AZURE.NOTE] - If you decide to cancel the copying while it is in progress, execute the [DROP DATABASE](https://msdn.microsoft.com/library/ms178613.aspx) statement on the new database. Alternatively, executing the DROP DATABASE statement on the source database also cancels the copying process.


## Resolve logins after the copy operation completes

After the new database is online on the destination server, use the [ALTER USER](https://msdn.microsoft.com/library/ms176060.aspx) statement to remap the users from the new database to logins on the destination server. To resolve orphaned users, see [Troubleshoot Orphaned Users](https://msdn.microsoft.com/library/ms175475.aspx). See also [How to manage Azure SQL database security after disaster recovery](sql-database-geo-replication-security-config.md).

All users in the new database maintain the permissions that they had in the source database. The user who initiated the database copy becomes the database owner of the new database and is assigned a new security identifier (SID). After the copying succeeds and before other users are remapped, only the login that initiated the copying, the database owner (DBO), can log on to the new database.


## Next steps

- See [Copy an Azure SQL database](sql-database-copy.md) for an overview of copying an Azure SQL Database.
- See [Copy an Azure SQL database using the Azure Portal](sql-database-copy-portal.md) to copy a database using the Azure portal.
- See [Copy an Azure SQL database using PowerShell](sql-database-copy-powershell.md) to copy a database using PowerShell.
- See [How to manage Azure SQL database security after disaster recovery](sql-database-geo-replication-security-config.md) to learn about managing users and logins when copying a database to a different logical server.



## Additional resources

- [Manage logins](sql-database-manage-logins.md)
- [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md)
- [Export the database to a BACPAC](sql-database-export.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)


