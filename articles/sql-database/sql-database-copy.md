<properties
	pageTitle="Copy an Azure SQL database | Microsoft Azure"
	description="Create a copy of an Azure SQL database"
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



# Copy an Azure SQL Database

> [AZURE.SELECTOR]
- [Overview](sql-database-copy.md)
- [Azure Portal](sql-database-copy-portal.md)
- [PowerShell](sql-database-copy-powershell.md)
- [T-SQL](sql-database-copy-transact-sql.md)

You can use the Azure [SQL Database automated backups](sql-database-automated-backups.md) to create a copy of your SQL database. THe copy operation copies the tail of the transaction log and then uses the full, differential, and transaction log backups that are part of the automated backups to create that is transactionally consistent with the source database as of the time of the final transaction log backup. 

You can create the database copy on either the same server or a different server. The service tier and performance level (pricing tier) of the database copy are the same as the source database. After the copy is complete, the copy becomes a fully functional, independent database. The logins, users, and permissions can be managed independently. 

When you copy a database to the same logical server, the same logins can be used on both databases. The security principal you use to copy the database becomes the database owner (DBO) on the new database. All database users, their permissions, and their security identifiers (SIDs) are copied to the database copy. 

When you copy a database to a different logical server, the security principal on the new server becomes the database owner on the new database. Database users that are contained users can be used in the copied database. However, when you copy the database to a new server, users based on logins will generally not work because the logins will not exist on the new server, and if they do their SIDs may not match. After the new database is online on the destination server, use the [ALTER USER](https://msdn.microsoft.com/library/ms176060.aspx) statement to remap the users from the new database to logins on the destination server. To resolve orphaned users, see [Troubleshoot Orphaned Users](https://msdn.microsoft.com/library/ms175475.aspx). 


To copy a SQL database you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- A SQL database to copy. If you do not have a SQL database, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).

## Next steps

- See [Copy an Azure SQL database using the Azure Portal](sql-database-copy-portal.md) to copy a database using the Azure portal.
- See [Copy an Azure SQL database using PowerShell](sql-database-copy-powershell.md) to copy a database using PowerShell.
- See [Copy an Azure SQL database using T-SQL](sql-database-copy-transact-sql.md) to copy a database using Transact-SQL.
- See [How to manage Azure SQL database security after disaster recovery](sql-database-geo-replication-security-config.md) to learn about managing users and logins when copying a database to a different logical server.



## Additional resources

- [Manage logins](sql-database-manage-logins.md)
- [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md)
- [Export the database to a BACPAC](sql-database-export.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)
