---
title: Soft delete for Azure Backup
description: Learn how to use security features in Azure Backup to make backups more secure.
ms.topic: how-to
ms.date: 02/08/2024
ms.custom: devx-track-azurepowershell, engagement-fy24
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Soft delete for Azure Backup

This article describes how to enable and disable the soft delete feature, and permanently delete a data that is in soft-deleted state.

Concerns about security issues, like malware, ransomware, and intrusion, are increasing. These security issues can be costly, in terms of both money and data. To guard against such attacks, Azure Backup now provides security features to help protect backup data even after deletion.

One such feature is soft delete. With soft delete, even if a malicious actor deletes a backup (or backup data is accidentally deleted), the backup data is retained for 14 additional days, allowing the recovery of that backup item with no data loss. The additional 14 days of retention for backup data in the "soft delete" state don't incur any cost to you.

Soft delete protection is available for these services:

- [Soft delete for Azure virtual machines](soft-delete-virtual-machines.md)
- [Soft delete for SQL server in Azure VM and soft delete for SAP HANA in Azure VM workloads](soft-delete-sql-saphana-in-azure-vm.md)

## Lifecycle of a soft-deleted backup item

This flow chart shows the different steps and states of a backup item when Soft Delete is enabled:

:::image type="content" source="./media/backup-azure-security-feature-cloud/lifecycle.png" alt-text="Diagram shows the lifecycle of a soft-deleted backup item." lightbox="./media/backup-azure-security-feature-cloud/lifecycle.png":::

## Enable and disable soft delete

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

### Disable soft delete

You can disable the soft delete feature by using the following supported clients.

**Choose a client**:

# [Azure portal](#tab/azure-portal)

Follow these steps:

1. In the Azure portal, go to your *vault*, and then go to **Settings** > **Properties**.
1. In the **Properties** pane, select **Security Settings Update**.
1. In the **Security and soft delete settings** pane, clear the required checkboxes to disable soft delete.

:::image type="content" source="./media/backup-azure-security-feature-cloud/disable-soft-delete-inline.png" alt-text="Screenshot shows how to disable soft delete." lightbox="./media/backup-azure-security-feature-cloud/disable-soft-delete-expanded.png":::

# [PowerShell](#tab/powershell)

Use the [Set-AzRecoveryServicesVaultBackupProperty](/powershell/module/az.recoveryservices/set-azrecoveryservicesbackupproperty) cmdlet.

```powershell
Set-AzRecoveryServicesVaultProperty -VaultId $myVaultID -SoftDeleteFeatureState Disable


StorageModelType       :
StorageType            :
StorageTypeState       :
EnhancedSecurityState  : Enabled
SoftDeleteFeatureState : Disabled
```

> [!IMPORTANT]
> The Az.RecoveryServices version required to use soft-delete using Azure PowerShell is minimum 2.2.0. Use ```Install-Module -Name Az.RecoveryServices -Force``` to get the latest version.

# [REST API](#tab/rest-api)

