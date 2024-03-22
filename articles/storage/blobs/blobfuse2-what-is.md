---
title: What is BlobFuse? - BlobFuse2
titleSuffix: Azure Storage
description: An overview of how to use BlobFuse to mount an Azure Blob Storage container through the Linux file system.
author: akashdubey-ms
ms.author: akashdubey
ms.reviewer: tamram
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/02/2022
ms.custom: engagement-fy23
---

# What is BlobFuse? - BlobFuse2

BlobFuse is a virtual file system driver for Azure Blob Storage. Use BlobFuse to access your existing Azure block blob data through the Linux file system.

## About the BlobFuse2 open source project

BlobFuse2 is an open source project that uses the libfuse open source library (fuse3) to communicate with the Linux FUSE kernel module. BlobFuse2 implements file system operations by using the Azure Storage REST APIs.

The open source BlobFuse2 project is on GitHub:

- [BlobFuse2 repository](https://github.com/Azure/azure-storage-fuse/tree/main)
- [BlobFuse2 README](https://github.com/Azure/azure-storage-fuse/blob/main/README.md)
- [Report BlobFuse2 issues](https://github.com/Azure/azure-storage-fuse/issues)

### Licensing

The BlobFuse2 project is [licensed under the MIT license](https://github.com/Azure/azure-storage-fuse/blob/main/LICENSE).

## Features

A full list of BlobFuse2 features is in the [BlobFuse2 README](https://github.com/Azure/azure-storage-fuse/blob/main/README.md#features). These are some of the key tasks you can perform by using BlobFuse2:

- Mount an Azure Blob Storage container or Azure Data Lake Storage Gen2 file system on Linux.  (BlobFuse2 supports storage accounts with either flat namespaces or hierarchical namespace configured.)
- Use basic file system operations like `mkdir`, `opendir`, `readdir`, `rmdir`, `open`, `read`, `create`, `write`, `close`, `unlink`, `truncate`, `stat`, and `rename`.
- Use local file caching to improve subsequent access times.
- Gain insights into mount activities and resource usage by using BlobFuse2 Health Monitor.

Other key features in BlobFuse2 include:

- Streaming to support reading and writing large files
- Parallel downloads and uploads to improve access time for large files
- Multiple mounts to the same container for read-only workloads

## BlobFuse2 enhancements from BlobFuse v1

BlobFuse2 has more feature support and improved performance in multiple user scenarios from BlobFuse v1. For the extensive list of improvements, see the [BlobFuse2 README](https://github.com/Azure/azure-storage-fuse/blob/main/README.md#distinctive-features-compared-to-blobfuse-v1x). Here's a summary of enhancements in BlobFuse2 from BlobFuse v1:

- Improved caching
- More management support through new Azure CLI commands
- More logging support
- The addition of write-streaming for large files (previously, only read-streaming was supported)
- New BlobFuse2 Health Monitor to help you gain insights into mount activities and resource usage
- Compatibility and upgrade options for existing BlobFuse v1 users
- Version checking and upgrade prompting
- Support for configuration file encryption

See the [list of BlobFuse2 performance enhancements](https://github.com/Azure/azure-storage-fuse/blob/main/README.md#blobfuse2-performance-compared-to-blobfusev1xx) from BlobFuse v1.

### For BlobFuse v1 users

The enhancements provided by BlobFuse2 are compelling reasons to upgrade and migrate to BlobFuse2. If you aren't ready to migrate, you can use BlobFuse2 to [mount a blob container by using the same configuration options and Azure CLI parameters you use with BlobFuse v1](blobfuse2-commands-mountv1.md).

The [BlobFuse2 migration guide](https://github.com/Azure/azure-storage-fuse/blob/main/MIGRATION.md) provides all the details you need for compatibility and migrating your current workloads.

## Support

BlobFuse2 is supported by Microsoft if it's used within the specified [limits](#limitations). If you encounter an issue, [report it on GitHub](https://github.com/Azure/azure-storage-fuse/issues).

## Limitations

BlobFuse2 doesn't guarantee 100% POSIX compliance because BlobFuse2 simply translates requests into [Blob REST APIs](/rest/api/storageservices/blob-service-rest-api). For example, rename operations are atomic in POSIX but not in BlobFuse2.

See [the full list of differences between a native file system and BlobFuse2](#differences-between-the-linux-file-system-and-blobfuse2).

### Differences between the Linux file system and BlobFuse2

In many ways, you can use BlobFuse2-mounted storage just like the native Linux file system. The virtual directory scheme is the same and uses a forward slash (`/`) as a delimiter. Basic file system operations like `mkdir`, `opendir`, `readdir`, `rmdir`, `open`, `read`, `create`, `write`, `close`, `unlink`, `truncate`, `stat`, and `rename` work the same as in the Linux file system.

BlobFuse2 is different from the Linux file system in some key ways:

- **Readdir count of hard links**:

  For performance reasons, BlobFuse2 doesn't correctly report the hard links inside a directory. The number of hard links for empty directories returns as 2. The number for non-empty directories always returns as 3, regardless of the actual number of hard links.

- **Non-atomic renames**:

  Azure Blob Storage doesn't support atomic rename operations. Single-file renames are actually two operations: a copy, and then a deletion of the original. Directory renames recursively enumerate all files in the directory and renames each file.

- **Special files**:

  BlobFuse2 supports only directories, regular files, and symbolic links. Special files like device files, pipes, and sockets aren't supported.

- **mkfifo**:

  Fifo creation isn't supported by BlobFuse2. Attempting this action results in a "function not implemented" error.

- **chown and chmod**:

  Data Lake Storage Gen2 storage accounts support per object permissions and ACLs, but flat namespace (FNS) block blobs don't. As a result, BlobFuse2 doesn't support the `chown` and `chmod` operations for mounted block blob containers. The operations are supported for Data Lake Storage Gen2.

- **Device files or pipes**:

  BlobFuse2 doesn't support creating device files or pipes.

- **Extended-attributes (x-attrs)**:

  BlobFuse2 doesn't support extended-attributes (`x-attrs`) operations.

- **Write-streaming**:

  Concurrent streaming of read and write operations on large file data might produce unpredictable results. Simultaneously writing to the same blob from different threads isn't supported.

### Data integrity

File caching plays an important role in the integrity of data that's read and written to a Blob Storage file system mount. We recommend streaming mode for use with large files, which supports streaming for both read and write operations. BlobFuse2 caches blocks of streaming files in memory. For smaller files that don't consist of blocks, the entire file is stored in memory. File cache is the second mode. We recommend file cache for workloads that don't contain large files, such as when files are stored on disk in their entirety.

BlobFuse2 supports read and write operations. Continuous synchronization of data written to storage by using other APIs or other mounts of BlobFuse2 isn't guaranteed. For data integrity, we recommend that multiple sources don't modify the same blob, especially at the same time. If one or more applications attempt to write to the same file simultaneously, the results might be unexpected. Depending on the timing of multiple write operations and the freshness of the cache for each operation, the result might be that the last writer wins and previous writes are lost, or generally that the updated file isn't in the intended state.

#### File caching on disk

When a file is the subject of a write operation, the data is first persisted to cache on a local disk. The data is written to Blob Storage only after the file handle is closed. If an issue attempting to persist the data to Blob Storage occurs, an error message appears.

#### Streaming

For streaming during read and write operations, blocks of data are cached in memory as they're read or updated. Updates are flushed to Azure Storage when a file is closed or when the buffer is filled with dirty blocks.

Reading the same blob from multiple simultaneous threads is supported. However, simultaneous write operations might result in unexpected file data outcomes, including data loss. Performing simultaneous read operations and a single write operation is supported, but the data being read from some threads might not be current.

### Permissions

When a container is mounted with the default options, all files get 770 permissions and are accessible only by the user who does the mounting. To allow any user to access the BlobFuse2 mount, mount BlobFuse2 by using the `--allow-other` option. You also can configure this option in the YAML config file.

As stated earlier, the `chown` and `chmod` operations are supported for Data Lake Storage Gen2, but not for FNS block blobs. Running a `chmod` operation against a mounted FNS block blob container returns a success message, but the operation doesn't actually succeed.

## Feature support

This table shows how this feature is supported in your account and the effect on support when you enable certain capabilities.

| Storage account type | Blob Storage (default support) | Data Lake Storage Gen2 <sup>1</sup> | Network File System (NFS) 3.0 <sup>1</sup> | SSH File Transfer Protocol (SFTP) <sup>1</sup> |
|--|--|--|--|--|
| Standard general-purpose v2 | ![Yes](../media/icons/yes-icon.png) |![Yes](../media/icons/yes-icon.png)              | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Premium block blobs          | ![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

<sup>1</sup> Data Lake Storage Gen2, the NFS 3.0 protocol, and SFTP support all require a storage account that has a hierarchical namespace enabled.

## See also

- [Migrate to BlobFuse2 from BlobFuse v1](https://github.com/Azure/azure-storage-fuse/blob/main/MIGRATION.md)
- [BlobFuse2 commands](blobfuse2-commands.md)
- [Troubleshoot BlobFuse2 issues](blobfuse2-troubleshooting.md)

## Next steps

- [Mount an Azure Blob Storage container on Linux by using BlobFuse2](blobfuse2-how-to-deploy.md)
- [Configure settings for BlobFuse2](blobfuse2-configuration.md)
- [Use Health Monitor to gain insights into BlobFuse2 mount activities and resource usage](blobfuse2-health-monitor.md)
