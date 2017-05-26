
---
title: Azure Backup FAQ | Microsoft Docs
description: 'Answers to common questions about: how the service works, the Azure Backup agent, Recovery Services vault, and backup and retention limits.'
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
editor: ''
keywords: backup and disaster recovery; backup service

ms.assetid: 1011bdd6-7a64-434f-abd7-2783436668d7
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 3/10/2017
ms.author: markgal;giridham;arunak;trinadhk;

---
# Questions about the Azure Backup service
This article has sections of common questions (with answers) to help you quickly understand the Azure Backup components. In some of the answers, there are links to the articles that have comprehensive information. You can ask questions about Azure Backup by clicking **Comments** (to the right). Comments appear at the bottom of this article. A Livefyre account is required to comment. You can also post questions about the Azure Backup service in the [discussion forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazureonlinebackup).

To quickly scan the sections in this article, use the links to the right, under **In this article**.


## Recovery services vault

### Is there any limit on the number of vaults that can be created in each Azure subscription? <br/>
Yes. As of September 2016, you can create 25 Recovery Services or backup vaults per subscription. You can create up to 25 Recovery Services vaults, per supported region of Azure Backup, per subscription. If you need additional vaults, create an additional subscription.

### Are there limits on the number of servers/machines that can be registered against each vault? <br/>
Yes, you can register up to 50 machines per vault. For Azure IaaS virtual machines, the limit is 200 VMs per vault. If you need to register more machines, create another vault.

### How do I register my server to another datacenter?<br/>
Backup data is sent to the datacenter of the vault to which it is registered. The easiest way to change the datacenter is to uninstall the agent and reinstall the agent and register to a new vault that belongs to desired datacenter.

### If my organization has one vault, how can I isolate one server's data from another server when restoring data?<br/>
All servers that are registered to the same vault can recover the data backed up by other servers *that use the same passphrase*. If you have servers whose backup data you want to isolate from other servers in your organization, use a designated passphrase for those servers. For example, human resources servers could use one encryption passphrase, accounting servers another, and storage servers a third.

### What's the minimum size requirement for the cache folder? <br/>
The size of the cache folder determines the amount of data that you are backing up. Your cache folder should be 5% of the space required for data storage.

### Can I “migrate” my backup data or vault between subscriptions? <br/>
No. The vault is created at a subscription level and cannot be reassigned to another subscription once it’s created.

