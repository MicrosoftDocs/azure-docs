---
title: Enable Backup During Azure VM Creation by Using Azure Backup
description: This article describes how to enable backup when you create an Azure VM with Azure Backup.
ms.topic: how-to
ms.date: 05/16/2025
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.custom:
  - build-2025
# Customer intent: As a cloud administrator, I want to enable backup during the creation of a virtual machine so that I can ensure that data protection and recovery points are established from the outset.
---

# Enable backup during Azure VM creation by using Azure Backup

This article describes how to enable backup when you create a virtual machine (VM) in the Azure portal.  

You can use Azure Backup to protect VMs during creation. Backups follow a predefined schedule in a backup policy and generate recovery points stored in Recovery Services vaults.

## Prerequisite

Before you create an Azure VM, review the [supported operating systems for Azure Backup](backup-support-matrix-iaas.md#supported-backup-actions).

## Sign in to the Azure portal

If you aren't already signed in to your account, sign in to the [Azure portal](https://portal.azure.com).

## Create a VM with Backup configuration

To create a VM and configure backup, follow these steps:

1. In the Azure portal, select **Create a resource**.

1. In Azure Marketplace, select **Compute**, and then select a VM image.

   >[!NOTE]
   >To create a VM from a non-Marketplace image or swap the OS disk of a VM with a non-Marketplace image, remove the plan information from the VM. This step helps with seamless VM restore.

1. Set up the VM in accordance with the [Windows](/azure/virtual-machines/windows/quick-create-portal) or [Linux](/azure/virtual-machines/linux/quick-create-portal) instructions.

1. On the **Management** tab, for **Enable backup**, select **On**.
1. Azure Backup backs up to a Recovery Services vault. Select **Create New** if you don't have an existing vault.
1. Accept the suggested vault name or specify your own.
1. Specify or create a resource group in which the vault is located. The resource group vault can be different from the VM resource group.

    :::image type="content" source="./media/backup-during-vm-creation/enable-backup.png" alt-text="Screenshot that shows how to enable backup for a VM.":::

1. Accept the default backup policy or modify the settings:
    - Specify how frequently to take backup snapshots of the VM and how long to keep those backup copies via a backup policy.
    - Back up the VM once a day with the default policy.
    - Customize your own backup policy for an Azure VM to take backups daily or weekly.
    - [Learn more](backup-azure-vms-introduction.md#backup-and-restore-considerations) about backup considerations for Azure VMs.
    - [Learn more](backup-instant-restore-capability.md) about the Instant Restore functionality.

      :::image type="content" source="./media/backup-during-vm-creation/daily-policy.png" alt-text="Screenshot that shows the default backup policy.":::

>[!NOTE]
>- [Server-side encryption and platform-managed keys are the default encryption methods](backup-encryption.md) for Azure VMs. Backup supports backup and restore of these Azure VMs.
>- Azure Backup now supports the migration to the Enhanced policy for the Azure VM backups by using the Standard policy. [Learn more](backup-azure-vm-migrate-enhanced-policy.md).

## Azure Backup resource group for virtual machines

Azure Backup creates a separate resource group, different than the resource group of the VM, to store the restore point collection (RPC). The RPC houses the instant recovery points of managed VMs. The default naming format of the resource group created by Azure Backup is `AzureBackupRG_<Geo>_<number>`. An example is *AzureBackupRG_northeurope_1*. You can now customize the resource group name that Azure Backup created.

Points to note:

- Use the default name of the resource group or customize the name according to organizational requirements.

  When Azure Backup creates a resource group, a numeric is appended to the name of the resource group and used for restore point collection.

- Provide the resource group name pattern as input during VM backup policy creation. Use the following format for the resource group name:

    `<alpha-numeric string>* n <alpha-numeric string>`. The `n` is replaced with an integer (starting from 1) and is used for scaling out if the first resource group is full. One resource group can have a maximum of 600 RPCs today.

   :::image type="content" source="./media/backup-during-vm-creation/create-policy.png" alt-text="Screenshot that shows the selection of a name when you create a policy.":::
- Follow resource group naming rules for the pattern. The total length shouldn't exceed the maximum-allowed resource group name length.
  - Resource group names allow only alphanumeric characters, periods, underscores, hyphens, and parentheses. They can't end in a period.
  - Resource group names can contain up to 74 characters, including the name of the resource group and the suffix.
- Remember that the first `<alpha-numeric-string>` is mandatory. The second one after `n` is optional. This naming pattern applies only if you give a customized name. If you don't enter anything in either of the text boxes, the default name is used.
- Edit the name of the resource group by modifying the policy if and when required. If the name pattern is changed, new recovery points (RPs) are created in the new resource group. The old RPs still reside in the old resource group and aren't moved because RP collection doesn't support moving resources. Eventually, the RPs get garbage collected as the points expire.

   :::image type="content" source="./media/backup-during-vm-creation/modify-policy.png" alt-text="Screenshot that shows the change of name when you modify a policy." lightbox="./media/backup-during-vm-creation/modify-policy.png":::

- Don't lock the resource group created for use by Azure Backup.

To configure the Azure Backup resource group for VMs by using PowerShell, see [Create an Azure Backup resource group during snapshot retention](backup-azure-vms-automation.md#creating-azure-backup-resource-group-during-snapshot-retention).

## Run an on-demand backup after VM creation

Your VM backup runs in accordance with your backup policy. We recommend that you run an initial backup.

To run an on-demand backup after the VM is created, follow these steps:

1. In the VM properties, select **Backup**. The VM status is **Initial Backup Pending** until the initial backup runs.
1. Select **Back up now** to run an on-demand backup.

    :::image type="content" source="./media/backup-during-vm-creation/run-backup.png" alt-text="Screenshot that shows how to run an on-demand backup.":::

## Deploy a protected VM by using a Resource Manager template

The previous steps explain how to use the Azure portal to create a VM and protect it in a Recovery Services vault. To quickly deploy one or more VMs and protect them in a Recovery Services vault, see the template [Deploy a Windows VM and enable backup](https://azure.microsoft.com/resources/templates/recovery-services-create-vm-and-configure-backup/).

## Related content

After the VM protection is finished, learn how to manage and restore them:

- [Manage and monitor VMs](backup-azure-manage-vms.md)
- [Restore VMs](backup-azure-arm-restore-vms.md)

If you encounter any issues, see [Troubleshooting backup failures on Azure virtual machines](backup-azure-vms-troubleshoot.md).
