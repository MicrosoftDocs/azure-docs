---
title: Back up an Azure VM from the VM settings
description: In this article, learn how to back up either a singular Azure VM or multiple Azure VMs with the Azure Backup service.
ms.topic: how-to
ms.date: 06/24/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
ms.custom: engagement-fy23
---
# Back up an Azure VM from the VM settings

This article describes how to back up Azure VMs with the [Azure Backup](backup-overview.md) service.

Azure Backup provides independent and isolated backups to guard against unintended destruction of the data on your VMs. Backups are stored in a Recovery Services vault with built-in management of recovery points. Configuration and scaling are simple, backups are optimized, and you can easily restore as needed. You can back up Azure VMs using a couple of methods:

- Single Azure VM: The instructions in this article describe how to back up an Azure VM directly from the VM settings.
- Multiple Azure VMs: You can set up a Recovery Services vault and configure backup for multiple Azure VMs. Follow the instructions in [this article](backup-azure-arm-vms-prepare.md) for this scenario.

## Before you start

1. [Learn](backup-architecture.md#how-does-azure-backup-work) how Azure Backup works, and [verify](backup-support-matrix.md#azure-vm-backup-support) support requirements.
2. [Get an overview](backup-azure-vms-introduction.md) of Azure VM backup.

### Azure VM agent installation

To back up Azure VMs, Azure Backup installs an extension on the VM agent running on the machine. If your VM was created from an Azure Marketplace image, the agent will be running. In some cases, for example if you create a custom VM, or you migrate a machine from on-premises, you might need to install the agent manually.

- If you do need to install the VM agent manually, follow the instructions for [Windows](../virtual-machines/extensions/agent-windows.md) or [Linux](../virtual-machines/extensions/agent-linux.md) VMs.
- After the agent is installed, when you enable backup, Azure Backup installs the backup extension to the agent. It updates and patches the extension without user intervention.

## Back up from Azure VM settings

Follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **All services** and in the Filter, type **Virtual machines**, and then select **Virtual machines**.
3. From the list of VMs, select the VM you want to back up.
4. On the VM menu, select **Backup**.
5. In **Recovery Services vault**, do the following:
   - If you already have a vault, select **Select existing**, and select a vault.
   - If you don't have a vault, select **Create new**. Specify a name for the vault. It's created in the same region and resource group as the VM. You can't modify these settings when you enable backup directly from the VM settings.

        ![Screenshot shows how to enable backup wizard.](./media/backup-azure-vms-first-look-arm/vm-menu-enable-backup-small.png)

6. In **Choose backup policy**, do one of the following:

   - Leave the default policy. This backs up the VM once a day at the time specified, and retains backups in the vault for 30 days.
   - Select an existing backup policy if you have one.
   - Create a new policy, and define the policy settings.  

      ![Screenshot shows how to select a backup policy.](./media/backup-azure-vms-first-look-arm/set-backup-policy.png)

7. Select **Enable Backup**. This associates the backup policy with the VM.

    ![Screenshot shows the selection of Enable Backup.](./media/backup-azure-vms-first-look-arm/vm-management-menu-enable-backup-button.png)

8. You can track the configuration progress in the portal notifications.
9. After the job completes, in the VM menu, select **Backup**. The page shows backup status for the VM, information about recovery points, jobs running, and alerts issued.

   ![Screenshot shows the backup status.](./media/backup-azure-vms-first-look-arm/backup-item-view-update.png)

10. After enabling backup, an initial backup run. You can start the initial backup immediately, or wait until it starts in accordance with the backup schedule.
    - Until the initial backup completes, the **Last backup status** shows as **Warning (Initial backup pending)**.
    - To see when the next scheduled backup will run, select the backup policy name.

## Run a backup immediately

Follow these steps:

1. To run a backup immediately, in the VM menu, select **Backup** > **Backup now**.

    ![Screenshot shows how to run backup.](./media/backup-azure-vms-first-look-arm/backup-now-update.png)

2. In **Backup Now**, use the calendar control to select until when the recovery point will be retained >  and **OK**.

    ![Screenshot shows the backup retention day.](./media/backup-azure-vms-first-look-arm/backup-now-blade-calendar.png)

3. Portal notifications let you know the backup job has been triggered. To monitor backup progress, select **View all jobs**.

## Back up from the Recovery Services vault

Follow the instructions in [this article](backup-azure-arm-vms-prepare.md) to enable backup for Azure VMs by setting up an Azure Backup Recovery Services vault, and enabling backup in the vault.

## Next steps

- If you have difficulties with any of the procedures in this article, consult the [troubleshooting guide](backup-azure-vms-troubleshoot.md).
- [Learn about](backup-azure-manage-vms.md) managing your backups.
