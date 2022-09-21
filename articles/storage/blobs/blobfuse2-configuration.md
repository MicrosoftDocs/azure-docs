---
title: How to configure Blobfuse2 (preview) | Microsoft Docs
titleSuffix: Azure Blob Storage
description: How to configure Blobfuse2 (preview).
author: jimmart-dev
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.date: 08/02/2022
ms.author: jammart
ms.reviewer: tamram
---

# How to configure Blobfuse2 (preview)

> [!IMPORTANT]
> BlobFuse2 is the next generation of BlobFuse and is currently in preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> If you need to use BlobFuse in a production environment, BlobFuse v1 is generally available (GA). For information about the GA version, see:
>
> - [The BlobFuse v1 setup documentation](storage-how-to-mount-container-linux.md)
> - [The BlobFuse v1 project on GitHub](https://github.com/Azure/azure-storage-fuse/tree/master)

BlobFuse2 uses a variety of configuration settings to control its behaviors, including:

- Access to a storage blob
- Logging
- Pipeline engagement
- Caching behavior
- Permissions

For a complete list of settings and their descriptions, see [the base configuration file on GitHub](https://github.com/Azure/azure-storage-fuse/blob/main/setup/baseConfig.yaml).

There are 3 ways of managing configuration settings for BlobFuse2 (in order of precedence):

1. [CLI parameters](#cli-parameters)
1. [Environment variables](#environment-variables)
1. [A configuration file](#configuration-file)

Using a configuration file is the preferred method, but the other methods can be useful in some circumstances.

## Configuration file

Creating a configuration file is the preferred method of establishing settings for BlobFuse2. Once you have provided the desired settings in the file, reference the configuration file when using the `blobfuse2 mount` or other commands. Example:

````bash
blobfuse2 mount ./mount --config-file=./config.yaml
````

The [Base BlobFuse2 configuration file](https://github.com/Azure/azure-storage-fuse/blob/main/setup/baseConfig.yaml) contains a complete list of all settings and a brief explanation of each.

Use the [Sample file cache configuration file](https://github.com/Azure/azure-storage-fuse/blob/main/sampleFileCacheConfig.yaml) or [the sample streaming configuration file](https://github.com/Azure/azure-storage-fuse/blob/main/sampleStreamingConfig.yaml) to get started quickly using some basic settings for each of those scenarios.

## Environment variables

Setting environment variables is another way to configure some BlobFuse2 settings. The supported environment variables are useful for specifying the blob storage container to be accessed and the authorization method.

For more details on using environment variables, see [The environment variables documentation](https://github.com/Azure/azure-storage-fuse/tree/main#environment-variables)

See [the BlobFuse2 README](https://github.com/Azure/azure-storage-fuse/tree/main#environment-variables) for a complete list of variables that can be used.

## CLI Parameters

Configuration settings can be set when passed as parameters of the BlobFuse2 command set, such as the `blobfuse2 mount` command. The mount command typically references a configuration file that contains all of the settings, but individual settings in the configuration file can be overridden by CLI parameters. In this example, the config.yaml configuration file is referenced, but the container to be mounted and the logging options are overridden:

```bash
blobfuse2 mount ./mount_dir --config-file=./config.yaml --container-name=blobfuse2b --log-level=log_debug --log-file-path=./bobfuse2b.log
```

For more information about the complete BlobFuse2 command set, including the `blobfuse2 mount` command, see [The BlobFuse2 command set reference (preview)](blobfuse2-commands.md) and [The BlobFuse2 mount command reference (preview)](blobfuse2-commands-mount.md).

## See also

- [What is BlobFuse2? (preview)](blobfuse2-what-is.md)
- [How to mount an Azure blob storage container on Linux with BlobFuse2 (preview)](blobfuse2-how-to-deploy.md)
