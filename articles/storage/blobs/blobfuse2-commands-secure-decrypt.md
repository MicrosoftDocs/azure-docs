---
title: How to use the BlobFuse2 secure decrypt command to decrypt a BlobFuse2 configuration file (preview) | Microsoft Docs
titleSuffix: Azure Blob Storage
description: Learn how to use the BlobFuse2 secure decrypt command to decrypt a BlobFuse2 configuration file (preview).
author: jimmart-dev
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.date: 08/02/2022
ms.author: jammart
ms.reviewer: tamram
---

# How to use the BlobFuse2 secure decrypt command to decrypt a BlobFuse2 configuration file (preview)

Use the `BlobFuse2 secure decrypt` command to decrypt a BlobFuse2 configuration file.

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

`blobfuse2 secure decrypt --[flag-name]=[flag-value]`

## Flags (options)

Flags that apply to `blobfuse2 secure decrypt` are inherited from the grandparent command, [`blobfuse2`](blobfuse2-commands.md), or apply only to the `blobfuse2 secure` subcommands.

### Flags inherited from the BlobFuse2 command

The following flags are inherited from grandparent command [`blobfuse2`](blobfuse2-commands.md):

| Flag | Short version | Value type | Default value | Description |
|--|--|--|--|--|
| disable-version-check |    | boolean | false | Enables or disables automatic version checking of the BlobFuse2 binaries |
| help                  | -h | n/a     |       | Help info for the blobfuse2 command and subcommands                      |

### Flags inherited from the BlobFuse2 secure command

The following flags are inherited from parent command [`blobfuse2 secure`](blobfuse2-commands-secure.md):

| Flag | Value type | Default value | Description |
|--|--|--|--|
| config-file        | string  | ./config.yaml                  | The path configuration file       |
| output-file        | string  |                                | Path and name for the output file |
| passphrase         | string  |                                | The Key to be used for encryption or decryption<br />Can also be specified by environment variable BLOBFUSE2_SECURE_CONFIG_PASSPHRASE.<br />The key must be 16 (AES-128), 24 (AES-192), or 32 (AES-256) bytes in length. |

## Examples

> [!NOTE]
> The following examples assume you have already created a configuration file in the current directory.

Decrypt a BlobFuse2 configuration file using a passphrase:

`blobfuse2 secure decrypt --config-file=./config.yaml --passphrase=PASSPHRASE`

## See also

- [The Blobfuse2 secure encrypt command (preview)](blobfuse2-commands-secure-encrypt.md)
- [The Blobfuse2 secure get command (preview)](blobfuse2-commands-secure-get.md)
- [The Blobfuse2 secure set command (preview)](blobfuse2-commands-secure-set.md)
- [The Blobfuse2 secure command (preview)](blobfuse2-commands-secure.md)
