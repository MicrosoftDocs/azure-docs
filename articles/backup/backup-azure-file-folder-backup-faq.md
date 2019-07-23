---
title: Common questions when backing up files and folders with Azure Backup
description: Addresses common questions about backing up files and folders with Azure Backup.
author: dcurwin
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 07/09/2019
ms.author: dacurwin
---

# Common questions about backing up files and folders

This article has answers to common questions abound backing up files and folders with the Microsoft Azure Recovery Services (MARS) Agent in the [Azure Backup](backup-overview.md) service.

## General

## Configure backups

### Where can I download the latest version of the MARS agent?
The latest MARS agent used when backing up Windows Server machines, System Center DPM, and Microsoft Azure Backup server is available for [download](https://aka.ms/azurebackup_agent).

### How long are vault credentials valid?
Vault credentials expire after 48 hours. If the credentials file expires, download the file again from the Azure portal.

### From what drives can I back up files and folders?

You can't back up the following types of drives and volumes:

* Removable media: All backup item sources must report as fixed.
* Read-only volumes: The volume must be writable for the volume shadow copy service (VSS) to function.
* Offline volumes: The volume must be online for VSS to function.
* Network shares: The volume must be local to the server to be backed up using online backup.
* BitLocker-protected volumes: The volume must be unlocked before the backup can occur.
* File System Identification: NTFS is the only file system supported.

### What file and folder types are supported?

[Learn more](backup-support-matrix-mars-agent.md#supported-file-types-for-backup) about the types of files and folders supported for backup.

### Can I use the MARS agent to back up files and folders on an Azure VM?  
Yes. Azure Backup provides VM-level backup for Azure VMs using the VM extension for the Azure VM agent. If you want to back up  files and folders on the guest Windows operating system on the VM, you can install the MARS agent to do that.

### Can I use the MARS agent to back up files and folders on temporary storage for the Azure VM?
Yes. Install the MARS agent, and back up files and folders on the guest Windows operating system to temporary storage.

- Backup jobs fail when temporary storage data is wiped out.
- If the temporary storage data is deleted, you can only restore to non-volatile storage.

### How do I register a server to another region?

Backup data is sent to the datacenter of the vault in which the server is registered. The easiest way to change the datacenter is to uninstall and reinstall the agent, and then register the machine to a new vault in the region you need.

### Does the MARS agent support Windows Server 2012 deduplication?
Yes. The MARS agent converts the deduplicated data to normal data when it prepares the backup operation. It then optimizes the data for backup, encrypts the data, and then sends the encrypted data to the vault.

## Manage backups

### What happens if I rename a Windows machine configured for backup?

When you rename a Windows machine, all currently configured backups are stopped.

- You need to register the new machine name with the Backup vault.
- When you register the new name with the vault, the first operation is a *full* backup.
- If you need to recover data backed up to the vault with the old server name, use the option to restore to an alternate location in the Recover Data Wizard. [Learn more](backup-azure-restore-windows-server.md#use-instant-restore-to-restore-data-to-an-alternate-machine).

### What is the maximum file path length for backup?
The MARS agent relies on NTFS, and uses the filepath length specification limited by the [Windows API](/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths). If the files you want to protect are longer than the allowed value, back up the parent folder or the disk drive.  

### What characters are allowed in file paths?

The MARS agent relies on NTFS, and allows [supported characters](/windows/desktop/FileIO/naming-a-file#naming-conventions) in file names/paths.

### The warning "Azure Backups have not been configured for this server" appears.
This warning can appear even though you've configured a backup policy, when the backup schedule settings stored on the local server are not the same as the settings stored in the backup vault.
- When the server or the settings have been recovered to a known good state, backup schedules can become unsynchronized.
- If you receive this warning, [configure](backup-azure-manage-windows-server.md) the backup policy again, and then run an on-demand backup to resynchronize the local server with Azure.


## Manage the backup cache folder

### What's the minimum size requirement for the cache folder?
The size of the cache folder determines the amount of data that you are backing up.
- The cache folder volumes should have free space that equals at least 5-10% of the total size of backup data.
- If the volume has less than 5% free space, either increase the volume size, or move the cache folder to a volume with enough space.
- If you backup Windows System State, you would need an additional 30-35 GB of free space in the volume containing the cache folder.

### How to check if scratch folder is valid and accessible?

1. By default scratch folder is located at `\Program Files\Microsoft Azure Recovery Services Agent\Scratch`
2. Make sure the path of your scratch folder location matches with the values of the registry key entries shown below:

  | Registry path | Registry Key | Value |
  | --- | --- | --- |
  | `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Config` |ScratchLocation |*New cache folder location* |
  | `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Config\CloudBackupProvider` |ScratchLocation |*New cache folder location* |

### How do I change the cache location for the MARS agent?

1. Run this command in an elevated command prompt to stop the Backup engine:

    ```PS C:\> Net stop obengine```

2. Don't move the files. Instead, copy the cache space folder to a different drive that has sufficient space.
3. Update the following registry entries with the path of the new cache folder.<br/>

    | Registry path | Registry Key | Value |
    | --- | --- | --- |
    | `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Config` |ScratchLocation |*New cache folder location* |
    | `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Config\CloudBackupProvider` |ScratchLocation |*New cache folder location* |

4. Restart the Backup engine at an elevated command prompt:

    ```PS C:\> Net start obengine```

5. After the backup finishes successfully using the new location, you can remove the original cache folder.


### Where should the cache folder be located?

The following locations for the cache folder are not recommended:

* Network share/removable media: The cache folder must be local to the server that needs backing up using online backup. Network locations or removable media like USB drives are not supported
* Offline volumes: The cache folder must be online for expected backup using Azure Backup Agent

### Are there any attributes of the cache folder that aren't supported?
The following attributes or their combinations are not supported for the cache folder:

* Encrypted
* De-duplicated
* Compressed
* Sparse
* Reparse-Point

The cache folder and the metadata VHD do not have the necessary attributes for the Azure Backup agent.

### Is there a way to adjust the amount of bandwidth used for backup?

Yes, you can use the **Change Properties** option in the MARS agent to adjust the bandwidth and timing. [Learn more](backup-configure-vault.md#enable-network-throttling).

## Restore

### What happens if I cancel an ongoing restore job?

If an ongoing restore job is canceled, the restore process stops. All files restored before the cancellation stay in configured destination (original or alternate location), without any rollbacks.


## Next steps

[Learn](tutorial-backup-windows-server-to-azure.md) how to back up a Windows machine.
