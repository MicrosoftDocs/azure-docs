---
title: How to use the 'blobfuse2 version' command to get the current version and optionally check for a newer one
titleSuffix: Azure Storage
description: Learn how to use the 'blobfuse2 version' command to get the current version and optionally check for a newer one.
author: akashdubey-ms
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/02/2022
ms.author: akashdubey
ms.reviewer: tamram
---

# BlobFuse2 version command

Use the `blobfuse2 version` command to display the current version of BlobFuse2, and optionally check for latest version.

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

- [The Blobfuse2 command set](blobfuse2-commands.md)
