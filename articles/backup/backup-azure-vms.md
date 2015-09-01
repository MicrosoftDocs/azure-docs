<properties
	pageTitle="Azure virtual machine backup - Backup | Microsoft Azure"
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
	ms.topic="hero-article"
	ms.date="09/01/2015"
	ms.author="aashishr"; "jimpark"/>


# Backup Azure virtual machines
This article is the essential guide to backing up Azure virtual machines. Before you proceed, ensure that all the [prerequisites](backup-azure-vms-introduction.md#prerequisites) have been met.

Backing up Azure virtual machines involves three key steps:

![Three steps to backup an Azure virtual machine](./media/backup-azure-vms/3-steps-for-backup.png)

>[AZURE.NOTE] Virtual machine backup is local. The backup vault from a specified Azure region will not allow you to backup virtual machines from another Azure region. Thus for every Azure region that has VMs that need backup, at least 1 backup vault must be created in that region.

## 1. Discover Azure virtual machines
The discovery process queries Azure for the list of virtual machines in the subscription, along with additional information like the Cloud Service name and the Region. The discovery process should always be run as the first step. This is to ensure that any new virtual machines added to the subscription are identified.

### To trigger the discovery process

1. Navigate to the backup vault, which can be found under **Recovery Services** in the Azure portal, and then click the **Registered Items** tab.

2. Choose the type of workload in the drop-down menu as **Azure Virtual Machine**, and then click the **Select** button.

    ![select workload](./media/backup-azure-vms/discovery-select-workload.png)

3. Click the **DISCOVER** button at the bottom of the page.
    ![discover button](./media/backup-azure-vms/discover-button-only.png)

4. The discovery process can run for a few minutes while the virtual machines are being tabulated. A toast notification at the bottom of the screen appears while the discovery process is running.

    ![discover vms](./media/backup-azure-vms/discovering-vms.png)

5. Once the discovery process is complete, a toast notification appears.

    ![discover-done](./media/backup-azure-vms/discovery-complete.png)

##  2. Register Azure virtual machines
Before a virtual machine can be protected it needs to be registered with the Azure Backup service. The primary goal of the Registration process is to associate the virtual machine with the Azure Backup service. Registration is typically a one-time activity.

>[AZURE.NOTE] The backup extension is not installed during the Registration step. The installation and update of the backup agent is now part of the scheduled backup job.

### To register virtual machines

1. Navigate to the backup vault, which can be found under **Recovery Services** in the Azure portal, and then click the **Registered Items** tab

2. Choose the type of workload in the drop-down menu as **Azure Virtual Machine** and then click the select button.

    ![select workload](./media/backup-azure-vms/discovery-select-workload.png)

3. Click the **REGISTER** button at the bottom of the page.
    ![register button](./media/backup-azure-vms/register-button-only.png)

4. In the **Register Items** shortcut menu, choose the virtual machines that you would like to register. If there are two or more virtual machines with the same name use the cloud service to distinguish between the virtual machines.

    The **Register** operation can be done at scale, which means that multiple virtual machines can be selected at one time to be registered. This greatly reduces the one-time effort spent in preparing the virtual machine for backup.


5. A job is created for each virtual machine that should be registered. The toast notification shows the status of this activity. Click **View Job** to go to the **Jobs** page.

    ![register job](./media/backup-azure-vms/register-create-job.png)

6. The virtual machine also appears in the list of registered items and the status of the registration operation is shown.

    ![Registering status 1](./media/backup-azure-vms/register-status01.png)

7. Once the operation is completed, the status in the portal will change to reflect the registered state.

    ![Registration status 2](./media/backup-azure-vms/register-status02.png)

## 3. Protect: Backup Azure virtual machines
This step involves setting up a backup and retention policy for the virtual machine. To protect a virtual machine, do the following steps:

1. Navigate to the backup vault, which can be found under **Recovery Services** in the Azure portal, and then click the **Registered Items** tab.
2. Choose the type of workload in the drop-down menu as **Azure Virtual Machine**, and then click the **Select** button.

    ![Select workload in portal](./media/backup-azure-vms/select-workload.png)

3. Click the **PROTECT** button at the bottom of the page. The **Protect Items** wizard appears.

4. The **Protect Items** wizard is where the virtual machines to be protected can be selected. If there are two or more virtual machines with the same name use the cloud service to distinguish between the virtual machines.

    The **Protect** operation can be done at scale, which means that multiple virtual machines can be selected at one time to be registered. This greatly reduces the effort spent in protecting the virtual machine.

5. In the second screen of the **Protect Items** wizard, choose a backup and retention policy to back up the selected virtual machines. Pick from an existing set of policies or define a new one.

    In each backup vault, you can have multiple backup policies. The policies reflect the details about how the backup should be scheduled and retained. For example, one backup policy could be for daily backup at 10:00 P.M., while another backup policy could be for weekly backup at 6:00 A.M. Multiple backup policies allow flexibility in scheduling backups for your virtual machine infrastructure.

    Each backup policy can have multiple virtual machines that are associated with the policy. The virtual machine can be associated with only one policy at any given point in time.

6. A job is created for each virtual machine to configure the protection policy and to associate the virtual machines to the policy. Click the **Jobs** tab and choose the right filter to view the list of **Configure Protection** jobs.

    ![Configure protection job](./media/backup-azure-vms/protect-configureprotection.png)


## Post-protection activities

### Installation of the backup extension

The Azure Backup service seamlessly handles the upgrade and patching of the backup extension without requiring any cumbersome user intervention. This relieves the user of the “agent management overhead” that is typically associated with backup products.

#### Offline VMs
The backup extension is installed if the VM is running. A running VM also provides the greatest chance of getting an application consistent point. However, the Azure Backup service will continue to backup the VM even if the VM is turned off and the extension could not be installed (aka Offline VM). The impact is seen in the consistency - in such a case the recovery point will be *File-system consistent*.

### Initial backup
Once the virtual machine is protected with a policy, it shows up under the **Protected Items** tab with the status of *Protected - (pending initial backup)*. By default, the first scheduled backup is the initial backup. In order to trigger the initial backup immediately after configuring protection, use the **Backup Now** button at the bottom of the Protected Items page.

The Azure Backup service creates a backup job for the initial backup operation. Click the **Jobs** tab to view the list of jobs. As a part of the backup operation, the Azure Backup service issues a command to the backup extension in each virtual machines to flush all writes and take a consistent snapshot.

![Backup in progress](./media/backup-azure-vms/protect-inprogress.png)

Once the initial backup is completed, the Protection Status of the virtual machine in the **Protected Items** tab will show as *Protected*.

![Virtual machine is backed up with recovery point](./media/backup-azure-vms/protect-backedupvm.png)


### Viewing backup status and details
Once protected, the virtual machine count also increases in the **Dashboard** page summary. In addition, the **Dashboard** page shows the number of jobs from the last 24 hours that were successful, have failed, and are still in progress. Clicking on any one category will drill down into that category in the **Jobs** page.

![Status of backup in Dashboard page](./media/backup-azure-vms/dashboard-protectedvms.png)


## Consistency of recovery points
When dealing with backup data, customers worry about the behavior of the VM after it has been restored. The typical questions that customers ask are:

- Will the virtual machine boot up?
- Will the data be available on the disk (or) is there any data loss?
- Will the application be able to read the data (or) is the data corrupted?
- Will the data make sense to the application (or) is the data self-consistent when read by the application?

The following table explains the types of consistency that are encountered during Azure VM backup and restore.

| Consistency | VSS-based | Explanation and details |
|-------------|-----------|---------|
| Application consistency | Yes | This is the ideal place to be for Microsoft workloads as it ensures:<ol><li> That the VM *boots up*. <li>There is *no corruption*. <li>There is *no data loss*.<li> The data is consistent to the application that uses the data, by involving the application at the time of backup -  using VSS.</ol> The Volume Snapshot Service (VSS) ensures that data is written correctly to the storage. Most Microsoft workloads have VSS writers that do workload-specific actions related to data consistency. For example, Microsoft SQL Server has a VSS writer that ensures the writes to the transaction log file and the database are done correctly.<br><br> For Azure VM backup, getting an application consistent recovery point means that the backup extension was able to invoke the VSS workflow and complete *correctly* before the VM snapshot was taken. Naturally, this means that the VSS writers of all the applications in the Azure VM have been invoked as well.<br><br>Learn the [basics of VSS](http://blogs.technet.com/b/josebda/archive/2007/10/10/the-basics-of-the-volume-shadow-copy-service-vss.aspx) dive deep into the details of [how it works](https://technet.microsoft.com/library/cc785914%28v=ws.10%29.aspx). |
| File system consistency | Yes - for Windows machines | There are two scenarios where the recovery point can be file-system consistent:<ul><li>Backup of Linux VMs in Azure, since Linux does not have an equivalent platform to VSS.<li>VSS failure during backup for Windows VMs in Azure.</li></ul> In both these cases, the best that can be done is to ensure that: <ol><li> The VM *boots up*. <li>There is *no corruption*.<li>There is *no data loss*.</ol> Applications need to implement their own "fix-up" mechanism on the restored data.|
| Crash consistency | No | This situation is equivalent to a machine experiencing a "crash" (through either a soft or hard reset). This typically happens when the Azure virtual machine is shut down at the time of backup. For Azure virtual machine backup, getting a crash-consistent recovery point means that Azure Backup gives no guarantees around the consistency of the data on the storage medium - either from the perspective of the operating system or from the perspective of the application. Only data that already exists on the disk at the time of backup is what gets captured and backed up. <br/> <br/> While there are no guarantees, in most cases the OS will boot. This is typically followed by a disk checking procedure like chkdsk to fix any corruption errors. Any in-memory data or writes that have not been completely flushed to the disk will be lost. The application typically follows with its own verification mechanism in case data rollback needs to be done. For Azure VM backup, getting a crash consistent recovery point means that Azure Backup gives no guarantees around the consistency of the data on the storage - either from the OS perspective or the application's perspective. This typically happens when the Azure VM is shut down at the time of backup.<br><br>As an example, if the transaction log has entries that are not present in the database, then the database software does a rollback till the data is consistent. When dealing with data spread across multiple virtual disks (like spanned volumes), a crash-consistent recovery point provides no guarantees for the correctness of the data.|


## Next steps
To learn more about getting started with Azure Backup, see:

- [Troubleshoot virtual machine backup](backup-azure-vms-troubleshoot.md)
- [Restore virtual machines](backup-azure-restore-vms.md)
- [Manage virtual machines](backup-azure-manage-vms.md)
