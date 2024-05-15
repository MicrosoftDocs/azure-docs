---
title: Back up Azure VM with agentless multi-disk crash-consistent backup by using Azure Backup
description: Learn how to configure backup for Azure VMs with agentless multi-disk crash-consistent backup via Azure portal.
ms.topic: how-to
ms.date: 03/14/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure VM with agentless multi-disk crash-consistent backup (preview)

This article describes how to configure backup for Azure VMs with agentless multi-disk crash-consistent backup (preview) and back up VM by using the Azure portal.

Azure Backup supports agentless VM backups by using multi-disk crash-consistent restore points (preview). The Enhanced VM backup policy now enables you to configure the consistency type of the backups (application-consistent restore points or crash-consistent restore points preview) for Azure VMs. This feature also enables Azure VM backup to retry the backup operation with *crash-consistent snapshots* (for *supported VMs*) if the application-consistent snapshot fails. 

## Before you start

Review the supported scenarios and limitations of agentless multi-disk crash-consistent backup. [Learn more](backup-azure-vms-agentless-multi-disk-crash-consistent-overview.md).

## Configure backup for a new Azure VM with agentless multi-disk crash-consistent backup

You need to set *crash-consistent backup* explicitly in this policy because *application/file-system-consistent backup* is the default setting.

>[!Note]
>The agentless crash-consistent backup is available with the *Enhanced VM backup policy* only.

To configure backup for a new Azure VM with agentless multi-disk crash-consistent backup enabled, [create a Recovery Services vault](backup-create-recovery-services-vault.md#create-a-recovery-services-vault) and follow these steps:

1. On the **Configure backup** blade, under **Policy sub type**, select **Enhanced** > **Create a new policy**. 

2. On the **Create policy** blade, set the **Consistency type** to **Only crash consistent snapshot (Preview)** to enable *agentless crash consistent backup*.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/configure-agentless-vm-backup-for-new-vm-with-new-policy.png" alt-text="Screenshot shows how to configure agentless crash-consistent backup for a new VM with a new backup policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/configure-agentless-vm-backup-for-new-vm-with-new-policy.png":::

3. Select **OK**.

## Move a VM from application/file-system-consistent to crash-consistent backup

If you have VMs backed up with Enhanced Policy, you can move them from agent-based application/file-system-consistent backups to agentless crash-consistent backups by:

- Changing their associated backup policy (recommended)
- Editing the policy setting directly

### Option 1: Change the VM backup policy to switch from application/file-system-consistent backup to crash-consistent backup (recommended)

Follow these steps:

1. Go to a **Recovery Services vault**, and then select **Manage** > **Backup policies** to check the policy for the VMs you want to move to *crash-consistent backup*.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/vault-locate-policy.png" alt-text="Screenshot shows how to locate all backup policies present in a vault." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/vault-locate-policy.png":::

2. Select the *backup policy*, and then on the **Modify policy** blade, select **Associated Items** to identify the VMs that you want to move to crash-consistent backup.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/policy-settings.png" alt-text="Scerrnshot shows how to check associated items in a backup policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/policy-settings.png":::
 
   >[!Note]
   >Ensure that the VMs are supported for crash-consistent backups. Learn about the [supported scenarios](backup-azure-vms-agentless-multi-disk-crash-consistent-overview.md#supported-scenarios-for-agentless-multi-disk-crash-consistent-vm-backup-preview).

3. Go to the **Modify policy**, and then make a note of the settings in the policy to use the same in the new backup policy.

4. Go to the **Backup policies** blade, and select **Add** to create a new policy.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/add-backup-policy.png" alt-text="Screenshot shows how to add a new backup policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/add-backup-policy.png":::

5. On the **Select policy type** blade, select **Azure Virtual Machine**.

6. On the **Create policy** blade, select **Enhanced** as the **Policy sub type**, and then configure the new policy with the same backup frequency and retention as the existing policy. 

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/create-new-enhanced-backup-policy.png" alt-text="Screenshot shows creation of a new backup policy with the same backup frequency and retention rules." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/create-new-enhanced-backup-policy.png":::

7. Set the **Consistency type** to **Only crash consistent snapshot (Preview)**, and then select **Create**.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/set-crash-consistent-policy.png" alt-text="Screenshot shows how to set crash-consistent policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/set-crash-consistent-policy.png":::

8. Go to the *existing policy*, select **Associated Items**, and then select **View details** corresponding to the VM you want to move to crash consistent backup.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/view-details-to-move-vm-crash-consistent.png" alt-text="Screenshot shows how to view details of a VM." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/view-details-to-move-vm-crash-consistent.png":::

9. Select **Backup policy** to go to the **Change Backup Policy** blade.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/backup-policy-change.png" alt-text="Screenshot shows how to initiate changing policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/backup-policy-change.png":::

10. On the **Change Backup Policy** blade, change the backup policy to the new one you created, verify that it has the Consistency type set to Crash consistent, and then  select **Change**.

   A **Modifying protection** notification and a **Configure backup** job in your vault for the VM is triggered. Monitor the notification or job to check if the crash-consistent backup policy is added successfully.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/modify-vm-protection-policy-success-notification.png" alt-text="Screenshot shows the success status for change in VM backup policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/modify-vm-protection-policy-success-notification.png":::

### Option 2: Modify the backup policy to change from application/file-system-consistent backup to crash-consistent backup

If you don't want to create a new policy and move only specific VMs, edit the **Consistency type** option in the existing policy.

Follow these steps:

1.	Go to the *Recovery Services vault*, select **Backup policies**, and then choose an existing policy.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/vault-locate-policy.png" alt-text="Screenshot shows how to check for all backup policies present in a vault." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/vault-locate-policy.png":::

2. On the **Modify policy**, select **Associated Items**. 

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/policy-settings.png" alt-text="Screenshot shows how to check the associated items in a backup policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/policy-settings.png":::

   >[!Note]
   >Ensure that all the VMs in the policy are supported for crash-consistent backups. Learn about the [supported scenarios](backup-azure-vms-agentless-multi-disk-crash-consistent-overview.md#supported-scenarios-for-agentless-multi-disk-crash-consistent-vm-backup-preview).
   >
   > :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/backup-policy-associated-items-edit.png" alt-text="Screenshot shows the list of VM associated with a backup policy." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/backup-policy-associated-items-edit.png":::

3. Go to the **Modify policy** blade, and set the **Consistency type** to **Only crash consistent snapshot (Preview)**, and then select **Update**.

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/modify-policy-crash-consistent.png" alt-text="Screenshot shows how to check for the change in policy settings." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/modify-policy-crash-consistent.png":::

   You can monitor the *Modify backup policy* job on the **Backup jobs** blade. The *Configure backup jobs* triggered for each VM in the policy appear. 

   :::image type="content" source="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/modify-policy-jobs.png" alt-text="Screenshot shows how to monitor the policy change operation." lightbox="./media/backup-azure-vms-agentless-multi-disk-crash-consistent/modify-policy-jobs.png":::

>[!Note]
>If the job fails for an unsupported VM, revert the policy to opt out of crash-consistent backup and retry the update after you remove all unsupported VMs from the policy.

## Next steps

[Run an on-demand backup of Azure VM](backup-azure-vms-first-look-arm.md#run-a-backup-immediately).