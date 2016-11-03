---
title: Restore a deleted Azure SQL database (Azure portal) | Microsoft Docs
description: Restore a deleted Azure SQL database (Azure portal).
services: sql-database
documentationcenter: ''
author: stevestein
manager: jhubbard
editor: ''

ms.assetid: 33b0c9e6-1cd2-4fd9-9b0d-70ecf6e54821
ms.service: sql-database
ms.devlang: NA
ms.date: 10/12/2016
ms.author: sstein
ms.workload: NA
ms.topic: article
ms.tgt_pltfrm: NA

---
# Restore a deleted Azure SQL database using the Azure Portal
> [!div class="op_single_selector"]
> * [Overview](sql-database-recovery-using-backups.md)
> * [**Restore Deleted DB: Portal**](sql-database-restore-deleted-database-portal.md)
> * [Restore Deleted DB: PowerShell](sql-database-restore-deleted-database-powershell.md)
> 
> 

## Select the database to restore
To restore a deleted database in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), click **More services** > **SQL servers**.
2. Select the server that contained the database you want to restore.
3. Scroll down to the **operations** section of your server blade and select **Deleted databases**:
   ![Restore an Azure SQL database](./media/sql-database-restore-deleted-database-portal/restore-deleted-trashbin.png)
4. Select the database you want to restore.
5. Specify a database name, and click **OK**:
   
   ![Restore an Azure SQL database](./media/sql-database-restore-deleted-database-portal/restore-deleted.png)

## Next steps
* For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md)
* To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md)
* To learn about using automated backups for recovery, see [restore a database from the service-initiated backups](sql-database-recovery-using-backups.md)
* To learn about faster recovery options, see [Active-Geo-Replication](sql-database-geo-replication-overview.md)  
* To learn about using automated backups for archiving, see [database copy](sql-database-copy.md)

