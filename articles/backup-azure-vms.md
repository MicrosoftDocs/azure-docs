<properties
	pageTitle="Azure virtual machine backup - Backup"
	description="Learn how to backup an Azure virtual machine after registration"
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


# Backup the Azure virtual machine

This article is the essential guide to backing up Azure virtual machines. Before you proceed, ensure that all the [prerequisites][prereq] have been met.

Backing up Azure virtual machines involves three key steps:

![Three steps to backup an Azure virtual machine][three-steps]

## Discover the Azure virtual machines
The discovery process queries Azure for the list of virtual machines in the subscription, along with additional information like the Cloud Service name, and the Region.

> [AZURE.NOTE] The discovery process should always be run as the first step. This is to ensure that any new virtual machines added to the subscription are identified.

To trigger the discovery process, do the following steps:

1. Navigate to the backup vault, which can be found under **Recovery Services** in the Azure portal, and click on the **Registered Items** tab.

2. Choose the type of workload in the dropdown menu as **Azure Virtual Machine**, and click on the **Select** button.
  	![select workload][select-workload]

3. Click on the **Discover** button at the bottom of the page.
  	![discover button][discover-button]

4. The discovery process can run for a few minutes while the virtual machines are being tabulated. A toast notification at the bottom of the screen appears while the discovery process is running.
  	![discover vms][discover-vms]

5. Once the discovery process is complete, a toast notification appears.
  	![discover-done][discover-done]

<br><br>
## Register the Azure virtual machines
Before a virtual machine can be protected, it needs to be registered with the Azure Backup service. The Registration process has two primary goals:

1. To have the backup extension plugged-in to the VM agent in the virtual machine

2. To associate the virtual machine with the Azure Backup service.

Registration is typically a one-time activity. The Azure Backup service seamlessly handles the upgrade and patching of the backup extension without requiring any cumbersome user intervention. This relieves the user of the “agent management overhead” that is typically associated with backup products.

### To register the virtual machines

1. Navigate to the backup vault which can be found under **Recovery Services** in the Azure portal, and click on the **Registered Items** tab

2. Choose the type of workload in the dropdown menu as **Azure Virtual Machine**, and click on the select button.
  	![select workload][select-workload]

3. Click on the **Register** button at the bottom of the page.
  	![register button][register-button]

4. In the **Register Items** pop-up, choose the virtual machines that you would like to register. If there are two or more virtual machines with the same name, use the cloud service to distinguish between the virtual machines.

  	The **Register** operation can be done at scale, which means that multiple virtual machines can be selected at one time to be registered. This greatly reduces the one-time effort spent in preparing the virtual machine for backup.

  	> [AZURE.NOTE] Only the virtual machines that are not registered and are in the same region as the backup vault, will show up here.

  	![List of VMs to be registered][register-vms]

5. A job is created for each virtual machine that should be registered. The toast notification shows the status of this activity. Click on **View Job** to go to the **Jobs** page.
  	![register job][register-job]

6. The virtual machine also appears in the list of registered items and the status of the registration operation is shown
  	![Registering status 1][register-status1]

7. Once the operation is completed, the status in the portal will change to reflect the registered state.
  	![Registration status 2][register-status2]

<br><br>
## Backup the Azure virtual machine
This step involves setting up a backup and retention policy for the virtual machine. To protect a virtual machine, do the following steps:

1. Navigate to the backup vault which can be found under **Recovery Services** in the Azure portal, and click on the **Registered Items** tab.

2. Choose the type of workload in the dropdown menu as **Azure Virtual Machine**, and click on the select button.
  	![Select workload in portal][select-workload]

3. Click on the **Protect** button at the bottom of the page.

