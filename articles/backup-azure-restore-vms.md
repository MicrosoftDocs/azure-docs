
<properties
	pageTitle="Azure Backup - restore a virtual machine"
	description="Learn how to restore an Azure virtual machine"
	services="backup"
	documentationCenter=""
	authors="aashishr"
	manager="shreeshd"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/30/2015"
	ms.author="aashishr"/>

# Restore a virtual machine


## Run a restore
You can restore a virtual machine to a new VM from the backups stored in Azure backup vault using restore action.

1. To restore a virtual machine from the backup on the **Protected Items** page click **Restore** to open the **Restore an Item** wizard.
	>[AZURE.NOTE] The recovery point column in Protected Items page will tell you the number of recovery points you have for the virtual machine. Newest recovery point column tells you the latest snapshot time to which you can restore a virtual machine.

2. On the **Select a recovery point** page you can restore from the newest recovery point, or from a previous point in time. Available recovery points are highlighted on the calendar.

	![Select recovery point](./media/backup-azure-restore-vms/backup-recovery1.png)

3.  On the **Select restore instance** page specify where you want to restore the virtual machine. You need to restore to an alternate location. Specify the alternate virtual machine name, and existing or new cloud service. Specify the target network and subnet as required. 

	![Restore virtual machine](./media/backup-azure-restore-vms/backup-recover2.png)

After restore you'll need to reconfigure the extensions and recreate the endpoints for the virtual machine in the Azure portal. 
 
## Manage protected virtual machines

1. To view and manage backup settings for a virtual machine click it **Protected Items** page.

	- The **Backup Details** tab shows you information about the last backup.

		![Virtual machine backup](./media/backup-azure-restore-vms/backup-vmdetails.png)	

	- The **Backup Policy** tab shows you the existing policy. You can modify as needed. If you need to create a new policy click Create on the **Policies** page. Note that if you want to remove a policy it shouldn't have any virtual machines associated with it.

		![Virtual machine policy](./media/backup-azure-restore-vms/backup-vmpolicy.png)

2. Get more information about actions or status for a virtual machine on the **Jobs** page. Click a job in the list to get more details, or filter jobs for a specific virtual machine.

	![Jobs](./media/backup-azure-restore-vms/backup-job.png)

3. If at any point you want to stop protecting a virtual machine select it and click **Stop Protection** on the **Protected Items** page. You can specify whether you want to delete the backup for the virtual machine that's currently in Azure Backup, and optionally specify a reason for auditing purposes. The virtual machine will appear with the **Protection Stopped** status.

	![Disable protection](./media/backup-azure-restore-vms/backup-disable-protection.png)

 Note that if you didn't select to delete the backup when you stopped backup for the virtual machine you can select the virtual machine in the Protected Items page and click **Delete**. If you want to remove the virtual machine from the backup vault, stop it and then click **Unregister** to remove it completely. 

###Dashboard

On the Dashboard page you can review information about Azure virtual machines, their storage, and jobs associated with them in the last 24 hours. You can view backup status and any associated backup errors. 



