---
title: Azure Backup FAQ | Microsoft Docs
description: Answers to frequently asked questions about the backup service, backup agent, backup and retention, recovery, security and other common questions about backup and disaster recovery.
services: backup
documentationcenter: ''
author: markgalioto
manager: jwhit
editor: ''
keywords: backup and disaster recovery; backup service

ms.assetid: 1011bdd6-7a64-434f-abd7-2783436668d7
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 10/21/2016
ms.author: trinadhk; giridham; arunak; markgal; jimpark;

---
# Azure Backup service- FAQ
This article is a list of commonly asked questions (and the respective answers) about the Azure Backup service. Our community replies quickly, and if a question is asked often, we add it to this article. The answers to questions typically provide reference or support information. You can ask questions about Azure Backup in the Disqus section of this article or a related article. You can also post questions about the Azure Backup service in the [discussion forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazureonlinebackup).

## What is the list of supported operating systems from which I can back up to Azure using Azure Backup? <br/>
Azure Backup supports the following list of operating systems for file-folder backup, application backup using Azure Backup Server and SCDPM.

| Operating System | Platform | SKU |
|:--- | --- |:--- |
| Windows 8 and latest SPs |64 bit |Enterprise, Pro |
| Windows 7 and latest SPs |64 bit |Ultimate, Enterprise, Professional, Home Premium, Home Basic, Starter |
| Windows 8.1 and latest SPs |64 bit |Enterprise, Pro |
| Windows 10 |64 bit |Enterprise, Pro, Home |
| Windows Server 2012 R2 and latest SPs |64 bit |Standard, Datacenter, Foundation |
| Windows Server 2012 and latest SPs |64 bit |Datacenter, Foundation, Standard |
| Windows Storage Server 2012 R2 and latest SPs |64 bit |Standard, Workgroup |
| Windows Storage Server 2012 and latest SPs |64 bit |Standard, Workgroup |
| Windows Server 2012 R2 and latest SPs |64 bit |Essential |
| Windows Server 2008 R2 SP1 |64 bit |Standard, Enterprise, Datacenter, Foundation |
| Windows Server 2008 SP2 |64 bit |Standard, Enterprise, Datacenter, Foundation |

For Azure VM backup,

* **Linux**: Azure Backup supports  [a list of distributions that are endorsed by Azure](../virtual-machines/virtual-machines-linux-endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) except Core OS Linux.  Other Bring-Your-Own-Linux distributions also might work as long as the VM agent is available on the virtual machine and support for Python exists.
* **Windows Server**:  Versions older than Windows Server 2008 R2 are not supported.

