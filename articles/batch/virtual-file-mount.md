---
title: Mount a virtual file system on a pool - Azure Batch | Microsoft Docs
description: Learn how to mount a virtual file system on a Batch pool.
services: batch
documentationcenter: ''
author: laurenhughes
manager: jeconnoc

ms.service: batch
ms.workload: big-compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/17/2019
ms.author: lahugh
---

# Mount a virtual file system on a Batch pool

Azure Batch enables you to mount cloud storage on Windows or Linux compute nodes in your Batch pools. When a compute node joins a pool, the virtual file system is mounted and treated as a local drive on that node. You can mount file systems such as Azure files, Azure blob storage, Network File System (NFS), or Common Internet File System (CIFS).

In this article, you'll learn how to mount a virtual file system on a pool of compute nodes using the [Batch management library for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/batch?view=azure-dotnet).

> [!NOTE]
> The mount feature is supported on Batch pools created on or after (TODO date).

## Benefits of mounting on a pool

Mounting the filesystem to the pool instead letting tasks get their own data from a large data set makes it easier for tasks to get information. Consider a scenario with multiple tasks processing similar data, like a rendering a movie. Each task renders one or more frames at a time from the scene files. By mounting a drive that contains the scene files, it's easier for nodes to share data. (TODO, add more context about benefits for this scenario)

Each task needs to know where input data comes from to make sure that data is available. If the data is stored in a large data set and is not mounted on the pool, it's time consuming for the task to verify that data set. Each task potentially downloads data that isn't needed, increasing the runtime, wasting storage resources, and delaying the execution of the task. Tasks also have a limit to the number of input files.

## Mount a virtual file system on a pool  

Mounting a virtual file system on the pool level makes the file system available to every compute node in the pool. The file system is configured when a compute node joins a pool and when the node is restarted or re-imaged.

To mount a file system on a pool, create a `MountConfiguration` object. Choose the object that fits your virtual file system: `AzureBlobFileSystemConfiguration`, `AzureFileShareConfiguration`, `NfsMountConfiguration`, or `CifsMountConfiguration`.

All mount configuration objects need the following base parameters. Some mount configurations have parameters specific to the file system, which are discussed in more detail in the code examples.

- **Account name or source**: To mount a virtual file share, you need the name of the storage account or its source.
- **Relative mount path**: This is where the file system is mounted on the compute node, relative to TODO.
- **Mount options or blobfuse options**: These options describe specific parameters for mounting a file system.

Once the `MountConfiguration` object is created, assign the object to the `MountConfigurationList` property when you create the pool. The file system is mounted either when a node joins a pool or when the node is restarted or re-imaged.

> [!IMPORTANT]
> The maximum number of mounted file systems on a pool is 10. See [Batch service quotas and limits](batch-quota-limit.md) for details about and other limits.

The following code examples demonstrate mounting a variety of file shares to a pool of compute nodes.

### Azure file share

Azure file shares are the standard Azure cloud file system. To learn more about how to get any of the parameters in the mount configuration code sample, see [Use an Azure file share](../storage/files/storage-how-to-use-files-windows.md).

```csharp
new PoolAddParameter
{
    Id = poolId,
    MountConfiguration = new[]
    {
        new MountConfiguration
        {
            AzureFileShareConfiguration = new AzureFileShareConfiguration
            {
                AccountName = “AccountName”,
                AzureFileUrl = “AzureFileShareUrl” ,
                AccountKey = “StorageAccountKey”,
                RelativeMountPath = “RelativeMountPath”,
                MountOptions = "-o vers=3.0,dir_mode=0777,file_mode=0777,sec=ntlmssp"
            },
        }
    }
}
```

### Azure blob file system

