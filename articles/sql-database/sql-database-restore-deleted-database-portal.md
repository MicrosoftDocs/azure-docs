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
	ms.date="06/09/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Restore a deleted Azure SQL database using the Azure Portal

> [AZURE.SELECTOR]
- [Overview](sql-database-restore-deleted-database.md)
- [Azure portal](sql-database-restore-deleted-database-portal.md)
- [PowerShell](sql-database-restore-deleted-database-powershell.md)

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
- [Restore a deleted database](sql-database-restore-deleted-database.md)
- [Restore a deleted database using PowerShell](sql-database-restore-deleted-database-powershell.md)
- [Restore a deleted database using the REST API](https://msdn.microsoft.com/library/azure/mt163685.aspx)
- [SQL Database automated backups](sql-database-automated-backups.md)

## Additional resources

- [Point-in-time restore](sql-database-point-in-time-restore.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active-Geo-Replication](sql-database-geo-replication-overview.md)
- [Designing applications for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)



