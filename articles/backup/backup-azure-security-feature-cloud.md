---
title: Soft delete for Azure Backup
description: Learn how to use security features in Azure Backup to make backups more secure.
ms.topic: conceptual
ms.date: 12/30/2022
ms.custom: devx-track-azurepowershell
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Soft delete for Azure Backup

Concerns about security issues, like malware, ransomware, and intrusion, are increasing. These security issues can be costly, in terms of both money and data. To guard against such attacks, Azure Backup now provides security features to help protect backup data even after deletion.

One such feature is soft delete. With soft delete, even if a malicious actor deletes a backup (or backup data is accidentally deleted), the backup data is retained for 14 additional days, allowing the recovery of that backup item with no data loss. The additional 14 days of retention for backup data in the "soft delete" state don't incur any cost to you.

Soft delete protection is available for these services:

- [Soft delete for Azure virtual machines](soft-delete-virtual-machines.md)
- [Soft delete for SQL server in Azure VM and soft delete for SAP HANA in Azure VM workloads](soft-delete-sql-saphana-in-azure-vm.md)

This flow chart shows the different steps and states of a backup item when Soft Delete is enabled:

![Lifecycle of soft-deleted backup item](./media/backup-azure-security-feature-cloud/lifecycle.png)

## Enabling and disabling soft delete

Soft delete is enabled by default on newly created vaults to protect backup data from accidental or malicious deletes.  Disabling this feature isn't recommended. The only circumstance where you should consider disabling soft delete is if you're planning on moving your protected items to a new vault, and can't wait the 14 days required before deleting and reprotecting (such as in a test environment).

To disable soft delete on a vault, you must have the Backup Contributor role for that vault (you should have permissions to perform Microsoft.RecoveryServices/Vaults/backupconfig/write on the vault). If you disable this feature, all future deletions of protected items will result in immediate removal, without the ability to restore. Backup data that exists in soft deleted state before disabling this feature, will remain in soft deleted state for the period of 14 days. If you wish to permanently delete these immediately, then you need to undelete and delete them again to get permanently deleted.

It's important to remember that once soft delete is disabled, the feature is disabled for all the types of workloads. For example, it's not possible to disable soft delete only for SQL server or SAP HANA DBs while keeping it enabled for virtual machines in the same vault. You can create separate vaults for granular control.