Another option is to use the Azure blob file system via [blobfuse](../storage/blobs/storage-how-to-mount-container-linux.md). Mounting a blob file system requires an `AccountKey` or `SasKey` for your storage account. For information on getting these keys, see [View account keys](../storage/common/storage-account-manage.md#view-account-keys-and-connection-string), or [Using shared access signatures (SAS)](../storage/common/storage-dotnet-shared-access-signature-part-1.md).

```csharp
new PoolAddParameter
{
    Id = poolId,
    MountConfiguration = new[]
    {
        new MountConfiguration
        {
            AzureBlobFileSystemConfiguration = new AzureBlobFileSystemConfiguration
            {
                AccountName = “StorageAccountName”,
                ContainerName = “containerName”,
                AccountKey = “StorageAccountKey”,
                SasKey = "",
                RelativeMountPath = "RelativeMountPath",
                BlobfuseOptions = "-o attr_timeout=240 -o entry_timeout=240 -o negative_timeout=120 "
            },
        }
    }
}
```

### Network file system

TODO

```csharp
new PoolAddParameter
{
    Id = poolId,
    MountConfiguration = new[]
    {
        new MountConfiguration
        {
            NfsMountConfiguration = new NFSMountConfiguration
            {
                Source = "source",
                RelativeMountPath = "RelativeMountPath",
                MountOptions = "options ver=1.0"
            },
        }
    }
}
```

### Common internet file system

TODO

```csharp
new PoolAddParameter
{
    Id = poolId,
    MountConfiguration = new[]
    {
        new MountConfiguration
        {
            CifsMountConfiguration = new CIFSMountConfiguration
            {
                Username = “StorageAccountName”,
                RelativeMountPath = "cifsmountpoint",
                Source = “source”,
                Password = “StorageAccountKey”,
                MountOptions = "-o vers=3.0,dir_mode=0777,file_mode=0777,serverino"
            },
        }
    }
}
```

## Diagnose mount errors

If a mount configuration fails, the compute node in the pool will fail and the node state becomes unusable. To diagnose a mount configuration failure, inspect the [`ComputeNodeError`](https://docs.microsoft.com/rest/api/batchservice/computenode/get#computenodeerror) property for details on the error.

TODO: add common mount errors and solutions

## Supported SKUs

| Publisher | Offer | SKU | File share | Blobfuse | NFS mount | CIFS mount | 
|-----------|-------|-----|------------|----------|-----------|------------|
| batch | rendering-centos73 | rendering | :heavy_check_mark: <br>Note: Compatible with CentOS 7.7</br>| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Canonical | UbuntuServer | 16.04-LTS, 18.04-LTS | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Credativ | Debian | 8, 9 | :heavy_check_mark: | :x: | :heavy_check_mark: | :heavy_check_mark: |
| microsoft-ads | linux-data-science-vm | linuxdsvm | :heavy_check_mark: <br>Note: Compatible with CentOS 7.4. </br> | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| microsoft-azure-batch | centos-container | 7.6 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| microsoft-azure-batch | centos-container-rdma | 7.4 | :heavy_check_mark: <br>Note: Supports A_8 or 9 storage</br> | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| microsoft-azure-batch | ubuntu-server-container | 16.04-LTS | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| microsoft-dsvm | linux-data-science-vm-ubuntu | linuxdsvmubuntu | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| OpenLogic | CentOS | 7.6 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| OpenLogic | CentOS-HPC | 7.4, 7.3, 7.1 | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Oracle | Oracle-Linux | 7.6 | :x: | :x: | :x: | :x: | 


## Next steps

- Learn more details about mounting an Azure file share with [Windows](../storage/files/storage-how-to-use-files-windows.md) or [Linux](../storage/files/storage-how-to-use-files-linux.md).
- Learn about using and mounting [blobfuse](https://github.com/Azure/azure-storage-fuse) virtual file systems.
- See [Network File System overview](https://docs.microsoft.com/windows-server/storage/nfs/nfs-overview) to learn about NFS and its applications.
- See [Microsoft SMB protocol and CIFS protocol overview](https://docs.microsoft.com/windows/desktop/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) to learn more about CIFS.
