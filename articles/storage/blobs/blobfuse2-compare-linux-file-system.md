---
title: BlobFuse and Linux file systems compared
titleSuffix: Azure Storage
description: Learn about the differences between a BlobFuse file system and a Linux file system.
author: normesta
ms.author: normesta

ms.service: azure-blob-storage
ms.topic: reference
ms.date: 1/29/2026

ms.custom: linux-related-content

# Customer intent: "As a developer or system administrator using BlobFuse, I want to understand how BlobFuse-mounted storage differs from native Linux file systems, so that I can set proper expectations and avoid potential issues when working with blob data."
---

# BlobFuse and Linux file systems compared

This article describes the similarities and differences between BlobFuse and native Linux file systems.

## Similarities between BlobFuse and Linux file systems

You can use BlobFuse-mounted storage similarly to a native Linux file system. The virtual directory scheme uses the same forward slash (`/`) delimiter. Basic file system operations such as `mkdir`, `opendir`, `readdir`, `rmdir`, `open`, `read`, `create`, `write`, `close`, `unlink`, `truncate`, `stat`, and `rename` work the same as in a native Linux file system.

## Differences between BlobFuse and Linux file systems

- **Hard link count in readdir**: For performance reasons, BlobFuse doesn't correctly report the number of hard links inside a directory. The hard link count for empty directories always returns as 2, and for nonempty directories always returns as 3, regardless of the actual number of hard links.

- **Non-atomic renames**: Azure Blob Storage doesn't support atomic rename operations. Single-file renames are actually two operations: a copy followed by deletion of the original. Directory renames recursively enumerate all files in the directory and rename each file individually.

- **Special files**: BlobFuse supports only directories, regular files, and symbolic links. Special files like device files, pipes, and sockets aren't supported.

- **mkfifo**: Fifo creation isn't supported by BlobFuse. Attempting this action results in a "function not implemented" error.

- **chown and chmod**: BlobFuse doesn't support `chown` operations for either block blob storage (FNS) or Data Lake Storage (HNS). FNS storage accounts don't support `chmod` operations. HNS storage accounts support `chmod` operations but only on child objects within the mount directory, not on the root mount directory itself.
  
- **Device files or pipes**: BlobFuse doesn't support creating device files or pipes.

- **Extended-attributes (x-attrs)**: BlobFuse doesn't support extended-attributes (`x-attrs`) operations.

- **Write streaming**: Concurrent read and write operations on large files might produce unpredictable results. Writing to the same blob simultaneously from different threads isn't supported.

## Next steps

- [Install BlobFuse](blobfuse2-install.md)
- [Configure BlobFuse](blobfuse2-configure.md)
- [Mount an Azure Blob Storage container](blobfuse2-mount-container.md)

## See also

- [What is BlobFuse?](blobfuse2-what-is.md)
