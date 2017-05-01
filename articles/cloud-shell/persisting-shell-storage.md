---
title: Persisting files in Azure Cloud Shell (Preview) | Microsoft Docs
description: Walkthrough of how Azure Cloud Shell persists files.
services: 
documentationcenter: ''
author: jluk
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: 
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 05/10/2017
ms.author: juluk
---

# Persisting Azure Cloud Shell files
On initial start, Azure Cloud Shell asks for your subscription to create an LRS storage account and Azure file share for you. 
This file share will mount as `clouddrive` under your $Home directory. This file share is also used to store a 5-GB image created for you that automatically updates and persists your $Home directory. This is a one-time action and automatically mounted for subsequent sessions.

Cloud Shell persists files with both methods below:
1. Create a disk image of your $Home directory to persist files within $Home. 
This disk image is saved in your specified file share as `<User>.img` at `fileshare.storage.windows.net/fileshare/.cloudconsole/<User>.img`

2. Mount specified file share as `clouddrive` in your $Home directory for direct file share interaction. 
`/Home/<User>/clouddrive` is mapped to `fileshare.storage.windows.net/fileshare`.
 
## Using "createclouddrive"
Cloud Shell allows users to run a command called `createclouddrive` that enables manually associating an existing or new Azure file share to Cloud Shell. When successfully run, Cloud Shell searches for this file share on every start-up to mount and provide access to files held in the file share.

### Pre-requisites for manual mounting
Cloud Shell will create a storage account and file share for you on first launch, however you may update the file share with the `createclouddrive` command. Storage is subject to [regular Azure Files pricing.](https://azure.microsoft.com/en-us/pricing/details/storage/files/)

If mounting an existing file share, storage accounts must be:
1. LRS or GRS to support file shares.
2. Located in one of the following regions:

### Supported storage regions
Your storage account and file share must exist in one of the following regions.
||Region|
|---|---|
|Americas|East US, South Central US, West US|
|Europe|North Europe, West Europe|
|Asia Pacific|India Central, Southeast Asia|

## Mount clouddrive
1. Run `createclouddrive` with the following parameters <br>

```
createclouddrive -s mySubscription -g myRG -n storageAccountName -f fileShareName
```

To see more details run `createclouddrive -h`: <br>
```
Options:
  -s | --subscription id            Subscription ID or name.
  -g | --resource-group group       Resource group name.
  -n | --storage-account name       Storage account name.
  -F | --force                      Skip prompts for resource creation and shell restart.
  -f | --file-share name            Fileshare name.
  -d | --disk-size size             Disk size in GB. (default 5 GB)
  -? | -h | --help                  Shows this usage text.
```

## List clouddrive
To find details on `clouddrive`:
1. Run `df` 

The filepath to clouddrive will show your storage account name and fileshare in the url.

`//storageaccountname.file.core.windows.net/filesharename`

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

## Remove clouddrive

You may detach a file share mounted to Cloud Shell at any time.

[!NOTE]
Cloud Shell requires a file share to access, you will be prompted to create and mount a new file share on next session if removed.

[!WARNING] 
Deleting the resource group, storage account, or file share mapped to Cloud Shell will erase all files in your $Home directory and any files in your file share. This cannot be undone.

To detach a file share from Cloud Shell:
1. Run `removeclouddrive`
2. Confirm prompts as your current session will be lost. $Home directory files will continue to exist in your file share. Cloud Shell cannot be accessed until a file share is associated.

Cloud Shell will no longer search for this file share on subsequent sessions. The storage resources still exist unless actively deleted.

## Update clouddrive
Run `createclouddrive` specifying a new file share

[!NOTE]
Your $Home directory will reset as your $Home disk image is held in the previous file share.

## Upload or download local files
Utilize Azure portal to upload or download files to/from storage.
Editing/removing/adding files from within Cloud Shell is reflected in the File Storage GUI on blade refresh.

1. Navigate to the mounted fileshare
![](media/touch-txt-storage.png)
2. Select target file in Portal
3. Hit "Download"
![](media/download-storage.png)

If you need to download a file that only exists in your $Home directory:
1. Copy file to `/<User>/clouddrive` <br>
2. Follow [previous steps](#upload-or-download-local-files) <br>

## Cloud Shell tagging
Cloud Shell adds a "tag" to mounted storage accounts using the format: <br>

| Key | Value |
|:-------------:|:-------------:|
|cloud-console-files-for-user@domain.com|fileshareName|

Use these tags to see which users map to certain file shares and where certain $Home images can be found.

## Next steps
[Cloud Shell Quickstart](quickstart.md) <br>
[Learn about Azure File storage](https://docs.microsoft.com/azure/storage/storage-introduction#file-storage) <br>
[Learn more about Storage tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags) <br>