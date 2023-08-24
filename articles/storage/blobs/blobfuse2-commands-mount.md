---
title: How to use the 'blobfuse2 mount' command to mount a Blob Storage container as a file system in Linux, or to display and manage existing mount points.
titleSuffix: Azure Storage
description: Learn how to use the 'blobfuse2 mount' command to mount a Blob Storage container as a file system in Linux, or to display and manage existing mount points.
author: jimmart-dev
ms.service: storage
ms.custom: devx-track-linux
ms.topic: how-to
ms.date: 12/02/2022
ms.author: jammart
ms.reviewer: tamram
---

# How to use the BlobFuse2 mount command

Use the `blobfuse2 mount` command to mount a Blob Storage container as a file system in Linux, or to display existing mount points.

## Command Syntax

The `blobfuse2 mount` command has 2 formats:

`blobfuse2 mount [path] --[flag-name]=[flag-value]`

`blobfuse2 mount [command] --[flag-name]=[flag-value]`

## Arguments

`[path]`

Specify a file path to the directory where the storage container will be mounted. Example:

```bash
blobfuse2 mount ./mount_path ...
```

`[command]`

The supported subcommands for `blobfuse2 mount` are:

| Command | Description |
|--|--|
| [all](blobfuse2-commands-mount-all.md)   | Mounts all blob containers in a specified storage account |
| [list](blobfuse2-commands-mount-list.md) | Lists all BlobFuse2 mount points |

Select one of the command links in the table above to view the documentation for the individual subcommands, including the arguments and flags they support.

## Flags (options)

Some flags are inherited from the parent command, [`blobfuse2`](blobfuse2-commands.md), and others only apply to the `blobfuse2 mount` command.

### Flags inherited from the BlobFuse2 command

The following flags are inherited from parent command [`blobfuse2`](blobfuse2-commands.md)):

| Flag | Short version | Value type | Default value | Description |
|--|--|--|--|--|
| disable-version-check |    | boolean | false | Enables or disables automatic version checking of the BlobFuse2 binaries |
| help                  | -h | n/a     | n/a   | Help info for the blobfuse2 command and subcommands                      |

### Flags that apply only to the BlobFuse2 mount command

The following flags apply only to command `blobfuse2 mount`:

| Flag | Value type | Default value | Description |
|--|--|--|--|
| allow-other        | boolean | false                          | Allow other users to access this mount point |
| attr-cache-timeout | uint32  | 120                            | Attribute cache timeout<br /><sub>(in seconds)</sub> |
| attr-timeout       | uint32  |                                | Attribute timeout <br /><sub>(in seconds)</sub> |
| config-file        | string  | ./config.yaml                  | The path to the configuration file where the account credentials are provided. |
| container-name     | string  |                                | The name of the container to be mounted |
| entry-timeout      | uint32  |                                | Entry timeout <br /><sub>(in seconds)</sub> |
| file-cache-timeout | uint32  | 120                            | File cache timeout <br /><sub>(in seconds)</sub>|
| foreground         | boolean | false                          | Whether the file system is mounted in foreground mode |
| log-file-path      | string  | $HOME/.blobfuse2/blobfuse2.log | The path for log files|
| log-level          | LOG_OFF <br />LOG_CRIT<br />LOG_ERR<br />LOG_WARNING<br />LOG_INFO<br />LOG_DEBUG<br />LOG_WARNING | LOG_WARNING | The level of logging written to `--log-file-path`. |
| negative-timeout   | uint32  |                                | The negative entry timeout<br /><sub>(in seconds)</sub> |
| no-symlinks        | boolean | false                          | Whether or not symlinks should be supported |
| passphrase         | string  |                                | Key to decrypt config file.<br />Can also be specified by env-variable BLOBFUSE2_SECURE_CONFIG_PASSPHRASE<br />The key length shall be 16 (AES-128), 24 (AES-192), or 32 (AES-256) bytes in length. |
| read-only          | boolean | false                          | Mount the system in read only mode |
| secure-config      | boolean | false                          | Encrypt auto generated config file for each container |
| tmp-path           | string  | n/a                            | Configures the tmp location for the cache.<br />(Configure the fastest disk (SSD or ramdisk) for best performance). |

## Examples

> [!NOTE]
> The following examples assume you have already created a configuration file in the current directory.

1. Mount an individual Azure Blob Storage container to a new directory using the settings from a configuration file, and with foreground mode disabled:

    ```bash
    sudo mkdir bf2a
    sudo blobfuse2 mount ./bf2a --config-file=./config.yaml --foreground=false
    ```
    ```bash
    sudo blobfuse2 mount list
    ```
   Example output
    ```output
    1 : /home/<user>/bf2a
    ```

1. Mount all Blob Storage containers in the storage account specified in the configuration file to the path specified in the command. (Each container will be a subdirectory under the directory specified):

    ```bash
    sudo mkdir bf2all
    ```
    ```bash
    sudo blobfuse2 mount all ./bf2all --config-file=./config.yaml
    ```
    Example output
    ```output
    Mounting container : blobfuse2a to path : bf2all/blobfuse2a
    Mounting container : blobfuse2b to path : bf2all/blobfuse2b
    ```
    ```bash
    sudo blobfuse2 mount list
    ```
    Example output
    ```output
    1 : /home/<user>/bf2all/blobfuse2a
    2 : /home/<user>/bf2all/blobfuse2b
    ```

1. Mount a fast storage device, then mount a Blob Storage container specifying the path to the mounted disk as the BlobFuse2 file caching location:

    ```bash
    sudo mkdir /mnt/resource/blobfuse2tmp -p
    sudo chown <youruser> /mnt/resource/blobfuse2tmp
    sudo mkdir bf2a
    sudo blobfuse2 mount ./bf2a --config-file=./config.yaml --tmp-path=/mnt/resource/blobfuse2tmp
    ```
    ```bash
    blobfuse2 mount list
    ```
    ```output
    1 : /home/<user>/bf2a/blobfuse2a
    ```

1. Mount a Blob Storage container in read-only mode and skipping the automatic BlobFuse2 version check:

    ```bash
    sudo blobfuse2 mount ./mount_dir --config-file=./config.yaml --read-only --disable-version-check=true
    ```

1. Mount a Blob Storage container using an existing configuration file, but override the container name (mounting another container in the same storage account):

    ```bash
    sudo blobfuse2 mount ./mount_dir2 --config-file=./config.yaml --container-name=container2
    ```

## See also

- [The Blobfuse2 mount all command](blobfuse2-commands-mount-all.md)
- [The Blobfuse2 mount list command](blobfuse2-commands-mount-list.md)
- [The Blobfuse2 unmount command](blobfuse2-commands-unmount.md)
- [The Blobfuse2 mountv1 command](blobfuse2-commands-mountv1.md)
