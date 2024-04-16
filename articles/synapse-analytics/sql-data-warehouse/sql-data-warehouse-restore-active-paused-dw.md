---
title: Restore an existing dedicated SQL pool (formerly SQL DW)
description: How-to guide for restoring an existing dedicated SQL pool in Azure Synapse Analytics.
author: realAngryAnalytics
ms.author: ajagadish
manager: joannapea
ms.reviewer: joannapea, wiassaf
ms.date: 01/23/2024
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom:
  - devx-track-azurepowershell
---

# Restore an existing dedicated SQL pool (formerly SQL DW)

In this article, you learn how to restore an existing dedicated SQL pool (formerly SQL DW) using Azure portal and PowerShell.

> [!NOTE]
> This guidance is for standalone dedicated SQL pools (formerly SQL DW) only. For dedicated SQL pools in an Azure Synapse Analytics workspace, see [Restore an existing dedicated SQL pool](../backuprestore/restore-sql-pool.md).

## Before you begin

1. **Verify your DTU capacity.** Each pool is hosted by a [logical SQL server](/azure/azure-sql/database/logical-servers) (for example, `myserver.database.windows.net`) which has a default DTU quota. Verify the server has enough remaining DTU quota for the database being restored. To learn how to calculate DTU needed or to request more DTU, see [Request a DTU quota change](sql-data-warehouse-get-started-create-support-ticket.md).

