---
title: Use Azure Files with Linux | Microsoft Docs
description: Learn how to mount an Azure file share over SMB on Linux.
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
ms.date: 12/20/2017
ms.author: renash
---

# Use Azure Files with Linux
[Azure Files](storage-files-introduction.md) is Microsoft's easy to use cloud file system. Azure file shares can be mounted in Linux distributions using the [CIFS kernel client](https://wiki.samba.org/index.php/LinuxCIFS). This article shows two ways to mount an Azure file share: on-demand with the `mount` command and on-boot by creating an entry in `/etc/fstab`.

> [!NOTE]  
> In order to mount an Azure file share outside of the Azure region it is hosted in, such as on-premises or in a different Azure region, the OS must support the encryption functionality of SMB 3.0.

## Prerequisites for mounting an Azure file share with Linux and the cifs-utils package
* **Pick a Linux distribution that can have the cifs-utils package installed.**  
    The following Linux distributions are available for use in the Azure gallery:

    * Ubuntu Server 14.04+
    * RHEL 7+
    * CentOS 7+
    * Debian 8
    * openSUSE 13.2+
    * SUSE Linux Enterprise Server 12

* <a id="install-cifs-utils"></a>**The cifs-utils package is installed.**  
    The cifs-utils package can be installed using the package manager on the Linux distribution of your choice. 

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

* <a id="smb-client-reqs"></a>**Understand SMB client requirements.**  
    Azure Files can be mounted either via SMB 2.1 and SMB 3.0. To protect your data, Azure Files requires clients mounting outside of the Azure region where the Azure file share is hosted to be using SMB 3.0 with encryption. Additionally, if *secure transfer required* is enabled for a storage account, all connections (even connections originating within the same Azure region as the Azure file share) will require SMB 3.0 with encryption. 
    
    SMB 3.0 encryption support was introduced in Linux kernel version 4.11 and has been backported to older kernel versions for popular Linux distributions. At the time of this document's publication, the following distributions from the Azure gallery support this feature:

    - Ubuntu Server 16.04+
    - openSUSE 42.3+
    - SUSE Linux Enterprise Server 12 SP3+
    
    If your Linux distribution is not listed here, you can check to see the Linux kernel version with the following command:

    ```
    uname -r
    ```

* **Decide on the directory/file permissions of the mounted share**: In the examples below, we use 0777, to give read, write, and execute permissions to all users. You can replace it with other [chmod permissions](https://en.wikipedia.org/wiki/Chmod) as desired. 

* **Storage account name**: To mount an Azure file share, you will need the name of the storage account.

* **Storage account key**: To mount an Azure file share, you will need the primary (or secondary) storage key. SAS keys are not currently supported for mounting.

* **Ensure port 445 is open**: SMB communicates over TCP port 445 - check to see if your firewall is not blocking TCP ports 445 from client machine.

## Mount the Azure file share on-demand with `mount`
1. **[Install the cifs-utils package for your Linux distribution](#install-cifs-utils)**.

2. **Create a folder for the mount point**: This can be done anywhere on the file system.

    ```
    mkdir mymountpoint
    ```

3. **Use the mount command to mount the Azure file share**: Remember to replace `<storage-account-name>`, `<share-name>`, `<smb-version>`, and `<storage-account-key>` with the proper information. If your Linux distribution uses Linux kernel 4.11 or higher, we always recommend setting `<smb-version>` to `3.0`. For Linux distributions not using Linux kernel 4.11+ or not listed explicitly in [Understand SMB client requirements](#smb-client-reqs) we recommend setting `<smb-version>` to `2.1`. 

    ```
    sudo mount -t cifs //<storage-account-name>.file.core.windows.net/<share-name> ./mymountpoint -o vers=<smb-version>,username=<storage-account-name>,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino
    ```

> [!Note]  
> When you are done using the Azure file share, you may use `sudo umount ./mymountpoint` to unmount the share.

## Create a persistent mount point for the Azure file share with `/etc/fstab`
1. **[Install the cifs-utils package for your Linux distribution](#install-cifs-utils)**.

2. **Create a folder for the mount point**: This can be done anywhere on the file system, but you need to note the absolute path of the folder. The following example creates a folder under root.

    ```
    sudo mkdir /mymountpoint
    ```

3. **Use the following command to append the following line to `/etc/fstab`**: Remember to replace `<storage-account-name>`, `<share-name>`, `<smb-version>`, and `<storage-account-key>` with the proper information. If your Linux distribution uses Linux kernel 4.11 or higher, we always recommend setting `<smb-version>` to `3.0`. For Linux distributions not using Linux kernel 4.11+ or not listed explicitly in [Understand SMB client requirements](#smb-client-reqs) we recommend setting `<smb-version>` to `2.1`. 

    ```
    sudo bash -c 'echo "//<storage-account-name>.file.core.windows.net/<share-name> /mymountpoint cifs vers=<smb-version>,username=<storage-account-name>,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino" >> /etc/fstab'
    ```

> [!Note]  
> You can use `sudo mount -a` to mount the Azure file share after editing `/etc/fstab` instead of rebooting.

## Feedback
Linux users, we want to hear from you!

The Azure Files for Linux users' group provides a forum for you to share feedback as you evaluate and adopt File storage on Linux. Email [Azure Files Linux Users](mailto:azurefileslinuxusers@microsoft.com) to join the users' group.

## Next steps
See these links for more information about Azure Files.
* [File Service REST API reference](http://msdn.microsoft.com/library/azure/dn167006.aspx)
* [How to use AzCopy with Microsoft Azure storage](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)
* [Using the Azure CLI with Azure storage](../common/storage-azure-cli.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json#create-and-manage-file-shares)
* [FAQ](../storage-files-faq.md)
* [Troubleshooting](storage-troubleshoot-linux-file-connection-problems.md)