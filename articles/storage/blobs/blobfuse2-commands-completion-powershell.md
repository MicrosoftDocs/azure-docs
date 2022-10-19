---
title: How to use the "completion powershell" command to generate the autocompletion script for BlobFuse2 (preview) | Microsoft Docs
titleSuffix: Azure Blob Storage
description: Learn how to use the "completion powershell" command to generate the autocompletion script for BlobFuse2 (preview).
author: jimmart-dev
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.date: 08/02/2022
ms.author: jammart
ms.reviewer: tamram
---

# BlobFuse2 completion powershell command (preview)

Use the `blobfuse2 completion powershell` command to generate the autocompletion script for BlobFuse2 for PowerShell.

> [!IMPORTANT]
> BlobFuse2 is the next generation of BlobFuse and is currently in preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> BlobFuse v1 is generally available (GA). For information about the GA version, see:
>
> - [The BlobFuse v1 project on GitHub](https://github.com/Azure/azure-storage-fuse/tree/master)
> - [The BlobFuse v1 setup documentation](storage-how-to-mount-container-linux.md)

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
