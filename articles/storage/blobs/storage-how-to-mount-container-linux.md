---
title: How to mount Azure Blob storage as a file system on Linux | Microsoft Docs
description: Mount an Azure Blob storage container with FUSE on Linux
services: storage
author: seguler

ms.service: storage
ms.topic: article
ms.date: 10/11/2018
ms.author: seguler
---

# How to mount Blob storage as a file system with blobfuse

## Overview
[Blobfuse](https://github.com/Azure/azure-storage-fuse) is a virtual file system driver for Azure Blob Storage, which allows you to access your existing block blob data in your Storage account through the Linux file system. Azure Blob Storage is an object storage service and therefore does not have a hierarchical namespace. Blobfuse provides this namespace using the virtual directory scheme with the use of forward-slash '/' as a delimiter.  

This guide shows you how to use blobfuse, and mount a Blob storage container on Linux and access data. To learn more about blobfuse, read the details in [the blobfuse repository](https://github.com/Azure/azure-storage-fuse).

> [!WARNING]
> Blobfuse does not guarantee 100% POSIX compliance as it simply translates requests into [Blob REST APIs](https://docs.microsoft.com/rest/api/storageservices/blob-service-rest-api). For example, rename operations are atomic in POSIX, but not in blobfuse.
> For a full list of differences between a native file system and blobfuse, visit [the blobfuse source code repository](https://github.com/azure/azure-storage-fuse).
> 

## Install blobfuse on Linux
Blobfuse binaries are available on [the Microsoft software repositories for Linux](https://docs.microsoft.com/windows-server/administration/Linux-Package-Repository-for-Microsoft-Software) for Ubuntu and RHEL distributions. In order to install blobfuse on those distributions, configure one of the repositories from the list. You can also build the binaries from source code following the installation steps [here](https://github.com/Azure/azure-storage-fuse/wiki/1.-Installation#option-2---build-from-source) if there are no binaries available for your distribution.

### Configure the Microsoft package repository
Configure the [Linux Package Repository for Microsoft Products](https://docs.microsoft.com/windows-server/administration/Linux-Package-Repository-for-Microsoft-Software).

As an example, on an Enterprise Linux 6 distribution:
```bash
sudo rpm -Uvh https://packages.microsoft.com/config/rhel/6/packages-microsoft-prod.rpm
```

Similarly, change the url to `.../rhel/7/...` to point to an Enterprise Linux 7 distribution.

Another example on an Ubuntu 14.04:
```bash
wget https://packages.microsoft.com/config/ubuntu/14.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update
```

Similarly, change the url to `.../ubuntu/16.04/...` to point to an Ubuntu 16.04 distribution.

### Install blobfuse

On a Ubuntu/Debian distribution:
```bash
sudo apt-get install blobfuse
```

On an Enterprise Linux distribution:
```bash
sudo yum install blobfuse
```

## Prepare for mounting
Blobfuse requires a temporary path in the file system to buffer and cache any open files, which helps provides native-like performance. For this temporary path, choose the most performant disk, or use a ramdisk for best performance. 

> [!NOTE]
> Blobfuse stores all open file contents in the temporary path. Make sure to have enough space in order to accommodate all open files. 
> 

### (Optional) Use a ramdisk for the temporary path
The following example creates a ramdisk of 16 GB as well as creating a directory for blobfuse. Choose the size based on your needs. This ramdisk allows blobfuse to open files up to 16 GB in size. 
```bash
sudo mount -t tmpfs -o size=16g tmpfs /mnt/ramdisk
sudo mkdir /mnt/ramdisk/blobfusetmp
sudo chown <youruser> /mnt/ramdisk/blobfusetmp
```

### Use an SSD for temporary path
In Azure, you may use the ephemeral disks (SSD) available on your VMs to provide a low-latency buffer for blobfuse. In Ubuntu distributions, this ephemeral disk is mounted on '/mnt' whereas it is mounted on '/mnt/resource/' in Red Hat and CentOS distributions.

Ensure your user has access to the temporary path:
```bash
sudo mkdir /mnt/resource/blobfusetmp
sudo chown <youruser> /mnt/resource/blobfusetmp
```

### Configure your Storage account credentials
Blobfuse requires your credentials to be stored in a text file in the following format: 

```
accountName myaccount
accountKey 9fD-/KjshdfLDERmcIjabcdefhAUSIHD/asdhfoiasiaAISOIabcdef/askdfewiAASJDNFL+askdlfj==
containerName mycontainer
```

Once you've created this file, make sure to restrict access so no other user can read it.
```bash
chmod 700 fuse_connection.cfg
```

> [!NOTE]
> If you have created the configuration file on Windows, make sure to run `dos2unix` to sanitize and convert to Unix format. 
>

### Create an empty directory for mounting
```bash
mkdir ~/mycontainer
```

## Mount

> [!NOTE]
> For a full list of mount options, check [the blobfuse repository](https://github.com/Azure/azure-storage-fuse#mount-options).  
> 

In order to mount blobfuse, run the following command with your user. This command mounts the container specified in '/path/to/fuse_connection.cfg'  onto the location '/mycontainer'.

```bash
blobfuse ~/mycontainer --tmp-path=/mnt/resource/blobfusetmp  --config-file=/path/to/fuse_connection.cfg -o attr_timeout=240 -o entry_timeout=240 -o negative_timeout=120
```

You should now have access to your block blobs through the regular file system APIs. Note that the mounted directory can only be accessed by the user mounting it, which secures the access. If you want to allow access to all users, you can mount via the option ```-o allow_other```. 

```bash
cd ~/mycontainer
mkdir test
echo "hello world" > test/blob.txt
```

## Next steps

* [Blobfuse home page](https://github.com/Azure/azure-storage-fuse#blobfuse)
* [Report blobfuse issues](https://github.com/Azure/azure-storage-fuse/issues) 

