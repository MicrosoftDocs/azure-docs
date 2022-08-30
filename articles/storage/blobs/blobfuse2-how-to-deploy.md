---
title: How to mount an Azure blob storage container on Linux with BlobFuse2 (preview) | Microsoft Docs
titleSuffix: Azure Blob Storage
description: How to mount an Azure blob storage container on Linux with BlobFuse2 (preview).
author: jammart
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.date: 08/02/2022
ms.author: jammart
ms.reviewer: tamram
---

# How to mount an Azure blob storage container on Linux with BlobFuse2 (preview)

[BlobFuse2](blobfuse2-what-is.md) is a virtual file system driver for Azure Blob storage. BlobFuse2 allows you to access your existing Azure block blob data in your storage account through the Linux file system. For more details see [What is BlobFuse2? (preview)](blobfuse2-what-is.md).

> [!IMPORTANT]
> BlobFuse2 is the next generation of BlobFuse and is currently in preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> If you need to use BlobFuse in a production environment, BlobFuse v1 is generally available (GA). For information about the GA version, see:
>
> - [The BlobFuse v1 setup documentation](storage-how-to-mount-container-linux.md)
> - [The BlobFuse v1 project on GitHub](https://github.com/Azure/azure-storage-fuse/tree/master)

This guide shows you how to install and configure BlobFuse2, mount an Azure blob container, and access data in the container. The basic steps are:

- [Install BlobFuse2](#install-blobfuse2)
- [Configure BlobFuse2](#configure-blobfuse2)
- [Mount blob container](#mount-blob-container)
- [Access data](#access-data)

## Install BlobFuse2

There are 2 basic options for installing BlobFuse2:

1. [Install BlobFuse2 Binary](#option-1-install-blobfuse2-binary-preferred)
1. [Build it from source](#option-2-build-from-source)

### Option 1: Install BlobFuse2 Binary (preferred)

For supported distributions see [the BlobFuse2 releases page](https://github.com/Azure/azure-storage-fuse/releases).
For libfuse support information, refer to [the BlobFuse2 README](https://github.com/Azure/azure-storage-fuse/blob/main/README.md#distinctive-features-compared-to-blobfuse-v1x).

To check your version of Linux, run the following command:

```bash
lsb_release -a
```

If there are no binaries available for your distribution, you can [build the binaries from source code](https://github.com/MicrosoftDocs/azure-docs-pr/pull/203174#option-2-build-from-source).

#### Install the BlobFuse2 binaries

To install BlobFuse2:

1. Retrieve the latest Blobfuse2 binary for your distro from GitHub, for example:

    ```bash
    wget https://github.com/Azure/azure-storage-fuse/releases/download/blobfuse2-2.0.0-preview2/blobfuse2-2.0.0-preview.2-ubuntu-20.04-x86-64.deb
    ```
    
1. Install BlobFuse2. For example, on an Ubuntu distribution run:

    ```bash
    sudo apt-get install libfuse3-dev fuse3 
    sudo apt install blobfuse2-2.0.0-preview.2-ubuntu-20.04-x86-64.deb
    ```
    
### Option 2: Build from source

To build the BlobFuse2 binaries from source:

1. Install the dependencies
    1. Install Git:

       ```bash
       sudo apt-get install git
       ```

    1. Install BlobFuse2 dependencies:
       Ubuntu:

       ```bash
       sudo apt-get install libfuse3-dev fuse3 -y
       ```

1. Clone the repo

   ```Git
   git clone https://github.com/Azure/azure-storage-fuse/
   cd ./azure-storage-fuse
   git checkout main
   ```

1. Build

    ```Git
    go get
    go build -tags=fuse3
    ```

> [!TIP]
> If you need to install Go, refer to [The download and install page for Go](https://go.dev/doc/install).

## Configure BlobFuse2

You can configure BlobFuse2 with a variety of settings. Some of the common settings used include:

- Logging location and options
- Temporary cache file path
- Information about the Azure storage account and blob container to be mounted

The settings can be configured in a yaml configuration file, using environment variables, or as parameters passed to the BlobFuse2 commands. The preferred method is to use the yaml configuration file.

For details about all of the configuration parameters for BlobFuse2, consult the complete reference material for each:

- [Complete BlobFuse2 configuration reference (preview)](blobfuse2-configuration.md)
- [Configuration file reference (preview)](blobfuse2-configuration.md#configuration-file)
- [Environment variable reference (preview)](blobfuse2-configuration.md#environment-variables)
- [Mount command reference (preview)](blobfuse2-commands-mount.md)

The basic steps for configuring BlobFuse2 in preparation for mounting are:

1. [Configure a temporary path for caching or streaming](#configure-a-temporary-path-for-caching)
1. [Create an empty directory for mounting the blob container](#create-an-empty-directory-for-mounting-the-blob-container)
1. [Authorize access to your storage account](#authorize-access-to-your-storage-account)

### Configure a temporary path for caching

BlobFuse2 provides native-like performance by requiring a temporary path in the file system to buffer and cache any open files. For this temporary path, choose the most performant disk available, or use a ramdisk for the best performance.

> [!NOTE]
> BlobFuse2 stores all open file contents in the temporary path. Make sure to have enough space to accommodate all open files.
>

#### Choose a caching disk option

There are 3 common options for configuring the temporary path for caching:

- [Use a local high-performing disk](#use-a-local-high-performing-disk)
- [Use a ramdisk](#use-a-ramdisk)
- [Use an SSD](#use-an-ssd)

##### Use a local high-performing disk

If an existing local disk is chosen for file caching, choose one that will provide the best performance possible, such as an SSD.

##### Use a ramdisk

The following example creates a ramdisk of 16 GB and a directory for BlobFuse2. Choose the size based on your needs. This ramdisk allows BlobFuse2 to open files up to 16 GB in size.

```bash
sudo mkdir /mnt/ramdisk
sudo mount -t tmpfs -o size=16g tmpfs /mnt/ramdisk
sudo mkdir /mnt/ramdisk/blobfuse2tmp
sudo chown <youruser> /mnt/ramdisk/blobfuse2tmp
```

##### Use an SSD

In Azure, you may use the ephemeral disks (SSD) available on your VMs to provide a low-latency buffer for BlobFuse2. Depending on the provisioning agent used, the ephemeral disk would be mounted on '/mnt' for cloud-init or '/mnt/resource' for waagent VMs.

Make sure your user has access to the temporary path:

```bash
sudo mkdir /mnt/resource/blobfuse2tmp -p
sudo chown <youruser> /mnt/resource/blobfuse2tmp
```

### Create an empty directory for mounting the blob container

```bash
mkdir ~/mycontainer
```

### Authorize access to your storage account

You must grant the user mounting the container access to the storage account. The most common ways of doing this are by using:

- A storage account access key
- A shared access signature (SAS)
- A managed identity
- A Service Principal

Authorization information can be provided in a configuration file or in environment variables. For details, see [How to configure Blobfuse2 (preview)](blobfuse2-configuration.md).

## Mount blob container

> [!IMPORTANT]
> BlobFuse2 does not support overlapping mount paths. While running multiple instances of BlobFuse2 make sure each instance has a unique and non-overlapping mount point.
>
> BlobFuse2 does not support co-existence with NFS on the same mount path. The behavior resulting from doing so is undefined and could result in data corruption.

To mount an Azure block blob container using BlobFuse2, run the following command. This command mounts the container specified in `./config.yaml` onto the location `~/mycontainer`:

```bash
blobfuse2 mount ~/mycontainer --config-file=./config.yaml
```

> [!NOTE]
> For a full list of mount options, check [the BlobFuse2 mount command reference (preview)](blobfuse2-commands-mount.md).

You should now have access to your block blobs through the Linux file system and related APIs. To test your deployment try creating a new directory and file:

```bash
cd ~/mycontainer
mkdir test
echo "hello world" > test/blob.txt
```

## Access data

Generally, you can work with the BlobFuse2-mounted storage like you would work with the native Linux file system. It uses the virtual directory scheme with the forward-slash '/' as a delimiter in the file path and supports basic file system operations such as mkdir, opendir, readdir, rmdir, open, read, create, write, close, unlink, truncate, stat, and rename.

However, there are some [differences in functionality](blobfuse2-what-is.md#limitations) you need to be aware of. Some of the key differences are related to:

- [Differences between the Linux file system and BlobFuse2](blobfuse2-what-is.md#differences-between-the-linux-file-system-and-blobfuse2)
- [Data Integrity](blobfuse2-what-is.md#data-integrity)
- [Permissions](blobfuse2-what-is.md#permissions)

## Feature support

This table shows how this feature is supported in your account and the impact on support when you enable certain capabilities.

| Storage account type | Blob Storage (default support) | Data Lake Storage Gen2 <sup>1</sup> | NFS 3.0 <sup>1</sup> | SFTP <sup>1</sup> |
|--|--|--|--|--|
| Standard general-purpose v2 | ![Yes](../media/icons/yes-icon.png) |![Yes](../media/icons/yes-icon.png)              | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Premium block blobs          | ![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

<sup>1</sup> Data Lake Storage Gen2, Network File System (NFS) 3.0 protocol, and SSH File Transfer Protocol (SFTP) support all require a storage account with a hierarchical namespace enabled.

## See also

- [Blobfuse2 Migration Guide (from BlobFuse v1)](https://github.com/Azure/azure-storage-fuse/blob/main/MIGRATION.md)
- [BlobFuse2 configuration reference (preview)](blobfuse2-configuration.md)
- [BlobFuse2 command reference (preview)](blobfuse2-commands.md)
- [How to troubleshoot BlobFuse2 issues (preview)](blobfuse2-troubleshooting.md)
