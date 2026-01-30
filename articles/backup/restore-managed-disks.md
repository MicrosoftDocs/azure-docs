---
title: Restore Azure Managed Disks
description: Learn how to restore Azure Managed Disks from the Azure portal.
ms.topic: how-to
ms.date: 01/30/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a cloud administrator, I want to restore Azure Managed Disks using recovery points, so that I can recover lost or corrupted data while maintaining the integrity of the original disk.
---

# Restore Azure Managed Disks

This article describes how to restore [Azure Managed Disks](/azure/virtual-machines/managed-disks-overview) from a restore point created by Azure Backup. You can also restore Managed Disk using [Azure PowerShell](restore-managed-disks-ps.md), [Azure CLI](restore-managed-disks-cli.md), [REST API](backup-azure-dataprotection-use-rest-api-restore-disks.md).

Backup Vault uses Managed Identity to access other Azure resources. To restore from backup, Backup vault’s managed identity requires a set of permissions on the resource group where the disk is to be restored.

Backup vault uses a system assigned managed identity, which is restricted to one per resource and is tied to the lifecycle of this resource. You can grant permissions to the managed identity by using Azure role-based access control (RBAC). Managed identity is a service principal of a special type that may only be used with Azure resources. Learn more about [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md).


>[!Note]
>Currently, the Original-Location Recovery (OLR) option of restoring by replacing existing the source disk from where the backups were taken isn't supported. You can restore from a recovery point to create a new disk either in the same resource group as that of the source disk from where the backups were taken or in any other resource group. This is known as Alternate-Location Recovery (ALR) and this helps to keep both the source disk and the restored (new) disk.






## Restore a new disk from a recovery point

To restore a new disk from a recovery point, follow these steps:

1. Go to **Resiliency**, and then select **Recover**.

    Alternately, you can perform this operation from the Backup vault you used to configure backup for the disk.

1. On the **Recover** pane, select  **Datasource type** as **Azure Disks**, and then under **Protected item**, click **Select** to choose a disk instance.

   :::image type="content" source="./media/restore-managed-disks/recover-azure-disks.png" alt-text="Screenshot shows the selection of a disk instance for restore." lightbox="./media/restore-managed-disks/recover-azure-disks.png":::

1. On the **Select Protected item** pane, select a disk instance from the list, and then click **Select**.

1. On the **Recover** pane, select  **Continue**.

1. On the **Restore** pane, on the **Basics** tab, select **Next: Restore point**.

1. On the **Restore point** tab, under **Restore Point**, click **Select restore point**.

   :::image type="content" source="./media/restore-managed-disks/restore-point-selection.png" alt-text="Screenshot shows the selection of a restore point for Azure Disk restore." lightbox="./media/restore-managed-disks/restore-point-selection.png":::

1. On the **Select restore point** pane,  choose a restore point from the list, and then click **Select**.

1. On the **Restore** pane, select **Next: Restore parameters**.

1. On the **Restore parameters** pane, select the **Target subscription** and **Target resource group** where you want to restore the backup to, enter a value under **Restored disk name**, and then select **Validate**.

   :::image type="content" source="./media/restore-managed-disks/set-restore-parameters.png" alt-text="Screenshot shows the selection of Azure Disk restore parameters." lightbox="./media/restore-managed-disks/set-restore-parameters.png":::

   >[!TIP]
   >You can protect disks with Azure Backup using either the Disk Backup solution or the Azure Virtual Machine (VM) backup solution with a Recovery Services vault. If the Azure VM is already protected that uses this disk, you can restore the VM, individual disks, or files and folders from the VM backup recovery point. For more information, see [Azure VM backup](./about-azure-vm-restore.md).

   If the validation fails due to role assignment not done, select **Grant Permissions**. After the role assignment is complete, the revalidation runs automatically.

   :::image type="content" source="./media/restore-managed-disks/grant-permissions.png" alt-text="Screenshot shows how to grant permissions for restore." lightbox="./media/restore-managed-disks/grant-permissions.png":::

   >[!NOTE]
   >While the role assignments are reflected correctly on the portal, it may take approximately 15 minutes for the permission to be applied on the backup vault’s managed identity.
   >
   >During scheduled backups or an on-demand backup operation, Azure Backup stores the disk incremental snapshots in the Snapshot Resource Group provided during configuring backup of the disk. Azure Backup uses these incremental snapshots during the restore operation. If the snapshots are deleted or moved from the Snapshot Resource Group or if the Backup vault role assignments are revoked on the Snapshot Resource Group, the restore operation fails.

1. When the validation is successful, select **Next: Review + restore**.

1. On the **Review + restore** pane, review the restore settings, and then select **Restore** to start the restore operation.

   :::image type="content" source="./media/restore-managed-disks/start-restore.png" alt-text="Screenshot shows how to start the Azure disk restore operation.":::

   >[!NOTE]
   > Validation might take few minutes to complete before you can trigger restore operation. Validation may fail if:
   >
   > - a disk with the same name  provided in **Restored disk name** already exists in the **Target resource group**
   > - the Backup vault's managed identity doesn't have valid role assignments on the **Target resource group**
   > - the Backup vault's managed identity role assignments are revoked on the **Snapshot resource group** where incremental snapshots are stored
   > - If incremental snapshots are deleted or moved from the snapshot resource group

   The restore operation creates a new disk from the selected recovery point in the target resource group provided during the restore operation. To use the restored disk on an existing virtual machine, do the following actions:

   - If the restored disk is a data disk, you can attach an existing disk to a virtual machine. If the restored disk is OS disk, you can swap the OS disk of a virtual machine from the Azure portal under the **Virtual machine** pane - > **Disks** menu in the **Settings** section.

     :::image type="content" source="./media/restore-managed-disks/swap-os-disks.png" alt-text="Screenshot shows how to swap OS disks." lightbox="./media/restore-managed-disks/swap-os-disks.png":::

   - For Windows virtual machines, if the restored disk is a data disk, follow the instructions to [detach the original data disk](/azure/virtual-machines/windows/detach-disk#detach-a-data-disk-using-the-portal) from the virtual machine. Then [attach the restored disk](/azure/virtual-machines/windows/attach-managed-disk-portal) to the virtual machine. Follow the instructions to [swap the OS disk](/azure/virtual-machines/windows/os-disk-swap) of the virtual machine with the restored disk.

   - For Linux virtual machines, if the restored disk is a data disk, follow the instructions to [detach the original data disk](/azure/virtual-machines/linux/detach-disk#detach-a-data-disk-using-the-portal) from the virtual machine. Then [attach the restored disk](/azure/virtual-machines/linux/attach-disk-portal#attach-an-existing-disk) to the virtual machine. Follow the instructions to [swap the OS disk](/azure/virtual-machines/linux/os-disk-swap) of  the virtual machine with the restored disk.

>[!Note]
>We recommend revoking the **Disk Restore Operator** role assignment from the Backup vault's managed identity on the **Target resource group** after the restore operation completes successfully.

## Track a restore operation

After you trigger the restore operation, the backup service creates a job for tracking. Azure Backup displays notifications about the job in the portal. Learn [how to view the restore job progress](manage-azure-managed-disks.md#monitor-the-backup-and-restore-operations-for-azure-managed-disks).

## Next steps

- [Azure Disk Backup FAQ](disk-backup-faq.yml).
- [Manage Azure Managed Disks](manage-azure-managed-disks.md).