---
title: How to mount Azure Blob Storage as a file system on Linux with BlobFuse v1
titleSuffix: Azure Storage
description: Learn how to mount an Azure Blob Storage container with BlobFuse v1, a virtual file system driver on Linux.
author: akashdubey-ms
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/02/2022
ms.author: akashdubey
ms.reviewer: tamram
ms.custom: engagement-fy23, devx-track-linux
---

# How to mount Azure Blob Storage as a file system with BlobFuse v1

> [!IMPORTANT]
> [BlobFuse2](blobfuse2-what-is.md) is the latest version of BlobFuse and has many significant improvements over the version discussed in this article, BlobFuse v1. To learn about the improvements made in BlobFuse2, see [the list of BlobFuse2 enhancements](blobfuse2-what-is.md#blobfuse2-enhancements-from-blobfuse-v1).

[BlobFuse](https://github.com/Azure/azure-storage-fuse) is a virtual file system driver for Azure Blob Storage. BlobFuse allows you to access your existing block blob data in your storage account through the Linux file system. BlobFuse uses the virtual directory scheme with the forward-slash '/' as a delimiter.

This guide shows you how to use BlobFuse v1 and mount a Blob Storage container on Linux and access data. To learn more about BlobFuse v1, see the [readme](https://github.com/Azure/azure-storage-fuse) and [wiki](https://github.com/Azure/azure-storage-fuse/wiki).

> [!WARNING]
> BlobFuse doesn't guarantee 100% POSIX compliance as it simply translates requests into [Blob REST APIs](/rest/api/storageservices/blob-service-rest-api). For example, rename operations are atomic in POSIX, but not in BlobFuse.
> For a full list of differences between a native file system and BlobFuse, visit [the BlobFuse source code repository](https://github.com/azure/azure-storage-fuse).

## Install BlobFuse v1 on Linux

BlobFuse binaries are available on [the Microsoft software repositories for Linux](/windows-server/administration/Linux-Package-Repository-for-Microsoft-Software) for Ubuntu, Debian, SUSE, CentOS, Oracle Linux and RHEL distributions. To install BlobFuse on those distributions, configure one of the repositories from the list. You can also build the binaries from source code following the [Azure Storage installation steps](https://github.com/Azure/azure-storage-fuse/wiki/1.-Installation#option-2---build-from-source) if there are no binaries available for your distribution.

BlobFuse is published in the Linux repo for Ubuntu versions: 16.04, 18.04, and 20.04, RHEL versions: 7.5, 7.8, 7.9, 8.0, 8.1, 8.2, CentOS versions: 7.0, 8.0, Debian versions: 9.0, 10.0, SUSE version: 15, Oracle Linux  8.1. Run this command to make sure that you have one of those versions deployed:

```bash
cat /etc/*-release
```

### Configure the Microsoft package repository

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
```

Similarly, change the URL to `.../ubuntu/16.04/...` or `.../ubuntu/18.04/...` to reference another Ubuntu version.

# [SLES](#tab/SLES) 

```bash
sudo rpm -Uvh https://packages.microsoft.com/config/sles/15/packages-microsoft-prod.rpm
```
--- 

### Install BlobFuse v1

# [RHEL](#tab/RHEL) 

```bash
sudo yum install blobfuse
```
# [CentOS](#tab/CentOS)

```bash
sudo yum install blobfuse
```

# [Ubuntu](#tab/Ubuntu)

```bash
sudo apt-get install blobfuse
```
# [SLES](#tab/SLES)  

```bash
sudo zypper install blobfuse
```
---

## Prepare for mounting

BlobFuse provides native-like performance by requiring a temporary path in the file system to buffer and cache any open files. For this temporary path, choose the most performant disk, or use a ramdisk for best performance.

> [!NOTE]
> BlobFuse stores all open file contents in the temporary path. Make sure to have enough space to accommodate all open files.
>

### (Optional) Use a ramdisk for the temporary path

The following example creates a ramdisk of 16 GB and a directory for BlobFuse. Choose the size based on your needs. This ramdisk allows BlobFuse to open files up to 16 GB in size.

```bash
sudo mkdir /mnt/ramdisk
sudo mount -t tmpfs -o size=16g tmpfs /mnt/ramdisk
sudo mkdir /mnt/ramdisk/blobfusetmp
sudo chown <youruser> /mnt/ramdisk/blobfusetmp
```

### Use an SSD as a temporary path

In Azure, you may use the ephemeral disks (SSD) available on your VMs to provide a low-latency buffer for BlobFuse. Depending on the provisioning agent used, the ephemeral disk would be mounted on '/mnt' for cloud-init or '/mnt/resource' for waagent VMs.

Make sure your user has access to the temporary path:

```bash
sudo mkdir /mnt/resource/blobfusetmp -p
sudo chown <youruser> /mnt/resource/blobfusetmp
```

### Authorize access to your storage account

You can authorize access to your storage account by using the account access key, a shared access signature, a managed identity, or a service principal. Authorization information can be provided on the command line, in a config file, or in environment variables. For details, see [Valid authentication setups](https://github.com/Azure/azure-storage-fuse#valid-authentication-setups) in the BlobFuse readme.

For example, suppose you are authorizing with the account access keys and storing them in a config file. The config file should have the following format:

```bash
accountName myaccount
accountKey storageaccesskey
containerName mycontainer
authType Key
```

The `accountName` is the name of your storage account, and not the full URL. You need to update `myaccount`, `storageaccesskey`, and `mycontainer` with your storage information. 

Create this file using:

```bash
sudo touch /path/to/fuse_connection.cfg
```

Once you've created and edited this file, make sure to restrict access so no other users can read it.

```bash
sudo chmod 600 /path/to/fuse_connection.cfg
```

> [!NOTE]
> If you have created the configuration file on Windows, make sure to run `dos2unix` to sanitize and convert the file to Unix format.

### Create an empty directory for mounting

```bash
sudo mkdir ~/mycontainer
```

## Mount

> [!NOTE]
> For a full list of mount options, check [the BlobFuse repository](https://github.com/Azure/azure-storage-fuse#mount-options).
>

To mount BlobFuse, run the following command with your user. This command mounts the container specified in '/path/to/fuse_connection.cfg' onto the location '/mycontainer'.

```bash
sudo blobfuse ~/mycontainer --tmp-path=/mnt/resource/blobfusetmp  --config-file=/path/to/fuse_connection.cfg -o attr_timeout=240 -o entry_timeout=240 -o negative_timeout=120
```

> [!NOTE]
> If you use an ADLS account, you must include `--use-adls=true`.

You should now have access to your block blobs through the regular file system APIs. The user who mounts the directory is the only person who can access it, by default, which secures the access. To allow access to all users, you can mount via the option `-o allow_other`.

```bash
sudo cd ~/mycontainer
sudo mkdir test
sudo echo "hello world" > test/blob.txt
```

## Persist the mount

To learn how to persist the mount, see [Persisting](https://github.com/Azure/azure-storage-fuse/wiki/2.-Configuring-and-Running#persisting) in the BlobFuse wiki.

## Feature support

[!INCLUDE [Blob Storage feature support in Azure Storage accounts](../../../includes/azure-storage-feature-support.md)]

## Next steps

- [BlobFuse home page](https://github.com/Azure/azure-storage-fuse#blobfuse)
- [Report BlobFuse issues](https://github.com/Azure/azure-storage-fuse/issues)
