---
title: How to mount Blob storage as a filesystem on Linux | Microsoft Docs
description: Mount a Blob storage container with FUSE on Linux
services: storage
documentationcenter: linux
author: seguler
manager: jahogg

ms.assetid: e2fe4c45-27b0-4d15-b3fb-e7eb574db717
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: bash
ms.topic: article
ms.date: 01/19/2018
ms.author: tamram

---
# How to mount Blob storage as a filesystem with blobfuse (Preview)

## Overview
[Blobfuse](https://github.com/Azure/azure-storage-fuse) is a virtual filesystem driver for Blob storage, which allows you to access your existing block blobs in your Storage account through the Linux filesystem. Azure Blob storage is an object storage and therefore does not have a hierarchial namespace. Blobfuse provides this namespace using the virtual directory scheme with the use of forward-slash '/' as a delimiter.  

This guide will show you how to use blobfuse, and mount a Blob storage container on Linux. To learn more about blobfuse, read the details in [the blobfuse repository](https://github.com/Azure/azure-storage-fuse).

> [!WARNING]
> Blobfuse does not guarantee 100% POSIX compliance as it simply translates requests into [Blob REST APIs](https://docs.microsoft.com/en-us/rest/api/storageservices/blob-service-rest-api). As an example, unlike POSIX, a rename operation is not an atomic operation. 
> For a full list of differences between a native filesystem and blobfuse, visit [the blobfuse source code repository](https://github.com/azure/azure-storage-fuse).
> 

## Install blobfuse on Linux
Blobfuse binaries are available on [the Microsoft software repositories for Linux](https://docs.microsoft.com/windows-server/administration/Linux-Package-Repository-for-Microsoft-Software). In order to install blobfuse, configure one of these repositories.

### Configure the Microsoft package repository
In order to configure the package repository, follow the instructions [here](https://docs.microsoft.com/windows-server/administration/Linux-Package-Repository-for-Microsoft-Software).

As an example, on an Enterprise Linux 6 distribution:
```bash
sudo rpm -Uvh https://packages.microsoft.com/config/rhel/6/packages-microsoft-prod.rpm
```

Another example on an Ubuntu 14.04:
```bash
wget https://packages.microsoft.com/config/ubuntu/14.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update
```

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
Blobfuse requires a temporary path in the filesystem to buffer and cache any open files which helps provides native-like performance. For this temporary path, choose the most performant disk, or use a ramdisk for best performance. You should also ensure your user has write access to this temporary path.

### (Optional) Use a ramdisk for the temporary path
Following will create a ramdisk of 16GB as well as creating a directory for blobfuse. Choose the size based on your needs. This allows blobfuse to open files up to 16GB in size. 
```bash
sudo mount -t tmpfs -o size=16g tmpfs /mnt/ramdisk
sudo mkdir /mnt/ramdisk/blobfusetmp
sudo chown <youruser> /mnt/ramdisk/blobfusetmp
```

### Use an SSD for temporary path
In Azure, you may use the ephemeral disks (SSD) available on your VMs to provide a low-latency buffer for blobfuse. In Ubuntu distributions, this ephemeral disk is mounted on '/mnt' whereas it is mounted on '/mnt/resource/' in RedHat and CentOS distributions.

Ensure your user have access to the temporary path:
```bash
sudo mkdir /mnt/resource/blobfusetmp
sudo chown <youruser> /mnt/resource/blobfusetmp
```

### Configure your Storage account credentials
Blobfuse will require your credentials to be stored in a text file in the following format. 

```
accountName myaccount
accountKey myaccesskey==
containerName mycontainer
```

Once you've created this file, make sure to restrict access so no other user can read it.
```bash
chmod 700 fuse_connection.cfg
```

### Create an empty directory for mounting
```bash
mkdir /myblobs
```

## Mount
In order to mount blobfuse, run the following with your user. This will mount the container 'mycontainer' onto the location '/myblobs'.

```bash
blobfuse /myblobs --tmp-path=/mnt/resource/blobfusetmp  --config-file=/path/to/fuse_connection.cfg -o attr_timeout=240 -o entry_timeout=240 -o negative_timeout=120
```

You should now have access to your block blobs through the regular filesystem APIs. Note that the mounted directory can only be accessed by the user mounting it which secures the access. If you want to allow access to all users, you can mount via the option ```-o allow_other```. 

```bash
cd /myblobs
mkdir myfiles
cp ~myfile .
```

> [!NOTE]
> For a full list of mount options, check [the blobfuse repository](https://github.com/Azure/azure-storage-fuse).  
> 



## Next steps
To learn about more complex storage tasks, follow these links:

* [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/)
* [Azure SDK for Ruby](https://github.com/WindowsAzure/azure-sdk-for-ruby) repository on GitHub
* [Transfer data with the AzCopy Command-Line Utility](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

