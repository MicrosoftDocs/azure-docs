---
title: How to use the 'blobfuse2 unmount all' command to unmount all blob containers in a storage account as a Linux file system
titleSuffix: Azure Storage
description: Learn how to use the 'blobfuse2 unmount all' command to unmount all blob containers in a storage account as a Linux file system.
author: jimmart-dev
ms.service: storage
ms.custom: devx-track-linux
ms.topic: how-to
ms.date: 12/02/2022
ms.author: jammart
ms.reviewer: tamram
---

# How to use the BlobFuse2 unmount all command to unmount all existing mount points

Use the `blobfuse2 unmount all` command to unmount all existing BlobFuse2 mount points.

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
sudo blobfuse2 unmount all
```

## See also

- [The Blobfuse2 unmount command](blobfuse2-commands-unmount.md)
- [The Blobfuse2 mount all command](blobfuse2-commands-mount-all.md)
