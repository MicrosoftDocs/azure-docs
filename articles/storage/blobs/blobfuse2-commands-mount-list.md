---
title: How to use the 'blobfuse2 mount list' command to display all BlobFuse2 mount points
titleSuffix: Azure Storage
description: Learn how to use the 'blobfuse2 mount list' command to display all BlobFuse2 mount points.
author: jimmart-dev
ms.service: storage
ms.custom: devx-track-linux
ms.topic: how-to
ms.date: 12/02/2022
ms.author: jammart
ms.reviewer: tamram
---

# How to use the BlobFuse2 mount list command to display all BlobFuse2 mount points

Use the `blobfuse2 mount list` command to display all existing BlobFuse2 mount points.

## Syntax

`blobfuse2 mount list --[flag-name]=[flag-value]`

## Flags (options)

Flags that apply to `blobfuse2 mount all` are inherited from the parent commands, [`blobfuse2`](blobfuse2-commands.md) and [`blobfuse2 mount`](blobfuse2-commands-mount.md).

### Flags inherited from the BlobFuse2 command

The following flags are inherited from grandparent command [`blobfuse2`](blobfuse2-commands.md):

| Flag | Short version | Value type | Default value | Description |
|--|--|--|--|--|
| disable-version-check |    | boolean | false | Enables or disables automatic version checking of the BlobFuse2 binaries |
| help                  | -h | n/a     |       | Help info for the blobfuse2 command and subcommands                      |

### Flags inherited from the BlobFuse2 mount command

The following flags are inherited from parent command [`blobfuse2 mount`](blobfuse2-commands-mount.md):

| Flag | Value type | Default value | Description |
|--|--|--|--|
| allow-other        | boolean | false                          | Allow other users to access this mount point |
| attr-cache-timeout | uint32  | 120                            | Attribute cache timeout<br /><sub>(in seconds)</sub> |
| attr-timeout       | uint32  |                                | Attribute timeout <br /><sub>(in seconds)</sub> |
| config-file        | string  | ./config.yaml                  | The path for the file where the account credentials are provided Default is config.yaml in current directory. |
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

Display all current BlobFuse2 mount points:

```bash
sudo blobfuse2 mount list
```
Example output
```output
1 : /home/<user>/bf2a
2 : /home/<user>/bf2b
```

## See also

- [The `Blobfuse2 unmount` command](blobfuse2-commands-unmount.md)
- [The `Blobfuse2 mount` command](blobfuse2-commands-mount.md)
- [The `Blobfuse2 mount all` command](blobfuse2-commands-mount-all.md)
