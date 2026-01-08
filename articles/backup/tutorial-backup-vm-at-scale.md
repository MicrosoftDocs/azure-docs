---
title: Tutorial - Back Up Multiple Azure Virtual Machines by Using Azure Backup
description: In this tutorial, learn how to create a Recovery Services vault, define a backup policy, and simultaneously back up multiple virtual machines.
ms.date: 09/24/2025
ms.topic: tutorial
ms.custom: mvc, engagement-fy24
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
#customer intent: As an IT admin, I want to back up multiple Azure virtual machines by using a Recovery Services vault and a backup policy, so that I can ensure data protection and streamline management for my organization.
---

# Tutorial: Back up multiple virtual machines by using the Azure portal

This tutorial describes how to back up multiple virtual machines (VMs) by using the Azure portal.

Azure stores backup data in a Recovery Services vault, which is accessible from the **Settings** menu of most services. This integration simplifies the backup process. However, managing each database or virtual machine separately can be tedious. To streamline backups for multiple virtual machines (for department or location), you can create a backup policy and apply it to the relevant machines.

In this tutorial, you:

> [!div class="checklist"]
>
> - Create a Recovery Services vault.
> - Set the vault to help protect virtual machines.
> - Create a custom backup and retention policy.
> - Assign the policy to help protect multiple virtual machines.
> - Trigger an on-demand back up for virtual machines.

[!INCLUDE [backup-center.md](../../includes/backup-center.md)]

[!INCLUDE [How to create a Recovery Services vault](../../includes/backup-create-rs-vault.md)]

When you create a Recovery Services vault, the vault has geo-redundant storage by default. To provide data resiliency, geo-redundant storage replicates the data multiple times across two Azure regions.

## Set a backup policy for VMs

After creation of the Recovery Services vault is complete, configure the vault for the data type backup and set the backup policy. The policy defines the schedule for recovery points and their retention period. In this tutorial, assume that you have a business (a sports complex with a hotel, stadium, and restaurants) that requires VM data protection.

To set a backup policy for your Azure VMs, follow these steps:

1. Go to **Backup center**. On the **Overview** tab, select **+Backup**.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/backup-button.png" alt-text="Screenshot that shows the Backup button.":::

1. On the **Start: Configure Backup** pane, select **Azure Virtual machines** as the **Datasource type** value, and then select the vault that you created. Then select **Continue**.

   :::image type="content" source="./media/backup-azure-arm-vms-prepare/select-backup-goal-1.png" alt-text="Screenshot that shows the selection of a data-source type and a vault type.":::

1. Assign a backup policy:

    - The default policy backs up the VM once a day. The daily backups are retained for 30 days. Instant recovery snapshots are retained for 2 days.

      :::image type="content" source="./media/backup-azure-arm-vms-prepare/default-policy.png" alt-text="Screenshot that shows options and details for a backup policy.":::

    - If you don't want to use the default policy, select **Create a new policy**, and then create a custom policy.

1. Under **Virtual Machines**, select **Add**.

    :::image type="content" source="./media/backup-azure-arm-vms-prepare/add-virtual-machines.png" alt-text="Screenshot that shows the button for adding virtual machines.":::

1. The **Select virtual machines** pane opens. Select the VMs that you want to back up by using the policy. Then select **OK**.

   The following considerations apply:

   - The selected VMs are validated.
   - You can select only VMs in the same region as the vault.
   - VMs can be backed up only in a single vault.

    :::image type="content" source="./media/backup-azure-arm-vms-prepare/select-vms-to-backup.png" alt-text="Screenshot that shows the pane for selecting virtual machines.":::

    > [!NOTE]
    > All the VMs in the same region and subscription as that of the vault are available for configuring a backup. When you configure backup, you can browse to each VM's name and its resource group, even though you don't have the required permission on those VMs.
    >
    > If your VM is in soft-deleted state, it isn't visible in this list. If you need to protect the VM again, wait for the soft-delete period to expire or restore the VM from the soft-deleted list. For more information, see the [article about soft delete for VMs](soft-delete-virtual-machines.md#soft-delete-azure-vm-backups).

