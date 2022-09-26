---
title: How to use the BlobFuse2 unmount all command to unmount all blob containers in a storage account as a Linux file system (preview) | Microsoft Docs
titleSuffix: Azure Blob Storage
description: Learn how to use the BlobFuse2 unmount all command to unmount all blob containers in a storage account as a Linux file system (preview).
author: jimmart-dev
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.date: 08/02/2022
ms.author: jammart
ms.reviewer: tamram
---

# How to use the BlobFuse2 unmount all command to unmount all existing mount points (preview)

Use the `blobfuse2 unmount all` command to unmount all existing BlobFuse2 mount points.

> [!IMPORTANT]
> BlobFuse2 is the next generation of BlobFuse and is currently in preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> If you need to use BlobFuse in a production environment, BlobFuse v1 is generally available (GA). For information about the GA version, see:
>
> - [The BlobFuse v1 setup documentation](storage-how-to-mount-container-linux.md)
> - [The BlobFuse v1 project on GitHub](https://github.com/Azure/azure-storage-fuse/tree/master)

## Syntax

`blobfuse2 unmount all --[flag-name]=[flag-value]`

## Flags (options)

Flags that apply to `blobfuse2 unmount all` are inherited from the grandparent command, [`blobfuse2`](blobfuse2-commands.md).

### Flags inherited from BlobFuse2

The following flags are inherited from grandparent command [`blobfuse2`](blobfuse2-commands.md):

| Flag | Short version | Value type | Default value | Description |
|--|--|--|--|--|
| disable-version-check |    | boolean | false | Enables or disables automatic version checking of the BlobFuse2 binaries |
| help                  | -h | n/a     |       |Help info for the blobfuse2 command and subcommands                       |

## Examples

Unmount all BlobFuse2 mount points:

```bash
blobfuse2 unmount all
```

## See also

- [The Blobfuse2 unmount command (preview)](blobfuse2-commands-unmount.md)
- [The Blobfuse2 mount all command (preview)](blobfuse2-commands-mount-all.md)
