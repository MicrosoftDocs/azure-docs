---
title: Mount a virtual file system on a pool - Azure Batch | Microsoft Docs
description: Learn how to mount a virtual file system on a Batch pool.
services: batch
documentationcenter: ''
author: ju-shim
manager: gwallace

ms.service: batch
ms.workload: big-compute
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 08/13/2019
ms.author: jushiman
---

# Mount a virtual file system on a Batch pool

Azure Batch now supports mounting cloud storage or an external file system on Windows or Linux compute nodes in your Batch pools. When a compute node joins a pool, the virtual file system is mounted and treated as a local drive on that node. You can mount file systems such as Azure Files, Azure Blob storage, Network File System (NFS) including an [Avere vFXT cache](../avere-vfxt/avere-vfxt-overview.md), or Common Internet File System (CIFS).

In this article, you'll learn how to mount a virtual file system on a pool of compute nodes using the [Batch Management Library for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/batch?view=azure-dotnet).

> [!NOTE]
> Mounting a virtual file system is supported on Batch pools created on or after 2019-08-19. Batch pools created prior to 2019-08-19 do not support this feature.
> 
> The APIs for mounting file systems on a compute node are part of the [Batch .NET](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch?view=azure-dotnet) library.

## Benefits of mounting on a pool

Mounting the file system to the pool, instead of letting tasks retrieve their own data from a large data set, makes it easier and more efficient for tasks to access the necessary data.

Consider a scenario with multiple tasks requiring access to a common set of data, like rendering a movie. Each task renders one or more frames at a time from the scene files. By mounting a drive that contains the scene files, it's easier for compute nodes to access shared data. Additionally, the underlying file system can be chosen and scaled independently based on the performance and scale (throughput and IOPS) required by the number of compute nodes concurrently accessing the data. For example, an [Avere vFXT](../avere-vfxt/avere-vfxt-overview.md) distributed in-memory cache can be used to support large motion picture-scale renders with thousands of concurrent render nodes, accessing source data that resides on-premises. Alternatively, for data that already resides in cloud-based Blob storage, [blobfuse](../storage/blobs/storage-how-to-mount-container-linux.md) can be used to mount this data as a local file system. Blobfuse is only available on Linux nodes, however, [Azure Files](https://azure.microsoft.com/blog/a-new-era-for-azure-files-bigger-faster-better/) provides a similar workflow and is available on both Windows and Linux.

## Mount a virtual file system on a pool  

Mounting a virtual file system on a pool makes the file system available to every compute node in the pool. The file system is configured either when a compute node joins a pool, or when the node is restarted or reimaged.

To mount a file system on a pool, create a `MountConfiguration` object. Choose the object that fits your virtual file system: `AzureBlobFileSystemConfiguration`, `AzureFileShareConfiguration`, `NfsMountConfiguration`, or `CifsMountConfiguration`.

All mount configuration objects need the following base parameters. Some mount configurations have parameters specific to the file system being used, which are discussed in more detail in the code examples.

- **Account name or source**: To mount a virtual file share, you need the name of the storage account or its source.
- **Relative mount path or Source**: The location of the file system mounted on the compute node, relative to standard `fsmounts` directory accessible on the node via `AZ_BATCH_NODE_MOUNTS_DIR`. The exact location varies depending on the operating system used on the node. For example, the physical location on an Ubuntu node is mapped to `mnt\batch\tasks\fsmounts`, and on a CentOS node it is mapped to `mnt\resources\batch\tasks\fsmounts`.
- **Mount options or blobfuse options**: These options describe specific parameters for mounting a file system.

Once the `MountConfiguration` object is created, assign the object to the `MountConfigurationList` property when you create the pool. The file system is mounted either when a node joins a pool or when the node is restarted or reimaged.

