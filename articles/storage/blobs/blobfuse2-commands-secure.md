---
title: How to use the 'blobfuse2 secure' command to encrypt, decrypt, or access settings in a BlobFuse2 configuration file
titleSuffix: Azure Storage
description: Learn how to use the 'blobfuse2 secure' command to encrypt, decrypt, or access settings in a BlobFuse2 configuration file.
author: akashdubey-ms
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/02/2022
ms.author: akashdubey
ms.reviewer: tamram
---

# How to use the BlobFuse2 secure command

Use the `blobfuse2 secure` command to encrypt, decrypt, or access settings in a BlobFuse2 configuration file.

## Command Syntax

`blobfuse2 secure [command] --[flag-name]=[flag-value]`

## Arguments

`[command]`

The supported subcommands for `blobfuse2 secure` are:

| Command | Description |
|--|--|
| [encrypt](blobfuse2-commands-secure-encrypt.md)   | Encrypts a BlobFuse2 configuration file                               |
| [decrypt](blobfuse2-commands-secure-decrypt.md)   | Decrypts a BlobFuse2 configuration file                               |
| [get](blobfuse2-commands-secure-get.md)           | Gets a specified value from an encrypted BlobFuse2 configuration file |
| [set](blobfuse2-commands-secure-set.md)           | Sets a specified value in an encrypted BlobFuse2 configuration file   |

Select one of the command links in the table above to view the documentation for the individual subcommands, including the arguments and flags they support.

## Flags (options)

Flags that apply to `blobfuse2 secure` are inherited from the parent command, [`blobfuse2`](blobfuse2-commands.md), or apply only to the `blobfuse2 secure` subcommands.

### Flags inherited from the BlobFuse2 command

The following flags are inherited from parent command [`blobfuse2`](blobfuse2-commands.md):

| Flag | Short version | Value type | Default value | Description |
|--|--|--|--|--|
| disable-version-check |    | boolean | false | Enables or disables automatic version checking of the BlobFuse2 binaries |
| help                  | -h | n/a     | n/a   | Help info for the blobfuse2 command and subcommands                      |

### Flags that apply only to the BlobFuse2 secure command

The following flags apply only to command `blobfuse2 secure`:

| Flag | Value type | Default value | Description |
|--|--|--|--|
| config-file        | string  | ./config.yaml                  | The path configuration file       |
| output-file        | string  |                                | Path and name for the output file |
| passphrase         | string  |                                | The Key to be used for encryption or decryption<br />Can also be specified by environment variable BLOBFUSE2_SECURE_CONFIG_PASSPHRASE.<br />The key must be 16 (AES-128), 24 (AES-192), or 32 (AES-256) bytes in length. |

## Examples

For examples, see the documentation for [the individual subcommands](#arguments).

## See also

- [The Blobfuse2 secure encrypt command](blobfuse2-commands-secure-encrypt.md)
- [The Blobfuse2 secure decrypt command](blobfuse2-commands-secure-decrypt.md)
- [The Blobfuse2 secure get command](blobfuse2-commands-secure-get.md)
- [The Blobfuse2 secure set command](blobfuse2-commands-secure-set.md)