4. This will bring up a **Protect Items** wizard where the virtual machines to be protected can be selected. If there are two or more virtual machines with the same name, use the cloud service to distinguish between the virtual machines.
	The **Protect** operation can be done at scale, which means that multiple virtual machines can be selected at one time to be registered. This greatly reduces the effort spent in protecting the virtual machine.

	> [AZURE.NOTE] Only the virtual machines that have been registered correctly with the Azure Backup service, and are in the same region as the backup vault, will show up here.

	![Select items to protect][protect-wizard1]

5. In the second screen of the **Protect Items** wizard, choose a backup and retention policy to back up the selected virtual machines. Pick from an existing set of policies or define a new one.

	> [AZURE.NOTE] For preview, up to 30 days of retention and a maximum of once-a-day backup is supported.

	![Select protection policy][protect-wizard2]

	In each backup vault, you can have multiple backup policies. The policies reflect the details about how the backup should be scheduled and retained. For example, one backup policy could be for daily backup at 10:00PM, while another backup policy could be for weekly backup at 6:00AM. Multiple backup policies allow flexibility in scheduling backups for your virtual machine infrastructure.
	 Each backup policy can have multiple virtual machines that are associated with the policy. The virtual machine can be associated with only one policy at any given point in time.

6. A job is created for each virtual machine to configure the protection policy and to associate the virtual machines to the policy. Click on the **Jobs** tab and choose the right filter to view the list of **Configure Protection** jobs.
 ![Configure protection job][protect-configure]

7. Once completed, the virtual machines are protected with a policy and must wait until the scheduled backup time for the initial backup to be completed. The virtual machine will now appear under the **Protected Items** tab and will have a Protected Status of *Protected* (pending initial backup).

	> [AZURE.NOTE] Starting the initial backup immediately after configuring protection is not available as an option today.

8. At the scheduled time, the Azure Backup service creates a backup job for each virtual machine that needs to be backed up. Click on the **Jobs** tab to view the list of **Backup** jobs. As a part of the backup operation, the Azure Backup service issues a command to the backup extension in each virtual machines to flush all writes and take a consistent snapshot.
 ![Backup in progress][protect-inprogress]

9. Once completed, the Protection Status of the virtual machine in the **Protected Items** tab will show as *Protected*.
 ![Virtual machine is backed up with recovery point][protect-backedup]


## Viewing the backup status and details
Once protected, the virtual machine count also increases in the **Dashboard** page summary. In addition, the Dashboard page shows the number of jobs from the last 24 hours that were successful, have failed, and are still in progress. Clicking on any one category will drill down into that category in the **Jobs** page.
  	![Status of backup in Dashboard page][dashboard]


## Troubleshooting errors
You can troubleshoot discovery and registration issues by using the following information.

| Backup operation | Error details | Workaround |
| -------- | -------- | -------|
| Discovery | Failed to discover new items - Microsoft Azure Backup encountered and internal error. Wait for a few minutes and then try the operation again. | Retry the discovery process after 15 minutes.
| Discovery | Failed to discover new items – Another Discovery operation is already in progress. Please wait until the current Discovery operation has completed. | Wait for existing Discovery operation to finish. |
| Register | Azure VM role is not in a state to install extension – Please check if the VM is in the Running state. Azure Recovery Services extension requires the VM to be Running. | Start the virtual machine and when it is in the Running state, retry the register operation.|


## Consistency of recovery points
When dealing with backup data, customers worry about the behaviour of the VM after it has been restored. The typical questions that customers ask are:

+ Will the virtual machine boot up?

+ Will the data be available on the disk (or) is there any data loss?

+ Will the application be able to read the data (or) is the data corrupted?

+ Will the data make sense to the application (or) is the data self-consistent when read by the application?

The table below explains the types of consistency that are encountered during Azure VM backup and restore:

