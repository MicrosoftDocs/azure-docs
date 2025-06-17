---
title: Move VM backup - standard to enhanced policy in Azure Backup
description: Learn how to trigger Azure VM backups migration from standard  policy to enhanced policy, and then monitor the configuration backup migration job.
ms.topic: reference
ms.date: 06/17/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
ms.custom:
  - engagement-fy24
  - build-2025
---

# Migrate Azure VM backups from standard  to enhanced policy

This article describes how to migrate Azure Virtual Machine (VM) backups from standard to enhanced policy using Azure Backup.

Azure Backup now supports migration to the enhanced policy for Azure VM backups using standard policy. The migration of VM backups to enhanced policy enables you to schedule multiple backups per day (up to every 4 hours), retain snapshots for longer duration, and use multi-disk crash consistency for VM backups. Snapshot-tier recovery points (created using enhanced policy) are zonally resilient. The migration of VM backups to enhanced policy also allows you to migrate your VMs to Trusted Launch and use Premium SSD v2 and Ultra-disks for the VMs without disrupting the existing backups.

>[!Note]
>Standard policy supports backup only for unprotected trusted launch VMs via CLI (version 2.73.0 and later), PowerShell (version Az 14.0.0 and later), and REST API (version 2025-01-01 and later). To enable trusted launch for existing VMs protected by Standard Policy, migrate to Enhanced Policy first.

## Considerations

