---
title: How to use the `blobfuse2 secure encrypt` command to encrypt a BlobFuse2 configuration file
titleSuffix: Azure Storage
description: Learn how to use the `blobfuse2 secure encrypt` command to encrypt a BlobFuse2 configuration file.
author: akashdubey-ms
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/02/2022
ms.author: akashdubey
# Customer intent: "As a cloud administrator, I want to encrypt my BlobFuse2 configuration file using the secure encrypt command, so that I can ensure the security of sensitive information stored in the configuration."
---

# How to use the BlobFuse2 secure encrypt command to encrypt a BlobFuse2 configuration file

Use the `blobfuse2 secure encrypt` command to encrypt a BlobFuse2 configuration file.

## Syntax

`blobfuse2 secure encrypt --[flag-name]=[flag-value]`

## Flags (options)

Flags that apply to `blobfuse2 secure encrypt` are inherited from the grandparent command, [`blobfuse2`](blobfuse2-commands.md), or apply only to the `blobfuse2 secure` subcommands.

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
| output-file        | string  | $HOME/.blobfuse2/{configFileName}.azsec      | Path and name for the output file |
| passphrase         | string  |  | The Key to be used for encryption or decryption<br />Can also be specified by environment variable BLOBFUSE2_SECURE_CONFIG_PASSPHRASE.<br />The key must be 16 (AES-128), 24 (AES-192), or 32 (AES-256) bytes in length. |

## Examples

> [!NOTE]
> The following examples assume you have already created a configuration file in the current directory. Additionally, once the encrypted configuration file is created, the original configuration file is deleted and it is replaced by the new encrypted configuration file. 

Encrypt a BlobFuse2 configuration file using a passphrase:

`blobfuse2 secure encrypt --config-file=./config.yaml --passphrase=PASSPHRASESAMPLE --output-file=./encryptedconfig.yaml`

## See also

- [The Blobfuse2 secure decrypt command](blobfuse2-commands-secure-decrypt.md)
- [The Blobfuse2 secure get command](blobfuse2-commands-secure-get.md)
- [The Blobfuse2 secure set command](blobfuse2-commands-secure-set.md)
- [The Blobfuse2 secure command](blobfuse2-commands-secure.md)
