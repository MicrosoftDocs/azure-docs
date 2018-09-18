---
title: Azure Batch storage and data movement for rendering
description: Storage and data movement options for rendering workloads
services: batch
author: mscurrell
ms.author: markscu
ms.date: 08/02/2018
ms.topic: conceptual
---

# Storage and data movement options for rendering asset and output files

There are multiple options for making the scene and asset files available to the rendering applications on the pool VMs:

* [Azure blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction):
  * Scene and asset files are uploaded to blob storage from a local file system. When the application is run by a task, then the required files are copied from blob storage onto the VM so they can be accessed by the rendering application. The output files are written by the rendering application to the VM disk and then copied to blob storage.  If necessary, the output files can be downloaded from blob storage to a local file system.
  * Azure blob storage is a simple and cost-effective option for smaller projects.  As all asset files are required on each pool VM, then once the number and size of asset files increases care needs to be taken to ensure the file transfers are as efficient as possible.  
* Azure storage as a file system using [blobfuse](https://docs.microsoft.com/azure/storage/blobs/storage-how-to-mount-container-linux):
  * For Linux VMs, a storage account can be exposed and used as a file system when the blobfuse virtual file system driver is used.
  * This option has the advantage that it is very cost-effective, as no VMs are required for the file system, plus blobfuse caching on the VMs avoids repeated downloads of the same files for multiple jobs and tasks.  Data movement is also simple as the files are simply blobs and standard APIs and tools, such as azcopy, can be used to copy file between an on-premises file system and Azure storage.
* File system or file share:
  * Depending on VM operating system and performance/scale requirements, then options include [Azure Files](https://docs.microsoft.com/azure/storage/files/storage-files-introduction), using a VM with attached disks for NFS, using multiple VMs with attached disks for a distributed file system like GlusterFS, or using a third-party offering.
  * [Avere Systems](http://www.averesystems.com/) is now part of Microsoft and will have solutions in the near future that are ideal for large-scale, high-performance rendering.  The Avere solution will enable an Azure-based NFS or SMB cache to be created that works in conjunction with blob storage or with on-premises NAS devices.
  * With a file system, files can be read or written directly to the file system or can be copied between file system and the pool VMs.
  * A shared file system allows a large number of assets shared between projects and jobs to be utilized, with rendering tasks only accessing what is required.

## Using Azure blob storage

A blob storage account or a general-purpose v2 storage account should be used.  These two storage account types can be configured with significantly higher limits compared to a general-purpose v1 storage account, as detailed in [this blog post](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/).  When configured, the higher limits will enable much better performance and scalability, especially when there are many pool VMs accessing the storage account.

### Copying files between client and blob storage

To copy files to and from Azure storage, various mechanisms can be used including the storage blob API, the [Azure Storage Data Movement Library](https://github.com/Azure/azure-storage-net-data-movement), the azcopy command line tool for [Windows](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy) or [Linux](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-linux), [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/), and [Azure Batch Explorer](https://azure.github.io/BatchExplorer/).

For example, using azcopy, all assets in a folder can be transferred as follows:


`azcopy /source:. /dest:https://account.blob.core.windows.net/rendering/project /destsas:"?st=2018-03-30T16%3A26%3A00Z&se=2020-03-31T16%3A26%3A00Z&sp=rwdl&sv=2017-04-17&sr=c&sig=sig" /Y`

To copy only modified files, the /XO parameter can be used:

`azcopy /source:. /dest:https://account.blob.core.windows.net/rendering/project /destsas:"?st=2018-03-30T16%3A26%3A00Z&se=2020-03-31T16%3A26%3A00Z&sp=rwdl&sv=2017-04-17&sr=c&sig=sig" /XO /Y`

### Copying input asset files from blob storage to Batch pool VMs

There are a couple of different approaches to copy files with the best approach determined by the size of the job assets.
The simplest approach is to copy all the asset files to the pool VMs for each job:

* When there are files unique to a job, but are required for all the tasks of a job, then a [job preparation task](https://docs.microsoft.com/rest/api/batchservice/job/add#jobpreparationtask) can be specified to copy all the files.  The job preparation task is run once when the first job task is executed on a VM but is not run again for subsequent job tasks.
* A [job release task](https://docs.microsoft.com/rest/api/batchservice/job/add#jobreleasetask) should be specified to remove the per-job files once the job has completed; this will avoid the VM disk getting filled by all the job asset files.
* When there are multiple jobs using the same assets, with only incremental changes to the assets for each job, then all asset files are still copied, even if only a subset were updated.  This would be inefficient when there are lots of large asset files.

When asset files are reused between jobs, with only incremental changes between jobs, then a more efficient but slightly more involved approach is to store assets in the shared folder on the VM and sync changed files.

* The job preparation task would perform the copy using azcopy with the /XO parameter to the VM shared folder specified by AZ_BATCH_NODE_SHARED_DIR environment variable.  This will only copy changed files to each VM.
* Thought will have to be given to the size of all assets to ensure they will fit on the temporary drive of the pool VMs.

Azure Batch has built-in support to copy files between a storage account and Batch pool VMs.  Task [resource files](https://docs.microsoft.com/rest/api/batchservice/job/add#resourcefile) copy files from storage to pool VMs and could be specified for the job preparation task.  Unfortunately, when there are hundreds of files it is possible to hit a limit and tasks to fail.  When there are large numbers of assets it is recommended to use the azcopy command line in the job preparation task, which can use wildcards and has no limit.

### Copying output files to blob storage from Batch pool VMs

[Output files](https://docs.microsoft.com/rest/api/batchservice/task/add#outputfile) can be used copy files from a pool VM to storage.  One or more files can be copied from the VM to a specified storage account once the task has completed.  The rendered output should be copied, but it also may be desirable to store log files.

## Using a blobfuse virtual file system for Linux VM pools

Blobfuse is a virtual file system driver for Azure Blob Storage, which allows you to access files stored as blobs in a Storage account through the Linux file system.

Pool nodes can mount the file system when started or the mount can happen as part of a job preparation task – a task that is only run when the first task in a job runs on a node.  Blobfuse can be configured to leverage both a ramdisk and the VMs local SSD for caching of files, which will increase performance significantly if multiple tasks on a node access some of the same files.

[Sample templates are available](https://github.com/Azure/BatchExplorer-data/tree/master/ncj/vray/render-linux-with-blobfuse-mount) to run standalone V-Ray renders using a blobfuse file system and can be used as the basis for templates for other applications.

### Accessing files

Job tasks specify paths for input files and output files using the mounted file system.

### Copying input asset files from blob storage to Batch pool VMs

As files are simply blobs in Azure Storage, then standard blob APIs, tools, and UIs can be used to copy files between an on-premises file system and blob storage; for example, azcopy, Storage Explorer, Batch Explorer, etc.

## Using Azure Files with Windows VMs

[Azure Files](https://docs.microsoft.com/azure/storage/files/storage-files-introduction) offers fully managed file shares in the cloud that are accessible via the SMB protocol.  Azure Files is based on Azure blob storage; it is [cost-efficient](https://azure.microsoft.com/pricing/details/storage/files/) and can be configured with data replication to another region so globally redundant.  [Scale targets](https://docs.microsoft.com/azure/storage/files/storage-files-scale-targets#azure-files-scale-targets) should be reviewed to determine if Azure Files should be used given the forecast pool size and number of asset files.

There is a [blog post](https://blogs.msdn.microsoft.com/windowsazurestorage/2014/05/26/persisting-connections-to-microsoft-azure-files/) and [documentation](https://docs.microsoft.com/azure/storage/files/storage-how-to-use-files-windows) covering how to mount an Azure File share.

### Mounting an Azure Files share

To use in Batch, a mount operation needs to be performed each time a task in run as it is not possible to persist the connection between tasks.  The easiest way to do this is to use cmdkey to persist credentials using the start task in the pool configuration, then mount the share before each task.

Example use of cmdkey in a pool template (escaped for use in JSON file) – note that when separating the cmdkey call from the net use call, the user context for the start task must be the same as that used for running the tasks:

```
"startTask": {
  "commandLine": "cmdkey /add:storageaccountname.file.core.windows.net
    /user:AZURE\\markscuscusbatch /pass:storage_account_key",
  "userIdentity":{
    "autoUser": {
      "elevationLevel": "nonadmin",
      "scope": "pool"
    }
}
```

Example job task command line:
```
"commandLine":"net use S:
  \\\\storageaccountname.file.core.windows.net\\rendering &
3dsmaxcmdio.exe -v:5 -rfw:0 -10 -end:10
  -bitmapPath:\"s:\\3dsMax\\Dragon\\Assets\"
  -outputName:\"s:\\3dsMax\\Dragon\\RenderOutput\\dragon.jpg\"
  -w:1280 -h:720
  \"s:\\3dsMax\\Dragon\\Assets\\Dragon_Character_Rig.max\""
```

### Accessing files

Job tasks specify paths for input files and output files using the mounted file system, either using a mapped drive or a UNC path.

### Copying input asset files from blob storage to Batch pool VMs

Azure Files are supported by all the main APIs and tools that have Azure Storage support; e.g. azcopy, Azure CLI, Storage Explorer, Azure PowerShell, Batch Explorer, etc.

[Azure File Sync](https://docs.microsoft.com/azure/storage/files/storage-sync-files-planning) is available to automatically synchronize files between an on-premises file system and an Azure File share.

## Next steps

For more information about the storage options see the in-depth documentation:

* [Azure blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction)
* [Blobfuse](https://docs.microsoft.com/azure/storage/blobs/storage-how-to-mount-container-linux)
* [Azure Files](https://docs.microsoft.com/azure/storage/files/storage-files-introduction)