- Before you start the migration, ensure that there are no ongoing backup jobs for the VM that you plan to migrate.
- Migration is supported for Managed VMs only and isn’t supported for Classic or unmanaged VMs.
- Once the migration is complete, you can’t change the backup policy back to standard policy.
- Migration operations trigger a backup job as part of the migration process and might take up to several hours to complete for large VMs.
- The change from standard policy to enhanced policy can result in extra costs. [Learn More](backup-instant-restore-capability.md#cost-impact).

>[!Note]
> If the VM already has a shared disk attached to it, then perform migration by following these steps:
>1. Detach the shared disk from the VM.
>2. [Perform the Policy change](#trigger-the-backup-migration-operation).
>3. Reattach the shared disk to implement the exclusion.

## Trigger the backup migration operation

To do the policy migration using Azure portal, follow these steps:

>[!Note]
>For migrating VM backups from Standard to Enhanced policy using the Azure CLI, use the command provided in [az backup item](/cli/azure/backup/item?view=azure-cli-latest&preserve-view=true#az-backup-item-set-policy).

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Go to the *Recovery Services vault*.

3. On the **Backup Items** tile, select **Azure Virtual Machine**.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/select-backup-item-type.png" alt-text="Screenshot shows the selection of backup type as Azure VM." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/select-backup-item-type.png":::

4. On the **Backup Items** pane, you can view the list of *protected VMs* and *last backup status with latest restore points time*.

   Select **View details**.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/view-backup-item-details.png" alt-text="Screenshot shows how to view the backup item details." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/view-backup-item-details.png":::

5. On the **Change Backup Policy** pane, select **Policy subtype** as **Enhanced**, choose a *backup policy* to apply to the virtual machine, and then select **Change**.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/change-to-enhanced-policy.png" alt-text="Screenshot shows how to change the Azure VM backup policy to enhanced." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/change-to-enhanced-policy.png":::

## Monitor the policy migration job

To monitor the migration job on the **Backup Items** pane, select **View jobs**.

:::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/view-backup-migration-job-progress.png" alt-text="Screenshot shows how to go to the Backup Jobs pane." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/view-backup-migration-job-progress.png":::

The migration job is listed with Operation type Configure backup (Migrate policy).

:::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/configure-backup-migrate-policy.png" alt-text="Screenshot shows the backup migration policy job listed." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/configure-backup-migrate-policy.png":::

## Migrate protected VMs to Enhanced policy in bulk.

Azure Backup allows seamless bulk migration of protected VMs from the Standard policy to the Enhanced policy. This transition strengthens security, enhances operational efficiency, and optimizes data protection across your Azure infrastructure.

**Choose a path to change policy**:

# [Backup Items tile](#tab/backup-items-tile)

To trigger bulk migration of VMs protected using Standard policy to an Enhanced policy using the **Backup Items** tile, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go the **Recovery Services vault**.
1. On the **Backup Items** tile, select **Azure Virtual Machine**.
1. On the **Backup Items** pane, select the VMs from the list of protected VMs (using Standard policy) that you want to migrate, and then select **Change policy**. 

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/change-policy-for-backup-items.png" alt-text="Screenshot shows how to change policy from the Backup Items pane." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/change-policy-for-backup-items.png":::

1. On the **Change policy** pane, on the **Basics** tab, review the selection of VMs, and then select **Next > Target policy**.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/review-vm-selection-for-change-policy.png" alt-text="Screenshot shows how to review the VM selection." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/review-vm-selection-for-change-policy.png":::

   You can modify the VM selection if necessary.

1. On the **Target policy** tab, under **Target policy**, select a target Enhanced policy from the dropdown list.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/select-enhanced-policy.png" alt-text="Screenshot shows how to select a different backup policy." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/select-enhanced-policy.png":::

1. Review the selected Enhanced policy details, and then select **Next > Review + Change policy**.
1. On the **Review + Change policy** tab, verify the selection of VMs and target policy, and then select **Change policy**.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/trigger-change-policy.png" alt-text="Screenshot shows how to trigger the change policy operation." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/trigger-change-policy.png":::


# [Backup Policies pane](#tab/backup-policies-pane)

To trigger bulk migration of VMs protected using Standard policy to an Enhanced policy via the **Backup Policies** pane, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go the **Recovery Services vault** >**Backup Policies**.
1. On the **Backup Policy** pane, select a backup policy with **Policy sub type** as **Standard**.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/select-standard-policy.png" alt-text="Screenshot shows the selection of a Standard backup policy." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/select-standard-policy.png":::

1. On the **Modify policy** pane, select **Associated items**.   

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/select-associated-items-option.png" alt-text="Screenshot shows the selection of the Associated items option." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/select-associated-items-option.png":::

1. On the **Associated items** pane, select the VMs to migrate, and then select **Change policy**.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/view-associated-items.png" alt-text="Screenshot shows the associated items to the policy." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/view-associated-items.png":::

1. On the **Change policy** pane, on the **Basics** tab, review the selection of VMs, and then select **Next > Target policy**.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/review-vm-selection-for-change-policy-1.png" alt-text="Screenshot shows the VMs associated with the policy." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/review-vm-selection-for-change-policy-1.png":::

   You can modify the VM selection if necessary.

1. On the **Target policy** tab, under **Target policy**, select a target Enhanced policy from the dropdown list.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/select-enhanced-policy-1.png" alt-text="Screenshot shows the selection of a different backup policy." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/select-enhanced-policy-1.png":::

1. Review the selected Enhanced policy details, and then select **Next > Review + Change policy**.
1. On the **Review + Change policy** tab, verify the selection of VMs and target policy, and then select **Change policy**.

   :::image type="content" source="./media/backup-azure-vm-migrate-enhanced-policy/trigger-change-policy-1.png" alt-text="Screenshot shows how to run the change policy operation." lightbox="./media/backup-azure-vm-migrate-enhanced-policy/trigger-change-policy-1.png":::


---

## Next steps

- Learn about [Standard VM backup policy](backup-during-vm-creation.md#create-a-vm-with-backup-configuration).
- Learn how to [back up an Azure VM using Enhanced policy](backup-azure-vms-enhanced-policy.md).
- [Troubleshoot backup policy migration issue](backup-azure-vms-troubleshoot.md#migration-from-standard-to-enhanced-policy-issue).