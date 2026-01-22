---
title: Back Up Azure VMs in a Recovery Services Vault
description: This article describes how to back up Azure VMs in a Recovery Services vault by using Azure Backup.
ms.topic: how-to
ms.date: 01/22/2026
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a cloud administrator, I want to configure a backup for Azure VMs by using a Recovery Services vault so that I can ensure data protection and recovery options are in place for my virtual machines.
---

# Back up Azure VMs in a Recovery Services vault

This article describes how to back up Azure virtual machines (VMs) in a Recovery Services vault by using [Azure Backup](backup-overview.md).

In this article, you learn how to:

> [!div class="checklist"]
>
> * Prepare Azure VMs.
> * Create a vault.
> * Discover VMs and configure a backup policy.
> * Enable backup for Azure VMs.
> * Run the initial backup.

> [!NOTE]
> This article describes how to set up a vault and select VMs to back up. It's useful if you want to back up multiple VMs. Alternatively, you can [back up a single Azure VM](backup-azure-vms-first-look-arm.md) directly from the VM settings.

## Before you start

* [Review](backup-architecture.md#architecture-built-in-azure-vm-backup) the Azure VM backup architecture.
* [Learn about](backup-azure-vms-introduction.md) Azure VM backup and the backup extension.
* [Review the support matrix](backup-support-matrix-iaas.md) before you configure backup.

In some circumstances, you might also need to install the VM agent on the VM. Azure Backup backs up Azure VMs by installing an extension to the Azure VM agent that runs on the machine. If your VM was created from an Azure Marketplace image, the agent is installed and running. If you create a custom VM or you migrate an on-premises machine, you might need to [install the agent manually](#install-the-vm-agent).

[!INCLUDE [backup-center.md](../../includes/backup-center.md)]

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

### Modify storage replication

By default, vaults use [geo-redundant storage (GRS)](../storage/common/storage-redundancy.md#geo-redundant-storage):

* If the vault is your primary backup mechanism, we recommend that you use GRS.
* [Locally redundant storage](../storage/common/storage-redundancy.md#locally-redundant-storage) is a less-expensive option.
* [Zone-redundant storage](../storage/common/storage-redundancy.md#zone-redundant-storage) replicates your data in [availability zones](/azure/reliability/availability-zones-overview) for data residency and resiliency in the same region.

To modify the storage replication type, follow these steps:

1. In the new vault, under **Settings**, select **Properties**.
1. On the **Properties** pane, under **Backup Configuration**, select **Update**.
1. Select the storage replication type, and then select **Save**.

    ![Screenshot that shows setting the storage configuration for a new vault.](./media/backup-azure-arm-vms-prepare/full-blade.png)

You can't modify the storage replication type after the vault is set up and contains backup items. If you want to modify the type, you need to re-create the vault.

## Apply a backup policy

To apply a backup policy to your Azure VMs, follow these steps:

1. Go to **Resiliency**, and then select **+ Configure protection**.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/configure-protection.png" alt-text="Screenshot that shows the Configure protection option." lightbox="./media/backup-azure-arm-vms-prepare/configure-protection.png":::

1. On the **Configure protection** pane, fill in the following fields:

   - **Resources managed by**: Select **Azure**.
   - **Datasource type**: Select **Azure Virtual machines**.
   - **Solution**: Select **Azure Backup**.

   Then select **Continue**.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/configure-system-protection.png" alt-text="Screenshot that shows the Configure protection pane." lightbox="./media/backup-azure-arm-vms-prepare/configure-system-protection.png":::

1. On the **Start: Configure Backup** pane, for **Datasource type**, select **Azure Virtual machines**, and select the vault that you created. Then select **Continue**.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/select-backup-goal-1.png" alt-text="Screenshot that shows the Start: Configure Backup pane.":::

1. Assign a backup policy.

    - The default policy backs up the VM once a day. The daily backups are retained for 30 days. Instant recovery snapshots are retained for two days.

      ![Screenshot that shows the default backup policy.](./media/backup-azure-arm-vms-prepare/default-policy.png)

    - If you don't want to use the default policy, select **Create New**, and create a custom policy as described in the next procedure.

1. Under **Virtual Machines**, select **Add**.

      ![Screenshot that shows adding virtual machines.](./media/backup-azure-arm-vms-prepare/add-virtual-machines.png)

1. On the **Select virtual machines** pane, select the VMs that you want to back up by using the policy. Then select **OK**.

   * Only the selected VMs are validated.
   * Only VMs in the same region as the vault are eligible to select.
   * Only a single vault is used for backup for the VMs.

     ![Screenshot that shows the Select virtual machines pane.](./media/backup-azure-arm-vms-prepare/select-vms-to-backup.png)

    >[!NOTE]
    >- All the VMs in the same region and subscription as that of the vault are available to configure backup. When you configure backup, you can browse to the VM name and its resource group, even though you don't have the required permission on those VMs. If your VM is in a soft-deleted state, it doesn't appear in this list. If you need to reprotect the VM, wait for the soft-deleted period to expire. You can also restore the VM from the soft-deleted list. For more information, see [Soft delete for VMs by using the Azure portal](soft-delete-virtual-machines.md#soft-delete-azure-vm-backups).
    >- To change the Recovery Services vault of a VM, stop the backup and then assign a new vault to the VM.

1. In **Backup**, select **Enable backup**. This action deploys the policy to the vault and the VMs and installs the backup extension on the VM agent that runs on the Azure VM.

After you enable backup:

* Azure Backup installs the backup extension irrespective of the VM's running state.
* An initial backup runs in accordance with your backup schedule.
* When backups run:
  * A VM that's running has the greatest chance for capturing an application-consistent recovery point.
  * Even if the VM is turned off, it's backed up. Such a VM is called as an offline VM. In this case, the recovery point is crash consistent.
* Explicit outbound connectivity isn't required to allow backup of Azure VMs.

### Create a custom policy

To create a new backup policy, fill in the following policy settings and then select **OK**:

- **Policy name**: Specify a meaningful name.
- **Backup schedule**: Specify the timing for backups. You can take daily or weekly backups for Azure VMs.
- **Instant restore**: Specify how long you want to retain snapshots locally for Instant Restore:
    * When you restore, backed up VM disks are copied from storage across the network to the recovery storage location. With Instant Restore, you can use locally stored snapshots taken during a backup job. You don't have to wait for transfer of backup data to the vault.
    * You can retain snapshots for Instant Restore for one to five days. The default setting is *two days*.
- **Retention range**: Specify how long you want to keep your daily or weekly backup points.
- **Retention of monthly backup point** and **Retention of yearly backup point**: Specify whether you want to keep a monthly or yearly backup of your daily or weekly backups.

    To store the restore point collection, Azure Backup creates a separate resource group. This resource group is different than the resource group of the VM. [Learn more about resource groups for VMs](backup-during-vm-creation.md#azure-backup-resource-group-for-virtual-machines).

    ![Screenshot that shows the new backup policy.](./media/backup-azure-arm-vms-prepare/new-policy.png)

Azure Backup doesn't support automatic clock adjustment for daylight-saving time changes for Azure VM backups. As time changes occur, modify backup policies manually as required.

If you want hourly backups, configure the Enhanced backup policy. For more information, see [Back up an Azure VM by using the Enhanced policy](backup-azure-vms-enhanced-policy.md#create-an-enhanced-policy-and-configure-the-vm-backup).

## Trigger the initial backup

The initial backup runs based on the schedule, but you can also run it immediately:

1. Go to **Resiliency** > **Protected items**.
1. On the **Protected items** pane, for **Datasource type**, select **Azure Virtual machines**. Then search for the VM that you configured for backup.
1. Right-click the relevant row or select **More** (**…**), and then select **Backup Now**.
1. On **Backup Now**, use the calendar control to select the last day that the recovery point should be retained. Then select **OK**.
1. Monitor the portal notifications.

   To monitor the job progress, go to **Resiliency** > **Jobs** and filter the list for jobs that are in progress. Depending on the size of your VM, creating the initial backup might take a while.

## Verify the backup job status

The backup job details for each VM backup consist of two phases: **Snapshot** is followed by **Transfer data to vault**.

- **Snapshot**: Ensures that the availability of a recovery point is stored along with the disks for Instant Restore and is available for a maximum of five days depending on the snapshot retention configured by the user.
- **Transfer data to vault**: Creates a recovery point in the vault for long-term retention. **Transfer data to vault** starts only after **Snapshot** is finished.

  ![Screenshot that shows backup job status.](./media/backup-azure-arm-vms-prepare/backup-job-status.png)

Two subtasks run at the back end. One is for the front-end backup job that you can check on the **Backup** pane under **Job Details**.

  ![Screenshot that shows backup job status subtasks.](./media/backup-azure-arm-vms-prepare/backup-job-phase.png)

**Transfer data to vault** can take multiple days to finish depending on the size of the disks, the churn per disk, and other factors.

Job status can vary depending on the following scenarios:

Snapshot | Transfer data to vault | Job status
--- | --- | ---
Completed | In progress | In progress
Completed | Skipped | Completed
Completed | Completed | Completed
Completed | Failed | Completed with warning
Failed | Failed | Failed

Now with this capability, for the same VM, two backups can run in parallel. In either phase (**Snapshot** or **Transfer data to vault**), only one subtask can run. In scenarios where a backup job in progress might result in a failure of the next day's backup, this decoupling functionality avoids it. Subsequent days' backups can have the snapshot finished, while **Transfer data to vault** is skipped if an earlier day's backup job is in progress.

The incremental recovery point created in the vault captures the churn from the most recent recovery point that was created in the vault. There's no cost impact for users.

## Optional steps

### Install the VM agent

Azure Backup backs up Azure VMs by installing an extension to the Azure VM agent that runs on the machine. If your VM was created from an Azure Marketplace image, the agent is installed and running. If you create a custom VM or you migrate an on-premises machine, you might need to install the agent manually, as summarized in the following table.

VM | Details
--- | ---
Windows | 1. [Download and install](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409) the agent MSI file.<br/><br/> 2. Install with admin permissions on the machine.<br/><br/> 3. Verify the installation. In C:\WindowsAzure\Packages on the VM, right-click **WaAppAgent.exe** > **Properties**. On the **Details** tab, **Product Version** should be 2.6.1198.718 or later.<br/><br/> If you update the agent, make sure that no backup operations are running and [reinstall the agent](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409).
Linux | Install by using an RPM or a DEB package from your distribution's package repository. This method is preferred for installing and upgrading the Azure Linux agent. All the [endorsed distribution providers](/azure/virtual-machines/linux/endorsed-distros) integrate the Azure Linux agent package into their images and repositories. The agent is available on [GitHub](https://github.com/Azure/WALinuxAgent), but we don't recommend installing from there.<br/><br/> If you update the agent, make sure that no backup operations are running and update the binaries.

## Related content

* Troubleshoot any issues with [Azure VM agents](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md) or [Azure VM backup](backup-azure-vms-troubleshoot.md).
* [Restore](backup-azure-arm-restore-vms.md) Azure VMs.
