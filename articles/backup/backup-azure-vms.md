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
	ms.topic="hero-article"
	ms.date="05/26/2015"
	ms.author="aashishr"/>


# Back up Azure virtual machines

This article is the essential guide to backing up Azure virtual machines. Before you proceed, ensure that all the [prerequisites](backup-azure-vms-introduction.md#prerequisites) have been met.

Backing up Azure virtual machines involves three key steps:

![Three steps to backup an Azure virtual machine](./media/backup-azure-vms/3-steps-for-backup.png)

## Discover Azure virtual machines
The discovery process queries Azure for the list of virtual machines in the subscription, along with additional information like the Cloud Service name and the Region.

> [AZURE.NOTE] The discovery process should always be run as the first step. This is to ensure that any new virtual machines added to the subscription are identified.

To trigger the discovery process, do the following steps:

1. Navigate to the backup vault, which can be found under **Recovery Services** in the Azure portal, and click on the **Registered Items** tab.

2. Choose the type of workload in the dropdown menu as **Azure Virtual Machine**, and click on the **Select** button.
  ![select workload](./media/backup-azure-vms/discovery-select-workload.png)

3. Click on the **DISCOVER** button at the bottom of the page.
  ![discover button](./media/backup-azure-vms/discover-button.png)

4. The discovery process can run for a few minutes while the virtual machines are being tabulated. A toast notification at the bottom of the screen appears while the discovery process is running.
  ![discover vms](./media/backup-azure-vms/discovering-vms.png)

5. Once the discovery process is complete, a toast notification appears.
  ![discover-done](./media/backup-azure-vms/discovery-complete.png)


## Register Azure virtual machines
Before a virtual machine can be protected it needs to be registered with the Azure Backup service. The Registration process has two primary goals:

1. To have the backup extension plugged-in to the VM agent in the virtual machine

2. To associate the virtual machine with the Azure Backup service

Registration is typically a one-time activity. The Azure Backup service seamlessly handles the upgrade and patching of the backup extension without requiring any cumbersome user intervention. This relieves the user of the “agent management overhead” that is typically associated with backup products.

### To register virtual machines

1. Navigate to the backup vault, which can be found under **Recovery Services** in the Azure portal, and click on the **Registered Items** tab

2. Choose the type of workload in the dropdown menu as **Azure Virtual Machine** and click on the select button.
  ![select workload](./media/backup-azure-vms/discovery-select-workload.png)

3. Click on the **REGISTER** button at the bottom of the page.
  ![register button](./media/backup-azure-vms/register-button.png)

4. In the **Register Items** pop-up, choose the virtual machines that you would like to register. If there are two or more virtual machines with the same name use the cloud service to distinguish between the virtual machines.

    The **Register** operation can be done at scale, which means that multiple virtual machines can be selected at one time to be registered. This greatly reduces the one-time effort spent in preparing the virtual machine for backup.

    >[AZURE.NOTE] Only the virtual machines that are not registered and are in the same region as the backup vault, will show up.

5. A job is created for each virtual machine that should be registered. The toast notification shows the status of this activity. Click on **View Job** to go to the **Jobs** page.
  ![register job](./media/backup-azure-vms/register-create-job.png)

6. The virtual machine also appears in the list of registered items and the status of the registration operation is shown
  ![Registering status 1](./media/backup-azure-vms/register-status01.png)

7. Once the operation is completed, the status in the portal will change to reflect the registered state.
  ![Registration status 2](./media/backup-azure-vms/register-status02.png)

## Back up Azure virtual machines
This step involves setting up a backup and retention policy for the virtual machine. To protect a virtual machine, do the following steps:

1. Navigate to the backup vault, which can be found under **Recovery Services** in the Azure portal, and click on the **Registered Items** tab.
2. Choose the type of workload in the dropdown menu as **Azure Virtual Machine**, and click on the **Select** button.
  ![Select workload in portal](./media/backup-azure-vms/select-workload.png)

3. Click on the **PROTECT** button at the bottom of the page.

4. This will bring up a **Protect Items** wizard where the virtual machines to be protected can be selected. If there are two or more virtual machines with the same name use the cloud service to distinguish between the virtual machines.

    The **Protect** operation can be done at scale, which means that multiple virtual machines can be selected at one time to be registered. This greatly reduces the effort spent in protecting the virtual machine.

    >[AZURE.NOTE] Only the virtual machines that have been registered correctly with the Azure Backup service, and are in the same region as the backup vault, will show up here.

5. In the second screen of the **Protect Items** wizard, choose a backup and retention policy to back up the selected virtual machines. Pick from an existing set of policies or define a new one.

    >[AZURE.NOTE] For preview, up to 30 days of retention and a maximum of once-a-day backup is supported.

    In each backup vault, you can have multiple backup policies. The policies reflect the details about how the backup should be scheduled and retained. For example, one backup policy could be for daily backup at 10:00PM, while another backup policy could be for weekly backup at 6:00AM. Multiple backup policies allow flexibility in scheduling backups for your virtual machine infrastructure.

    Each backup policy can have multiple virtual machines that are associated with the policy. The virtual machine can be associated with only one policy at any given point in time.

6. A job is created for each virtual machine to configure the protection policy and to associate the virtual machines to the policy. Click on the **Jobs** tab and choose the right filter to view the list of **Configure Protection** jobs.
  ![Configure protection job](./media/backup-azure-vms/protect-configureprotection.png)

7. Once completed, the virtual machines are protected with a policy and must wait until the scheduled backup time for the initial backup to be completed. The virtual machine will now appear under the **Protected Items** tab and will have a Protected Status of *Protected* (pending initial backup).
    >[AZURE.NOTE] Starting the initial backup immediately after configuring protection is not available as an option today.

8. At the scheduled time, the Azure Backup service creates a backup job for each virtual machine that needs to be backed up. Click on the **Jobs** tab to view the list of **Backup** jobs. As a part of the backup operation, the Azure Backup service issues a command to the backup extension in each virtual machines to flush all writes and take a consistent snapshot.
  ![Backup in progress](./media/backup-azure-vms/protect-inprogress.png)

9. Once completed, the Protection Status of the virtual machine in the **Protected Items** tab will show as *Protected*.
  ![Virtual machine is backed up with recovery point](./media/backup-azure-vms/protect-backedupvm.png)

## Viewing backup status and details
Once protected, the virtual machine count also increases in the **Dashboard** page summary. In addition, the Dashboard page shows the number of jobs from the last 24 hours that were successful, have failed, and are still in progress. Clicking on any one category will drill down into that category in the **Jobs** page.
  ![Status of backup in Dashboard page](./media/backup-azure-vms/dashboard-protectedvms.png)

## Troubleshooting errors
You can troubleshoot errors encountered while using Azure Backup with information listed in the table below.

| Backup operation | Error details | Workaround |
| -------- | -------- | -------|
| Discovery | Failed to discover new items - Microsoft Azure Backup encountered and internal error. Wait for a few minutes and then try the operation again. | Retry the discovery process after 15 minutes.
| Discovery | Failed to discover new items – Another Discovery operation is already in progress. Please wait until the current Discovery operation has completed. | None |
| Register | Azure VM role is not in a state to install extension – Please check if the VM is in the Running state. Azure Recovery Services extension requires the VM to be Running. | Start the virtual machine and when it is in the Running state, retry the register operation.|
| Register | Number of data disks attached to the virtual machine exceeded the supported limit - Please detach some data disks on this virtual machine and retry the operation. Azure backup supports up to 5 data disks attached to an Azure virtual machine for backup | None |
| Register | Microsoft Azure Backup encountered an internal error - Wait for a few minutes and then try the operation again. If the issue persists, contact Microsoft Support. | You can get this error due to one of the following unsupported configurations: <ol><li>Premium LRS <li>Multi NIC <li>Load balancer </ol> |
| Register | VM Guest Agent Certificate not found | Follow these instructions to resolve the error: <ol><li>Download the latest version of the VM Agent from [here](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). Ensure that the version of the downloaded agent is 2.6.1198.718 or higher. <li>Install the VM Agent in the virtual machine.</ol> [Learn](#validating-vm-agent-installation) how to check  the version of the VM Agent. |
| Register | Registration failed with Install Agent operation timeout | Check if the OS version of the virtual machine is supported. |
| Register | Command execution failed - Another operation is in progress on this item. Please wait until the previous operation is completed | None |
| Backup | Copying VHDs from backup vault timed out - Please retry the operation in a few minutes. If the problem persists, contact Microsoft Support. | This happens when there is too much data to be copied. Please check if you have less than 6 data disks. |
| Backup | Snapshot VM sub task timed out - Please retry the operation in a few minutes. If the problem persists, contact Microsoft Support | This error is thrown if there is a problem with the VM Agent or network access to the Azure infrastructure is blocked in some way. <ul><li>Learn about [debugging VM Agent issues](#Troubleshooting-vm-agent-related-issues) <li>Learn about [debugging networking issues](#troubleshooting-networking-issues) </ul> |
| Backup | Backup failed with an internal error - Please retry the operation in a few minutes. If the problem persists, contact Microsoft Support | You can get this error for 2 reasons: <ol><li> There is too much data to be copied. Please check if you have less than 6 disks. <li>The original VM has been deleted and therefore backup cannot be taken. In order to keep the backup data for a deleted VM but stop the backup errors, Unprotect the VM and choose the option to keep the data. This will stop the backup schedule and also the recurring error messages. |
| Backup | Failed to install the Azure Recovery Services extension on the selected item - VM Agent is a pre-requisite for Azure Recovery Services Extension. Please install the Azure VM agent and restart the registration operation | <ol> <li>Check if the VM agent has been installed correctly. <li>Ensure that the flag on the VM config is set correctly.</ol> [Read more](#validating-vm-agent-installation) about VM agent installation, and how to validate the VM agent installation. |
| Backup | Command execution failed - Another operation is currently in progress on this item. Please wait until the previous operation is completed, and then retry | An existing backup or restore job for the VM is running, and a new job cannot be started while the existing job is running. <br><br>If you would like the option to cancel an ongoing job, add your vote to the [Azure Feedback forum](http://feedback.azure.com/forums/258995-azure-backup-and-scdpm/suggestions/7941501-add-feature-to-allow-cancellation-of-backup-restor). |

### Troubleshooting VM Agent related issues

#### Setting up the VM Agent
Typically, the VM Agent is already present in VMs that are created from the Azure gallery. However, virtual machines that are migrated from on-premises datacenters would not have the VM Agent installed. For such VMs, the VM Agent needs to be installed explicitly. Read more about [installing the VM agent on an existing VM](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx).

For Windows VMs:

- Download and install the [agent MSI](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You will need Administrator privileges to complete the installation.
- [Update the VM property](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx) to indicate that the agent is installed.


#### Updating the VM Agent
Updating the VM Agent is as simple as reinstalling the [VM Agent binaries](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). However, you need to ensure that no backup operation is running while the VM Agent is being updated.


#### Validating VM Agent installation
How to check for the VM Agent version on Windows VMs:

- Login into the Azure virtual machine and navigate to the folder *C:\WindowsAzure\Packages*.
- You should find the WaAppAgent.exe file present.
- Right-click on the file, go to **Properties**, and then select the **Details** tab.
- The Product Version field should be 2.6.1198.718 or higher

### Troubleshooting networking issues
Like all extensions, Backup extension need access to the public internet to work. Not having access to the public internet can manifest itself in a variety of of ways:

- The extension installation can fail
- The backup operations (like disk snapshot) can fail
- Displaying the status of the backup operation can fail

The need for resolving public internet addresses has been articulated [here](http://blogs.msdn.com/b/mast/archive/2014/06/18/azure-vm-provisioning-stuck-on-quot-installing-extensions-on-virtual-machine-quot.aspx). You will need to check the DNS configurations for the VNET and ensure that the Azure URIs can be resolved.

Once the name resolution is done correctly, access to the Azure IPs also needs to be provided. To unblock access to the Azure infrastructure, follow these steps:

1. Get the list of [Azure datacenter IPs](https://msdn.microsoft.com/library/azure/dn175718.aspx) to be whitelisted.
2. Unblock the IPs using the [New-NetRoute](https://technet.microsoft.com/library/hh826148.aspx) commandlet. Run this commandlet within the Azure VM, in an elevated PowerShell window (run as Administrator).


## Consistency of recovery points
When dealing with backup data, customers worry about the behavior of the VM after it has been restored. The typical questions that customers ask are:

- Will the virtual machine boot up?
- Will the data be available on the disk (or) is there any data loss?
- Will the application be able to read the data (or) is the data corrupted?
- Will the data make sense to the application (or) is the data self-consistent when read by the application?

The table below explains the types of consistency that are encountered during Azure VM backup and restore:

| Consistency | VSS based | Explanation and Details |
|-------------|-----------|---------|
| Application consistency | Yes | This is the ideal place to be for Microsoft workloads as it ensures:<ol><li> that the VM *boots up* <li>there is *no corruption*, <li>there is no *data loss*, and<li> the data is consistent to the application that uses the data, by involving the application at the time of backup -  using VSS.</ol> The Volume Snapshot Service (VSS) ensures that data is written correctly to the storage. Most Microsoft workloads have VSS writers that do workload-specific actions related to data consistency. For example, Microsoft SQL Server has a VSS writer that ensures the writes to the transaction log file and the database are done correctly.<br><br> For Azure VM backup, getting an application consistent recovery point means that the backup extension was able to invoke the VSS workflow and complete *correctly* before the VM snapshot was taken. Naturally, this means that the VSS writers of all the applications in the Azure VM have been invoked as well.<br><br>Learn the [basics of VSS](http://blogs.technet.com/b/josebda/archive/2007/10/10/the-basics-of-the-volume-shadow-copy-service-vss.aspx) dive deep into the details of [how it works](https://technet.microsoft.com/library/cc785914%28v=ws.10%29.aspx). |
| File system consistency | Yes - for Windows machines | There are two scenarios where the recovery point can be file-system consistent:<ul><li>Backup of Linux VMs in Azure, since Linux does not have an equivalent platform to VSS.<li>VSS failure during backup for Windows VMs in Azure.</li></ul> In both these cases, the best that can be done is to ensure that: <ol><li> that the VM *boots up* <li>there is *no corruption*, and <li>there is no *data loss*.</ol> Applications need to implement their own "fix-up" mechanism on the restored data.|
| Crash consistency | No | This situation is equivalent to a machine experiencing a "crash" (through either a soft or hard reset). There is no guarantee around the consistency of the data on the storage medium. Only data that already exists on the disk at the time of backup is what gets captured and backed up. <ol><li>While there are no guarantees, in most cases the OS will boot.<li>This is typically followed by a disk checking procedure like chkdsk to fix any corruption errors.<li> Any in-memory data or writes that have not been completely flushed to the disk will be lost.<li> The application typically follows with its own verification mechanism in case data rollback needs to be done. </ol>For Azure VM backup, getting a crash consistent recovery point means that Azure Backup gives no guarantees around the consistency of the data on the storage - either from the OS perspective or the application's perspective. This typically happens when the Azure VM is shutdown at the time of backup.<br><br>As an example, if the transaction log has entries that are not present in the database then the database software does a rollback till the data is consistent. When dealing with data spread across multiple virtual disks (like spanned volumes), a crash-consistent recovery point provides no guarantees for the correctness of the data.|

## Next steps
To learn more about getting started with Azure Backup, see:

- [Restore virtual machines](backup-azure-restore-vms.md)
- [Manage virtual machines](backup-azure-manage-vms)
 