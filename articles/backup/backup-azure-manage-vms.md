
<properties
	pageTitle="Azure Backup - manage virtual machines"
	description="Learn how to manage an Azure virtual machine"
	services="backup"
	documentationCenter=""
	authors="jimpark"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/28/2015"
	ms.author="jimpark"/>

# Manage virtual machines


## Manage protected virtual machines

1. To view and manage backup settings for a virtual machine click the **Protected Items** tab.

  - Click on the name of a protected item to see the **Backup Details** tab, which shows you information about the last backup.

        ![Virtual machine backup](./media/backup-azure-manage-vms/backup-vmdetails.png)

2. To view and manage backup policy settings for a virtual machine click the **Policies** tab.

  - The **Backup Policies** tab shows you the existing policy. You can modify as needed. If you need to create a new policy click **Create** on the **Policies** page. Note that if you want to remove a policy it shouldn't have any virtual machines associated with it.

        ![Virtual machine policy](./media/backup-azure-manage-vms/backup-vmpolicy.png)

3. You can get more information about actions or status for a virtual machine on the **Jobs** page. Click a job in the list to get more details, or filter jobs for a specific virtual machine.

    ![Jobs](./media/backup-azure-manage-vms/backup-job.png)

## On-demand backup of a virtual machine
You can take an on-demand backup of a virtual once it is configured for protection. If the initial backup is pending for the virtual machine, on-demand backup will create a full copy of the virtual machine in Azure backup vault. If first backup is completed, on-demand backup will only send changes from previous backup to Azure backup vault.

To take an on-demand backup of a virtual machine:

1. Navigate to **Protected Items** page and select **Azure Virtual Machine** as **Type** (if not already selected) and click on **Select** button.

    ![VM Type](./media/backup-azure-manage-vms/vm-type.png)

2. Select the virtual machine on which you want to take an on-demand backup and click on **Backup Now** button at the bottom of the page.

    ![Back up now](./media/backup-azure-manage-vms/backup-now.png)

    This will create a backup job on the selected virtual machine. Retention range of recovery point created through this job will be same as that specified in the policy associated with the virtual machine.

    ![Creating backup job](./media/backup-azure-manage-vms/creating-job.png)

    >[AZURE.NOTE] To view the policy associated with a virtual machine, drill down into virtual machine in the **Protected Items** page and go to backup policy tab.

3. Once the job is created, you can click on **View job** button in the toast bar to see the corresponding job in the jobs page.

    ![Backup job created](./media/backup-azure-manage-vms/created-job.png)

4. After successful completion of the job, a recovery point will be created which you can use to restore the virtual machine. This will also increment the recovery point column value by 1 in **Protected Items** page.

## Stop protecting virtual machines
You can choose to stop the future backups of a virtual machine with the following options:

- Retain backup data associated with virtual machine in Azure Backup vault
- Delete backup data associated with virtual machine

If you have selected the first option, you can use the backup data to restore the virtual machine. For pricing details for such virtual machines, click [here](http://azure.microsoft.com/pricing/details/backup/).

To Stop protection for a virtual machine:

1. Navigate to **Protected Items** page and select **Azure virtual machine** as the filter type(if not already selected) and click on **Select** button.

    ![VM Type](./media/backup-azure-manage-vms/vm-type.png)

2. Select the virtual machine and click on **Stop Protection** at the bottom of the page.

    ![Stop protection](./media/backup-azure-manage-vms/stop-protection.png)

3. By default, Azure Backup doesn’t delete the backup data associated with the Virtual machine.

    ![Confirm stop protection](./media/backup-azure-manage-vms/confirm-stop-protection.png)

    If you want to delete backup data, select the check box.

    ![Checkbox](./media/backup-azure-manage-vms/checkbox.png)

    Please select a reason for stopping the backup. While this is optional, providing a reason will help Azure Backup to work on the feedback and prioritize the customer scenarios.

4. Click on **Submit** button to submit the **Stop protection** job. Click on **View Job** to see the corresponding the job in **Jobs** page.

    ![Stop protection](./media/backup-azure-manage-vms/stop-protect-success.png)

    If you have not selected **Delete associated backup data** option during **Stop Protection** wizard, then post job completion, protection status changes to **Protection Stopped**. The data remains with Azure Backup until it is explicitly deleted. You can always delete the data by selecting the virtual machine in the **Protected Items** page and clicking **Delete**. 

    ![Stopped protection](./media/backup-azure-manage-vms/protection-stopped-status.png)

    If you have selected the **Delete associated backup data** option, virtual machine won’t be part of **Protected Items** page.

## Re-protect Virtual machine
If you have not selected the **Delete associate backup data** option in **Stop Protection**, you can re-protect the virtual machine by following the steps similar to backing up registered virtual machines. Once protected, this virtual machine will have backup data retained prior to stop protection and recovery points created after re-protect.

After re-protect, the virtual machine’s protection status will be changed to **Protected** if there are recovery points prior to **Stop Protection**.

  ![Reprotected VM](./media/backup-azure-manage-vms/reprotected-status.png)

>[AZURE.NOTE] When re-protecting the virtual machine, you can choose a different policy than the policy with which virtual machine was protected initially.

## Unregister virtual machines

If you want to remove the virtual machine from the backup vault:

1. Click on the **UNREGISTER** button at the bottom of the page.

    ![Disable protection](./media/backup-azure-manage-vms/unregister-button.png)

    A toast notification will appear at the bottom of the screen requesting confirmation. Click **YES** to continue.

    ![Disable protection](./media/backup-azure-manage-vms/confirm-unregister.png)

## Delete Backup data
You can delete backup data associated with a virtual machine, either:

- During Stop Protection Job
- After a stop protection job is completed on a virtual machine

To delete backup data on a virtual machine, which is in the “Protection Stopped” state post successful completion of **Stop Backup** job:

1. Navigate to **Protected Items** page and select **Azure Virtual Machine** as type and click on **Select** button.

    ![VM Type](./media/backup-azure-manage-vms/vm-type.png)

2. Select the virtual machine. The virtual machine will be in **Protection Stopped** state.

    ![Protection stopped](./media/backup-azure-manage-vms/protection-stopped-b.png)

3. Click on the **DELETE** button at the bottom of the page.

    ![Delete backup](./media/backup-azure-manage-vms/delete-backup.png)

4. In the **Delete backup data** wizard, select a reason for deleting backup data (highly recommended) and click on **Submit**.

    ![Delete backup data](./media/backup-azure-manage-vms/delete-backup-data.png)

5. This will create a job to delete backup data of selected virtual machine. Click on **View job** to see corresponding job in Jobs page.

    ![Data deletion successful](./media/backup-azure-manage-vms/delete-data-success.png)

    Once the job is completed, entry corresponding to virtual machine will be removed from **Protected items** page.


###Dashboard

On the **Dashboard** page you can review information about Azure virtual machines, their storage, and jobs associated with them in the last 24 hours. You can view backup status and any associated backup errors.

  ![Dashboard](./media/backup-azure-manage-vms/dashboard-protectedvms.png)
 