### Recovery Services vaults are Resource Manager based. Are Backup vaults (classic mode) still supported? <br/>
All existing Backup vaults in the [classic portal](https://manage.windowsazure.com) continue to be supported. However, you can no longer use the classic portal to deploy new Backup vaults. Microsoft recommends using Recovery Services vaults for all deployments because future enhancements apply to Recovery Services vaults, only. If you attempt to create a Backup vault in the classic portal, you will be redirected to the [Azure portal](https://portal.azure.com).

### Can I migrate a Backup vault to a Recovery Services vault? <br/>
Unfortunately no, you can't migrate the contents of a Backup vault to a Recovery Services vault. We are working on adding this functionality, but it is not currently available.

### Do Recovery Services vaults support classic VMs or Resource Manager based VMs? <br/>
Recovery Services vaults support both models.  You can back up a classic VM (created in the Classic portal), or a Resource Manager VM (created in the Azure portal) to a Recovery Services vault.

### I backed up my classic VMs in a Backup vault. Can I migrate my VMs from classic mode to Resource Manager mode and protect them in a Recovery Services vault?
Classic VM recovery points in a backup vault don't automatically migrate to a Recovery Services vault when you move the VM from classic to Resource Manager mode. Follow these steps to transfer your VM backups:

1. In the Backup vault, go to the **Protected Items** tab and select the VM. Click [Stop Protection](backup-azure-manage-vms-classic.md#stop-protecting-virtual-machines). Leave *Delete associated backup data* option **unchecked**.
2. Migrate the virtual machine from classic mode to Resource Manager mode. Make sure the storage and network information corresponding to the virtual machine is also migrated to Resource Manager mode.
3. Create a Recovery Services vault and configure backup on the migrated virtual machine using **Backup** action on top of vault dashboard. For detailed information on backing up a VM to a Recovery Services vault, see the article, [Protect Azure VMs with a Recovery Services vault](backup-azure-vms-first-look-arm.md).



## Azure Backup agent

### Where can I download the latest Azure Backup agent? <br/>
You can download the latest agent for backing up Windows Server, System Center DPM, or Windows client, from [here](http://aka.ms/azurebackup_agent). If you want to back up a virtual machine, use the VM Agent (which automatically installs the proper extension). The VM Agent is already present on virtual machines created from the Azure gallery.

### When configuring the Azure Backup agent, I am prompted to enter the vault credentials. Do vault credentials expire?
Yes, the vault credentials expire after 48 hours. If the file expires, log in to the Azure portal and download the vault credentials files from your vault.

### What happens if I rename a Windows server that is backing up data to Azure?<br/>
When you rename a server, all currently configured backups are stopped.
Register the new name of the server with the Backup vault. When you register the new name with the vault, the first backup operation is a *full* backup. If you need to recover data backed up to the vault with the old server name, use the [**Another server**](backup-azure-restore-windows-server.md#use-instant-restore-to-restore-data-to-an-alternate-machine) option in the **Recover Data** wizard.

### What types of drives can I back up files and folders from? <br/>
You can't back up the following drives/volumes:

* Removable Media: All backup item sources must report as fixed.
* Read-only Volumes: The volume must be writable for the volume shadow copy service (VSS) to function.
* Offline Volumes: The volume must be online for VSS to function.
* Network share: The volume must be local to the server to be backed up using online backup.
* Bitlocker-protected volumes: The volume must be unlocked before the backup can occur.
* File System Identification: NTFS is the only file system supported.

### What file and folder types can I back up from my server?<br/>
The following types are supported:

* Encrypted
* Compressed
* Sparse
* Compressed + Sparse
* Hard Links: Not supported, skipped
* Reparse Point: Not supported, skipped
* Encrypted + Sparse: Not supported, skipped
* Compressed Stream: Not supported, skipped
* Sparse Stream: Not supported, skipped

### What is the maximum file path length that can be specified in Backup policy using Azure Backup agent? <br/>
Azure Backup agent relies on NTFS. The [filepath length specification is limited by the Windows API](https://msdn.microsoft.com/library/aa365247.aspx#fully_qualified_vs._relative_paths). If the files you want to protect have a file-path length longer than what is allowed by the Windows API, back up the parent folder or the disk drive.  

### What characters are allowed in file path of Azure Backup policy using Azure Backup agent? <br>
 Azure Backup agent relies on NTFS. It enables [NTFS supported characters](https://msdn.microsoft.com/library/aa365247.aspx#naming_conventions) as part of file specification.  

### How do I change the cache location specified for the Azure Backup agent?<br/>
Use the following list to change the cache location.

* Stop the Backup engine by executing the following command in an elevated command prompt:

```PS C:\> Net stop obengine```
* Do not move the files. Instead, copy the cache space folder to a different drive with sufficient space. The original cache space can be removed after confirming the backups are working with the new cache space.
* Update the following registry entries with the path to the new cache space folder.<br/>

| Registry path | Registry Key | Value |
| --- | --- | --- |
| `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Config` |ScratchLocation |*New cache folder location* |
| `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Config\CloudBackupProvider` |ScratchLocation |*New cache folder location* |

* Restart the Backup engine by executing the following command in an elevated command prompt:

```PS C:\> Net start obengine```

Once the backup creation is successfully completed in the new cache location, you can remove the original cache folder.

### Where can I put the cache-folder for the Azure Backup Agent to work as expected?<br/>
The following locations for the cache-folder are not recommended:

* Network share or Removable Media: The cache-folder must be local to the server that needs backing up using online backup. Network locations or removable media like USB drives are not supported.
* Offline Volumes: The cache-folder must be online for expected backup using Azure Backup Agent.

### Are there any attributes of the cache-folder that are not supported?<br/>
The following attributes or their combinations are not supported for the cache folder:

* Encrypted
* De-duplicated
* Compressed
* Sparse
* Reparse-Point

The cache folder and the metadata VHD do not have the necessary attributes for the Azure Backup agent.


## Virtual machines

### Can I install the Azure Backup agent on an Azure VM already backed by the Azure Backup service using the VM extension? <br/>
Absolutely. Azure Backup provides VM-level backup for Azure VMs using the VM extension. To protect files and folders on the guest Windows OS, install the Azure Backup agent on the guest Windows OS.

### Can I install the Azure Backup agent on an Azure VM to back up files and folders present on temporary storage provided by the Azure VM? <br/>
Yes. Install the Azure Backup agent on the guest Windows OS, and back up files and folders to temporary storage. Backup jobs fail once temporary storage data is wiped out. Also, if the temporary storage data has been deleted, you can only restore to non-volatile storage.


## Azure Backup Server and Data Protection Manager

### Can I use Azure Backup Server to create a Bare Metal Recovery (BMR) backup for a physical server? <br/>
Yes.

### Which version of System Center Data Protection Manager is supported? <br/>
We recommend that you install the [latest](http://aka.ms/azurebackup_agent) Azure Backup agent on the latest update rollup (UR) for System Center Data Protection Manager (DPM). As of August 2016, Update Rollup 11 is the latest update.

### I have installed Azure Backup agent to protect my files and folders. Can I now install System Center DPM to work with Azure Backup agent to protect on-premises application/VM workloads to Azure? <br/>
To use Azure Backup with System Center Data Protection Manager (DPM), install DPM first and then install Azure Backup agent. Installing the Azure Backup components in this order ensures the Azure Backup agent works with DPM. Installing the Azure Backup agent before installing DPM is not advised or supported.


## How Azure Backup works

### Does the Azure Backup agent work on a server that uses Windows Server 2012 deduplication? <br/>
Yes. The agent service converts the deduplicated data to normal data when it prepares the backup operation. It then optimizes the data for backup, encrypts the data, and then sends the encrypted data to the online backup service.

### If I cancel a backup job once it has started, is the transferred backup data deleted? <br/>
No. All data transferred into the vault, before the backup job was canceled, stays in the vault. Azure Backup uses a checkpoint mechanism to occasionally add checkpoints to the backup data during the backup. Because there are checkpoints in the backup data, the next backup process can validate the integrity of the files. The next backup job will be incremental to the data previously backed up. Incremental backups only transfer new or changed data, which equates to better utilization of bandwidth.

If you cancel a backup job for an Azure VM, any transferred data is ignored. The next backup job transfers incremental data from the last successful backup job.

### If a backup job fails, can I configure the Backup service to send e-mail? <br/>
Yes, the Backup service has several event-based alerts that can be used with a PowerShell script. For a full description, see [Configure notifications](backup-azure-monitor-vms.md#configure-notifications).

### Are there limits on when or how many times a backup job can be scheduled?<br/>
Yes. You can run backup jobs on Windows Server or Windows workstations up to three times/day. You can run backup jobs on System Center DPM up to twice a day. You can run a backup job for IaaS VMs once a day. You can use the scheduling policy for Windows Server or Windows workstation to specify daily or weekly schedules. Using System Center DPM, you can specify daily, weekly, monthly, and yearly schedules.

### Why is the size of the data transferred to the Recovery Services vault smaller than the data I backed up?<br/>
 All the data that is backed up from Azure Backup Agent or SCDPM or Azure Backup Server, is compressed and encrypted before being transferred. Once the compression and encryption is applied, the data in the backup vault is 30-40% smaller.

 ### Is there a way to adjust the amount of bandwidth used by the Backup service?<br/>
  Yes, use the **Change Properties** option in the Backup Agent to adjust bandwidth. You can adjust the amount of bandwidth and the times when you use that bandwidth. For step-by-step instructions, see **[Enable network throttling](backup-configure-vault.md#enable-network-throttling)**.



## What can I back up

### Which operating systems do Azure Backup support? <br/>
Azure Backup supports the following list of operating systems for backing up: files and folders, and workload applications protected using Azure Backup Server and System Center Data Protection Manager (DPM).

| Operating System | Platform | SKU |
|:--- | --- |:--- |
| Windows 8 and latest SPs |64 bit |Enterprise, Pro |
| Windows 7 and latest SPs |64 bit |Ultimate, Enterprise, Professional, Home Premium, Home Basic, Starter |
| Windows 8.1 and latest SPs |64 bit |Enterprise, Pro |
| Windows 10 |64 bit |Enterprise, Pro, Home |
| Windows Server 2016 |64 bit |Standard, Datacenter, Essentials |
| Windows Server 2012 R2 and latest SPs |64 bit |Standard, Datacenter, Foundation |
| Windows Server 2012 and latest SPs |64 bit |Datacenter, Foundation, Standard |
| Windows Storage Server 2016 and latest SPs |64 bit |Standard, Workgroup | 
| Windows Storage Server 2012 R2 and latest SPs |64 bit |Standard, Workgroup |
| Windows Storage Server 2012 and latest SPs |64 bit |Standard, Workgroup |
| Windows Server 2012 R2 and latest SPs |64 bit |Essential |
| Windows Server 2008 R2 SP1 |64 bit |Standard, Enterprise, Datacenter, Foundation |
| Windows Server 2008 SP2 |64 bit |Standard, Enterprise, Datacenter, Foundation |

**For Azure VM backup:**

* **Linux**: Azure Backup supports [a list of distributions that are endorsed by Azure](../virtual-machines/linux/endorsed-distros.md) except Core OS Linux.  Other Bring-Your-Own-Linux distributions also might work as long as the VM agent is available on the virtual machine and support for Python exists.
* **Windows Server**:  Versions older than Windows Server 2008 R2 are not supported.


### Is there a limit on the size of each data source being backed up? <br/>
There is no limit on the amount of data you can back up to a vault. Azure Backup restricts the maximum size for the data source, however, these limits are large. As of August 2015, the maximum size for a data source for the supported operating systems is:

| S.No | Operating system | Maximum size of data source |
|:---:|:--- |:--- |
| 1 |Windows Server 2012 or later |54,400 GB |
| 2 |Windows 8 or later |54,400 GB |
| 3 |Windows Server 2008, Windows Server 2008 R2 |1700 GB |
| 4 |Windows 7 |1700 GB |

The following table explains how each data source size is determined.

| Datasource | Details |
|:---:|:--- |
| Volume |The amount of data being backed up from single volume of a server or client machine |
| Hyper-V virtual machine |Sum of data of all the VHDs of the virtual machine being backed up |
| Microsoft SQL Server database |Size of single SQL database size being backed up |
| Microsoft SharePoint |Sum of the content and configuration databases within a SharePoint farm being backed up |
| Microsoft Exchange |Sum of all Exchange databases in an Exchange server being backed up |
| BMR/System State |Each individual copy of BMR or system state of the machine being backed up |



## Retention policy and recovery points

### Is there a difference between the retention policy for DPM and Windows Server/client (that is, on Windows Server without DPM)?<br/>
No, both DPM and Windows Server/client have daily, weekly, monthly, and yearly retention policies.

### Can I configure my retention policies selectively – i.e. configure weekly and daily but not yearly and monthly?<br/>
Yes, the Azure Backup retention structure allows you to have full flexibility in defining the retention policy as per your requirements.

### Can I “schedule a backup” at 6pm and specify retention policies at a different time?<br/>
No. Retention policies can only be applied on backup points. In the following image, the retention policy is specified for backups taken at 12am and 6pm. <br/>

![Schedule Backup and Retention](./media/backup-azure-backup-faq/Schedule.png)
<br/>

### Is an incremental copy transferred for the retention policies scheduled? <br/>
No, the incremental copy is sent based on the time mentioned in the backup schedule page. The points that can be retained are determined based on the retention policy.

### If a backup is retained for a long duration, does it take more time to recover an older data point? <br/>
No – the time to recover the oldest or the newest point is the same. Each recovery point behaves like a full point.

### If each recovery point is like a full point, does it impact the total billable backup storage?<br/>
Typical long-term retention point products store backup data as full points. The full points are storage *inefficient* but are easier and faster to restore. Incremental copies are storage *efficient* but require you to restore a chain of data, which impacts your recovery time. Azure Backup storage architecture gives you the best of both worlds by optimally storing data for fast restores and incurring low storage costs. This data storage approach ensures that your ingress and egress bandwidth is used efficiently. Both the amount of data storage and the time needed to recover the data, is kept to a minimum. Learn more on how [incremental backups](https://azure.microsoft.com/blog/microsoft-azure-backup-save-on-long-term-storage/) save are efficient.

### Is there a limit on the number of recovery points that can be created?<br/>
You can create up to 9999 recovery points per protected instance. A protected instance is a computer, server (physical or virtual), or workload configured to back up data to Azure. There is no limit on the number of protected instances per backup vault. For more information, see the explanations of [Backup and retention](./backup-introduction-to-azure-backup.md#backup-and-retention), and [What is a protected instance](./backup-introduction-to-azure-backup.md#what-is-a-protected-instance)?

### How many recoveries can I perform on the data that is backed up to Azure?<br/>
There is no limit on the number of recoveries from Azure Backup.

### When restoring data, do I pay for the egress traffic from Azure? <br/>
No. Your recoveries are free and you are not charged for the egress traffic.

### I receive the warning, "Azure Backups have not been configured for this server" even though I configured a backup policy <br/>
This warning occurs when the backup schedule settings stored on the local server are not the same as the settings stored in the backup vault. When either the server or the settings have been recovered to a known good state, the backup schedules can lose synchronization. If you receive this warning, [reconfigure the backup policy](backup-azure-manage-windows-server.md) and then **Run Back Up Now** to resynchronize the local server with Azure.



## Azure Backup encryption

### Is the data sent to Azure encrypted? <br/>
Yes. Data is encrypted on the on-premises server/client/SCDPM machine using AES256 and the data is sent over a secure HTTPS link.

### Is the backup data on Azure encrypted as well?<br/>
Yes. The data sent to Azure remains encrypted (at rest). Microsoft does not decrypt the backup data at any point. When backing up an Azure VM, Azure Backup relies on encryption of the virtual machine. For example, if your VM is encrypted using Azure Disk Encryption, or some other encryption technology, Azure Backup uses that encryption to secure your data.

### What is the minimum length of encryption key used to encrypt backup data? <br/>
The encryption key should be at least 16 characters.

### What happens if I misplace the encryption key? Can I recover the data (or) can Microsoft recover the data? <br/>
The key used to encrypt the backup data is present only on the customer premises. Microsoft does not maintain a copy in Azure and does not have any access to the key. If the customer misplaces the key, Microsoft cannot recover the backup data.
