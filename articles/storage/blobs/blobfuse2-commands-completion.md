---
title: How to use the 'blobfuse2 completion' command to generate the autocompletion script for BlobFuse2
titleSuffix: Azure Storage
description: Learn how to use the 'blobfuse2 completion' command to generate the autocompletion script for BlobFuse2.
author: akashdubey-ms
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/02/2022
ms.author: akashdubey
ms.reviewer: tamram
---

# BlobFuse2 completion command

Use the `blobfuse2 completion` command to generate the autocompletion script for BlobFuse2 for a specified shell.

## Syntax

`blobfuse2 completion [command] --[flag-name]=[flag-value]`

## Arguments

`[command]`

The supported subcommands for `blobfuse2 completion` are:

| Command | Description |
|--|--|
| [bash](blobfuse2-commands-completion-bash.md)               | Generate the autocompletion script for bash       |
| [fish](blobfuse2-commands-completion-fish.md)               | Generate the autocompletion script for fish       |
| [powershell](blobfuse2-commands-completion-powershell.md)   | Generate the autocompletion script for PowerShell |
| [zsh](blobfuse2-commands-completion-zsh.md)                 | Generate the autocompletion script for zsh        |

Select one of the command links in the table above to view the documentation for the individual subcommands, including how to use the generated script.

## Flags (options)

Flags that apply to `blobfuse2 completion` are inherited from the parent command, [`blobfuse2`](blobfuse2-commands.md), or apply only to the `blobfuse2 completion` subcommands.

### Flags inherited from the BlobFuse2 command

The following flags are inherited from parent command [`blobfuse2`](blobfuse2-commands.md):

| Flag | Short version | Value type | Default value | Description |
|--|--|--|--|--|
| disable-version-check |    | boolean | false | Enables or disables automatic version checking of the BlobFuse2 binaries |
| help                  | -h | n/a     |       | Help info for the blobfuse2 command and subcommands                      |

## See also

- [The Blobfuse2 completion bash command](blobfuse2-commands-completion-bash.md)
- [The Blobfuse2 completion fish command](blobfuse2-commands-completion-fish.md)
- [The Blobfuse2 completion PowerShell command](blobfuse2-commands-completion-powershell.md)
- [The Blobfuse2 completion zsh command](blobfuse2-commands-completion-zsh.md)
