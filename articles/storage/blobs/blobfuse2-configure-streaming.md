---
title: Configure BlobFuse for streaming mode
titleSuffix: Azure Storage
description: Learn how to configure BlobFuse for streaming mode.
author: normesta
ms.author: normesta

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 1/29/2026

ms.custom: linux-related-content

# Customer intent: "As a developer working with large files or sequential data access patterns, I want to configure BlobFuse in streaming mode to optimize memory usage and performance for my specific workload requirements."
---

# Configure BlobFuse for streaming mode

This article shows you how to configure BlobFuse to mount a container in _streaming mode_.

> [!TIP]
> You can mount a container in either _streaming mode_ or _caching mode_. To learn more about each mode, see [Streaming versus caching mode](blobfuse2-streaming-versus-caching.md).

In _streaming mode_, BlobFuse caches data in chunks (blocks) in memory for both reading and writing. For streaming during read and write operations, it caches blocks of data in memory as they're read or updated. BlobFuse flushes updates to Azure Storage when you close a file or when the buffer fills with dirty blocks.

## Configuration parameters

The following table describes each parameter and its default setting.

| Parameter | Description | Default value |
|-----------|-------------|---------------|
| Block size | The size in MB of each block to cache in memory | 16 MB |
| Memory size | Total amount of memory in MB to preallocate for the block cache | 80% of free memory |
| Path | The path to local disk cache where downloaded blocks are stored | Not applicable |
| Disk size | Maximum disk cache size allowed in MB | 80% of free disk space |
| Disk timeout | Disk cache eviction timeout in seconds | 120 seconds |
| Prefetch | The number of blocks to prefetch for serial read operations | 2 × number of CPU cores |
| Parallelism | The number of parallel threads downloading data and writing to disk cache | 3 × number of CPU cores |

The following example sets these values as parameters to the `mount` command.

```bash
blobfuse2 mount <mount-path> --streaming --block-cache-disk-size=16 --block-cache-block-size=80 --block-cache-disk-timeout=120
```

The following example shows how these settings appear in the BlobFuse configuration file:

```yaml
block_cache:
  block-size-mb: 16
  mem-size-mb: 80
  disk-timeout-sec: 120
```

For a complete example, see [Sample streaming configuration](https://github.com/Azure/azure-storage-fuse/blob/main/sampleBlockCacheConfig.yaml).

When you choose optimal configuration values, use the following diagram as a guide.

:::image type="content" source="media/blobfuse2-choose-data-transfer-mode/block-cache-configuration-decision-tree.png" alt-text="Diagram that shows how to configure block cache mode based on various factors." lightbox="media/blobfuse2-choose-data-transfer-mode/block-cache-configuration-decision-tree.png":::

### Recommendations for using streaming mode

- Applications must check the returned code (success or failure) for file system calls such as `read`, `write`, `close`, and `flush`. If an error is returned, the application must abort its respective operation.

- Applications must ensure that there's only one writer at a time for a given file.

- When dealing with large files (in TiBs), configure the block size accordingly. Azure Storage supports only [50,000 blocks](/rest/api/storageservices/put-block-list?tabs=microsoft-entra-id#remarks) per blob.

### Important considerations for streaming mode

- While you can read the same blob from multiple simultaneous threads, simultaneous write operations might result in unexpected file data outcomes, including data loss.

- While simultaneous read operations and a single write operation are supported, the data being read from some threads might not be current.

- Concurrent write operations on the same file using multiple handles aren't checked for data consistency and might lead to incorrect data being written.

- A read operation on a file that another process or handle is writing to simultaneously doesn't return the most up-to-date data.

- When copying files with trailing null bytes by using the `cp` utility to a BlobFuse mounted path, use the `--sparse=never` parameter to avoid data being trimmed. For example: `cp --sparse=never src dest`.

- For write operations, the application persists (or commits) data to the Azure Storage container only when it calls `close`, `sync`, or `flush` operations.

- You can't modify files if you originally created them with a block size different from the one currently configured.

You can disable caching at both the kernel and BlobFuse levels, or exclusively at the kernel level. For more information, see [Configure BlobFuse caching options](blobfuse2-configure-caching.md).

## Next steps

- [Mount an Azure Blob Storage container on Linux with BlobFuse](blobfuse2-mount-container.md)

## See also

- [What is BlobFuse?](blobfuse2-what-is.md)
- [Configure BlobFuse for caching mode](blobfuse2-configure-caching.md)
- [Compare streaming versus caching mode](blobfuse2-streaming-versus-caching.md)
- [BlobFuse configuration reference](blobfuse2-configuration.md)
- [BlobFuse frequently asked questions](blobfuse2-faq.yml)
