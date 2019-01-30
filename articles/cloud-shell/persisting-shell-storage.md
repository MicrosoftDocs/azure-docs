---
title: Persist files for Bash in Azure Cloud Shell | Microsoft Docs
description: Walkthrough of how Bash in Azure Cloud Shell persists files.
services: azure
documentationcenter: ''
author: jluk
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: azure
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 09/04/2018
ms.author: juluk
---

[!INCLUDE [PersistingStorage-introblock](../../includes/cloud-shell-persisting-shell-storage-introblock.md)]

## How Cloud Shell storage works 
Cloud Shell persists files through both of the following methods: 
* Creating a disk image of your `$Home` directory to persist all contents within the directory. The disk image is saved in your specified file share as `acc_<User>.img` at `fileshare.storage.windows.net/fileshare/.cloudconsole/acc_<User>.img`, and it automatically syncs changes. 
* Mounting your specified file share as `clouddrive` in your `$Home` directory for direct file-share interaction. `/Home/<User>/clouddrive` is mapped to `fileshare.storage.windows.net/fileshare`.
 
> [!NOTE]
> All files in your `$Home` directory, such as SSH keys, are persisted in your user disk image, which is stored in your mounted file share. Apply best practices when you persist information in your `$Home` directory and mounted file share.

## Bash-specific commands

### Use the `clouddrive` command
With Bash in Cloud Shell, you can run a command called `clouddrive`, which enables you to manually update the file share that is mounted to Cloud Shell.
![Running the "clouddrive" command](media/persisting-shell-storage/clouddrive-h.png)

### Mount a new clouddrive

#### Prerequisites for manual mounting
You can update the file share that's associated with Cloud Shell by using the `clouddrive mount` command.

If you mount an existing file share, the storage accounts must be located in your select Cloud Shell region. Retrieve the location by running `env` from Bash and checking the `ACC_LOCATION`.

#### The `clouddrive mount` command

> [!NOTE]
> If you're mounting a new file share, a new user image is created for your `$Home` directory. Your previous `$Home` image is kept in your previous file share.

Run the `clouddrive mount` command with the following parameters:

```
clouddrive mount -s mySubscription -g myRG -n storageAccountName -f fileShareName
```

To view more details, run `clouddrive mount -h`, as shown here:

![Running the `clouddrive mount`command](media/persisting-shell-storage/mount-h.png)

### Unmount clouddrive
You can unmount a file share that's mounted to Cloud Shell at any time. Since Cloud Shell requires a mounted file share to be used, you will be prompted to create and mount another file share on the next session.

1. Run `clouddrive unmount`.
2. Acknowledge and confirm prompts.

Your file share will continue to exist unless you delete it manually. Cloud Shell will no longer search for this file share on subsequent sessions. To view more details, run `clouddrive unmount -h`, as shown here:

![Running the `clouddrive unmount`command](media/persisting-shell-storage/unmount-h.png)

> [!WARNING]
> Although running this command will not delete any resources, manually deleting a resource group, storage account, or file share that's mapped to Cloud Shell erases your `$Home` directory disk image and any files in your file share. This action cannot be undone.

### List `clouddrive`
To discover which file share is mounted as `clouddrive`, run the `df` command. 

The file path to clouddrive shows your storage account name and file share in the URL. For example, `//storageaccountname.file.core.windows.net/filesharename`

```
justin@Azure:~$ df
Filesystem                                          1K-blocks   Used  Available Use% Mounted on
overlay                                             29711408 5577940   24117084  19% /
tmpfs                                                 986716       0     986716   0% /dev
tmpfs                                                 986716       0     986716   0% /sys/fs/cgroup
/dev/sda1                                           29711408 5577940   24117084  19% /etc/hosts
shm                                                    65536       0      65536   0% /dev/shm
//mystoragename.file.core.windows.net/fileshareName 5368709120    64 5368709056   1% /home/justin/clouddrive
justin@Azure:~$
```
## PowerShell-specific commands

### List `clouddrive` Azure file shares
The `Get-CloudDrive` cmdlet retrieves the Azure file share information currently mounted by the `clouddrive` in the Cloud Shell. <br>
![Running Get-CloudDrive](media/persisting-shell-storage-powershell/Get-Clouddrive.png)

### Unmount `clouddrive`
You can unmount an Azure file share that's mounted to Cloud Shell at any time. If the Azure file share has been removed, you will be prompted to create and mount a new Azure file share at the next session.

The `Dismount-CloudDrive` cmdlet unmounts an Azure file share from the current storage account. Dismounting the `clouddrive` terminates the current session. The user will be prompted to create and mount a new Azure file share during the next session.
![Running Dismount-CloudDrive](media/persisting-shell-storage-powershell/Dismount-Clouddrive.png)

[!INCLUDE [PersistingStorage-endblock](../../includes/cloud-shell-persisting-shell-storage-endblock.md)]

## Next steps
[Bash in Cloud Shell Quickstart](quickstart.md) <br>
[PowerShell in Cloud Shell Quickstart](quickstart-powershell.md) <br>
[Learn about Microsoft Azure Files storage](https://docs.microsoft.com/azure/storage/storage-introduction#file-storage) <br>
[Learn about storage tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags) <br>
