---
title: How to use the 'blobfuse2 completion powershell' command to generate the autocompletion script for BlobFuse2 (preview) | Microsoft Docs
titleSuffix: Azure Blob Storage
description: Learn how to use the 'blobfuse2 completion powershell' command to generate the autocompletion script for BlobFuse2 (preview).
author: jimmart-dev
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.date: 10/17/2022
ms.author: jammart
ms.reviewer: tamram
---

# blobfuse2 completion powershell (preview)

Use the `blobfuse2 completion powershell` command to generate the autocompletion script for BlobFuse2 for PowerShell.

[!INCLUDE [storage-blobfuse2-preview](../../../includes/storage-blobfuse2-preview.md)]

## Syntax

`blobfuse2 completion powershell --[flag-name]=[flag-value]`

## Flags (options)

Flags that apply to `blobfuse2 completion powershell` are inherited from the grandparent command, [`blobfuse2`](blobfuse2-commands.md), or apply only to the `blobfuse2 completion` subcommands.

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

To load completions in your current PowerShell session:

```powershell
blobfuse2 completion powershell | Out-String | Invoke-Expression
```

To load completions for every new session, add the output of the above command
to your PowerShell profile.

> [!NOTE]
> You will need to start a new shell for this setup to take effect.

## See also

- [The Blobfuse2 completion command (preview)](blobfuse2-commands-completion.md)
- [The Blobfuse2 completion bash command (preview)](blobfuse2-commands-completion-bash.md)
- [The Blobfuse2 completion fish command (preview)](blobfuse2-commands-completion-fish.md)
- [The Blobfuse2 completion zsh command (preview)](blobfuse2-commands-completion-zsh.md)
