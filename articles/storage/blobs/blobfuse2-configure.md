---
title: Create a BlobFuse configuration file
titleSuffix: Azure Storage
description: Learn how to create a configuration file for BlobFuse. 
author: normesta
ms.author: normesta

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 1/29/2026

ms.custom: linux-related-content

# Customer intent: "As a developer or system administrator using BlobFuse, I want to learn how to create and customize configuration files, so that I can optimize BlobFuse settings for my specific storage requirements and performance needs."
---

# Create a BlobFuse configuration file

Use a configuration file to define how BlobFuse connects to Azure Blob Storage and manages its behavior when mounting a container as a file system on Linux.

This article shows you how to generate and customize a configuration file. After you create the file, reference it as a parameter in the `mount` command.  

## How to create a configuration file

1. Decide whether you want to mount the container in _caching mode_ or _streaming mode_. See [Streaming versus caching mode](blobfuse2-streaming-versus-caching.md).

1. Generate a configuration file by using the `gen-config` command.

   The following example generates a configuration file for mounting a container in caching mode.

   ```bash
   blobfuse2 gen-config --tmp-path=<local-cache-path> --o <path-to-save-generated-config>
   ```

   The following example generates a configuration file for mounting a container in streaming mode.

   ```bash
   blobfuse2 gen-config --block-cache --o <path-to-save-generated-config>
   ```

   This generates a configuration file that contains default settings. If path is not provided, the config will be generated at the current path.

1. Open the configuration file in an editor to review and modify settings.

1. Configure caching or streaming mode.

   If you choose to mount a container in caching mode, modify the `file_cache` block of settings. The following snippet shows an example configuration.

   ```yaml
   file_cache:
   path: /tmp/blobfusecache
   timeout-sec: 120 
   ```

   For complete example, see [Sample file cache configuration](https://github.com/Azure/azure-storage-fuse/blob/main/sampleFileCacheConfig.yaml).

   For comprehensive guidance on configuring and optimizing transfers for caching mode, see [Configure BlobFuse for caching](blobfuse2-configure-caching.md).

   If you choose to mount a container in streaming mode, modify the `block_cache` block of settings. The following snippet shows an example configuration.

   ```yaml
   block_cache:
   block-size-mb: 16
   mem-size-mb: 80
   disk-timeout-sec: 120
   ```

    For complete example, see [Sample block cache configuration](https://github.com/Azure/azure-storage-fuse/blob/main/sampleBlockCacheConfig.yaml).

    For comprehensive guidance on configuring and optimizing transfers for streaming mode, see [Configure BlobFuse for streaming mode](blobfuse2-configure-streaming.md).

1. To configure Azure Storage and Azure Blob Storage container details, modify the `azstorage` block of settings. Provide the account type, storage account name, container name, storage account endpoint, and authentication mode (such as `key`, `msi`, or `spn`). The following snippet shows an example configuration:

   ```yaml
   azstorage:
   type: block
   account-name: myaccount
   container: mycontainer
   endpoint: blob.core.windows.net
   mode: msi
   appid: myappid
   ```

In addition, there are other optional configuration settings that you can use to fine-tune the mount. For details about the configuration options, see the [base sample configuration](https://github.com/Azure/azure-storage-fuse/blob/main/setup/baseConfig.yaml).

You can override settings that you define in the configuration file by using environment variables or by passing parameters as part of the command. For more information about using environment variables and a list of all variables you can use, see the [BlobFuse Environment Variables](https://github.com/Azure/azure-storage-fuse/wiki/Blobfuse2-Environment-Variables).

## Configuration file best practices

- If you **don't provide** `type` in the `azstorage` section of the configuration file, BlobFuse autodetects the account type and sets the respective endpoint. Therefore, if you use private endpoints, you must expose the Data Lake Storage endpoint; otherwise, the mount fails.

- If you **provide** `type` in the `azstorage` section of the configuration file, don't mount a hierarchical namespace enabled account with `type: block` in the `azstorage` section. Otherwise, some directory operations fail. Don't mount a flat namespace account with `type: adls` in the `azstorage` section. Otherwise, you receive mount failures.

- To disable all forms of caching at the kernel and at the BlobFuse level, set the `-o direct_io` CLI parameter or `direct-io: true' in libfuse section of configuration file. This option forces every operation to call the storage service directly, ensuring you always have the most up-to-date data.
  
  > [!WARNING]
  > This configuration leads to increased storage costs, as it generates more transactions.

- To disable only kernel cache but keep BlobFuse cache (data and metadata), set `disable-kernel-cache: true` in common configurations.

  - Don't use both `direct-io: true` and `disable-kernel-cache: true` together.
  
  - To control metadata caching at the BlobFuse level, set `attr-cache-timeout`.
  
  - To control data caching at the BlobFuse level, set `file-cache-timeout`.
  
  - For example, if your workflow requires file contents to be refreshed within 3 seconds of an update, set both timeouts to 3.
  
  - Setting them to 0 gives you instant refresh of contents but at the cost of higher REST calls to storage.

For details about the correct format, see this [configuration file](https://github.com/Azure/azure-storage-fuse/blob/ba815585e3ce3b2d08f0009de26c212e655af50c/setup/advancedConfig.yaml#L37).

## Next steps

- [All configuration options](https://github.com/Azure/azure-storage-fuse/blob/main/setup/baseConfig.yaml)
- [Mount an Azure Blob Storage container](blobfuse2-mount-container.md)

## See also

- [What is BlobFuse?](blobfuse2-what-is.md)