When the file system is mounted, an environment variable `AZ_BATCH_NODE_MOUNTS_DIR` is created which points to the location of the mounted file systems as well as log files, which are useful for troubleshooting and debugging. Log files are explained in more detail in the [Diagnose mount errors](#diagnose-mount-errors) section.  

> [!IMPORTANT]
> The maximum number of mounted file systems on a pool is 10. See [Batch service quotas and limits](batch-quota-limit.md#other-limits) for details and other limits.

## Examples

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
                AccountName = "AccountName",
                AzureFileUrl = "AzureFileShareUrl",
                AccountKey = "StorageAccountKey",
                RelativeMountPath = "RelativeMountPath",
                MountOptions = "-o vers=3.0,dir_mode=0777,file_mode=0777,sec=ntlmssp"
            },
        }
    }
}
```

### Azure Blob file system

Another option is to use Azure Blob storage via [blobfuse](../storage/blobs/storage-how-to-mount-container-linux.md). Mounting a blob file system requires an `AccountKey` or `SasKey` for your storage account. For information on getting these keys, see [Manage storage account access keys](../storage/common/storage-account-keys-manage.md), or [Using shared access signatures (SAS)](../storage/common/storage-dotnet-shared-access-signature-part-1.md). For more information on using blobfuse, see the blobfuse [Troubleshoot FAQ](https://github.com/Azure/azure-storage-fuse/wiki/3.-Troubleshoot-FAQ). To get default access to the blobfuse mounted directory, run the task as an **Administrator**. Blobfuse mounts the directory at the user space, and at pool creation it is mounted as root. In Linux all **Administrator** tasks are root. All options for the FUSE module is described in the [FUSE reference page](https://manpages.ubuntu.com/manpages/xenial/man8/mount.fuse.8.html).

In addition to the troubleshooting guide, GitHub issues in the blobfuse repository are a helpful way to check on current blobfuse issues and resolutions. For more information, see [blobfuse issues](https://github.com/Azure/azure-storage-fuse/issues).

> [!NOTE]
> Blobfuse is not currently supported on Debian. See [Supported SKUs](#supported-skus) for more information.

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
                AccountName = "StorageAccountName",
                ContainerName = "containerName",
                AccountKey = "StorageAccountKey",
                SasKey = "",
                RelativeMountPath = "RelativeMountPath",
                BlobfuseOptions = "-o attr_timeout=240 -o entry_timeout=240 -o negative_timeout=120 "
            },
        }
    }
}
```

### Network File System

Network File Systems (NFS) can also be mounted to pool nodes allowing traditional file systems to be easily accessed by Azure Batch nodes. This could be a single NFS server deployed in the cloud, or an on-premises NFS server accessed over a virtual network. Alternatively, take advantage of the [Avere vFXT](../avere-vfxt/avere-vfxt-overview.md) distributed in-memory cache solution, which provides seamless connectivity to on-premises storage, reading data on-demand into its cache, and delivers high performance and scale to cloud-based compute nodes.

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

### Common Internet File System

Common Internet File Systems (CIFS) can also be mounted to pool nodes allowing traditional file systems to be easily accessed by Azure Batch nodes. CIFS is a file-sharing protocol that provides an open and cross-platform mechanism for requesting network server files and services. CIFS is based on the enhanced version of Microsoft's Server Message Block (SMB) protocol for internet and intranet file sharing and is used to mount external file systems on Windows nodes. To learn more about SMB, see [File Server and SMB](https://docs.microsoft.com/windows-server/storage/file-server/file-server-smb-overview).

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
                Username = "StorageAccountName",
                RelativeMountPath = "cifsmountpoint",
                Source = "source",
                Password = "StorageAccountKey",
                MountOptions = "-o vers=3.0,dir_mode=0777,file_mode=0777,serverino"
            },
        }
    }
}
```

## Diagnose mount errors

If a mount configuration fails, the compute node in the pool will fail and the node state becomes unusable. To diagnose a mount configuration failure, inspect the [`ComputeNodeError`](https://docs.microsoft.com/rest/api/batchservice/computenode/get#computenodeerror) property for details on the error.

To get the log files for debugging, use [OutputFiles](batch-task-output-files.md) to upload the `*.log` files. The `*.log` files contain information about the file system mount at the `AZ_BATCH_NODE_MOUNTS_DIR` location. Mount log files have the format: `<type>-<mountDirOrDrive>.log` for each mount. For example, a `cifs` mount at a mount directory named `test` will have a mount log file named: `cifs-test.log`.

## Supported SKUs

| Publisher | Offer | SKU | Azure Files Share | Blobfuse | NFS mount | CIFS mount |
|---|---|---|---|---|---|---|
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
| Windows | WindowsServer | 2012, 2016, 2019 | :heavy_check_mark: | :x: | :x: | :x: |

## Next steps

- Learn more details about mounting an Azure Files share with [Windows](../storage/files/storage-how-to-use-files-windows.md) or [Linux](../storage/files/storage-how-to-use-files-linux.md).
- Learn about using and mounting [blobfuse](https://github.com/Azure/azure-storage-fuse) virtual file systems.
- See [Network File System overview](https://docs.microsoft.com/windows-server/storage/nfs/nfs-overview) to learn about NFS and its applications.
- See [Microsoft SMB protocol and CIFS protocol overview](https://docs.microsoft.com/windows/desktop/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) to learn more about CIFS.
