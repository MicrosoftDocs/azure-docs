---
title: Mount a virtual file system on a pool
description: Learn how to mount a virtual file system on a Batch pool.
ms.topic: how-to
ms.custom: devx-track-csharp
ms.date: 03/26/2021
---

# Mount a virtual file system on a Batch pool

Azure Batch supports mounting cloud storage or an external file system on Windows or Linux compute nodes in your Batch pools. When a compute node joins a pool, the virtual file system is mounted and treated as a local drive on that node. You can mount file systems such as Azure Files, Azure Blob storage, Network File System (NFS) including an [Avere vFXT cache](../avere-vfxt/avere-vfxt-overview.md), or Common Internet File System (CIFS).

In this article, you'll learn how to mount a virtual file system on a pool of compute nodes using the [Batch Management Library for .NET](/dotnet/api/overview/azure/batch).

> [!NOTE]
> Mounting a virtual file system is only supported on Batch pools created on or after August 8, 2019. Batch pools created before that date will not support this feature.

## Benefits of mounting on a pool

Mounting the file system to the pool, instead of letting tasks retrieve their own data from a large data set, makes it easier and more efficient for tasks to access the necessary data.

Consider a scenario with multiple tasks requiring access to a common set of data, like rendering a movie. Each task renders one or more frames at a time from the scene files. By mounting a drive that contains the scene files, it's easier for compute nodes to access shared data.

Additionally, the underlying file system can be chosen and scaled independently based on the performance and scale (throughput and IOPS) required by the number of compute nodes concurrently accessing the data. For example, an [Avere vFXT](../avere-vfxt/avere-vfxt-overview.md) distributed in-memory cache can be used to support large motion picture-scale renders with thousands of concurrent render nodes, accessing source data that resides on-premises. Alternatively, for data that already resides in cloud-based Blob storage, [blobfuse](../storage/blobs/storage-how-to-mount-container-linux.md) can be used to mount this data as a local file system. Blobfuse is only available on Linux nodes, though [Azure Files](../storage/files/storage-files-introduction.md) provides a similar workflow and is available on both Windows and Linux.

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

Azure Files is the standard Azure cloud file system offering. To learn more about how to get any of the parameters in the mount configuration code sample, see [Use an Azure Files share - SMB](../storage/files/storage-how-to-use-files-windows.md) or [Use an Azure Files share with - NFS](../storage/files/storage-files-how-to-create-nfs-shares.md).

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
                AccountName = "{storage-account-name}",
                AzureFileUrl = "https://{storage-account-name}.file.core.windows.net/{file-share-name}",
                AccountKey = "{storage-account-key}",
                RelativeMountPath = "S",
                MountOptions = "-o vers=3.0,dir_mode=0777,file_mode=0777,sec=ntlmssp"
            },
        }
    }
}
```

### Azure Blob container

Another option is to use Azure Blob storage via [blobfuse](../storage/blobs/storage-how-to-mount-container-linux.md). Mounting a blob file system requires an `AccountKey` or `SasKey` for your storage account. For information on getting these keys, see [Manage storage account access keys](../storage/common/storage-account-keys-manage.md) or [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../storage/common/storage-sas-overview.md). For more information and tips on using blobfuse, see the blobfuse .

To get default access to the blobfuse mounted directory, run the task as an **Administrator**. Blobfuse mounts the directory at the user space, and at pool creation it is mounted as root. In Linux all **Administrator** tasks are root. All options for the FUSE module are described in the [FUSE reference page](https://manpages.ubuntu.com/manpages/xenial/man8/mount.fuse.8.html).

Review the [Troubleshoot FAQ](https://github.com/Azure/azure-storage-fuse/wiki/3.-Troubleshoot-FAQ) for more information and tips on using blobfuse. You can also review [GitHub issues in the blobfuse repository](https://github.com/Azure/azure-storage-fuse/issues) to check on current blobfuse issues and resolutions.

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
                SasKey = "SasKey",
                RelativeMountPath = "RelativeMountPath",
                BlobfuseOptions = "-o attr_timeout=240 -o entry_timeout=240 -o negative_timeout=120 "
            },
        }
    }
}
```

