---
title: Configure BlobFuse for caching mode
titleSuffix: Azure Storage
description: Learn how to configure caching mode for BlobFuse mounts and optimize workloads for use with caching mode.
author: normesta
ms.author: normesta

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 1/29/2026

ms.custom: linux-related-content

# Customer intent: "As a developer using BlobFuse, I want to configure caching mode for my Azure Blob Storage mount, so that I can optimize performance for workloads that require repeated access to files and benefit from local caching."
---

# Configure BlobFuse for caching mode

This article helps you configure BlobFuse to mount a container in _caching mode_. In _caching mode_, BlobFuse downloads the entire file from Azure Blob Storage into a local cache directory before making it available to the application.

> [!TIP]
> You can mount a container in either _streaming mode_ or _caching mode_. To learn more about each mode, see [Streaming versus caching mode](blobfuse2-streaming-versus-caching.md).

## Configuration parameters

Specify the path of the local cache and an optional timeout in seconds.

The local cache (or _temporary path_) is where BlobFuse stores all open file contents. The timeout is the maximum time in seconds before data is refreshed after an update. For example, if your workflow requires file contents to be refreshed within three seconds of an update, set this timeout to `3`. If your workflow requires an instant refresh, then set the timeout to `0`. Setting the timeout to `0` gives you instant refresh of contents but at the cost of higher REST calls to storage.

The following example sets these values as parameters to the `mount` command.

```bash
blobfuse2 mount ~/mycontainer --tmp-path=/tmp/blobfusecache --file-cache-timeout=120
```

The following example shows how these settings appear in the BlobFuse configuration file.

```yaml
file_cache:
path: /tmp/blobfusecache
timeout-sec: 120 
```

For complete example, see [Sample file cache configuration](https://github.com/Azure/azure-storage-fuse/blob/main/sampleFileCacheConfig.yaml).

> [!NOTE]
> BlobFuse stores all open file contents in the temporary path. Make sure you have enough space to contain all open files.

## Configuring a temporary path

You can configure a temporary path on a local high performing disk, a RAM disk, or a solid state drive (SSD).

If you use an existing local disk for caching, choose a disk that provides the best performance possible, such as a solid-state disk (SSD).

In Azure, you can use the SSD ephemeral disks that are available on your virtual machines (VMs) to provide a low-latency buffer for BlobFuse. Depending on the provisioning agent you use, mount the ephemeral disk on `/mnt` for cloud-init or `/mnt/resource` for Microsoft Azure Linux Agent (waagent) VMs.

Make sure that your user has access to the temporary path.

```bash
sudo mkdir /mnt/resource/blobfuse2tmp -p
sudo chown <youruser> /mnt/resource/blobfuse2tmp
```

If you use a RAM disk, choose a size that meets your requirements. The following example creates a RAM disk of 16 GB and a directory for BlobFuse. BlobFuse uses the RAM disk to open files that are up to 16 GB in size.

```bash
sudo mkdir /mnt/ramdisk
sudo mount -t tmpfs -o size=16g tmpfs /mnt/ramdisk
sudo mkdir /mnt/ramdisk/blobfuse2tmp
sudo chown <youruser> /mnt/ramdisk/blobfuse2tmp
```

## Optimize performance by preloading data

In caching mode, BlobFuse waits for an open file system call. Upon receiving the open call, BlobFuse downloads the entire file to a local cache before using it. This behavior can make the initial load slower, especially for AI and machine learning tasks where the application is processing many files.

The preload feature helps by downloading entire containers or subdirectories to the local cache when you mount them. Preload enhances data availability, boosting efficiency and reducing wait times. This improvement is vital for AI training with large datasets as it prepares all necessary files in advance, saving GPU time and reducing costs. By combining preload with the [Blob Filter](https://github.com/Azure/azure-storage-fuse/wiki/Blobfuse-Blob-Filter) feature, you can access specific files in a container or subdirectory, offering extensive flexibility and optimizing GPU cycles.

To enable preload with file-cache mode, use the `--preload` parameter. The following command shows an example:

```bash
blobfuse2 mount --preload /mnt/blobfuse_mnt --tmp-path=/home/temp_path 
```

> [!NOTE]
> Preloading blob data makes the mount read-only and prevents file eviction. To access updated files, unmount and remount the volume. Newly added files can still be accessed by reading them. If a blob filter is used with preload, only the filtered files are preloaded and accessible via the BlobFuse mount.

### Considerations when using the preload feature

- Enabling preload makes the BlobFuse mount read-only.

- All file-caching options in CLI and config file are ignored except for the temporary path setting.

- Ensure sufficient disk space for all or filtered contents in the container. Insufficient space might cause partial loading and block new file access until you manually delete files from the local cache.

- Accessing a file immediately after mounting prioritizes it for download while preloading continues in the background.

- BlobFuse logs show preload status and disk warnings.

- The BlobFuse mount refreshes preloaded or opened files only if you manually delete them from the local cache and reopen them.

- BlobFuse doesn't automatically download blobs added to the storage container after preload but can access them by reading.

## Next steps

- [Configure BlobFuse for streaming mode](blobfuse2-configure-streaming.md)
- [Streaming versus caching mode](blobfuse2-streaming-versus-caching.md)
