---
title: Azure Backup agent FAQ
description: 'Answers to common questions about: how the Azure backup agent works, backup and retention limits.'
services: backup
author: trinadhk
manager: shreeshd
keywords: backup and disaster recovery; backup service
ms.service: backup
ms.topic: conceptual
ms.date: 8/6/2018
ms.author: saurse;trinadhk
---

# Questions about the Azure Backup agent
This article has answers to common questions to help you quickly understand the Azure Backup agent components. In some of the answers, there are links to the articles that have comprehensive information. You can also post questions about the Azure Backup service in the [discussion forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazureonlinebackup).

## Configure backup
### Where can I download the latest Azure Backup agent? <br/>
You can download the latest agent for backing up Windows Server, System Center DPM, or Windows client, from [here](http://aka.ms/azurebackup_agent). If you want to back up a virtual machine, use the VM Agent (which automatically installs the proper extension). The VM Agent is already present on virtual machines created from the Azure gallery.

### When configuring the Azure Backup agent, I am prompted to enter the vault credentials. Do vault credentials expire?
Yes, the vault credentials expire after 48 hours. If the file expires, sign in to the Azure portal and download the vault credentials files from your vault.

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

### Can I install the Azure Backup agent on an Azure VM already backed by the Azure Backup service using the VM extension? <br/>
Absolutely. Azure Backup provides VM-level backup for Azure VMs using the VM extension. To protect files and folders on the guest Windows OS, install the Azure Backup agent on the guest Windows OS.

### Can I install the Azure Backup agent on an Azure VM to back up files and folders present on temporary storage provided by the Azure VM? <br/>
Yes. Install the Azure Backup agent on the guest Windows OS, and back up files and folders to temporary storage. Backup jobs fail once temporary storage data is wiped out. Also, if the temporary storage data has been deleted, you can only restore to non-volatile storage.

### What's the minimum size requirement for the cache folder? <br/>
The size of the cache folder determines the amount of data that you are backing up. The volume of your cache folder should be at least 5-10% free space, when compared to the total size of backup data. If the volume has less than 5% free space, either increase the volume size, or [move the cache folder to a volume with sufficient free space](backup-azure-file-folder-backup-faq.md#backup).

### How do I register my server to another datacenter?<br/>
Backup data is sent to the datacenter of the vault to which it is registered. The easiest way to change the datacenter is to uninstall the agent and reinstall the agent and register to a new vault that belongs to desired datacenter.

### Does the Azure Backup agent work on a server that uses Windows Server 2012 deduplication? <br/>
Yes. The agent service converts the deduplicated data to normal data when it prepares the backup operation. It then optimizes the data for backup, encrypts the data, and then sends the encrypted data to the online backup service.

## Prerequisites and dependencies
### What features of Microsoft Azure Recovery Services (MARS) Agent require .NET framework 4.5.2 and higher?
The [Instant Restore](backup-azure-restore-windows-server.md#use-instant-restore-to-recover-data-to-the-same-machine) feature that enables restoring of individual files and folders from *Recover Data* wizard requires .NET Framework 4.5.2 or higher.

## Backup
### How do I change the cache location specified for the Azure Backup agent?<br/>
Use the following list to change the cache location.

1. Stop the Backup engine by executing the following command in an elevated command prompt:

    ```PS C:\> Net stop obengine``` 
  
2. Do not move the files. Instead, copy the cache space folder to a different drive with sufficient space. The original cache space can be removed after confirming the backups are working with the new cache space.
3. Update the following registry entries with the path to the new cache space folder.<br/>

    | Registry path | Registry Key | Value |
    | --- | --- | --- |
    | `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Config` |ScratchLocation |*New cache folder location* |
    | `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Config\CloudBackupProvider` |ScratchLocation |*New cache folder location* |

4. Restart the Backup engine by executing the following command in an elevated command prompt:

    ```PS C:\> Net start obengine```

Once the backup creation is successfully completed in the new cache location, you can remove the original cache folder.


### Where can I put the cache folder for the Azure Backup Agent to work as expected?<br/>
The following locations for the cache folder are not recommended:

* Network share or Removable Media: The cache folder must be local to the server that needs backing up using online backup. Network locations or removable media like USB drives are not supported
* Offline Volumes: The cache folder must be online for expected backup using Azure Backup Agent

### Are there any attributes of the cache-folder that are not supported?<br/>
The following attributes or their combinations are not supported for the cache folder:

* Encrypted
* De-duplicated
* Compressed
* Sparse
* Reparse-Point

The cache folder and the metadata VHD do not have the necessary attributes for the Azure Backup agent.

### Is there a way to adjust the amount of bandwidth used by the Backup service?<br/>
  Yes, use the **Change Properties** option in the Backup Agent to adjust bandwidth. You can adjust the amount of bandwidth and the times when you use that bandwidth. For step-by-step instructions, see **[Enable network throttling](backup-configure-vault.md#enable-network-throttling)**.

## Manage backups
### What happens if I rename a Windows server that is backing up data to Azure?<br/>
When you rename a server, all currently configured backups are stopped. Register the new name of the server with the Backup vault. When you register the new name with the vault, the first backup operation is a *full* backup. If you need to recover data backed up to the vault with the old server name, use the [**Another server**](backup-azure-restore-windows-server.md#use-instant-restore-to-restore-data-to-an-alternate-machine) option in the **Recover Data** wizard.

### What is the maximum file path length that can be specified in Backup policy using Azure Backup agent? <br/>
Azure Backup agent relies on NTFS. The [filepath length specification is limited by the Windows API](https://msdn.microsoft.com/library/aa365247.aspx#fully_qualified_vs._relative_paths). If the files you want to protect have a file-path length longer than what is allowed by the Windows API, back up the parent folder or the disk drive.  

### What characters are allowed in file path of Azure Backup policy using Azure Backup agent? <br>
 Azure Backup agent relies on NTFS. It enables [NTFS supported characters](https://msdn.microsoft.com/library/aa365247.aspx#naming_conventions) as part of file specification. 
 
### I receive the warning, "Azure Backups have not been configured for this server" even though I configured a backup policy <br/>
This warning occurs when the backup schedule settings stored on the local server are not the same as the settings stored in the backup vault. When either the server or the settings have been recovered to a known good state, the backup schedules can lose synchronization. If you receive this warning, [reconfigure the backup policy](backup-azure-manage-windows-server.md) and then **Run Back Up Now** to resynchronize the local server with Azure.
