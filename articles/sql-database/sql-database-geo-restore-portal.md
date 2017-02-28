---
title: 'Azure portal:Restore SQL Database from geo-redundant backup | Microsoft Docs'
description: Restore an Azure SQL Database into a new server from a geo-redundant backup using the Azure portal 
services: sql-database
documentationcenter: ''
author: stevestein
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: business continuity
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: powershell
ms.workload: NA
ms.date: 12/19/2016
ms.author: sstein; carlrab

---
# Restore an Azure SQL Database from a geo-redundant backup with the Azure portal

This article shows you how to restore your database into a new server by using geo-restore with the Azure portal. This task can also be done [using PowerShell](sql-database-geo-restore-powershell.md).

## Restore an Azure SQL Database from a geo-redundant backup by using the Azure portal

To geo-restore a database in the Azure portal, do the following steps:

1. Go to the [Azure portal](https://portal.azure.com).
2. On the left side of the screen select **+New** > **Databases** > **SQL Database**:
   
   ![Restore an Azure SQL database](./media/sql-database-geo-restore-portal/new-sql-database.png)
3. Select **Backup** as the source, and then select the backup you want to restore. Specify a database name, a server you want to restore the database into, and then click **Create**:
   
   ![Restore an Azure SQL database](./media/sql-database-geo-restore-portal/geo-restore.png)

4. Monitor the status of the restore operation by clicking the notification icon in the upper right of the page.


## Next steps
* For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md).
* To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md).
* To learn about using automated backups for recovery, see [Restore a database from the service-initiated backups](sql-database-recovery-using-backups.md).
* To learn about faster recovery options, see [Active-geo-replication](sql-database-geo-replication-overview.md).  
* To learn about using automated backups for archiving, see [Database copy](sql-database-copy.md).

