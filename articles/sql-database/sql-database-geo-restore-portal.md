<properties
	pageTitle="Restore an Azure SQL Database from a geo-redundant backup (Azure Portal). | Microsoft Azure"
	description="Geo-Restore an Azure SQL Database from a geo-redundant backup (Azure Portal)."
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


# Geo-Restore an Azure SQL Database from a geo-redundant backup using the Azure Portal


> [AZURE.SELECTOR]
- [Overview](sql-database-geo-restore.md)
- [Azure Portal](sql-database-geo-restore-portal.md)
- [PowerShell](sql-database-geo-restore-powershell.md)

This article shows you how to restore your database into a new server using geo-restore using the Azure Portal.

## Select the database to restore

To restore a database in the Azure Portal do the following:

1.	Open the [Azure portal](https://portal.azure.com).
2.  On the left side of the screen select **New** > **Data and Storage** > **SQL Database**.
3.  Select **Backup** as the source and then select the geo-redundant backup you want to recover from.

    ![Restore an Azure SQL database](./media/sql-database-geo-restore-portal/geo-restore.png)

4.  Specify a database name, a server you want to restore the database into and then click Create:

## Next steps

- [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md)
- [Disaster Recovery Drills](sql-database-disaster-recovery-drills.md)


## Additional resources

- [Geo-Restore](sql-database-geo-restore.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)

