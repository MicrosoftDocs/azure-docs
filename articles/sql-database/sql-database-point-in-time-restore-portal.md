<properties
	pageTitle="Restore an Azure SQL Database to a previous point in time (Azure Portal) | Microsoft Azure"
	description="Restore an Azure SQL Database to a previous point in time."
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


# Restore an Azure SQL Database to a previous point in time with the Azure Portal


> [AZURE.SELECTOR]
- [Azure Portal](sql-database-point-in-time-restore-portal.md)
- [PowerShell](sql-database-point-in-time-restore-powershell.md)

This article shows you how to restore your database to an earlier point in time using the Azure Portal.

[**Point-in-Time Restore**](sql-database-point-in-time-restore.md) is a self-service capability, allowing you to restore a database from the automatic backups we take for all databases to any point within your database's retention period. To learn more about automatic backups and database retention periods, see [Business Continuity Overview](sql-database-business-continuity.md).

## Select a database to restore to a previous point in time

To restore a database in the Azure Portal do the following:

1.	Open the [Azure Portal](https://portal.azure.com).
2.  On the left side of the screen select **BROWSE** > **SQL databases**.
3.  Navigate to the database you want to restore and select it.
4.  At the top of your database's blade, select **Restore**:

    ![Restore an Azure SQL database](./media/sql-database-point-in-time-restore-portal/restore.png)

5.  Specify a database name, point in time and then click Ok:

    ![Restore an Azure SQL database](./media/sql-database-point-in-time-restore-portal/restore-details.png)


## Next steps

- [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md)
- [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md)



## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)


