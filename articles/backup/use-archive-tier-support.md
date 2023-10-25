---
title: Use Archive tier
description: Learn about using Archive tier Support for Azure Backup.
ms.topic: conceptual
ms.date: 10/03/2022
ms.custom: devx-track-azurepowershell-azurecli, devx-track-azurecli
zone_pivot_groups: backup-client-portaltier-powershelltier-clitier
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Use Archive tier support

::: zone pivot="client-portaltier"

This article provides the procedure to back up long-term retention points in Archive tier, and snapshots and the Standard tier using Azure portal.

## Supported workloads

| Workloads | Operations |
| --- | --- |
| Microsoft Azure Virtual Machine | View archived recovery points.    <br><br>   Move all recommended recovery points to archive.<br><br> Restore for archived recovery points.   <br><br>  View archive move and restore jobs.  |
| SQL Server in Azure Virtual Machine  <br><br> SAP HANA in Azure Virtual Machines | View archived recovery points.    <br><br>  Move all archivable recovery points to archive.  <br><br>  Restore from archived recovery points.   <br><br>  View archive move and restore jobs. |

## View archived recovery points

You can now view all the recovery points that are moved to archive.

:::image type="content" source="./media/use-archive-tier-support/view-recovery-points-list-inline.png" alt-text="Screenshot showing the list of recovery points." lightbox="./media/use-archive-tier-support/view-recovery-points-list-expanded.png":::

## Enable Smart Tiering to Vault-archive using a backup policy

You can automatically move all eligible/recommended recovery points to Vault-archive by configuring the required settings in the backup policy.

### Enable Smart Tiering for Azure Virtual Machine

To enable Smart Tiering for Azure VM backup policies, follow these steps:

1. In the Azure portal, go to Recovery Services vault -> **Manage** -> **Backup policies**.

1. Select or create a backup policy:

   - **Existing Backup Policy**: Select the backup policy for which you want to enable Smart Tiering.
   - **Create a new Policy**: Create a new backup policy.

1. In **Backup policy**, select **Enable Tiering**.

