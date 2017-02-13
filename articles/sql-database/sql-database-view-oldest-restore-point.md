---
title: View the oldest restore point from the service-generated backups of an Azure SQL database | Microsoft Docs
description: Quick reference on how to view the oldest restore point from the service-generated backups of a database
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: business continuity
ms.devlang: NA
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA
ms.date: 12/07/2016
ms.author: carlrab

---
# View the oldest restore point from the service-generated backups of an Azure SQL database

In this How To topic, you learn how to view the oldest restore point from service-generated backups of an Azure SQL database.

## View the oldest restore point using the Azure portal

1. Open the **SQL database** blade for your database.

    ![new sample db blade](./media/sql-database-get-started/new-sample-db-blade.png)

2. On the toolbar, click **Restore**.

    ![restore toolbar](./media/sql-database-get-started-backup-recovery/restore-toolbar.png)

3. On the Restore blade, review the oldest restore point.

    ![oldest restore point](./media/sql-database-get-started-backup-recovery/oldest-restore-point.png)

> [!TIP]
> For a tutorial, see [Get Started with Backup and Restore for Data Protection and Recovery](sql-database-get-started-backup-recovery-portal.md)
>

## Next steps

- To learn about service-generated automatic backups, see [automatic backups](: https://azure.microsoft.com/en-us/documentation/articles/)sql-database-automated-backups.MD)
- To learn about long-term backup retention, see [long-term backup retention](sql-database-long-term-retention.md)
- To learn about restoring from backups, see [restore from backup](sql-database-recovery-using-backups.md)