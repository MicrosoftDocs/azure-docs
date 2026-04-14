---
title: Mount an Azure Blob Storage container on Linux with BlobFuse
titleSuffix: Azure Storage
description: Learn how to mount an Azure Blob Storage container on Linux with BlobFuse.
author: normesta
ms.author: normesta

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 1/29/2026
ms.custom: linux-related-content
# Customer intent: As a developer or system administrator using Linux, I want to learn how to mount Azure Blob Storage containers with BlobFuse, so that I can access and work with blob data through the familiar Linux file system interface.
---

# Mount an Azure Blob Storage container on Linux with BlobFuse

You can mount a container by using the `mount` command. You can either include your desired configuration settings as command parameters or reference a configuration file that contains your settings.

## Mount by using settings at the command line

The simplest way to mount a container is to use the `mount` command and specify Caching (File cache) mode or Streaming (Block cache) mode as a parameter. The command automatically configures other parameters, such as memory, disk limits, and parallelism, based on your system configuration.

1. Set environment variables for the account name, container name, authentication type, and authentication details. See [BlobFuse environment variables](https://github.com/Azure/azure-storage-fuse/wiki/Blobfuse2‐Environment-Variables).

1. Decide whether you want to mount the container in _caching mode_ or _streaming mode_. See [Streaming versus caching mode](blobfuse2-streaming-versus-caching.md).

1. Use the `mount` command and specify the desired data mode as a parameter.

   The following example mounts a container in caching mode:

   ```bash
   sudo blobfuse2 mount <mount-path> --tmp-path=<local-cache-path>
   ```

   The following example mounts a container in streaming mode:

   ```bash
   sudo blobfuse2 mount <mount-path> --streaming
   ```

   Replace `<mount-path>` with the path where you want to mount the container (for example: `~/mycontainer`). For caching mode, replace `<local-cache-path>` with the path for the local file cache.

For a complete list of `mount` command parameters, see [CLI Parameters](https://github.com/Azure/azure-storage-fuse/wiki/Blobfuse2-Cli-Parameters).

## Mount by using a configuration file

You can specify the necessary BlobFuse configuration and Azure Storage credentials in a YAML configuration file. The following example mounts a container by referencing a configuration file.

```bash
sudo blobfuse2 mount <mount-path> --config-file=<configuration-file>
```

Replace `<mount-path>` with the path where you want to mount the container and `<configuration-file>` with the path to your configuration file (for example: `./config.yaml`).

To learn more about how to configure BlobFuse by using a configuration file, see [Create a BlobFuse configuration file](blobfuse2-configure.md).
[Sample File Cache Config](https://github.com/Azure/azure-storage-fuse/blob/main/sampleFileCacheConfig.yaml)

[Sample Block-Cache Config](https://github.com/Azure/azure-storage-fuse/blob/main/sampleBlockCacheConfig.yaml)

[All Config options](https://github.com/Azure/azure-storage-fuse/blob/main/setup/baseConfig.yaml)
> [!NOTE]
> For a full list of mount options, see [BlobFuse mount commands](blobfuse2-commands-mount.md).

## Work with data in a mounted container

Once mounted, you can access your block blobs through the Linux file system and related APIs. To test your deployment, try creating a new directory and file:

```bash
cd ~/mycontainer
mkdir test
echo "hello world" > test/blob.txt
```

You can work with BlobFuse-mounted storage similarly to how you work with the native Linux file system. It uses a virtual directory scheme with forward slashes (`/`) as delimiters in file paths and supports basic file system operations such as `mkdir`, `opendir`, `readdir`, `rmdir`, `open`, `read`, `create`, `write`, `close`, `unlink`, `truncate`, `stat`, and `rename`.

However, some key differences exist between BlobFuse and Linux file systems. For more information, see [BlobFuse and Linux file systems compared](blobfuse2-compare-linux-file-system.md).

## Next steps

Now that you mounted your container, learn more about using BlobFuse:

- [Configure BlobFuse](blobfuse2-configure.md)
- [BlobFuse commands](blobfuse2-commands.md)

## See also

- [BlobFuse and Linux file systems compared](blobfuse2-compare-linux-file-system.md)
- [What is BlobFuse?](blobfuse2-what-is.md)