1. Select one of the following options to move to Vault-archive tier:

   - **Recommended recovery points**: This option moves all recommended recovery points to the vault-archive tier. [Learn more](archive-tier-support.md#archive-recommendations-only-for-azure-virtual-machines) about recommendations.
   - **Eligible recovery points**: This option moves all eligible recovery point after a specific number of days.

   :::image type="content" source="./media/use-archive-tier-support/select-eligible-recovery-points-inline.png" alt-text="Screenshot showing to select the Eligible recovery points option." lightbox="./media/use-archive-tier-support/select-eligible-recovery-points-expanded.png":::

   >[!Note]
   >- The value of *x* can range from *3 months* to *(monthly/yearly retention in months -6)*.
   >- This can increase your overall costs.

Once the policy is configured, all the recommended recovery points are moved to archive tier.

### Enable Smart Tiering for SAP HANA/  SQL Servers in Azure Virtual Machines

To enable Smart Tiering for Azure SAP HANA/SQL servers in Azure VM backup policies, follow these steps:

1. In the Azure portal, go to Recovery Services vault -> **Manage** -> **Backup policies**.

1. Select or create a backup policy: 

   - **Existing Backup Policy**: Select the backup policy for which you want to enable smart Tiering.
   - **Create a new Policy**: Create a new backup policy.

1. In **Backup policy**, select **Move eligible recovery points to Vault-archive**.

   :::image type="content" source="./media/use-archive-tier-support/select-move-eligible-recovery-points-to-vault-archive-inline.png" alt-text="Screenshot showing to select the Move eligible recovery points to Vault-archive option." lightbox="./media/use-archive-tier-support/select-move-eligible-recovery-points-to-vault-archive-expanded.png":::

   Select the number of days after which you want to move your recovery point to archive.

   >[!Note]
   >The number of days would range from *45* to *(retention-180)* days.

Once Smart Tiering is enabled, all the eligible recovery points are moved to the Vault-archive tier.

## Move archivable recovery points

### Move archivable recovery points for a particular SQL/SAP HANA database

You can move all recovery points for a particular SQL/SAP HANA database at one go.

Follow these steps:

1. Select the backup item (database in SQL Server or SAP HANA in Azure VM) whose recovery points you want to move to the Vault-archive tier.

1. Select **click here** to view the list of all eligible achievable recovery points.

   :::image type="content" source="./media/use-archive-tier-support/view-old-recovery-points-inline.png" alt-text="Screenshot showing the process to view recovery points that are older than seven days." lightbox="./media/use-archive-tier-support/view-old-recovery-points-expanded.png":::

1. Select **Move recovery points to archive** to move all recovery points to the Vault-archive tier.

   :::image type="content" source="./media/use-archive-tier-support/move-all-recovery-points-to-vault-inline.png" alt-text="Screenshot showing the option to start the move process of all recovery points to the Vault-archive tier." lightbox="./media/use-archive-tier-support/move-all-recovery-points-to-vault-expanded.png":::

   >[!Note]
   >This option moves all the archivable recovery points to the Vault-archive tier.

You can monitor the progress in backup jobs.

### Move recommended recovery points for a particular Azure Virtual Machine

You can move all recommended recovery points for selected Azure Virtual Machines to the Vault-archive tier. [Learn](archive-tier-support.md#archive-recommendations-only-for-azure-virtual-machines) about recommendation set for Azure Virtual Machine.

Follow these steps:

1. Select the Virtual Machine whose recovery points you want to move to the Vault-archive tier.

1. Select **click here** to view recommended recovery points.

   :::image type="content" source="./media/use-archive-tier-support/view-old-virtual-machine-recovery-points-inline.png" alt-text="Screenshot showing the process to view recovery points for Virtual Machines that are older than seven days." lightbox="./media/use-archive-tier-support/view-old-virtual-machine-recovery-points-expanded.png":::

1. Select **Move recovery points to archive** to move all the recommended recovery points to Archive tier.

   :::image type="content" source="./media/use-archive-tier-support/move-all-virtual-machine-recovery-points-to-vault-inline.png" alt-text="Screenshot showing the option to start the move process of all recovery points for Virtual Machines to the Vault-archive tier." lightbox="./media/use-archive-tier-support/move-all-virtual-machine-recovery-points-to-vault-expanded.png":::

>[!Note]
>To ensure cost savings, you need to move all the recommended recovery points to the Vault-archive tier. To verify, follow steps 1 and 2. If the list of recovery points is empty in step 3, all the recommended recovery points are moved to the Vault-archive tier.
## Restore

To restore the recovery points that are moved to archive, you need to add the required parameters for rehydration duration and rehydration priority.

:::image type="content" source="./media/use-archive-tier-support/restore-in-portal.png" alt-text="Screenshot showing the process to restore recovery points in the portal.":::

## View jobs

:::image type="content" source="./media/use-archive-tier-support/view-jobs-portal.png" alt-text="Screenshot showing the process to view jobs in the portal.":::

## View Archive Usage in Vault Dashboard

You can also view the archive usage in the vault dashboard.

:::image type="content" source="./media/use-archive-tier-support/view-archive-usage-in-vault-dashboard.png" alt-text="Screenshot showing the archive usage in the vault dashboard.":::

## Next steps

- Use Archive tier support via [PowerShell](?pivots=client-powershelltier)/[CLI](?pivots=client-clitier).
- [Troubleshoot Archive tier errors](troubleshoot-archive-tier.md)

::: zone-end


::: zone pivot="client-powershelltier"

This article provides the procedure to back up long-term retention points in Archive tier, and snapshots and the Standard tier using PowerShell.

## Supported workloads

| Workloads | Operations |
| --- | --- |
| Azure Virtual Machines   <br><br>  SQL Server in Azure Virtual Machines   | View archivable recovery points.    <br><br>  View recommended recovery points (only for Virtual Machines).  <br><br>  Move archivable recovery points.   <br><br>  Move recommended recovery points (only for Azure Virtual Machines).   <br><br>  View archived recovery points.   <br><br>  Restore from archived recovery points.  |

## Get started

1. Download the [latest](https://github.com/PowerShell/PowerShell/releases) version of PowerShell from GitHub.

1. Run the following cmdlet in PowerShell:
  
    ```azurepowershell
    install-module -name Az.RecoveryServices -Repository PSGallery -RequiredVersion 4.4.0 -AllowPrerelease -force
    ```

1. Connect to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

1. Sign into your subscription:

   ```azurepowershell
   Set-AzContext -Subscription "SubscriptionName"
   ```

1. Get the vault:

    ```azurepowershell
    $vault = Get-AzRecoveryServicesVault -ResourceGroupName "rgName" -Name "vaultName"
    ```

1. Get the list of backup items:

   - **For Azure Virtual Machines**

       ```azurepowershell
       $BackupItemList = Get-AzRecoveryServicesBackupItem -vaultId $vault.ID -BackupManagementType "AzureVM" -WorkloadType "AzureVM"
       ```

   - **For SQL Server in Azure Virtual Machines**

       ```azurepowershell
       $BackupItemList = Get-AzRecoveryServicesBackupItem -vaultId $vault.ID -BackupManagementType "AzureWorkload" -WorkloadType "MSSQL"
       ```

1. Get the backup item.

   - **For Azure Virtual Machines**

     ```azurepowershell
     $bckItm = $BackupItemList | Where-Object {$_.Name -match '<vmName>'}
     ```

   - **For SQL Server in Azure Virtual Machines**

     ```azurepowershell
     $bckItm = $BackupItemList | Where-Object {$_.FriendlyName -eq '<dbName>' -and $_.ContainerName -match '<vmName>'}
     ```

1. (Optional) Add the date range for which you want to view the recovery points. For example, if you want to view the recovery points from the last 120 days, use the following cmdlet:

   ```azurepowershell
    $startDate = (Get-Date).AddDays(-120)
    $endDate = (Get-Date).AddDays(0) 
   ```
   >[!NOTE]
   >To view recovery points for a different time range, modify the start and the end date accordingly. <br><br> By default, it's taken for the last 30 days.

## Check the archivable status of all recovery points

You can now check the archivable status of all recovery points of a backup item using the following cmdlet:

```azurepowershell
$rp = Get-AzRecoveryServicesBackupRecoveryPoint -VaultId $vault.ID -Item $bckItm -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime() 

$rp | select RecoveryPointId, @{ Label="IsArchivable";Expression={$_.RecoveryPointMoveReadinessInfo["ArchivedRP"].IsReadyForMove}}, @{ Label="ArchivableInfo";Expression={$_.RecoveryPointMoveReadinessInfo["ArchivedRP"].AdditionalInfo}}
```

## Check archivable recovery points

```azurepowershell
$rp = Get-AzRecoveryServicesBackupRecoveryPoint -VaultId $vault.ID -Item $bckItm -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime() -IsReadyForMove $true -TargetTier VaultArchive
```

This cmdlet lists all recovery points associated with a particular backup item that's ready to be moved to archive (from the start date to the end date). You can also modify the start dates and the end dates.

## Check why a recovery point can't be moved to archive

```azurepowershell
$rp = Get-AzRecoveryServicesBackupRecoveryPoint -VaultId $vault.ID -Item $bckItm -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime() -IsReadyForMove $false -TargetTier VaultArchive
$rp[0].RecoveryPointMoveReadinessInfo["ArchivedRP"]
```

Where `$rp[0]` is the recovery point for which you want to check why it's not archivable.

**Sample output**

```output
IsReadyForMove  AdditionalInfo
--------------  --------------
False           Recovery-Point Type is not eligible for archive move as it is already moved to archive tier
```

## Check recommended set of archivable points (only for Azure VMs)

The recovery points associated with a Virtual Machine are incremental. When you move a particular recovery point to archive, it's converted into a full backup, then moved to archive. So, the cost savings associated with moving to archive depends on the churn of the data source.

Therefore, Azure Backup provides a recommended set of recovery points that might save cost, if moved together.

>[!NOTE]
>- The cost savings depends on various reasons and might not be the same for every instance.
>- Cost savings are ensured only when you move all recovery points contained in the recommendation set to the Vault-archive tier.

```azurepowershell
$RecommendedRecoveryPointList = Get-AzRecoveryServicesBackupRecommendedArchivableRPGroup -Item $bckItm -VaultId $vault.ID
```

## Move to archive

```azurepowershell
Move-AzRecoveryServicesBackupRecoveryPoint -VaultId $vault.ID -RecoveryPoint $rp[0] -SourceTier VaultStandard -DestinationTier VaultArchive
```

Here, `$rp[0]` is the first recovery point in the list. If you want to move other recovery points, use `$rp[1]`, `$rp[2]`, and so on.

This cmdlet moves an archivable recovery point to archive. It returns a job that can be used to track the move operation, both from portal and with PowerShell.

## View archived recovery points

This cmdlet returns all archived recovery points.

```azurepowershell
$rp = Get-AzRecoveryServicesBackupRecoveryPoint -VaultId $vault.ID -Item $bckItm -Tier VaultArchive -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime()
```

## Restore with PowerShell

For recovery points in archive, Azure Backup provides an integrated restore methodology.
The integrated restore is a two-step process.

1. Involves rehydrating the recovery points stored in archive.
1. Temporarily store it in the Vault-standard tier for a duration (also known as the rehydration duration) ranging from a period of 10 to 30 days. The default is 15 days. There are two different priorities of rehydration – Standard and High priority. Learn more about [rehydration priority](../storage/blobs/archive-rehydrate-overview.md#rehydration-priority).

>[!NOTE]
>
>- The rehydration duration once selected can't be changed and the rehydrated recovery points stay in the standard tier for the rehydration duration.
>- The additional step of rehydration incurs cost.

For more information about various restore methods for Azure Virtual Machines, see [Restore an Azure VM with PowerShell](backup-azure-vms-automation.md#restore-an-azure-vm).

```azurepowershell
Restore-AzRecoveryServicesBackupItem -VaultLocation $vault.Location -RehydratePriority "Standard" -RehydrateDuration 15 -RecoveryPoint $rp -StorageAccountName "SampleSA" -StorageAccountResourceGroupName "SArgName" -TargetResourceGroupName $vault.ResourceGroupName -VaultId $vault.ID
```

To restore SQL Server, follow [these steps](backup-azure-sql-automation.md#restore-sql-dbs). The `Restore-AzRecoveryServicesBackupItem` cmdlet requires two other parameters, `RehydrationDuration` and `RehydrationPriority`.

## View jobs

To view the move and restore jobs, use the following PowerShell cmdlet:

```azurepowershell
Get-AzRecoveryServicesBackupJob -VaultId $vault.ID
```

## Move recovery points to Archive tier at scale

You can now use sample scripts to perform at scale operations. [Learn more](https://github.com/hiaga/Az.RecoveryServices/blob/master/README.md) about how to run the sample scripts. You can download the scripts from [here](https://github.com/hiaga/Az.RecoveryServices).

You can perform the following operations using the sample scripts provided by Azure Backup:

- Move all eligible recovery points for a particular database/all databases for a SQL server in Azure VM to Archive tier.
- Move all recommended recovery points for a particular Azure Virtual Machine to Archive tier.
 
You can also write a script as per your requirements or modify the above sample scripts to fetch the required backup items.

## Enable Smart Tiering to Vault-archive using a backup policy.

You can automatically move all eligible/ recommended recovery points to vault-archive using a backup policy.

In the following sections, you'll learn how to enable Smart Tiering for eligible recovery points.

### Create a policy

To create and configure a policy, run the following cmdlets:

1. Fetch the vault name:

   ```azurepowershell
   $vault = Get-AzRecoveryServicesVault -ResourceGroupName "testRG"  -Name "TestVault"
   ```

1. Set the policy schedule:

   ```azurepowershell
   $schPol = Get-AzRecoveryServicesBackupSchedulePolicyObject -WorkloadType AzureVM -BackupManagementType AzureVM -PolicySubType Enhanced -ScheduleRunFrequency Weekly
   ```

1. Set long-term retention point retention:

   ```azurepowershell
   $retPol = Get-AzRecoveryServicesBackupRetentionPolicyObject -WorkloadType AzureVM -BackupManagementType AzureVM -ScheduleRunFrequency  Weekly
   ```

### Configure Smart Tiering

You can now configure Smart Tiering to move recovery points to Vault-archive and retain them using the backup policy.

>[!Note]
>After configuration, Smart Tiering is automatically enabled and moves the recovery points to Vault-archive.

#### Tier recommended recovery points for Azure Virtual Machines

To tier all recommended recovery points to Vault-archive, run the following cmdlet:

```azurepowershell
$pol = New-AzRecoveryServicesBackupProtectionPolicy -Name TestPolicy  -WorkloadType AzureVM  -BackupManagementType AzureVM -RetentionPolicy $retPol -SchedulePolicy $schPol -VaultId $vault.ID  -MoveToArchiveTier $true -TieringMode TierRecommended
```

[Learn more](archive-tier-support.md#archive-recommendations-only-for-azure-virtual-machines) about archive recommendations for Azure VMs.

If the policy doesn't match the Vault-archive criteria, the following error appears:

```Output
New-AzRecoveryServicesBackupProtectionPolicy: TierAfterDuration needs to be >= 3 months, at least one of monthly or yearly retention should be >= (TierAfterDuration + 6) months
```
>[!Note]
>*Tier recommended* is supported for Azure Virtual Machines, and not for SQL Server in Azure Virtual Machines.

#### Tier all eligible Azure Virtual Machines backup items

To tier all eligible Azure VM recovery points to Vault-archive, specify the number of months after which you want to move the recovery points, and run the following cmdlet:

```azurepowershell
$pol = New-AzRecoveryServicesBackupProtectionPolicy -Name hiagaVMArchiveTierAfter  -WorkloadType AzureVM  -BackupManagementType AzureVM -RetentionPolicy $retPol -SchedulePolicy $schPol -VaultId $vault.ID  -MoveToArchiveTier $true -TieringMode TierAllEligible -TierAfterDuration 3 -TierAfterDurationType Months
```

>[!Note]
>- The number of months must range from *3* to *(Retention - 6)* months.
>- Enabling Smart Tiering for eligible recovery points can increase your overall costs.


#### Tier all eligible SQL Server in Azure VM backup items

To tier all eligible SQL Server in Azure VM recovery points to Vault-archive, specify the number of days after which you want to move the recovery points and run the following cmdlet:

```azurepowershell
$pol = New-AzRecoveryServicesBackupProtectionPolicy -Name SQLArchivePolicy -WorkloadType MSSQL  -BackupManagementType AzureWorkload -RetentionPolicy $retPol -SchedulePolicy $schPol -VaultId $vault.ID  -MoveToArchiveTier $true -TieringMode TierAllEligible -TierAfterDuration 40 -TierAfterDurationType Days
```

>[!Note]
>The number of days must range from *45* to *(Retention – 180)* days.

If the policy isn't eligible for Vault-archive, the following error appears:

```Output
New-AzRecoveryServicesBackupProtectionPolicy: TierAfterDuration needs to be >= 45 Days, at least one retention policy for full backup (daily / weekly / monthly / yearly) should be >= (TierAfter + 180) days
```
## Modify a policy

To modify an existing policy, run the following cmdlet:

```azurepowershell
$pol = Get-AzRecoveryServicesBackupProtectionPolicy  -VaultId $vault.ID | Where { $_.Name -match "Archive" }
```

## Disable Smart Tiering

To disable Smart Tiering to archive recovery points, run the following cmdlet:

```azurepowershell
Set-AzRecoveryServicesBackupProtectionPolicy -VaultId $vault.ID -Policy $pol[0] -MoveToArchiveTier $false
```

### Enable Smart Tiering

To enable Smart Tiering after you've disable it, run the following cmdlet:

- **Azure Virtual Machine**

   ```azurepowershell
   Set-AzRecoveryServicesBackupProtectionPolicy -VaultId $vault.ID -Policy $pol[0] -MoveToArchiveTier $true -TieringMode TierRecommended
   ```

- **Azure SQL  Server in Azure VMs**

   ```azurepowershell
   Set-AzRecoveryServicesBackupProtectionPolicy -VaultId $vault.ID -Policy $pol[1] -MoveToArchiveTier $true -TieringMode TierAllEligible -TierAfterDuration 45 -TierAfterDurationType Days
   ```

## Next steps

- Use Archive tier support via [Azure portal](?pivots=client-portaltier)/[CLI](?pivots=client-clitier).
- [Troubleshoot Archive tier errors](troubleshoot-archive-tier.md).

::: zone-end



::: zone pivot="client-clitier"

This article provides the procedure to back up long-term retention points in the Archive tier, and snapshots and the Standard tier using command-line interface (CLI).

## Supported workloads

| Workloads | Operations |
| --- | --- |
| Azure Virtual Machines    <br><br>  SQL Server in Azure Virtual Machines   <br><br>   SAP HANA in Azure Virtual Machines |  View archivable recovery points.       <br><br>  View recommended recovery points (only for Virtual Machines).    <br><br>  Move archivable recovery points.    <br><br>  Move recommended recovery points (only for Azure Virtual Machines).    <br><br>  View archived recovery points.    <br><br>  Restore from archived recovery points.  |


## Get started

1. Download/Upgrade Azure CLI version to 2.26.0 or higher.

   1. Follow the [instructions](/cli/azure/install-azure-cli) to install CLI for the first time.
   1. Run `az --upgrade` to upgrade an already installed version.

2. Sign in  using the following command:

   ```azurecli
   az login
   ```

3. Set Subscription Context:

   ```azurecli
   az account set –s <subscriptionId>
   ```
## View archivable recovery points

You can move the archivable recovery points to the Vault-archive tier using the following commands. [Learn more](archive-tier-support.md#supported-workloads) about the eligibility criteria.

- **For Azure Virtual Machines**

  ```azurecli
  az backup recoverypoint list -g {rg} -v {vault} -c {container} -i {item} --backup-management-type {AzureIaasVM} --workload-type {VM}  --target-tier {VaultArchive} --is-ready-for-move {True}
  ```

- For SQL Server in Azure Virtual Machines

  ```azurecli
  az backup recoverypoint list -g {rg} -v {vault} -c {container} -i {item} --backup-management-type {AzureWorkload} --workload-type {MSSQL}  --target-tier {VaultArchive} --is-ready-for-move {True}
  ```

- For SAP HANA in Azure Virtual Machines

  ```azurecli
  az backup recoverypoint list -g {rg} -v {vault} -c {container} -i {item} --backup-management-type {AzureWorkload} --workload-type {SAPHANA}  --target-tier {VaultArchive} --is-ready-for-move {True}
  ```

## Check why a recovery point isn't archivable

Run the following command:

```azurecli
az backup recoverypoint list -g {rg} -v {vault} -c {container} -i {item} --backup-management-type {AzureWorkload / AzureIaasVM} --workload-type {MSSQL / SAPHANA / VM}  --query [].{Name:name,move_ready:properties.recoveryPointMoveReadinessInfo.ArchivedRP.isReadyForMove,additional_details: properties.recoveryPointMoveReadinessInfo.ArchivedRP.additionalInfo
```

You'll get a list of all recovery points, whether they're archivable and the reason if they're not archivable

## Check recommended set of archivable points (only for Azure VMs)

Run the following command:

```azurecli
az backup recoverypoint list -g {rg} -v {vault} -c {container} -i {item} --backup-management-type { AzureIaasVM} --workload-type {VM} --recommended-for-archive
```

[Learn more](archive-tier-support.md#archive-recommendations-only-for-azure-virtual-machines) about recommendation set.

>[!Note]
>- Cost savings depends on various reasons and might not be the same for every instance.
>- You can ensure cost savings only when all the recovery points contained in the recommendation set is moved to the Vault-archive tier.

## Move to archive

You can move archivable recovery points to the Vault-archive tier using the following commands. The name parameter in the command should contain the name of an archivable recovery point.

- **For Azure Virtual Machine**

  ```azurecli
  az backup recoverypoint move -g {rg} -v {vault} -c {container} -i {item} --backup-management-type { AzureIaasVM} --workload-type {VM} --source-tier {VaultStandard} --destination-tier {VaultArchive} --name {rp}
  ```
- **For SQL Server in Azure Virtual Machine**

  ```azurecli
  az backup recoverypoint move -g {rg} -v {vault} -c {container} -i {item} --backup-management-type {AzureWorkload} --workload-type {MSSQL} --source-tier {VaultStandard} --destination-tier {VaultArchive} --name {rp}
  ```
- **For SAP HANA in Azure Virtual Machine**

  ```azurecli
  az backup recoverypoint move -g {rg} -v {vault} -c {container} -i {item} --backup-management-type {AzureWorkload} --workload-type {SAPHANA} --source-tier {VaultStandard} --destination-tier {VaultArchive} --name {rp}
  ```

## View archived recovery points

Use the following commands:

- **For Azure Virtual Machines**

    ```azurecli
    az backup recoverypoint list -g {rg} -v {vault} -c {container} -i {item} --backup-management-type {AzureWorkload } --workload-type {VM} -- tier {VaultArchive}
    ```
- **For SQL Server in Azure Virtual Machines**

    ```azurecli
    az backup recoverypoint list -g {rg} -v {vault} -c {container} -i {item} --backup-management-type {AzureWorkload} --workload-type {MSSQL} -- tier {VaultArchive}
    ```
- **For SAP HANA in Azure Virtual Machines**

    ```azurecli
    az backup recoverypoint list -g {rg} -v {vault} -c {container} -i {item} --backup-management-type {AzureWorkload} --workload-type {SAPHANA} -- tier {VaultArchive}
    ```

## Restore 

Run the following commands:

- **For Azure Virtual Machines**

    ```azurecli
    az backup restore restore-disks -g {rg} -v {vault} -c {container} -i {item} --rp-name {rp} --storage-account {storage_account} --rehydration-priority {Standard / High} --rehydration-duration {rehyd_dur}
    ```

- **For SQL Server in Azure VMs/SAP HANA in Azure VMs**

    ```azurecli
    az backup recoveryconfig show --resource-group saphanaResourceGroup \
        --vault-name saphanaVault \
        --container-name VMAppContainer;Compute;saphanaResourceGroup;saphanaVM \
        --item-name saphanadatabase;hxe;hxe \
        --restore-mode AlternateWorkloadRestore \
        --rp-name 7660777527047692711 \
        --target-item-name restored_database \
        --target-server-name hxehost \
        --target-server-type HANAInstance \
        --workload-type SAPHANA \
        --output json


    az backup restore restore-azurewl -g {rg} -v {vault} --recovery-config {recov_config} --rehydration-priority {Standard / High} --rehydration-duration {rehyd_dur}
    ```

## Next steps

- Use Archive tier support via [Azure portal](?pivots=client-portaltier)/[PowerShell](?pivots=client-powershelltier).
- [Troubleshoot Archive tier errors](troubleshoot-archive-tier.md)

::: zone-end


