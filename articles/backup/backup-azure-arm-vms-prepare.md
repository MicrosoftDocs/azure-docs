---
title: Back Up Azure VMs in a Recovery Services Vault
description: This article describes how to back up Azure VMs in a Recovery Services vault by using Azure Backup.
ms.topic: how-to
ms.date: 09/09/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a cloud administrator, I want to configure a backup for Azure VMs by using a Recovery Services vault so that I can ensure data protection and recovery options are in place for my virtual machines.
---

# Back up Azure VMs in a Recovery Services vault

This article describes how to back up Azure virtual machines (VMs) in an Azure Recovery Services vault by using [Azure Backup](backup-overview.md).

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
* [Learn about](backup-azure-vms-introduction.md) Azure VM backup, and the backup extension.
* [Review the support matrix](backup-support-matrix-iaas.md) before you configure backup.

In some circumstances, you might also need to do:

* **Install the VM agent on the VM**: Backup backs up Azure VMs by installing an extension to the Azure VM agent that runs on the machine. If your VM was created from an Azure Marketplace image, the agent is installed and running. If you create a custom VM or you migrate an on-premises machine, you might need to [install the agent manually](#install-the-vm-agent).

[!INCLUDE [backup-center.md](../../includes/backup-center.md)]

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

### Modify storage replication

By default, vaults use [geo-redundant storage (GRS)](../storage/common/storage-redundancy.md#geo-redundant-storage):

* If the vault is your primary backup mechanism, we recommend that you use GRS.
* [Locally redundant storage](../storage/common/storage-redundancy.md#locally-redundant-storage) is a less-expensive option.
* [Zone-redundant storage](../storage/common/storage-redundancy.md#zone-redundant-storage) replicates your data in [availability zones](../reliability/availability-zones-overview.md) for data residency and resiliency in the same region.

Modify the storage replication type:

1. In the new vault, in the **Settings** section, select **Properties**.
1. In **Properties**, under **Backup Configuration**, select **Update**.
1. Select the storage replication type, and then select **Save**.

    ![Screenshot that shows setting the storage configuration for a new vault.](./media/backup-azure-arm-vms-prepare/full-blade.png)

> [!NOTE]
   > You can't modify the storage replication type after the vault is set up and contains backup items. If you want to do this, you need to re-create the vault.

## Apply a backup policy

To apply a backup policy to your Azure VMs, follow these steps:

1. Go to the Backup center. On the **Overview** tab, select **+ Backup**.

   ![Screenshot that shows the Backup button.](./media/backup-azure-arm-vms-prepare/backup-button.png)

1. For **Datasource type**, select **Azure Virtual machines**, and select the vault that you created. Then select **Continue**.

   ![Screenshot that shows Backup and Backup Goal panes.](./media/backup-azure-arm-vms-prepare/select-backup-goal-1.png)

1. Assign a backup policy.

    - The default policy backs up the VM once a day. The daily backups are retained for 30 days. Instant recovery snapshots are retained for two days.

      ![Screenshot that shows the default backup policy.](./media/backup-azure-arm-vms-prepare/default-policy.png)

    - If you don't want to use the default policy, select **Create New**, and create a custom policy as described in the next procedure.

1. Under **Virtual Machines**, select **Add**.

      ![Screenshot that shows adding virtual machines.](./media/backup-azure-arm-vms-prepare/add-virtual-machines.png)

1. On the **Select virtual machines** pane, select the VMs that you want to back up by using the policy. Then select **OK**.

   * The selected VMs are validated.
   * You can select only VMs in the same region as the vault.
   * VMs can only be backed up in a single vault.

     ![Screenshot that shows the Select virtual machines pane.](./media/backup-azure-arm-vms-prepare/select-vms-to-backup.png)

    >[!NOTE]
    >- All the VMs in the same region and subscription as that of the vault are available to configure backup. When you configure backup, you can browse to the VM name and its resource group, even though you don't have the required permission on those VMs. If your VM is in the soft-delete state, then it won't be visible in this list. If you need to re-protect the VM, then you need to wait for the soft-delete period to expire or undelete the VM from the soft-deleted list. For more information, see [Soft delete for VMs using Azure portal](soft-delete-virtual-machines.md#soft-delete-for-vms-using-azure-portal).
    >- To change Recovery Services vault of a VM, firstly you need to stop the backup then you can assign a new vault to the VM.

1. In **Backup**, select **Enable backup**. This action deploys the policy to the vault and the VMs, and installs the backup extension on the VM agent that runs on the Azure VM.

After you enable backup:

* The Backup service installs the backup extension whether or not the VM is running.
* An initial backup runs in accordance with your backup schedule.
* When backups run:
  * A VM that's running has the greatest chance for capturing an application-consistent recovery point.
  * Even if the VM is turned off, it's backed up. Such a VM is known as an offline VM. In this case, the recovery point is crash-consistent.
* Explicit outbound connectivity isn't required to allow backup of Azure VMs.

### Create a custom policy

If you selected to create a new backup policy, fill in the policy settings.


- **Policy name**: Specify a meaningful name.
- **Backup schedule**: Specify when backups should be taken. You can take daily or weekly backups for Azure VMs.
- **Instant Restore**: Specify how long you want to retain snapshots locally for Instant Restore.
    * When you restore, backed up VM disks are copied from storage across the network to the recovery storage location. With Instant Restore, you can leverage locally stored snapshots taken during a backup job, without waiting for backup data to be transferred to the vault.
    * You can retain snapshots for Instant Restore for one to five days. The default setting is *two days*.
- **Retention range**: Specify how long you want to keep your daily or weekly backup points.
- **Retention of monthly backup point** and **Retention of yearly backup point**: Specify whether you want to keep a monthly or yearly backup of your daily or weekly backups.
- Select **OK** to save the policy.
    > [!NOTE]
    > To store the restore point collection (RPC), Backup creates a separate resource group (RG). This RG is different than the RG of the VM. [Learn more](backup-during-vm-creation.md#azure-backup-resource-group-for-virtual-machines).

    ![Screenshot that shows the new Backup policy.](./media/backup-azure-arm-vms-prepare/new-policy.png)

> [!NOTE]
>- Backup doesn't support automatic clock adjustment for daylight-saving changes for Azure VM backups. As time changes occur, modify backup policies manually as required.
>- If you want hourly backups, then you can configure the *Enhanced backup policy*. For more information, see [Back up an Azure VM by using the Enhanced policy](backup-azure-vms-enhanced-policy.md#create-an-enhanced-policy-and-configure-vm-backup).

## Trigger the initial backup

The initial backup run based on the schedule, but you can also run it immediately:

1. Go to Backup center and select the **Backup Instances** menu item.
1. For **Datasource type**, select **Azure Virtual machines**. Then search for the VM that you configured for backup.
1. Right-click the relevant row or select the more icon (**…**), and then select **Backup Now**.
1. In **Backup Now**, use the calendar control to select the last day that the recovery point should be retained. Then select **OK**.
1. Monitor the portal notifications.
   To monitor the job progress, go to **Backup center** > **Backup Jobs** and filter the list for **In progress** jobs. Depending on the size of your VM, creating the initial backup might take a while.

## Verify Backup job status

The Backup job details for each VM backup consist of two phases. The *Snapshot* phase is followed by the *Transfer data to vault* phase.<br/>
The snapshot phase ensures the availability of a recovery point stored along with the disks for **Instant Restores** and are available for a maximum of five days depending on the snapshot retention configured by the user. *Transfer data to vault* creates a recovery point in the vault for long-term retention. Transfer data to vault starts only after the snapshot phase is finished.

  ![Screenshot that shows Backup Job status.](./media/backup-azure-arm-vms-prepare/backup-job-status.png)

Two **Sub Tasks** run at the back end. One is for the front-end backup job that you can check on the **Backup Job** details pane.

  ![Screenshot that shows Backup Job Status subtasks.](./media/backup-azure-arm-vms-prepare/backup-job-phase.png)

The **Transfer data to vault** phase can take multiple days to finish depending on the size of the disks, the churn per disk, and several other factors.

Job status can vary depending on the following scenarios.

Snapshot | Transfer data to vault | Job status
--- | --- | ---
Completed | In progress | In progress
Completed | Skipped | Completed
Completed | Completed | Completed
Completed | Failed | Completed with warning
Failed | Failed | Failed

Now with this capability, for the same VM, two backups can run in parallel, but in either phase (snapshot, transfer data to vault) only one sub task can be running. So in scenarios where a backup job in progress resulted in the next day’s backup to fail, it will be avoided with this decoupling functionality. Subsequent days' backups can have the snapshot completed, while **Transfer data to vault** is skipped if an earlier day’s backup job is in progress state.
The incremental recovery point created in the vault will capture all the churn from the most recent recovery point created in the vault. There's no cost impact on the user.

## Optional steps

### Install the VM agent

Azure Backup backs up Azure VMs by installing an extension to the Azure VM agent running on the machine. If your VM was created from an Azure Marketplace image, the agent is installed and running. If you create a custom VM, or you migrate an on-premises machine, you might need to install the agent manually, as summarized in the table.

VM | Details
--- | ---
Windows | 1. [Download and install](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409) the agent MSI file.<br/><br/> 2. Install with admin permissions on the machine.<br/><br/> 3. Verify the installation. In C:\WindowsAzure\Packages on the VM, right-click **WaAppAgent.exe** > **Properties**. On the **Details** tab, **Product Version** should be 2.6.1198.718 or later.<br/><br/> If you update the agent, make sure that no backup operations are running and [reinstall the agent](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409).
Linux | Install by using an RPM or a DEB package from your distribution's package repository. This method is preferred for installing and upgrading the Azure Linux agent. All the [endorsed distribution providers](/azure/virtual-machines/linux/endorsed-distros) integrate the Azure Linux agent package into their images and repositories. The agent is available on [GitHub](https://github.com/Azure/WALinuxAgent), but we don't recommend installing from there.<br/><br/> If you update the agent, make sure that no backup operations are running and update the binaries.

## Related content

* Troubleshoot any issues with [Azure VM agents](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md) or [Azure VM backup](backup-azure-vms-troubleshoot.md).
* [Restore](backup-azure-arm-restore-vms.md) Azure VMs.