To disable the soft-delete functionality using REST API, see [these steps](use-restapi-update-vault-properties.md#update-soft-delete-state-using-rest-api).

---

## Delete soft deleted backup items permanently

The backup data in soft deleted state prior disabling this feature remains in soft-deleted state. To permanently delete these immediately, undelete and delete them again. Use one of the following clients to permanently delete soft deleted data.

**Choose a client**:

# [Azure portal](#tab/azure-portal)

Follow these steps:

1. [Disable soft delete](#enable-and-disable-soft-delete).

2. In the **Azure portal**, go to *your vault* > **Backup Items**, and choose the *soft deleted item*.

   :::image type="content" source="./media/backup-azure-security-feature-cloud/vm-soft-delete.png" alt-text="Screenshot shows how to choose soft deleted item." lightbox="./media/backup-azure-security-feature-cloud/vm-soft-delete.png":::

3. Select **Undelete**.

   :::image type="content" source="./media/backup-azure-security-feature-cloud/choose-undelete.png" alt-text="Screenshot shows how to select Undelete." lightbox="./media/backup-azure-security-feature-cloud/choose-undelete.png":::

4. A window appears. Select **Undelete**.

   :::image type="content" source="./media/backup-azure-security-feature-cloud/undelete-vm.png" alt-text="Screenshot shows selection of Undelete." lightbox="./media/backup-azure-security-feature-cloud/undelete-vm.png":::

5. Choose **Delete backup data** to permanently delete the backup data.

   :::image type="content" source="./media/backup-azure-manage-vms/delete-backup-button.png" alt-text="Screenshot shows how to choose Delete backup data." lightbox="./media/backup-azure-manage-vms/delete-backup-button.png":::

6. Type the *name of the backup item* to confirm deletion of the recovery points.

   :::image type="content" source="./media/backup-azure-manage-vms/delete-backup-data.png" alt-text="Screenshot shows how to enter the name of the backup item." lightbox="./media/backup-azure-manage-vms/delete-backup-data.png":::

7. To delete the backup data for the item, select **Delete**. A notification message lets you know that the backup data has been deleted.

# [PowerShell](#tab/powershell)

Follow these steps:

1. Identify the items that are in soft-deleted state.

   ```powershell
   $vault = Get-AzRecoveryServicesVault -ResourceGroupName "yourResourceGroupName" -Name "yourVaultName"
   Get-AzRecoveryServicesBackupItem -BackupManagementType AzureVM -WorkloadType AzureVM -VaultID $vault.ID | Where-Object {$_.DeleteState -eq "ToBeDeleted"}

   Name                                     ContainerType        ContainerUniqueName                      WorkloadType         ProtectionStatus     HealthStatus         DeleteState
   ----                                     -------------        -------------------                      ------------         ----------------     ------------         -----------
   VM;iaasvmcontainerv2;selfhostrg;AppVM1    AzureVM             iaasvmcontainerv2;selfhostrg;AppVM1       AzureVM              Healthy              Passed               ToBeDeleted

   $myBkpItem = Get-AzRecoveryServicesBackupItem -BackupManagementType AzureVM -WorkloadType AzureVM -VaultId $myVaultID -Name AppVM1
   ```

2. Reverse the deletion operation that was performed when soft-delete was enabled.

   ```powershell
   Undo-AzRecoveryServicesBackupItemDeletion -Item $myBKpItem -VaultId $myVaultID -Force

   WorkloadName     Operation            Status               StartTime                 EndTime                   JobID
   ------------     ---------            ------               ---------                 -------                   -----
   AppVM1           Undelete             Completed            12/5/2019 12:47:28 PM     12/5/2019 12:47:40 PM     65311982-3755-46b5-8e53-c82ea4f0d2a2
   ```
3. As the soft-delete is disabled, the deletion operation immediately removes the backup data.

   ```powershell
   Disable-AzRecoveryServicesBackupProtection -Item $myBkpItem -RemoveRecoveryPoints -VaultId $myVaultID -Force

   WorkloadName     Operation            Status               StartTime                 EndTime                   JobID
   ------------     ---------            ------               ---------                 -------                   -----
   AppVM1           DeleteBackupData     Completed            12/5/2019 12:44:15 PM     12/5/2019 12:44:50 PM     0488c3c2-accc-4a91-a1e0-fba09a67d2fb
   ```

# [REST API](#tab/rest-api)

Follow these steps:

1. [Undo the delete operations](backup-azure-arm-userestapi-backupazurevms.md#undo-the-deletion).
2. [Disable the soft-delete functionality using REST API](use-restapi-update-vault-properties.md#update-soft-delete-state-using-rest-api).
3. [Delete the backups using REST API](backup-azure-arm-userestapi-backupazurevms.md#stop-protection-and-delete-data).

---

## Next steps

- [Overview of security features in Azure Backup](security-overview.md)
- [Frequently asked questions](soft-delete-azure-backup-faq.yml).