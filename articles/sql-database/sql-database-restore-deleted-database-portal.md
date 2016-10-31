<properties
	pageTitle="Restore a deleted Azure SQL database (Azure portal) | Microsoft Azure"
	description="Restore a deleted Azure SQL database (Azure portal)."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="10/12/2016"
	ms.author="sstein"
	ms.workload="NA"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Restore a deleted Azure SQL database using the Azure Portal

> [AZURE.SELECTOR]
- [Overview](sql-database-recovery-using-backups.md)
- [**Restore Deleted DB: Portal**](sql-database-restore-deleted-database-portal.md)
- [Restore Deleted DB: PowerShell](sql-database-restore-deleted-database-powershell.md)

## Select the database to restore 

To restore a deleted database in the Azure portal:

1.	In the [Azure portal](https://portal.azure.com), click **More services** > **SQL servers**.
3.  Select the server that contained the database you want to restore.
4.  Scroll down to the **operations** section of your server blade and select **Deleted databases**:
	![Restore an Azure SQL database](./media/sql-database-restore-deleted-database-portal/restore-deleted-trashbin.png)
5.  Select the database you want to restore.
6.  Specify a database name, and click **OK**:

    ![Restore an Azure SQL database](./media/sql-database-restore-deleted-database-portal/restore-deleted.png)


## Next steps

- For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md)
- To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md)
- To learn about using automated backups for recovery, see [restore a database from the service-initiated backups](sql-database-recovery-using-backups.md)
- To learn about faster recovery options, see [Active-Geo-Replication](sql-database-geo-replication-overview.md)  
- To learn about using automated backups for archiving, see [database copy](sql-database-copy.md)
