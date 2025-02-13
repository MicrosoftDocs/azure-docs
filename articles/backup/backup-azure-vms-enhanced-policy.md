---
title: Back up Azure VMs with Enhanced policy
description: Learn how to configure Enhanced policy to back up VMs.
ms.topic: how-to
ms.date: 01/10/2025
ms.reviewer: sharrai
ms.service: azure-backup
ms.custom: devx-track-azurecli, devx-track-azurepowershell
author: jyothisuri
ms.author: jsuri
---
# Back up an Azure VM using Enhanced policy

Azure Backup now supports Enhanced policy for Azure VM backup that offers:

- Zonal resiliency using Zone-redundant storage (ZRS) for Instant Restore snapshots.
- Multiple Backups per Days. You can schedule backups as frequently as every 4 hours for Azure VMs.
- Support for new Azure offerings including Trusted Launch virtual machines, Premium SSD v2 and Ultra SSD disks, multi-disk crash consistent snapshot support.
- Longer retention in snapshot (operational) tier up to 30 days.

>[!Note]
>- Standard policy doesn't support protecting newer Azure offerings, such as Ultra SSD and Premium SSD v2.  Backup of trusted launch VM using standard policy is available in preview in [selected regions](backup-support-matrix-iaas.md#tvm-backup). Configuring backup of trusted launch VM using standard policy is supported only using Recovery Services – Backup APIs using API version *2024-09-30-preview*.
>- Backups for VMs with data access authentication enabled disks fails.
>- Protection of a VM with an enhanced policy incurs additional snapshot costs. [Learn more](backup-instant-restore-capability.md#cost-impact).
>- Once you enable a VM backup with Enhanced policy, Azure Backup doesn't allow to change the policy type to Standard.
>- Azure Backup now supports the migration to enhanced policy for the Azure VM backups using standard policy. [Learn more](backup-azure-vm-migrate-enhanced-policy.md).
>- You can exclude shared disk with Enhanced policy and backup the other supported disks in the VM.

:::image type="content" source="./media/backup-azure-vms-enhanced-policy/enhanced-backup-policy-settings.png" alt-text="Screenshot showing the enhanced backup policy options.":::

The following screenshot shows _Multiple Backups_ occurred in a day.

:::image type="content" source="./media/backup-azure-vms-enhanced-policy/multiple-backups-per-day-inline.png" alt-text="Screenshot showing the multiple backup instances occurred in a day." lightbox="./media/backup-azure-vms-enhanced-policy/multiple-backups-per-day-expanded.png":::

>[!Note]
>The above screenshot shows that one of the backups is transferred to Vault-Standard tier.

## Create an Enhanced policy and configure VM backup

**Choose a client**

# [Azure portal](#tab/azure-portal)


Follow these steps:

1. In the Azure portal, select a Recovery Services vault to back up the VM.

2. Under **Backup**, select **Backup Policies**.

   :::image type="content" source="./media/backup-azure-vms-enhanced-policy/choose-backup-policies-option.png" alt-text="Screenshot showing to choose the backup policies option.":::

3. Select **+Add**.

   :::image type="content" source="./media/backup-azure-vms-enhanced-policy/add-backup-policy.png" alt-text="Screenshot showing to add a backup policy.":::

4. On **Select policy type**, select **Azure Virtual Machine**.

5. On **Create policy**, perform the following actions:

   - **Policy sub-type**: Select **Enhanced** type.
   
     :::image type="content" source="./media/backup-azure-vms-enhanced-policy/select-enhanced-backup-policy-sub-type.png" alt-text="Screenshot showing to select backup policies subtype as enhanced.":::
	 
   - **Backup schedule**: You can select frequency as **Hourly**/Daily/Weekly.
	  
     With backup schedule set to **Hourly**, the default selection for start time is **8 AM**, schedule is **Every 4 hours**, and duration is **24 Hours**. Hourly backup has a minimum RPO of 4 hours and a maximum of 24 hours. You can set the backup schedule to 4, 6, 8, 12, and 24 hours respectively.

   
   - **Instant Restore**: You can set the retention of recovery snapshot from _1_ to _30_ days. The default value is set to _7_.
   - **Retention range**: Options for retention range are autoselected based on backup frequency you choose. The default retention for daily, weekly, monthly, and yearly backup points are set to 180 days, 12 weeks, 60 months, and 10 years respectively. You can customize these values as required.
   
   :::image type="content" source="./media/backup-azure-vms-enhanced-policy/enhanced-backup-policy-settings.png" alt-text="Screenshot showing to configure the enhanced backup policy.":::

   >[!Note]
   >The maximum limit of instant recovery point retention range depends on the number of snapshots you take per day. If the snapshot count is more (for example, every *4 hours* frequency in *24 hours* duration - *6* scheduled snapshots), then the maximum allowed days for retention reduces.
   >
   >However, if you choose lower RPO of *12 hours*, the snapshot retention is increased to *30 days*.  

6. Select **Create**.


# [PowerShell](#tab/powershell)

To create an enhanced backup policy or update the policy, run the following cmdlets:

**Step 1: Create the backup policy**

```azurepowershell
$SchPol = Get-AzRecoveryServicesBackupSchedulePolicyObject -PolicySubType "Enhanced" -WorkloadType "AzureVM" -ScheduleRunFrequency “Hourly”  
```

The parameter `ScheduleRunFrequency:Hourly` now also be an acceptable value for Azure VM workload.

Also, the output object for this cmdlet contains the following additional fields for Azure VM workload, if you're creating hourly policy.

- `[-ScheduleWindowStartTime <DateTime>]`
- `[-ScheduleRunTimezone <String>]`
- `[-ScheduleInterval <Int>]`
- `[-ScheduleWindowDuration <Int>]`

**Step 2: Set the backup schedule objects**

```azurepowershell
$schedulePolicy = Get-AzRecoveryServicesBackupSchedulePolicyObject -WorkloadType AzureVM -BackupManagementType AzureVM -PolicySubType Enhanced -ScheduleRunFrequency Hourly
$timeZone = Get-TimeZone -ListAvailable | Where-Object { $_.Id -match "India" }
$schedulePolicy.ScheduleRunTimeZone = $timeZone.Id
$windowStartTime = (Get-Date -Date "2022-04-14T08:00:00.00+00:00").ToUniversalTime()
$schPol.HourlySchedule.WindowStartTime = $windowStartTime
$schedulePolicy.HourlySchedule.ScheduleInterval = 4
$schedulePolicy.HourlySchedule.ScheduleWindowDuration = 23

```

In this sample cmdlet:

- The first command gets a base enhanced hourly SchedulePolicyObject for WorkloadType AzureVM, and then stores it in the $schedulePolicy variable.
- The second and third command fetches the India timezone and updates the timezone in the $schedulePolicy.
- The fourth and fifth command initializes the schedule window start time and updates the $schedulePolicy. 

  >[Note]
  >The start time must be in UTC even if the timezone is not UTC.

- The sixth and seventh command updates the interval (in hours) after which the backup will be retriggered on the same day, duration (in hours) for which the schedule will run.

**Step 3: Create the backup retention policy**

```azurepowershell
Get-AzRecoveryServicesBackupRetentionPolicyObject -WorkloadType AzureVM -ScheduleRunFrequency "Hourly" 
```

- The parameter `ScheduleRunFrequency:Hourly` is also an acceptable value for Azure VM workload.
- If `ScheduleRunFrequency` is hourly, you don't need to enter a value for `RetentionTimes` to the policy object.

**Step 4: Set the backup retention policy object**

```azurepowershell
$RetPol.DailySchedule.DurationCountInDays = 365

```

**Step 5: Save the policy configuration**

```azurepowershell
AzRecoveryServicesBackupProtectionPolicy
New-AzRecoveryServicesBackupProtectionPolicy -Name "NewPolicy" -WorkloadType AzureVM -RetentionPolicy $RetPol -SchedulePolicy $SchPol

```

For Enhanced policy, the allowed values for snapshot retention are from *1* day to *30* days.

>[!Note]
>The specific value depends on the hourly frequency. For example, when hourly frequency is *4 hours*, the maximum retention allowed is *17 days*, for 6 hours it is 22 days. Let's add this specific information here.



**Step 6: Update snapshot retention duration**

```azurepowershell
$bkpPol = Get-AzRecoveryServicesBackupProtectionPolicy -Name "NewPolicy"
$bkpPol.SnapshotRetentionInDays=10
Set-AzRecoveryServicesBackupProtectionPolicy -policy $bkpPol -VaultId <VaultId>

```
### List enhanced backup policies

To view the existing enhanced policies, run the following cmdlet:

```azurepowershell
Get-AzRecoveryServicesBackupProtectionPolicy -PolicySubType "Enhanced"

```


For `Get-AzRecoveryServicesBackupProtectionPolicy`:
- Add the parameter `PolicySubType`. The allowed values are `Enhanced` and `Standard`. If you don't specify a value for this parameter, all policies (standard and enhanced) get listed.
- The applicable parameter sets are `NoParamSet`, `WorkloadParamSet`, `WorkloadBackupManagementTypeParamSet`.
- For non-VM workloads, allowed value is `Standard` only.

>[!Note]
>You can retrieve the sub type of policies. To list Standard backup policies, specify `Standard` as the value of this parameter. To list Enhanced backup policies for Azure VMs, specify `Enhanced` as the value of this parameter.





### Configure backup

To configure backup of a Trusted launch VM or assign a new policy to the VM, run the following cmdlet:

```azurepowershell
$targetVault = Get-AzRecoveryServicesVault -ResourceGroupName "Contoso-docs-rg" -Name "testvault"
$pol = Get-AzRecoveryServicesBackupProtectionPolicy -Name "NewPolicy" -VaultId $targetVault.ID
Enable-AzRecoveryServicesBackupProtection -Policy $pol -Name "V2VM" -ResourceGroupName "RGName1" -VaultId $targetVault.ID

```




# [CLI](#tab/cli)

To create an enhanced backup policy, run the following command:

```azurecli
az backup policy create --policy {policy} --resource-group MyResourceGroup --vault-name MyVault --name MyPolicy --backup-management-type AzureIaaSVM -PolicySubType "Enhanced"
Policy is passed in JSON format to the create command.

```

### Update an enhanced backup policy

To update an enhanced backup policy, run the following command: 

```azurecli
az backup policy set --policy {policy} --resource-group MyResourceGroup --vault-name MyVault  -PolicySubType "Enhanced"

```

### List enhanced backup policies

To list all existing enhanced policies, run the following command:

```azurecli
az backup policy list --resource-group MyResourceGroup --vault-name MyVault --policy-sub-type Enhanced --workload-type VM

```

For parameter `–policy-sub-type`, the allowed values are `Enhanced` and `Standard`. If you don't specify a value for this parameter, all policies (standard and enhanced) get listed.

For non-VM workloads, the only allowed value is `Standard`


### Configure backup for a VM or assign a new policy to a VM

To configure backup for a VM or assign a new policy to the VM, run the following command:

```azurecli
az backup protection enable-for-vm \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --vm $(az vm show -g VMResourceGroup -n MyVm --query id | tr -d '"') \
    --policy-name DefaultPolicy

```

Trusted Launch VMs can only be backed up using Enhanced policies.

>[!Note]
>- Currently, a non-Trusted Launch VM that was earlier using Standard policy can't start using Enhanced policy.
>- A VM that is using Enhanced policy can't be updated to use Standard policy.



---

>[!Note]
>- The support for Enhanced policy is available in all Azure Public and US Government regions.
>- For hourly backups, the last backup of the day is transferred to vault. If backup fails, the first backup of the next day is transferred to vault.
>- Migration to enhanced policy for Azure VMs protected with standard policy is now supported and available in preview.
>- Backup an Azure VM with disks that have public network access disabled is now supported and generally available.

## Enable selective disk backup and restore

You can exclude noncritical disks from backup by using selective disk backup to save costs. Using this capability, you can selectively back up a subset of the data disks that are attached to your VM, and then restore a subset of the disks that are available in a recovery point, both from instant restore and vault tier. [Learn more](selective-disk-backup-restore.md).

## Next steps

- [Run a backup immediately](./backup-azure-vms-first-look-arm.md#run-a-backup-immediately)
- [Verify Backup job status](./backup-azure-arm-vms-prepare.md#verify-backup-job-status)
- [Restore Azure virtual machines](./backup-azure-arm-restore-vms.md#restore-disks)
- [Troubleshoot VM backup](backup-azure-vms-troubleshoot.md#usererrormigrationfromtrustedlaunchvm-tonontrustedvmnotallowed)
