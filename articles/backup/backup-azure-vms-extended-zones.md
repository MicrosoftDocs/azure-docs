---
title: Back Up an Azure Virtual Machine with Azure Extended Zones Portal
description: In this article, learn how to back up an Azure virtual machine (VM) with the Azure Backup Extended Zones service.
ms.topic: how-to
ms.date: 01/21/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As an IT administrator, I want to back up Azure virtual machines using the Azure portal, so that I can protect data and ensure high availability through enhanced resiliency in Azure Extended Zones."
---

# Back up an Azure virtual machine in Azure Extended Zones

This article describes how to back up an existing Azure VM by using the Azure portal.

You can create Azure backups through the Azure portal. You can use the browser-based interface to create and configure backups and related resources to protect your data by taking regular backups. [Azure Backup](backup-overview.md) creates and stores recovery points in geo-redundant recovery vaults.

[Azure Extended Zones](../extended-zones/overview.md) provide enhanced resiliency by distributing resources across multiple physical locations within an Azure region. This approach minimizes the impact of potential failures for critical infrastructure. With Extended Zones, your organization can achieve higher availability and fault tolerance for its applications.

## Before you start

Before you back up a VM in Extended Zones, review the [supported scenario](./backup-support-matrix-iaas.md).

[!INCLUDE [backup-create-rs-vault.md](../../includes/backup-create-rs-vault.md)]

## Apply a backup policy

To apply a backup policy to your Azure VMs, follow these steps:

1. Go to **Resiliency** and select **+ Configure protection**.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/configure-protection.png" alt-text="Screenshot that shows how to start configuring the system backup." lightbox="./media/backup-azure-arm-vms-prepare/configure-protection.png":::

1. On the **Configure protection** pane, fill in the following fields:
     - **Resources managed by**: Select **Azure**.
     - **Datasource type**: Select **Azure Virtual machines**.
     - **Solution**: Select **Azure Backup**.
   
    Then select **Continue**.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/configure-system-protection.png" alt-text="Screenshot that shows how to set the system backup." lightbox="./media/backup-azure-arm-vms-prepare/configure-system-protection.png":::

1. On the **Start: Configure Backup** pane, for **Datasource type**, select **Azure Virtual machines**. Select the vault that you created, and then select **Continue**.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/select-backup-goal-1.png" alt-text="Screenshot that shows the Configure backup pane." lightbox="./media/backup-azure-arm-vms-prepare/select-backup-goal-1.png":::

1. Select the [Enhanced backup policy](./backup-azure-vms-enhanced-policy.md) because that policy is compatible with Extended Zones.

   > [!NOTE]
   > To enable Azure Backup on Azure VMs in Extended Zones, you can only use the Enhanced policy. This policy allows multiple daily backups and enables hourly backups. [Learn more about the Enhanced policy](backup-azure-vms-enhanced-policy.md).
1. Assign the backup policy.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/default-policy.png" alt-text="Screenshot that shows the default backup policy." lightbox="./media/backup-azure-arm-vms-prepare/default-policy.png":::

   If you don't want to use the default policy, select **Create New**, and create a custom policy as described in the next procedure.

## Select a VM to back up

To create a scheduled daily backup to a Recovery Services vault, follow these steps:

1. Under **Virtual Machines**, select **Add**.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/add-virtual-machines.png" alt-text="Screenshot that shows adding virtual machines." lightbox="./media/backup-azure-arm-vms-prepare/add-virtual-machines.png":::

1. When the **Select virtual machines** pane opens, select the VMs that you want to back up by using the policy. Then select **OK**.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/select-vms-to-backup.png" alt-text="Screenshot that shows the Select virtual machines pane." lightbox="./media/backup-azure-arm-vms-prepare/select-vms-to-backup.png":::

   
   You can configure backup for all VMs in the same region and subscription as the vault.

## Enable backup on a VM

A Recovery Services vault is a logical container that stores backup data for protected resources like Azure VMs. When a backup job runs for a protected resource, it creates a recovery point in the Recovery Services vault. You can use these recovery points to restore data to a specific point in time.

To enable VM backup, in **Backup**, select **Enable backup**. This step deploys the policy to the vault and to the VMs. The backup extension is installed on the VM agent that runs on the Azure VM.

After you enable backup:

- Backup installs the backup extension whether or not the VM is running.
- An initial backup runs in accordance with your backup schedule.
- When backups run:
  - A VM that's running has the highest chance for capturing an application-consistent recovery point.
  - If the VM is turned off (an offline VM), it's still backed up, which results in a crash-consistent recovery point.
- Explicit outbound connectivity isn't required for backup of Azure VMs.

### Create a custom policy

If you selected to create a new backup policy, fill in the policy settings.

1. On the **Backup policy** pane, fill in the following fields:

    - **Policy name**: Specify a meaningful name.
    - **Backup schedule**: Specify when backups should be taken. You can take daily or weekly backups for Azure VMs.
    - **Instant Restore**: Specify how long you want to retain snapshots locally for Instant Restore:
        * When you restore, backed-up VM disks are copied from storage across the network to the recovery storage location. With Instant Restore, you can use locally stored snapshots taken during a backup job without waiting for the backup data to transfer to the vault.
        * You can retain snapshots for Instant Restore from one to five days. The default value is two days.
    - **Retention range**: Specify how long you want to keep your daily or weekly backup points.
    - **Retention of monthly backup point** and **Retention of yearly backup point**: Specify whether you want to keep a monthly or yearly backup of your daily or weekly backups.
