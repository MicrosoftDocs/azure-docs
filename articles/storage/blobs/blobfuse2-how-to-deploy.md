---
title: How to mount an Azure Blob Storage container on Linux with BlobFuse2
titleSuffix: Azure Storage
description: Learn how to mount an Azure Blob Storage container on Linux with BlobFuse2.
author: akashdubey-ms
ms.author: akashdubey
ms.reviewer: tamram
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 01/26/2023
ms.custom: engagement-fy23, linux-related-content
---

# How to mount an Azure Blob Storage container on Linux with BlobFuse2

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This article shows you how to install and configure BlobFuse2, mount an Azure blob container, and access data in the container. The basic steps are:

> [Install BlobFuse2](#how-to-install-blobfuse2)
>
> [Configure BlobFuse2](#how-to-configure-blobfuse2)
>
> [Mount a blob container](#how-to-mount-a-blob-container)
>
> [Access data](#how-to-access-data)

## How to install BlobFuse2

You have two options for installing BlobFuse2:

- [**Install BlobFuse2 from the Microsoft software repositories for Linux**](#option-1-install-blobfuse2-from-the-microsoft-software-repositories-for-linux) - This is the preferred method of installation. BlobFuse2 is available in the repositories for several common Linux distributions.
- [**Build the BlobFuse2 binaries from source code**](#option-2-build-the-binaries-from-source-code) - You can build the BlobFuse2 binaries from source code if it is not available in the repositories for your distribution.

### Option 1: Install BlobFuse2 from the Microsoft software repositories for Linux

To see supported distributions, see [BlobFuse2 releases](https://github.com/Azure/azure-storage-fuse/releases).

For information about libfuse support, see the [BlobFuse2 README](https://github.com/Azure/azure-storage-fuse/blob/main/README.md#distinctive-features-compared-to-blobfuse-v1x).

To check your version of Linux, run the following command:

```bash
cat /etc/*-release
```

If no binaries are available for your distribution, you can [Option 2: Build the binaries from source code](#option-2-build-the-binaries-from-source-code).

To install BlobFuse2 from the repositories:

> [Configure the Microsoft package repository](#configure-the-microsoft-package-repository)
>
> [Install BlobFuse2](#install-blobfuse2)

#### Configure the Microsoft package repository

Configure the [Linux Package Repository for Microsoft Products](/windows-server/administration/Linux-Package-Repository-for-Microsoft-Software).

# [RHEL](#tab/RHEL)

As an example, on a Redhat Enterprise Linux 8 distribution:

```bash
sudo rpm -Uvh https://packages.microsoft.com/config/rhel/8/packages-microsoft-prod.rpm
```

Similarly, change the URL to `.../rhel/7/...` to point to a Redhat Enterprise Linux 7 distribution.

# [CentOS](#tab/CentOS)

As an example, on a CentOS 8 distribution:

```bash
sudo rpm -Uvh https://packages.microsoft.com/config/centos/8/packages-microsoft-prod.rpm
```

Similarly, change the URL to `.../centos/7/...` to point to a CentOS 7 distribution.

# [Ubuntu](#tab/Ubuntu)

Another example on an Ubuntu 20.04 distribution:

```bash
sudo wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update
sudo apt-get install libfuse3-dev fuse3
```

Similarly, change the URL to `.../ubuntu/16.04/...` or `.../ubuntu/18.04/...` to reference another Ubuntu version.

# [SLES](#tab/SLES)

```bash
sudo rpm -Uvh https://packages.microsoft.com/config/sles/15/packages-microsoft-prod.rpm
```

---

#### Install BlobFuse2

# [RHEL](#tab/RHEL)

```bash
sudo yum install blobfuse2
```
# [CentOS](#tab/CentOS)

```bash
sudo yum install blobfuse2
```

# [Ubuntu](#tab/Ubuntu)

```bash
sudo apt-get install blobfuse2
```
# [SLES](#tab/SLES)

```bash
sudo zypper install blobfuse2
```
---

### Option 2: Build the binaries from source code

To build the BlobFuse2 binaries from source code:

1. Install the dependencies:

    1. Install Git:

       ```bash
       sudo apt-get install git
       ```

    1. Install BlobFuse2 dependencies.

       On Ubuntu:

       ```bash
       sudo apt-get install libfuse3-dev fuse3 -y
       ```

1. Clone the repository:

   ```Git
   sudo git clone https://github.com/Azure/azure-storage-fuse/
   sudo cd ./azure-storage-fuse
   sudo git checkout main
   ```

1. Build BlobFuse2:

    ```Git
    go get
    go build -tags=fuse3
    ```

> [!TIP]
> If you need to install Go, see [Download and install Go](https://go.dev/doc/install).

## How to configure BlobFuse2

You can configure BlobFuse2 by using various settings. Some of the typical settings include:

- Logging location and options
- Temporary file path for caching
- Information about the Azure storage account and blob container to be mounted

The settings can be configured in a YAML configuration file, using environment variables, or as parameters passed to the BlobFuse2 commands. The preferred method is to use the configuration file.

For details about each of the configuration parameters for BlobFuse2 and how to specify them, see these articles:

- [Configure settings for BlobFuse2](blobfuse2-configuration.md)
- [BlobFuse2 configuration file](blobfuse2-configuration.md#configuration-file)
- [BlobFuse2 environment variables](blobfuse2-configuration.md#environment-variables)
- [BlobFuse2 mount commands](blobfuse2-commands-mount.md)

To configure BlobFuse2 for mounting:

1. [Configure caching](#configure-caching).
1. [Create an empty directory to mount the blob container](#create-an-empty-directory-to-mount-the-blob-container).
1. [Authorize access to your storage account](#authorize-access-to-your-storage-account).

### Configure caching

BlobFuse2 provides native-like performance by using local file-caching techniques. The caching configuration and behavior varies, depending on whether you're streaming large files or accessing smaller files.

#### Configure caching for streaming large files

BlobFuse2 supports streaming for read and write operations as an alternative to disk caching for files. In streaming mode, BlobFuse2 caches blocks of large files in memory both for reading and writing. The configuration settings related to caching for streaming are under the `stream:` settings in your configuration file:

```yml
stream:
    block-size-mb:
        For read only mode, the size of each block to be cached in memory while streaming (in MB)
        For read/write mode, the size of newly created blocks
    max-buffers: The total number of buffers to store blocks in
    buffer-size-mb: The size for each buffer
```

To get started quickly with some settings for a basic streaming scenario, see the [sample streaming configuration file](https://github.com/Azure/azure-storage-fuse/blob/main/sampleStreamingConfig.yaml).

#### Configure caching for smaller files

Smaller files are cached to a temporary path that's specified under `file_cache:` in the configuration file:

```yml
file_cache:
    path: <path to local disk cache>
```

> [!NOTE]
> BlobFuse2 stores all open file contents in the temporary path. Make sure you have enough space to contain all open files.
>

You have three common options to configure the temporary path for file caching:

- [Use a local high-performing disk](#use-a-local-high-performing-disk)
- [Use a RAM disk](#use-a-ram-disk)
- [Use an SSD](#use-an-ssd)

##### Use a local high-performing disk

If you use an existing local disk for file caching, choose a disk that provides the best performance possible, such as a solid-state disk (SSD).

##### Use a RAM disk

The following example creates a RAM disk of 16 GB and a directory for BlobFuse2. Choose a size that meets your requirements. BlobFuse2 uses the RAM disk to open files that are up to 16 GB in size.

```bash
sudo mkdir /mnt/ramdisk
sudo mount -t tmpfs -o size=16g tmpfs /mnt/ramdisk
sudo mkdir /mnt/ramdisk/blobfuse2tmp
sudo chown <youruser> /mnt/ramdisk/blobfuse2tmp
```

##### Use an SSD

In Azure, you can use the SSD ephemeral disks that are available on your VMs to provide a low-latency buffer for BlobFuse2. Depending on the provisioning agent you use, mount the ephemeral disk on */mnt* for cloud-init or */mnt/resource* for Microsoft Azure Linux Agent (waagent) VMs.

Make sure that your user has access to the temporary path:

```bash
sudo mkdir /mnt/resource/blobfuse2tmp -p
sudo chown <youruser> /mnt/resource/blobfuse2tmp
```

### Create an empty directory to mount the blob container

To create an empty directory to mount the blob container:

```bash
mkdir ~/mycontainer
```

### Authorize access to your storage account

You must grant access to the storage account for the user who mounts the container. The most common ways to grant access are by using one of the following options:

- Storage account access key
- Shared access signature
- Managed identity
- Service principal

You can provide authorization information in a configuration file or in environment variables. For more information, see [Configure settings for BlobFuse2](blobfuse2-configuration.md).

## How to mount a blob container

> [!IMPORTANT]
> BlobFuse2 doesn't support overlapping mount paths. If you run multiple instances of BlobFuse2, make sure that each instance has a unique and non-overlapping mount point.
>
> BlobFuse2 doesn't support coexistence with NFS on the same mount path. The results of running BlobFuse2 on the same mount path as NFS are undefined and might result in data corruption.

To mount an Azure block blob container by using BlobFuse2, run the following command. The command mounts the container specified in `./config.yaml` onto the location `~/mycontainer`:

```bash
sudo blobfuse2 mount ~/mycontainer --config-file=./config.yaml
```

> [!NOTE]
> For a full list of mount options, see [BlobFuse2 mount commands](blobfuse2-commands-mount.md).

You should now have access to your block blobs through the Linux file system and related APIs. To test your deployment, try creating a new directory and file:

```bash
cd ~/mycontainer
mkdir test
echo "hello world" > test/blob.txt
```

## How to access data

Generally, you can work with the BlobFuse2-mounted storage like you would work with the native Linux file system. It uses the virtual directory scheme with a forward slash (`/`) as a delimiter in the file path and supports basic file system operations such as `mkdir`, `opendir`, `readdir`, `rmdir`, `open`, `read`, `create`, `write`, `close`, `unlink`, `truncate`, `stat`, and `rename`.

However, you should be aware of some key [differences in functionality](blobfuse2-what-is.md#limitations):

- [Differences between the Linux file system and BlobFuse2](blobfuse2-what-is.md#differences-between-the-linux-file-system-and-blobfuse2)
- [Data integrity](blobfuse2-what-is.md#data-integrity)
- [Permissions](blobfuse2-what-is.md#permissions)

## Feature support

This table shows how this feature is supported in your account and the effect on support when you enable certain capabilities:

| Storage account type | Blob Storage (default support) | Data Lake Storage Gen2 <sup>1</sup> | NFS 3.0 <sup>1</sup> | SFTP <sup>1</sup> |
|--|--|--|--|--|
| Standard general-purpose v2 | ![Yes](../media/icons/yes-icon.png) |![Yes](../media/icons/yes-icon.png)              | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Premium block blobs          | ![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

<sup>1</sup> Azure Data Lake Storage Gen2, Network File System (NFS) 3.0 protocol, and SSH File Transfer Protocol (SFTP) support all require a storage account with a hierarchical namespace enabled.

## See also

- [Migrate to BlobFuse2 from BlobFuse v1](https://github.com/Azure/azure-storage-fuse/blob/main/MIGRATION.md)
- [BlobFuse2 commands](blobfuse2-commands.md)
- [Troubleshoot BlobFuse2 issues](blobfuse2-troubleshooting.md)

## Next steps

- [Configure settings for BlobFuse2](blobfuse2-configuration.md)
- [Use Health Monitor to gain insights into BlobFuse2 mount activities and resource usage](blobfuse2-health-monitor.md)
