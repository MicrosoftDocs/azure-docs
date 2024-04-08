---
title: How to configure settings for BlobFuse2
titleSuffix: Azure Storage
description: Learn how to configure settings for BlobFuse2.
author: akashdubey-ms
ms.author: akashdubey
ms.reviewer: tamram
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/02/2022
---

# How to configure settings for BlobFuse2

You can use configuration settings to manage BlobFuse2 in your deployment. Through configuration settings, you can set these aspects of how BlobFuse2 works in your environment:

- Access to a storage blob
- Logging
- Pipeline engagement
- Caching behavior
- Permissions

For a list of all BlobFuse2 settings and their descriptions, see the [base configuration file on GitHub](https://github.com/Azure/azure-storage-fuse/blob/main/setup/baseConfig.yaml).

To manage configuration settings for BlobFuse2, you have three options (in order of precedence):

- [Configuration file](#configuration-file)
- [Environment variables](#environment-variables)
- [CLI parameters](#cli-parameters)

Using a configuration file is the preferred method, but the other methods might be useful in some circumstances.

## Configuration file

Creating a configuration file is the preferred method to establish settings for BlobFuse2. When you've specified the settings you want in the configuration file, reference the configuration file when you use `blobfuse2 mount` or other commands. 

Here's an example:

````bash
blobfuse2 mount ./mount --config-file=./config.yaml
````

The [BlobFuse2 base configuration file](https://github.com/Azure/azure-storage-fuse/blob/main/setup/baseConfig.yaml) contains a list of all settings and a brief explanation of each setting.

Use the [sample file cache configuration file](https://github.com/Azure/azure-storage-fuse/blob/main/sampleFileCacheConfig.yaml) or the [sample streaming configuration file](https://github.com/Azure/azure-storage-fuse/blob/main/sampleStreamingConfig.yaml) to get started quickly by using some basic settings for each of those scenarios.

## Environment variables

Setting environment variables is another way to configure some BlobFuse2 settings. The supported environment variables are useful for specifying the Azure Blob Storage container to access and the authorization method to use.

For more information about using environment variables and a list of all variables you can use, see the [BlobFuse2 README](https://github.com/Azure/azure-storage-fuse/tree/main#environment-variables).

## CLI parameters

You also can set configuration settings when you pass them as parameters of the BlobFuse2 command set, such as by using the `blobfuse2 mount` command. The mount command typically references a configuration file that contains all the settings. But you can use CLI parameters to override individual settings in the configuration file. In this example, the *config.yaml* configuration file is referenced, but the container to be mounted and the logging options are overridden:

```bash
blobfuse2 mount ./mount_dir --config-file=./config.yaml --container-name=blobfuse2b --log-level=log_debug --log-file-path=./bobfuse2b.log
```

For more information about the entire BlobFuse2 command set, including the `blobfuse2 mount` command, see [BlobFuse2 commands](blobfuse2-commands.md) and [BlobFuse2 mount commands](blobfuse2-commands-mount.md).

## See also

- [Migrate to BlobFuse2 from BlobFuse v1](https://github.com/Azure/azure-storage-fuse/blob/main/MIGRATION.md)
- [BlobFuse2 commands](blobfuse2-commands.md)
- [Troubleshoot BlobFuse2 issues](blobfuse2-troubleshooting.md)

## Next steps

- [Mount an Azure Blob Storage container on Linux by using BlobFuse2](blobfuse2-how-to-deploy.md)
- [Use Health Monitor to gain insights into BlobFuse2 mount activities and resource usage](blobfuse2-health-monitor.md)
