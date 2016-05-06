<properties
   pageTitle="Backup and restore tasks in Azure SQL Data Warehouse (PowerShell) | Microsoft Azure"
   description="Azure portal tasks for restoring a database from an Azure Storage snapshot in Azure SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="elfisher"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/05/2016"
   ms.author="elfish;barbkess;sonyama"/>

# Backup and restore tasks in Azure SQL Data Warehouse (PowerShell)

- [Overview](sql-data-warehouse-overview-manage-backup-and-restore.md)
- [Portal](sql-data-warehouse-manage-backup-and-restore-tasks-portal.md)
- [PowerShell](sql-data-warehouse-manage-backup-and-restore-tasks-powershell.md)
- [REST](sql-data-warehouse-manage-backup-and-restore-tasks-rest-api.md)

Tasks for backing up and restoring a database from an Azure Storage Snapshot. Include restoring a live database, a deleted database, and restoring a database when there is an Azure regional outage.

[AZURE.INCLUDE [SQL Data Warehouse backup retention policy](../../includes/sql-data-warehouse-backup-retention-policy.md)]


Tasks in this topic:

- Restore a live database
- Restore a deleted database
- Restore from a geographical region


## Before you begin

Verify your SQL Database DTU capacity. Since SQL Data Warehouse restores to a new database on your logical SQL server, it is important to make sure the SQL server you are restoring to has enough DTU capacity for the new database. See this blog post for more information on [how to view and increase DTU quota][].

## Restore a live database from snapshot

To restore a database from a snapshot:

1. Log in to the [Azure Portal][].
2. On the left side of the screen select **BROWSE** and then select **SQL Databases**.
3. Navigate to your database and select it.
4. At the top of the database blade, click **Restore**.
5. Specify a new **Database name**, select a **Restore Point** and then click **Create**.
6. The database restore process will begin and can be monitored using **NOTIFICATIONS**.


## Restore a deleted database

To restore a deleted database:

1. Log in to the [Azure Portal][].
2. On the left side of the screen select **BROWSE** and then select **SQL Servers**.
3. Navigate to your server and select it.
4. Scroll down to Operations on your server's blade, click the **Deleted Databases** tile.
5. Select the deleted database you want to restore.
5. Specify a new **Database name** and click **Create**.
6. The database restore process will begin and can be monitored using **NOTIFICATIONS**.


## Restore from an Azure geographical region

To perform a geo-restore:

1. Log in to the [Azure Portal][]
2. On the left side of the screen select **+NEW**, then select **Data and Storage**, and then select **SQL Data Warehouse**
3. Select **BACKUP** as the source and then select the geo-redundant backup you want to recover from
4. Specify the rest of the database properties and click **Create**
5. The database restore process will begin and can be monitored using **NOTIFICATIONS**

## Next steps
To learn about the business continuity features of Azure SQL Database editions, please read the [Azure SQL Database business continuity overview][].

<!--Image references-->

<!--Article references-->
[Azure SQL Database business continuity overview]: sql-database-business-continuity.md
[Finalize a recovered database]: sql-database-recovered-finalize.md
[How to install and configure Azure PowerShell]: powershell-install-configure.md

<!--MSDN references-->

<!--Blog references-->
[how to view and increase DTU quota]: https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests/

<!--Other Web references-->
[Azure Portal]: https://portal.azure.com/

