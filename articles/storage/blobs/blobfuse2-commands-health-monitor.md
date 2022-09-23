---
title: How to use the BlobFuse2 health-monitor command to gain insights into BlobFuse2 mount point activities and resource usage (preview). | Microsoft Docs
titleSuffix: Azure Blob Storage
description: Learn how to use the BlobFuse2 health-monitor command to gain insights into BlobFuse2 mount point activities and resource usage (preview).
author: jimmart-dev
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.date: 09/23/2022
ms.author: jammart
ms.reviewer: tamram
---

# How to use the BlobFuse2 health-monitor command (preview)

Use the `blobfuse2 health-monitor` command to gain insights into BlobFuse2 mount point activities and resource usage.

> [!IMPORTANT]
> BlobFuse2 is the next generation of BlobFuse and is currently in preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> If you need to use BlobFuse in a production environment, BlobFuse v1 is generally available (GA). For information about the GA version, see:
>
> - [The BlobFuse v1 setup documentation](storage-how-to-mount-container-linux.md)
> - [The BlobFuse v1 project on GitHub](https://github.com/Azure/azure-storage-fuse/tree/master)

## Command Syntax

The `blobfuse2 health-monitor` command has x formats:

`blobfuse2 health-monitor [???] --[flag-name]=[flag-value]`

`blobfuse2 health-monitor [???] --[flag-name]=[flag-value]`

## Arguments

`[???]`

Specify...

```bash
blobfuse2 health-monitor  ...
```

`[???]`

The supported subcommands for `blobfuse2 health-monitor` are:

| Command | Description |
|--|--|
| [???](blobfuse2-commands-health-monitor-???.md)   | ??? |
| [???](blobfuse2-commands-health-monitor-???.md)   | ??? |

Select one of the command links in the table above to view the documentation for the individual subcommands, including the arguments and flags they support.

## Flags (options)

Some flags are inherited from the parent command, [`blobfuse2`](blobfuse2-commands.md), and others only apply to the `blobfuse2 health-monitor` command.

### Flags inherited from the BlobFuse2 command

The following flags are inherited from parent command [`blobfuse2`](blobfuse2-commands.md)):

| Flag | Short version | Value type | Default value | Description |
|--|--|--|--|--|
| disable-version-check |    | boolean | false | Enables or disables automatic version checking of the BlobFuse2 binaries |
| help                  | -h | n/a     | n/a   | Help info for the blobfuse2 command and subcommands                      |

### Flags that apply only to the BlobFuse2 health-monitor command

The following flags apply only to command `blobfuse2 health-monitor`:

| Flag | Value type | Default value | Description |
|--|--|--|--|
| ???        | ??? | ???                          | ??? |

## Examples

> [!NOTE]
> The following examples assume you have already created a configuration file in the current directory.

1. Example 1:

    ```bash
    ~$ blobfuse2 health-monitor ...
    ```

1. Example 1:

    ```bash
    ~$ blobfuse2 health-monitor ...
    ```

## See also

- [How to use Blobfuse2 health monitor (preview)](blobfuse2-health-monitor.md)
- What is BlobFuse2? (preview)](blobfuse2-what-is.md)
- [The Blobfuse2 command set (preview)](blobfuse2-commands.md)