1. In **Backup**, select **Enable backup**. This selection deploys the policy to the vault and to the VMs. It also installs the backup extension on the VM agent that runs on the Azure VM.

After you enable a backup:

- The Azure Backup service installs the backup extension whether or not the VM is running.
- An initial backup runs in accordance with your backup schedule.

When backups run, note that:

- A VM that's running has the greatest chance for capturing an application-consistent recovery point.
- Even if a VM is offline, it's backed up. In this case, the recovery point is crash-consistent.
- Explicit outbound connectivity isn't required for backing up Azure VMs.

> [!NOTE]
> You can also set an [Enhanced policy](backup-azure-vms-enhanced-policy.md) to back up Azure VMs multiple times a day.

## Run an initial backup

You enabled backups for the Recovery Services vaults, but you haven't created an initial backup. A best practice for disaster recovery is to trigger the initial backup so that your data is protected.

The initial backup runs in accordance with the schedule, but you can run it immediately as follows:

1. Go to **Backup center** and select **Backup Instances**.

1. For **Datasource type**, select **Azure Virtual machines**. Then search for the VM that you configured for backups.

1. Right-click the relevant row or select the more icon (**…**), and then select **Backup Now**.

1. In **Backup Now**, use the calendar control to select the last day that the recovery point should be retained. Then select **OK**.

1. Monitor the portal notifications. To monitor the job's progress, go to **Backup center** > **Backup Jobs** and filter the list for **In progress** jobs.

   Depending on the size of your VM, creating the initial backup might take a while.

## Clean up resources

If you plan to work with subsequent tutorials, don't clean up the resources that you created in this tutorial.

If you don't plan to continue, delete all resources that you created in this tutorial. In the Azure portal, follow these steps:

1. On the **myRecoveryServicesVault** dashboard, under **Backup items**. select **3**.

    :::image type="content" source="./media/tutorial-backup-vm-at-scale/tutorial-vm-back-up-now.png" alt-text="Screenshot that shows the number of backup items as a link on the dashboard.":::

1. On the **Backup items** pane, select **Azure Virtual Machine** to open the list of virtual machines associated with the vault.

    :::image type="content" source="./media/tutorial-backup-vm-at-scale/three-virtual-machines.png" alt-text="Screenshot that shows a list of backup management types.":::

1. In the list of backup items, select the ellipsis for the **myVM** item.

    :::image type="content" source="./media/tutorial-backup-vm-at-scale/context-menu-to-delete-vm.png" alt-text="Screenshot that shows the ellipsis button for a backup item.":::

1. On the menu that opens, select **Stop backup**.

    :::image type="content" source="./media/tutorial-backup-vm-at-scale/context-menu-for-delete.png" alt-text="Screenshot that shows the Stop backup menu.":::

1. On the **Stop Backup** pane, in the uppermost box, select **Delete Backup Data**.

1. In the **Type the name of the Backup Item** box, enter **myVM**.

1. After the backup item is verified, a check mark appears. Select the **Stop backup** button to stop the policy and delete the restore points.

    :::image type="content" source="./media/tutorial-backup-vm-at-scale/provide-reason-for-delete.png" alt-text="Screenshot that shows selections for stopping a backup.":::

    > [!NOTE]
    > Deleted items stay in a soft-deleted state for 14 days. You can delete the vault after that period. For more information, see [Delete an Azure Backup Recovery Services vault](backup-azure-delete-vault.md).

1. When no more items are in the vault, select **Delete**.

    :::image type="content" source="./media/tutorial-backup-vm-at-scale/deleting-the-vault.png" alt-text="Screenshot that shows the Delete button in an empty vault.":::

    After you delete the vault, you return to the list of Recovery Services vaults.

## Next step

Continue to the next tutorial to restore an Azure virtual machine from disk:

> [!div class="nextstepaction"]
> [Restore a VM by using the Azure CLI](./tutorial-restore-disk.md)
