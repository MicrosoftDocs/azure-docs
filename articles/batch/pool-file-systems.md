---
title: File system options for Azure Batch pools | Microsoft Docs
description: XXX
services: batch
documentationcenter: ''
author: dlepow
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: batch
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: big-compute
ms.date: 04/24/2018
ms.author: danlep
ms.custom: 

---
# Options for file systems on Azure Batch pools

* What are the advantages of using a file system? Particular workloads/scenarios? Why better than resource files or using a custom image with a data disk? Possible to list advantages/considerations of each option in a table?

<Probably will just start here - dedicated article for using Azure Files w Batch>
## Use an Azure Files share with a pool

[Azure Files](../storage/files/storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the SMB protocol. Azure Files is based on Azure blob storage; it is very [cost-efficient](https://azure.microsoft.com/pricing/details/storage/files/) and can be configured with data replication to another region so[globally redundant. [Scale targets](https://azure.microsoft.com/pricing/details/storage/files/) should be reviewed to determine if Azure Files should be used given the forecast pool size and number of asset files.

### Create a file share

[Create a file share](../storage/files/storage-how-to-create-file-share.md) in a storage account that is linked to your Batch account, or in a separate storage account.

[Planning considerations](../storage/files/storage-files-planning.md)

[Considerations: for performance reasons, should it be in same region/resource group as the Batch account? Any other considerations?]


### Mount a file share on Windows

There is [documentation](../storage/files/storage-how-to-use-files-windows.md) covering how to mount an Azure file share.

To use in Batch, a mount operation needs to be performed each time a task is run on a Windows node. Currently, it is not possible to persist the network connection between tasks.

As a simple example, you can include a command to mount the file share as part of each task command line. To mount the file share, you need to provide the following credentials:

* User name: AZURE\<yourstorageaccountname>, for example, *AZURE\mystorageaccountname*
* Password <YourStorageAccountKeyWhichEnds in==>, for example, *XXXXXXXXXXXXXXXXXXXXX==*




To simplify the mount operation, you can persist the credentials on the node so that you can mount the share without credentials. The easiest way to do this is to perform two steps:

1. Run the `cmdkey` command-line utility using a start task in the pool configuration. This persists the credentials on the Windows node. The start task command line is similar to:

```
cmd /c "cmdkey /add:<yourstorageaccountname>.file.core.windows.net /user:AZURE\mystorageaccountname /pass:XXXXXXXXXXXXXXXXXXXXX=="

```
2. Then, mount the share on each node as part of each task using `net use`. For example, the following task command line mounts the file share as the S: drive and then lists the files in the directory. Cached credentials are used in the call to `net use`. In your Batch workload, substitute your own command or script for `dir`:

```
cmd /c "net use S:
  \\mystorageaccountname.file.core.windows.net\yourshare /user:AZURE\mystorageaccountname XXXXXXXXXXXXXXXXXXXXX== & dir S:\"
```

<Add .NET code example>

### Mount a file share on Linux

Azure file shares can be mounted in Linux distributions using the [CIFS kernel client](https://wiki.samba.org/index.php/LinuxCIFS). For prerequisites and steps to mount an Azure file share on different distributions, see [Use Azure Files with Linux](../storage/files/storage-how-to-use-files-linux). The following example shows how to mount a file share on a pool of Ubuntu 16.04 LTS compute nodes. 

First install the `cifs-utils` package using a start task in the pool configuration. It's also convenient to create the mount point in the start task:

```
sudo apt-get update && sudo apt-get install cifs-utils && sudo mkdir -p /mnt/MyAzureFileShare
```

As a simple example, you can include a command to mount the File share as part of each task command line. To mount the file share, you need to provide the following credentials:

* User name: <yourstorageaccountname>, for example, *mystorageaccountname*
* Password <YourStorageAccountKeyWhichEnds in==>, for example, *XXXXXXXXXXXXXXXXXXXXX==*

For example, the following command mounts the file share at /mnt/MyAzureFileShare (this mount point was previously created) and then lists the files in the share. In your Batch workload, substitute your command for `ls`:

```
sudo mount -t cifs //mystorageaccountname.file.core.windows.net/myfileshare /mnt/MyAzureFileShare -o vers=3.0,username=mystorageaccountname,password=XXXXXXXXXXXXXXXXXXXXX==,dir_mode=0777,file_mode=0777,serverino && ls /mnt/MyAzureFileShare
```

On a Linux pool you can perform all of these steps to create a mount point and mount the share in a single start task on the pool. Use a start task command line similar to:

```
/bin/bash -c "sudo apt-get update && 
sudo apt-get install cifs-utils && 
sudo mkdir -p /mnt/MyAzureFileShare && 
sudo mount -t cifs //mystorageaccountname.file.core.windows.net/myfileshare /mnt/MyAzureFileShare -o vers=3.0,username=mystorageaccountname,password=XXXXXXXXXXXXXXXXXXXXX==,dir_mode=0777,file_mode=0777,serverino"

```
Set your start task to wait to complete successfully before running further tasks on the pool that reference the share.

<Python code example here>

 







Azure-based file system


* Command line

* Where to do this - pool start task?


## Next steps

* Learn about resource files
* Learn about other options for storing input and output files



## Linux FUSE adapter for Blob Storage (Preview)
https://docs.microsoft.com/en-us/azure/storage/blobs/storage-how-to-mount-container-linux

https://github.com/Azure/azure-storage-fuse

Not sure how much of this can be automated through a start task? 

## Linux FUSE adapter for Azure Data Lake Store (Preview? or even more rough)
Have not found steps for this....

## Gluster nodes 

Fred - Shipyard?

## NFS Server for Linux Pool

Presumably requires a VNet and then setting up another VM:

https://stackoverflow.com/questions/28431413/nfs-server-and-client-on-two-azure-vms-client-unable-to-connect 


Batch AI does this automagically... e.g. az batchai file-server create. Leverage??