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

Azure Batch now allows you to mount cloud storage or an external file system on Windows or Linux compute nodes in your Batch pools. When a compute node joins a pool, the virtual file system is mounted and treated as a local drive on that node. You can mount file systems such as Azure Files, Azure Blob storage, Network File System (NFS) including an Avere vFXT cache, or Common Internet File System (CIFS).

In this article, you'll learn how to mount a virtual file system on a pool of compute nodes using the [Batch Management Library for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/batch?view=azure-dotnet).

> [!NOTE]
> The mount feature is supported on Batch pools created on or after (TODO date).

## Benefits of mounting on a pool

Mounting the file system to the pool, instead of letting tasks retrieve their own data from a large data set, makes it easier and more efficient for tasks to access the necessary data. Consider a scenario with multiple tasks requiring access to a common set of data, like rendering a movie. Each task renders one or more frames at a time from the scene files. By mounting a drive that contains the scene files, it's easier for nodes to access shared data. Additionally, the underlying file system can be chosen and scaled independently based on the performance and scale (throughput and IOPS) required by the number of compute nodes concurrently accessing the data. As an example, an [Avere vFXT distributed in-memory cache](https://azure.microsoft.com/en-au/services/storage/avere-vfxt/) can be used to support very large motion picture-scale renders with thousands of concurrent render nodes, accessing source data that resides on-premises. Alternatively, for data that already resides in cloud-based Blob storage, [blobfuse](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-how-to-mount-container-linux) can be used to mount this data as a local file system. Blobfuse is only available on Linux nodes, however, [Azure Files](https://azure.microsoft.com/en-au/blog/a-new-era-for-azure-files-bigger-faster-better/) provides a similar workflow and is available on both Windows and Linux.


## Mount a virtual file system on a pool  

Mounting a virtual file system on the pool makes the file system available to every compute node in the pool. The file system is configured when a compute node joins a pool and when the node is restarted or re-imaged.

To mount a file system on a pool, create a `MountConfiguration` object. Choose the object that fits your virtual file system: `AzureBlobFileSystemConfiguration`, `AzureFileShareConfiguration`, `NfsMountConfiguration`, or `CifsMountConfiguration`.

All mount configuration objects need the following base parameters. Some mount configurations have parameters specific to the file system, which are discussed in more detail in the code examples.

- **Account name or source**: To mount a virtual file share, you need the name of the storage account or its source.
- **Relative mount path**: This is where the file system is mounted on the compute node, relative to TODO.
- **Mount options or blobfuse options**: These options describe specific parameters for mounting a file system.

Once the `MountConfiguration` object is created, assign the object to the `MountConfigurationList` property when you create the pool. The file system is mounted either when a node joins a pool or when the node is restarted or re-imaged.

> [!IMPORTANT]
> The maximum number of mounted file systems on a pool is 10. See [Batch service quotas and limits](batch-quota-limit.md) for details about and other limits.

The following code examples demonstrate mounting a variety of file shares to a pool of compute nodes.

### Azure Files share

Azure Files is the standard Azure cloud file system offering. To learn more about how to get any of the parameters in the mount configuration code sample, see [Use an Azure Files share](../storage/files/storage-how-to-use-files-windows.md).

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

### Azure Blob file system

Another option is to use Azure Blob storage via [blobfuse](../storage/blobs/storage-how-to-mount-container-linux.md). Mounting a blob file system requires an `AccountKey` or `SasKey` for your storage account. For information on getting these keys, see [View account keys](../storage/common/storage-account-manage.md#view-account-keys-and-connection-string), or [Using shared access signatures (SAS)](../storage/common/storage-dotnet-shared-access-signature-part-1.md).

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

### Network File System (NFS)

NFS file systems can also be mounted to pool nodes allowing traditional file systems to be easily accessed by Azure Batch nodes. This could be a single NFS server either deployed in the cloud or an on-premises NFS server accessed over a virtual network. Alternatively, to take advantage of the [Avere vFXT distributed in-memory cache solution](https://azure.microsoft.com/en-au/services/storage/avere-vfxt/) which provides seamless connectivity to on-premises storage, reading data on-demand into its cache, and delivers extremely high performance and scale to cloud-based compute nodes.

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

### Common Internet File System (CIFS)

CIFS file systems can also be mounted to pool nodes allowing traditional file systems to be easily accessed by Azure Batch nodes. CIFS is a file-sharing protocol that provides an open and cross-platform mechanism for requesting network server files and services. CIFS is based on the enhanced version of Microsoft's Server Message Block (SMB) protocol for internet and intranet file sharing and is generally used to mount external file systems on Windows nodes.

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

- Learn more details about mounting an Azure Files share with [Windows](../storage/files/storage-how-to-use-files-windows.md) or [Linux](../storage/files/storage-how-to-use-files-linux.md).
- Learn about using and mounting [blobfuse](https://github.com/Azure/azure-storage-fuse) virtual file systems.
- See [Network File System overview](https://docs.microsoft.com/windows-server/storage/nfs/nfs-overview) to learn about NFS and its applications.
- See [Microsoft SMB protocol and CIFS protocol overview](https://docs.microsoft.com/windows/desktop/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) to learn more about CIFS.