| Consistency | VSS based | Explanation and Details |
|-------------|-----------|---------|
| Application consistency | Yes | This is the ideal place to be for Microsoft workloads as it ensures:<ol><li> that the VM *boots up* <li>there is *no corruption*, <li>there is no *data loss*, and<li> the data is consistent to the application that uses the data, by involving the application at the time of backup -  using VSS.</ol> The Volume Snapshot Service (VSS) ensures that data is written correctly to the storage. Most Microsoft workloads have VSS writers that do workload-specific actions related to data consistency. For example, Microsoft SQL Server has a VSS writer that ensures the writes to the transaction log file and the database are done correctly.<br><br> For Azure VM backup, getting an application consistent recovery point means that the backup extension was able to invoke the VSS workflow and complete *correctly* before the VM snapshot was taken. Naturally, this means that the VSS writers of all the applications in the Azure VM have been invoked as well.<br><br>Learn the [basics of VSS](http://blogs.technet.com/b/josebda/archive/2007/10/10/the-basics-of-the-volume-shadow-copy-service-vss.aspx) dive deep into the details of [how it works](https://technet.microsoft.com/en-us/library/cc785914%28v=ws.10%29.aspx). |
| File system consistency | Yes - for Windows machines | There are two scenarios where the recovery point can be file-system consistent:<ul><li>Backup of Linux VMs in Azure, since Linux does not have an equivalent platform to VSS.<li>VSS failure during backup for Windows VMs in Azure.</li></ul> In both these cases, the best that can be done is to ensure that: <ol><li> that the VM *boots up* <li>there is *no corruption*, and <li>there is no *data loss*.</ol> Applications need to implement their own "fix-up" mechanism on the restored data.|
| Crash consistency | No | This situation is equivalent to a machine experiencing a "crash" (through either a soft or hard reset). There is no guarantee around the consistency of the data on the storage medium. Only data that already exists on the disk at the time of backup is what gets captured and backed up. <ol><li>While there are no guarantees, in most cases the OS will boot.<li>This is typically followed by a disk checking procedure like chkdsk to fix any corruption errors.<li> Any in-memory data or writes that have not been completely flushed to the disk will be lost.<li> The application typically follows with its own verification mechanism in case data rollback needs to be done. </ol>For Azure VM backup, getting a crash consistent recovery point means that Azure Backup gives no guarantees around the consistency of the data on the storage - either from the OS perspective or the application's perspective. This typically happens when the Azure VM is shutdown at the time of backup.<br><br>As an example, if the transaction log has entries that are not present in the database then the database software does a rollback till the data is consistent. When dealing with data spread across multiple virtual disks (like spanned volumes), a crash-consistent recovery point provides no guarantees for the correctness of the data.|



## Next steps
To learn more about getting started with Azure Backup, see:

- [Restore virtual machines](backup-azure-restore-vms.md)

[three-steps]: ./media/backup-azure-vms/3-steps-for-backup.png
[select-workload]: ./media/backup-azure-vms/discovery-select-workload.png
[discover-button]: ./media/backup-azure-vms/discover-button.png
[discover-vms]: ./media/backup-azure-vms/discovering-vms.png
[discover-done]: ./media/backup-azure-vms/discovery-complete.png
[register-button]: ./media/backup-azure-vms/register-button.png
[register-job]: ./media/backup-azure-vms/register-create-job.png
[register-vms]: ./media/backup-azure-vms/register-popup.png
[register-status1]: ./media/backup-azure-vms/register-status01.png
[register-status2]: ./media/backup-azure-vms/register-status02.png
[select-workload]: ./media/backup-azure-vms/select-workload.png
[protect-wizard1]: ./media/backup-azure-vms/protect-wizard1.png
[protect-wizard2]: ./media/backup-azure-vms/protect-wizard2.png
[protect-configure]: ./media/backup-azure-vms/protect-configureprotection.png
[protect-inprogress]: ./media/backup-azure-vms/protect-inprogress.png
[protect-backedup]: ./media/backup-azure-vms/protect-backedupvm.png
[dashboard]: ./media/backup-azure-vms/dashboard-protectedvms.png
[prereq]: http://azure.microsoft.com/en-us/documentation/articles/backup-azure-vms-introduction/#prerequisites
