---
title: How to use the BlobFuse2 health-monitor command to gain insights into BlobFuse2 mount activities and resource usage (preview). | Microsoft Docs
titleSuffix: Azure Blob Storage
description: Learn how to use the BlobFuse2 health-monitor command to gain insights into BlobFuse2 mount activities and resource usage (preview).
author: jimmart-dev
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.date: 09/26/2022
ms.author: jammart
ms.reviewer: tamram
---

# How to use the BlobFuse2 health-monitor command (preview)

Use the `blobfuse2 health-monitor` command to gain insights into BlobFuse2 mount activities and resource usage, including:

- Statistics about internal activities related to BlobFuse2 mounts
- CPU and memory usage by BlobFuse2 mount processes
- File cache usage and events

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

The `blobfuse2 health-monitor` command format is:

`blobfuse2 health-monitor --[flag-name]=[flag-value]`

## Flags (options)

Some flags are inherited from the parent command, [`blobfuse2`](blobfuse2-commands.md), and others only apply to the `blobfuse2 health-monitor` command.

### Flags inherited from the BlobFuse2 command

The following flags are inherited from parent command [`blobfuse2`](blobfuse2-commands.md)):

| Flag                  | Short version | Value type | Default value | Description |
|-----------------------|---------------|------------|---------------|-------------|
| disable-version-check |               | boolean    | false         | Enables or disables automatic version checking of the BlobFuse2 binaries |
| help                  | -h            | n/a        | n/a           | Help info for the BlobFuse2 command and subcommands                      |

### Flags that apply only to the BlobFuse2 health-monitor command

The following flags apply only to command `blobfuse2 health-monitor`:

| Flag        | Value type | Default value | Description                                                                   |
|-------------|------------|---------------|-------------------------------------------------------------------------------|
| config-file | string     | ./config.yaml | The path to the configuration file where the account credentials are provided |
| pid         | string     | n/a           | Process ID (PID) of the BlobFuse2 process to monitor                          |

## Examples

> [!NOTE]
> The following example assumes you have already created a configuration file in the current directory.

   Get the PID of all processes invoked by the `blobfuse2` command:

    ```bash
    ps -C blobfuse2 -f
    ```

    ```output
    UID          PID    PPID  C STIME TTY          TIME CMD
    user1       5505       1  9 11:54 ?        00:07:41 blobfuse2 mount ./mount1 --config-file=./config.yaml
    ```

    Start the BlobFuse2 Health Monitor for the desired process:

    ```bash
    blobfuse2 health-monitor --pid 5505 --config-file ./config.yaml
    ```

The results will be sent to a file named `monitor_<pid>.json` in the directory specified by the `output-path` parameter in the configuration file. For example:

```Health Monitor configuration settings in ./config/yaml
# Health Monitor configuration
health_monitor:
  enable-monitoring: true
  output-path: /home/user1/blobfuse2/HMresults/
```

## See also

- [Use Health Monitor to gain insights into BlobFuse2 mount activities and resource usage (preview)](blobfuse2-health-monitor.md)
- [The BlobFuse2 command set (preview)](blobfuse2-commands.md)
- What is BlobFuse2? (preview)](blobfuse2-what-is.md)
