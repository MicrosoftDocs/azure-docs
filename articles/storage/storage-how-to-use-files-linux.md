<properties
	pageTitle="How to use Azure Files with Linux | Microsoft Azure"
        description="Create an Azure file share in the cloud with this step-by-step tutorial. Manage your file share content, and mount a file share from an Azure virtual machine (VM) running Linux or an on-premises application that supports SMB 3.0."
        services="storage"
        documentationCenter="na"
        authors="mine-msft"
        manager="aungoo"
        editor="tysonn" />

<tags ms.service="storage"
      ms.workload="storage"
      ms.tgt_pltfrm="na"
      ms.devlang="na"
      ms.topic="article"
      ms.date="02/29/2016"
      ms.author="minet" />


# How to use Azure File Storage with Linux

## Overview

Azure File storage offers file shares in the cloud using the standard SMB protocol. With Azure Files, you can migrate enterprise applications that rely on file servers to Azure. Applications running in Azure can easily mount file shares from Azure virtual machines running Linux. And with the latest release of File storage, you can also mount a file share from an on-premises application that supports SMB 3.0.

You can create Azure file shares using the [Azure Portal](https://portal.azure.com), the Azure Storage PowerShell cmdlets, the Azure Storage client libraries, or the Azure Storage REST API. Additionally, because file shares are SMB shares, you can access them via standard file system APIs.

File storage is built on the same technology as Blob, Table, and Queue storage, so File storage offers the availability, durability, scalability, and geo-redundancy that is built into the Azure storage platform. For details about File storage performance targets and limits, see [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md).

File storage is now generally available and supports both SMB 2.1 and SMB 3.0. For additional details on File storage, see the [File service REST API](https://msdn.microsoft.com/library/azure/dn167006.aspx).

>[AZURE.NOTE] The Linux SMB client doesn’t yet support encryption, so mounting a file share from Linux still requires that the client be in the same Azure region as the file share. However, encryption support for Linux is on the roadmap of Linux developers responsible for SMB functionality. Linux distributions that support encryption in the future will be able to mount an Azure File share from anywhere as well.

## Video: Using Azure File storage with Linux

Here's a video that demonstrates how to create and use Azure File shares on Linux.

> [AZURE.VIDEO azure-file-storage-with-linux]

## Choose a Linux distribution to use ##

When creating a Linux virtual machine in Azure, you can specify a Linux image which supports SMB 2.1 or higher from the Azure image gallery. Below is a list of recommended Linux images:

- Ubuntu Server 14.04+
- RHEL 7+
- CentOS 7+
- Debian 8
- openSUSE 13.2+
- SUSE Linux Enterprise Server 12
- SUSE Linux Enterprise Server 12 (Premium Image)

## Mount the file share ##

To mount the file share from a virtual machine running Linux, you may need to install an SMB/CIFS client if the distribution you are using doesn't have a built-in client. This is the command from Ubuntu to install one choice cifs-utils:

    sudo apt-get install cifs-utils

Next, you need to make a mount point (mkdir mymountpoint), and then issue the mount command that is similar to this:

     sudo mount -t cifs //myaccountname.file.core.windows.net/mysharename ./mymountpoint -o vers=3.0,username=myaccountname,password=StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777

You can also add settings in your /etc/fstab to mount the share.

Note that 0777 here represent a directory/file permission code that gives execution/read/write permissions to all users. You can replace it with other file permission code following Linux file permission document.

Also to keep a file share mounted after reboot, you can add a setting like below in your /etc/fstab:

    //myaccountname.file.core.windows.net/mysharename /mymountpoint cifs vers=3.0,username= myaccountname,password= StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777

For example, if you created a Azure VM using Linux image Ubuntu Server 15.04 (which is available from the Azure image gallery), you can mount the file as below:

    azureuser@azureconubuntu:~$ sudo apt-get install cifs-utils
    azureuser@azureconubuntu:~$ sudo mkdir /mnt/mountpoint
    azureuser@azureconubuntu:~$ sudo mount -t cifs //myaccountname.file.core.windows.net/mysharename /mnt/mountpoint -o vers=3.0,user=myaccountname,password=StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777
    azureuser@azureconubuntu:~$ df -h /mnt/mountpoint
    Filesystem  Size  Used Avail Use% Mounted on
    //myaccountname.file.core.windows.net/mysharename  5.0T   64K  5.0T   1% /mnt/mountpoint

If you use CentOS 7.1, you can mount the file as below:

    [azureuser@AzureconCent ~]$ sudo yum install samba-client samba-common cifs-utils
    [azureuser@AzureconCent ~]$ sudo mount -t cifs //myaccountname.file.core.windows.net/mysharename /mnt/mountpoint -o vers=3.0,user=myaccountname,password=StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777
    [azureuser@AzureconCent ~]$ df -h /mnt/mountpoint
    Filesystem  Size  Used Avail Use% Mounted on
    //myaccountname.file.core.windows.net/mysharename  5.0T   64K  5.0T   1% /mnt/mountpoint

If you use Open SUSE 13.2, you can mount the file as below:

    azureuser@AzureconSuse:~> sudo zypper install samba*  
    azureuser@AzureconSuse:~> sudo mkdir /mnt/mountpoint
    azureuser@AzureconSuse:~> sudo mount -t cifs //myaccountname.file.core.windows.net/mysharename /mnt/mountpoint -o vers=3.0,user=myaccountname,password=StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777
    azureuser@AzureconSuse:~> df -h /mnt/mountpoint
    Filesystem  Size  Used Avail Use% Mounted on
    //myaccountname.file.core.windows.net/mysharename  5.0T   64K  5.0T   1% /mnt/mountpoint

## Manage the file share ##

The [Azure Portal](https://portal.azure.com) provides a user interface for managing Azure File Storage. You can perform the following actions from your web browser:

- Upload and download files to and from your file share.
- Monitor the actual usage of each file share.
- Adjust the file share size quota.
- Copy the `net use` command to use to mount your file share from a Windows client.

You can also use the Azure Cross-Platform Command-Line Interface (Azure CLI) from Linux to manage the file share. Azure CLI provides a set of open source, cross-platform commands for you to work with Azure Storage, including File storage. It provides much of the same functionality found in the Azure Portal as well as rich data access functionality. For examples, see [Using the Azure CLI with Azure Storage](storage-azure-cli.md).

## Develop with File storage ##

As a developer, you can build an application with File storage by using the [Azure Storage Client Library for Java](https://github.com/azure/azure-storage-java). For code examples, see [How to use File storage from Java](storage-java-how-to-use-file-storage.md).

You can also use the [Azure Storage Client Library for Node.js](https://github.com/Azure/azure-storage-node) to develop against File storage.

## Feedback and more information ##

Linux users, we want to hear from you!

The Azure File storage for Linux users' group provides a forum for you to share feedback as you evaluate and adopt File storage on Linux. Email [Azure File Storage Linux Users](mailto:azurefileslinuxusers@microsoft.com) to join the users' group.

## Next steps

See these links for more information about Azure File storage.

### Conceptual articles and videos

- [Azure Files Storage: a frictionless cloud SMB file system for Windows and Linux](https://azure.microsoft.com/documentation/videos/azurecon-2015-azure-files-storage-a-frictionless-cloud-smb-file-system-for-windows-and-linux/)
- [Get started with Azure File storage on Windows](storage-dotnet-how-to-use-files.md)

### Tooling support for File storage

- [Transfer data with the AzCopy Command-Line Utility](storage-use-azcopy.md)
- [Create and manage file shares](storage-azure-cli.md#create-and-manage-file-shares) using the Azure CLI

### Reference

- [File Service REST API reference](http://msdn.microsoft.com/library/azure/dn167006.aspx)

### Blog posts

- [Azure File storage is now generally available](https://azure.microsoft.com/blog/azure-file-storage-now-generally-available/)
- [Inside Azure File Storage](https://azure.microsoft.com/blog/inside-azure-file-storage/)
- [Introducing Microsoft Azure File Service](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/12/introducing-microsoft-azure-file-service.aspx)
- [Persisting connections to Microsoft Azure Files](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/27/persisting-connections-to-microsoft-azure-files.aspx)