### Network File System

Network File Systems (NFS) can be mounted to pool nodes, allowing traditional file systems to be accessed by Azure Batch. This could be a single NFS server deployed in the cloud, or an on-premises NFS server accessed over a virtual network. NFS mounts support [Avere vFXT](../avere-vfxt/avere-vfxt-overview.md) distributed in-memory cache solution for data-intensive high-performance computing (HPC) tasks as well as other standard NFS compliant interfaces such as [NFS for Azure Blob](../storage/blobs/network-file-system-protocol-support.md) and [NFS for Azure Files](../storage/files/storage-files-how-to-mount-nfs-shares.md).

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
                MountOptions = "options ver=3.0"
            },
        }
    }
}
```

### Common Internet File System

Mounting [Common Internet File Systems (CIFS)](/windows/desktop/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) to pool nodes is another way to provide access to traditional file systems. CIFS is a file-sharing protocol that provides an open and cross-platform mechanism for requesting network server files and services. CIFS is based on the enhanced version of the [Server Message Block (SMB)](/windows-server/storage/file-server/file-server-smb-overview) protocol for internet and intranet file sharing.

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

If a mount configuration fails, the compute node in the pool will fail and the node state will be set to `unusable`. To diagnose a mount configuration failure, inspect the [`ComputeNodeError`](/rest/api/batchservice/computenode/get#computenodeerror) property for details on the error.

To get the log files for debugging, use [OutputFiles](batch-task-output-files.md) to upload the `*.log` files. The `*.log` files contain information about the file system mount at the `AZ_BATCH_NODE_MOUNTS_DIR` location. Mount log files have the format: `<type>-<mountDirOrDrive>.log` for each mount. For example, a `cifs` mount at a mount directory named `test` will have a mount log file named: `cifs-test.log`.

## Support Matrix

Azure Batch supports the following virtual file system types for node agents produced for their respective publisher and offer.

| OS Type | Azure Files Share | Azure Blob container | NFS mount | CIFS mount |
|---|---|---|---|---|
| Linux | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Windows | :heavy_check_mark: | :x: | :x: | :x: |

## Networking requirements

When using virtual file mounts with [Azure Batch pools in a virtual network](batch-virtual-network.md), keep in mind the following requirements and ensure no required traffic is blocked.

- **Azure File shares**:
  - Requires TCP port 445 to be open for traffic to/from the "storage" service tag. For more information, see [Use an Azure file share with Windows](../storage/files/storage-how-to-use-files-windows.md#prerequisites).
- **Azure Blob containers**:
  - Requires TCP port 443 to be open for traffic to/from the "storage" service tag.
  - VMs must have access to https://packages.microsoft.com in order to download the blobfuse and gpg packages. Depending on your configuration, you may also need access to other URLs to download additional packages.
- **Network File System (NFS)**:
  - Requires access to port 2049 (by default; your configuration may have other requirements).
  - VMs must have access to the appropriate package manager in order to download the nfs-common (for Debian or Ubuntu) or nfs-utils (for CentOS) package. This URL may vary based on your OS version. Depending on your configuration, you may also need access to other URLs to download additional packages.
  - Mounting Azure Blob or Azure Files via NFS may require additional networking requirements such as compute nodes sharing the same designated subnet of a virtual network as the storage account.
- **Common Internet File System (CIFS)**:
  - Requires access to TCP port 445.
  - VMs must have access to the appropriate package manager(s) in order to download the cifs-utils package. This URL may vary based on your OS version.

## Next steps

- Learn more about mounting an Azure Files share with [Windows](../storage/files/storage-how-to-use-files-windows.md) or [Linux](../storage/files/storage-how-to-use-files-linux.md).
- Learn about using and mounting [blobfuse](https://github.com/Azure/azure-storage-fuse) virtual file systems.
- See [Network File System overview](/windows-server/storage/nfs/nfs-overview) to learn about NFS and its applications.
- See [Microsoft SMB protocol and CIFS protocol overview](/windows/desktop/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) to learn more about CIFS.