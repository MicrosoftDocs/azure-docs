---
title: Use Azure File Storage with Linux | Microsoft Docs
description: Learn how to mount an Azure File share over SMB on Linux.
services: storage
documentationcenter: na
author: RenaShahMSFT
manager: aungoo
editor: tysonn

ms.assetid: 6edc37ce-698f-4d50-8fc1-591ad456175d
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 3/8/2017
ms.author: renash
---

=======
# How to use Azure File Storage with Linux
## Overview
Azure File storage offers file shares in the cloud using the standard SMB protocol. With Azure Files, you can migrate enterprise applications that rely on file servers to Azure. Applications running in Azure can easily mount file shares from Azure virtual machines running Linux. And with the latest release of File storage, you can also mount a file share from an on-premises application that supports SMB 3.0.

You can create Azure file shares using the [Azure Portal](https://portal.azure.com), the Azure Storage PowerShell cmdlets, the Azure Storage client libraries, or the Azure Storage REST API. Additionally, because file shares are SMB shares, you can access them via standard file system APIs.

File storage is built on the same technology as Blob, Table, and Queue storage, so File storage offers the availability, durability, scalability, and geo-redundancy that is built into the Azure storage platform. For details about File storage performance targets and limits, see [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md).

File storage is now generally available and supports both SMB 2.1 and SMB 3.0. For additional details on File storage, see the [File service REST API](https://msdn.microsoft.com/library/azure/dn167006.aspx).

> [!NOTE]
> The Linux SMB client doesn't yet support encryption, so mounting a file share from Linux still requires that the client be in the same Azure region as the file share. However, encryption support for Linux is on the roadmap of Linux developers responsible for SMB functionality. Linux distributions that support encryption in the future will be able to mount an Azure File share from anywhere as well.
> 
> 

## Video: Using Azure File storage with Linux
Here's a video that demonstrates how to create and use Azure File shares on Linux.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Azure-File-Storage-with-Linux/player]
> 
> 

## Choose a Linux distribution to use
When creating a Linux virtual machine in Azure, you can specify a Linux image which supports SMB 2.1 or higher from the Azure image gallery. Below is a list of recommended Linux images:
>>>>>>> 3d2a4f3d927655ea1249aaae814c5dc6e2e231b8

# Use Azure File Storage with Linux
[Azure Files](storage-file-storage.md) is Microsoft's easy to use cloud file system. Azure File shares can be mounted in Linux distributions using the [cifs-utils package](https://wiki.samba.org/index.php/LinuxCIFS_utils) from the [Samba project](https://www.samba.org/). This article shows two ways to mount an Azure File share: on-demand with the `mount` command and on-boot by creating an entry in `/etc/fstab`.

> [!NOTE]  
> In order to mount an Azure File share outside of the Azure Region it is hosted in, such as on-premises or in a different Azure Region, the OS must support the encryption functionality of SMB 3.x. As of the time of publishing, Samba support for SMB 3.x is incomplete as it does not yet support encryption. Status on SMB 3.x compatibility can be viewed on the [Samba wiki](https://wiki.samba.org/index.php/SMB3_kernel_status#Security_Features).

## <a id="preq"></a>Prerequisities for mounting an Azure File share with Linux and the cifs-utils package
* **Pick a Linux distribution that can have the cifs-utils package installed**: Microsoft recommends the following Linux distributions in the Azure image gallery:

    * Ubuntu Server 14.04+
    * RHEL 7+
    * CentOS 7+
    * Debian 8
    * openSUSE 13.2+
    * SUSE Linux Enterprise Server 12
    * SUSE Linux Enterprise Server 12 (Premium Image)

    > [!Note]  
    > Any Linux distribution that download and install or compile recent versions of the cifs-utils package can be used with Azure Files.

* <a id="install-cifs-utils"></a>**The cifs-utils package is installed**: The cifs-utils can be installed using the package manager on the Linux distribution of your choice. 

    On **Ubuntu** and **Debian-based** distributions, use the `apt-get` package manager:

    ```
    sudo apt-get update
    sudo apt-get install cifs-utils
    ```

    On **RHEL** and **CentOS**, use the `yum` package manager:

    ```
    sudo yum install samba-client samba-common cifs-utils
    ```

    On **openSUSE**, use the `zypper` package manager:

    ```
    sudo zypper install samba*
    ```

    On other distributions, use the appropriate package manager or [compile from source](https://wiki.samba.org/index.php/LinuxCIFS_utils#Download).

* **Decide on the directory/file permissions of the mounted share**: In the examples below, we use 0777, to give read, write, and execute permissions to all users. You can replace it with other [chmod permissions](https://en.wikipedia.org/wiki/Chmod) as desired. 

* **Storage Account Name**: To mount an Azure File share, you will need the name of the storage account.

* **Storage Account Key**: To mount an Azure File share, you will need the primary (or secondary) storage key. SAS keys are not currently supported for mounting.

* **Ensure port 445 is open**: SMB communicates over TCP port 445 - check to see if your firewall is not blocking TCP ports 445 from client machine.

## Mount the Azure File share on-demand with `mount`
1. **[Install the cifs-utils package for your Linux distribution](#install-cifs-utils)**.

2. **Create a folder for the mount point**: This can be done anywhere on the file system.

    ```
    mkdir mymountpoint
    ```

3. **Use the mount command to mount the Azure File share**: Remember to replace `<storage-account-name>`, `<share-name>`, and `<storage-account-key>` with the proper information.

    ```
    sudo mount -t cifs //<storage-account-name>.file.core.windows.net/<share-name> ./mymountpoint -o vers=3.0,username=<storage-account-name>,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino
    ```

> [!Note]  
> When you are done using the Azure File share, you may use `sudo umount ./mymountpoint` to unmount the share.

## Create a persistent mount point for the Azure File share with `/etc/fstab`
1. **[Install the cifs-utils package for your Linux distribution](#install-cifs-utils)**.

2. **Create a folder for the mount point**: This can be done anywhere on the file system, but you need to note the absolute path of the folder. The following example creates a folder under root.

    ```
    sudo mkdir /mymountpoint
    ```

3. **Use the following command to append the following line to `/etc/fstab`**: Remember to replace `<storage-account-name>`, `<share-name>`, and `<storage-account-key>` with the proper information.

    ```
    sudo bash -c 'echo "//<storage-account-name>.file.core.windows.net/<share-name> /mymountpoint cifs vers=3.0,username=<storage-account-name>,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino" >> /etc/fstab'
    ```

> [!Note]  
> You can use `sudo mount -a` to mount the Azure File share after editing `/etc/fstab` instead of rebooting.

## Feedback
Linux users, we want to hear from you!

The Azure File storage for Linux users' group provides a forum for you to share feedback as you evaluate and adopt File storage on Linux. Email [Azure File Storage Linux Users](mailto:azurefileslinuxusers@microsoft.com) to join the users' group.

## See Also
See these links for more information about Azure File storage.

### Conceptual articles and videos
* [Azure File Storage: a frictionless cloud SMB file system for Windows and Linux](https://azure.microsoft.com/documentation/videos/azurecon-2015-azure-files-storage-a-frictionless-cloud-smb-file-system-for-windows-and-linux/)
* [Get started with Azure File storage on Windows](storage-dotnet-how-to-use-files.md)

### Tooling support for File storage
* [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md)
* [Create and manage file shares](storage-azure-cli.md#create-and-manage-file-shares) using the Azure CLI

### Reference
* [File Service REST API reference](http://msdn.microsoft.com/library/azure/dn167006.aspx)
* [Azure File Storage Troubleshooting Article](storage-troubleshoot-file-connection-problems.md)

### Blog posts
* [Azure File storage is now generally available](https://azure.microsoft.com/blog/azure-file-storage-now-generally-available/)
* [Inside Azure File Storage](https://azure.microsoft.com/blog/inside-azure-file-storage/)
* [Introducing Microsoft Azure File Service](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/12/introducing-microsoft-azure-file-service.aspx)
* [Persisting connections to Microsoft Azure File Storage](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/27/persisting-connections-to-microsoft-azure-files.aspx)