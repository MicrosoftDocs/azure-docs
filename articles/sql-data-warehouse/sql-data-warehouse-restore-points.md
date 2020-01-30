---
title: User-defined restore points 
description: How to create a restore point Azure SQL Data Warehouse.
services: sql-data-warehouse
author: anumjs
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: manage
ms.date: 07/03/2019
ms.author: anjangsh
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# User-defined restore points

In this article, you learn to create a new user-defined restore point for Azure SQL Data Warehouse using PowerShell and Azure portal.

## Create user-defined restore points through PowerShell

To create a user-defined restore point, use the [New-AzSqlDatabaseRestorePoint](https://docs.microsoft.com/powershell/module/az.sql/new-azsqldatabaserestorepoint?view=azps-2.4.0) PowerShell cmdlet.

1. Before you begin, make sure to [install Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview).
2. Open PowerShell.
3. Connect to your Azure account and list all the subscriptions associated with your account.
4. Select the subscription that contains the database to be restored.
5. Create a restore point for an immediate copy of your data warehouse.

```Powershell

$SubscriptionName="<YourSubscriptionName>"
$ResourceGroupName="<YourResourceGroupName>"
$ServerName="<YourServerNameWithoutURLSuffixSeeNote>"  # Without database.windows.net
$DatabaseName="<YourDatabaseName>"
$Label = "<YourRestorePointLabel>"

Connect-AzAccount
Get-AzSubscription
Select-AzSubscription -SubscriptionName $SubscriptionName

# Create a restore point of the original database
New-AzSqlDatabaseRestorePoint -ResourceGroupName $ResourceGroupName -ServerName $ServerName -DatabaseName $DatabaseName -RestorePointLabel $Label

```

6. See the list of all the existing restore points.

```Powershell
# List all restore points
Get-AzSqlDatabaseRestorePoints -ResourceGroupName $ResourceGroupName -ServerName $ServerName -DatabaseName $DatabaseName
```

## Create user-defined restore points through the Azure portal

User-defined restore points can also be created through Azure portal.

1. Sign in to your [Azure portal](https://portal.azure.com/) account.

2. Navigate to the SQL Data Warehouse that you want to create a restore point for.

3. Select **Overview** from the left pane, select **+ New Restore Point**. If the New Restore Point button isn't enabled, make sure that the data warehouse isn't paused.

    ![New Restore Point](./media/sql-data-warehouse-restore-points/creating-restore-point-01.png)

4. Specify a name for your user-defined restore point and click **Apply**. User-defined restore points have a default retention period of seven days.

    ![Name of Restore Point](./media/sql-data-warehouse-restore-points/creating-restore-point-11.png)

## Next steps

- [Restore an existing data warehouse](sql-data-warehouse-restore-active-paused-dw.md)
- [Restore a deleted data warehouse](sql-data-warehouse-restore-deleted-dw.md)
- [Restore from a geo-backup data warehouse](sql-data-warehouse-restore-from-geo-backup.md)

