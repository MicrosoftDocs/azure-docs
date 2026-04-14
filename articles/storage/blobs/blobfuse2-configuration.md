---
title: How to configure settings for BlobFuse
titleSuffix: Azure Storage
description: Learn how to configure settings for BlobFuse.
author: akashdubey-ms
ms.author: akashdubey
ms.reviewer: normesta

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 01/29/2026
# Customer intent: "As a cloud administrator, I want to configure settings for BlobFuse, so that I can effectively manage access, logging, caching, and permissions in my deployment."
---

# How to configure settings for BlobFuse

You can configure BlobFuse by using various settings. Some of the typical settings include:

- Logging location and options
- Temporary file path for caching
- Information about the Azure storage account and blob container to be mounted

The settings can be configured in a YAML configuration file, using environment variables, or as parameters passed to the BlobFuse commands. The preferred method is to use the configuration file.

For details about each of the configuration parameters for BlobFuse and how to specify them, see these articles:

## Configuration file

Creating a configuration file is the preferred method to establish settings for BlobFuse. When you've specified the settings you want in the configuration file, reference the configuration file when you use `blobfuse2 mount` or other commands.

Here's an example:

````bash
blobfuse2 mount ./mount --config-file=./config.yaml
````

To learn more about how to create a configuration file, see [Create a BlobFuse configuration file](blobfuse2-configure.md).

The [BlobFuse base configuration file](https://github.com/Azure/azure-storage-fuse/blob/main/setup/baseConfig.yaml) contains a list of all settings and a brief explanation of each setting.

Use the [sample file cache configuration file](https://github.com/Azure/azure-storage-fuse/blob/main/sampleFileCacheConfig.yaml) to get started quickly by using some basic settings for each of those scenarios.

## Environment variables

Setting environment variables is another way to configure some BlobFuse settings. The supported environment variables are useful for specifying the Azure Blob Storage container to access and the authorization method to use.

For more information about using environment variables and a list of all variables you can use, see the [BlobFuse README](https://github.com/Azure/azure-storage-fuse/tree/main#environment-variables).

## CLI parameters

You also can set configuration settings when you pass them as parameters of the BlobFuse command set, such as by using the `blobfuse2 mount` command. The mount command typically references a configuration file that contains all the settings. But you can use CLI parameters to override individual settings in the configuration file. In this example, the *config.yaml* configuration file is referenced, but the container to be mounted and the logging options are overridden:

```bash
blobfuse2 mount ./mount_dir --config-file=./config.yaml --container-name=blobfuse2b --log-level=log_debug --log-file-path=./bobfuse2b.log
```

For more information about the entire BlobFuse command set, including the `blobfuse2 mount` command, see [BlobFuse commands](blobfuse2-commands.md) and [BlobFuse2 mount commands](blobfuse2-commands-mount.md).

## Next steps

- [Mount an Azure Blob Storage container on Linux by using BlobFuse](blobfuse2-mount-container.md)

## See also

- [What is BlobFuse?](blobfuse2-what-is.md)
- [BlobFuse2 commands](blobfuse2-commands.md)
