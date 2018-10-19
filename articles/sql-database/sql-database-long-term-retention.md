---
title: Store Azure SQL Database backups for up to 10 years | Microsoft Docs
description: Learn how Azure SQL Database supports storing full database backups for up to 10 years.
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: carlrab
manager: craigg
ms.date: 07/16/2018
---
# Store Azure SQL Database backups for up to 10 years

Many applications have regulatory, compliance, or other business purposes that require you to retain database backups beyond the 7-35 days provided by Azure SQL Database [automatic backups](sql-database-automated-backups.md). By using the long-term retention (LTR) feature, you can store specified SQL database full backups in [RA-GRS](../storage/common/storage-redundancy-grs.md#read-access-geo-redundant-storage) blob storage for up to 10 years. You can then restore any backup as a new database.

> [!NOTE]
> LTR can be enabled on the databases hosted in Azure SQL Database Logical Servers. It is still not available in Managed Instances.
> 

## How SQL Database long-term retention works

Long-term backup retention leverages the [automatic SQL Database backups](sql-database-automated-backups.md) created takes for point-time restore (PITR). You can configure a long term retention policy for each SQL database and specify how frequently you need to copy the backups to the long-term storage. To enable that flexibility you can define the policy using a combination of four parameters: weekly backup retention (W), monthly backup retention (M), yearly backup retention (Y) and week of year (WeekOfYear). If you specify W, one backup every week will be copied to the long-term storage. If you specify M, one backup during the first week of each month will be copied to the long-term storage. If you specify Y, one backup during the week specified by WeekOfYear will be copied to the long-term storage. Each backup will be kept in the long-term storage for the period specified by these parameters. 

Examples:

-  W=0, M=0, Y=5, WeekOfYear=3

   The 3rd full backup of each year will be kept for 5 years.
- W=0, M=3, Y=0

   The first full backup of each month will be kept for 3 months.

- W=12, M=0, Y=0

   Each weekly full backup will be kept for 12 weeks.

- W=6, M=12, Y=10, WeekOfYear=16

   Each weekly full backup will be kept for 6 weeks. Except first full backup of each month, which will be kept for 12 months. Except the full backup taken on 16th week of year, which will be kept for 10 years. 

The following table illustrates the cadence and expiration of the long-term backups for the following policy:

W=12 weeks (84 days), M=12 months (365 days), Y=10 years (3650 days), WeekOfYear=15 (week after April 15)

   ![ltr example](./media/sql-database-long-term-retention/ltr-example.png)


 
If you were to modify the above policy and set W=0 (no weekly backups), the cadence of backup copies would change as shown in the above table by the highlighted dates. The storage amount needed to keep these backups would reduce accordingly. 

> [!NOTE]
1. The LTR copies are created by Azure storage service so the copy process has no performance impact on the existing database.
2. The policy applies to the future backups. E.g. if the specified WeekOfYear is in the past when the policy is configured, the first LTR backup will be created next year. 
3. To restore a database from the LTR storage, you can select a specific backup based on its timestamp.   The database can be restored to any existing server under the same subscription as the original database. 
> 

## Geo-replication and long-term backup retention

If you are using active geo-replication or failover groups as your business continuity solution you should prepare for eventual failovers and configure the same LTR policy on the geo-secondary database. This will not increase your LTR storage cost as backups are not generated from the secondaries. Only when the secondary becomes primary the backups will be created. This way you will guarantee non-interrupted generation of the LTR backups when the failover is triggered and the primary moves to the secondary region. 

> [!NOTE]
When the original primary database recovers from the outage that cause it to failover, it will become a new secondary. Therefore, the backup creation will not resume and the existing LTR policy will not take effect until it becomes the primary again. 
> 

## Configure long-term backup retention

To learn how to configure long-term retention using the Azure portal or using PowerShell, see [Configure long-term backup retention](sql-database-long-term-backup-retention-configure.md).

## Next steps

Because database backups protect data from accidental corruption or deletion, they're an essential part of any business continuity and disaster recovery strategy. To learn about the other SQL Database business-continuity solutions, see [Business continuity overview](sql-database-business-continuity.md).