>[!Tip]
>To receive alerts/notifications when a user in the organization disables soft-delete for a vault, use [Azure Monitor alerts for Azure Backup](backup-azure-monitoring-built-in-monitor.md#azure-monitor-alerts-for-azure-backup). As the disable of soft-delete is a potential destructive operation, we recommend you to use alert system for this scenario to monitor all such operations and take actions on any unintended operations.

>[!Note]
>- You can also use multi-user authorization (MUA) to add an additional layer of protection against disabling soft delete. [Learn more](multi-user-authorization-concept.md).
>- MUA for soft delete is currently supported for Recovery Services vaults only.

### Always-on soft delete with extended retention

Soft delete is enabled on all newly created vaults by default. **Always-on soft delete** state is an opt-in feature. Once enabled, it can't be disabled (irreversible).

Additionally, you can extend the retention duration for deleted backup data, ranging from 14 to 180 days. By default, the retention duration is set to 14 days (as per basic soft delete) for the vault, and you can extend it as required. The soft delete doesn't cost you for first 14 days of retention; however, you're charged for the period beyond 14 days. [Learn more](backup-azure-enhanced-soft-delete-about.md#pricing) about pricing.

### Disabling soft delete using Azure portal

To disable soft delete, follow these steps:

1. In the Azure portal, go to your *vault*, and then go to **Settings** > **Properties**.
1. In the **Properties** pane, select **Security Settings Update**.
1. In the **Security and soft delete settings** pane, clear the required checkboxes to disable soft delete.

:::image type="content" source="./media/backup-azure-security-feature-cloud/disable-soft-delete-inline.png" alt-text="Screenshot shows how to disable soft delete." lightbox="./media/backup-azure-security-feature-cloud/disable-soft-delete-expanded.png":::

### Disabling soft delete using Azure PowerShell

> [!IMPORTANT]
> The Az.RecoveryServices version required to use soft-delete using Azure PowerShell is minimum 2.2.0. Use ```Install-Module -Name Az.RecoveryServices -Force``` to get the latest version.

To disable, use the [Set-AzRecoveryServicesVaultBackupProperty](/powershell/module/az.recoveryservices/set-azrecoveryservicesbackupproperty) PowerShell cmdlet.

```powershell
Set-AzRecoveryServicesVaultProperty -VaultId $myVaultID -SoftDeleteFeatureState Disable


StorageModelType       :
StorageType            :
StorageTypeState       :
EnhancedSecurityState  : Enabled
SoftDeleteFeatureState : Disabled
```

### Disabling soft delete using REST API

To disable the soft-delete functionality using REST API, refer to the steps mentioned [here](use-restapi-update-vault-properties.md#update-soft-delete-state-using-rest-api).

## Permanently deleting soft deleted backup items

Backup data in soft deleted state prior disabling this feature, will remain in soft deleted state. If you wish to permanently delete these immediately, then undelete and delete them again to get permanently deleted.

### Using Azure portal

Follow these steps:

1. Follow the steps to [disable soft delete](#enabling-and-disabling-soft-delete).

2. In the Azure portal, go to your vault, go to **Backup Items**, and choose the soft deleted item.

   ![Choose soft deleted item](./media/backup-azure-security-feature-cloud/vm-soft-delete.png)

3. Select the option **Undelete**.

   ![Choose Undelete](./media/backup-azure-security-feature-cloud/choose-undelete.png)

4. A window will appear. Select **Undelete**.

   ![Select Undelete](./media/backup-azure-security-feature-cloud/undelete-vm.png)

5. Choose **Delete backup data** to permanently delete the backup data.

   ![Choose Delete backup data](./media/backup-azure-manage-vms/delete-backup-button.png)

6. Type the name of the backup item to confirm that you want to delete the recovery points.

   ![Type the name of the backup item](./media/backup-azure-manage-vms/delete-backup-data.png)

7. To delete the backup data for the item, select **Delete**. A notification message lets you know that the backup data has been deleted.

### Using Azure PowerShell

If items were deleted before soft-delete was disabled, then they'll be in a soft-deleted state. To immediately delete them, the deletion operation needs to reversed and then performed again.

Identify the items that are in soft-deleted state.

```powershell

Get-AzRecoveryServicesBackupItem -BackupManagementType AzureVM -WorkloadType AzureVM -VaultId $myVaultID | Where-Object {$_.DeleteState -eq "ToBeDeleted"}

Name                                     ContainerType        ContainerUniqueName                      WorkloadType         ProtectionStatus     HealthStatus         DeleteState
----                                     -------------        -------------------                      ------------         ----------------     ------------         -----------
VM;iaasvmcontainerv2;selfhostrg;AppVM1    AzureVM             iaasvmcontainerv2;selfhostrg;AppVM1       AzureVM              Healthy              Passed               ToBeDeleted

$myBkpItem = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureVM -WorkloadType AzureVM -VaultId $myVaultID -Name AppVM1
```

Then reverse the deletion operation that was performed when soft-delete was enabled.

```powershell
Undo-AzRecoveryServicesBackupItemDeletion -Item $myBKpItem -VaultId $myVaultID -Force

WorkloadName     Operation            Status               StartTime                 EndTime                   JobID
------------     ---------            ------               ---------                 -------                   -----
AppVM1           Undelete             Completed            12/5/2019 12:47:28 PM     12/5/2019 12:47:40 PM     65311982-3755-46b5-8e53-c82ea4f0d2a2
```

Since the soft-delete is now disabled, the deletion operation will result in immediate removal of backup data.

```powershell
Disable-AzRecoveryServicesBackupProtection -Item $myBkpItem -RemoveRecoveryPoints -VaultId $myVaultID -Force

WorkloadName     Operation            Status               StartTime                 EndTime                   JobID
------------     ---------            ------               ---------                 -------                   -----
AppVM1           DeleteBackupData     Completed            12/5/2019 12:44:15 PM     12/5/2019 12:44:50 PM     0488c3c2-accc-4a91-a1e0-fba09a67d2fb
```

### Using REST API

If items were deleted before soft-delete was disabled, then they'll be in a soft-deleted state. To immediately delete them, the deletion operation needs to reversed and then performed again.

1. First, undo the delete operations with the steps mentioned [here](backup-azure-arm-userestapi-backupazurevms.md#undo-the-deletion).
2. Then disable the soft-delete functionality using REST API using the steps mentioned [here](use-restapi-update-vault-properties.md#update-soft-delete-state-using-rest-api).
3. Then delete the backups using REST API as mentioned [here](backup-azure-arm-userestapi-backupazurevms.md#stop-protection-and-delete-data).

## Frequently asked questions

### Do I need to enable the soft-delete feature on every vault?

No, it's a built-in feature and enabled by default for all the Recovery Services vaults.

### Can I configure the number of days for which my data will be retained in soft-deleted state after the delete operation is complete?

No, it's fixed to 14 days of additional retention after the delete operation.

### Do I need to pay the cost for this additional 14-day retention?

No, this 14-day additional retention comes free of cost as a part of soft-delete functionality.

### Can I perform a restore operation when my data is in soft delete state?

No, you need to undelete the soft deleted resource in order to restore. The undelete operation will bring the resource back into the **Stop protection with retain data state** where you can restore to any point in time. Garbage collector remains paused in this state.

### Will my snapshots follow the same lifecycle as my recovery points in the vault?

Yes.

### How can I trigger the scheduled backups again for a soft-deleted resource?

Undelete followed by a resume operation will protect the resource again. The resume operation associates a backup policy to trigger the scheduled backups with the selected retention period. Also, the garbage collector runs as soon as the resume operation completes. If you wish to perform a restore from a recovery point that's past its expiration date, you're advised to do it before triggering the resume operation.

### Can I delete my vault if there are soft-deleted items in the vault?

The Recovery Services vault can't be deleted if there are backup items in soft-deleted state in the vault. The soft-deleted items are permanently deleted 14 days after the delete operation. If you can't wait for 14 days, then [disable soft delete](#enabling-and-disabling-soft-delete), undelete the soft deleted items, and delete them again to permanently get deleted. After ensuring there are no protected items and no soft deleted items, the vault can be deleted.  

### Can I delete the data earlier than the 14 days soft-delete period after deletion?

No. You can't force-delete the soft-deleted items. They're automatically deleted after 14 days. This security feature is enabled to safeguard the backed-up data from accidental or malicious deletes.  You should wait for 14 days before performing any other action on the item.  Soft-deleted items won't be charged.  If you need to reprotect the items marked for soft-delete within 14 days in a new vault, then contact Microsoft support.

### Can soft delete operations be performed in PowerShell or CLI?

Soft delete operations can be performed using PowerShell. Currently, CLI isn't supported.

## Next steps

- [Overview of security features in Azure Backup](security-overview.md)
