---
title: How to use the 'blobfuse2 secure get' command to display the value of a parameter from an encrypted BlobFuse2 configuration file
titleSuffix: Azure Storage
description: Learn how to use the 'blobfuse2 secure get' command to display the value of a parameter from an encrypted BlobFuse2 configuration file
author: akashdubey-ms
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/02/2022
ms.author: akashdubey
ms.reviewer: tamram
---

# How to use the BlobFuse2 secure get command to display the value of a parameter from an encrypted BlobFuse2 configuration file

Use the `blobfuse2 secure get` command to display the value of a specified parameter from an encrypted BlobFuse2 configuration file.

## Syntax

`blobfuse2 secure get --[flag-name]=[flag-value]`

## Flags (options)

Flags that apply to `blobfuse2 secure get` are inherited from the grandparent command, [`blobfuse2`](blobfuse2-commands.md), or apply only to the `blobfuse2 secure` subcommands.

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

### Flags that apply only to the BlobFuse2 secure get command

The following flags apply only to command `blobfuse2 secure get` command:

| Flag | Short<br />version | Value<br />type | Default<br />value | Description |
|--|--|--|--|--|
| key | | string | | Configuration key (parameter) to be searched in an encrypted config file |

## Examples

> [!NOTE]
> The following examples assume you have already created a configuration file in the current directory.

Get the value of parameter `logging.log_level` from an encrypted BlobFuse2 configuration file using a passphrase:

`blobfuse2 secure get --config-file=./config.yaml --passphrase=PASSPHRASE --key=logging.log_level`

## See also

- [The Blobfuse2 secure set command](blobfuse2-commands-secure-set.md)
- [The Blobfuse2 secure encrypt command](blobfuse2-commands-secure-encrypt.md)
- [The Blobfuse2 secure decrypt command](blobfuse2-commands-secure-decrypt.md)
- [The Blobfuse2 secure command](blobfuse2-commands-secure.md)
