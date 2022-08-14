---
title: How to use the BlobFuse2 version command to get the current version and optionally check for a newer one (preview) | Microsoft Docs
titleSuffix: Azure Blob Storage
description: Learn how to use the BlobFuse2 version command to get the current version and optionally check for a newer one (preview).
author: jimmart-dev
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.date: 08/02/2022
ms.author: jammart
ms.reviewer: tamram
---

# BlobFuse2 version command (preview)

Use the `blobfuse2 version` command to display the current version of BlobFuse2, and optionally check for latest version.

> [!IMPORTANT]
> BlobFuse2 is the next generation of BlobFuse and is currently in preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> BlobFuse v1 is generally available (GA). For information about the GA version, see:
>
> - [The BlobFuse v1 project on GitHub](https://github.com/Azure/azure-storage-fuse/tree/master)
> - [The BlobFuse v1 setup documentation](storage-how-to-mount-container-linux.md)

## Syntax

`blobfuse2 version --[flag-name]=[flag-value]`

## Flags (options)

Some flags are inherited from the parent command, [`blobfuse2`](blobfuse2-commands.md), and others only apply to the `blobfuse2 version` command.

### Flags inherited from the BlobFuse2 command

The following flags are inherited from parent command [`blobfuse2`](blobfuse2-commands.md)):

| Flag | Short version | Value type | Default value | Description |
|--|--|--|--|--|
| disable-version-check |    | boolean | false | Enables or disables automatic version checking of the BlobFuse2 binaries |
| help                  | -h | n/a     | n/a   | Help info for the blobfuse2 command and subcommands                      |

### Flags that apply only to the BlobFuse2 version command

The following flags apply only to command `blobfuse2 version`:

| Flag | Value type | Default value | Description |
|--|--|--|--|
| check | boolean | false | Check for the latest version |

## Examples

`blobfuse2 version --check=true`

## See also

- [The Blobfuse2 command set (preview)](blobfuse2-commands.md)
