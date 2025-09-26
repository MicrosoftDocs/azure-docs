---
title: Back Up an Azure VM from the VM settings
description: In this article, learn how to back up either a singular Azure VM or multiple Azure VMs with Azure Backup.
ms.topic: how-to
ms.date: 06/11/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.custom: engagement-fy24
# Customer intent: As an IT administrator managing Azure VMs, I want to back up VMs directly from the VM settings so that I can ensure data protection and easy recovery from potential data loss.
---
# Back up an Azure VM from the VM settings

This article describes how to back up Azure virtual machines (VMs) by using [Azure Backup](backup-overview.md).

Azure Backup protects VM data with independent, isolated backups. It stores backups in a Recovery Services vault and manages recovery points automatically. You can configure and scale backups easily, restore data quickly, and optimize storage. Use one of the following methods to back up your Azure VMs:

- **Single Azure VM**: This article provides the steps to back up an Azure VM directly from the VM settings.
- **Multiple Azure VMs**: You can create a Recovery Services vault and configure backup for multiple Azure VMs. Learn how to [back up multiple Azure VMs](backup-azure-arm-vms-prepare.md).

## Prerequisites

- [Understand the Azure Backup workflow](backup-architecture.md#how-does-azure-backup-work)
- [Get an overview of Azure VM backup](backup-azure-vms-introduction.md)
- [Verify the VM backup support requirements](backup-support-matrix.md#azure-vm-backup-support)

### Install an Azure VM agent

To back up Azure VMs, Azure Backup installs an extension on the VM agent that runs on the machine. If your VM was created from an Azure Marketplace image, the agent is running. In some cases, for example, if you create a custom VM or migrate a machine from on-premises, you might need to install the agent manually.

- If you do need to install the VM agent manually, follow the instructions for [Windows](/azure/virtual-machines/extensions/agent-windows) or [Linux](/azure/virtual-machines/extensions/agent-linux) VMs.
- After the agent is installed, when you enable backup, Azure Backup installs the backup extension to the agent. It updates and patches the extension without user intervention.

## Back up from Azure VM settings

To back up from Azure VM settings, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the **Search** box, enter **Virtual machines**, and then select **Virtual machines**.
1. From the list of VMs, select the VM that you want to back up.
1. On the VM menu, select **Backup**.
1. Under **Recovery Services vault**, do the following:

   - If you already have a vault, choose **Select existing**, and select a vault.
   - If you don't have a vault, select **Create new**. Specify a name for the vault. The vault is created in the same region and resource group as the VM. You can't modify these settings when you enable backup directly from the VM settings.

        ![Screenshot that shows how to enable the backup wizard.](./media/backup-azure-vms-first-look-arm/vm-menu-enable-backup-small.png)

1. Select **Policy sub type** as **Enhanced** or **Standard** based on your requirement.

1. Under **Choose backup policy**, do one of the following:

   - Leave the default policy. The **Standard** policy backs up the VM once a day at the time specified and retains backups in the vault for 30 days. The **Enhanced** policy backs up the VM every four hours at the time specified and retains daily backup points for 30 days.
   - Select an existing backup policy if you have one.
   - Create a new policy, and define the policy settings.

      ![Screenshot that shows how to select a backup policy.](./media/backup-azure-vms-first-look-arm/set-backup-policy.png)

1. Select **Enable Backup**. This action associates the backup policy with the VM.

    ![Screenshot that shows selecting Enable Backup.](./media/backup-azure-vms-first-look-arm/vm-management-menu-enable-backup-button.png)

1. You can track the configuration progress in the portal notifications.
1. After the job finishes, on the VM menu, select **Backup**. The page shows backup status for the VM and information about recovery points, jobs running, and alerts issued.

   ![Screenshot that shows the backup status.](./media/backup-azure-vms-first-look-arm/backup-item-view-update.png)

1. After backup is enabled, an initial backup runs. You can start the initial backup immediately or wait until it starts based on with the backup schedule.
    - Until the initial backup finishes, **Last backup status** shows as **Warning (Initial backup pending)**.
    - To see when the next scheduled backup is scheduled to run, select the backup policy name.

## Run an on-demand backup of Azure VMs

To run an on-demand backup of Azure VMs, follow these steps:

1. To run a backup immediately, on the VM menu, select **Backup** > **Backup now**.

    ![Screenshot that shows how to run a backup.](./media/backup-azure-vms-first-look-arm/backup-now-update.png)

1. On **Backup Now**, use the calendar control to select how long the recovery point is retained, and then select **OK**.

    ![Screenshot that shows the backup retention day.](./media/backup-azure-vms-first-look-arm/backup-now-blade-calendar.png)

1. Portal notifications let you know that the backup job was triggered. To monitor backup progress, select **View all jobs**.

## Back up Azure VMs from the Recovery Services vault

To enable backup for Azure VMs by setting up a Recovery Services vault and enabling backup in the vault, see [Back up Azure VMs in a Recovery Services vault](backup-azure-arm-vms-prepare.md).

## Related content

- [Manage Azure VM backups](backup-azure-manage-vms.md)
- [Troubleshoot Azure VM backup errors](backup-azure-vms-troubleshoot.md)
