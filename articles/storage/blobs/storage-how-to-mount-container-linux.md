---
title: How to mount Azure Blob storage as a file system on Linux | Microsoft Docs
description: Learn how to mount an Azure Blob storage container with blobfuse, a virtual file system driver on Linux.
author: tamram
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.date: 04/28/2022
ms.author: tamram
ms.reviewer: twooley
---

# How to mount Blob storage as a file system with blobfuse

## Overview

[Blobfuse](https://github.com/Azure/azure-storage-fuse) is a virtual file system driver for Azure Blob storage. Blobfuse allows you to access your existing block blob data in your storage account through the Linux file system. Blobfuse uses the virtual directory scheme with the forward-slash '/' as a delimiter.

This guide shows you how to use blobfuse, and mount a Blob storage container on Linux and access data. To learn more about blobfuse, see the [readme](https://github.com/Azure/azure-storage-fuse) and [wiki](https://github.com/Azure/azure-storage-fuse/wiki).

> [!WARNING]
> Blobfuse doesn't guarantee 100% POSIX compliance as it simply translates requests into [Blob REST APIs](/rest/api/storageservices/blob-service-rest-api). For example, rename operations are atomic in POSIX, but not in blobfuse.
> For a full list of differences between a native file system and blobfuse, visit [the blobfuse source code repository](https://github.com/azure/azure-storage-fuse).

## Install blobfuse on Linux

Blobfuse binaries are available on [the Microsoft software repositories for Linux](/windows-server/administration/Linux-Package-Repository-for-Microsoft-Software) for Ubuntu, Debian, SUSE, CentOS, Oracle Linux and RHEL distributions. To install blobfuse on those distributions, configure one of the repositories from the list. You can also build the binaries from source code following the [Azure Storage installation steps](https://github.com/Azure/azure-storage-fuse/wiki/1.-Installation#option-2---build-from-source) if there are no binaries available for your distribution.

Blobfuse is published in the Linux repo for Ubuntu versions: 16.04, 18.04, and 20.04, RHELversions: 7.5, 7.8, 7.9, 8.0, 8.1, 8.2, CentOS versions: 7.0, 8.0, Debian versions: 9.0, 10.0, SUSE version: 15, OracleLinux  8.1 . Run this command to make sure that you have one of those versions deployed:

```bash
lsb_release -a
```

### Configure the Microsoft package repository

Configure the [Linux Package Repository for Microsoft Products](/windows-server/administration/Linux-Package-Repository-for-Microsoft-Software).

As an example, on an Enterprise Linux 8 distribution:

```bash
sudo rpm -Uvh https://packages.microsoft.com/config/rhel/8/packages-microsoft-prod.rpm
```

Similarly, change the URL to `.../rhel/7/...` to point to an Enterprise Linux 7 distribution.

Another example on an Ubuntu 20.04 distribution:

```bash
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update
```

Similarly, change the URL to `.../ubuntu/16.04/...` or `.../ubuntu/18.04/...` to reference another Ubuntu version.

### Install blobfuse

On an Ubuntu/Debian distribution:

```bash
sudo apt-get install blobfuse
```

On an Enterprise Linux distribution:

```bash
sudo yum install blobfuse
```

On a SUSE distribution:

```bash
sudo zypper install blobfuse
```

## Prepare for mounting

Blobfuse provides native-like performance by requiring a temporary path in the file system to buffer and cache any open files. For this temporary path, choose the most performant disk, or use a ramdisk for best performance.

> [!NOTE]
> Blobfuse stores all open file contents in the temporary path. Make sure to have enough space to accommodate all open files.
>

### (Optional) Use a ramdisk for the temporary path

The following example creates a ramdisk of 16 GB and a directory for blobfuse. Choose the size based on your needs. This ramdisk allows blobfuse to open files up to 16 GB in size.

```bash
sudo mkdir /mnt/ramdisk
sudo mount -t tmpfs -o size=16g tmpfs /mnt/ramdisk
sudo mkdir /mnt/ramdisk/blobfusetmp
sudo chown <youruser> /mnt/ramdisk/blobfusetmp
```

### Use an SSD as a temporary path

In Azure, you may use the ephemeral disks (SSD) available on your VMs to provide a low-latency buffer for blobfuse. Depending on the provisioning agent used, the ephemeral disk would be mounted on '/mnt' for cloud-init or '/mnt/resource' for waagent VMs.

Make sure your user has access to the temporary path:

```bash
sudo mkdir /mnt/resource/blobfusetmp -p
sudo chown <youruser> /mnt/resource/blobfusetmp
```

### Authorize access to your storage account

You can authorize access to your storage account by using the account access key, a shared access signature, a managed identity, or a service principal. Authorization information can be provided on the command line, in a config file, or in environment variables. For details, see [Valid authentication setups](https://github.com/Azure/azure-storage-fuse#valid-authentication-setups) in the blobfuse readme.

For example, suppose you are authorizing with the account access keys and storing them in a config file. The config file should have the following format:

```bash
accountName myaccount
accountKey storageaccesskey
containerName mycontainer
```

The `accountName` is the name of your storage account, and not the full URL.

Create this file using:

```bash
touch /path/to/fuse_connection.cfg
```

Once you've created and edited this file, make sure to restrict access so no other users can read it.

```bash
chmod 600 /path/to/fuse_connection.cfg
```

> [!NOTE]
> If you have created the configuration file on Windows, make sure to run `dos2unix` to sanitize and convert the file to Unix format.

### Create an empty directory for mounting

```bash
mkdir ~/mycontainer
```

## Mount

> [!NOTE]
> For a full list of mount options, check [the blobfuse repository](https://github.com/Azure/azure-storage-fuse#mount-options).
>

To mount blobfuse, run the following command with your user. This command mounts the container specified in '/path/to/fuse_connection.cfg' onto the location '/mycontainer'.

```bash
blobfuse ~/mycontainer --tmp-path=/mnt/resource/blobfusetmp  --config-file=/path/to/fuse_connection.cfg -o attr_timeout=240 -o entry_timeout=240 -o negative_timeout=120
```

> [!NOTE]
> If you use an ADLS account, you must include `--use-adls=true`.

You should now have access to your block blobs through the regular file system APIs. The user who mounts the directory is the only person who can access it, by default, which secures the access. To allow access to all users, you can mount via the option `-o allow_other`.

```bash
cd ~/mycontainer
mkdir test
echo "hello world" > test/blob.txt
```

## Persist the mount

To learn how to persist the mount, see [Persisting](https://github.com/Azure/azure-storage-fuse/wiki/2.-Configuring-and-Running#persisting) in the blobfuse wiki.

## Feature support

This table shows how this feature is supported in your account and the impact on support when you enable certain capabilities.

| Storage account type | Blob Storage (default support) | Data Lake Storage Gen2 <sup>1</sup> | NFS 3.0 <sup>1</sup> | SFTP <sup>1</sup> |
|--|--|--|--|--|
| Standard general-purpose v2 | ![Yes](../media/icons/yes-icon.png) |![Yes](../media/icons/yes-icon.png)              | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Premium block blobs          | ![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

<sup>1</sup> Data Lake Storage Gen2, Network File System (NFS) 3.0 protocol, and SSH File Transfer Protocol (SFTP) support all require a storage account with a hierarchical namespace enabled.

## Next steps

- [Blobfuse home page](https://github.com/Azure/azure-storage-fuse#blobfuse)
- [Report blobfuse issues](https://github.com/Azure/azure-storage-fuse/issues)
