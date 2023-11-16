---
title: How to use the 'blobfuse2 completion zsh' command to generate the autocompletion script for BlobFuse2
titleSuffix: Azure Storage
description: Learn how to use the 'blobfuse2 completion zsh' command to generate the autocompletion script for BlobFuse2.
author: akashdubey-ms
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/02/2022
ms.author: akashdubey
ms.reviewer: tamram
---

# BlobFuse2 completion zsh command

Use the `blobfuse2 completion zsh` command to generate the autocompletion script for BlobFuse2 for the zsh shell.

## Syntax

`blobfuse2 completion zsh --[flag-name]=[flag-value]`

## Flags (options)

Flags that apply to `blobfuse2 completion zsh` are inherited from the grandparent command, [`blobfuse2`](blobfuse2-commands.md), or apply only to the `blobfuse2 completion` subcommands.

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

If shell completion is not already enabled in your environment you will need
to enable it.  To do so, run the following command once:

`echo "autoload -U compinit; compinit" >> ~/.zshrc`

To load completions in your current shell session:

`source <(blobfuse2 completion zsh); compdef _blobfuse2 blobfuse2`

To load completions for every new session, execute once:

- On Linux:

    `blobfuse2 completion zsh > "${fpath[1]}/_blobfuse2"`

- On macOS:

    `blobfuse2 completion zsh > /usr/local/share/zsh/site-functions/_blobfuse2`

> [!NOTE]
> You will need to start a new shell for this setup to take effect.

## See also

- [The Blobfuse2 completion command](blobfuse2-commands-completion.md)
- [The Blobfuse2 completion bash command](blobfuse2-commands-completion-bash.md)
- [The Blobfuse2 completion fish command](blobfuse2-commands-completion-fish.md)
- [The Blobfuse2 completion PowerShell command](blobfuse2-commands-completion-powershell.md)
