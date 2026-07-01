---
title: Limitations and known issues with BlobFuse
titleSuffix: Azure Storage
description: Learn about the limitations and known issues of BlobFuse.
author: normesta
ms.author: normesta

ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 1/29/2026

ms.custom: linux-related-content

# Customer intent: "As a Linux user, I want to mount Azure Blob Storage as a file system using BlobFuse, so that I can perform standard file operations and improve access to my data in a familiar environment."
---

# Limitations and known issues with BlobFuse

This article describes the limitations and known issues of BlobFuse.

## Chmod operations in premium performance block blob accounts

Premium performance block blob accounts don't support access control lists (ACLs). However, BlobFuse returns success for `chmod` operations in these accounts even though the operations have no effect. 

## Admin privilege required to interact with the fuse driver

When you mount BlobFuse on a container, it requires SYS_ADMIN privileges to interact with the fuse driver. If you create the container without this privilege, the mount operation fails. Here's a sample command to spawn a Docker container with the required privileges:

```bash
docker run -it --rm --cap-add=SYS_ADMIN --device=/dev/fuse --security-opt apparmor:unconfined <environment variables> <docker image>
```

## Limit on the number of containers that you can mount in parallel

When you use the `mount all` command, the system might limit the number of containers that you can mount in parallel (typically when you exceed 100 containers). To increase this system limit, use the following command:

```bash
echo 256 | sudo tee /proc/sys/fs/inotify/max_user_instances
```

### Syslog and securing sensitive information

By default, BlobFuse sends logs to syslog. The default settings might log file paths to syslog in some cases. If this information is sensitive, turn off logging or set the log-level to `log_err`.  

## Unsupported file system operations

BlobFuse doesn't support the following file system operations:

- `mknod`
- `link` (hard link API)
- `setxattr`
- `getxattr`
- `listxattr`
- `removexattr`
- `access`
- `lock`
- `bmap`
- `ioctl`
- `poll`
- `write_buf`
- `read_buf`
- `flock`
- `fallocate`
- `copyfilerange`
- `lseek`

## Unsupported file system workflows

BlobFuse doesn't support the following file system workflows:

- Creation of pipes, FIFO queues, and device files
- XAttrs for files or directories
- Hard links for files or directories
- Last access time and last change time for any file or directory
- Extended-attributes (x-attrs) operations
- `lseek()` operation on directory handles (no error is thrown, but it doesn't work as expected)

### Specific command limitations

- **`mkfifo`**: BlobFuse doesn't support FIFO creation and returns a "function not implemented" error.
- **`chown`**: Azure Storage doesn't support change of ownership, so BlobFuse doesn't support this operation.

## Altered behavior for some file system operations

The following file system operations have altered behavior in BlobFuse:

- **`fsync()`**: Force deletes the file from local cache and invalidates the attribute cache. This action forces BlobFuse to refresh the file metadata and contents on the next open call to that file.
- **`fsyncdir()`**: Invalidates metadata of that directory recursively. This action forces BlobFuse to refresh metadata of any child of that directory on the next metadata query by the kernel.

## Unsupported scenarios

- **Overlapping mount paths**: BlobFuse doesn't support overlapping mount paths. When running multiple instances of BlobFuse, ensure each instance has a unique and nonoverlapping mount point.

- **Co-existence with NFS**: BlobFuse doesn't support coexistence with NFS on the same mount path. The behavior in this case is undefined.

- **Flat namespace storage accounts**: For storage accounts that have a flat namespace, when you upload data through other means, BlobFuse expects special directory marker files to exist in the container. For example, if you have a blob `A/B/c.txt`, then special marker files should exist for `A` and `A/B`. To overcome this requirement, BlobFuse uses the ListBlob API instead of the GetBlobProperties API for `ls` operations, though ListBlob is more expensive.

- **Virtual directory configuration**: For storage accounts that have a flat namespace, you can use the `--virtual-directory=false` CLI flag or the `virtual-directory=false` option under the `azstorage` section to switch from the ListBlob API to the GetBlobProperties API. However, in the absence of special directory markers, BlobFuse can't identify directories. A possible workaround is to either create the directory marker files manually through the portal or run the `mkdir` command for `A` and `A/B` from BlobFuse. For more information, see [this GitHub issue](https://github.com/Azure/azure-storage-fuse/issues/866).

- **Non-HNS accounts**: On non-HNS (hierarchical namespace) accounts, chmod operations aren't permitted, and BlobFuse returns success in such cases without actually performing the operation.

## Breaking changes

### Direct I/O and caching behavior

To improve performance of repetitive reads from a file, BlobFuse utilizes kernel cache. The kernel page cache can only be turned on or off but can't be controlled by timeout-based expiry. This limitation creates an issue in environments where you want to sync the latest file from the container to your local mount. As long as the kernel cache is valid, the kernel doesn't request new contents from the underlying filesystem (BlobFuse).

To disable the kernel data cache, use the `direct_io` option. Besides the data cache, the kernel also maintains a metadata cache. This metadata cache is driven by timeouts configured by using `attribute_timeout`, `entry_timeout`, and `negative_timeout`. If you want an immediate refresh of contents, set all these timeouts to 0 along with using `direct_io`. With these configuration parameters, kernel-level caching is disabled. Additionally, you also have to disable BlobFuse-level caching (`file_cache` and `attr_cache`) with their timeouts set to 0.

To disable all caching, you need to configure roughly seven parameters. To simplify this process, the auto config feature in version 2.4.0 disables everything when you use the `direct_io` option. This change simplifies the customer experience, which previously generated issues and complaints about the configuration being too complicated.

However, this change disables both kernel and BlobFuse caching, so BlobFuse starts making more calls to storage. This change has a cost impact on customers where the higher number of calls not only degrades performance but also increases costs. To address this problem, version 2.5.0 introduces a new CLI parameter called `disable-kernel-cache`, which only disables kernel-level data and metadata caching. You can then control BlobFuse-level caching by using file-cache timeout and attr-cache timeout values. This configuration allows you to refresh the contents according to your application needs. For example, if your application is fine with contents being refreshed every five seconds, set the file and attribute cache timeouts to five seconds and use this new CLI flag. With this configuration, your application gets refreshed contents every five seconds while keeping costs under control.

## Synchronizing with data written by other APIs

BlobFuse supports read and write operations. However, continuous synchronization of data written to storage by using other APIs or other mounts of BlobFuse isn't guaranteed. For data integrity, don't modify the same blob from multiple sources, especially simultaneously. If one or more applications attempt to write to the same file at the same time, the results might be unexpected. Depending on the timing of multiple write operations and the freshness of the cache for each operation, the result might be that the last writer wins and previous writes are lost, or that the updated file isn't in the intended state.

## See also

- [Troubleshooting BlobFuse](blobfuse2-troubleshooting.md)
- [BlobFuse frequently asked questions](blobfuse2-faq.yml)
- [What is BlobFuse?](blobfuse2-what-is.md)
