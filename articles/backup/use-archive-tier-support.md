---
title: Use Archive Tier
description: Learn about using Archive Tier Support for Azure Backup.
ms.topic: conceptual
ms.date: 10/22/2021
ms.custom: devx-track-azurepowershell
---

# Use Archive Tier support


Supported clients:


## Get started with PowerShell

1. Download the [latest](https://github.com/PowerShell/PowerShell/releases) version of PowerShell from GitHub.

1. Run the following command in PowerShell:
  
    ```azurepowershell
    install-module -name Az.RecoveryServices -Repository PSGallery -RequiredVersion 4.4.0 -AllowPrerelease -force
    ```

1. Connect to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.
1. Sign into your subscription:

   `Set-AzContext -Subscription "SubscriptionName"`

1. Get the vault:

    `$vault =  Get-AzRecoveryServicesVault -ResourceGroupName "rgName" -Name "vaultName"`

1. Get the list of backup items:

    - For Azure virtual machines:

        `$BackupItemList = Get-AzRecoveryServicesBackupItem -vaultId $vault.ID -BackupManagementType "AzureVM" -WorkloadType "AzureVM"`

    - For SQL Server in Azure virtual machines:

        `$BackupItemList = Get-AzRecoveryServicesBackupItem -vaultId $vault.ID -BackupManagementType "AzureWorkload" -WorkloadType "MSSQL"`

1. Get the backup item.

    - For Azure virtual machines:

        `$bckItm = $BackupItemList | Where-Object {$_.Name -match '<vmName>'}`

    - For SQL Server in Azure virtual machines:

        `$bckItm = $BackupItemList | Where-Object {$_.FriendlyName -eq '<dbName>' -and $_.ContainerName -match '<vmName>'}`

1. Add the date range for which you want to view the recovery  points. For example, if you want to view the recovery points from the last 124 days to last 95 days, use the following command:

   ```azurepowershell
    $startDate = (Get-Date).AddDays(-124)
    $endDate = (Get-Date).AddDays(-95) 

    ```
    >[!NOTE]
    >To view recovery points for a different time range, modify the start and the end date accordingly.
## Use PowerShell

### Check the archivable status of all the recovery points

You can now check the archivable status of all the recovery points of a backup item using the following cmdlet:

```azurepowershell
$rp = Get-AzRecoveryServicesBackupRecoveryPoint -VaultId $vault.ID -Item $bckItm -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime() 

$rp | select RecoveryPointId, @{ Label="IsArchivable";Expression={$_.RecoveryPointMoveReadinessInfo["ArchivedRP"].IsReadyForMove}}, @{ Label="ArchivableInfo";Expression={$_.RecoveryPointMoveReadinessInfo["ArchivedRP"].AdditionalInfo}}
```

### Check archivable recovery points

```azurepowershell
$rp = Get-AzRecoveryServicesBackupRecoveryPoint -VaultId $vault.ID -Item $bckItm -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime() -IsReadyForMove $true -TargetTier VaultArchive
```

This will list all recovery points associated with a particular backup item that are ready to be moved to archive (from the start date to the end date). You can also modify the start dates and the end dates.

### Check why a recovery point cannot be moved to archive

```azurepowershell
$rp = Get-AzRecoveryServicesBackupRecoveryPoint -VaultId $vault.ID -Item $bckItm -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime() -IsReadyForMove $false -TargetTier VaultArchive
$rp[0].RecoveryPointMoveReadinessInfo["ArchivedRP"]
```

Where `$rp[0]` is the recovery point for which you want to check why it's not archivable.

Sample output:

```output
IsReadyForMove  AdditionalInfo
--------------  --------------
False           Recovery-Point Type is not eligible for archive move as it is already moved to archive tier
```

### Check recommended set of archivable points (only for Azure VMs)

The recovery points associated with a virtual machine are incremental in nature. When a particular recovery point is moved to archive, it's converted into a full backup and then moved to archive. So the cost savings associated with moving to archive depends on the churn of the data source.

So Azure Backup has come up with a recommended set of recovery points that might result in cost savings if moved together.

>[!NOTE]
>The cost savings depends on a variety of reasons and might not be the same for any two instances.

```azurepowershell
$RecommendedRecoveryPointList = Get-AzRecoveryServicesBackupRecommendedArchivableRPGroup -Item $bckItm -VaultId $vault.ID
```

### Move to archive

```azurepowershell
Move-AzRecoveryServicesBackupRecoveryPoint -VaultId $vault.ID -RecoveryPoint $rp[0] -SourceTier VaultStandard -DestinationTier VaultArchive
```

Where, `$rp[0]` is the first recovery point in the list. If you want to move other recovery points, use `$rp[1]`, `$rp[2]`, and so on.

This command moves an archivable recovery point to archive. It returns a job that can be used to track the move operation both from portal and with PowerShell.

### View archived recovery points

This command returns all the archived recovery points.

```azurepowershell
$rp = Get-AzRecoveryServicesBackupRecoveryPoint -VaultId $vault.ID -Item $bckItm -Tier VaultArchive -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime()
```

### Restore with PowerShell

For recovery points in archive, Azure Backup provides an integrated restore methodology.

The integrated restore is a two-step process. The first step involves rehydrating the recovery points stored in archive and temporarily storing it in the vault-standard tier for a duration (also known as the rehydration duration) ranging from a period of 10 to 30 days. The default is 15 days. There are two different priorities of rehydration – Standard and High priority. Learn more about [rehydration priority](../storage/blobs/archive-rehydrate-overview.md#rehydration-priority).

>[!NOTE]
>
>- The rehydration duration once selected can't be changed and the rehydrated recovery points stays in the standard tier for the rehydration duration.
>- The additional step of rehydration incurs cost.

For more information about the various restore methods for Azure virtual machines, see [Restore an Azure VM with PowerShell](backup-azure-vms-automation.md#restore-an-azure-vm).

```azurepowershell
Restore-AzRecoveryServicesBackupItem -VaultLocation $vault.Location -RehydratePriority "Standard" -RehydrateDuration 15 -RecoveryPoint $rp -StorageAccountName "SampleSA" -StorageAccountResourceGroupName "SArgName" -TargetResourceGroupName $vault.ResourceGroupName -VaultId $vault.ID
```

To restore SQL Server, follow [these steps](backup-azure-sql-automation.md#restore-sql-dbs). The `Restore-AzRecoveryServicesBackupItem` command requires two additional parameters, **RehydrationDuration** and **RehydrationPriority**.

### View jobs from PowerShell

To view the move and restore jobs, use the following PowerShell cmdlet:

```azurepowershell
Get-AzRecoveryServicesBackupJob -VaultId $vault.ID
```

### Move recovery points to archive tier at scale

You can now use sample scripts to perform at scale operations. [Learn more](https://github.com/hiaga/Az.RecoveryServices/blob/master/README.md) about how to run the sample scripts. You can download the scripts from [here](https://github.com/hiaga/Az.RecoveryServices).

You can perform the following operations using the sample scripts provided by Azure Backup:

- Move all eligible recovery points for a particular database/all databases for a SQL server in Azure VM to the archive tier.
- Move all recommended recovery points for a particular Azure Virtual Machine to the archive tier.
 
You can also write a script as per your requirements or modify the above sample scripts to fetch the required backup items.


## Use the portal

## 


## View archived recovery points

You can now view all the recovery points that have beenare moved to archive.

:::image type="content" source="./media/use-archive-tier-support/view-recovery-points-list-inline.png" alt-text="Screenshot showing the list of recovery points." lightbox="./media/use-archive-tier-support/view-recovery-points-list-expanded.png":::


## Move archivable recovery points for a particular SQL/SAP HANA database


You can now move all recovery points for a particular SQL/SAP HANA database at one go.

Follow these steps:

1. Select the backup Item (database in SQL Server or SAP HANA in Azure VM) whose recovery points you want to move to the vault-archive tier.

2. Select **click here** to view recovery points that are older than 7 days.

   :::image type="content" source="./media/use-archive-tier-support/view-old-recovery-points-inline.png" alt-text="Screenshot showing the process to view recovery points that are older than 7 days." lightbox="./media/use-archive-tier-support/view-old-recovery-points-expanded.png":::

3. Select _Long term retention points can be moved to archive. Tomove all ‘eligible recovery points’ to archive tier, click here_ to view all eligible archivable points to be moved to archive.

   :::image type="content" source="./media/use-archive-tier-support/view-all-eligible-archivable-points-for-move-inline.png" alt-text="Screenshot showing the process to view all eligible archivable points to be moved to archive." lightbox="./media/use-archive-tier-support/view-all-eligible-archivable-points-for-move-expanded.png":::

   All archivable recovery points appears.


   [Learn more](archive-tier-support.md#supported-workloads) about eligibility criteria.

3. Click **Move Recovery Points to archive** to move all recovery points to the vault-archive tier.

   :::image type="content" source="./media/use-archive-tier-support/move-all-recovery-points-to-vault-inline.png" alt-text="Screenshot showing the option to start the move process of all recovery points to the vault-archive tier." lightbox="./media/use-archive-tier-support/move-all-recovery-points-to-vault-expanded.png":::

   >[!Note]
   >This option moves all the archivable recovery points to vault-archive.

You can monitor the progress in backup jobs.

### Restore

To restore the recovery points that are moved to archive, you need to add the required parameters for rehydration duration and rehydration priority.

:::image type="content" source="./media/use-archive-tier-support/restore-in-portal.png" alt-text="Screenshot showing the process to restore recovery points in the portal.":::

### View jobs

:::image type="content" source="./media/use-archive-tier-support/view-jobs-portal.png" alt-text="Screenshot showing the process to view jobs in the portal.":::

## View Archive Usage in Vault Dashboard

You can also view the archive usage in the vault dashboard.

:::image type="content" source="./media/use-archive-tier-support/view-archive-usage-in-vault-dashboard.png" alt-text="Screenshot showing the archive usage in the vault dashboard.":::

## Next steps

- [Troubleshoot Archive tier errors](troubleshoot-archive-tier.md)
