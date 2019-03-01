---
title: Manage and monitor Azure VM backups with the Azure Backup service
description: Learn how to manage and monitor Azure VM backup with the Azure Backup service.
services: backup
author: sogup
manager: vijayts
ms.service: backup
ms.topic: conceptual
ms.date: 02/17/2019
ms.author: sogup
---
# Manage Azure VM backups

This article describes how to manage Azure VMs backed up with the [Azure Backup service](backup-overview.md) backups, and summarizes backup alerts information available in the portal dashboard.


In the Azure portal, the Recovery Services vault dashboard provides access to information about the vault including:

* The latest backup, which is also the latest restore point.
* The backup policy
* The total size of all backup snapshots
* The number of VMs enabled for backup

You can manage backups using the dashboard, and by drilling down to individual VMs. Machine backup begin with opening the vault in the dashboard.

![Full view with slider](./media/backup-azure-manage-vms/bottom-slider.png)

## View VMs in the dashboard

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. On the Hub menu, click **Browse** and in the list of resources, type **Recovery Services**. As you begin typing, the list filters based on your input. Click **Recovery Services vault**.

    ![Create Recovery Services Vault step 1](./media/backup-azure-manage-vms/browse-to-rs-vaults.png)

3. For ease of use, right-click the vault in the vaults list > **Pin to dashboard**.
4. Open the vault dashboard.
    ![Open vault dashboard and Settings blade](./media/backup-azure-manage-vms/full-view-rs-vault.png)

4. On the **Backup Items** tile, click **Azure Virtual Machines**.

    ![Open backup items tile](./media/backup-azure-manage-vms/contoso-vault-1606.png)

5. In **Backup Items** blade, you can see the last backup job for each item. In this example, there is one virtual machine, demovm-markgal, protected by this vault.  

    ![Backup items tile](./media/backup-azure-manage-vms/backup-items-blade-select-item.png)


6. From the vault item dashboard, you can create or modify backup policies, view restore points, run an on-demand backup, stop and resume protection of VMs, delete recovery points, and run a restore.

    ![Backup items dashboard with Settings blade](./media/backup-azure-manage-vms/item-dashboard-settings.png)



## Manage backup policies
1. On the [vault item dashboard](#view-vms-in-the-dashboard), click **All Settings** .

    ![Backup policy blade](./media/backup-azure-manage-vms/all-settings-button.png)
2. In **Settings**, click **Backup policy**.
3. From the **Choose backup policy** menu:

   * To change policies, select a different policy and click **Save**. The new policy is immediately applied to the vault.
   * To create a policy, select **Create New**. [Learn more](backup-azure-arm-vms-prepare.md#configure-a-backup-policy)

     ![Virtual machine backup](./media/backup-azure-manage-vms/backup-policy-create-new.png)


## Run an on-demand backup
You can take an on-demand backup of a VM once it is configured for protection.
- If the initial backup is pending, on-demand backup creates a full copy of the virtual machine in the Recovery Services vault.
- If the initial backup is completed, an on-demand backup will only send changes from the previous snapshot, to the Recovery Services vault. That is, subsequent backups are always incremental.
- The retention range for an on-demand backup is the retention value specified at the time of triggering backup job.

To trigger an on-demand backup:

1. On the [vault item dashboard](#view-vms-in-the-dashboard), click **Backup Item** under the **Protected Item** section.

    ![Backup now button](./media/backup-azure-manage-vms/backup-now-button.png)

2. Click **Azure Virtual Machine** from **Backup Management Type**. The **Backup Item (Azure Virtual Machine)** blade appears.
3. Select a VM and click **Backup Now** to create an on-demand backup. The **Backup Now blade** appears.
4. In the **Retain Backup Till** option, specify a date for backup to be retained.

    ![Backup now button](./media/backup-azure-manage-vms/backup-now-check.png)

5. Click **OK**, to run the backup job.

To track the progress for the job, in the vault dashboard, click the **Backup Jobs** tile.

## Stop protecting a VM

There are two ways to stop protecting VMs:

- Stop all future backup jobs and delete all recovery points. You won't be able to restore the VM in this case.
- Stop all future backup jobs but retain the recovery points. There's a cost associated with retaining the recovery points in vault. However, the benefit of retaining the recovery points is you can restore the VM if needed. [Learn more](https://azure.microsoft.com/pricing/details/backup/) about pricing details.

>[!NOTE]
>
* If you **Stop backup** with **Retain Backup Data**, the recovery points will not expire in accordance to backup policy. You are charged for the protected instances and the consumed storage. The recovery points will only be cleaned up after you resume backup (re-enable protection) as per policy  or manually delete backup data.
* If you delete a data source without stopping backup, new backups will start failing. Again, old recovery points will expire according to policy, but one last recovery point will always be retained until you stop backup and delete the data.

To stop protection for a virtual machine:

1. On the [vault item dashboard](#view-vms-in-the-dashboard), click **Stop backup**.
2. Choose whether to retain or delete the backup data, and confirm as needed. Confirm as required and optionally provide a comment. If you aren't sure of the item name, hover over the exclamation mark to view the name.

    ![Stop protection](./media/backup-azure-manage-vms/retain-or-delete-option.png)

 A notification message lets you know the backup jobs have been stopped.


## Resume protection of a VM

If you retained backup data when the VM was stopped, you can resume protection. If you deleted backup data then you can't resume.

To resume protection for the virtual machine:

1. On the [vault item dashboard](#view-vms-in-the-dashboard), click **Resume backup**.

2. Follow the steps in [Manage backup policies](#manage-backup-policies) to assign the policy for the virtual machine. you can choose a different policy than the policy with which virtual machine was protected initially.
3. After the backup policy is applied to the virtual machine, you see the following message.

    ![Successfully protected VM](./media/backup-azure-manage-vms/success-message.png)

## Delete Backup data

You can delete the backup data associated with a VM during the **Stop backup** job, or anytime after the backup job has completed.

- It may even be beneficial to wait days or weeks before deleting the recovery points.
- Unlike restoring recovery points, when deleting backup data, you cannot choose specific recovery points to delete. If you choose to delete your backup data, you delete all recovery points associated with the item.

This procedure assumes the Backup job for the VM has been stopped or disabled.


1. On the [vault item dashboard](#view-vms-in-the-dashboard), click **Delete backup**.

    ![VM Type](./media/backup-azure-manage-vms/delete-backup-buttom.png)

2. Type the name of the item to confirm you want to delete the recovery points.

    ![Stop verification](./media/backup-azure-manage-vms/item-verification-box.png)

4. To delete the backup data for the current item, click
    ![Stop backup button](./media/backup-azure-manage-vms/delete-button.png)

    A notification message lets you know the backup data has been deleted.

## Next steps
- [Learn about](backup-azure-vms-first-look-arm.md) backing up Azure VMs from VM settings.
- [Learn about](backup-azure-arm-restore-vms.md) restoring VMs.
- [Learn about](backup-azure-monitor-vms.md) monitoring Azure VM backups.
