---
title: Move VM backup - standard to enhanced policy in Azure Backup
description: Learn how to trigger Azure VM backups migration from standard  policy to enhanced policy, and then monitor the configuration backup migration job.
ms.topic: reference
ms.date: 05/02/2024
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
ms.custom: engagement-fy24
---

# Migrate Azure VM backups from standard  to enhanced policy (preview)

This article describes how to migrate Azure VM backups from standard to enhanced policy using Azure Backup.

Azure Backup now supports migration to the enhanced policy for Azure VM backups using standard policy. The migration of VM backups to enhanced policy enables you to schedule multiple backups per day (up to every 4 hours), retain snapshots for longer duration, and use multi-disk crash consistency for VM backups. Snapshot-tier recovery points (created using enhanced policy) are zonally resilient. The migration of VM backups to enhanced policy also allows you to migrate your VMs to Trusted Launch and use Premium SSD v2 and Ultra-disks for the VMs without disrupting the existing backups.

## Considerations

- Before you start the migration, ensure that there are no ongoing backup jobs for the VM that you plan to migrate.
- Migration is supported for Managed VMs only and isn’t supported for Classic or unmanaged VMs.
- Once the migration is complete, you can’t change the backup policy back to standard policy.
- Migration operations trigger a backup job as part of the migration process and might take up to several hours to complete for large VMs.
- The change from standard policy to enhanced policy can result in additional costs. [Learn More](backup-instant-restore-capability.md#cost-impact).


## Trigger the backup migration operation

To do the policy migration, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Go to the *Recovery Services vault*.

3. On the **Backup Items** tile, select **Azure Virtual Machine**.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/select-backup-item-type.png" alt-text="Screenshot shows the selection of backup type as Azure VM." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/select-backup-item-type.png":::

4. On the **Backup Items** blade, you can view the list of *protected VMs* and *last backup status with latest restore points time*.

   Select **View details**.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/view-backup-item-details.png" alt-text="Screenshot shows how to view the backup item details." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/view-backup-item-details.png":::

5. On the **Change Backup Policy** blade, select **Policy subtype** as **Enhanced**, choose a *backup policy* to apply to the virtual machine, and then select **Change**.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/change-to-enhanced-policy.png" alt-text="Screenshot shows how to change the Azure VM backup policy to enhanced." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/change-to-enhanced-policy.png":::

## Monitor the policy migration job

To monitor the migration job on the **Backup Items** blade, select **View jobs**.

:::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/view-backup-migration-job-progress.png" alt-text="Screenshot shows how to go to the Backup Jobs blade." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/view-backup-migration-job-progress.png":::

The migration job is listed with Operation type Configure backup (Migrate policy).

:::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/configure-backup-migrate-policy.png" alt-text="Screenshot shows the backup migration policy job listed." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/configure-backup-migrate-policy.png":::

## Next steps

- Learn about [standard VM backup policy](backup-during-vm-creation.md#create-a-vm-with-backup-configured).
- Learn how to [back up an Azure VM using Enhanced policy](backup-azure-vms-enhanced-policy.md).
