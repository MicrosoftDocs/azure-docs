---
title: Persist files in Azure Cloud Shell (Preview) | Microsoft Docs
description: Walkthrough of how Azure Cloud Shell persists files.
services: 
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
ms.date: 08/21/2017
ms.author: juluk
---

# Persist files in Azure Cloud Shell
Cloud Shell takes advantage of Azure File storage to persist files across sessions.

## Set up a `clouddrive` file share
On initial start, Cloud Shell prompts you to associate a new or existing file share to persist files across sessions.

### Create new storage

When you use basic settings and select only a subscription, Cloud Shell creates three resources on your behalf in the supported region that's nearest to you:
* Resource group: `cloud-shell-storage-<region>`
* Storage account: `cs<uniqueGuid>`
* File share: `cs-<user>-<domain>-com-<uniqueGuid>`

![The Subscription setting](media/basic-storage.png)

The file share mounts as `clouddrive` in your `$Home` directory. The file share is also used to store a 5-GB image that's created for you and that automatically updates and persists your `$Home` directory. This is a one-time action, and the file share mounts automatically in subsequent sessions.

### Use existing resources

By using the advanced option, you can associate existing resources. When the storage setup prompt appears, select **Show advanced settings** to view additional options. Existing file shares receive a 5-GB user image to persist your `$Home` directory. The drop-down menus are filtered for your Cloud Shell region and for local-redundant & geo-redundant storage accounts.

![The Resource group setting](media/advanced-storage.png)

### Restrict resource creation with an Azure resource policy
Storage accounts that you create in Cloud Shell are tagged with `ms-resource-usage:azure-cloud-shell`. If you want to disallow users from creating storage accounts in Cloud Shell, create an [Azure resource policy for tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-policy-tags) that are triggered by this specific tag.

## How Cloud Shell works
Cloud Shell persists files through both of the following methods:
* Creating a disk image of your `$Home` directory to persist all contents within the directory. The disk image is saved in your specified file share as `acc_<User>.img` at `fileshare.storage.windows.net/fileshare/.cloudconsole/acc_<User>.img`, and it automatically syncs changes.

* Mounting your specified file share as `clouddrive` in your `$Home` directory for direct file share interaction. `/Home/<User>/clouddrive` is mapped to `fileshare.storage.windows.net/fileshare`.
 
> [!NOTE]
> All files in your `$Home` directory, such as SSH keys, are persisted in your user disk image, which is stored in your mounted file share. Apply best practices when you persist information in your `$Home` directory and mounted file share.

## Use the `clouddrive` command
With Cloud Shell, you can run a command called `clouddrive`, which enables you to manually update the file share that's mounted to Cloud Shell.
![Running the "clouddrive" command](media/clouddrive-h.png)

## Mount a new `clouddrive`

### Prerequisites for manual mounting
You can update the file share that's associated with Cloud Shell by using the `clouddrive mount` command.

If you mount an existing file share, the storage accounts must be:
* Locally-redundant storage or geo-redundant storage to support file shares.
* Located in your assigned region. When you are onboarding, the region you are assigned to is listed in the resource group name `cloud-shell-storage-<region>`.

### Supported storage regions
The Azure files must reside in the same region as the Cloud Shell machine that you're mounting them to. Cloud Shell clusters currently exist in the following regions:
|Area|Region|
|---|---|
|Americas|East US, South Central US, West US|
|Europe|North Europe, West Europe|
|Asia Pacific|India Central, Southeast Asia|

### The `clouddrive mount` command

> [!NOTE]
> If you're mounting a new file share, a new user image is created for your `$Home` directory, because your previous `$Home` image is kept in the previous file share.

Run the `clouddrive mount` command with the following parameters:

```
clouddrive mount -s mySubscription -g myRG -n storageAccountName -f fileShareName
```

To view more details, run `clouddrive mount -h`, as shown here:

![Running the `clouddrive mount`command](media/mount-h.png)

## Unmount `clouddrive`
You can unmount a file share that's mounted to Cloud Shell at any time. Once your file share is unmounted, you will be prompted to mount a new file share prior to your next session.

To remove a file share from Cloud Shell:
1. Run `clouddrive unmount`.
2. Acknowledge and confirm the prompts.

Your file share will continue to exist unless you delete it manually. Cloud Shell will no longer search for this file share on subsequent sessions.

To view more details, run `clouddrive unmount -h`, as shown here:

![Running the `clouddrive unmount`command](media/unmount-h.png)

> [!WARNING]
> Running this command will not delete any resources. Manually deleting a resource group, storage account, or file share that is mapped to Cloud Shell will permanently delete your `$Home` directory image and any other files in your file share. This action cannot be undone.

## List `clouddrive` file shares
To discover which file share is mounted as `clouddrive`, run the following `df` command. 

The file path to clouddrive shows your storage account name and file share in the URL. For example, `//storageaccountname.file.core.windows.net/filesharename`

```
justin@Azure:~$ df
Filesystem                                               1K-blocks     Used Available Use% Mounted on
overlay                                                   30428648 15585636  14826628  52% /
tmpfs                                                       986704        0    986704   0% /dev
tmpfs                                                       986704        0    986704   0% /sys/fs/cgroup
/dev/sda1                                                 30428648 15585636  14826628  52% /etc/hosts
shm                                                          65536        0     65536   0% /dev/shm
//mystoragename.file.core.windows.net/fileshareName        6291456  5242944   1048512  84% /usr/justin/clouddrive
/dev/loop0                                                 5160576   601652   4296780  13% /home/justin
```

## Transfer local files to Cloud Shell
The `clouddrive` directory syncs with the Azure portal storage blade. Use this blade to transfer local files to or from your file share. Updating files from within Cloud Shell is reflected in the file storage GUI when you refresh the blade.

### Download files

![List of local files](media/download.png)
1. In the Azure portal, go to the mounted file share.
2. Select the target file.
3. Select the **Download** button.

### Upload files

![Local files to be uploaded](media/upload.png)
1. Go to your mounted file share.
2. Select the **Upload** button.
3. Select the file or files that you want to upload.
4. Confirm the upload.

You should now see the files that are accessible in your `clouddrive` directory in Cloud Shell.

## Next steps
[Cloud Shell Quickstart](quickstart.md) <br>
[Learn about Azure File storage](https://docs.microsoft.com/azure/storage/storage-introduction#file-storage) <br>
[Learn about storage tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags) <br>
