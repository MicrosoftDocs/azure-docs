---
title: How to use the 'blobfuse2 completion fish' command to generate the autocompletion script for BlobFuse2
titleSuffix: Azure Storage
description: Learn how to use the 'blobfuse2 completion fish' command to generate the autocompletion script for BlobFuse2.
author: akashdubey-ms
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/02/2022
ms.author: akashdubey
ms.reviewer: tamram
---

# BlobFuse2 completion fish command

Use the `blobfuse2 completion fish` command to generate the autocompletion script for BlobFuse2 for the fish shell.

## Syntax

`blobfuse2 completion fish --[flag-name]=[flag-value]`

## Flags (options)

Flags that apply to `blobfuse2 completion fish` are inherited from the grandparent command, [`blobfuse2`](blobfuse2-commands.md), or apply only to the `blobfuse2 completion` subcommands.

### Flags inherited from the BlobFuse2 command

The following flags are inherited from grandparent command [`blobfuse2`](blobfuse2-commands.md):

| Flag | Short version | Value type | Default value | Description |
|--|--|--|--|--|
| disable-version-check |    | boolean | false | Enables or disables automatic version checking of the BlobFuse2 binaries |
| help                  | -h | n/a     |       | Help info for the blobfuse2 command and subcommands                      |

### Flags that apply to the BlobFuse2 completion subcommands

The following flags apply only to the `blobfuse2 completion` subcommands:

| Flag | Value type | Default value | Description |
|--|--|--|--|
| no-descriptions | boolean | false | Disable completion descriptions |

## Usage

To load completions in your current shell session:

`blobfuse2 completion fish | source`

To load completions for every new session, execute once:

`blobfuse2 completion fish > ~/.config/fish/completions/blobfuse2.fish`

> [!NOTE]
> You will need to start a new shell for this setup to take effect.

## See also

- [The Blobfuse2 completion command](blobfuse2-commands-completion.md)
- [The Blobfuse2 completion bash command](blobfuse2-commands-completion-bash.md)
- [The Blobfuse2 completion PowerShell command](blobfuse2-commands-completion-powershell.md)
- [The Blobfuse2 completion zsh command](blobfuse2-commands-completion-zsh.md)
