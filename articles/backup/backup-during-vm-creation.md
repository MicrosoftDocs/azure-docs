---
title: Enable Backup During Azure VM Creation Using Azure Backup
description: Describes how to enable backup when you create an Azure VM with Azure Backup.
ms.topic: how-to
ms.date: 05/16/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
ms.custom:
  - build-2025
---

# Enable backup during Azure VM creation using Azure Backup

This article describes how to enable backup when you create a virtual machine (VM) in the Azure portal.  

You can use Azure Backup to protect virtual machines (VMs) during creation. Backups follow a predefined schedule in a backup policy, generating recovery points stored in Recovery Services vaults.

## Prerequisite

Before you create an Azure VM, review the [supported operating systems for the Azure Backup service](backup-support-matrix-iaas.md#supported-backup-actions).

## Sign in to the Azure portal

If you aren't already signed in to your account, sign in to the [Azure portal](https://portal.azure.com).

## Create a VM with Backup configuration

To create a VM and configure backup, follow these steps:

1. In the Azure portal, select **Create a resource**.

2. In Azure Marketplace, select **Compute**, and then select a VM image.

   >[!Note]
   >To create a VM from a non-Marketplace image or swap the OS disk of a VM with a non-Marketplace image, remove the plan information from the VM. This helps in seamless VM restore.

3. Set up the VM in accordance with the [Windows](/azure/virtual-machines/windows/quick-create-portal) or [Linux](/azure/virtual-machines/linux/quick-create-portal) instructions.

4. On the **Management** tab, in **Enable backup**, select **On**.
5. Azure Backup backups to a Recovery Services vault. Select **Create New** if you don't have an existing vault.
6. Accept the suggested vault name or specify your own.
7. Specify or create a resource group in which the vault is located. The resource group vault can be different from the VM resource group.

    :::image type="content" source="./media/backup-during-vm-creation/enable-backup.png" alt-text="Screenshot shows how to enable backup for a VM.":::

8. Accept the default backup policy, or modify the settings.
    - A backup policy specifies how frequently to take backup snapshots of the VM, and how long to keep those backup copies.
    - The default policy backs up the VM once a day.
    - You can customize your own backup policy for an Azure VM to take backups daily or weekly.
    - [Learn more](backup-azure-vms-introduction.md#backup-and-restore-considerations) about backup considerations for Azure VMs.
    - [Learn more](backup-instant-restore-capability.md) about the instant restore functionality.

      :::image type="content" source="./media/backup-during-vm-creation/daily-policy.png" alt-text="Screenshot shows the default backup policy.":::

>[!NOTE]
>- [SSE and Platform Managed Key (PMK) are the default encryption methods](backup-encryption.md) for Azure VMs. Azure Backup supports backup and restore of these Azure VMs.
>- Azure Backup now supports the migration to enhanced policy for the Azure VM backups using standard policy. [Learn more](backup-azure-vm-migrate-enhanced-policy.md).

## Azure Backup resource group for Virtual Machines

The Backup service creates a separate resource group (RG), different than the resource group of the VM to store the restore point collection (RPC). The RPC houses the instant recovery points of managed VMs. The default naming format of the resource group created by the Backup service is: `AzureBackupRG_<Geo>_<number>`. For example: *AzureBackupRG_northeurope_1*. You now can customize the Resource group name created by Azure Backup.

Points to note:

- You can use default name of RG or customize the name according to organizational requirements.

  >[!Note]
  >When Azure Backup creates an RG, a numeric is appended to the name of RG and used for restore point collection.

- You provide the RG name pattern as input during VM backup policy creation. The RG name should be of the following format: 
              `<alpha-numeric string>* n <alpha-numeric string>`. 'n' is replaced with an integer (starting from 1) and is used for scaling out if the first RG is full. One RG can have a maximum of 600 RPCs today.

   :::image type="content" source="./media/backup-during-vm-creation/create-policy.png" alt-text="Screenshot shows the selection of name when creating a policy.":::
- The pattern should be as per the following RG naming rules and the total length shouldn't exceed the maximum allowed RG name length.
  - Resource group names only allow alphanumeric characters, periods, underscores, hyphens, and parenthesis. They can't end in a period.
  - Resource group names can contain up to 74 characters, including the name of the RG and the suffix.
- The first `<alpha-numeric-string>` is mandatory while the second one after 'n' is optional. This naming pattern applies only if you give a customized name. If you don't enter anything in either of the textboxes, the default name is used.
- You can edit the name of the RG by modifying the policy if and when required. If the name pattern is changed, new recovery points (RPs) is created in the new RG. However, the old RPs still reside in the old RG and aren't moved, as RP Collection doesn't support resource move. Eventually the RPs get garbage collected as the points expire.

   :::image type="content" source="./media/backup-during-vm-creation/modify-policy.png" alt-text="Screenshot shows the change of name when modifying a policy." lightbox="./media/backup-during-vm-creation/modify-policy.png":::

- We recommend that you don't lock the resource group created for use by the Backup service.

To configure the Azure Backup resource group for Virtual Machines using PowerShell, see [Create an Azure Backup resource group during snapshot retention](backup-azure-vms-automation.md#creating-azure-backup-resource-group-during-snapshot-retention).

## Run an on-demand backup after VM creation

Your VM backup runs in accordance with your backup policy. However, we recommend that you run an initial backup.

To run an on-demand backup after the VM is created, follow these steps:

1. In the VM properties, select **Backup**. The VM status is Initial Backup Pending until the initial backup runs.
2. Select **Back up now** to run an on-demand backup.

    :::image type="content" source="./media/backup-during-vm-creation/run-backup.png" alt-text="Screenshot shows how to run an on-demand backup.":::

## Deploy a protected VM using a Resource Manager template

The previous steps explain how to use the Azure portal to create a virtual machine and protect it in a Recovery Services vault. To quickly deploy one or more VMs and protect them in a Recovery Services vault, see the template [Deploy a Windows VM and enable backup](https://azure.microsoft.com/resources/templates/recovery-services-create-vm-and-configure-backup/).

## Next steps

After the VM protection is complete, learn how to manage and restore them.

- [Manage and monitor VMs](backup-azure-manage-vms.md)
- [Restore VM](backup-azure-arm-restore-vms.md)

If you encounter any issues, [review](backup-azure-vms-troubleshoot.md) the troubleshooting guide.
