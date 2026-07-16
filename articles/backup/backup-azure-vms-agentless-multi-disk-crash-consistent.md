---
title: Back Up Azure VM with Agentless Multidisk Crash-Consistent Backup by using Azure Backup
description: Learn how to configure backup for Azure VMs with agentless multidisk crash-consistent backup via Azure portal.
ms.topic: how-to
ms.date: 07/25/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As an IT administrator managing Azure VMs, I want to configure agentless multidisk crash-consistent backups so that I can ensure robust data protection with minimal impact on performance.
---

# Back up Azure VM with agentless multidisk crash-consistent backup

This article describes how to configure backup for Azure virtual machines (VMs) with agentless multidisk crash-consistent backup and back up VMs by using the Azure portal.

Azure Backup supports agentless VM backups by using multidisk crash-consistent restore points. The Enhanced VM backup policy now enables you to configure the consistency type of the backups (application-consistent restore points or crash-consistent restore points) for Azure VMs. This feature also enables Azure VM backup to retry the backup operation with *crash-consistent snapshots* (for *supported VMs*) if the application-consistent snapshot fails.

>[!Note]
>The agentless multidisk crash-consistent VM backup feature is generally available. This release includes changes to billing. For more information, see the [pricing details](backup-azure-vms-agentless-multi-disk-crash-consistent-overview.md#pricing-for-agentless-multi-disk-crash-consistent-backup).

## Before you start

Review the supported scenarios and limitations of agentless multidisk crash-consistent backup. [Learn more about supported scenarios](backup-azure-vms-agentless-multi-disk-crash-consistent-overview.md).

## Configure backup for a new Azure VM with agentless multidisk crash-consistent backup

You need to set *crash-consistent backup* explicitly in this policy because *application/file system-consistent backup* is the default setting.

The agentless crash-consistent backup is available with the *Enhanced VM backup policy* only.

To configure backup for a new Azure VM with agentless multidisk crash-consistent backup enabled, [create a Recovery Services vault](backup-create-recovery-services-vault.md#create-a-recovery-services-vault) and follow these steps:

1. On the **Configure backup** pane, under **Policy sub type**, select **Enhanced** > **Create a new policy**.

1. On the **Create policy** pane, set **Consistency type** to **Only crash consistent snapshot** to enable *agentless crash-consistent backup*.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/configure-agentless-vm-backup-for-new-vm-with-new-policy.png" alt-text="Screenshot that shows how to configure agentless crash-consistent backup for a new VM with a new backup policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/configure-agentless-vm-backup-for-new-vm-with-new-policy.png":::

1. Select **OK**.

## Move a VM from application/file system-consistent to crash-consistent backup

If you have VMs that are backed up with the Enhanced policy, you can move them from agent-based application/file system-consistent backups to agentless crash-consistent backups:

- Change their associated backup policy (recommended).
- Edit the policy setting directly.

### Option 1: Change the VM backup policy to switch from application/file system-consistent backup to crash-consistent backup (recommended)

To change the VM backup policy, follow these steps:

1. Go to a Recovery Services vault, and then select **Manage** > **Backup policies** to check the policy for the VMs that you want to move to crash-consistent backup.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/vault-locate-policy.png" alt-text="Screenshot that shows how to locate all backup policies present in a vault." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/vault-locate-policy.png":::

1. Select the backup policy, and then on the **Modify policy** pane, select **Associated Items** to identify the VMs that you want to move to crash-consistent backup.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/policy-settings.png" alt-text="Screenshot that shows how to check associated items in a backup policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/policy-settings.png":::

   Ensure that the VMs are supported for crash-consistent backups. Learn about the [supported scenarios](backup-azure-vms-agentless-multi-disk-crash-consistent-overview.md#supported-scenarios-for-agentless-multi-disk-crash-consistent-vm-backup).

1. Go to **Modify policy**, and then make a note of the settings in the policy to use the same in the new backup policy.

1. Go to the **Backup policies** pane, and select **Add** to create a new policy.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/add-backup-policy.png" alt-text="Screenshot that shows how to add a new backup policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/add-backup-policy.png":::

1. On the **Select policy type** pane, select **Azure Virtual Machine**.

1. On the **Create policy** pane, under **Policy sub type**, select **Enhanced**. Then configure the new policy with the same backup frequency and retention as the existing policy.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/create-new-enhanced-backup-policy.png" alt-text="Screenshot that shows how to create a new backup policy with the same backup frequency and retention rules." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/create-new-enhanced-backup-policy.png":::

1. Set **Consistency type** to **Only crash consistent snapshot**, and then select **Create**.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/set-crash-consistent-policy.png" alt-text="Screenshot that shows how to set the crash-consistent policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/set-crash-consistent-policy.png":::

1. Go to the existing policy, select **Associated Items**, and then select **View details** to see more information about the VM that you want to move to crash-consistent backup.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/view-details-to-move-vm-crash-consistent.png" alt-text="Screenshot that shows how to view details of a VM." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/view-details-to-move-vm-crash-consistent.png":::

1. Select **Backup policy** to go to the **Change Backup Policy** pane.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/backup-policy-change.png" alt-text="Screenshot that shows how to initiate changing policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/backup-policy-change.png":::

1. On the **Change Backup Policy** pane, change the backup policy to the new one that you created. Verify that it has **Consistency type** set to **Crash consistent**, and then select **Change**.

   A **Modifying protection** notification and a **Configure backup** job in your vault for the VM is triggered. Monitor the notification or job to check if the crash-consistent backup policy is added successfully.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/modify-vm-protection-policy-success-notification.png" alt-text="Screenshot that shows the success status for change in VM backup policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/modify-vm-protection-policy-success-notification.png":::

### Option 2: Modify the backup policy to change from application/file system-consistent backup to crash-consistent backup

If you don't want to create a new policy and move only specific VMs, edit the **Consistency type** option in the existing policy.

To change from application/file system-consistent backup to crash-consistent backup, follow these steps:

1. Go to the Recovery Services vault, select **Backup policies**, and then choose an existing policy.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/vault-locate-policy.png" alt-text="Screenshot that shows how to check for all backup policies present in a vault." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/vault-locate-policy.png":::

1. On the **Modify policy** pane, select **Associated items**.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/policy-settings.png" alt-text="Screenshot that shows how to check the associated items in a backup policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/policy-settings.png":::

   Ensure that all the VMs in the policy are supported for crash-consistent backups. Learn about the [supported scenarios](backup-azure-vms-agentless-multi-disk-crash-consistent-overview.md#supported-scenarios-for-agentless-multi-disk-crash-consistent-vm-backup).
   
   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/backup-policy-associated-items-edit.png" alt-text="Screenshot that shows the list of VMs associated with a backup policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/backup-policy-associated-items-edit.png":::

1. Go to the **Modify policy** pane, set **Consistency type** to **Only crash consistent snapshot**, and then select **Update**.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/modify-policy-crash-consistent.png" alt-text="Screenshot that shows how to check for the change in policy settings." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/modify-policy-crash-consistent.png":::

   You can monitor the **Modify backup policy** job on the **Backup Jobs** pane. The **Configure backup jobs** triggered for each VM in the policy appear.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/modify-policy-jobs.png" alt-text="Screenshot that shows how to monitor the policy change operation." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/modify-policy-jobs.png":::

If the job fails for an unsupported VM, revert the policy to opt out of crash-consistent backup and retry the update after you remove all unsupported VMs from the policy.

## Related content

- [Run an on-demand backup of Azure VM](backup-azure-vms-first-look-arm.md#run-an-on-demand-backup-of-azure-vms)