## Where can I download the latest Azure Backup agent? <br/>
You can download the latest agent for backing up Windows Server, System Center DPM, or Windows client, from  [here](http://aka.ms/azurebackup_agent). If you want to back up a virtual machine, use the VM Agent (which automatically installs the proper extension). The VM Agent is already present on virtual machines created from the Azure gallery.

## Which version of SCDPM server is supported? <br/>
We recommend that you install the [latest](http://aka.ms/azurebackup_agent) Azure Backup agent on the latest update rollup of SCDPM (UR11 as of August 2016)

## When configuring the Azure Backup agent, I am prompted to enter the vault credentials. Do vault credentials expire?
Yes, the vault credentials expire after 48 hours. If the file expires, log in to the Azure portal and download the vault credentials files from your vault.

## Is there any limit on the number of vaults that can be created in each Azure subscription? <br/>
Yes. As of September 2016, you can create 25 backup vaults per subscription. You can create upto 25 Recovery Services vaults per each supported region of Azure backup per subscription. If you need more vaults, then create a new subscription.

## Are there any limits on the number of servers/machines that can be registered against each vault? <br/>
Yes, you can register up to 50 machines per vault. For Azure IaaS virtual machines, limit is 200 VMs per vault. If you need to register more machines, create a new vault.

## How do I register my server to another datacenter?<br/>
Backup data is sent to the datacenter of the vault to which it is registered. The easiest way to change the datacenter is to uninstall the agent and reinstall the agent and register to a new vault that belongs to desired datacenter.

## What happens if I rename a Windows server that is backing up data to Azure?<br/>
When you rename a server, all currently configured backups are stopped.
You need to register the new name of the server with the Backup vault. When you create a new registration, the first backup operation is a full backup, and not an incremental backup. If you need to recover data that was previously backed up to the vault with the old server name, you can recover that data using the [**Another server**](backup-azure-restore-windows-server.md#recover-to-an-alternate-machine) option in the **Recover Data** wizard.

## What types of drives can I backup files and folders from? <br/>
The following set of drives/volumes can't get backup:

* Removable Media: The drive must report as a fixed to be used a backup item source.
* Read-only Volumes: The volume must be writable for the volume shadow copy service (VSS) to function.
* Offline Volumes: The volume must be online for VSS to function.
* Network share: The volume must be local to the server to be backed up using online backup.
* Bitlocker protected volumes: The volume must be unlocked before the backup can occur.
* File System Identification: NTFS is the only file system supported for this version of the online backup service.

## What file and folder types can I back up from my server?<br/>
The following types are supported:

* Encrypted
* Compressed
* Sparse
* Compressed + Sparse
* Hard Links: Not supported, skipped
* Reparse Point: Not supported, skipped
* Encrypted + Compressed: Not supported, skipped
* Encrypted + Sparse: Not supported, skipped
* Compressed Stream: Not supported, skipped
* Sparse Stream: Not supported, skipped

## What's the minimum size requirement for the cache folder? <br/>
The size of the cache folder determines the amount of data that you are backing up. Your cache folder should be 5% of the space required for data storage.

## If my organization has one vault, how can I isolate one server's data from another server when restoring data?<br/>
All servers that are registered to the same vault can recover the data backed up by other servers *that use the same passphrase*. If you have servers whose backup data you want to isolate from other servers in your organization, use a designated passphrase for those servers. For example, human resources servers could use one encryption passphrase, accounting servers another, and storage servers a third.

## Can I “migrate” my backup data or vault between subscriptions? <br/>
No. The vault is created at a subscription level and cannot be reassigned to another subscription once it’s created.

## Does the Azure Backup Agent work on a server that uses Windows Server 2012 deduplication? <br/>
Yes. The agent service converts the deduplicated data to normal data when it prepares the backup operation. It then optimizes the data for backup, encrypts the data, and then sends the encrypted data to the online backup service.

## If I cancel a backup job once it has started, is the transferred backup data deleted? <br/>
No. The backup vault stores the backed-up data that had been transferred up to the point of the cancellation. Azure Backup uses a checkpoint mechanism to occasionally add checkpoints to the backup data during the backup. Because there are checkpoints in the backup data, the next backup process can validate the integrity of the files. The next backup triggered would be incremental over the data that had been backed up previously. An incremental backup provides better utilization of bandwidth, so that you do not need to transfer the same data repeatedly.

In case of Azure VM backup, once the job is canceled, transferred data is ignored and fresh backup transfers incremental data from previously successful backup job.

## Why am I seeing the warning "Azure Backups have not been configured for this server" even though I had scheduled regular backups previously? <br/>
This warning occurs when the backup schedule settings stored on the local server are not the same as the settings stored in the backup vault. When either the server or the settings have been recovered to a known good state, the backup schedules can lose synchronization. If you receive this warning, [reconfigure the backup policy](backup-azure-manage-windows-server.md) and then **Run Back Up Now** to resynchronize the local server with Azure.

## What firewall rules should be configured for Azure Backup? <br/>
For seamless protection of on-premises-to-Azure and workload-to-Azure data, it is recommended that you allow your firewall to communicate with the following URLs:

* www.msftncsi.com
* \*.Microsoft.com
* \*.WindowsAzure.com
* \*.microsoftonline.com
* \*.windows.net

## Can I install the Azure Backup agent on an Azure VM already backed by the Azure Backup service using the VM extension? <br/>
Absolutely. Azure Backup provides VM-level backup for Azure VMs using the VM extension. You can install the Azure Backup agent on a Guest Windows OS to protect files and folders on that guest OS.

## Can I install the Azure Backup agent on an Azure VM to back up files and folders present on temporary storage provided by the Azure VM? <br/>
You can install the Azure Backup agent on the Guest Windows OS and back up files and folders to temporary storage. However, please note that backups fail once temporary storage data is wiped out. Also, if the temporary storage data has been deleted, you can only restore to non-volatile storage.

## I have installed Azure Backup agent to protect my files and folders. Can I now install SCDPM to work with Azure Backup agent to protect on-premises application/VM workloads to Azure? <br/>
To use Azure Backup with SCDPM, it is advised to install SCDPM first and only then to install Azure Backup agent. This ensures seamless integration of the Azure Backup agent with SCDPM and allows protecting files/folders, application-workloads and VMs to Azure, directly from the management console of SCDPM. Installing SCDPM after installing Azure Backup agent for purposes mentioned above is not advised or supported.

## What is the length of file path that can be specified as part of Azure Backup policy using Azure Backup agent? <br/>
Azure Backup agent relies on NTFS. The [filepath length specification is limited by Windows API](https://msdn.microsoft.com/library/aa365247.aspx#fully_qualified_vs._relative_paths). In case of backing up files with file path length greater than the ones specified by Windows API, customers can choose to backup the parent folder or the disk drive of backup files.  

## What characters are allowed in file path of Azure Backup policy using Azure Backup agent? <br>
 Azure Backup agent relies on NTFS. It enables [NTFS supported characters](https://msdn.microsoft.com/library/aa365247.aspx#naming_conventions) as part of file specification.  

## Can I use Azure Backup Server to create a Bare Metal Recovery (BMR) backup for a physical server? <br/>
Yes.

## Can I configure the Backup service to send mail if a backup job fails? <br/>
Yes, the Backup service has several event-based alerts that can be used with a PowerShell script. For a full description, see [Configure notifications](backup-azure-monitor-vms.md#configure-notifications)

## Is there a limit on the size of each data source being backed up? <br/>
While at vault level there is no limit on the amount of data you can backup, Azure Backup does impose a restriction(for all practical purposes, these limits are very high) on maximum size of data source. As of August 2015, the maximum size data source for the supported operating systems is:

| S.No | Operating system | Maximum size of data source |
|:---:|:--- |:--- |
| 1 |Windows Server 2012 or above |54400 GB |
| 2 |Windows 8 or above |54400 GB |
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

## Are there limits on the number of times a backup job can be scheduled per day?<br/>
Yes, you can run backup jobs on Windows Server or Windows client up to three times/day. You can run backup jobs on System Center DPM up to twice a day. You can run a backup job for IaaS VMs once a day.

## Is there a difference between the scheduling policy for DPM and Windows Server (i.e. on Windows Server without DPM)? <br/>
Yes. Using DPM, you can specify daily, weekly, monthly, and yearly schedules. Windows Server (without DPM) allows you to specify only daily and weekly schedules.

## Is there a difference between the retention policy for DPM and Windows Server/client (i.e. on Windows Server without DPM)?<br/>
No, both DPM and Windows Server/client have daily, weekly, monthly, and yearly retention policies.

## Can I configure my retention policies selectively – i.e. configure weekly and daily but not yearly and monthly?<br/>
Yes, the Azure Backup retention structure allows you to have full flexibility in defining the retention policy as per your requirements.

## Can I “schedule a backup” at 6pm and specify “retention policies” at a different time?<br/>
No. Retention policies can only be applied on backup points. In the following image, the retention policy is specified for backups taken at 12am and 6pm. <br/>

![Schedule Backup and Retention](./media/backup-azure-backup-faq/Schedule.png)
<br/>

## Is an incremental copy transferred for the retention policies scheduled? <br/>
No, the incremental copy is sent based on the time mentioned in the backup schedule page. The points that can be retained are determined based on the retention policy.

## If a backup is retained for a long duration, does it take more time to recover an older data point? <br/>
 No – the time to recover the oldest or the newest point is the same. Each recovery point behaves like a full point.

## If each recovery point is like a full point, does it impact the total billable backup storage?<br/>
Typical long-term retention point products store backup data as full points. The full points are storage *inefficient* but are easier and faster to restore. Incremental copies are storage *efficient* but require you to restore a chain of data, which impacts your recovery time. Azure Backup storage architecture gives you the best of both worlds by optimally storing data for fast restores and incurring low storage costs. This data storage approach ensures that your ingress and egress bandwidth is used efficiently. Both the amount of data storage and the time needed to recover the data, is kept to a minimum. Learn more on how [incremental backups](https://azure.microsoft.com/blog/microsoft-azure-backup-save-on-long-term-storage/) save are efficient.

## Is there a limit on the number of recovery points that can be created?<br/>
No. We have eliminated limits on recovery points. You can create as many recovery points as you desire.

## Why is the amount of data transferred in backup not equal to the amount of data I backed up?<br/>
 All the data that is backed up from Azure Backup Agent or SCDPM or Azure Backup Server, is compressed and encrypted before being transferred. Once the compression and encryption is applied, the data in the backup vault is 30-40% smaller.

## Is there a way to adjust the amount of bandwidth used by the Backup service?<br/>
 Yes, use the **Change Properties** option in the Backup Agent to adjust bandwidth. Adjust the amount of bandwidth and the times when you use that bandwidth. See **Enable network throttling (optional)** in [Back up a Windows Server or client to Azure using the Resource Manager deployment model](backup-configure-vault.md) for more information.

## My internet bandwidth is limited for the amount of data I need to back up. Is there a way I can move data to a certain location with a large network pipe and push that data into Azure? <br/>
You can back up data into Azure via the standard online backup process, or you can use the Azure Import/Export service to transfer data to blob storage in Azure. There are no additional ways of getting backup date into Azure storage. For information on how to use the Azure Import/Export service with Azure Backup, please see the [Offline Backup workflow](backup-azure-backup-import-export.md) article.

## How many recoveries can I perform on the data that is backed up to Azure?<br/>
There is no limit on the number of recoveries from Azure Backup.

## Do I have to pay for the egress traffic from Azure data center during recoveries?<br/>
 No. Your recoveries are free and you are not charged for the egress traffic.

## Is the data sent to Azure encrypted? <br/>
Yes. Data is encrypted on the on-premises server/client/SCDPM machine using AES256 and the data is sent over a secure HTTPS link.

## Is the backup data on Azure encrypted as well?<br/>
 Yes. The data sent to Azure remains encrypted (at rest). Microsoft does not decrypt the backup data at any point. For Azure VM backup, Azure Backup relies on encryption of the virtual machine i.e. if your VM is encrypted using Azure Disk Encryption or some other encryption technology, Azure Backup uses that encryption to secure your data.

## What is the minimum length of encryption key used to encrypt backup data? <br/>
 The encryption key should be at least 16 characters.

## What happens if I misplace the encryption key? Can I recover the data (or) can Microsoft recover the data? <br/>
The key used to encrypt the backup data is present only on the customer premises. Microsoft does not maintain a copy in Azure and does not have any access to the key. If the customer misplaces the key, Microsoft cannot recover the backup data.

## How do I change the cache location specified for the Azure Backup agent?<br/>
 Go sequentially through the bullet list below to change the cache location.

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

## Where can I put the cache-folder for the Azure Backup Agent to work as expected?<br/>
The following locations for the cache-folder are not recommended:

* Network share or Removable Media: The cache-folder must be local to the server that needs backing up using online backup. Network locations or removable media like USB drives are not supported.
* Offline Volumes: The cache-folder must be online for expected backup using Azure Backup Agent.

## Are there any attributes of the cache-folder that are not supported?<br/>
 The following attributes or their combinations are not supported for the cache-folder:

* Encrypted
* De-duplicated
* Compressed
* Sparse
* Reparse-Point

It is recommended that neither the cache-folder nor the metadata VHD has the attributes above for expected functioning of the Azure Backup agent.

## Recovery Services vaults are Resource Manager based. Are Backup vaults (classic mode) still supported? <br/>
Yes, Backup vaults are still supported. Create Backup vaults in the [Classic portal](https://manage.windowsazure.com). Create Recovery Services vaults in the [Azure portal](https://portal.azure.com). However we strongly recommend you to create recovery services vault as all future enhancements will be available only in Recovery Services vault.

## Can I migrate a Backup vault to a Recovery Services vault? <br/>
Unfortunately no, at this time you can't migrate the contents of a Backup vault to a Recovery Services vault. We are working on adding this functionality, but it is not available as part of Public Preview.

## Do Recovery Services vaults support classic VMs or Resource Manager based VMs? <br/>
Recovery Services vaults support both models.  You can back up a VM created in the Classic portal (which are classic mode VMs), or a VM created in the Azure portal (which are Resource Manager based) to a Recovery Services vault.

## I have backed up my classic VMs in backup vault. Now I want to migrate my VMs from classic mode to Resource Manager mode.  How Can I backup them in recovery services vault?
Backups of classic VMs in backup vault won't migrate automatically to recovery services vault when you migrate the VMs from classic to Resource Manager mode. Please follow these steps for migration of VM backups:

1. In backup vault, go to **Protected Items** tab and select the VM. Click on [Stop Protection](backup-azure-manage-vms-classic.md#stop-protecting-virtual-machines). Leave *Delete associated backup data* option **unchecked**.
2. Migrate the virtual machine from classic mode to Resource Manager mode. Make sure that storage and network corresponding to virtual machine are also migrated to Resource Manager mode.
3. Create a recovery services vault and configure backup on the migrated virtual machine using **Backup** action on top of vault dashboard. Learn More on how to [enable backup in recovery services vault](backup-azure-vms-first-look-arm.md)
