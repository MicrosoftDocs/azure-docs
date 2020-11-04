---
title: Restore an existing Synapse SQL pool.
description: How-to guide for restoring an existing SQL pool.
services: synapse-analytics
author: joannapea
manager: igorstan
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: sql
ms.date: 10/29/2020
ms.author: joanpo
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---

# Restore an existing dedicated SQL pool

In this article, you learn how to restore an existing dedicated SQL pool in Azure Synapse Analytics using Powershell, Azure portal and Synapse Studio. This article applies to both restores and geo-restores. 

**Verify your DWU capacity.** Each dedicatd SQL pool has a default DTU quota. Verify the server has enough remaining DTU quota for the database being restored. To learn how to calculate DTU needed or to request more DTU, see [Request a DTU quota change](../sql-data-warehouse/sql-data-warehouse-get-started-create-support-ticket.md).

## Restore an existing dedicated SQL pool through PowerShell

To restore an existing dedicated SQL pool from a restore point use the [Restore-AzSynapseSqlPool](/powershell/module/az.sql/restore-azsynapsesqlpool?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) PowerShell cmdlet.

1. Open PowerShell.

2. Connect to your Azure account and list all the subscriptions associated with your account.

3. Select the subscription that contains the database to be restored.

4. List the restore points for the dedicated SQL pool.

5. Pick the desired restore point using the RestorePointCreationDate.

6. Restore the dedicated SQL pool to the desired restore point using [Restore-AzSynapseSqlPool](/powershell/module/az.sql/restore-azsynapsesqlpool?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) PowerShell cmdlet.

    1. To restore the dedicated SQL pool to a different workspace, make sure to specify the other workspace name.  This server can also be in a different resource group and region.
    2. To restore to a different subscription, use the  'Move' button to move the server to another subscription.

7. Verify that the restored dedicated SQL pool is online.

8. After the restore has completed, you can configure your recovered dedicated SQL pool by following [configure your database after recovery](../../azure-sql/database/disaster-recovery-guidance.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json#configure-your-database-after-recovery).

```Powershell

$SubscriptionName="<YourSubscriptionName>"
$WorkspaceName="<YourWorkspaceName>"
$ResourceGroupName="<YourResourceGroupName>"
$SqlPoolName="<YourSqlPoolNameWithoutURLSuffixSeeNote>"  # Without database.windows.net
#$TargetResourceGroupName="<YourTargetResourceGroupName>" # uncomment to restore to a different server.
#$TargetServerName="<YourtargetServerNameWithoutURLSuffixSeeNote>"  
$DatabaseName="<YourDatabaseName>"
$NewDatabaseName="<YourDatabaseName>"

Connect-AzAccount
Get-AzSubscription
Select-AzSubscription -SubscriptionName $SubscriptionName

# Or list all restore points
Get-AzSynapseSqlPoolRestorePoint -WorkspaceName $WorkspaceName -SqlPoolName $SqlPoolName

# Get the specific database to restore
$Database = Get-AzSqlDatabase -ResourceGroupName $ResourceGroupName -ServerName $ServerName -DatabaseName $DatabaseName

# Pick desired restore point using RestorePointCreationDate "xx/xx/xxxx xx:xx:xx xx"
$PointInTime="<RestorePointCreationDate>"  

# Restore database from a restore point
$RestoredDatabase = Restore-AzSynapseSqlPool –FromPointInTimeBackup –PointInTime $PointInTime -ResourceGroupName $Database.ResourceGroupName -ServerName $Database.ServerName -TargetDatabaseName $NewDatabaseName –ResourceId $Database.ResourceID

# Use the following command to restore to a different server
#$TargetResourceGroupName = $Database.ResourceGroupName # for restoring to different server in same resourcegroup 
#$RestoredDatabase = Restore-AzSynapseSqlPool –FromPointInTimeBackup –PointInTime $PointInTime -ResourceGroupName $TargetResourceGroupName -ServerName $TargetServerName -TargetDatabaseName $NewDatabaseName –ResourceId $Database.ResourceID

# Verify the status of restored database
$RestoredDatabase.status

``` 



## Restore an existing dedicated SQL pool through the Synapse Studio

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Navigate to your Synapse workspace. 
3. Under Getting Started -> Open Synapse Studio, select **Open**.

    ![ Synapse Studio](../media/sql-pools/open-synapse-studio.png)
4. On the left hand navigation pane, select **Data**.
5. Select **Manage pools**. 
6. Select **+ New** to create a new dedicated SQL pool. 
7. In the Additional Settings tab, select a Restore Point to restore from. 

    If you want to perform a geo-restore, select the workspace and dedicated SQL pool that you want to recover. 

8. Select either **Automatic Restore Points** or **User-Defined Restore Points**. 

    ![Restore points](../media/sql-pools/restore-point.PNG)

If the dedicated SQL pool doesn't have any automatic restore points, wait a few hours or create a user defined restore point before restoring. For User-Defined Restore Points, select an existing one or create a new one.

If you are restoring a geo-backup, simply select the workspace located in the source region and the dedicated SQL pool you want to restore. 

9. Select **Review + Create**.

## Restore an existing dedicated SQL pool through the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Navigate to the dedicated SQL pool that you want to restore from.
3. At the top of the Overview blade, select **Restore**.

    ![ Restore Overview](../media/sql-pools/restore-sqlpool-01.png)

4. Select either **Automatic Restore Points** or **User-Defined Restore Points**. 

If the dedicated SQL pool doesn't have any automatic restore points, wait a few hours or create a user-defined restore point before restoring. 

If you want to perform a geo-restore, select the workspace and dedicated SQL pool that you want to recover. 

5. Select **Review + Create**.

## Next Steps

- [Create a restore point](sqlpool-create-restore-point.md)
