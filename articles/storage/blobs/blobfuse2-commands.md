---
title: How to use the BlobFuse2 command set
titleSuffix: Azure Storage
description: Learn how to use the BlobFuse2 command set to mount blob storage containers as file systems on Linux, and manage them.
author: akashdubey-ms
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/02/2022
ms.author: akashdubey
ms.reviewer: tamram
---

# How to use the BlobFuse2 command set

This reference shows how to use the BlobFuse2 command set to mount Azure blob storage containers as file systems on Linux, and how to manage them.

## Syntax

The `blobfuse2` command has 2 formats:

`blobfuse2 --[flag-name]=[flag-value]`

`blobfuse2 [command] [arguments] --[flag-name]=[flag-value]`

## Flags (Options)

Most flags are specific to individual BlobFuse2 commands. See the documentation for [each command](#commands) for details and examples.

The following options can be used without a command or are inherited by individual commands:

| Flag | Short version | Value type | Default value | Description |
|--|--|--|--|--|
| disable-version-check |    | boolean | false | Whether to disable the automatic BlobFuse2 version check |
| help                  | -h | n/a     | n/a   | Help info for the blobfuse2 command and subcommands      |
| version               | -v | n/a     | n/a   | Display BlobFuse2 version information                    |

### Commands

The supported commands for BlobFuse2 are:

| Command | Description |
|--|--|
| [mount](blobfuse2-commands-mount.md)                   | Mounts an Azure blob storage container as a filesystem in Linux or lists mounted file systems |
| [mountv1](blobfuse2-commands-mountv1.md)               | Mounts a blob container using legacy BlobFuse configuration and CLI parameters |
| [unmount](blobfuse2-commands-unmount.md)               | Unmounts a BlobFuse2-mounted file system |
| [completion](blobfuse2-commands-completion.md)         | Generates an autocompletion script for BlobFuse2 for the specified shell |
| [secure](blobfuse2-commands-secure.md)                 | Encrypts or decrypts a configuration file, or gets or sets values in an encrypted configuration file |
| [version](blobfuse2-commands-version.md)               | Displays the current version of BlobFuse2 |
| [help](blobfuse2-commands-help.md)                     | Gives help information about any command |

## Arguments

BlobFuse2 command arguments are specific to the individual commands. See the documentation for [each command](#commands) for details and examples.

## See also

- [What is BlobFuse2?](blobfuse2-what-is.md)
- [How to mount an Azure blob storage container on Linux with BlobFuse2](blobfuse2-how-to-deploy.md)
- [BlobFuse2 configuration reference](blobfuse2-configuration.md)
- [How to troubleshoot BlobFuse2 issues](blobfuse2-troubleshooting.md)