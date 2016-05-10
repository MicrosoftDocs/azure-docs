<properties
	pageTitle="Restore a deleted Azure SQL database (Azure Portal) | Microsoft Azure"
	description="Restore a deleted Azure SQL database (Azure Portal)."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="05/10/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Restore a deleted Azure SQL database using the Azure Portal


> [AZURE.SELECTOR]
- [Azure Portal](sql-database-restore-deleted-database-portal.md)
- [PowerShell](sql-database-restore-deleted-database-powershell.md)

This article shows you how to restore a deleted Azure SQL database.

In the event a database is deleted, Azure SQL Database allows you to restore the deleted database to the point in time of deletion. Azure SQL Database stores the deleted database backup for the retention period of the database.

The retention period of a deleted database is determined by the service tier of the database while it existed or the number of days where the database exists, whichever is less. To learn more about database retention read our [Business Continuity Overview](sql-database-business-continuity.md).

## Select the database to restore 

To restore a database in the Azure Portal do the following:

1.	Open the [Azure Portal](https://portal.azure.com).
2.  On the left side of the screen select **BROWSE** > **SQL servers**.
3.  Navigate to the server with the deleted database you want to restore and select the server
4.  Scroll down to the **operations** section of your server blade and select **Deleted databases**:
	![Restore an Azure SQL database](./media/sql-database-restore-deleted-database-portal/restore-deleted-trashbin.png)
5.  Select the deleted database you want to restore.
6.  Specify a database name, and click Ok:

    ![Restore an Azure SQL database](./media/sql-database-restore-deleted-database-portal/restore-deleted.png)

## Next steps

- [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md)
- [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md)



## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)