1. Select **OK** to save the policy.
   
   To enable Azure Backup on Azure VMs in Extended Zones, use only the Enhanced policy. Backup creates a separate resource group to store the restore point collection. This resource group is different from the resource group of the VM.

    :::image type="content" source="./media/backup-azure-arm-vms-prepare/new-policy.png" alt-text="Screenshot that shows the new backup policy." lightbox="./media/backup-azure-arm-vms-prepare/new-policy.png":::

## Run an on-demand backup

The initial backup runs in accordance with the schedule in the backup policy. To run a backup job immediately, follow these steps:

1. Go to **Backup center** and select **Backup Instances**.
1. For **Datasource type**, select **Azure Virtual machines**. Then search for the VM that you configured for backup.
1. Select the relevant row or select the more icon (**…**), and then select **Backup Now**.
1. On **Backup Now**, use the calendar control to select the last day that the recovery point should be retained. Then select **OK**.

## Monitor the backup job

Monitor the portal notifications. To monitor the job progress, go to **Resiliency** > **Monitoring + Reporting** > **Jobs** and filter the list for **In progress** jobs. Depending on the size of your VM, creating the initial backup might take a while.

Backup job details for each VM backup consist of the following phases:

- **Snapshot**: Ensures that the availability of a recovery point is stored along with the disks for instant restores. They're available for a maximum of five days depending on the snapshot retention that the user configured.
- **Transfer data to vault**: Creates a recovery point in the vault for long-term retention. This phase starts after the snapshot phase is finished.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/backup-job-status.png" alt-text="Screenshot that shows the backup job status." lightbox="./media/backup-azure-arm-vms-prepare/backup-job-status.png":::

Two subtasks run at the back end. One is for the front-end backup job that you can check on the **Backup Job Details** pane.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/backup-job-phase.png" alt-text="Screenshot that shows backup job status subtasks." lightbox="./media/backup-azure-arm-vms-prepare/backup-job-phase.png":::

Transfer data to vault can take multiple days to complete depending on the size of the disks, churn per disk, and several other factors.

Job status can vary depending on the following scenarios:

Snapshot | Transfer data to vault | Job status
--- | --- | ---
Completed | In progress | In progress
Completed | Skipped | Completed
Completed | Completed | Completed
Completed | Failed | Completed with warning
Failed | Failed | Failed

With this capability, for the same VM, two backups can run in parallel, but only one subtask can run at a time in either the snapshot phase or the transfer data to vault phase. This decoupling prevents next-day backups from failing because of a backup job already in progress. Subsequent days' backups can have the snapshot completed, while transfer data to vault is skipped if an earlier day's backup job is in an in-progress state.

The incremental recovery point created in the vault captures all the churn from the most recent recovery point created in the vault. There's no cost impact on the user.

## Optional steps

### Install the VM agent

Azure Backup backs up Azure VMs by installing an extension to the Azure VM agent that runs on the machine. If your VM was created from an Azure Marketplace image, the agent is already installed and running. If you create a custom VM or migrate an on-premises machine, you might need to install the agent manually, as summarized in the following table.

VM | Details
--- | ---
Windows | 1. [Download and install](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409) the agent MSI file. <br><br> 2. Install with admin permissions on the machine. <br><br> 3. Verify the installation. In C:\WindowsAzure\Packages on the VM, right-click **WaAppAgent.exe** > **Properties**. On the **Details** tab, **Product Version** should be 2.6.1198.718 or later. <br><br> If you update the agent, make sure that no backup operations are running and [reinstall the agent](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409).
Linux | Install by using an RPM or a DEB package from your distribution's package repository. This method is preferred for installing and upgrading the Azure Linux agent. All the [endorsed distribution providers](/azure/virtual-machines/linux/endorsed-distros) integrate the Azure Linux agent package into their images and repositories. The agent is available on [GitHub](https://github.com/Azure/WALinuxAgent), but we don't recommend installing from there. <br><br> If you're updating the agent, make sure that no backup operations are running, and update the binaries.</li><ul>

## Clean up deployment

When no longer needed, you can disable protection on the VM, and remove the restore points and Recovery Services vault. Then you can delete the resource group and associated VM resources.

If you want to restore the VM by using the recovery points, skip the steps in this section and go to [Related content](#related-content).

1. Select the **Backup** option for your VM.

1. Select **Stop backup**.

   :::image type="content" source="./media/quick-backup-vm-portal/stop-backup.png" alt-text="Screenshot that shows stopping VM backup from the Azure portal." lightbox="./media/quick-backup-vm-portal/stop-backup.png":::

1. Select **Delete Backup Data** from the dropdown menu.

1. In the **Type the name of the Backup item** dialog, enter your VM name, such as **myVM**. Select **Stop Backup**.

    After the VM backup is stopped and recovery points are removed, you can delete the resource group. If you used an existing VM, you might want to leave the resource group and VM in place.

1. On the menu on the left, select **Resource groups**.
1. From the list, choose your resource group. If you used the sample VM quickstart commands, the resource group is named **myResourceGroup**.
1. Select **Delete resource group**. To confirm, enter the resource group name, and then select **Delete**.

## Related content

- To learn more about Extended Zones, see [Azure Extended Zones](../extended-zones/overview.md).
- To learn more about Azure VM restore, see [Azure VM restore](./about-azure-vm-restore.md).