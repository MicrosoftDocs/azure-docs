---
title: Store Azure SQL Database backups for up to 10 years | Microsoft Docs
description: Learn how Azure SQL Database supports storing full database backups for up to 10 years.
services: sql-database
author: anosov1960
manager: craigg
ms.service: sql-database
ms.custom: business continuity
ms.topic: article
ms.date: 04/04/2018
ms.author: sashan

---
# Store Azure SQL Database backups for up to 10 years

Many applications have regulatory, compliance, or other business purposes that require you to retain database backups beyond the 7-35 days provided by Azure SQL Database [automatic backups](sql-database-automated-backups.md). By using the long-term retention (LTR) feature, you can store specified SQL database full backups in SQL Azure storage for up to 10 years. You can then restore any backup as a new database.

> [!IMPORTANT]
> Long-term retention is currently in preview. Existing backups stored in the Azure Services Recovery Service vault as part of the previous preview of this feature are migrated to SQL Azure storage.<!-- and available in the following regions: Australia East, Australia Southeast, Brazil South, Central US, East Asia, East US, East US 2, India Central, India South, Japan East, Japan West, North Central US, North Europe, South Central US, Southeast Asia, West Europe, and West US.-->
>

## How SQL Database long-term retention works

With long-term backup retention, you can set up a flexible long term retention policy for each SQL database. You specify a flexible policy in the form of (W,M,Y,WeekOfYear) while W represents the retention policy of each weekly full backup (apply to each weekly full backup), M represents the retention policy of each monthly backup (apply to the first full backup of each month), Y represents the retention policy of each yearly backup (apply to the full backup taken in the week determined by WeekOfYear).

Examples:

-  W=0, M=0, Y=5, WeekOfYear=3

   The 3rd full backup of each year will be kept for 5 years.

- W=0, M=3, Y=0

   The first full backup of each month will be kept for 3 months.

- W=12, M=0, Y=0

   Each weekly full backup will be kept for 12 weeks.

- W=6, M=12, Y=10, WeekOfYear=16

   Each weekly full backup will be kept for 6 weeks. Except first full backup of each month, which will be kept for 12 months. Except the full backup taken on 16th week of year, which will be kept for 10 years. 

You can then restore the database from any of these backups to a new database in any server in the subscription. Azure storage creates a copy from existing backups, and the copy has no performance impact on the existing database.


## Next steps

Because database backups protect data from accidental corruption or deletion, they're an essential part of any business continuity and disaster recovery strategy. To learn about the other SQL Database business-continuity solutions, see [Business continuity overview](sql-database-business-continuity.md).
