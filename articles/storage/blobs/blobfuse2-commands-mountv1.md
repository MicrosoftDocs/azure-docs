---
title: How to generate a configuration file for BlobFuse2 from a BlobFuse v1 configuration file
titleSuffix: Azure Storage
description: How to generate a configuration file for BlobFuse2 from a BlobFuse v1 configuration file.
author: akashdubey-ms
ms.service: azure-blob-storage
ms.custom:
ms.topic: how-to
ms.date: 12/02/2022
ms.author: akashdubey
ms.reviewer: tamram
---

# How to use the BlobFuse2 mountv1 command

Use the `blobfuse2 mountv1` command to generate a configuration file for BlobFuse2 from a BlobFuse v1 configuration file.

## Syntax

`blobfuse2 mountv1 [path] --[flag-name]=[flag-value]`

## Arguments

`[path]`

Specify a file path to the directory where the storage container will be mounted. Example:

```bash
blobfuse2 mountv1 ./mount_path ...
```

## Flags (options)

Some flags are inherited from the parent command, [`blobfuse2`](blobfuse2-commands.md), and others only apply to the `blobfuse2 mountv1` command.

### Flags inherited from the BlobFuse2 command

The following flags are inherited from parent command [`blobfuse2`](blobfuse2-commands.md)):

| Flag | Short version | Value type | Default value | Description |
|--|--|--|--|--|
| disable-version-check |    | boolean | false | Enables or disables automatic version checking of the BlobFuse2 binaries |
| help                  | -h | n/a     | n/a   | Help info for the blobfuse2 command and subcommands                      |

### Flags that apply only to the BlobFuse2 mountv1 command

The following flags apply only to command `blobfuse2 mountv1` command:

| Flag | Short<br />version | Value<br />type | Default<br />value | Description |
|--|--|--|--|--|
| background-download           |    | boolean | false                          | File download to run in the background on open call        |
| basic-remount-check           |    | boolean | false                          | Check for an already mounted status using /etc/mtab        |
| block-size-mb                 |    | uint    |                                | Size of a block to be downloaded during streaming<br /><sub>(in MB)</sub> |
| ca-cert-file                  |    | string  |                                | Specifies the proxy pem certificate path if it's not in the default path |
| cache-on-list                 |    | boolean | true                           | Cache attributes on listing                                |
| cache-poll-timeout-msec       |    | uint    |                                | Time in milliseconds in order to poll for possible expired files awaiting cache eviction<br /><sub>(in milliseconds)</sub> |
| cache-size-mb                 |    | float   |                                | File cache size<br /><sub>(in MB)</sub>                    |
| cancel-list-on-mount-seconds  |    | uint16  |                                | A list call to the container is by default issued on mount<br /><sub>(in seconds)</sub> |
| config-file                   |    | string  | ./config.cfg                   | Input BlobFuse configuration file                          |
| container-name                |    | string  |                                | Required if no configuration file is specified             |
| convert-config-only           |    | boolean |                                | Don't mount - only convert v1 configuration to v2          |
| d                             | -d | boolean |false                           | Mount with foreground and FUSE logs on                     |
| empty-dir-check               |    | boolean |false                           | Disallows remounting using a non-empty tmp-path            |
| enable-gen1                   |    | boolean |false                           | To enable Gen1 mount                                       |
| file-cache-timeout-in-seconds |    | uint32  | 120                            | During this time, blobfuse will not check whether the file is up to date or not<br /><sub>(in seconds)</sub> |
| high-disk-threshold           |    | uint32  |                                | High disk threshold<br /><sub>(as a percentage)</sub>      |
| http-proxy                    |    | string  |                                | HTTP Proxy address                                         |
| https-proxy                   |    | string  |                                | HTTPS Proxy address                                        |
| invalidate-on-sync            |    | boolean | true                           | Invalidate file/dir on sync/fsync                          |
| log-level                     |    | LOG_OFF <br />LOG_CRIT<br />LOG_ERR<br />LOG_WARNING<br />LOG_INFO<br />LOG_DEBUG<br />LOG_WARNING | LOG_WARNING | The level of logging written to syslog. |
| low-disk-threshold            |    | uint32  |                                | Low disk threshold<br /><sub>(as a percentage)</sub>       |
| max-blocks-per-file           |    | int     |                                | Maximum number of blocks to be cached in memory for streaming |
| max-concurrency               |    | uint16  |                                | Option to override default number of concurrent storage connections |
| max-eviction                  |    | uint32  |                                | Number of files to be evicted from cache at once           |
| max-retry                     |    | int32   |                                | Maximum retry count if the failure codes are retryable     |
| max-retry-interval-in-seconds |    | int32   |                                | Maximum length of time between 2 retries<br /><sub>(in seconds)</sub> |
| no-symlinks                   |    | boolean | false                          | Whether or not symlinks should be supported                |
| o                             | -o | strings |                                | FUSE options                                               |
| output-file                   |    | string  | ./config.yaml                  | Output Blobfuse configuration file                         |
| pre-mount-validate            |    | boolean | true                           | Validate blobfuse2 is mounted                              |
| required-free-space-mb        |    | int     |                                | Required free space<br /><sub>(in MB)</sub>                |
| retry-delay-factor            |    | int32   |                                | Retry delay between two tries<br /><sub>(in seconds)</sub> |
| set-content-type              |    | boolean | false                          | Turns on automatic 'content-type' property based on the file extension |
| stream-cache-mb               |    | uint    |                                | Limit total amount of data being cached in memory to conserve memory footprint of blobfuse<br /><sub>(in MB)</sub> |
| streaming                     |    | boolean | false                          | Enable Streaming                                           |
| tmp-path                      |    | string  | n/a                            | Configures the tmp location for the cache.<br />(Configure the fastest disk (SSD or ramdisk) for best performance). |
| upload-modified-only          |    | boolean | false                          | Turn off unnecessary uploads to storage                    |
| use-adls                      |    | boolean | false                          | Enables blobfuse to access Azure DataLake storage account  |
| use-attr-cache                |    | boolean | false                          | Enable attribute cache                                     |
| use-https                     |    | boolean | false                          | Enables HTTPS communication with Blob storage              |

## Examples

1. Mount a blob container in an Azure Data Lake Storage account using a BlobFuse v1 configuration file:

    ```bash
    sudo blobfuse2 mountv1 ./mount_dir --config-file=./config.cfg --use-adls=true
    ```

1. Create a BlobFuse2 configuration file from a v1 configuration file in the same directory, but do not mount any containers:

    ```bash
    sudo blobfuse2 mountv1 --config-file=./config.cfg --output-file=./config.yaml --convert-config-only=true
    ```

## See also

- [The Blobfuse2 mount command](blobfuse2-commands-mount.md)
- [The Blobfuse2 unmount command](blobfuse2-commands-unmount.md)
- [The Blobfuse2 command set](blobfuse2-commands.md)
