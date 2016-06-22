<properties
	pageTitle="Restore an Azure SQL Database from a geo-redundant backup (Azure Portal) | Microsoft Azure"
	description="Geo-Restore an Azure SQL Database from a geo-redundant backup (Azure Portal)."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="06/17/2016"
	ms.author="sstein"
	ms.workload="sqldb-bcdr"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Geo-Restore an Azure SQL Database from a geo-redundant backup using the Azure Portal


> [AZURE.SELECTOR]
- [Overview](sql-database-geo-restore.md)
- [Azure Portal](sql-database-geo-restore-portal.md)
- [PowerShell](sql-database-geo-restore-powershell.md)

This article shows you how to restore your database into a new server using Geo-Restore using the Azure Portal.

## Select the database to restore

To restore a database in the Azure Portal do the following:

1.	Open the [Azure portal](https://portal.azure.com).
2.  On the left side of the screen select **New** > **Data and Storage** > **SQL Database**.
3.  Select **Backup** as the source and then select the geo-redundant backup you want to recover from.

    ![Restore an Azure SQL database](./media/sql-database-geo-restore-portal/geo-restore.png)

4.  Specify a database name, a server you want to restore the database into and then click Create:

## Next steps

- For detailed steps on how to restore an Azure SQL Database using the Azure portal from a geo-redundant backup, see [Geo-Restore using the Azure Portal](sql-database-geo-restore-portal.md)
- For detailed detailed information regarding restoring an Azure SQL Database from a geo-redundant backup, see[Geo-Restore using PowerShell](sql-database-geo-restore.md)
- For a full discussion about how to recover from an outage, see [Recover from an outage](sql-database-disaster-recovery.md)

## Additional resources

- [Business Continuity Scenarios](sql-database-business-continuity-scenarios.md)