1. Make sure to [install Azure PowerShell](/powershell/azure/?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

   [!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

1. Have an existing restore point that you want to restore from. If you want to create a new restore, see [the tutorial to create a new user-defined restore point](sql-data-warehouse-restore-points.md).

## Restore an existing dedicated SQL pool (formerly SQL DW) through PowerShell

To restore an existing dedicated SQL pool (formerly SQL DW) from a restore point use the [Restore-AzSqlDatabase](/powershell/module/az.sql/restore-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) PowerShell cmdlet.

1. Open PowerShell.

1. Connect to your Azure account and list all the subscriptions associated with your account.

1. Select the subscription that contains the database to be restored.

1. List the restore points for the dedicated SQL pool (formerly SQL DW).

1. Pick the desired restore point using the RestorePointCreationDate.

1. Restore the dedicated SQL pool (formerly SQL DW) to the desired restore point using [Restore-AzSqlDatabase](/powershell/module/az.sql/restore-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) PowerShell cmdlet.

    1. To restore the dedicated SQL pool (formerly SQL DW) to a different server, make sure to specify the other server name.  This server can also be in a different resource group and region.
    1. To restore to a different subscription, see the [below section](#restore-an-existing-dedicated-sql-pool-formerly-sql-dw-to-a-different-subscription-through-powershell).

1. Verify that the restored dedicated SQL pool (formerly SQL DW) is online.

1. After the restore has completed, you can configure your recovered dedicated SQL pool (formerly SQL DW) by following [configure your database after recovery](/azure/azure-sql/database/disaster-recovery-guidance?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json#configure-your-database-after-recovery).
    
    ```powershell
    
    $SubscriptionName="<YourSubscriptionName>"
    $ResourceGroupName="<YourResourceGroupName>"
    $ServerName="<YourServerNameWithoutURLSuffixSeeNote>"  # Without database.windows.net
    #$TargetResourceGroupName="<YourTargetResourceGroupName>" # uncomment to restore to a different server.
    #$TargetServerName="<YourtargetServerNameWithoutURLSuffixSeeNote>"  
    $DatabaseName="<YourDatabaseName>"
    $NewDatabaseName="<YourDatabaseName>"
    
    Connect-AzAccount
    Get-AzSubscription
    Select-AzSubscription -SubscriptionName $SubscriptionName
    
    # Or list all restore points
    Get-AzSqlDatabaseRestorePoint -ResourceGroupName $ResourceGroupName -ServerName $ServerName -DatabaseName $DatabaseName
    
    # Get the specific database to restore
    $Database = Get-AzSqlDatabase -ResourceGroupName $ResourceGroupName -ServerName $ServerName -DatabaseName $DatabaseName
    
    # Pick desired restore point using RestorePointCreationDate "xx/xx/xxxx xx:xx:xx xx"
    $PointInTime="<RestorePointCreationDate>"
    
    # Restore database from a restore point
    $RestoredDatabase = Restore-AzSqlDatabase –FromPointInTimeBackup –PointInTime $PointInTime -ResourceGroupName $Database.ResourceGroupName -ServerName $Database.ServerName -TargetDatabaseName $NewDatabaseName –ResourceId $Database.ResourceID
    
    # Use the following command to restore to a different server
    #$TargetResourceGroupName = $Database.ResourceGroupName # for restoring to different server in same resourcegroup 
    #$RestoredDatabase = Restore-AzSqlDatabase –FromPointInTimeBackup –PointInTime $PointInTime -ResourceGroupName $TargetResourceGroupName -ServerName $TargetServerName -TargetDatabaseName $NewDatabaseName –ResourceId $Database.ResourceID
    
    # Verify the status of restored database
    $RestoredDatabase.status
    ```

## Restore an existing dedicated SQL pool (formerly SQL DW) through the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to the dedicated SQL pool that you want to restore from.
1. At the top of the **Overview** page, select **Restore**.

    :::image type="content" source="./media/sql-data-warehouse-restore-active-paused-dw/restore-button.png" alt-text="Screenshot from the Azure portal, the Overview page navigation bar of a SQL pool, the Restore button is highlighted.":::

1. Select either **Automatic Restore Points** or **User-Defined Restore Points**. If the dedicated SQL pool (formerly SQL DW) doesn't have any automatic restore points, wait a few hours or create a user defined restore point before restoring. For User-Defined Restore Points, select an existing one or create a new one. For **Server**, you can pick a server in a different resource group and region or create a new one. After providing all the parameters, select **Review + Restore**.

    :::image type="content" source="./media/sql-data-warehouse-restore-active-paused-dw/restore-user-defined-restore-points.png" alt-text="Screenshot from the dedicated SQL pool Restore page of the Azure portal. For Restore point type, the radio button for User-defined restore points is selected.":::

## Restore an existing dedicated SQL pool (formerly SQL DW) to a different subscription through PowerShell

This is similar guidance to restoring an existing dedicated SQL pool, however the below instructions show that [Get-AzSqlDatabase](/powershell/module/az.sql/Get-AzSqlDatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) PowerShell cmdlet should be performed in the originating subscription while the [Restore-AzSqlDatabase](/powershell/module/az.sql/restore-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) PowerShell cmdlet should be performed in the destination subscription. The user performing the restore must have proper permissions in both the source and target subscriptions.

1. Open PowerShell.

1. Update Az.Sql Module to 3.8.0 (or greater) if on an older version using `Update-Module`. Otherwise it will cause failures. To validate the version with PowerShell:

   ```powershell
   foreach ($i in (get-module -ListAvailable | ?{$_.name -eq 'az.sql'}).Version) { $version = [string]$i.Major + "." + [string]$i.Minor; if ($version -gt 3.7) {write-host "Az.Sql version $version installed. Prequisite met."} else {update-module az.sql} }
   ```

1. Connect to your Azure account and list all the subscriptions associated with your account.

1. Select the subscription that contains the database to be restored.

1. List the restore points for the dedicated SQL pool (formerly SQL DW).

1. Pick the desired restore point using the RestorePointCreationDate.

1. Select the destination subscription in which the database should be restored.

1. Restore the dedicated SQL pool (formerly SQL DW) to the desired restore point using [Restore-AzSqlDatabase](/powershell/module/az.sql/restore-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) PowerShell cmdlet.

1. Verify that the restored dedicated SQL pool (formerly SQL DW) is online.
    
    ```powershell
    $SourceSubscriptionName="<YourSubscriptionName>"
    $SourceResourceGroupName="<YourResourceGroupName>"
    $SourceServerName="<YourServerNameWithoutURLSuffixSeeNote>"  # Without database.windows.net
    $SourceDatabaseName="<YourDatabaseName>"
    $TargetSubscriptionName="<YourTargetSubscriptionName>"
    $TargetResourceGroupName="<YourTargetResourceGroupName>"
    $TargetServerName="<YourTargetServerNameWithoutURLSuffixSeeNote>"  # Without database.windows.net
    $TargetDatabaseName="<YourDatabaseName>"
    
    # Update Az.Sql module to the latest version (3.8.0 or above)
    # Update-Module -Name Az.Sql -RequiredVersion 3.8.0
    
    Connect-AzAccount
    Get-AzSubscription
    Select-AzSubscription -SubscriptionName $SourceSubscriptionName
    
    # Pick desired restore point using RestorePointCreationDate "xx/xx/xxxx xx:xx:xx xx"
    $PointInTime="<RestorePointCreationDate>"
    # Or list all restore points
    Get-AzSqlDatabaseRestorePoint -ResourceGroupName $SourceResourceGroupName -ServerName $SourceServerName -DatabaseName $SourceDatabaseName
    
    # Get the specific database to restore
    $Database = Get-AzSqlDatabase -ResourceGroupName $SourceResourceGroupName -ServerName $SourceServerName -DatabaseName $SourceDatabaseName
    
    # Switch context to the destination subscription
    Select-AzSubscription -SubscriptionName $TargetSubscriptionName
    
    # Restore database from a desired restore point of the source database to the target server in the desired subscription
    $RestoredDatabase = Restore-AzSqlDatabase –FromPointInTimeBackup –PointInTime $PointInTime -ResourceGroupName $TargetResourceGroupName -ServerName $TargetServerName -TargetDatabaseName $TargetDatabaseName –ResourceId $Database.ResourceID
    
    # Verify the status of restored database
    $RestoredDatabase.status
    ```


## Related content

- [Restore a deleted dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics](sql-data-warehouse-restore-deleted-dw.md)
- [Geo-restore a dedicated SQL pool in Azure Synapse Analytics](sql-data-warehouse-restore-from-geo-backup.md)
