---
title: Back up Azure VMs with Enhanced policy
description: Learn how to configure Enhanced policy to back up VMs.
ms.topic: how-to
ms.date: 05/15/2023
ms.reviewer: sharrai
ms.service: backup
ms.custom: devx-track-azurecli, devx-track-azurepowershell
author: AbhishekMallick-MS
ms.author: v-abhmallick
---
# Back up an Azure VM using Enhanced policy

This article explains how to use _Enhanced policy_ to configure _Multiple Backups Per Day_ and back up [Trusted Launch VMs](../virtual-machines/trusted-launch.md) with Azure Backup service.

Azure Backup now supports _Enhanced policy_ that's needed to support new Azure offerings. For example, [Trusted Launch VM](../virtual-machines/trusted-launch.md) is supported with _Enhanced policy_ only.

>[!Important]
>- [Default policy](./backup-during-vm-creation.md#create-a-vm-with-backup-configured) will not support protecting newer Azure offerings, such as [Trusted Launch VM](backup-support-matrix-iaas.md#tvm-backup), [Ultra SSD](backup-support-matrix-iaas.md#vm-storage-support), [Premium SSD v2](backup-support-matrix-iaas.md#vm-storage-support), [Shared disk](backup-support-matrix-iaas.md#vm-storage-support), and Confidential Azure VMs.
>- Enhanced policy now supports protecting both Ultra SSD (preview) and Premium SSD v2 (preview). To enroll your subscription for these features, fill these forms - [Ultra SSD protection](https://forms.office.com/r/1GLRnNCntU) and [Premium SSD v2 protection](https://forms.office.com/r/h56TpTc773).
>- Backups for VMs having [data access authentication enabled disks](../virtual-machines/windows/download-vhd.md?tabs=azure-portal#secure-downloads-and-uploads-with-azure-ad) will fail.

You must enable backup of Trusted Launch VM through enhanced policy only. Enhanced policy provides the following features:

- Supports *Multiple Backups Per Day*.
- Instant Restore tier is zonally redundant using Zone-redundant storage (ZRS) resiliency. See the [pricing details for Managed Disk Snapshots](https://azure.microsoft.com/pricing/details/managed-disks/).

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

   - **Policy sub-type**: Select **Enhanced** type. By default, the policy type is set to **Standard**.
   
     :::image type="content" source="./media/backup-azure-vms-enhanced-policy/select-enhanced-backup-policy-sub-type.png" alt-text="Screenshot showing to select backup policies subtype as enhanced.":::
	 
   - **Backup schedule**: You can select frequency as **Hourly**/Daily/Weekly.
	  
     With backup schedule set to **Hourly**, the default selection for start time is **8 AM**, schedule is **Every 4 hours**, and duration is **24 Hours**. Hourly backup has a minimum RPO of 4 hours and a maximum of 24 hours. You can set the backup schedule to 4, 6, 8, 12, and 24 hours respectively.

     Note that Hourly backup frequency is in preview.
   
   - **Instant Restore**: You can set the retention of recovery snapshot from _1_ to _30_ days. The default value is set to _7_.
   - **Retention range**: Options for retention range are auto-selected based on backup frequency you choose. The default retention for daily, weekly, monthly, and yearly backup points are set to 180 days, 12 weeks, 60 months, and 10 years respectively. You can customize these values as required.
   
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
$startTime = Get-Date -Date "2021-12-22T06:10:00.00+00:00"
$SchPol.ScheduleRunStartTime = $startTime
$SchPol.ScheduleInterval = 6
$SchPol.ScheduleWindowDuration = 12
$SchPol.ScheduleRunTimezone = "PST"

```

This sample cmdlet, contains the following parameters:

- `$ScheduleInterval`: Defines the difference (in hours) between two successive backups per day. Currently, the acceptable values are *4*, *6*, *8* and *12*.

- `$ScheduleWindowStartTime`: The time at which the first backup job is triggered, in case of *hourly backups*. The current limits (in policy's timezone) are:
  - `Minimum: 00:00`
  - `Maximum:19:30`

- `$ScheduleRunTimezone`: Specifies the timezone in which backups are scheduled. The default schedule is *UTC*.

- `$ScheduleWindowDuration`: The time span (in hours measured from the Schedule Window Start Time) beyond which backup jobs shouldn't be triggered. The current limits are:
  - `Minimum: 4`
  - `Maximum:23`

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
>- We support Enhanced policy configuration through [Recovery Services vault](./backup-azure-arm-vms-prepare.md) and [VM Manage blade](./backup-during-vm-creation.md#start-a-backup-after-creating-the-vm) only. Configuration through Backup center is currently not supported.
>- For hourly backups, the last backup of the day is transferred to vault. If backup fails, the first backup of the next day is transferred to vault.
>- Enhanced policy is only available to unprotected VMs that are new to Azure Backup. Note that Azure VMs that are protected with existing policy can't be moved to Enhanced policy.
>- Back up an Azure VM with disks that has public network access disabled is not supported.

## Enable selective disk backup and restore (preview)

You can exclude non-critical disks from backup by using selective disk backup to save costs. Using this capability, you can selectively back up a subset of the data disks that are attached to your VM, and then restore a subset of the disks that are available in a recovery point, both from instant restore and vault tier. [Learn more](selective-disk-backup-restore.md).

## Next steps

- [Run a backup immediately](./backup-azure-vms-first-look-arm.md#run-a-backup-immediately)
- [Verify Backup job status](./backup-azure-arm-vms-prepare.md#verify-backup-job-status)
- [Restore Azure virtual machines](./backup-azure-arm-restore-vms.md#restore-disks)
- [Troubleshoot VM backup](backup-azure-vms-troubleshoot.md#usererrormigrationfromtrustedlaunchvm-tonontrustedvmnotallowed)
