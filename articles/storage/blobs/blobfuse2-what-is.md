---
title: Use BlobFuse2 Preview to mount and manage Azure Blob Storage containers on Linux
titleSuffix: Azure Blob Storage
description: Learn about using BlobFuse2 Preview to mount and manage Azure Blob Storage containers on Linux.
author: jimmart-dev
ms.author: jammart
ms.reviewer: tamram
ms.date: 08/02/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
---

# What is BlobFuse2 Preview?

BlobFuse2 Preview is a virtual file system driver for Azure Blob Storage. Use BlobFuse2 to access your existing Azure block blob data in your storage account through the Linux file system. BlobFuse2 also supports storage accounts that have a hierarchical namespace enabled.

> [!IMPORTANT]
> BlobFuse2 is the next generation of BlobFuse and currently is in preview. The preview version is provided without a service-level agreement. We don't recommend that you use the preview version for production workloads. In the preview version, certain features might not be supported or might have constrained capabilities.
>
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> If you need to use BlobFuse in a production environment, BlobFuse v1 is generally available. For information about the general availability (GA) version, see:
>
> - [The BlobFuse v1 setup documentation](storage-how-to-mount-container-linux.md)
> - [The BlobFuse v1 project on GitHub](https://github.com/Azure/azure-storage-fuse/tree/master)

## About the BlobFuse2 open source project

BlobFuse2 is an open source project that uses the libfuse open source library (fuse3) to communicate with the Linux FUSE kernel module, and implements the filesystem operations using the Azure Storage REST APIs.

The open source BlobFuse2 project can be found on GitHub:

- [BlobFuse2 home page](https://github.com/Azure/azure-storage-fuse/tree/main)
- [BlobFuse2 README](https://github.com/Azure/azure-storage-fuse/blob/main/README.md)
- [Report BlobFuse2 issues](https://github.com/Azure/azure-storage-fuse/issues)

### Licensing

This project is [licensed under MIT](https://github.com/Azure/azure-storage-fuse/blob/main/LICENSE).

## Features

A full list of BlobFuse2 features is in the [BlobFuse2 README](https://github.com/Azure/azure-storage-fuse/blob/main/README.md#features). Some key features are:

- Mount an Azure storage blob container or Data Lake Storage Gen2 file system on Linux
- Use basic file system operations, such as mkdir, opendir, readdir, rmdir, open, read, create, write, close, unlink, truncate, stat, and rename
- Local caching to improve subsequent access times
- Streaming to support reading and writing large files
- Parallel downloads and uploads to improve access time for large files
- Multiple mounts to the same container for read-only workloads

## BlobFuse2 enhancements

BlobFuse2 has more feature support and improved performance in multiple user scenarios over v1. For the extensive list of improvements, see [the BlobFuse2 README](https://github.com/Azure/azure-storage-fuse/blob/main/README.md#distinctive-features-compared-to-blobfuse-v1x). A summary of enhancements is provided below:

- Improved caching
- More management support through new Azure CLI commands
- Additional logging support
- Compatibility and upgrade options for BlobFuse v1 users
- Version checking and upgrade prompting
- Support for configuration file encryption

For a list of BlobFuse2 performance enhancements from BlobFuse v1, see the [BlobFuse2 README](https://github.com/Azure/azure-storage-fuse/blob/main/README.md#blobfuse2-performance-compared-to-blobfusev1xx).

### For BlobFuse v1 users

The enhancements provided by BlobFuse2 are compelling reasons to upgrade and migrate to BlobFuse2. If you aren't ready to migrate, you can [use BlobFuse2 to mount a blob container by using the same configuration options and Azure CLI parameters you used with BlobFuse v1](blobfuse2-commands-mountv1.md).

The [BlobFuse2 Migration Guide](https://github.com/Azure/azure-storage-fuse/blob/main/MIGRATION.md) provides all the details you need for compatibility and migrating your current workloads.

## Support

BlobFuse2 is supported by Microsoft if it's used within the specified [limits](#limitations). If you encounter an issue in this preview version, [report it on GitHub](https://github.com/Azure/azure-storage-fuse/issues).

## Limitations

BlobFuse2 doesn't guarantee 100% POSIX compliance because it simply translates requests into [Blob REST APIs](/rest/api/storageservices/blob-service-rest-api). For example, rename operations are atomic in POSIX but not in BlobFuse2.

See [the full list of differences between a native file system and BlobFuse2](#differences-between-the-linux-file-system-and-blobfuse2).

### Differences between the Linux file system and BlobFuse2

In many ways, you can use BlobFuse2-mounted storage just like the native Linux file system. The virtual directory scheme is the same and uses the forward slash (`/`) as a delimiter. Basic file system operations, such as `mkdir`, `opendir`, `readdir`, `rmdir`, `open`, `read`, `create`, `write`, `close`, `unlink`, `truncate`, `stat`, and `rename` work the same as in the Linux file system.

However, there are some key differences in the way BlobFuse2 behaves:

- **Readdir count of hardlinks**:

  For performance reasons, BlobFuse2 does not correctly report the hard links inside a directory. The number of hard links for empty directories is returned as 2. The number for non-empty directories is always returned as 3, regardless of the actual number of hard links.

- **Non-atomic renames**:

  Atomic rename operations aren't supported by the Azure Storage Blob Service. Single file renames are actually two operations - a copy, followed by a delete of the original. Directory renames recursively enumerate all files in the directory, and renames each.

- **Special files**:

  Blobfuse supports only directories, regular files, and symbolic links. Special files, such as device files, pipes, and sockets aren't supported.

- **`mkfifo`**:

  Fifo creation isn't supported by BlobFuse2. Attempting this action results in a "function not implemented" error.

- **`chown` and `chmod`**:

  Data Lake Storage Gen2 storage accounts support per object permissions and ACLs, while flat namespace (FNS) block blobs don't. As a result, BlobFuse2 doesn't support the `chown` and `chmod` operations for mounted block blob containers. The operations are supported for Data Lake Storage Gen2.

- **Device files or pipes**:

  Creation of device files or pipes isn't supported by BlobFuse2.

- **Extended-attributes (x-attrs)**:

  BlobFuse2 doesn't support extended-attributes (x-attrs) operations.

### Data integrity

When a file is written to, the data is first persisted into cache on a local disk. The data is written to blob storage only after the file handle is closed. If there's an issue attempting to persist the data to blob storage, you receive an error message.

BlobFuse2 supports both read and write operations. Continuous synchronization of data written to storage by using other APIs or other mounts of BlobFuse2 aren't guaranteed. For data integrity, it's recommended that multiple sources don't modify the same blob, especially at the same time. If one or more applications attempt to write to the same file simultaneously, the results can be unexpected. Depending on the timing of multiple write operations and the freshness of the cache for each, the result could be that the last writer wins and previous writes are lost, or generally that the updated file isn't in the desired state.

> [!WARNING]
> In cases where multiple file handles are open to the same file, simultaneous write operations could result in data loss.

### Permissions

When a container is mounted with the default options, all files get 770 permissions, and only be accessible by the user doing the mounting. If you want to allow anyone on your machine to access the BlobFuse2 mount, mount it with option "--allow-other". This option can also be configured through the *.yaml* config file.

As stated previously, the `chown` and `chmod` operations are supported for Data Lake Storage Gen2, but not for flat namespace (FNS) block blobs. Running a `chmod` operation against a mounted FNS block blob container returns a success message, but the operation won't actually succeed.

## Feature support

This table shows how this feature is supported in your account and the impact on support when you enable certain capabilities.

| Storage account type | Blob Storage (default support) | Data Lake Storage Gen2 <sup>1</sup> | NFS 3.0 <sup>1</sup> | SFTP <sup>1</sup> |
|--|--|--|--|--|
| Standard general-purpose v2 | ![Yes](../media/icons/yes-icon.png) |![Yes](../media/icons/yes-icon.png)              | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Premium block blobs          | ![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

<sup>1</sup> Data Lake Storage Gen2, Network File System (NFS) 3.0 protocol, and SSH File Transfer Protocol (SFTP) support all require a storage account that has a hierarchical namespace enabled.

## Next steps

- [How to mount an Azure blob storage container on Linux with BlobFuse2 Preview](blobfuse2-how-to-deploy.md)
- [The BlobFuse2 Migration Guide (from v1)](https://github.com/Azure/azure-storage-fuse/blob/main/MIGRATION.md)

## See also

- [BlobFuse2 Preview configuration reference](blobfuse2-configuration.md)
- [BlobFuse2 Preview command reference](blobfuse2-commands.md)
- [How to troubleshoot BlobFuse2 Preview issues](blobfuse2-troubleshooting.md)
