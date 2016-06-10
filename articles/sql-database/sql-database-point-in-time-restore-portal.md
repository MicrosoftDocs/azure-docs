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
	ms.date="06/09/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Restore an Azure SQL Database to a previous point in time with the Azure Portal


> [AZURE.SELECTOR]
- [Overview](sql-database-point-in-time-restore.md)
- [Azure portal](sql-database-point-in-time-restore-portal.md)
- [PowerShell](sql-database-point-in-time-restore-powershell.md)

This article shows you how to restore your database to an earlier point in time from [SQL Database automated backups](sql-database-automated-backups.md) using the Azure Portal.

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
- [Point-in-time restore](sql-database-point-in-time-restore.md)
- [Point-in-time restore using the REST API](https://msdn.microsoft.com/library/azure/mt163685.aspx)
- [SQL Database automated backups](sql-database-automated-backups.md)

## Additional resources

- [Restore a deleted database](sql-database-restore-deleted-database.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active-Geo-Replication](sql-database-geo-replication-overview.md)
- [Designing applications for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
