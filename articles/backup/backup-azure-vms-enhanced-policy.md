---
title: Back Up Azure VMs with the Enhanced Policy
description: Learn how to configure the Enhanced policy to back up VMs.
ms.topic: how-to
ms.date: 06/11/2025
ms.reviewer: sharrai
ms.service: azure-backup
ms.custom: devx-track-azurecli, devx-track-azurepowershell
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As an Azure administrator, I want to configure an Enhanced backup policy for Azure VMs so that I can use advanced backup features like frequent snapshots and zonal resiliency to ensure better data protection and recovery options.
---
# Back up an Azure VM by using the Enhanced policy

Azure Backup now supports the Enhanced policy for Azure virtual machine (VM) backup that offers:

- Zonal resiliency by using zone-redundant storage for Instant Restore snapshots.
- Multiple backups per days. You can schedule backups as frequently as every 4 hours for Azure VMs.
- Support for new Azure offerings, including Trusted Launch VMs, Premium solid-state drive (SSD) v2 and Ultra SSD disks, and multidisk crash-consistent snapshot support.
- Longer retention in snapshot (operational) tier up to 30 days.

>[!Note]
>- The Standard policy doesn't support protecting newer Azure offerings, such as Ultra SSD and Premium SSD v2. Only the Azure CLI (version 2.73.0 and later), PowerShell (version Az 14.0.0 and later), and the REST API (version 2025-01-01 and later) support Trusted Launch VM backup with the Standard policy.
>- Backups for VMs fail for disks enabled with data access authentication.
>- Protection of a VM with an enhanced policy incurs more snapshot costs. [Learn more about cost impact](backup-instant-restore-capability.md#cost-impact).
>- Backup doesn't allow changing the policy type to Standard after you enable a VM backup with the Enhanced policy.
>- Backup now supports the migration to enhanced policy for the Azure VM backups by using the Standard policy. [Learn more about migrating Azure VM backups from the Standard to the Enhanced policy](backup-azure-vm-migrate-enhanced-policy.md).
>- The Enhanced policy supports excluding shared disks and backing up the other supported disks in the VM.

:::image type="content" source="./media/backup-azure-vms-enhanced-policy/enhanced-backup-policy-settings.png" alt-text="Screenshot that shows the Enhanced backup policy options.":::

The following screenshot shows that multiple backups occurred in a day.

:::image type="content" source="./media/backup-azure-vms-enhanced-policy/multiple-backups-per-day-inline.png" alt-text="Screenshot that shows the multiple backup instances that occurred in a day." lightbox="./media/backup-azure-vms-enhanced-policy/multiple-backups-per-day-expanded.png":::

The preceding screenshot shows that one of the backups was transferred to the **Vault-Standard** tier. This happens when backups transition from the Vault-Archive tier to the Standard tier for restore operations or management tasks. The Vault-Standard tier provides faster access to data compared to the Archive tier, but at a higher storage cost.”

> [!NOTE]
> Backups may move between tiers (for example, from Archive to Vault-Standard) depending on retention policies, restore requirements, or lifecycle rules.

## Create an Enhanced policy and configure the VM backup

### Choose a client

# [Azure portal](#tab/azure-portal)

Follow these steps:

1. In the Azure portal, select a Recovery Services vault to back up the VM.

1. Under **Backup**, select **Backup policies**.

   :::image type="content" source="./media/backup-azure-vms-enhanced-policy/choose-backup-policies-option.png" alt-text="Screenshot that shows choosing the backup policies option.":::

1. Select **+ Add**.

   :::image type="content" source="./media/backup-azure-vms-enhanced-policy/add-backup-policy.png" alt-text="Screenshot that shows adding a backup policy.":::

1. On the **Select policy type** pane, select **Azure Virtual Machine**.

1. On the **Create policy** pane, perform the following actions:

   - **Policy subtype**: Select the **Enhanced** type.
   
     :::image type="content" source="./media/backup-azure-vms-enhanced-policy/select-enhanced-backup-policy-sub-type.png" alt-text="Screenshot that shows selecting the backup policy's subtype as Enhanced.":::
	 
   - **Backup schedule**: You can select the frequency as **Hourly**, **Daily**, or **Weekly**.
	  
     With the backup schedule set to **Hourly**, the default selection for the start time is **8 AM**. The schedule is **Every 4 hours**, and the duration is **24 hours**. Hourly backup has a minimum recovery point objective (RPO) of 4 hours and a maximum of 24 hours. You can set the backup schedule to 4, 6, 8, 12, and 24 hours, respectively.

   - **Instant Restore**: You can set the retention of a recovery snapshot from 1 to 30 days. The default value is set to 7. Instant restore retention duration cannot exceed vault retention duration.
   - **Retention range**: Options for retention range are autoselected based on the backup frequency you choose. The default retention for daily, weekly, monthly, and yearly backup points are set to 180 days, 12 weeks, 60 months, and 10 years, respectively. You can customize these values as required.
   
   :::image type="content" source="./media/backup-azure-vms-enhanced-policy/enhanced-backup-policy-settings.png" alt-text="Screenshot that shows how to configure the Enhanced backup policy.":::

   >[!Note]
   >The maximum limit of the instant recovery point retention range depends on the number of snapshots that you take per day. If the snapshot count is more (for example, a frequency of every 4 hours in a duration of 24 hours, so six scheduled snapshots), then the maximum allowed days for retention reduces.
   >
   >If you choose the lower RPO of 12 hours, the snapshot retention increases to 30 days.  

1. Select **Create**.

# [PowerShell](#tab/powershell)

To create an Enhanced backup policy or update the policy, run the following cmdlets:

### Step 1: Create the backup policy

```azurepowershell
$SchPol = Get-AzRecoveryServicesBackupSchedulePolicyObject -PolicySubType "Enhanced" -WorkloadType "AzureVM" -ScheduleRunFrequency “Hourly”  
```

The parameter `ScheduleRunFrequency:Hourly` is now also an acceptable value for the Azure VM workload.

The output object for this cmdlet contains the following extra fields for the Azure VM workload, if you create an hourly policy:

- `[-ScheduleWindowStartTime <DateTime>]`
- `[-ScheduleRunTimezone <String>]`
- `[-ScheduleInterval <Int>]`
- `[-ScheduleWindowDuration <Int>]`

### Step 2: Set the backup schedule objects

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

- The first command gets a base Enhanced hourly `SchedulePolicyObject` for the `WorkloadType` Azure VM, and then stores it in the `$schedulePolicy` variable.
- The second and third commands fetch the India time zone and update the time zone in `$schedulePolicy`.
- The fourth and fifth commands initialize the schedule window start time and update `$schedulePolicy`.

  >[!Note]
  >The start time must be in UTC even if the time zone isn't UTC.

- The sixth and seventh commands update the interval (in hours) after which the backup is retriggered on the same day. The commands also update the duration (in hours) for which the schedule will run.

### Step 3: Create the backup retention policy

```azurepowershell
Get-AzRecoveryServicesBackupRetentionPolicyObject -WorkloadType AzureVM -ScheduleRunFrequency "Hourly" 
```

- The parameter `ScheduleRunFrequency:Hourly` is also an acceptable value for an Azure VM workload.
- If `ScheduleRunFrequency` is hourly, you don't need to enter a value for `RetentionTimes` to the policy object.

### Step 4: Set the backup retention policy object

```azurepowershell
$RetPol.DailySchedule.DurationCountInDays = 365

```

### Step 5: Save the policy configuration

```azurepowershell
AzRecoveryServicesBackupProtectionPolicy
New-AzRecoveryServicesBackupProtectionPolicy -Name "NewPolicy" -WorkloadType AzureVM -RetentionPolicy $RetPol -SchedulePolicy $SchPol

```

For the Enhanced policy, the allowed values for snapshot retention are from 1 day to 30 days.

>[!Note]
>The specific value depends on the hourly frequency. For example, when the hourly frequency is 4 hours, the maximum retention allowed is 17 days. For 6 hours, the maximum retention is 22 days. Add this specific information here.

### Step 6: Update snapshot retention duration

```azurepowershell
$bkpPol = Get-AzRecoveryServicesBackupProtectionPolicy -Name "NewPolicy"
$bkpPol.SnapshotRetentionInDays=10
Set-AzRecoveryServicesBackupProtectionPolicy -policy $bkpPol -VaultId <VaultId>

```

### List the Enhanced backup policies

To view the existing Enhanced policies, run the following cmdlet:

```azurepowershell
Get-AzRecoveryServicesBackupProtectionPolicy -PolicySubType "Enhanced"

```

For `Get-AzRecoveryServicesBackupProtectionPolicy`:
- Add the parameter `PolicySubType`. The allowed values are `Enhanced` and `Standard`. If you don't specify a value for this parameter, all policies (Standard and Enhanced) get listed.
- The applicable parameter sets are `NoParamSet`, `WorkloadParamSet`, and `WorkloadBackupManagementTypeParamSet`.
- For non-VM workloads, the allowed value is `Standard` only.

>[!Note]
>You can retrieve the subtype of policies. To list Standard backup policies, specify `Standard` as the value of this parameter. To list Enhanced backup policies for Azure VMs, specify `Enhanced` as the value of this parameter.

### Configure backup

To configure backup of a Trusted Launch VM or assign a new policy to the VM, run the following cmdlet:

```azurepowershell
$targetVault = Get-AzRecoveryServicesVault -ResourceGroupName "Contoso-docs-rg" -Name "testvault"
$pol = Get-AzRecoveryServicesBackupProtectionPolicy -Name "NewPolicy" -VaultId $targetVault.ID
Enable-AzRecoveryServicesBackupProtection -Policy $pol -Name "V2VM" -ResourceGroupName "RGName1" -VaultId $targetVault.ID

```

# [CLI](#tab/cli)

To create an Enhanced backup policy, run the following command:

```azurecli
az backup policy create --policy {policy} --resource-group MyResourceGroup --vault-name MyVault --name MyPolicy --backup-management-type AzureIaaSVM -PolicySubType "Enhanced"
Policy is passed in JSON format to the create command.

```

### Update an Enhanced backup policy

To update an Enhanced backup policy, run the following command:

```azurecli
az backup policy set --policy {policy} --resource-group MyResourceGroup --vault-name MyVault  -PolicySubType "Enhanced"

```

### List the Enhanced backup policies

To list all existing Enhanced policies, run the following command:

```azurecli
az backup policy list --resource-group MyResourceGroup --vault-name MyVault --policy-sub-type Enhanced --workload-type VM

```

For the parameter `–policy-sub-type`, the allowed values are `Enhanced` and `Standard`. If you don't specify a value for this parameter, all policies (Standard and Enhanced) get listed.

For non-VM workloads, the only allowed value is `Standard`.

### Configure backup for a VM or assign a new policy to a VM

To configure backup for a VM or assign a new policy to the VM, run the following command:

```azurecli
az backup protection enable-for-vm \
    --resource-group myResourceGroup \
    --vault-name myRecoveryServicesVault \
    --vm $(az vm show -g VMResourceGroup -n MyVm --query id | tr -d '"') \
    --policy-name DefaultPolicy

```

You can back up Trusted Launch VMs only by using Enhanced policies.

 Currently, a non-Trusted Launch VM that used the Standard policy earlier can't start using the Enhanced policy. A VM that uses the Enhanced policy can't be updated to use the Standard policy.

---

>[!Note]
>- Support for the Enhanced policy is available in all Azure public and US Government regions.
>- For hourly backups, the last backup of the day is transferred to a vault. If backup fails, the first backup of the next day is transferred to a vault.
>- Migration to the Enhanced policy for Azure VMs protected with the Standard policy is now supported and available in preview.
>- Backup for an Azure VM with disks that have public network access disabled is now supported and generally available.

## Enable selective disk backup and restore

You can exclude noncritical disks from backup by using selective disk backup to save costs. By using this capability, you can selectively back up a subset of the data disks that are attached to your VM. Then you can restore a subset of the disks that are available in a recovery point, both from Instant Restore and the vault tier. [Learn more about selective disk backup and restore for Azure VMs](selective-disk-backup-restore.md).

## Related content

- [Run a backup immediately](./backup-azure-vms-first-look-arm.md#run-an-on-demand-backup-of-azure-vms)
- [Verify Backup job status](./backup-azure-arm-vms-prepare.md#verify-the-backup-job-status)
- [Restore Azure virtual machines](./backup-azure-arm-restore-vms.md#restore-disks)
- [Troubleshoot VM backup](backup-azure-vms-troubleshoot.md#usererrormigrationfromtrustedlaunchvm-tonontrustedvmnotallowed)
