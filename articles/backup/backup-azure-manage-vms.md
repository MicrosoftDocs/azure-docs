---
title: Manage and monitor Azure VM backups by using the Azure Backup service
description: Learn how to manage and monitor Azure VM backups by using the Azure Backup service.
services: backup
author: sogup
manager: vijayts
ms.service: backup
ms.topic: conceptual
ms.date: 03/13/2019
ms.author: sogup
---
# Manage Azure VM backups

This article describes how to manage Azure virtual machines (VMs) that are backed up by using the [Azure Backup service](backup-overview.md). The article also summarizes the backup information you can find on the vault dashboard.


In the Azure portal, the Recovery Services vault dashboard provides access to vault information, including:

* The latest backup, which is also the latest restore point.
* The backup policy.
* The total size of all backup snapshots.
* The number of VMs that are enabled for backups.

You can manage backups by using the dashboard and by drilling down to individual VMs. To begin machine backups, open the vault on the dashboard.

![Full dashboard view with slider](./media/backup-azure-manage-vms/bottom-slider.png)

## View VMs on the dashboard

To view VMs on the vault dashboard:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. On the Hub menu, select **Browse**. In the list of resources, type **Recovery Services**. As you type, the list is filtered based on your input. Select **Recovery Services vaults**.

    ![Create a Recovery Services vault](./media/backup-azure-manage-vms/browse-to-rs-vaults.png)

3. For ease of use, right-click the vault and select **Pin to dashboard**.
4. Open the vault dashboard.

    ![Open the vault dashboard and Settings blade](./media/backup-azure-manage-vms/full-view-rs-vault.png)

5. On the **Backup Items** tile, select **Azure Virtual Machines**.

    ![Open the Backup Items tile](./media/backup-azure-manage-vms/contoso-vault-1606.png)

6. On the **Backup Items** blade, you can view the list of protected VMs. In this example, the vault protects one virtual machine: demobackup.  

    ![View the Backup Items blade](./media/backup-azure-manage-vms/backup-items-blade-select-item.png)

7. From the vault item's dashboard, modify backup policies, run an on-demand backup, stop or resume protection of VMs,  delete backup data, view restore points, and run a restore.

    ![The Backup Items dashboard and the Settings blade](./media/backup-azure-manage-vms/item-dashboard-settings.png)

## Manage backup policy for a VM

To manage a backup policy:

1. Sign in to the [Azure portal](https://portal.azure.com/). Open the vault dashboard.
2. On the **Backup Items** tile, select **Azure Virtual Machines**.

    ![Open the Backup Items tile](./media/backup-azure-manage-vms/contoso-vault-1606.png)

3. On the **Backup Items** blade, you can view the list of protected VMs and last backup status with latest restore points time.

    ![View the Backup Items blade](./media/backup-azure-manage-vms/backup-items-blade-select-item.png)

4. From the vault item's dashboard, you can select a backup policy.

   * To switch policies, select a different policy and then select **Save**. The new policy is immediately applied to the vault.

     ![Choose a backup policy](./media/backup-azure-manage-vms/backup-policy-create-new.png)

## Run an on-demand backup
You can run an on-demand backup of a VM after you set up its protection. Keep these details in mind:

- If the initial backup is pending, on-demand backup creates a full copy of the VM in the Recovery Services vault.
- If the initial backup is complete, an on-demand backup will only send changes from the previous snapshot to the Recovery Services vault. That is, later backups are always incremental.
- The retention range for an on-demand backup is the retention value that you specify when you trigger the backup.

To trigger an on-demand backup:

1. On the [vault item dashboard](#view-vms-on-the-dashboard), under **Protected Item**, select **Backup Item**.

    ![The Backup now option](./media/backup-azure-manage-vms/backup-now-button.png)

2. From **Backup Management Type**, select **Azure Virtual Machine**. The **Backup Item (Azure Virtual Machine)** blade appears.
3. Select a VM and select **Backup Now** to create an on-demand backup. The **Backup Now** blade appears.
4. In the **Retain Backup Till** field, specify a date for the backup to be retained.

    ![The Backup Now calendar](./media/backup-azure-manage-vms/backup-now-check.png)

5. Select **OK** to run the backup job.

To track the job's progress, on the vault dashboard, select the **Backup Jobs** tile.

## Stop protecting a VM

There are two ways to stop protecting a VM:

- Stop all future backup jobs and delete all recovery points. In this case, you won't be able to restore the VM.
- Stop all future backup jobs and keep the recovery points. Although you'll need to pay to keep the recovery points in the vault, you'll be able to restore the VM if needed. For more information, see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/).

>[!NOTE]
>If you delete a data source without stopping backups, new backups will fail. Old recovery points will expire according to the policy, but one last recovery point will always be kept until you stop the backups and delete the data.
>

To stop protection for a VM:

1. On the [vault item's dashboard](#view-vms-on-the-dashboard), select **Stop backup**.
2. Choose whether to retain or delete the backup data, and confirm your selection as needed. Add a comment if you want. If you aren't sure of the item's name, hover over the exclamation mark to view the name.

    ![Stop protection](./media/backup-azure-manage-vms/retain-or-delete-option.png)

     A notification lets you know that the backup jobs have been stopped.

## Resume protection of a VM

If you keep backup data when you stop the VM, you can later resume protection. If you delete the backup data, you can't resume protection.

To resume protection for a VM:

1. On the [vault item's dashboard](#view-vms-on-the-dashboard), select **Resume backup**.

2. Follow the steps in [Manage backup policies](#manage-backup-policy-for-a-vm) to assign the policy for the VM. You don't need to choose the VM's initial protection policy.
3. After you apply the backup policy to the VM, you see the following message:

    ![Message indicating a successfully protected VM](./media/backup-azure-manage-vms/success-message.png)

## Delete backup data

You can delete a VM's backup data during the **Stop backup** job or after the backup job finishes. Before you delete backup data, keep these details in mind:

- It might be a good idea to wait days or weeks before you delete the recovery points.
- Unlike the process for restoring recovery points, when you delete backup data, you can't choose specific recovery points to delete. If you delete your backup data, you delete all associated recovery points.

After you stop or disable the VM's backup job, you can delete the backup data:


1. On the [vault item dashboard](#view-vms-on-the-dashboard), select **Delete backup data**.

    ![Select Delete backup](./media/backup-azure-manage-vms/delete-backup-buttom.png)

1. Type the name of the backup item to confirm that you want to delete the recovery points.

    ![Confirm that you want to delete the recovery points](./media/backup-azure-manage-vms/item-verification-box.png)

1. To delete the backup data for the item, select **Delete**. A notification message lets you know that the backup data has been deleted.

## Next steps
- Learn how to [back up Azure VMs from the VM's settings](backup-azure-vms-first-look-arm.md).
- Learn how to [restore VMs](backup-azure-arm-restore-vms.md).
- Learn how to [monitor Azure VM backups](backup-azure-monitor-vms.md).
